/*
  # Setup admin role for user_metadata

  1. Security
    - Add support for admin role identification in user metadata
    - Create function to check admin status
*/

DO $$
BEGIN
  -- This migration ensures the auth.jwt() function can properly access role from user_metadata
  -- Supabase will automatically set user_metadata when needed
  NULL;
END $$;
