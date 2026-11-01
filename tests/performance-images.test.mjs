import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Performance: next.config.ts mengizinkan remote domain Unsplash dan Google User Content", () => {
  const config = fs.readFileSync("next.config.ts", "utf8");
  assert.ok(
    config.includes("images.unsplash.com"),
    "Domain images.unsplash.com harus terdaftar di next.config.ts"
  );
  assert.ok(
    config.includes("lh3.googleusercontent.com"),
    "Domain lh3.googleusercontent.com harus terdaftar di next.config.ts"
  );
});

test("Performance: Explore page menerapkan lazy loading dan decoding async pada gambar", () => {
  const explore = fs.readFileSync("app/explore/page.tsx", "utf8");
  assert.ok(
    explore.includes('loading="lazy"') || explore.includes("loading='lazy'"),
    "Gambar katalog di explore page harus memiliki atribut loading='lazy'"
  );
  assert.ok(
    explore.includes('decoding="async"'),
    "Gambar katalog di explore page harus memiliki atribut decoding='async'"
  );
});
