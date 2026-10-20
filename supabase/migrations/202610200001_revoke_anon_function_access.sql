-- Supabase grants EXECUTE on new public functions to anon directly, so revoking from public was not enough.
-- is_site_owner() keeps its anon grant: the published-content read policy calls it for visitors.
revoke execute on function public.save_site_draft(jsonb, integer) from anon;
revoke execute on function public.publish_site_draft(integer) from anon;

-- Created by the project's automatic-RLS setting. It runs as an event trigger and is never called through the API.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;
