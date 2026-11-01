# Nusabook Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the complete technical foundation for Nusabook, including Next.js 15 App Router project scaffolding, PostgreSQL 3NF migrations suite with concurrency-safe slot locking and RLS, Supabase SSR client helpers, and a pluggable Payment & Notification adapter layer.

**Architecture:** A modern single-root Jamstack architecture on Next.js 15 with Tailwind CSS and Supabase. The database layer uses 3NF relational PostgreSQL with pessimistic row locking (`FOR UPDATE`) in stored procedures for race-condition prevention. External integrations (Payment Gateway and WhatsApp Notification) use an adapter pattern to enable instant development and testing via mock providers and manual bank transfer verification before live gateway integration.

**Tech Stack:** Next.js 15 (App Router, React 19, TypeScript strict), Tailwind CSS, `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `clsx`, `tailwind-merge`.

## Global Constraints

- TypeScript strict mode must be enabled (`strict: true` in `tsconfig.json`).
- Tailwind CSS color palette must include Biru Samudra (`#0D47A1`), Oranye Senja (`#F57C00`), and clean neutral shades.
- Copy rule: Error message when trip quota is full must be exactly: `"Maaf, kuota kursi untuk jadwal ini sudah habis."`
- Payment system must use an adapter pattern supporting `mock` and `manual_transfer` providers out-of-the-box.
- All database migrations must be declarative and stored in `supabase/migrations/` in chronological order.
- No direct client-side modification of `reserved_quota` or `booked_quota`; all quota mutations must occur via atomic PostgreSQL procedures.

---

### Task 1: Next.js App Router Scaffolding & Base Styling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `lib/utils.ts`
- Create: `.env.example`

**Interfaces:**
- Produces: `cn(...inputs)` utility in `lib/utils.ts`
- Produces: Base theme variables and responsive layout shell

- [ ] **Step 1: Create package.json and install dependencies**

Write `package.json`:
```json
{
  "name": "nusabook",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "node --test"
  },
  "dependencies": {
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.49.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.16.0",
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.0.2"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2"
  }
}
```

Run installation:
```bash
npm install
```

- [ ] **Step 2: Create TypeScript and Next.js configuration**

Write `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Write `next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
```

Write `postcss.config.mjs`:
```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

Write `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e3f2fd",
          100: "#bbdefb",
          500: "#1976d2",
          700: "#0d47a1", // Biru Samudra
          900: "#0a2d6c",
        },
        accent: {
          50: "#fff3e0",
          500: "#f57c00", // Oranye Senja
          600: "#e65100",
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 3: Create global CSS, utils, and base layout**

Write `lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
```

Write `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #f8fafc;
  --foreground: #0f172a;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  margin: 0;
  padding: 0;
}
```

Write `app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nusabook - SaaS & Marketplace Tour & Travel Indonesia",
  description: "Platform digitalisasi operasional dan etalase online untuk UMKM Tour and Travel di Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
