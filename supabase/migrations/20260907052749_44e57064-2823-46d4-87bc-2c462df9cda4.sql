
CREATE TYPE public.product_category AS ENUM ('running_shoes','earbuds');
CREATE TYPE public.session_stage AS ENUM ('collecting','matching','negotiating','ordered');
CREATE TYPE public.order_status AS ENUM ('placed','confirmed','cancelled');
CREATE TYPE public.deal_status AS ENUM ('REQUESTED','SELLER_VIEWED','NEGOTIATING','COUNTER_OFFER','OFFER_SENT','ACCEPTED','REJECTED','EXPIRED','CANCELLED','ORDERED');
CREATE TYPE public.deal_offer_status AS ENUM ('pending','accepted','rejected','expired','superseded');
CREATE TYPE public.app_role AS ENUM ('admin','seller','buyer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE TABLE public.seller_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.seller_accounts TO anon, authenticated;
GRANT ALL ON public.seller_accounts TO service_role;
ALTER TABLE public.seller_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seller accounts are public" ON public.seller_accounts FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.can_manage_seller(_seller_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin')
     OR (public.has_role(auth.uid(), 'seller')
         AND EXISTS (SELECT 1 FROM public.seller_accounts s
                     WHERE s.id = _seller_id
                       AND (s.owner_user_id IS NULL OR s.owner_user_id = auth.uid())));
$$;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.seller_accounts(id) ON DELETE CASCADE,
  name text NOT NULL,
  category public.product_category NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price > 0),
  tags text[] NOT NULL DEFAULT '{}',
  image_url text NOT NULL,
  stock_count integer NOT NULL DEFAULT 0 CHECK (stock_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_category_idx ON public.products(category);
CREATE INDEX products_seller_idx ON public.products(seller_id);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT UPDATE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products readable by everyone" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "sellers update own products" ON public.products FOR UPDATE TO authenticated
  USING (public.can_manage_seller(seller_id)) WITH CHECK (public.can_manage_seller(seller_id));

CREATE TABLE public.live_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  discount_pct numeric(5,2) NOT NULL CHECK (discount_pct > 0 AND discount_pct <= 40),
  expires_at timestamptz NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX live_offers_product_idx ON public.live_offers(product_id);
GRANT SELECT ON public.live_offers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.live_offers TO authenticated;
GRANT ALL ON public.live_offers TO service_role;
ALTER TABLE public.live_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "offers readable by everyone" ON public.live_offers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "sellers manage own offers" ON public.live_offers FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND public.can_manage_seller(p.seller_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND public.can_manage_seller(p.seller_id)));

CREATE TABLE public.deal_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL UNIQUE,
  max_discount_pct numeric(5,2) NOT NULL,
  min_items integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.deal_rules TO service_role;
ALTER TABLE public.deal_rules ENABLE ROW LEVEL SECURITY;
INSERT INTO public.deal_rules (scope, max_discount_pct, min_items) VALUES ('single', 15, 1), ('bulk', 20, 2);

CREATE TABLE public.negotiation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category public.product_category,
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  preferences text[] NOT NULL DEFAULT '{}',
  stage public.session_stage NOT NULL DEFAULT 'collecting',
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  final_price numeric(10,2),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX negotiation_sessions_user_idx ON public.negotiation_sessions(user_id);
GRANT SELECT, INSERT, UPDATE ON public.negotiation_sessions TO authenticated;
GRANT ALL ON public.negotiation_sessions TO service_role;
ALTER TABLE public.negotiation_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sessions" ON public.negotiation_sessions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "create own sessions" ON public.negotiation_sessions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update own sessions" ON public.negotiation_sessions FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.conversation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.negotiation_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','agent','system')),
  agent text,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX conversation_messages_session_idx ON public.conversation_messages(session_id, created_at);
GRANT SELECT, INSERT ON public.conversation_messages TO authenticated;
GRANT ALL ON public.conversation_messages TO service_role;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages" ON public.conversation_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.negotiation_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE POLICY "insert own messages" ON public.conversation_messages FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.negotiation_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));

