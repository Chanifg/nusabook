"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/icon";

interface PassengerInput {
  fullName: string;
  idCardNumber: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  emergencyContact: string;
  notes?: string;
}

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const slug = (params?.slug as string) || "pesona-merapi";
  const scheduleId = searchParams.get("scheduleId") || "sched-1";
  const initialPax = Math.max(1, Number(searchParams.get("pax") || 2));

  const [pax, setPax] = useState<number>(initialPax);
  const [isSelfPassenger, setIsSelfPassenger] = useState<boolean>(true);
  const [customerName, setCustomerName] = useState<string>("Anindya Paramitha");
  const [customerEmail, setCustomerEmail] = useState<string>("anindya.paramitha@gmail.com");
  const [customerWhatsapp, setCustomerWhatsapp] = useState<string>("+62 812-3456-7890");

  const [pickupLocation, setPickupLocation] = useState<string>("stasiun");
  const [hotelDetails, setHotelDetails] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("va");

  const [countdownSeconds, setCountdownSeconds] = useState<number>(19 * 60 + 42);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pricePerPax = 450000;
  const tripTitle = "Open Trip Bromo Golden Sunrise";

  const [passengers, setPassengers] = useState<PassengerInput[]>([
    {
      fullName: "Anindya Paramitha",
      idCardNumber: "3578015509950003",
      gender: "FEMALE",
      dateOfBirth: "15 September 1995",
      emergencyContact: "Bambang Sudibyo (Ayah) - 08119876543",
      notes: "Tidak ada riwayat asma / penyakit jantung",
    },
    {
      fullName: "Reza Herdian",
      idCardNumber: "3273021403940001",
      gender: "MALE",
      dateOfBirth: "14 Maret 1994",
      emergencyContact: "Bambang Sudibyo (Ayah) - 08119876543",
      notes: "Ukuran jaket L",
    },
  ]);

  // Adjust passengers list length if pax changes
  useEffect(() => {
    setPassengers((prev) => {
      const next = [...prev];
      if (pax > prev.length) {
        for (let i = prev.length; i < pax; i++) {
          next.push({
            fullName: "",
            idCardNumber: "",
            gender: "MALE",
            dateOfBirth: "",
            emergencyContact: "",
            notes: "",
          });
        }
      } else if (pax < prev.length) {
        next.splice(pax);
      }
      return next;
    });
  }, [pax]);

  // Sync self passenger name with passenger 0
  useEffect(() => {
    if (isSelfPassenger && passengers.length > 0) {
      setPassengers((prev) => {
        const next = [...prev];
        next[0] = { ...next[0], fullName: customerName };
        return next;
      });
    }
  }, [isSelfPassenger, customerName]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const handlePassengerChange = (index: number, field: keyof PassengerInput, value: string) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName || !customerEmail || !customerWhatsapp) {
      setErrorMsg("Mohon lengkapi seluruh data kontak pemesan.");
      return;
    }

    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].fullName.trim()) {
        setErrorMsg(`Nama lengkap peserta #${i + 1} wajib diisi.`);
        return;
      }
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scheduleId,
            customerName,
            customerEmail,
            customerWhatsapp,
            pax,
            passengers,
            tripTitle,
            pricePerPax,
            pickupLocation: pickupLocation === "hotel" ? `Hotel: ${hotelDetails}` : pickupLocation,
            paymentMethod,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrorMsg(data.error || "Gagal memproses reservasi.");
          return;
        }

        router.push(data.redirectUrl || `/bookings/${data.bookingCode}/payment`);
      } catch {
        setErrorMsg("Terjadi gangguan koneksi. Silakan coba kembali.");
      }
    });
  };

  const subtotal = pax * pricePerPax;

  return (
    <div className="bg-background font-body-regular text-on-surface antialiased min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <Link className="flex items-center gap-space-sm" href="/">
              <img
                alt="Nusabook Brand Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1U3Dc9ujBNuM7mgSPnQReIZqJpbXFrgBa8_v7KkLAxGoGg-NCEjy4Aw-pYXp9CiKsNHmqpLEMF2TzdVBIjehkrvhOp1eK3eYIfA64704YK0SOXTQb6gBESs7Xo_FJmMnJpYGla99v_5KwfnRrPX3mOY81yQP8OnvPcRn6zitzBMcBKr14d077mBMYP9cT2gZ37ppBCN_acPq-kd6A4kNOGLXs6_FK5SnaikbZm8kopURdxI0y2YnoftJw"
              />
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                Nusabook
              </span>
            </Link>
            <div className="hidden md:inline-flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="font-micro-badge text-micro-badge text-on-surface-variant font-semibold uppercase tracking-wider font-bold">
                Live Sync Aktif
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-space-lg">
            <Link className="font-body-regular text-body-regular text-on-surface-variant hover:text-on-surface transition-colors" href="/explore">
              Jelajah Wisata
            </Link>
            <Link className="font-body-regular text-body-regular text-on-surface-variant hover:text-on-surface transition-colors" href={`/${slug}`}>
              Etalase Paket
            </Link>
            <span className="font-body-semibold text-body-semibold text-primary font-bold">
              Checkout & Reservasi
            </span>
          </nav>

          <div className="flex items-center gap-space-md">
            <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1.5 rounded-full text-on-surface-variant">
              <MaterialIcon name="lock" className="text-[16px] text-primary" />
            </div>
            <div className="relative">
              <button
                className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
                type="button"
              >
                <MaterialIcon name="notifications" className="text-[22px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container" />
              </button>
            </div>
            <div className="flex items-center gap-space-sm pl-space-xs">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container-high"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9zORNB2FPjTW_H98NevCLhXNTN4IUGGfqvD1zb38cqGydAcZU48wcSbV80amSRL8i_DH5E_ANNVnRQ5hVC780G4txUSnM5zYnxX59hHqUPbG3q8hLDgzB6qU6VW4G70E7kwTaZw6RRGkbhYqovfRas5W09tau4zjA7iNaXZYFS4CyUgS1b3lrz0k4sEZJJs6OHpCHs4aMJEIYyIb_CIvpLbu2PnKxrjhPx8uzaQ5vlH1GX4IaRks"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="font-body-semibold text-body-semibold text-on-surface leading-tight font-bold">
                  Bambang Pamungkas
                </span>
                <span className="font-caption text-caption text-outline">Pesona Nusantara</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-14rem)] flex-1">
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          {/* Progress Stepper Tracker Bar */}
          <div className="w-full bg-surface-container-lowest shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm items-center">
                {/* Step 1: Completed */}
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                    <MaterialIcon name="check" className="text-[18px] font-bold" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-caption text-caption text-outline">Langkah 1</span>
                    <span className="font-body-semibold text-body-semibold text-on-surface truncate font-bold">
                      Pilih Paket & Jadwal
                    </span>
                  </div>
                </div>

                {/* Step 2: Active */}
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-md">
                    <span className="font-micro-badge text-micro-badge font-bold">02</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-caption text-caption text-secondary-container font-semibold font-bold">
                      Sedang Aktif
                    </span>
                    <span className="font-body-semibold text-body-semibold text-primary truncate font-bold">
                      Data Pemesan & Manifes
                    </span>
                  </div>
                </div>

                {/* Step 3: Upcoming */}
                <div className="flex items-center gap-space-sm opacity-60">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
                    <span className="font-micro-badge text-micro-badge font-bold">03</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-caption text-caption text-outline">Langkah 3</span>
                    <span className="font-body-regular text-body-regular text-on-surface truncate">
                      Pembayaran Escrow
                    </span>
                  </div>
                </div>

                {/* Step 4: Upcoming */}
                <div className="flex items-center gap-space-sm opacity-60">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
                    <span className="font-micro-badge text-micro-badge font-bold">04</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-caption text-caption text-outline">Langkah 4</span>
                    <span className="font-body-regular text-body-regular text-on-surface truncate">
                      E-Tiket & Konfirmasi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pessimistic Slot-Lock Urgency Countdown Banner */}
          <div className="w-full bg-[#fffbeb] border-b border-[#fef3c7] py-2.5 px-6 lg:px-12 text-[#92400e] text-caption font-body-semibold">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MaterialIcon name="timer" className="text-[18px] text-secondary animate-pulse" />
                <span>
                  Sisa Waktu Kunci Kuota Kursi:{" "}
                  <strong id="lock-timer" className="text-secondary font-bold font-mono">
                    {formatTimer(countdownSeconds)}
                  </strong>
                </span>
              </div>
              <span className="hidden sm:inline text-xs text-outline">PostgreSQL Pessimistic Row-Lock Aktif</span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 w-full">
              <div className="p-4 rounded-xl bg-error-container text-on-error-container text-body-semibold flex items-center gap-2">
                <MaterialIcon name="error" className="text-[20px]" />
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Main Content Layout (Desktop 65% Left / 35% Right) */}
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              {/* LEFT COLUMN: Forms, Passengers Manifest, Pickups & Payment */}
              <div className="lg:col-span-8 flex flex-col gap-space-xl">
                {/* Section A: Data Pemesan (Kontak Utama) */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
                  <div className="flex items-start justify-between pb-space-md mb-space-md bg-surface-container-low/40 -mx-space-lg -mt-space-lg p-space-lg rounded-t-xl">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-space-xs">
                        <MaterialIcon name="person_pin" className="text-primary text-[20px]" />
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          Data Pemesan (Kontak Utama)
                        </h2>
                      </div>
                      <p className="font-caption text-caption text-outline">
                        Penanggung Jawab Pemesanan & Penerima E-Ticket Resmi
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container-high text-primary font-caption text-caption font-semibold font-bold">
                      <MaterialIcon name="shield" className="text-[14px]" /> Terverifikasi
                    </span>
                  </div>

                  <div className="flex items-center gap-space-sm mb-space-lg bg-surface-container-low p-space-sm rounded-lg">
                    <input
                      checked={isSelfPassenger}
                      onChange={(e) => setIsSelfPassenger(e.target.checked)}
                      className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary cursor-pointer"
                      id="is-passenger"
                      type="checkbox"
                    />
                    <label className="font-body-regular text-body-regular text-on-surface cursor-pointer select-none" htmlFor="is-passenger">
                      Saya juga salah satu peserta yang ikut berangkat ke lokasi wisata
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    {/* Full Name */}
                    <div className="flex flex-col gap-space-xs md:col-span-2">
                      <label className="font-body-semibold text-body-semibold text-on-surface font-bold">
                        Nama Lengkap <span className="text-error">*</span>{" "}
                        <span className="font-caption text-caption text-outline">(Sesuai KTP / Paspor)</span>
                      </label>
                      <input
                        className="w-full px-space-md py-space-sm rounded-lg bg-surface font-body-regular text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-inner border border-surface-container-high"
                        placeholder="Masukkan nama lengkap pemesan"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-space-xs">
                      <label className="font-body-semibold text-body-semibold text-on-surface font-bold">
                        Email Aktif <span className="text-error">*</span>{" "}
                        <span className="font-caption text-caption text-outline">(Pengiriman Invoice & E-Ticket PDF)</span>
                      </label>
                      <input
                        className="w-full px-space-md py-space-sm rounded-lg bg-surface font-body-regular text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-inner border border-surface-container-high"
                        placeholder="contoh@domain.com"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                      />
                    </div>

                    {/* WhatsApp */}
                    <div className="flex flex-col gap-space-xs">
                      <div className="flex items-center justify-between">
                        <label className="font-body-semibold text-body-semibold text-on-surface font-bold">
                          Nomor WhatsApp <span className="text-error">*</span>
                        </label>
                        <span className="inline-flex items-center gap-0.5 text-[#059669] font-caption text-caption font-semibold font-bold">
                          <MaterialIcon name="check_circle" className="text-[14px]" /> Nomor Aktif
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          className="w-full px-space-md py-space-sm rounded-lg bg-surface font-body-regular text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-inner border border-surface-container-high"
                          placeholder="+62 812 3456 7890"
                          type="tel"
                          value={customerWhatsapp}
                          onChange={(e) => setCustomerWhatsapp(e.target.value)}
                          required
                        />
                        <span className="absolute right-3 material-symbols-outlined text-[18px] text-outline pointer-events-none">
                          sms
                        </span>
                      </div>
                      <span className="font-caption text-caption text-outline">
                        Untuk koordinasi grup WhatsApp tour leader H-1 jam 19:00 WIB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section B: Manifes Penumpang Terstandarisasi TNBTS / KSOP */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-md mb-space-md">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <MaterialIcon name="badge" className="text-primary text-[20px]" />
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          Manifes Penumpang Resmi
                        </h2>
                      </div>
                      <p className="font-caption text-caption text-outline">
                        Standar Perizinan SIMAKSI TNBTS & Registrasi Asuransi Jasa Raharja
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-primary-fixed text-primary font-micro-badge text-micro-badge uppercase tracking-wider font-bold">
                      {pax} Pax Terkunci
                    </span>
                  </div>

                  {/* UU PDP & AES-256 Compliance Banner */}
                  <div className="flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container-low mb-space-lg">
                    <MaterialIcon name="verified_user" className="text-primary text-[22px] shrink-0 mt-0.5" />
                    <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
                      <strong>Kepatuhan UU PDP No. 27/2022:</strong> Seluruh data identitas kependudukan Anda dienkripsi berlapis (AES-256) di server Nusabook. Data manifes ini khusus diserahkan ke Balai Besar Taman Nasional Bromo Tengger Semeru (TNBTS) dan PT Asuransi Jasa Raharja untuk proteksi keselamatan operasional.
                    </p>
                  </div>

                  <div className="space-y-space-lg">
                    {passengers.map((passenger, idx) => (
                      <div key={idx} className="bg-surface-container-low/60 rounded-xl p-space-md shadow-sm border border-surface-container">
                        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md pb-space-sm bg-surface-container-high/50 -mx-space-md -mt-space-md p-space-md rounded-t-xl">
                          <div className="flex items-center gap-space-xs">
                            <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-micro-badge text-micro-badge font-bold">
                              {idx + 1}
                            </span>
                            <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                              Peserta {idx + 1} {idx === 0 ? "(Pemesan Utama)" : ""}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-caption text-caption font-semibold font-bold">
                              Dewasa
                            </span>
                          </div>
                          <div className="flex items-center gap-space-xs">
                            <span className="font-caption text-caption text-outline">Kewarganegaraan:</span>
                            <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                              WNI (KTP)
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                          {/* Name */}
                          <div className="flex flex-col gap-space-xs">
                            <label className="font-body-semibold text-body-semibold text-on-surface font-bold">
                              Nama Lengkap Sesuai KTP <span className="text-error">*</span>
                            </label>
                            <input
                              className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest font-body-regular text-on-surface shadow-sm focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high"
                              type="text"
                              value={passenger.fullName}
                              onChange={(e) => handlePassengerChange(idx, "fullName", e.target.value)}
                              placeholder={`Nama lengkap peserta ${idx + 1}`}
                              required
                            />
                          </div>

                          {/* Identity Type & NIK */}
                          <div className="flex flex-col gap-space-xs">
                            <label className="font-body-semibold text-body-semibold text-on-surface font-bold">
                              Nomor Induk Kependudukan (NIK 16 Digit) <span className="text-error">*</span>
                            </label>
                            <div className="flex gap-space-xs">
                              <span className="inline-flex items-center px-space-sm bg-surface-container-highest font-caption text-caption font-bold text-on-surface-variant rounded-lg">
                                KTP
                              </span>
                              <input
                                className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest font-body-regular text-on-surface font-mono shadow-sm focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high"
                                maxLength={16}
                                type="text"
                                value={passenger.idCardNumber}
                                onChange={(e) => handlePassengerChange(idx, "idCardNumber", e.target.value)}
                                placeholder="16 digit NIK"
                              />
                            </div>
                          </div>

                          {/* Gender */}
                          <div className="flex flex-col gap-space-xs">
                            <label className="font-body-semibold text-body-semibold text-on-surface font-bold">
                              Jenis Kelamin <span className="text-error">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-space-xs">
                              <button
                                type="button"
                                onClick={() => handlePassengerChange(idx, "gender", "MALE")}
                                className={`py-space-sm px-space-sm rounded-lg font-body-semibold text-body-semibold flex items-center justify-center gap-1 transition-all ${
                                  passenger.gender === "MALE"
                                    ? "bg-primary-container text-on-primary shadow-sm"
                                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"
                                }`}
                              >
                                <MaterialIcon name="male" className="text-[16px]" />
                                <span>Laki-laki</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePassengerChange(idx, "gender", "FEMALE")}
                                className={`py-space-sm px-space-sm rounded-lg font-body-semibold text-body-semibold flex items-center justify-center gap-1 transition-all ${
                                  passenger.gender === "FEMALE"
                                    ? "bg-primary-container text-on-primary shadow-sm"
                                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"
                                }`}
                              >
                                <MaterialIcon name="female" className="text-[16px]" />
                                <span>Perempuan</span>
                              </button>
                            </div>
                          </div>

                          {/* DOB */}
                          <div className="flex flex-col gap-space-xs">
                            <label className="font-body-semibold text-body-semibold text-on-surface font-bold">
                              Tanggal Lahir <span className="text-error">*</span>
                            </label>
                            <input
                              className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest font-body-regular text-on-surface shadow-sm focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high"
                              type="text"
                              value={passenger.dateOfBirth}
                              onChange={(e) => handlePassengerChange(idx, "dateOfBirth", e.target.value)}
                              placeholder="Contoh: 15 September 1995"
                            />
                          </div>

                          {/* Emergency Contact */}
                          <div className="flex flex-col gap-space-xs md:col-span-2">
                            <label className="font-body-semibold text-body-semibold text-on-surface font-bold">
                              Kontak Darurat (Nama, Hubungan & No. WhatsApp) <span className="text-error">*</span>
                            </label>
                            <input
                              className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest font-body-regular text-on-surface shadow-sm focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high"
                              type="text"
                              value={passenger.emergencyContact}
                              onChange={(e) => handlePassengerChange(idx, "emergencyContact", e.target.value)}
                              placeholder="Contoh: Bambang Sudibyo (Ayah) - 08119876543"
                            />
                          </div>

                          {/* Medical Notes */}
                          <div className="flex flex-col gap-space-xs md:col-span-2">
                            <label className="font-body-semibold text-body-semibold text-on-surface">
                              Catatan Medis Khusus / Alergi Dingin (Opsional)
                            </label>
                            <input
                              className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest font-body-regular text-on-surface shadow-sm focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high"
                              type="text"
                              value={passenger.notes || ""}
                              onChange={(e) => handlePassengerChange(idx, "notes", e.target.value)}
                              placeholder="Misal: Riwayat asma, ukuran jaket L"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section C: Titik Penjemputan Fleksibel & Logistik Area Malang */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
                  <div className="flex items-center gap-space-xs mb-space-sm">
                    <MaterialIcon name="pin_drop" className="text-primary text-[20px]" />
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Titik Penjemputan Fleksibel (Malang Area)
                    </h2>
                  </div>
                  <p className="font-caption text-caption text-outline mb-space-md">
                    Armada Toyota HiAce Commuter Paguyuban Bromo akan menjemput sesuai jadwal yang dipilih.
                  </p>
                  <div className="space-y-space-sm">
                    {/* Option 1: Stasiun Malang */}
                    <label
                      onClick={() => setPickupLocation("stasiun")}
                      className={`relative flex items-start gap-space-md p-space-md rounded-xl cursor-pointer transition-all border ${
                        pickupLocation === "stasiun"
                          ? "bg-surface-container-low border-primary"
                          : "bg-surface-container hover:bg-surface-container-low border-transparent"
                      }`}
                    >
                      <input
                        checked={pickupLocation === "stasiun"}
                        onChange={() => setPickupLocation("stasiun")}
                        className="mt-1 w-4 h-4 text-primary accent-primary cursor-pointer"
                        name="pickup-location"
                        type="radio"
                        value="stasiun"
                      />
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex flex-wrap items-center justify-between gap-space-xs">
                          <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Stasiun Kereta Api Malang Kota Baru (Pintu Timur)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-caption text-caption font-semibold font-bold">
                            Jemput: 00:15 WIB
                          </span>
                        </div>
                        <p className="font-caption text-caption text-on-surface-variant">
                          Titik kumpul resmi di depan gerai Indomaret Point Pintu Timur Stasiun. Tour guide memegang papan bendera Pesona Nusantara.
                        </p>
                      </div>
                    </label>

                    {/* Option 2: Hotel Area Malang */}
                    <label
                      onClick={() => setPickupLocation("hotel")}
                      className={`relative flex items-start gap-space-md p-space-md rounded-xl cursor-pointer transition-all border ${
                        pickupLocation === "hotel"
                          ? "bg-surface-container-low border-primary"
                          : "bg-surface-container hover:bg-surface-container-low border-transparent"
                      }`}
                    >
                      <input
                        checked={pickupLocation === "hotel"}
                        onChange={() => setPickupLocation("hotel")}
                        className="mt-1 w-4 h-4 text-primary accent-primary cursor-pointer"
                        name="pickup-location"
                        type="radio"
                        value="hotel"
                      />
                      <div className="flex flex-col gap-space-xs w-full">
                        <div className="flex flex-wrap items-center justify-between gap-space-xs">
                          <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Hotel / Penginapan Pribadi (Area Kota Malang)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-caption text-caption font-bold">
                            Radius Bebas 5 KM
                          </span>
                        </div>
                        <p className="font-caption text-caption text-outline">
                          Driver menjemput langsung di lobi hotel antara pukul 23:45 s/d 00:30 WIB.
                        </p>
                        {pickupLocation === "hotel" && (
                          <input
                            className="mt-1 w-full px-space-md py-space-sm rounded-lg bg-surface font-body-regular text-body-regular text-on-surface focus:outline-none border border-surface-container-high"
                            placeholder="Masukkan Nama Hotel & Nomor Kamar (Contoh: Whiz Prime Hotel Jl. Basuki Rahmat)"
                            type="text"
                            value={hotelDetails}
                            onChange={(e) => setHotelDetails(e.target.value)}
                          />
                        )}
                      </div>
                    </label>

                    {/* Option 3: Terminal Arjosari */}
                    <label
                      onClick={() => setPickupLocation("terminal")}
                      className={`relative flex items-start gap-space-md p-space-md rounded-xl cursor-pointer transition-all border ${
                        pickupLocation === "terminal"
                          ? "bg-surface-container-low border-primary"
                          : "bg-surface-container hover:bg-surface-container-low border-transparent"
                      }`}
                    >
                      <input
                        checked={pickupLocation === "terminal"}
                        onChange={() => setPickupLocation("terminal")}
                        className="mt-1 w-4 h-4 text-primary accent-primary cursor-pointer"
                        name="pickup-location"
                        type="radio"
                        value="terminal"
                      />
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex flex-wrap items-center justify-between gap-space-xs">
                          <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Terminal Arjosari Malang (Lobi Kedatangan Bus AKAP)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-caption text-caption font-bold">
                            Jemput: 00:30 WIB
                          </span>
                        </div>
                        <p className="font-caption text-caption text-outline">
                          Kumpul di area ruang tunggu utama samping Pos Polisi Terminal Arjosari.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Section D: Metode Pembayaran Terintegrasi Escrow */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
                  <div className="flex items-center gap-space-xs mb-space-xs">
                    <MaterialIcon name="account_balance_wallet" className="text-primary text-[20px]" />
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Metode Pembayaran (Escrow Safe Vault)
                    </h2>
                  </div>
                  {/* Escrow Info Badge */}
                  <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center gap-space-sm mb-space-md">
                    <MaterialIcon name="lock" className="text-primary text-[20px] shrink-0" />
                    <span className="font-caption text-caption text-on-surface-variant">
                      Dana Anda 100% aman di rekening bersama resmi Nusabook. Dana baru dilepaskan ke operator setelah trip selesai dilaksanakan.
                    </span>
                  </div>

                  <div className="space-y-space-sm">
                    {/* Option 1: Virtual Account */}
                    <div
                      onClick={() => setPaymentMethod("va")}
                      className={`p-space-md rounded-xl cursor-pointer transition-all border ${
                        paymentMethod === "va"
                          ? "bg-surface-container-low border-primary"
                          : "bg-surface-container hover:bg-surface-container-low border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-md">
                          <input
                            checked={paymentMethod === "va"}
                            onChange={() => setPaymentMethod("va")}
                            className="w-4 h-4 text-primary accent-primary cursor-pointer"
                            id="pay-va"
                            name="payment-method"
                            type="radio"
                          />
                          <label className="cursor-pointer" htmlFor="pay-va">
                            <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                              Virtual Account Otomatis (Midtrans Direct)
                            </span>
                            <span className="font-caption text-caption text-outline">
                              BCA, Mandiri, BNI, BRI, Permata - Verifikasi Real-Time 24/7
                            </span>
                          </label>
                        </div>
                        <span className="font-micro-badge text-micro-badge font-bold px-2 py-0.5 rounded bg-primary-fixed text-primary uppercase">
                          Rekomendasi
                        </span>
                      </div>
                      <div className="mt-space-md pl-7 grid grid-cols-4 gap-space-xs">
                        <div className="bg-surface-container-lowest p-2 rounded-lg text-center font-caption text-caption font-bold text-primary shadow-xs">
                          BCA VA
                        </div>
                        <div className="bg-surface-container-lowest p-2 rounded-lg text-center font-caption text-caption font-bold text-primary shadow-xs">
                          MANDIRI
                        </div>
                        <div className="bg-surface-container-lowest p-2 rounded-lg text-center font-caption text-caption font-bold text-primary shadow-xs">
                          BNI VA
                        </div>
                        <div className="bg-surface-container-lowest p-2 rounded-lg text-center font-caption text-caption font-bold text-primary shadow-xs">
                          BRI VA
                        </div>
                      </div>
                    </div>

                    {/* Option 2: QRIS Instan */}
                    <div
                      onClick={() => setPaymentMethod("qris")}
                      className={`p-space-md rounded-xl cursor-pointer transition-all border ${
                        paymentMethod === "qris"
                          ? "bg-surface-container-low border-primary"
                          : "bg-surface-container hover:bg-surface-container-low border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-md">
                          <input
                            checked={paymentMethod === "qris"}
                            onChange={() => setPaymentMethod("qris")}
                            className="w-4 h-4 text-primary accent-primary cursor-pointer"
                            id="pay-qris"
                            name="payment-method"
                            type="radio"
                          />
                          <label className="cursor-pointer" htmlFor="pay-qris">
                            <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                              QRIS Nasional (Semua Bank & E-Wallet)
                            </span>
                            <span className="font-caption text-caption text-outline">
                              Scan cepat menggunakan GoPay, OVO, Dana, ShopeePay, atau Mobile Banking
                            </span>
                          </label>
                        </div>
                        <MaterialIcon name="qr_code_scanner" className="text-[20px] text-outline" />
                      </div>
                    </div>

                    {/* Option 3: Kartu Kredit / Debit Online */}
                    <div
                      onClick={() => setPaymentMethod("cc")}
                      className={`p-space-md rounded-xl cursor-pointer transition-all border ${
                        paymentMethod === "cc"
                          ? "bg-surface-container-low border-primary"
                          : "bg-surface-container hover:bg-surface-container-low border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-md">
                          <input
                            checked={paymentMethod === "cc"}
                            onChange={() => setPaymentMethod("cc")}
                            className="w-4 h-4 text-primary accent-primary cursor-pointer"
                            id="pay-cc"
                            name="payment-method"
                            type="radio"
                          />
                          <label className="cursor-pointer" htmlFor="pay-cc">
                            <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                              Kartu Kredit / Debit Online (3D Secure)
                            </span>
                            <span className="font-caption text-caption text-outline">
                              Visa, Mastercard, JCB berlogo prinsipal resmi
                            </span>
                          </label>
                        </div>
                        <MaterialIcon name="credit_card" className="text-[20px] text-outline" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Sticky Booking Summary, Price Breakdown & CTA Button */}
              <div className="lg:col-span-4 sticky top-24 flex flex-col gap-space-lg">
                {/* Summary Card */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface pb-space-sm mb-space-md bg-surface-container-low/50 -mx-space-lg -mt-space-lg p-space-lg rounded-t-xl font-bold">
                    Ringkasan Pesanan
                  </h3>

                  {/* Trip Thumbnail Info */}
                  <div className="flex gap-space-md mb-space-md">
                    <img
                      className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-xs"
                      alt="Mount Bromo active crater"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDmkLJizAb27p16NLtWKjfRcusg6nTqC8cmWTMOoT32cP2W9bII51cYaG9zodmHvVH_Mj1zuFbl1W572c7MLA4lA07C8Gf_N15NuwIP8HjeVe9ZXWko-FMDDhUui40UFVBpun0CAjRItCBKb5bjvSNs4r1uus6SoD36gVZcj0GlybRYaqo5IipRWfIhKmoHAiBkenCUmBRNReFMkjLNEB1VfEdAzx9LDH4pMIQrkhjxFPIswPR_Dc"
                    />
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="font-micro-badge text-micro-badge text-secondary-container uppercase font-bold tracking-wider">
                        Open Trip Eksklusif
                      </span>
                      <h4 className="font-body-semibold text-body-semibold text-on-surface leading-snug truncate font-bold">
                        {tripTitle}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <MaterialIcon name="verified" className="text-[14px] text-primary" />
                        <span className="font-caption text-caption text-outline truncate">Pesona Nusantara Tour</span>
                      </div>
                    </div>
                  </div>

                  {/* Trip Quick Specs */}
                  <div className="space-y-space-xs p-space-sm bg-surface-container-low rounded-xl mb-space-md font-caption text-caption">
                    <div className="flex items-center justify-between">
                      <span className="text-outline flex items-center gap-1">
                        <MaterialIcon name="calendar_today" className="text-[16px]" /> Tanggal Trip
                      </span>
                      <span className="font-body-semibold text-on-surface font-bold">Min, 18 Okt 2026</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-outline flex items-center gap-1">
                        <MaterialIcon name="schedule" className="text-[16px]" /> Waktu Tempuh
                      </span>
                      <span className="font-body-semibold text-on-surface font-bold">00:00 - 13:00 WIB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-outline flex items-center gap-1">
                        <MaterialIcon name="group" className="text-[16px]" /> Jumlah Peserta
                      </span>
                      <span className="font-body-semibold text-primary font-bold">{pax} Pax (Terkunci)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-outline flex items-center gap-1">
                        <MaterialIcon name="location_on" className="text-[16px]" /> Titik Jemput
                      </span>
                      <span className="font-body-semibold text-on-surface truncate ml-2 font-bold">
                        {pickupLocation === "stasiun"
                          ? "Stasiun Malang Kota Baru"
                          : pickupLocation === "hotel"
                          ? "Hotel (Malang Kota)"
                          : "Terminal Arjosari"}
                      </span>
                    </div>
                  </div>

                  {/* Transparent Price Breakdown */}
                  <div className="pt-space-sm mb-space-md space-y-space-xs">
                    <div className="flex items-center justify-between font-body-regular text-body-regular text-on-surface-variant">
                      <span>Tiket Paket Open Trip ({pax} Pax)</span>
                      <span className="font-body-semibold text-on-surface font-bold">{formatRupiah(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <MaterialIcon name="check" className="text-[14px] text-[#059669]" /> SIMAKSI TNBTS ({pax} Pax)
                      </span>
                      <span className="text-[#059669] font-semibold font-bold">Termasuk</span>
                    </div>
                    <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <MaterialIcon name="check" className="text-[14px] text-[#059669]" /> Asuransi Jasa Raharja
                      </span>
                      <span className="text-[#059669] font-semibold font-bold">Termasuk</span>
                    </div>
                    <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <MaterialIcon name="check" className="text-[14px] text-[#059669]" /> Jeep Hardtop 4x4 Paguyuban
                      </span>
                      <span className="text-[#059669] font-semibold font-bold">Termasuk</span>
                    </div>

                    {/* Total Calculation */}
                    <div className="pt-space-sm mt-space-sm bg-surface-container-high/40 p-space-sm rounded-lg flex items-baseline justify-between border-t border-surface-container-high">
                      <div>
                        <span className="font-caption text-caption text-outline uppercase font-bold tracking-wider block">
                          Total Tagihan
                        </span>
                        <span className="font-caption text-caption text-outline">Termasuk Pajak & Retribusi</span>
                      </div>
                      <div className="text-right">
                        <span className="font-headline-md text-headline-md font-bold text-primary">
                          {formatRupiah(subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trust & Escrow Guarantee Strip */}
                  <div className="bg-surface-container-low p-space-sm rounded-xl mb-space-lg space-y-1.5">
                    <div className="flex items-center gap-space-xs text-[#059669]">
                      <MaterialIcon name="verified" className="text-[18px]" />
                      <span className="font-caption text-caption font-semibold font-bold">
                        100% Garansi Pasti Berangkat
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs text-on-surface-variant">
                      <MaterialIcon name="history" className="text-[18px] text-primary" />
                      <span className="font-caption text-caption">Refund 100% jika dibatalkan H-7 trip</span>
                    </div>
                    <div className="flex items-center gap-space-xs text-on-surface-variant">
                      <MaterialIcon name="lock" className="text-[18px] text-primary" />
                      <span className="font-caption text-caption">Enkripsi SSL 256-bit Standar OJK & BI</span>
                    </div>
                  </div>

                  {/* Big Action CTA Button */}
                  <button
                    disabled={isPending}
                    type="submit"
                    className="w-full py-3.5 px-space-md rounded-xl bg-secondary-container text-on-secondary font-body-semibold text-body-semibold shadow-md hover:bg-secondary transition-all flex items-center justify-center gap-space-sm font-bold disabled:opacity-50 cursor-pointer"
                  >
                    <span>{isPending ? "Memproses Kunci Kuota..." : "Lanjut ke Pembayaran Aman"}</span>
                    <MaterialIcon name="arrow_forward" className="text-[20px]" />
                  </button>
                  <p className="font-caption text-caption text-outline text-center mt-space-sm leading-tight">
                    Dengan melanjutkan, Anda menyetujui{" "}
                    <Link className="text-primary hover:underline" href="/terms">
                      Syarat & Ketentuan
                    </Link>{" "}
                    serta{" "}
                    <Link className="text-primary hover:underline" href="/privacy">
                      Kebijakan Privasi
                    </Link>{" "}
                    Nusabook.
                  </p>
                </div>

                {/* Help Desk Assistance */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-xs shrink-0">
                    <MaterialIcon name="support_agent" className="text-[22px]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                      Butuh Bantuan Reservasi?
                    </span>
                    <span className="font-caption text-caption text-outline">
                      Hubungi Tim Concierge Nusabook via WhatsApp (Respon &lt; 2 menit)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-low py-space-xl border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant">
          <div className="flex items-center gap-space-sm">
            <img
              alt="Nusabook Brand Logo"
              className="h-6 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1U3Dc9ujBNuM7mgSPnQReIZqJpbXFrgBa8_v7KkLAxGoGg-NCEjy4Aw-pYXp9CiKsNHmqpLEMF2TzdVBIjehkrvhOp1eK3eYIfA64704YK0SOXTQb6gBESs7Xo_FJmMnJpYGla99v_5KwfnRrPX3mOY81yQP8OnvPcRn6zitzBMcBKr14d077mBMYP9cT2gZ37ppBCN_acPq-kd6A4kNOGLXs6_FK5SnaikbZm8kopURdxI0y2YnoftJw"
            />
            <span className="font-body-semibold text-body-semibold text-primary font-bold">
              Nusabook UMKM Pariwisata
            </span>
          </div>
          <div className="font-caption text-caption text-outline">© 2026 Nusabook Indonesia. Hak Cipta Dilindungi.</div>
        </div>
      </footer>
    </div>
  );
}
