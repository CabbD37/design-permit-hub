/*
  # Secure admin role management

  ## Summary
  Fixes the admin role so it is stored in app_metadata (server-controlled) instead of
  user_metadata (user-editable). Also splits the existing "ALL" RLS policies into
  separate SELECT/INSERT/UPDATE/DELETE policies for clarity, and creates a helper
  function that only the service role can call to promote a user to admin.

  ## Changes

  ### New function: set_admin_role(user_id, role)
  - Only callable by service_role (cannot be invoked by normal users)
  - Sets app_metadata.role for the given user
  - Use from the Supabase Dashboard SQL editor to grant admin access

  ### RLS policy cleanup on pages, page_sections, page_section_items
  - Removes the catch-all FOR ALL policies that used user_metadata
  - Replaces with 4 explicit policies (SELECT/INSERT/UPDATE/DELETE) per table
  - All admin checks use (auth.jwt() ->> 'role') which maps to app_metadata in Supabase

  ## How to grant admin access to a user
  After creating your account, run this in the Supabase Dashboard SQL editor:
    SELECT set_admin_role('<your-user-uuid>', 'admin');
*/

-- Helper function: promote a user to admin (service role only)
CREATE OR REPLACE FUNCTION set_admin_role(target_user_id uuid, new_role text DEFAULT 'admin')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF current_setting('role') != 'service_role' THEN
    RAISE EXCEPTION 'Only service_role can call set_admin_role';
  END IF;
  UPDATE auth.users
    SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', new_role)
    WHERE id = target_user_id;
END;
$$;

-- Revoke public execute so only service_role can call it
REVOKE EXECUTE ON FUNCTION set_admin_role(uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION set_admin_role(uuid, text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION set_admin_role(uuid, text) FROM anon;

-- ── pages ────────────────────────────────────────────────────────────────────
-- Drop the old catch-all policy
DROP POLICY IF EXISTS "Admin can manage pages" ON pages;

CREATE POLICY "Admin can select pages"
  ON pages FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin can insert pages"
  ON pages FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin can update pages"
  ON pages FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin can delete pages"
  ON pages FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

-- ── page_sections ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin can manage sections" ON page_sections;

CREATE POLICY "Admin can select sections"
  ON page_sections FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin can insert sections"
  ON page_sections FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin can update sections"
  ON page_sections FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin can delete sections"
  ON page_sections FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

-- ── page_section_items ────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin can manage items" ON page_section_items;

CREATE POLICY "Admin can select items"
  ON page_section_items FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin can insert items"
  ON page_section_items FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin can update items"
  ON page_section_items FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin can delete items"
  ON page_section_items FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');
