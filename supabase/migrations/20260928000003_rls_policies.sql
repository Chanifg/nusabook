-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_payouts ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Public profiles can be read by authenticated users"
ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 2. Travel Agents
CREATE POLICY "Public can view active travel agents"
ON travel_agents FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Owners can manage their travel agent profile"
ON travel_agents FOR ALL TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- 3. Tour Packages
CREATE POLICY "Public can view published tour packages"
ON tour_packages FOR SELECT
USING (is_published = TRUE);

CREATE POLICY "Agents can manage their tour packages"
ON tour_packages FOR ALL TO authenticated
USING (
  agent_id IN (SELECT id FROM travel_agents WHERE owner_id = auth.uid())
)
WITH CHECK (
  agent_id IN (SELECT id FROM travel_agents WHERE owner_id = auth.uid())
);

-- 4. Trip Schedules
CREATE POLICY "Public can view open trip schedules"
ON trip_schedules FOR SELECT
USING (true);

CREATE POLICY "Agents can manage their trip schedules"
ON trip_schedules FOR ALL TO authenticated
USING (
  package_id IN (
    SELECT p.id FROM tour_packages p
    JOIN travel_agents a ON p.agent_id = a.id
    WHERE a.owner_id = auth.uid()
  )
);

-- 5. Bookings
CREATE POLICY "Agents can view bookings of their packages"
ON bookings FOR SELECT TO authenticated
USING (
  agent_id IN (SELECT id FROM travel_agents WHERE owner_id = auth.uid())
);

CREATE POLICY "Public guest booking insertion"
ON bookings FOR INSERT
WITH CHECK (true);

-- 6. Booking Passengers
CREATE POLICY "Agents can view passengers for their bookings"
ON booking_passengers FOR SELECT TO authenticated
USING (
  booking_id IN (
    SELECT b.id FROM bookings b
    JOIN travel_agents a ON b.agent_id = a.id
    WHERE a.owner_id = auth.uid()
  )
);

CREATE POLICY "Public guest passenger insertion"
ON booking_passengers FOR INSERT
WITH CHECK (true);

-- 7. Agent Payouts
CREATE POLICY "Agents can view their payouts"
ON agent_payouts FOR SELECT TO authenticated
USING (
  agent_id IN (SELECT id FROM travel_agents WHERE owner_id = auth.uid())
);

CREATE POLICY "Agents can request payouts"
ON agent_payouts FOR INSERT TO authenticated
WITH CHECK (
  agent_id IN (SELECT id FROM travel_agents WHERE owner_id = auth.uid())
);
