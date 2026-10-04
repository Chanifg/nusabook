-- Workstream C: Passenger Manifest and Attendance Check-in Schema
-- Menambahkan kolom is_checked_in dan checked_in_at pada tabel booking_passengers

ALTER TABLE booking_passengers 
ADD COLUMN IF NOT EXISTS is_checked_in BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;

-- RLS Policy: Memungkinkan agen travel memperbarui status kehadiran (check-in) penumpang pada booking miliknya
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'booking_passengers' 
        AND policyname = 'Agents can update manifest checkin status'
    ) THEN
        CREATE POLICY "Agents can update manifest checkin status"
        ON booking_passengers FOR UPDATE TO authenticated
        USING (
            booking_id IN (
                SELECT b.id FROM bookings b
                JOIN travel_agents a ON b.agent_id = a.id
                WHERE a.owner_id = auth.uid()
            )
        )
        WITH CHECK (
            booking_id IN (
                SELECT b.id FROM bookings b
                JOIN travel_agents a ON b.agent_id = a.id
                WHERE a.owner_id = auth.uid()
            )
        );
    END IF;
END $$;
