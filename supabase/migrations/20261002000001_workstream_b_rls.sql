-- Workstream B: Additional RLS Policies for Mitra Self-Service Registration and Schedules Management
-- Complements 20260928000003_rls_policies.sql without altering existing policies.

-- 1. Profiles Table: Allow authenticated users to insert their own profile row upon registration
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile"
        ON profiles FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- 2. Trip Schedules: Explicit INSERT policy with WITH CHECK for tour package owners
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'trip_schedules' 
        AND policyname = 'Agents can insert trip schedules'
    ) THEN
        CREATE POLICY "Agents can insert trip schedules"
        ON trip_schedules FOR INSERT TO authenticated
        WITH CHECK (
            package_id IN (
                SELECT p.id FROM tour_packages p
                JOIN travel_agents a ON p.agent_id = a.id
                WHERE a.owner_id = auth.uid()
            )
        );
    END IF;
END $$;
