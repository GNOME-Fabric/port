DROP POLICY IF EXISTS session_records_public_read ON public.session_records;
REVOKE SELECT ON public.session_records FROM anon, authenticated;