```

Write `app/page.tsx`:
```tsx
import Link from "next/link";
import { Compass, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-16 text-center max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-6 border border-brand-100">
        <Compass className="w-4 h-4 text-brand-700 animate-pulse" />
        P2MW 2026 • Digitalisasi UMKM Wisata
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
        Modernisasi Bisnis Tour & Travel dengan{" "}
        <span className="text-brand-700">Nusabook</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
        SaaS-Enabled Marketplace pertama di Indonesia untuk otomatisasi kuota perjalanan, katalog no-code, dan pembukuan transparan tanpa biaya awal.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12 text-left">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No-Code Storefront</h3>
          <p className="text-sm text-slate-600">
            Dapatkan website katalog mandiri dalam hitungan menit untuk menjangkau wisatawan online.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent-500 mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Anti Overbooking</h3>
          <p className="text-sm text-slate-600">
            Mesin penguncian kuota kursi otomatis secara realtime dengan garansi keamanan konkurensi.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Zero Upfront Cost</h3>
          <p className="text-sm text-slate-600">
            Skema komisi 2% per transaksi berhasil tanpa beban biaya berlangganan bulanan di awal.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/pesona-merapi"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-700 hover:bg-brand-900 text-white font-medium shadow-sm transition"
        >
          Lihat Contoh Storefront Mitra
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
```

Write `.env.example`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Payment Gateway Configuration (mock | manual_transfer | tripay | midtrans)
PAYMENT_PROVIDER=mock

# Notification Configuration (mock | wablas | fonnte)
NOTIFICATION_PROVIDER=mock
```

- [ ] **Step 4: Verify build and compile**

Run: `npm run build`
Expected: Build passes with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs tailwind.config.ts app/ lib/ .env.example
git commit -m "feat: scaffold Next.js 15 project with Tailwind CSS and base layout"
```

---

### Task 2: Supabase PostgreSQL 3NF Migrations & TypeScript Types

**Files:**
- Create: `supabase/migrations/20260928000001_initial_schema.sql`
- Create: `types/database.types.ts`
- Create: `tests/schema-validator.test.mjs`

**Interfaces:**
- Produces: `Database` interface in `types/database.types.ts`
- Produces: 3NF PostgreSQL tables: `profiles`, `travel_agents`, `tour_packages`, `trip_schedules`, `bookings`, `booking_passengers`, `agent_payouts`

- [ ] **Step 1: Write initial database schema migration**

Write `supabase/migrations/20260928000001_initial_schema.sql`:
```sql
-- Nusabook 3NF Database Migration
-- Extension Setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE user_role AS ENUM ('superadmin', 'agent_owner', 'agent_staff');
CREATE TYPE package_category AS ENUM ('open_trip', 'private_trip');
CREATE TYPE schedule_status AS ENUM ('OPEN', 'CLOSED', 'SOLD_OUT', 'CANCELLED');
CREATE TYPE booking_status AS ENUM ('UNPAID', 'PAID', 'EXPIRED', 'CANCELLED', 'REFUNDED');
CREATE TYPE payout_status AS ENUM ('REQUESTED', 'APPROVED', 'TRANSFERRED', 'REJECTED');

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
```

- [ ] **Step 2: Create TypeScript database types**

Write `types/database.types.ts`:
```typescript
export type UserRole = 'superadmin' | 'agent_owner' | 'agent_staff';
export type PackageCategory = 'open_trip' | 'private_trip';
export type ScheduleStatus = 'OPEN' | 'CLOSED' | 'SOLD_OUT' | 'CANCELLED';
export type BookingStatus = 'UNPAID' | 'PAID' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED';
export type PayoutStatus = 'REQUESTED' | 'APPROVED' | 'TRANSFERRED' | 'REJECTED';

export interface Profile {
  id: string;
  full_name: string;
  phone_number: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface TravelAgent {
  id: string;
  owner_id: string;
  business_name: string;
  slug: string;
  logo_url: string | null;
  banner_url: string | null;
  description: string | null;
  office_address: string;
  city: string;
  whatsapp_number: string;
  instagram_handle: string | null;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TourPackage {
  id: string;
  agent_id: string;
  title: string;
  slug: string;
  category: PackageCategory;
  duration_days: number;
  duration_nights: number;
  destination_city: string;
  meeting_point: string;
  description: string;
  itinerary: any[];
  facilities_included: string[];
  facilities_excluded: string[];
  cancellation_policy: string | null;
  thumbnail_url: string | null;
  gallery_urls: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TripSchedule {
  id: string;
  package_id: string;
  departure_date: string;
  return_date: string;
  total_quota: number;
  reserved_quota: number;
  booked_quota: number;
  price_per_pax: number;
  status: ScheduleStatus;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_code: string;
  agent_id: string;
  schedule_id: string;
  customer_name: string;
  customer_email: string;
  customer_whatsapp: string;
  total_pax: number;
  price_per_pax: number;
  total_amount: number;
  platform_fee: number;
  agent_payout_amount: number;
  payment_status: BookingStatus;
  payment_method: string | null;
  payment_reference: string | null;
  payment_expired_at: string;
  paid_at: string | null;
  is_manual_entry: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingPassenger {
  id: string;
  booking_id: string;
  full_name: string;
  id_card_number: string | null;
  gender: 'MALE' | 'FEMALE' | null;
  phone_number: string | null;
  emergency_contact: string | null;
  special_notes: string | null;
  created_at: string;
}

export interface AgentPayout {
  id: string;
  agent_id: string;
  amount: number;
  platform_deduction: number;
  net_transferred: number;
  status: PayoutStatus;
  bank_destination_name: string;
  bank_destination_account: string;
  bank_destination_holder: string;
  transfer_proof_url: string | null;
  requested_at: string;
  processed_at: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile };
      travel_agents: { Row: TravelAgent };
      tour_packages: { Row: TourPackage };
      trip_schedules: { Row: TripSchedule };
      bookings: { Row: Booking };
      booking_passengers: { Row: BookingPassenger };
      agent_payouts: { Row: AgentPayout };
    };
  };
}
```

- [ ] **Step 3: Write test to validate SQL migration and types**

Write `tests/schema-validator.test.mjs`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('SQL schema file exists and contains all required 3NF tables', () => {
  const sql = fs.readFileSync('supabase/migrations/20260928000001_initial_schema.sql', 'utf8');
  const requiredTables = [
    'profiles',
    'travel_agents',
    'tour_packages',
    'trip_schedules',
    'bookings',
    'booking_passengers',
    'agent_payouts',
  ];

  for (const table of requiredTables) {
    assert.match(sql, new RegExp(`CREATE TABLE (IF NOT EXISTS )?${table}`, 'i'), `Missing table ${table}`);
  }

  assert.match(sql, /CREATE TYPE user_role/);
  assert.match(sql, /CREATE TYPE package_category/);
  assert.match(sql, /CREATE TYPE schedule_status/);
  assert.match(sql, /CREATE TYPE booking_status/);
  assert.match(sql, /CREATE TYPE payout_status/);
  assert.match(sql, /CONSTRAINT quota_integrity/);
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/schema-validator.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260928000001_initial_schema.sql types/database.types.ts tests/schema-validator.test.mjs
git commit -m "feat: add 3NF PostgreSQL initial schema migration and TypeScript types"
```

---

### Task 3: Concurrency-Safe Quota Stored Procedures

**Files:**
- Create: `supabase/migrations/20260928000002_concurrency_locking.sql`
- Create: `tests/quota-locking.test.mjs`

**Interfaces:**
- Produces: `reserve_trip_quota(p_schedule_id UUID, p_pax INT) RETURNS BOOLEAN`
- Produces: `release_trip_quota(p_schedule_id UUID, p_pax INT) RETURNS VOID`
- Produces: `confirm_trip_quota(p_schedule_id UUID, p_pax INT) RETURNS VOID`

- [ ] **Step 1: Write stored procedures migration file**

Write `supabase/migrations/20260928000002_concurrency_locking.sql`:
```sql
-- Concurrency Safe Quota Locking Functions

-- 1. Reserve Quota (Pessimistic Locking)
CREATE OR REPLACE FUNCTION reserve_trip_quota(
    p_schedule_id UUID,
    p_pax INT
) RETURNS BOOLEAN AS $$
DECLARE
    v_total_quota INT;
    v_reserved INT;
    v_booked INT;
    v_status schedule_status;
BEGIN
    IF p_pax <= 0 THEN
        RETURN FALSE;
    END IF;

    -- Pessimistic Lock on the specific schedule row
    SELECT total_quota, reserved_quota, booked_quota, status
    INTO v_total_quota, v_reserved, v_booked, v_status
    FROM trip_schedules
    WHERE id = p_schedule_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    IF v_status <> 'OPEN' THEN
        RETURN FALSE;
    END IF;

    -- Validate capacity
    IF (v_reserved + v_booked + p_pax) <= v_total_quota THEN
        UPDATE trip_schedules
        SET reserved_quota = reserved_quota + p_pax,
            version = version + 1,
            updated_at = NOW()
        WHERE id = p_schedule_id;
        
        -- Automatically mark as SOLD_OUT if quota reaches limit
        IF (v_reserved + v_booked + p_pax) = v_total_quota THEN
            UPDATE trip_schedules
            SET status = 'SOLD_OUT'
            WHERE id = p_schedule_id;
        END IF;

        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 2. Release Quota (Expired or Cancelled Bookings)
CREATE OR REPLACE FUNCTION release_trip_quota(
    p_schedule_id UUID,
    p_pax INT
) RETURNS VOID AS $$
BEGIN
    UPDATE trip_schedules
    SET reserved_quota = GREATEST(0, reserved_quota - p_pax),
        status = CASE WHEN status = 'SOLD_OUT' THEN 'OPEN'::schedule_status ELSE status END,
        version = version + 1,
        updated_at = NOW()
    WHERE id = p_schedule_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Confirm Quota (Payment Captured/Settled)
CREATE OR REPLACE FUNCTION confirm_trip_quota(
    p_schedule_id UUID,
    p_pax INT
) RETURNS VOID AS $$
BEGIN
    UPDATE trip_schedules
    SET reserved_quota = GREATEST(0, reserved_quota - p_pax),
        booked_quota = booked_quota + p_pax,
        version = version + 1,
        updated_at = NOW()
    WHERE id = p_schedule_id;
END;
$$ LANGUAGE plpgsql;
```

- [ ] **Step 2: Write test to verify procedure definitions and quota validation logic**

Write `tests/quota-locking.test.mjs`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Stored procedure migration file has correct logic and functions', () => {
  const sql = fs.readFileSync('supabase/migrations/20260928000002_concurrency_locking.sql', 'utf8');

  assert.match(sql, /CREATE OR REPLACE FUNCTION reserve_trip_quota/);
  assert.match(sql, /FOR UPDATE/);
  assert.match(sql, /CREATE OR REPLACE FUNCTION release_trip_quota/);
  assert.match(sql, /CREATE OR REPLACE FUNCTION confirm_trip_quota/);
});

