# Nusabook Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengoptimasi performa dan responsivitas web Nusabook secara drastis dengan memangkas TTFB hingga >500ms pada rute publik, mengeliminasi download font render-blocking sebesar ~1MB, memparalelkan query database Supabase, dan menerapkan lazy loading pada aset gambar.

**Architecture:** Menerapkan arsitektur zero-overhead public routes di Next.js: scoping auth session middleware hanya untuk rute terproteksi, migrasi font ke `next/font/google` untuk self-hosting lokal, optimasi network query Supabase via `Promise.all()`, dan konfigurasi `next/image` untuk gambar katalog.

**Tech Stack:** Next.js 15 (App Router), Supabase SSR, `next/font/google`, `next/image`, Tailwind CSS, Node.js Test Runner.

## Global Constraints
- Seluruh 47 pengujian yang ada (`npm test`) harus tetap lulus 100% tanpa regresi.
- Tidak boleh melanggar aturan antislop (R-02: 0 em-dash, R-16: 0 buzzword, R-24: 0 dead links, R-20: 3 resilient states).
- Tidak boleh merusak proteksi keamanan pada rute `/admin` dan `/dashboard`.

---

### Task 1: Scoping Auth Middleware untuk Rute Publik

**Files:**
- Modify: `middleware.ts`
- Modify: `lib/supabase/middleware.ts`
- Test: `tests/performance-middleware.test.mjs`

**Interfaces:**
- Consumes: `request.nextUrl.pathname`, `request.cookies`
- Produces: `updateSession(request)` yang hanya berjalan saat diperlukan auth session refresh.

- [ ] **Step 1: Tulis unit test untuk verifikasi middleware routing bypass**

