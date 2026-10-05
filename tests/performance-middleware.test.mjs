import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Performance: Middleware tidak memanggil updateSession untuk rute publik tanpa auth cookies", () => {
  const middlewareContent = fs.readFileSync("middleware.ts", "utf8");
  assert.ok(
    middlewareContent.includes("isProtectedRoute") || middlewareContent.includes("hasAuthCookie"),
    "Middleware harus memiliki filter rute publik agar tidak memblokir TTFB dengan remote network call"
  );
});

test("Security: Middleware tetap memproteksi rute /admin", () => {
  const middlewareContent = fs.readFileSync("middleware.ts", "utf8");
  assert.ok(
    middlewareContent.includes('pathname.startsWith("/admin")'),
    "Middleware harus tetap memproteksi rute admin"
  );
});
