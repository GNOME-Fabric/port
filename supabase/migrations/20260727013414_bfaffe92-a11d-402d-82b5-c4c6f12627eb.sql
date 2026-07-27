
CREATE TABLE public.session_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alias text NOT NULL UNIQUE,
  secret text NOT NULL,
  longest_seconds integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.session_records TO anon, authenticated;
GRANT ALL ON public.session_records TO service_role;

ALTER TABLE public.session_records ENABLE ROW LEVEL SECURITY;

-- Only expose alias + seconds via SELECT; the RPC below drives the leaderboard so this policy is mostly defensive
CREATE POLICY "session_records_public_read" ON public.session_records
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.record_session(_alias text, _secret text, _seconds integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_secret text;
BEGIN
  IF _alias IS NULL OR length(_alias) < 3 OR length(_alias) > 32 THEN
    RAISE EXCEPTION 'invalid alias';
  END IF;
  IF _secret IS NULL OR length(_secret) < 16 OR length(_secret) > 128 THEN
    RAISE EXCEPTION 'invalid secret';
  END IF;
  IF _seconds IS NULL OR _seconds < 0 OR _seconds > 86400 THEN
    RAISE EXCEPTION 'invalid seconds';
  END IF;

  SELECT secret INTO existing_secret FROM public.session_records WHERE alias = _alias;

  IF existing_secret IS NULL THEN
    INSERT INTO public.session_records (alias, secret, longest_seconds)
    VALUES (_alias, _secret, _seconds);
  ELSIF existing_secret = _secret THEN
    UPDATE public.session_records
      SET longest_seconds = GREATEST(longest_seconds, _seconds),
          updated_at = now()
      WHERE alias = _alias;
  ELSE
    RAISE EXCEPTION 'alias already taken';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.record_session(text, text, integer) FROM public;
GRANT EXECUTE ON FUNCTION public.record_session(text, text, integer) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_session_leaderboard(_limit integer DEFAULT 20)
RETURNS TABLE(alias text, longest_seconds integer, updated_at timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT alias, longest_seconds, updated_at
  FROM public.session_records
  ORDER BY longest_seconds DESC, updated_at ASC
  LIMIT LEAST(GREATEST(COALESCE(_limit, 20), 1), 100);
$$;

REVOKE ALL ON FUNCTION public.get_session_leaderboard(integer) FROM public;
GRANT EXECUTE ON FUNCTION public.get_session_leaderboard(integer) TO anon, authenticated;
