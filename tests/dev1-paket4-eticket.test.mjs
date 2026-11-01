import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const eticketPagePath = path.join(projectRoot, "app/bookings/[bookingCode]/page.tsx");

test("Paket 4: Halaman E-Ticket tidak boleh memiliki data hardcoded operator atau pemesan statis", () => {
  const content = fs.readFileSync(eticketPagePath, "utf-8");

  // Harus tidak ada hardcoded nama Bambang Pamungkas atau email dummy anindya
  assert.doesNotMatch(
    content,
    /Bambang Pamungkas/,
    "E-Ticket masih mengandung nama profil statis 'Bambang Pamungkas'"
  );
  assert.doesNotMatch(
    content,
    /anindya\.paramitha@gmail\.com/,
    "E-Ticket masih mengandung email hardcoded 'anindya.paramitha@gmail.com'"
  );
});

test("Paket 4: E-Ticket memuat query data dinamis dari Supabase", () => {
  const content = fs.readFileSync(eticketPagePath, "utf-8");

  // Harus memuat pemanggilan supabase untuk mengambil booking, agent, schedule, dan passenger
  assert.match(
    content,
    /createClient/,
    "Halaman E-Ticket harus menggunakan createClient untuk query data live"
  );
  assert.match(
    content,
    /from\(["']bookings["']\)/,
    "Halaman E-Ticket harus mengambil data dari tabel bookings"
  );
  assert.match(
    content,
    /booking_passengers/,
    "Halaman E-Ticket harus mengambil relasi manifes penumpang"
  );
});

test("Paket 4: E-Ticket menyediakan aksi cetak/unduh PDF dan integrasi WhatsApp", () => {
  const content = fs.readFileSync(eticketPagePath, "utf-8");

  // Memverifikasi adanya fungsi cetak window.print dan tautan WA
  assert.match(
    content,
    /window\.print\(\)/,
    "Halaman E-Ticket harus mendukung cetak/PDF via window.print()"
  );
  assert.match(
    content,
    /wa\.me|whatsapp/i,
    "Halaman E-Ticket harus menyediakan aksi WhatsApp"
  );

  // Tidak boleh ada dead link terms atau href="#"
  assert.doesNotMatch(
    content,
    /href=["']\/terms["']/,
    "Halaman E-Ticket tidak boleh mengarahkan ke link mati /terms"
  );
  assert.doesNotMatch(
    content,
    /href=["']#["']/,
    "Halaman E-Ticket tidak boleh memiliki dead href='#'"
  );
});
