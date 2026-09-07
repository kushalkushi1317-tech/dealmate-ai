export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          seller_id: string
          updated_at: string
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          seller_id: string
          updated_at?: string
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_messages: {
        Row: {
          agent: string | null
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          agent?: string | null
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          agent?: string | null
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "negotiation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_rules: {
        Row: {
          created_at: string
          id: string
          max_discount_pct: number
          min_items: number
          scope: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_discount_pct: number
          min_items?: number
          scope: string
        }
        Update: {
          created_at?: string
          id?: string
          max_discount_pct?: number
          min_items?: number
          scope?: string
        }
        Relationships: []
      }
      live_offers: {
        Row: {
          active: boolean
          created_at: string
          discount_pct: number
          expires_at: string
          id: string
          product_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          discount_pct: number
          expires_at: string
          id?: string
          product_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          discount_pct?: number
          expires_at?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      negotiation_sessions: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          category: Database["public"]["Enums"]["product_category"] | null
          created_at: string
          final_price: number | null
          id: string
          preferences: string[]
          product_id: string | null
          stage: Database["public"]["Enums"]["session_stage"]
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          category?: Database["public"]["Enums"]["product_category"] | null
          created_at?: string
          final_price?: number | null
          id?: string
          preferences?: string[]
          product_id?: string | null
          stage?: Database["public"]["Enums"]["session_stage"]
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          category?: Database["public"]["Enums"]["product_category"] | null
          created_at?: string
          final_price?: number | null
          id?: string
          preferences?: string[]
          product_id?: string | null
          stage?: Database["public"]["Enums"]["session_stage"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "negotiation_sessions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          deal_session_id: string | null
          delivery_address: string
          id: string
          negotiated_price: number
          product_id: string
          quantity: number
          status: Database["public"]["Enums"]["order_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          deal_session_id?: string | null
          delivery_address: string
          id?: string
          negotiated_price: number
          product_id: string
          quantity: number
          status?: Database["public"]["Enums"]["order_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          deal_session_id?: string | null
          delivery_address?: string
          id?: string
          negotiated_price?: number
          product_id?: string
          quantity?: number
          status?: Database["public"]["Enums"]["order_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_deal_session_id_fkey"
            columns: ["deal_session_id"]
            isOneToOne: false
            referencedRelation: "seller_deal_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          id: string
          image_url: string
          name: string
          price: number
          seller_id: string
          stock_count: number
          tags: string[]
        }
        Insert: {
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          id?: string
          image_url: string
          name: string
          price: number
          seller_id: string
          stock_count?: number
          tags?: string[]
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          price?: number
          seller_id?: string
          stock_count?: number
          tags?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_accounts: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_user_id?: string | null
        }
        Relationships: []
      }
      seller_deal_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_id: string
          sender_role: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_id: string
          sender_role: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
          sender_role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_deal_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "seller_deal_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_deal_offers: {
        Row: {
          created_at: string
          discount_pct: number
          expires_at: string | null
          id: string
          offered_by: string
          offered_by_user_id: string
          session_id: string
          status: Database["public"]["Enums"]["deal_offer_status"]
          total_price: number
        }
        Insert: {
          created_at?: string
          discount_pct: number
          expires_at?: string | null
          id?: string
          offered_by: string
          offered_by_user_id: string
          session_id: string
          status?: Database["public"]["Enums"]["deal_offer_status"]
          total_price: number
        }
        Update: {
          created_at?: string
          discount_pct?: number
          expires_at?: string | null
          id?: string
          offered_by?: string
          offered_by_user_id?: string
          session_id?: string
          status?: Database["public"]["Enums"]["deal_offer_status"]
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "seller_deal_offers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "seller_deal_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_deal_sessions: {
        Row: {
          accepted_at: string | null
          buyer_id: string
          buyer_message: string | null
          cart_id: string | null
          created_at: string
          discount_pct: number | null
          expires_at: string | null
          id: string
          items: Json
          negotiated_total: number | null
          original_total: number
          seller_id: string
          status: Database["public"]["Enums"]["deal_status"]
          target_total: number | null
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          buyer_id: string
          buyer_message?: string | null
          cart_id?: string | null
          created_at?: string
          discount_pct?: number | null
          expires_at?: string | null
          id?: string
          items?: Json
          negotiated_total?: number | null
          original_total: number
          seller_id: string
          status?: Database["public"]["Enums"]["deal_status"]
          target_total?: number | null
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          buyer_id?: string
          buyer_message?: string | null
          cart_id?: string | null
          created_at?: string
          discount_pct?: number | null
          expires_at?: string | null
          id?: string
          items?: Json
          negotiated_total?: number | null
          original_total?: number
          seller_id?: string
          status?: Database["public"]["Enums"]["deal_status"]
          target_total?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_deal_sessions_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_deal_sessions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_seller: { Args: { _seller_id: string }; Returns: boolean }
      effective_unit_price: { Args: { _product_id: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      place_deal_order: {
        Args: { _address: string; _session_id: string }
        Returns: {
          created_at: string
          deal_session_id: string | null
          delivery_address: string
          id: string
          negotiated_price: number
          product_id: string
          quantity: number
          status: Database["public"]["Enums"]["order_status"]
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      place_single_order: {
        Args: {
          _address: string
          _negotiated_price: number
          _product_id: string
          _quantity: number
        }
        Returns: {
          created_at: string
          deal_session_id: string | null
          delivery_address: string
          id: string
          negotiated_price: number
          product_id: string
          quantity: number
          status: Database["public"]["Enums"]["order_status"]
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      validate_bulk_total: {
        Args: { _requested_total: number; _session_id: string }
        Returns: Json
      }
      validate_single_price: {
        Args: { _product_id: string; _requested: number }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "seller" | "buyer"
      deal_offer_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "expired"
        | "superseded"
      deal_status:
        | "REQUESTED"
        | "SELLER_VIEWED"
        | "NEGOTIATING"
        | "COUNTER_OFFER"
        | "OFFER_SENT"
        | "ACCEPTED"
        | "REJECTED"
        | "EXPIRED"
        | "CANCELLED"
        | "ORDERED"
      order_status: "placed" | "confirmed" | "cancelled"
      product_category: "running_shoes" | "earbuds"
      session_stage: "collecting" | "matching" | "negotiating" | "ordered"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "seller", "buyer"],
      deal_offer_status: [
        "pending",
        "accepted",
        "rejected",
        "expired",
        "superseded",
      ],
      deal_status: [
        "REQUESTED",
        "SELLER_VIEWED",
        "NEGOTIATING",
        "COUNTER_OFFER",
        "OFFER_SENT",
        "ACCEPTED",
        "REJECTED",
        "EXPIRED",
        "CANCELLED",
        "ORDERED",
      ],
      order_status: ["placed", "confirmed", "cancelled"],
      product_category: ["running_shoes", "earbuds"],
      session_stage: ["collecting", "matching", "negotiating", "ordered"],
    },
  },
} as const
