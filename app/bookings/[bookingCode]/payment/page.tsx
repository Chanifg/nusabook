"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/icon";

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export default function PaymentInstructionPage({
  params,
}: {
  params: Promise<{ bookingCode: string }>;
}) {
  const { bookingCode } = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"mbca" | "mybca" | "klikbca" | "atm">("mbca");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkLabel, setCheckLabel] = useState<string>("Cek Status Pembayaran");

  // Real-time countdown
  const initialSeconds = 20 * 60;
  const [totalSeconds, setTotalSeconds] = useState<number>(14 * 60 + 42);

  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    showToast(message);
  };

  const formatClock = (seconds: number) => {
    if (seconds <= 0) return "00:00 (Expired)";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const progressPercent = Math.max(0, Math.min(100, (totalSeconds / initialSeconds) * 100));

  const triggerCheckPayment = async () => {
    setIsChecking(true);
    setCheckLabel("Menghubungkan ke Bank...");

    try {
      // Trigger simulation webhook for dev/testing
      const res = await fetch("/api/webhooks/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingCode,
          status: "PAID",
          transactionId: `TRX-${Date.now()}`,
          signature: "SIMULATED_TEST_SIGNATURE",
        }),
      });

      if (res.ok) {
        setCheckLabel("Pembayaran Terverifikasi!");
        showToast("Pembayaran berhasil diverifikasi!");
        setTimeout(() => {
          router.push(`/bookings/${bookingCode}`);
        }, 1200);
      } else {
        setCheckLabel("Belum Ada Mutasi Masuk");
        showToast("Belum ada mutasi masuk. Silakan selesaikan transfer.");
        setTimeout(() => setCheckLabel("Cek Status Pembayaran"), 3000);
      }
    } catch {
      setCheckLabel("Belum Ada Mutasi Masuk");
      showToast("Gagal memverifikasi status pembayaran.");
      setTimeout(() => setCheckLabel("Cek Status Pembayaran"), 3000);
    } finally {
      setIsChecking(false);
    }
  };

  const vaNumber = "8277 0812 3456 7890";
  const cleanVaNumber = "8277081234567890";
  const totalAmount = 850000;

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
            <Link className="font-body-regular text-body-regular text-on-surface-variant hover:text-on-surface transition-colors" href="/pesona-merapi">
              Etalase Paket
            </Link>
            <span className="transition-colors text-primary font-body-semibold font-bold">
              Instruksi Pembayaran
            </span>
            <Link className="font-body-regular text-body-regular text-on-surface-variant hover:text-on-surface transition-colors" href="/dashboard">
              Operator Backoffice
            </Link>
          </nav>

          <div className="flex items-center gap-space-md">
            <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1.5 rounded-full text-on-surface-variant">
              <MaterialIcon name="lock" className="text-[16px] text-primary" />
              <span className="font-caption text-caption font-semibold text-primary font-bold">
                Escrow Terproteksi
              </span>
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

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-space-sm bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-lg shadow-xl animate-bounce">
          <MaterialIcon name="check_circle" className="text-[#10b981] text-[20px]" />
          <span className="font-body-semibold text-body-semibold">{toastMessage}</span>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-14rem)] flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-space-lg w-full">
          {/* 1. Stepper Alur Pemesanan Nusabook */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm mb-space-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm relative">
              {/* Step 1: Completed */}
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
                  <MaterialIcon name="check" className="text-[18px]" />
                </div>
                <div className="min-w-0">
                  <p className="font-caption text-caption text-outline uppercase tracking-wider">Langkah 1</p>
                  <p className="font-body-semibold text-body-semibold text-on-surface truncate font-bold">
                    Paket & Jadwal
                  </p>
                </div>
              </div>

              {/* Step 2: Completed */}
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
                  <MaterialIcon name="check" className="text-[18px]" />
                </div>
                <div className="min-w-0">
                  <p className="font-caption text-caption text-outline uppercase tracking-wider">Langkah 2</p>
                  <p className="font-body-semibold text-body-semibold text-on-surface truncate font-bold">
                    Data & Manifes
                  </p>
                </div>
              </div>

              {/* Step 3: Active */}
              <div className="flex items-center gap-space-sm bg-primary-fixed/30 p-space-xs rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary shrink-0 ring-4 ring-primary-fixed font-bold">
                  3
                </div>
                <div className="min-w-0">
                  <span className="font-micro-badge text-micro-badge font-bold uppercase tracking-wider text-primary">
                    Sedang Berlangsung
                  </span>
                  <p className="font-body-semibold text-body-semibold text-primary truncate font-bold">
                    Pembayaran Escrow
                  </p>
                </div>
              </div>

              {/* Step 4: Pending */}
              <div className="flex items-center gap-space-sm opacity-60">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline shrink-0 font-bold">
                  4
                </div>
                <div className="min-w-0">
                  <p className="font-caption text-caption text-outline uppercase tracking-wider">Langkah 4</p>
                  <p className="font-body-semibold text-body-semibold text-on-surface-variant truncate">
                    E-Tiket & Konfirmasi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Header & Banner Status Reservasi + Countdown Timer */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm mb-space-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
              {/* Left: Status & Booking Code */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex flex-wrap items-center gap-space-sm">
                  <div className="inline-flex items-center gap-space-xs bg-[#fffbeb] text-[#d97706] px-space-sm py-1 rounded-full">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping" />
                    <span className="font-caption text-caption font-semibold font-bold">
                      Menunggu Pembayaran (Pending Settlement)
                    </span>
                  </div>
                  <span className="font-caption text-caption text-outline">|</span>
                  <span className="font-caption text-caption text-on-surface-variant">
                    Metode: <strong className="text-on-surface">BCA Virtual Account</strong>
                  </span>
                </div>
                <div className="flex items-center gap-space-sm mt-1">
                  <span className="font-caption text-caption text-on-surface-variant">Kode Reservasi:</span>
                  <span className="font-title-md text-title-md font-bold text-primary tracking-wide">
                    {bookingCode}
                  </span>
                  <button
                    className="inline-flex items-center gap-1 text-primary hover:text-primary-container p-1 rounded hover:bg-surface-container-low transition-colors font-bold"
                    onClick={() => copyToClipboard(bookingCode, "Kode Booking berhasil disalin!")}
                    type="button"
                  >
                    <MaterialIcon name="content_copy" className="text-[18px]" />
                    <span className="font-caption text-caption font-semibold">Salin</span>
                  </button>
                </div>
              </div>

              {/* Right: Real-time Quota TTL Countdown Card */}
              <div className="bg-secondary-fixed/40 p-space-sm lg:p-space-md rounded-xl flex flex-col justify-center min-w-[280px]">
                <div className="flex items-center justify-between gap-space-md mb-1">
                  <div className="flex items-center gap-space-xs text-secondary font-bold">
                    <MaterialIcon name="timer" className="text-[18px]" />
                    <span className="font-caption text-caption uppercase tracking-wider">Kunci Kursi TTL</span>
                  </div>
                  <span className="font-title-md text-title-md font-bold text-secondary tracking-widest font-mono">
                    {formatClock(totalSeconds)}
                  </span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden mb-1">
                  <div
                    className="bg-secondary-container h-full rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="font-caption text-caption text-on-secondary-fixed-variant leading-tight">
                  <strong>2 Kursi Anda</strong> terkunci otomatis. Pembayaran akan kadaluarsa jika melewati batas waktu.
                </p>
              </div>
            </div>
          </div>

          {/* Main Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* LEFT COLUMN: Instruction, Gateway Details, Interactive Accordion (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-space-lg">
              {/* 3. Kartu Instruksi Pembayaran Utama */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md gap-space-sm border-b border-surface-container-low">
                  <div className="flex items-center gap-space-md">
                    <div className="h-12 w-20 bg-surface-container-low rounded-lg flex items-center justify-center p-2 shadow-xs">
                      <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tighter">
                        BCA
                      </span>
                    </div>
                    <div>
                      <h2 className="font-title-md text-title-md font-bold text-on-surface">
                        BCA Virtual Account
                      </h2>
                      <div className="flex items-center gap-space-xs mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                        <span className="font-caption text-caption text-[#059669] font-semibold font-bold">
                          Verifikasi Otomatis 24/7 (Real-time Webhook)
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="self-start sm:self-center font-caption text-caption font-semibold text-primary hover:text-primary-container bg-surface-container-low hover:bg-surface-container px-space-sm py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 font-bold"
                    type="button"
                  >
                    <span>Ganti Metode</span>
                    <MaterialIcon name="swap_horiz" className="text-[16px]" />
                  </button>
                </div>

                {/* VA & Nominal Information Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mt-space-md">
                  {/* Box 1: Nomor Virtual Account */}
                  <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="font-caption text-caption text-outline font-semibold uppercase tracking-wider block font-bold">
                        Nomor Virtual Account
                      </span>
                      <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-wider mt-1 block select-all font-mono">
                        {vaNumber}
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant block mt-0.5">
                        Atas Nama: Nusabook - Pesona Nusantara
                      </span>
                    </div>
                    <button
                      className="mt-space-md w-full bg-surface-container hover:bg-surface-container-high text-primary font-body-semibold text-body-semibold py-2 px-space-sm rounded-lg flex items-center justify-center gap-space-xs transition-colors font-bold"
                      onClick={() => copyToClipboard(cleanVaNumber, "Nomor Virtual Account disalin!")}
                      type="button"
                    >
                      <MaterialIcon name="copy_all" className="text-[18px]" />
                      <span>Salin Nomor VA</span>
                    </button>
                  </div>

                  {/* Box 2: Total Pembayaran */}
                  <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="font-caption text-caption text-outline font-semibold uppercase tracking-wider block font-bold">
                        Total Tagihan Transfer
                      </span>
                      <span className="font-headline-md text-headline-md font-bold text-secondary mt-1 block">
                        {formatRupiah(totalAmount)}
                      </span>
                      <span className="font-caption text-caption text-[#059669] font-medium block mt-0.5 font-bold">
                        Bebas Biaya Admin (Midtrans Partner)
                      </span>
                    </div>
                    <button
                      className="mt-space-md w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-body-semibold text-body-semibold py-2 px-space-sm rounded-lg flex items-center justify-center gap-space-xs transition-colors font-bold"
                      onClick={() => copyToClipboard(totalAmount.toString(), `Nominal transfer ${formatRupiah(totalAmount)} disalin!`)}
                      type="button"
                    >
                      <MaterialIcon name="receipt_long" className="text-[18px]" />
                      <span>Salin Jumlah Tagihan</span>
                    </button>
                  </div>
                </div>

                {/* Exact Transfer Note */}
                <div className="bg-surface-container p-space-sm rounded-lg mt-space-md flex items-start gap-space-sm">
                  <MaterialIcon name="info" className="text-primary text-[20px] shrink-0 mt-0.5" />
                  <p className="font-caption text-caption text-on-surface-variant">
                    Transfer tepat hingga digit terakhir agar sistem <strong>Nusabook Live Gateway</strong> dapat memverifikasi pembayaran Anda secara otomatis dalam hitungan detik tanpa perlu unggah bukti struk manual.
                  </p>
                </div>

                {/* Escrow Guarantee Banner */}
                <div className="mt-space-lg bg-surface-container-high/60 rounded-xl p-space-md flex flex-col sm:flex-row items-start gap-space-md">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-sm">
                    <MaterialIcon name="verified_user" className="text-[28px]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-space-xs">
                      <h3 className="font-body-semibold text-body-semibold text-primary font-bold">
                        Nusabook Escrow Safe Vault™ Terproteksi
                      </h3>
                      <span className="font-micro-badge text-micro-badge bg-primary-container text-on-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        Dijamin 100% Aman
                      </span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
                      Dana Anda sepenuhnya ditahan di Rekening Penampung Aman (Escrow) resmi Nusabook. Dana baru akan diteruskan ke rekening operator <strong>Pesona Nusantara Tour</strong> setelah keberangkatan tuntas dan proses check-in tiket di Bromo terverifikasi oleh kru lapangan.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Tab Panduan Pembayaran Interaktif */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm">
                <div className="flex items-center justify-between mb-space-md">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Panduan Langkah Pembayaran
                  </h3>
                  <span className="font-caption text-caption text-outline">Pilih Saluran BCA</span>
                </div>

                {/* Segmented Tab Navigation */}
                <div className="flex items-center gap-space-xs overflow-x-auto pb-2">
                  {[
                    { id: "mbca", label: "m-BCA (BCA mobile)", icon: "smartphone" },
                    { id: "mybca", label: "myBCA", icon: "apps" },
                    { id: "klikbca", label: "KlikBCA", icon: "laptop_mac" },
                    { id: "atm", label: "ATM BCA", icon: "local_atm" },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-space-md py-2 rounded-lg font-body-semibold text-body-semibold shrink-0 transition-all flex items-center gap-1 font-bold ${
                          isActive
                            ? "text-on-primary bg-primary"
                            : "text-on-surface-variant bg-surface-container-low hover:bg-surface-container"
                        }`}
                        type="button"
                      >
                        <MaterialIcon name={tab.icon} className="text-[18px]" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Step Content Containers */}
                <div className="mt-space-md">
                  {activeTab === "mbca" && (
                    <div className="flex flex-col gap-space-sm">
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          1
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Login ke aplikasi BCA mobile
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Buka aplikasi BCA mobile pada smartphone Anda, pilih menu <strong>m-BCA</strong>, lalu masukkan Kode Akses 6 karakter Anda.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          2
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Pilih m-Transfer &gt; BCA Virtual Account
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Pada dashboard navigasi, ketuk menu <strong>m-Transfer</strong> kemudian pilih opsi <strong>BCA Virtual Account</strong>.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          3
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Input Nomor Virtual Account
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Masukkan nomor <strong>{cleanVaNumber}</strong> ke dalam kolom No. Virtual Account lalu klik tombol <strong>Send</strong>.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          4
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Konfirmasi Rincian & Input PIN m-BCA
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Pastikan nama penerima tertulis <strong>Nusabook Pesona Nusantara</strong> dengan total <strong>Rp 850.000</strong>. Jika benar, masukkan 6 digit PIN m-BCA Anda. Transaksi selesai!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "mybca" && (
                    <div className="flex flex-col gap-space-sm">
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          1
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Masuk ke myBCA
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Buka aplikasi myBCA dan login dengan BCA ID atau biometrik sidik jari / Face ID.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          2
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Pilih Menu Transfer &gt; Virtual Account
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Pilih menu Transfer, kemudian pilih submenu <strong>Virtual Account</strong>.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          3
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Ketik Nomor {cleanVaNumber}
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Masukkan nomor rekening tujuan, lalu tekan Lanjut untuk memverifikasi data tagihan.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          4
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Otorisasi Pembayaran
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Periksa nominal Rp 850.000, lalu masukkan PIN myBCA Anda untuk menyelesaikan reservasi.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "klikbca" && (
                    <div className="flex flex-col gap-space-sm">
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          1
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Akses Website KlikBCA
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Kunjungi klikbca.com dan login menggunakan User ID serta PIN Internet Banking Anda.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          2
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Menu Transfer Dana &gt; Transfer ke BCA Virtual Account
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Pilih menu navigasi sebelah kiri dan klik Transfer ke BCA Virtual Account.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          3
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Masukkan {cleanVaNumber} & Respon KeyBCA
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Ketik nomor VA, masukkan token respon KeyBCA APPLI 1 untuk memvalidasi pembayaran.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "atm" && (
                    <div className="flex flex-col gap-space-sm">
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          1
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Masukkan Kartu & PIN ATM BCA
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Masukkan kartu debit di mesin ATM BCA, lalu ketik PIN 6 digit Anda.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          2
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Pilih Menu Transaksi Lainnya &gt; Transfer
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Pilih Transaksi Lainnya &gt; Transfer &gt; Ke Rekening BCA Virtual Account.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold">
                          3
                        </span>
                        <div>
                          <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                            Masukkan {cleanVaNumber} & Konfirmasi
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Periksa detail di layar monitor ATM (Nusabook Rp 850.000), pilih Ya untuk eksekusi transfer.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Fast Support Concierge Banner */}
                <div className="mt-space-lg bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#059669]">
                      <MaterialIcon name="support_agent" className="text-[24px]" />
                    </div>
                    <div>
                      <p className="font-body-semibold text-body-semibold text-on-surface font-bold">
                        Butuh Panduan atau Kendala Bayar?
                      </p>
                      <p className="font-caption text-caption text-on-surface-variant">
                        Concierge resmi Nusabook siap membantu via WhatsApp 24/7 (Respon &lt; 2 menit)
                      </p>
                    </div>
                  </div>
                  <a
                    className="shrink-0 bg-[#059669] hover:bg-[#047857] text-white px-space-md py-2 rounded-lg font-body-semibold text-body-semibold inline-flex items-center gap-space-xs transition-colors shadow-xs font-bold"
                    href={`https://wa.me/6281234567890?text=Halo%20Nusabook,%20saya%20butuh%20bantuan%20terkait%20pembayaran%20booking%20${bookingCode}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <MaterialIcon name="chat" className="text-[18px]" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary, Manifest & Action Control Sidebar (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-space-lg">
              {/* Order Summary Card */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-sm">
                  Ringkasan Pesanan
                </h3>

                {/* Package Quick View */}
                <div className="relative rounded-lg overflow-hidden h-36 mb-space-md">
                  <img
                    alt="Mount Bromo sunrise caldera"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2IeB3ZB49LAjMAZgyXaPMIry-vijVBPh8bfprLYzaH3nclNC9-1TCzYTwSAuBQcGynq0ReHdhUCWM5G_GBEyMvmuPkxxvv_CK8d1sIof4-6YrQyuxiFC6HYYDqclXmCKuhCXobknIHvpM37JzjXfF4181uY2RpB2WOz_z1CF3E8__MK6r3uFKXzbS9cFIjHrmFoRy8YSDx1pE4Ggauwf3TN1b3A5Oa8-OwLDpbsbnrz8WBFdigPk"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex flex-col justify-end p-space-sm text-on-primary">
                    <span className="font-micro-badge text-micro-badge uppercase tracking-wider font-bold text-secondary-fixed">
                      Open Trip Wisata Bahari & Gunung
                    </span>
                    <h4 className="font-body-semibold text-body-semibold font-bold text-on-primary leading-tight">
                      Bromo Golden Sunrise, Kawah & Pasir Berbisik
                    </h4>
                  </div>
                </div>

                {/* Trip Specifications */}
                <div className="flex flex-col gap-space-xs text-on-surface-variant pb-space-sm">
                  <div className="flex items-center justify-between text-body-regular">
                    <span className="font-caption text-caption text-outline">Operator Mitra:</span>
                    <span className="font-body-semibold text-body-semibold text-primary inline-flex items-center gap-1 font-bold">
                      <span>Pesona Nusantara Tour</span>
                      <MaterialIcon name="verified" className="text-[16px] text-primary" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-body-regular">
                    <span className="font-caption text-caption text-outline">Jadwal Keberangkatan:</span>
                    <span className="font-body-semibold text-body-semibold text-on-surface text-right font-bold">
                      Min, 18 Okt 2026 (00:00 WIB)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-body-regular">
                    <span className="font-caption text-caption text-outline">Titik Kumpul (Meeting Point):</span>
                    <span className="font-body-semibold text-body-semibold text-on-surface text-right font-bold">
                      Stasiun KA Malang (Pintu Timur)
                    </span>
                  </div>
                </div>

                {/* Passenger Manifest Accordion / List */}
                <div className="mt-space-sm bg-surface-container-low p-space-sm rounded-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-caption text-caption font-bold text-on-surface uppercase tracking-wider flex items-center gap-1">
                      <MaterialIcon name="groups" className="text-[16px] text-primary" />
                      <span>Manifes Terdaftar (2 Pax)</span>
                    </span>
                    <span className="font-micro-badge text-micro-badge bg-surface-container-high text-primary px-1.5 py-0.5 rounded font-bold">
                      Lengkap
                    </span>
                  </div>
                  <div className="space-y-1.5 font-caption text-caption text-on-surface">
                    <div className="bg-surface-container-lowest p-1.5 rounded flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-on-surface font-bold">1. Anindya Paramitha</p>
                        <p className="text-outline text-[11px]">NIK: 3578015509950003</p>
                      </div>
                      <MaterialIcon name="check_circle" className="text-[16px] text-[#059669]" />
                    </div>
                    <div className="bg-surface-container-lowest p-1.5 rounded flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-on-surface font-bold">2. Reza Herdian</p>
                        <p className="text-outline text-[11px]">NIK: 3273021403940001</p>
                      </div>
                      <MaterialIcon name="check_circle" className="text-[16px] text-[#059669]" />
                    </div>
                  </div>
                </div>

                {/* Detailed Price Breakdown */}
                <div className="mt-space-md flex flex-col gap-1.5 text-on-surface-variant font-caption text-caption">
                  <div className="flex justify-between">
                    <span>Paket Open Trip Bromo (2 Dewasa)</span>
                    <span className="font-semibold text-on-surface font-bold">Rp 900.000</span>
                  </div>
                  <div className="flex justify-between text-[#059669]">
                    <span>Voucher Hibah Wirausaha P2MW</span>
                    <span className="font-semibold font-bold">-Rp 50.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Asuransi Jiwa & Resiko Jasa Raharja</span>
                    <span className="font-semibold text-[#059669] font-bold">Termasuk (Rp 0)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiket Masuk TNBTS & SIMAKSI Resmi</span>
                    <span className="font-semibold text-[#059669] font-bold">Termasuk (Rp 0)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shuttle HiAce & Hardtop Jeep 4x4</span>
                    <span className="font-semibold text-[#059669] font-bold">Termasuk (Rp 0)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Layanan Midtrans Payment Escrow</span>
                    <span className="font-semibold text-[#059669] font-bold">Rp 0 (Ditanggung Nusabook)</span>
                  </div>

                  {/* Grand Total Block */}
                  <div className="mt-space-sm pt-space-sm bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between border-t border-surface-container-high">
                    <div>
                      <span className="font-caption text-caption text-outline block">Total Pelunasan</span>
                      <span className="font-title-md text-title-md font-bold text-secondary">
                        {formatRupiah(totalAmount)}
                      </span>
                    </div>
                    <span className="font-micro-badge text-micro-badge bg-[#ecfdf5] text-[#059669] px-2 py-1 rounded font-bold uppercase tracking-wider">
                      Garansi Escrow
                    </span>
                  </div>
                </div>

                {/* Action Buttons Component */}
                <div className="mt-space-md flex flex-col gap-space-sm">
                  {/* Primary Action: Check Real-time Payment Status */}
                  <button
                    className="w-full bg-secondary-container hover:bg-secondary text-on-secondary font-headline-sm text-headline-sm py-3 px-space-md rounded-lg flex items-center justify-center gap-space-xs transition-all shadow-md active:scale-[0.99] relative overflow-hidden group font-bold disabled:opacity-50 cursor-pointer"
                    disabled={isChecking}
                    onClick={triggerCheckPayment}
                    type="button"
                  >
                    <MaterialIcon
                      name="sync"
                      className={`text-[20px] transition-transform ${isChecking ? "animate-spin" : "group-hover:rotate-180"}`}
                    />
                    <span className="font-body-semibold text-body-semibold font-bold">
                      {checkLabel}
                    </span>
                  </button>

                  {/* Cancel Button */}
                  <button
                    className="mt-1 font-caption text-caption text-outline hover:text-error text-center transition-colors cursor-pointer"
                    onClick={() => {
                      if (confirm("Apakah Anda yakin ingin membatalkan pesanan ini? Kunci kuota untuk 2 kursi Open Trip Bromo akan segera dilepaskan ke publik.")) {
                        router.push("/explore");
                      }
                    }}
                    type="button"
                  >
                    Batalkan Pesanan & Lepas Kunci Kursi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <span className="font-caption text-caption text-outline">Program P2MW 2026</span>
          </div>
          <div className="flex gap-space-lg font-caption text-caption">
            <Link className="hover:text-on-surface transition-colors" href="/guide">
              Panduan Operator
            </Link>
            <Link className="hover:text-on-surface transition-colors" href="/terms">
              Syarat Escrow DP
            </Link>
            <Link className="hover:text-on-surface transition-colors" href="/safety">
              Standar Keselamatan Bahari
            </Link>
          </div>
          <div className="font-caption text-caption text-outline">© 2026 Nusabook Indonesia. Hak Cipta Dilindungi.</div>
        </div>
      </footer>
    </div>
  );
}
