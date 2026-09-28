-- Nusabook 3NF Database Migration
-- Extension Setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('superadmin', 'agent_owner', 'agent_staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE package_category AS ENUM ('open_trip', 'private_trip');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE schedule_status AS ENUM ('OPEN', 'CLOSED', 'SOLD_OUT', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('UNPAID', 'PAID', 'EXPIRED', 'CANCELLED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payout_status AS ENUM ('REQUESTED', 'APPROVED', 'TRANSFERRED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles (Linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    role user_role DEFAULT 'agent_owner' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Travel Agents
CREATE TABLE IF NOT EXISTS travel_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    business_name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    office_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    instagram_handle VARCHAR(50),
    bank_name VARCHAR(50) NOT NULL,
    bank_account_number VARCHAR(50) NOT NULL,
    bank_account_name VARCHAR(150) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_travel_agents_slug ON travel_agents(slug);
CREATE INDEX IF NOT EXISTS idx_travel_agents_owner ON travel_agents(owner_id);

-- 3. Tour Packages
CREATE TABLE IF NOT EXISTS tour_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES travel_agents(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    category package_category NOT NULL DEFAULT 'open_trip',
    duration_days INT NOT NULL CHECK (duration_days > 0),
    duration_nights INT NOT NULL DEFAULT 0,
    destination_city VARCHAR(100) NOT NULL,
    meeting_point TEXT NOT NULL,
    description TEXT NOT NULL,
    itinerary JSONB NOT NULL DEFAULT '[]'::JSONB,
    facilities_included TEXT[] NOT NULL DEFAULT '{}',
    facilities_excluded TEXT[] NOT NULL DEFAULT '{}',
    cancellation_policy TEXT,
    thumbnail_url TEXT,
    gallery_urls TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_agent_package_slug UNIQUE (agent_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_tour_packages_agent ON tour_packages(agent_id);

-- 4. Trip Schedules
CREATE TABLE IF NOT EXISTS trip_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES tour_packages(id) ON DELETE CASCADE,
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    total_quota INT NOT NULL CHECK (total_quota > 0),
    reserved_quota INT NOT NULL DEFAULT 0 CHECK (reserved_quota >= 0),
    booked_quota INT NOT NULL DEFAULT 0 CHECK (booked_quota >= 0),
    price_per_pax NUMERIC(12, 2) NOT NULL CHECK (price_per_pax >= 0),
    status schedule_status DEFAULT 'OPEN' NOT NULL,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT valid_trip_dates CHECK (return_date >= departure_date),
    CONSTRAINT quota_integrity CHECK (reserved_quota + booked_quota <= total_quota)
);

CREATE INDEX IF NOT EXISTS idx_trip_schedules_package ON trip_schedules(package_id);
CREATE INDEX IF NOT EXISTS idx_trip_schedules_date ON trip_schedules(departure_date);

-- 5. Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(30) UNIQUE NOT NULL,
    agent_id UUID NOT NULL REFERENCES travel_agents(id) ON DELETE RESTRICT,
    schedule_id UUID NOT NULL REFERENCES trip_schedules(id) ON DELETE RESTRICT,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_whatsapp VARCHAR(20) NOT NULL,
    total_pax INT NOT NULL CHECK (total_pax > 0),
    price_per_pax NUMERIC(12, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    platform_fee NUMERIC(12, 2) NOT NULL,
    agent_payout_amount NUMERIC(12, 2) NOT NULL,
    payment_status booking_status DEFAULT 'UNPAID' NOT NULL,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    payment_expired_at TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    is_manual_entry BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_bookings_agent ON bookings(agent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_schedule ON bookings(schedule_id);

-- 6. Booking Passengers (Manifest)
CREATE TABLE IF NOT EXISTS booking_passengers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    id_card_number VARCHAR(50),
    gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE')),
    phone_number VARCHAR(20),
    emergency_contact VARCHAR(100),
    special_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_passengers_booking ON booking_passengers(booking_id);

-- 7. Agent Payouts
CREATE TABLE IF NOT EXISTS agent_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES travel_agents(id) ON DELETE RESTRICT,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    platform_deduction NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    net_transferred NUMERIC(12, 2) NOT NULL,
    status payout_status DEFAULT 'REQUESTED' NOT NULL,
    bank_destination_name VARCHAR(50) NOT NULL,
    bank_destination_account VARCHAR(50) NOT NULL,
    bank_destination_holder VARCHAR(150) NOT NULL,
    transfer_proof_url TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payouts_agent ON agent_payouts(agent_id);