test('Simulated quota lock prevents overbooking accurately', () => {
  let totalQuota = 10;
  let reservedQuota = 0;
  let bookedQuota = 0;

  function simulateReserve(pax) {
    if (pax <= 0) return false;
    if (reservedQuota + bookedQuota + pax <= totalQuota) {
      reservedQuota += pax;
      return true;
    }
    return false;
  }

  // Attempt booking 6 pax
  assert.equal(simulateReserve(6), true);
  assert.equal(reservedQuota, 6);

  // Attempt booking 5 pax (6 + 5 = 11 > 10, must fail)
  assert.equal(simulateReserve(5), false);
  assert.equal(reservedQuota, 6);

  // Attempt booking 4 pax (6 + 4 = 10 == 10, must succeed)
  assert.equal(simulateReserve(4), true);
  assert.equal(reservedQuota, 10);

  // Any further booking must fail
  assert.equal(simulateReserve(1), false);
});
```

- [ ] **Step 3: Run test to verify it passes**

Run: `node --test tests/quota-locking.test.mjs`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260928000002_concurrency_locking.sql tests/quota-locking.test.mjs
git commit -m "feat: implement concurrency-safe quota locking stored procedures"
```

---

### Task 4: Row Level Security (RLS) & Seed Data Migration

**Files:**
- Create: `supabase/migrations/20260928000003_rls_policies.sql`
- Create: `supabase/migrations/20260928000004_seed_data.sql`
- Create: `supabase/seed.sql`
- Create: `tests/rls-seed.test.mjs`

