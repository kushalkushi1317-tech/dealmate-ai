import type { ZodType } from "zod";

/**
 * Provider-isolated LLM access. Everything provider specific lives in this
 * file so the model vendor can be switched without touching agent logic.
 * Runs server-side only — no key ever reaches the browser.
 */
export type LlmProvider = "lovable" | "openai" | "anthropic";

interface ProviderConfig {
  endpoint: string;
  model: string;
  apiKey: string;
}

function resolveProvider(): { provider: LlmProvider; config: ProviderConfig } {
  const openAiKey = process.env["OPENAI_API_KEY"];
  const anthropicKey = process.env["ANTHROPIC_API_KEY"];
  const lovableKey = process.env["LOVABLE_API_KEY"];

  if (openAiKey) {
    return {
      provider: "openai",
      config: {
        endpoint: "https://api.openai.com/v1/chat/completions",
        model: process.env["OPENAI_MODEL"] ?? "gpt-4.1-mini",
        apiKey: openAiKey,
      },
    };
  }
  if (anthropicKey) {
    return {
      provider: "anthropic",
      config: {
        endpoint: "https://api.anthropic.com/v1/messages",
        model: process.env["ANTHROPIC_MODEL"] ?? "claude-sonnet-4-20250514",
        apiKey: anthropicKey,
      },
    };
  }
  if (!lovableKey) throw new Error("llm_not_configured");
  return {
    provider: "lovable",
    config: {
      endpoint: "https://ai.gateway.lovable.dev/v1/chat/completions",
      model: "google/gemini-3.7-flash",
      apiKey: lovableKey,
    },
  };
}

export class LlmError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

async function callProvider(system: string, user: string): Promise<string> {
  const { provider, config } = resolveProvider();

  if (provider === "anthropic") {
    const res = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 700,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) throw new LlmError(await res.text(), res.status);
    const json = (await res.json()) as { content?: Array<{ text?: string }> };
    return json.content?.[0]?.text ?? "";
  }

  const res = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new LlmError(await res.text(), res.status);
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return json.choices?.[0]?.message?.content ?? "";
}

function extractJson(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) throw new LlmError("no_json_in_response");
  return JSON.parse(trimmed.slice(start, end + 1)) as unknown;
}

/**
 * Ask the model for strict JSON, validate it with Zod, retry malformed output
 * once, then fail loudly. Raw model output is never trusted downstream.
 */
export async function generateJson<T>(args: {
  system: string;
  user: string;
  schema: ZodType<T>;
}): Promise<T> {
  const strictSystem = `${args.system}\n\nRespond with a single JSON object and nothing else. No prose, no markdown fences.`;
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const raw = await callProvider(
        strictSystem,
        attempt === 0
          ? args.user
          : `${args.user}\n\nYour previous answer was not valid JSON matching the schema. Return valid JSON only.`,
      );
      return args.schema.parse(extractJson(raw));
    } catch (error) {
      if (error instanceof LlmError && error.status && error.status !== 429 && error.status < 500) {
        throw error;
      }
      lastError = error;
    }
  }
  throw new LlmError(
    lastError instanceof Error ? `llm_validation_failed: ${lastError.message}` : "llm_validation_failed",
  );
}