CREATE TABLE public.carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.carts TO authenticated;
GRANT ALL ON public.carts TO service_role;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own cart" ON public.carts FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.seller_accounts(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cart_id, product_id)
);
CREATE INDEX cart_items_cart_idx ON public.cart_items(cart_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own cart items" ON public.cart_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_id AND c.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_id AND c.user_id = auth.uid()));

CREATE TABLE public.seller_deal_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL REFERENCES public.seller_accounts(id) ON DELETE CASCADE,
  cart_id uuid REFERENCES public.carts(id) ON DELETE SET NULL,
  status public.deal_status NOT NULL DEFAULT 'REQUESTED',
  original_total numeric(12,2) NOT NULL,
  negotiated_total numeric(12,2),
  discount_pct numeric(5,2),
  target_total numeric(12,2),
  buyer_message text,
  items jsonb NOT NULL DEFAULT '[]',
  expires_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sds_buyer_idx ON public.seller_deal_sessions(buyer_id);
CREATE INDEX sds_seller_idx ON public.seller_deal_sessions(seller_id);
GRANT SELECT, INSERT, UPDATE ON public.seller_deal_sessions TO authenticated;
GRANT ALL ON public.seller_deal_sessions TO service_role;
ALTER TABLE public.seller_deal_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deal sessions visible to participants" ON public.seller_deal_sessions FOR SELECT TO authenticated
  USING (buyer_id = auth.uid() OR public.can_manage_seller(seller_id));
CREATE POLICY "buyer creates deal session" ON public.seller_deal_sessions FOR INSERT TO authenticated
  WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "participants update deal session" ON public.seller_deal_sessions FOR UPDATE TO authenticated
  USING (buyer_id = auth.uid() OR public.can_manage_seller(seller_id))
  WITH CHECK (buyer_id = auth.uid() OR public.can_manage_seller(seller_id));

CREATE TABLE public.seller_deal_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.seller_deal_sessions(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  sender_role text NOT NULL CHECK (sender_role IN ('buyer','seller','system')),
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sdm_session_idx ON public.seller_deal_messages(session_id, created_at);
GRANT SELECT, INSERT ON public.seller_deal_messages TO authenticated;
GRANT ALL ON public.seller_deal_messages TO service_role;
ALTER TABLE public.seller_deal_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deal messages visible to participants" ON public.seller_deal_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.seller_deal_sessions s WHERE s.id = session_id
                 AND (s.buyer_id = auth.uid() OR public.can_manage_seller(s.seller_id))));
CREATE POLICY "participants send deal messages" ON public.seller_deal_messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.seller_deal_sessions s WHERE s.id = session_id
                 AND (s.buyer_id = auth.uid() OR public.can_manage_seller(s.seller_id))));

CREATE TABLE public.seller_deal_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.seller_deal_sessions(id) ON DELETE CASCADE,
  offered_by text NOT NULL CHECK (offered_by IN ('buyer','seller')),
  offered_by_user_id uuid NOT NULL,
  discount_pct numeric(5,2) NOT NULL,
  total_price numeric(12,2) NOT NULL,
  status public.deal_offer_status NOT NULL DEFAULT 'pending',
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sdo_session_idx ON public.seller_deal_offers(session_id, created_at);
GRANT SELECT ON public.seller_deal_offers TO authenticated;
GRANT ALL ON public.seller_deal_offers TO service_role;
ALTER TABLE public.seller_deal_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deal offers visible to participants" ON public.seller_deal_offers FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.seller_deal_sessions s WHERE s.id = session_id
                 AND (s.buyer_id = auth.uid() OR public.can_manage_seller(s.seller_id))));

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL REFERENCES public.products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  negotiated_price numeric(10,2) NOT NULL,
  delivery_address text NOT NULL,
  deal_session_id uuid REFERENCES public.seller_deal_sessions(id) ON DELETE SET NULL,
  status public.order_status NOT NULL DEFAULT 'placed',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX orders_user_idx ON public.orders(user_id, created_at DESC);
GRANT SELECT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own orders" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "sellers see orders for own products" ON public.orders FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND public.can_manage_seller(p.seller_id)));

CREATE OR REPLACE FUNCTION public.effective_unit_price(_product_id uuid)
RETURNS numeric LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT round(p.price * (1 - COALESCE((
      SELECT max(o.discount_pct) FROM public.live_offers o
      WHERE o.product_id = p.id AND o.active AND o.expires_at > now()), 0) / 100), 2)
  FROM public.products p WHERE p.id = _product_id;
$$;

