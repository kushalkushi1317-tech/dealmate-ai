
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.can_manage_seller(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.effective_unit_price(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.validate_single_price(uuid, numeric) FROM anon;
REVOKE EXECUTE ON FUNCTION public.validate_bulk_total(uuid, numeric) FROM anon;
REVOKE EXECUTE ON FUNCTION public.place_single_order(uuid, integer, numeric, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.place_deal_order(uuid, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_manage_seller(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.effective_unit_price(uuid) TO authenticated, service_role;
CREATE POLICY "deal rules are server-only" ON public.deal_rules FOR SELECT TO service_role USING (true);
