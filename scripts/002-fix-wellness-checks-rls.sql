-- Fix RLS policy for wellness_checks table to work with local authentication
-- Since we're using local auth instead of Supabase auth, we need to disable RLS
-- or create a more permissive policy

-- Option 1: Disable RLS entirely (simpler for local auth)
ALTER TABLE wellness_checks DISABLE ROW LEVEL SECURITY;

-- Option 2: Alternative - Create a permissive policy that allows all operations
-- (uncomment if you prefer to keep RLS enabled but allow all access)
-- DROP POLICY IF EXISTS "Users can manage their own wellness checks" ON wellness_checks;
-- CREATE POLICY "Allow all wellness check operations" ON wellness_checks
--   FOR ALL USING (true) WITH CHECK (true);