CREATE OR REPLACE FUNCTION public.validate_single_price(_product_id uuid, _requested numeric)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE list_price numeric; floor_price numeric; max_pct numeric; approved numeric; effective numeric;
BEGIN
  SELECT price INTO list_price FROM public.products WHERE id = _product_id;
  IF list_price IS NULL THEN RAISE EXCEPTION 'product_not_found'; END IF;
  SELECT max_discount_pct INTO max_pct FROM public.deal_rules WHERE scope = 'single';
  floor_price := round(list_price * (1 - max_pct / 100), 2);
  effective := public.effective_unit_price(_product_id);
  approved := greatest(floor_price, least(COALESCE(_requested, effective), effective));
  RETURN jsonb_build_object(
    'list_price', list_price,
    'effective_price', effective,
    'approved_price', approved,
    'at_limit', approved <= floor_price + 0.001,
    'discount_pct', round((list_price - approved) / list_price * 100, 2)
  );
END; $$;

CREATE OR REPLACE FUNCTION public.validate_bulk_total(_session_id uuid, _requested_total numeric)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE sess public.seller_deal_sessions; max_pct numeric; needed integer; total_items integer; original numeric; floor_total numeric; approved numeric;
BEGIN
  SELECT * INTO sess FROM public.seller_deal_sessions WHERE id = _session_id;
  IF sess.id IS NULL THEN RAISE EXCEPTION 'session_not_found'; END IF;
  SELECT r.max_discount_pct, r.min_items INTO max_pct, needed FROM public.deal_rules r WHERE r.scope = 'bulk';
  SELECT COALESCE(sum((item->>'quantity')::int), 0) INTO total_items FROM jsonb_array_elements(sess.items) item;
  IF total_items < needed THEN RAISE EXCEPTION 'bulk_minimum_not_met'; END IF;
  original := sess.original_total;
  floor_total := round(original * (1 - max_pct / 100), 2);
  approved := greatest(floor_total, least(COALESCE(_requested_total, original), original));
  RETURN jsonb_build_object(
    'original_total', original,
    'approved_total', approved,
    'at_limit', approved <= floor_total + 0.001,
    'discount_pct', round((original - approved) / original * 100, 2),
    'total_items', total_items
  );
END; $$;

CREATE OR REPLACE FUNCTION public.place_single_order(_product_id uuid, _quantity integer, _negotiated_price numeric, _address text)
RETURNS public.orders LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); verdict jsonb; approved numeric; new_order public.orders; remaining integer;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF _quantity IS NULL OR _quantity < 1 THEN RAISE EXCEPTION 'invalid_quantity'; END IF;
  IF _address IS NULL OR length(btrim(_address)) < 10 THEN RAISE EXCEPTION 'invalid_address'; END IF;
  verdict := public.validate_single_price(_product_id, _negotiated_price);
  approved := (verdict->>'approved_price')::numeric;
  UPDATE public.products SET stock_count = stock_count - _quantity
    WHERE id = _product_id AND stock_count >= _quantity
    RETURNING stock_count INTO remaining;
  IF remaining IS NULL THEN RAISE EXCEPTION 'insufficient_stock'; END IF;
  INSERT INTO public.orders (user_id, product_id, quantity, negotiated_price, delivery_address, status)
    VALUES (uid, _product_id, _quantity, approved, btrim(_address), 'confirmed')
    RETURNING * INTO new_order;
  RETURN new_order;
END; $$;

CREATE OR REPLACE FUNCTION public.place_deal_order(_session_id uuid, _address text)
RETURNS SETOF public.orders LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); sess public.seller_deal_sessions; item jsonb; ratio numeric; remaining integer; unit numeric;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF _address IS NULL OR length(btrim(_address)) < 10 THEN RAISE EXCEPTION 'invalid_address'; END IF;
  SELECT * INTO sess FROM public.seller_deal_sessions WHERE id = _session_id FOR UPDATE;
  IF sess.id IS NULL OR sess.buyer_id <> uid THEN RAISE EXCEPTION 'deal_not_found'; END IF;
  IF sess.status <> 'ACCEPTED' THEN RAISE EXCEPTION 'deal_not_accepted'; END IF;
  IF sess.negotiated_total IS NULL THEN RAISE EXCEPTION 'deal_not_priced'; END IF;
  ratio := sess.negotiated_total / sess.original_total;
  FOR item IN SELECT * FROM jsonb_array_elements(sess.items) LOOP
    UPDATE public.products SET stock_count = stock_count - (item->>'quantity')::int
      WHERE id = (item->>'product_id')::uuid AND stock_count >= (item->>'quantity')::int
      RETURNING stock_count INTO remaining;
    IF remaining IS NULL THEN RAISE EXCEPTION 'insufficient_stock'; END IF;
    unit := round((item->>'unit_price')::numeric * ratio, 2);
    RETURN QUERY WITH ins AS (
      INSERT INTO public.orders (user_id, product_id, quantity, negotiated_price, delivery_address, deal_session_id, status)
      VALUES (uid, (item->>'product_id')::uuid, (item->>'quantity')::int, unit, btrim(_address), sess.id, 'confirmed')
      RETURNING *
    ) SELECT * FROM ins;
  END LOOP;
  UPDATE public.seller_deal_sessions SET status = 'ORDERED', updated_at = now() WHERE id = sess.id;
  DELETE FROM public.cart_items ci USING public.carts c
    WHERE ci.cart_id = c.id AND c.user_id = uid AND ci.seller_id = sess.seller_id;
