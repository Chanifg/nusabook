import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const read = (relPath) => fs.readFileSync(path.join(rootDir, relPath), "utf8");
const exists = (relPath) => fs.existsSync(path.join(rootDir, relPath));

test("Database migration 0003_customer_accounts.sql defines customer role, bookings.customer_id, and saved_passengers table", () => {
  assert.equal(exists("supabase/migrations/0003_customer_accounts.sql"), true, "0003_customer_accounts.sql should exist");
  const sql = read("supabase/migrations/0003_customer_accounts.sql");
  assert.ok(sql.includes("'customer'"), "Should add 'customer' to user_role enum");
  assert.ok(sql.includes("customer_id"), "Should add customer_id column to bookings");
  assert.ok(sql.includes("saved_passengers"), "Should create saved_passengers table");
});

test("TypeScript database types include customer role, bookings.customer_id, and saved_passengers", () => {
  const types = read("types/database.types.ts");
  assert.ok(
    types.includes("'customer'"),
    "UserRole should include 'customer'"
  );
  assert.ok(
    types.includes("customer_id"),
    "Bookings table type should include customer_id"
  );
  assert.ok(
    types.includes("saved_passengers"),
    "Database tables should include saved_passengers"
  );
});

test("Customer session helper lib/customer-session.ts provides profile, saved travelers, and booking claim helpers", () => {
  assert.equal(exists("lib/customer-session.ts"), true, "lib/customer-session.ts should exist");
  const sessionSrc = read("lib/customer-session.ts");
  assert.ok(sessionSrc.includes("DEFAULT_SAVED_TRAVELERS"), "Should export default saved travelers");
  assert.ok(sessionSrc.includes("getCustomerSession"), "Should export getCustomerSession");
  assert.ok(sessionSrc.includes("saveCustomerSession"), "Should export saveCustomerSession");
  assert.ok(sessionSrc.includes("maskCustomerNik"), "Should export UU PDP NIK masking helper");
});

test("POST /api/bookings accepts optional customerId and stores customer_id", () => {
  const routeSrc = read("app/api/bookings/route.ts");
  assert.ok(routeSrc.includes("customerId"), "POST /api/bookings should read customerId from request body");
  assert.ok(routeSrc.includes("customer_id"), "POST /api/bookings should store customer_id in bookingRecord");
});

test("Auth pages (/register and /login) support switching between Wisatawan (customer) and Mitra Travel (agent_owner) plus RBAC guard", () => {
  const registerSrc = read("app/(auth)/register/page.tsx");
  assert.ok(registerSrc.includes("customer"), "/register should support customer role");
  assert.ok(registerSrc.includes("Wisatawan"), "/register should show Wisatawan tab option");

  const loginSrc = read("app/(auth)/login/page.tsx");
  assert.ok(loginSrc.includes("/account"), "/login should redirect customer users to /account");
  assert.ok(loginSrc.includes("Wisatawan"), "/login should include Wisatawan role option / demo login");

  const middlewareSrc = read("middleware.ts");
  assert.ok(middlewareSrc.includes('"/account"'), "middleware.ts should include /account in session check");

  const backofficeLayout = read("app/(backoffice)/layout.tsx");
  assert.ok(backofficeLayout.includes('redirect("/account")'), "Backoffice layout should redirect customer role to /account");
});

test("Customer Portal (/account) provides bookings, claim guest booking, saved travelers, wishlist, and profile tabs", () => {
  assert.equal(exists("app/account/page.tsx"), true, "app/account/page.tsx should exist");
  const accountSrc = read("app/account/page.tsx");
  assert.ok(accountSrc.includes("Pesanan & E-Tiket Saya"), "/account should have bookings & e-ticket tab");
  assert.ok(accountSrc.includes("Penumpang Tersimpan"), "/account should have saved travelers tab");
  assert.ok(accountSrc.includes("Klaim Pesanan"), "/account should allow claiming guest booking codes");
  assert.ok(accountSrc.includes("Wishlist"), "/account should have wishlist tab");
});

test("Checkout page (/[slug]/booking) integrates customer auto-fill and 1-click saved traveler manifest fill", () => {
  const bookingPageSrc = read("app/(storefront)/[slug]/booking/page.tsx");
  assert.ok(bookingPageSrc.includes("getCustomerSession"), "Booking page should load customer session for auto-fill");
  assert.ok(bookingPageSrc.includes("Penumpang Tersimpan"), "Booking page should allow 1-click fill from saved travelers");
  assert.ok(bookingPageSrc.includes("customerId"), "Booking page should pass customerId to POST /api/bookings");
});