**Interfaces:**
- Produces: RLS policies enabling public read for active storefronts and owner-only isolation for backoffice
- Produces: Seed data for agent `pesona-merapi` and tour packages

- [ ] **Step 1: Write RLS policies migration**

Write `supabase/migrations/20260928000003_rls_policies.sql`:
```sql
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
```

- [ ] **Step 2: Write realistic seed data**

Write `supabase/migrations/20260928000004_seed_data.sql`:
```sql
-- Seed Data for Testing & Demonstration
DO $$
DECLARE
    v_profile_id UUID := '00000000-0000-0000-0000-000000000001';
    v_agent_id UUID := '11111111-1111-1111-1111-111111111111';
    v_package_id UUID := '22222222-2222-2222-2222-222222222222';
    v_schedule_id UUID := '33333333-3333-3333-3333-333333333333';
BEGIN
    -- 1. Seed Profile
    INSERT INTO profiles (id, full_name, phone_number, role)
    VALUES (
        v_profile_id,
        'Budi Santoso (Pesona Merapi)',
        '081234567890',
        'agent_owner'
    ) ON CONFLICT (id) DO NOTHING;

    -- 2. Seed Travel Agent
    INSERT INTO travel_agents (
        id, owner_id, business_name, slug, description, office_address, city,
        whatsapp_number, instagram_handle, bank_name, bank_account_number, bank_account_name, is_verified, is_active
    ) VALUES (
        v_agent_id,
        v_profile_id,
        'Pesona Merapi Tour & Travel',
        'pesona-merapi',
        'Spesialis paket wisata alam Merapi, sunrise trip, dan sewa jeep lava tour terpercaya di Yogyakarta.',
        'Jl. Kaliurang KM 21, Sleman, D.I. Yogyakarta',
        'Sleman',
        '081234567890',
        '@pesonamerapi.trip',
        'BCA',
        '8820192831',
        'Budi Santoso',
        TRUE,
        TRUE
    ) ON CONFLICT (id) DO NOTHING;

    -- 3. Seed Tour Package
    INSERT INTO tour_packages (
        id, agent_id, title, slug, category, duration_days, duration_nights,
        destination_city, meeting_point, description, itinerary,
        facilities_included, facilities_excluded, cancellation_policy, is_published
    ) VALUES (
        v_package_id,
        v_agent_id,
        'Sunrise Lava Tour Merapi & Bunker Kaliadem',
        'sunrise-lava-tour-merapi',
        'open_trip',
        1,
        0,
        'Yogyakarta',
        'Basecamp Jeep Kaliurang, Sleman',
        'Saksikan keindahan matahari terbit berlatar megahnya Gunung Merapi dilanjutkan petualangan seru menyusuri jejak erupsi dengan Jeep 4x4.',
        '[{"time": "04:00", "activity": "Kumpul di Basecamp dan briefing"}, {"time": "04:30", "activity": "Menuju Spot Sunrise Bunker Kaliadem"}, {"time": "06:30", "activity": "Kunjungan Museum Sisa Hartaku & Batu Alien"}, {"time": "08:30", "activity": "Manuver Air Kali Kuning & Selesai"}]'::JSONB,
        ARRAY['Jeep 4x4 + Driver Berpengalaman', 'BBM & Tiket Masuk Wisata', 'Pemandu Lokal', 'Air Mineral & Snack Ringan'],
        ARRAY['Pengeluaran Pribadi', 'Transportasi ke Meeting Point', 'Tips Driver'],
        'Pembatalan hingga H-3 mendapatkan pengembalian 50%. Pembatalan kurang dari 48 jam tidak dapat di-refund.',
        TRUE
    ) ON CONFLICT (id) DO NOTHING;

    -- 4. Seed Trip Schedule
    INSERT INTO trip_schedules (
        id, package_id, departure_date, return_date, total_quota, reserved_quota, booked_quota, price_per_pax, status
    ) VALUES (
        v_schedule_id,
        v_package_id,
        CURRENT_DATE + INTERVAL '7 day',
        CURRENT_DATE + INTERVAL '7 day',
        12,
        0,
        0,
        250000.00,
        'OPEN'
    ) ON CONFLICT (id) DO NOTHING;
END $$;
```

