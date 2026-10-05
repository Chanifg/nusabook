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
