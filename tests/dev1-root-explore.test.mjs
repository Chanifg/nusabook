import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Landing Page Replacement: Root page (app/page.tsx) langsung menampilkan halaman Explore", () => {
  const rootContent = fs.readFileSync("app/page.tsx", "utf8");

  // Halaman landing page lama (SaaS buzzwords, SaaS copy) sudah digantikan langsung oleh Explore
  assert.match(
    rootContent,
    /MarketplaceExplorePage|explore/,
    "Root page harus langsung merender MarketplaceExplorePage"
  );
  assert.doesNotMatch(
    rootContent,
    /Buka Kanal Penjualan Digital/,
    "Landing page lama tidak boleh lagi muncul di root page"
  );
});