```javascript
// tests/performance-middleware.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Performance: Middleware tidak memanggil updateSession untuk rute publik tanpa auth cookies", () => {
  const middlewareContent = fs.readFileSync("middleware.ts", "utf8");
  assert.ok(
    middlewareContent.includes("isPublicRoute") || middlewareContent.includes("isProtectedRoute") || middlewareContent.includes("hasAuthCookie"),
    "Middleware harus memiliki filter rute publik agar tidak memblokir TTFB dengan remote network call"
  );
});
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `npx tsx --test tests/performance-middleware.test.mjs`
Expected: FAIL dengan assertion error.

- [ ] **Step 3: Implementasikan scoping rute pada `middleware.ts`**

Perbarui `middleware.ts` agar halaman publik (`/`, `/explore`, `/login`, `/register`, `/[slug]`, `/[slug]/packages/*`) tidak memanggil `updateSession` kecuali jika browser membawa cookie auth Supabase (`sb-access-token` atau cookie auth supabase).

```typescript
// middleware.ts snippet
const isProtectedRoute =
  pathname.startsWith("/dashboard") ||
  pathname.startsWith("/admin") ||
  pathname.startsWith("/api/admin");

const hasAuthCookie = request.cookies
  .getAll()
  .some((c) => c.name.includes("sb-") || c.name === "user-role");

if (isProtectedRoute || hasAuthCookie) {
  try {
    return await updateSession(request);
  } catch (error) {
    return NextResponse.next();
  }
}

return NextResponse.next();
```

- [ ] **Step 4: Jalankan test dan pastikan lulus**

Run: `npx tsx --test tests/performance-middleware.test.mjs`
Expected: PASS

- [ ] **Step 5: Verifikasi penurunan TTFB via curl**

Run: `curl -w "\nTTFB: %{time_starttransfer}s\n" -o /dev/null -s http://localhost:3000/`
Expected: TTFB drop signifikan dari ~1.6s menjadi < 200ms.

- [ ] **Step 6: Commit**

```bash
git add middleware.ts tests/performance-middleware.test.mjs
git commit -m "perf: scope supabase auth middleware to protected routes only"
```

---

### Task 2: Eliminasi Render-Blocking Font (~1MB) via `next/font/google`

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Test: `tests/performance-fonts.test.mjs`

**Interfaces:**
- Consumes: `@next/font/google`
- Produces: Self-hosted CSS variable font `Plus Jakarta Sans`, optimized Material Symbols preload link dengan `preconnect`.

- [ ] **Step 1: Tulis test verifikasi eliminasi `@import` CSS font**

```javascript
// tests/performance-fonts.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Performance: globals.css tidak boleh mengandung render-blocking @import url font", () => {
  const css = fs.readFileSync("app/globals.css", "utf8");
  assert.ok(
    !css.includes("@import url('https://fonts.googleapis.com"),
    "globals.css masih memuat @import font eksternal yang memblokir CSSOM"
  );
});

test("Performance: layout.tsx memuat font lokal next/font dan preconnect ke fonts.gstatic.com", () => {
  const layout = fs.readFileSync("app/layout.tsx", "utf8");
  assert.ok(
    layout.includes("Plus_Jakarta_Sans") || layout.includes("next/font/google"),
    "layout.tsx harus menggunakan next/font/google untuk zero-blocking font delivery"
  );
  assert.ok(
    layout.includes('rel="preconnect"'),
    "layout.tsx harus memiliki preconnect untuk font ikon Material Symbols"
  );
});
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `npx tsx --test tests/performance-fonts.test.mjs`
Expected: FAIL

- [ ] **Step 3: Implementasikan `next/font/google` pada `app/layout.tsx` dan hapus `@import` di `app/globals.css`**

Hapus `@import` di baris pertama `app/globals.css`.
Di `app/layout.tsx`:
```typescript
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});
```
Tambahkan tag `<link rel="preconnect" href="https://fonts.googleapis.com" />` dan `<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />` pada `<head>` di `layout.tsx`.

- [ ] **Step 4: Jalankan test dan pastikan lulus**

Run: `npx tsx --test tests/performance-fonts.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx tests/performance-fonts.test.mjs
git commit -m "perf: eliminate render-blocking font @import and adopt next/font/google"
```

---

### Task 3: Paralelisasi Query Database Supabase pada Halaman Etalase

**Files:**
- Modify: `app/(storefront)/[slug]/page.tsx`
- Modify: `app/(storefront)/[slug]/packages/[packageSlug]/page.tsx`
- Test: `tests/team2-storefront-live.test.mjs`

**Interfaces:**
- Consumes: `supabase.from("travel_agents")`, `supabase.from("tour_packages")`
- Produces: Query paralel yang memangkas waktu tunggu database hingga 50%.

- [ ] **Step 1: Review query saat ini di `app/(storefront)/[slug]/page.tsx`**

Saat ini:
```typescript
// Serial (lambat):
const { data: agentData } = await supabase.from("travel_agents")...
const { data: pkgData } = await supabase.from("tour_packages")...
```

- [ ] **Step 2: Optimasi query dengan single join atau paralel execution**

Ubah query agar mengambil data paket yang di-join langsung dengan data travel agent, atau jalankan validasi dengan efisien tanpa menunggu berulang-ulang jika data slug telah diketahui.

- [ ] **Step 3: Jalankan seluruh test suite live storefront**

Run: `npx tsx --test tests/team2-storefront-live.test.mjs`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/(storefront)/[slug]/page.tsx app/(storefront)/[slug]/packages/[packageSlug]/page.tsx
git commit -m "perf: optimize storefront queries to eliminate serial database waterfalls"
```

---

### Task 4: Optimasi Gambar & Lazy Loading (`next/image`)

**Files:**
- Modify: `next.config.ts`
- Modify: `app/page.tsx`
- Modify: `app/explore/page.tsx`
- Modify: `app/(storefront)/[slug]/packages/[packageSlug]/package-detail-view.tsx`
- Test: `tests/performance-images.test.mjs`

**Interfaces:**
- Consumes: `next.config.ts` remotePatterns
- Produces: Next.js Image component dengan auto WebP/AVIF compression dan `loading="lazy"`.

- [ ] **Step 1: Tulis test verifikasi domain remote image di `next.config.ts`**

```javascript
// tests/performance-images.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Performance: next.config.ts mengizinkan remote domain Unsplash dan Google User Content", () => {
  const config = fs.readFileSync("next.config.ts", "utf8");
  assert.ok(config.includes("images.unsplash.com"), "Domain images.unsplash.com harus terdaftar");
  assert.ok(config.includes("lh3.googleusercontent.com"), "Domain lh3.googleusercontent.com harus terdaftar");
});
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `npx tsx --test tests/performance-images.test.mjs`
Expected: FAIL

- [ ] **Step 3: Tambahkan domain ke `next.config.ts`**

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};
```

- [ ] **Step 4: Berikan atribut `loading="lazy"` & `decoding="async"` pada gambar katalog**

Di `app/explore/page.tsx`, `app/page.tsx`, dan `package-detail-view.tsx`, pastikan gambar kartu katalog menyertakan `loading="lazy"` dan `decoding="async"`, serta hero banner gambar utama menggunakan `priority` atau `fetchPriority="high"`.

- [ ] **Step 5: Jalankan test dan pastikan lulus**

Run: `npx tsx --test tests/performance-images.test.mjs`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add next.config.ts app/explore/page.tsx app/page.tsx app/(storefront)/[slug]/packages/[packageSlug]/package-detail-view.tsx tests/performance-images.test.mjs
git commit -m "perf: enable remote image domains and responsive lazy loading"
```

---

### Task 5: Delivery Gate & End-to-End Benchmark Verifikasi

**Files:**
- Modify: `docs/superpowers/plans/2026-10-05-performance-optimization.md`

- [ ] **Step 1: Jalankan seluruh test suite proyek**

Run: `npm test`
Expected: Seluruh 47+ test lulus (PASS) tanpa error.

- [ ] **Step 2: Jalankan audit waktu respons TTFB end-to-end**

Run:
```bash
curl -w "Route / TTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s http://localhost:3000/
curl -w "Route /explore TTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s http://localhost:3000/explore
curl -w "Route /pesona-merapi TTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s http://localhost:3000/pesona-merapi
```
Expected: TTFB seluruh rute publik turun drastis di bawah 300ms.

- [ ] **Step 3: Commit hasil akhir perencanaan dan benchmark**

```bash
git add docs/superpowers/plans/2026-10-05-performance-optimization.md
git commit -m "docs: complete performance optimization verification plan"
```