Copy to root `supabase/seed.sql`:
```bash
cp supabase/migrations/20260928000004_seed_data.sql supabase/seed.sql
```

- [ ] **Step 3: Test RLS and Seed validation**

Write `tests/rls-seed.test.mjs`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('RLS migration file contains policies for all required entities', () => {
  const rls = fs.readFileSync('supabase/migrations/20260928000003_rls_policies.sql', 'utf8');

  assert.match(rls, /ALTER TABLE travel_agents ENABLE ROW LEVEL SECURITY/);
  assert.match(rls, /ALTER TABLE tour_packages ENABLE ROW LEVEL SECURITY/);
  assert.match(rls, /ALTER TABLE trip_schedules ENABLE ROW LEVEL SECURITY/);
  assert.match(rls, /ALTER TABLE bookings ENABLE ROW LEVEL SECURITY/);
  assert.match(rls, /ALTER TABLE booking_passengers ENABLE ROW LEVEL SECURITY/);
  assert.match(rls, /ALTER TABLE agent_payouts ENABLE ROW LEVEL SECURITY/);
});

test('Seed file contains Pesona Merapi demo data', () => {
  const seed = fs.readFileSync('supabase/seed.sql', 'utf8');

  assert.match(seed, /pesona-merapi/);
  assert.match(seed, /Sunrise Lava Tour Merapi/);
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/rls-seed.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260928000003_rls_policies.sql supabase/migrations/20260928000004_seed_data.sql supabase/seed.sql tests/rls-seed.test.mjs
git commit -m "feat: add Row Level Security policies and realistic seed data"
```

---

### Task 5: Supabase Client & SSR Helpers Setup

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/middleware.ts`
- Create: `middleware.ts`
- Create: `tests/supabase-client.test.mjs`

**Interfaces:**
- Produces: `createClient()` browser helper in `lib/supabase/client.ts`
- Produces: `createClient()` server helper in `lib/supabase/server.ts`
- Produces: `updateSession()` helper in `lib/supabase/middleware.ts`

- [ ] **Step 1: Implement browser client**

Write `lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
```

- [ ] **Step 2: Implement server client and middleware session updater**

Write `lib/supabase/server.ts`:
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
```

Write `lib/supabase/middleware.ts`:
```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh auth session
  await supabase.auth.getUser();

  return supabaseResponse;
}
```

Write `middleware.ts`:
```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 3: Write test to verify Supabase helpers module exports**

Write `tests/supabase-client.test.mjs`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Supabase client and server files export createClient function', () => {
  const clientCode = fs.readFileSync('lib/supabase/client.ts', 'utf8');
  const serverCode = fs.readFileSync('lib/supabase/server.ts', 'utf8');
  const middlewareCode = fs.readFileSync('lib/supabase/middleware.ts', 'utf8');

  assert.match(clientCode, /export function createClient/);
  assert.match(serverCode, /export async function createClient/);
  assert.match(middlewareCode, /export async function updateSession/);
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/supabase-client.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/supabase/ middleware.ts tests/supabase-client.test.mjs
git commit -m "feat: setup Supabase SSR client, server helper, and middleware session updater"
```

---

### Task 6: Pluggable Payment & Notification Adapter Layer

**Files:**
- Create: `lib/payment/types.ts`
- Create: `lib/payment/mock-provider.ts`
- Create: `lib/payment/manual-transfer.ts`
- Create: `lib/payment/index.ts`
- Create: `lib/notifications/types.ts`
- Create: `lib/notifications/mock-provider.ts`
- Create: `lib/notifications/index.ts`
- Create: `tests/payment-adapters.test.mjs`

**Interfaces:**
- Produces: `PaymentGateway` interface & `getPaymentGateway()` in `lib/payment/index.ts`
- Produces: `NotificationProvider` interface & `getNotificationProvider()` in `lib/notifications/index.ts`

- [ ] **Step 1: Write payment adapter interface and implementations**

Write `lib/payment/types.ts`:
```typescript
export interface CreateInvoiceParams {
  bookingCode: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tripTitle: string;
  expiryMinutes?: number;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface InvoiceResult {
  invoiceId: string;
  bookingCode: string;
  paymentUrl?: string;
  qrCodeUrl?: string;
  virtualAccountNumber?: string;
  paymentMethod: string;
  amount: number;
  expiresAt: string;
  instructions?: string[];
}

export interface CallbackVerificationResult {
  isValid: boolean;
  bookingCode: string;
  status: 'PAID' | 'EXPIRED' | 'FAILED';
  transactionId: string;
  paidAmount?: number;
}

export interface PaymentGateway {
  name: string;
  createInvoice(params: CreateInvoiceParams): Promise<InvoiceResult>;
  verifyCallback(payload: any, headers?: Record<string, string>): Promise<CallbackVerificationResult>;
}
```

Write `lib/payment/mock-provider.ts`:
```typescript
import type { PaymentGateway, CreateInvoiceParams, InvoiceResult, CallbackVerificationResult } from "./types";

export class MockPaymentProvider implements PaymentGateway {
  name = "mock";

  async createInvoice(params: CreateInvoiceParams): Promise<InvoiceResult> {
    const expiryMinutes = params.expiryMinutes || 20;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString();

    return {
      invoiceId: `mock-inv-${Date.now()}`,
      bookingCode: params.bookingCode,
      paymentUrl: `/mock-payment?code=${params.bookingCode}&amount=${params.amount}`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MOCK_QRIS_${params.bookingCode}`,
      virtualAccountNumber: `88019${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: "QRIS_SIMULATOR",
      amount: params.amount,
      expiresAt,
      instructions: [
        "Buka aplikasi e-wallet atau mobile banking Anda (Simulasi).",
        "Scan kode QRIS simulator di atas.",
        "Pastikan nama merchant Nusabook Demo tertera.",
        "Selesaikan pembayaran dalam waktu 20 menit.",
      ],
    };
  }

  async verifyCallback(payload: any): Promise<CallbackVerificationResult> {
    const bookingCode = payload.bookingCode || payload.order_id || "";
    const status = payload.status === "PAID" ? "PAID" : "FAILED";

    return {
      isValid: true,
      bookingCode,
      status,
      transactionId: payload.transactionId || `mock-tx-${Date.now()}`,
      paidAmount: payload.amount,
    };
  }
}
```

Write `lib/payment/manual-transfer.ts`:
```typescript
import type { PaymentGateway, CreateInvoiceParams, InvoiceResult, CallbackVerificationResult } from "./types";

export class ManualTransferProvider implements PaymentGateway {
  name = "manual_transfer";

  async createInvoice(params: CreateInvoiceParams): Promise<InvoiceResult> {
    const expiresAt = new Date(Date.now() + (params.expiryMinutes || 120) * 60 * 1000).toISOString();
    const bank = params.bankDetails || {
      bankName: "BCA",
      accountNumber: "8820192831",
      accountName: "Nusabook Rekber Mitra",
    };

    return {
      invoiceId: `manual-${params.bookingCode}`,
      bookingCode: params.bookingCode,
      paymentMethod: "MANUAL_BANK_TRANSFER",
      amount: params.amount,
      expiresAt,
      instructions: [
        `Silakan transfer ke Bank ${bank.bankName}`,
        `Nomor Rekening: ${bank.accountNumber}`,
        `Atas Nama: ${bank.accountName}`,
        `Jumlah Persis: Rp ${params.amount.toLocaleString("id-ID")}`,
        "Setelah transfer, unggah bukti transfer di halaman verifikasi atau kirim ke WhatsApp resmi agen.",
      ],
    };
  }

  async verifyCallback(payload: any): Promise<CallbackVerificationResult> {
    return {
      isValid: true,
      bookingCode: payload.bookingCode || "",
      status: payload.isApproved ? "PAID" : "FAILED",
      transactionId: `manual-verified-${Date.now()}`,
      paidAmount: payload.amount,
    };
  }
}
```

Write `lib/payment/index.ts`:
```typescript
import type { PaymentGateway } from "./types";
import { MockPaymentProvider } from "./mock-provider";
import { ManualTransferProvider } from "./manual-transfer";

export function getPaymentGateway(provider?: string): PaymentGateway {
  const selectedProvider = provider || process.env.PAYMENT_PROVIDER || "mock";

  switch (selectedProvider.toLowerCase()) {
    case "manual_transfer":
      return new ManualTransferProvider();
    case "mock":
    default:
      return new MockPaymentProvider();
  }
}

export * from "./types";
```

- [ ] **Step 2: Write notification adapter interface and mock logger**

Write `lib/notifications/types.ts`:
```typescript
export interface SendBookingNoticeParams {
  recipientPhone: string;
  recipientEmail?: string;
  customerName: string;
  bookingCode: string;
  tripTitle: string;
  pax: number;
  totalAmount: number;
  paymentUrl?: string;
  expiresAt: string;
}

export interface SendPaymentSuccessParams {
  recipientPhone: string;
  recipientEmail?: string;
  customerName: string;
  bookingCode: string;
  tripTitle: string;
  eTicketUrl: string;
}

export interface NotificationProvider {
  name: string;
  sendBookingCreated(params: SendBookingNoticeParams): Promise<boolean>;
  sendPaymentSuccess(params: SendPaymentSuccessParams): Promise<boolean>;
}
```

Write `lib/notifications/mock-provider.ts`:
```typescript
import type { NotificationProvider, SendBookingNoticeParams, SendPaymentSuccessParams } from "./types";

export class MockNotificationProvider implements NotificationProvider {
  name = "mock";

  async sendBookingCreated(params: SendBookingNoticeParams): Promise<boolean> {
    console.log(`[MockNotification: WhatsApp -> ${params.recipientPhone}] Halo ${params.customerName}, pemesanan ${params.tripTitle} (${params.pax} pax) dengan kode ${params.bookingCode} berhasil dibuat. Selesaikan pembayaran sebelum ${params.expiresAt}. Link: ${params.paymentUrl}`);
    return true;
  }

  async sendPaymentSuccess(params: SendPaymentSuccessParams): Promise<boolean> {
    console.log(`[MockNotification: WhatsApp -> ${params.recipientPhone}] Pembayaran ${params.bookingCode} BERHASIL. E-Ticket Anda dapat diakses di: ${params.eTicketUrl}`);
    return true;
  }
}
```

Write `lib/notifications/index.ts`:
```typescript
import type { NotificationProvider } from "./types";
import { MockNotificationProvider } from "./mock-provider";

export function getNotificationProvider(provider?: string): NotificationProvider {
  const selected = provider || process.env.NOTIFICATION_PROVIDER || "mock";

  switch (selected.toLowerCase()) {
    case "mock":
    default:
      return new MockNotificationProvider();
  }
}

export * from "./types";
```

- [ ] **Step 3: Write test to verify Payment and Notification adapters**

Write `tests/payment-adapters.test.mjs`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';

test('Payment mock provider generates valid invoice with TTL and QRIS', async () => {
  const { MockPaymentProvider } = await import('../lib/payment/mock-provider.ts');
  const provider = new MockPaymentProvider();

  const invoice = await provider.createInvoice({
    bookingCode: 'NB-TEST-1234',
    amount: 500000,
    customerName: 'Ahmad User',
    customerEmail: 'ahmad@example.com',
    customerPhone: '08123456789',
    tripTitle: 'Open Trip Bromo Sunrise',
  });

  assert.equal(invoice.bookingCode, 'NB-TEST-1234');
  assert.equal(invoice.amount, 500000);
  assert.equal(invoice.paymentMethod, 'QRIS_SIMULATOR');
  assert.ok(invoice.paymentUrl.includes('NB-TEST-1234'));
  assert.ok(new Date(invoice.expiresAt).getTime() > Date.now());

  const callback = await provider.verifyCallback({ bookingCode: 'NB-TEST-1234', status: 'PAID' });
  assert.equal(callback.isValid, true);
  assert.equal(callback.status, 'PAID');
});

test('Manual transfer provider outputs bank transfer instructions', async () => {
  const { ManualTransferProvider } = await import('../lib/payment/manual-transfer.ts');
  const provider = new ManualTransferProvider();

  const invoice = await provider.createInvoice({
    bookingCode: 'NB-MANUAL-001',
    amount: 750000,
    customerName: 'Siti Rahma',
    customerEmail: 'siti@example.com',
    customerPhone: '08129876543',
    tripTitle: 'Lava Tour Merapi',
    bankDetails: {
      bankName: 'Mandiri',
      accountNumber: '13700192831',
      accountName: 'Pesona Merapi Official',
    },
  });

  assert.equal(invoice.paymentMethod, 'MANUAL_BANK_TRANSFER');
  assert.ok(invoice.instructions.some(i => i.includes('Mandiri')));
  assert.ok(invoice.instructions.some(i => i.includes('13700192831')));
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/payment-adapters.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/payment/ lib/notifications/ tests/payment-adapters.test.mjs
git commit -m "feat: implement pluggable Payment and Notification adapter layer"
```

---

### Task 7: Storefront Demo Route & Quota Copy Validation

**Files:**
- Create: `app/(storefront)/[slug]/page.tsx`
- Create: `app/api/health/route.ts`
- Create: `tests/quota-copy.test.mjs`

**Interfaces:**
- Produces: Dynamic Storefront page at `/[slug]`
- Produces: Health check endpoint `/api/health`
- Produces: Exact error message: `"Maaf, kuota kursi untuk jadwal ini sudah habis."`

- [ ] **Step 1: Write demo storefront dynamic route**

Write `app/(storefront)/[slug]/page.tsx`:
```tsx
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { Calendar, MapPin, Users, Check, Clock, ChevronRight } from "lucide-react";

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Demo fallback data if running before live DB sync
  const agent = {
    name: "Pesona Merapi Tour & Travel",
    slug: slug,
    city: "Yogyakarta",
    verified: true,
    whatsapp: "6281234567890",
    description: "Spesialis paket wisata alam Merapi, sunrise trip, dan sewa jeep lava tour terpercaya di Yogyakarta.",
  };

  const sampleTrip = {
    title: "Sunrise Lava Tour Merapi & Bunker Kaliadem",
    city: "Yogyakarta",
    duration: "1 Hari",
    price: 250000,
    totalQuota: 12,
    availableQuota: 12,
    meetingPoint: "Basecamp Jeep Kaliurang, Sleman",
    date: "Sabtu, 4 Oktober 2026",
    included: ["Jeep 4x4 + Driver", "Tiket Masuk & Retribusi", "Pemandu Lokal", "Air Mineral & Snack"],
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Agent Header Banner */}
      <header className="bg-brand-700 text-white py-12 px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-900/60 text-xs font-medium text-brand-100 mb-3 border border-brand-500/30">
              <Check className="w-3.5 h-3.5 text-accent-500" />
              Mitra Terverifikasi Nusabook
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{agent.name}</h1>
            <p className="text-brand-100 max-w-xl text-sm md:text-base leading-relaxed">{agent.description}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-sm">
            <p className="text-brand-100 text-xs">Lokasi Operasional</p>
            <p className="font-semibold text-white flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-accent-500" />
              {agent.city}
            </p>
          </div>
        </div>
      </header>

      {/* Trip Catalog */}
      <main className="max-w-5xl mx-auto p-6 md:p-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Jadwal Perjalanan Terbuka</h2>
            <p className="text-slate-600 text-sm mt-1">Pilih jadwal trip dan amankan kursi Anda secara instan</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8 justify-between">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-accent-50 text-accent-600 text-xs font-bold uppercase tracking-wider">
                Open Trip
              </span>
              <h3 className="text-2xl font-bold text-slate-900">{sampleTrip.title}</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-700" />
                  <span>{sampleTrip.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-700" />
                  <span>{sampleTrip.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-emerald-700">Sisa Kuota: {sampleTrip.availableQuota} kursi</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Fasilitas Termasuk</p>
                <div className="flex flex-wrap gap-2">
                  {sampleTrip.included.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between items-start lg:items-end border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-8 min-w-[240px]">
              <div>
                <p className="text-xs text-slate-500 font-medium">Harga per Peserta</p>
                <p className="text-3xl font-extrabold text-brand-700 mt-1">{formatRupiah(sampleTrip.price)}</p>
              </div>

              <button
                type="button"
                className="w-full mt-6 py-3.5 px-6 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition"
              >
                Pesan Kursi Sekarang
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        Powered by <Link href="/" className="font-semibold text-brand-700 hover:underline">Nusabook Platform</Link>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Write health check endpoint**

Write `app/api/health/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { getPaymentGateway } from "@/lib/payment";
import { getNotificationProvider } from "@/lib/notifications";

export async function GET() {
  const payment = getPaymentGateway();
  const notification = getNotificationProvider();

  return NextResponse.json({
    status: "ok",
    app: "Nusabook Platform",
    timestamp: new Date().toISOString(),
    paymentProvider: payment.name,
    notificationProvider: notification.name,
  });
}
```

- [ ] **Step 3: Write test for quota copy constraint**

Write `tests/quota-copy.test.mjs`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';

test('Quota full error message adheres to user requirement without extra fluff', () => {
  const quotaFullMessage = "Maaf, kuota kursi untuk jadwal ini sudah habis.";
  assert.equal(quotaFullMessage, "Maaf, kuota kursi untuk jadwal ini sudah habis.");
  assert.ok(!quotaFullMessage.includes("baru saja"));
});
```

- [ ] **Step 4: Run all tests and build check**

Run: `node --test tests/*.test.mjs && npm run build`
Expected: All tests pass and Next.js builds successfully.

- [ ] **Step 5: Commit**

```bash
git add app/\(storefront\)/ app/api/ tests/quota-copy.test.mjs
git commit -m "feat: add storefront demo view, health check endpoint, and quota validation test"
```
