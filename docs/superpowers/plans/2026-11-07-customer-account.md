# Customer Account System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add full support for Customer/Wisatawan Accounts (`customer` role) alongside Travel Agent Partners (`agent_owner`, `agent_staff`) and Super Admin (`superadmin`), including unified `/login` & `/register` role switching, RBAC isolation, a dedicated `/account` customer portal (bookings, claim guest booking, saved travelers, wishlist, profile), and 1-click checkout auto-fill.

**Architecture:** We extend the PostgreSQL schema (`supabase/migrations/0003_customer_accounts.sql`) and TypeScript types (`types/database.types.ts`) with `customer` role, `bookings.customer_id`, and `saved_passengers`. We provide a shared customer session/storage utility (`lib/customer-session.ts`) that syncs with Supabase Auth & tables when online and gracefully falls back to browser/in-memory storage in local/demo environments.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, Supabase SSR/Auth, Node.js built-in test runner (`node --test`).

## Global Constraints
- Guest Checkout (`FR-2.2` PRD) MUST remain functional without forcing login.
- `customer` users MUST be redirected to `/account` if they attempt to access `/dashboard` (Mitra Backoffice).
- NIK (16 digits) displayed in customer portals MUST be masked (`3507********0001`) except during form input, adhering to UU PDP No. 27/2022.
- All copywriting must be in clear, functional Indonesian following `antislop` rules.

---

### Task 1: Database Migration, Types, & Customer Session Helper

**Files:**
- Create: `supabase/migrations/0003_customer_accounts.sql`
- Modify: `types/database.types.ts`
- Create: `lib/customer-session.ts`
- Modify: `app/api/bookings/route.ts`
- Test: `tests/customer-account.test.mjs`

- [x] **Step 1: Write the failing test in `tests/customer-account.test.mjs`**
- [x] **Step 2: Run `node --test tests/customer-account.test.mjs` to verify it fails (RED)**
- [x] **Step 3: Create `supabase/migrations/0003_customer_accounts.sql`, update `types/database.types.ts`, create `lib/customer-session.ts`, and update `app/api/bookings/route.ts`**
- [x] **Step 4: Run `node --test tests/customer-account.test.mjs` to verify Task 1 tests pass (GREEN)**

---

### Task 2: Unified Auth (`/login` & `/register` Role Switcher) & RBAC Protection

**Files:**
- Modify: `app/(auth)/register/page.tsx`
- Modify: `app/(auth)/login/page.tsx`
- Modify: `middleware.ts`
- Modify: `app/(backoffice)/layout.tsx`
- Test: `tests/customer-account.test.mjs`

- [x] **Step 1: Add auth & RBAC assertions to `tests/customer-account.test.mjs`**
- [x] **Step 2: Run `node --test tests/customer-account.test.mjs` to verify it fails (RED)**
- [x] **Step 3: Update `app/(auth)/register/page.tsx`, `app/(auth)/login/page.tsx`, `middleware.ts`, and `app/(backoffice)/layout.tsx`**
- [x] **Step 4: Run `node --test tests/customer-account.test.mjs` to verify Task 2 tests pass (GREEN)**

---

### Task 3: Customer Portal (`/account`) & Checkout Auto-Fill Integration

**Files:**
- Create: `app/account/page.tsx`
- Modify: `app/(storefront)/[slug]/booking/page.tsx`
- Modify: `app/explore/page.tsx`
- Modify: `app/bookings/[bookingCode]/page.tsx`
- Test: `tests/customer-account.test.mjs`

- [x] **Step 1: Add `/account` portal & checkout integration tests to `tests/customer-account.test.mjs`**
- [x] **Step 2: Run `node --test tests/customer-account.test.mjs` to verify it fails (RED)**
- [x] **Step 3: Create `app/account/page.tsx` and update `app/(storefront)/[slug]/booking/page.tsx`, `app/explore/page.tsx`, and `app/bookings/[bookingCode]/page.tsx`**
- [x] **Step 4: Run `npm test` and `npm run build` to verify all tests and production routes pass (GREEN)**