END; $$;

REVOKE ALL ON FUNCTION public.validate_single_price(uuid, numeric) FROM public;
REVOKE ALL ON FUNCTION public.validate_bulk_total(uuid, numeric) FROM public;
GRANT EXECUTE ON FUNCTION public.validate_single_price(uuid, numeric) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.validate_bulk_total(uuid, numeric) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.place_single_order(uuid, integer, numeric, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.place_deal_order(uuid, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.effective_unit_price(uuid) TO anon, authenticated, service_role;

ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.live_offers REPLICA IDENTITY FULL;
ALTER TABLE public.seller_deal_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.seller_deal_messages REPLICA IDENTITY FULL;
ALTER TABLE public.seller_deal_offers REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_offers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.seller_deal_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.seller_deal_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.seller_deal_offers;

INSERT INTO public.seller_accounts (id, name) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Aether Athletics'),
  ('22222222-2222-4222-8222-222222222222', 'Sonorae Audio');

INSERT INTO public.products (id, seller_id, name, category, price, tags, image_url, stock_count) VALUES
  ('a1000000-0000-4000-8000-000000000001','11111111-1111-4111-8111-111111111111','Aether Stride Pro','running_shoes',4999,'{comfort,lightweight,"daily trainer"}','/images/products/shoe-stride-pro.jpg',24),
  ('a1000000-0000-4000-8000-000000000002','11111111-1111-4111-8111-111111111111','Aether Trail Forge','running_shoes',5499,'{durability,grip,trail}','/images/products/shoe-trail-forge.jpg',16),
  ('a1000000-0000-4000-8000-000000000003','11111111-1111-4111-8111-111111111111','Aether Cloudline 2','running_shoes',3799,'{comfort,cushioning,lightweight}','/images/products/shoe-cloudline.jpg',31),
  ('a1000000-0000-4000-8000-000000000004','11111111-1111-4111-8111-111111111111','Aether Tempo Racer','running_shoes',6299,'{lightweight,speed,"race day"}','/images/products/shoe-tempo-racer.jpg',9),
  ('b2000000-0000-4000-8000-000000000001','22222222-2222-4222-8222-222222222222','Sonorae Pulse Air','earbuds',2999,'{"battery life","low latency",microphone}','/images/products/earbuds-pulse-air.jpg',40),
  ('b2000000-0000-4000-8000-000000000002','22222222-2222-4222-8222-222222222222','Sonorae Quiet Core','earbuds',4499,'{"noise cancelling","battery life",comfort}','/images/products/earbuds-quiet-core.jpg',22),
  ('b2000000-0000-4000-8000-000000000003','22222222-2222-4222-8222-222222222222','Sonorae Vent Lite','earbuds',1899,'{lightweight,"battery life",durability}','/images/products/earbuds-vent-lite.jpg',55),
  ('b2000000-0000-4000-8000-000000000004','22222222-2222-4222-8222-222222222222','Sonorae Studio Link','earbuds',5299,'{microphone,"low latency",studio}','/images/products/earbuds-studio-link.jpg',13);

INSERT INTO public.live_offers (product_id, discount_pct, expires_at, active) VALUES
  ('a1000000-0000-4000-8000-000000000001', 8, now() + interval '6 hours', true),
  ('b2000000-0000-4000-8000-000000000001', 10, now() + interval '3 hours', true),
  ('b2000000-0000-4000-8000-000000000002', 6, now() + interval '18 hours', true);
