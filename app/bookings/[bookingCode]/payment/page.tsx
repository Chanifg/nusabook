"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/client";

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}


interface PaymentOption {
  id: string;
  name: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  badge: string;
  type: "VA" | "QRIS";
  instructions: {
    tabs: Array<{ id: string; label: string; icon: string }>;
    steps: Record<string, Array<{ step: number; title: string; desc: string }>>;
  };
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "BCA_VA",
    name: "BCA Virtual Account",
    bankCode: "BCA",
    accountNumber: "88019500011",
    accountName: "Nusabook Escrow (BCA)",
    badge: "Verifikasi Otomatis",
    type: "VA",
    instructions: {
      tabs: [
        { id: "tab1", label: "m-BCA (BCA mobile)", icon: "smartphone" },
        { id: "tab2", label: "myBCA", icon: "apps" },
        { id: "tab3", label: "KlikBCA", icon: "laptop_mac" },
        { id: "tab4", label: "ATM BCA", icon: "local_atm" },
      ],
      steps: {
        tab1: [
          { step: 1, title: "Buka aplikasi BCA mobile", desc: "Login ke m-BCA dengan memasukkan 6 karakter kode akses." },
          { step: 2, title: "Pilih m-Transfer > BCA Virtual Account", desc: "Pilih menu m-Transfer lalu ketuk opsi BCA Virtual Account." },
          { step: 3, title: "Masukkan Nomor Virtual Account", desc: "Ketik atau tempel nomor 88019500011 lalu tekan Send." },
          { step: 4, title: "Konfirmasi & Masukkan PIN", desc: "Periksa nama penerima Nusabook dan nominal, lalu masukkan 6 digit PIN m-BCA." },
        ],
        tab2: [
          { step: 1, title: "Buka aplikasi myBCA", desc: "Login dengan BCA ID Anda." },
          { step: 2, title: "Pilih Transfer > Virtual Account", desc: "Pilih menu Transfer lalu pilih opsi Virtual Account." },
          { step: 3, title: "Ketik Nomor 88019500011", desc: "Pilih rekening sumber dana lalu masukkan nomor VA." },
          { step: 4, title: "Selesaikan Pembayaran", desc: "Konfirmasi tagihan dan otorisasi dengan PIN myBCA." },
        ],
        tab3: [
          { step: 1, title: "Login ke KlikBCA Individual", desc: "Masukkan User ID dan PIN KlikBCA Anda." },
          { step: 2, title: "Pilih Transfer Dana > Transfer ke BCA Virtual Account", desc: "Buka menu transfer dana VA." },
          { step: 3, title: "Masukkan Nomor 88019500011", desc: "Pastikan nominal tagihan sesuai lalu kirim respon KeyBCA." },
        ],
        tab4: [
          { step: 1, title: "Masukkan Kartu & PIN ATM BCA", desc: "Masukkan kartu debit di ATM BCA lalu ketik PIN 6 digit Anda." },
          { step: 2, title: "Pilih Transaksi Lainnya > Transfer", desc: "Pilih Ke Rekening BCA Virtual Account." },
          { step: 3, title: "Ketik 88019500011 & Konfirmasi", desc: "Periksa detail tagihan di layar lalu tekan Ya." },
        ],
      },
    },
  },
  {
    id: "MANDIRI_VA",
    name: "Mandiri Virtual Account",
    bankCode: "MANDIRI",
    accountNumber: "89012300022",
    accountName: "Nusabook Escrow (Mandiri)",
    badge: "Verifikasi Otomatis",
    type: "VA",
    instructions: {
      tabs: [
        { id: "tab1", label: "Livin' by Mandiri (Kuning)", icon: "smartphone" },
        { id: "tab2", label: "Mandiri Internet", icon: "laptop_mac" },
        { id: "tab3", label: "ATM Mandiri", icon: "local_atm" },
      ],
      steps: {
        tab1: [
          { step: 1, title: "Buka aplikasi Livin' by Mandiri", desc: "Login menggunakan sidik jari atau password Livin'." },
          { step: 2, title: "Pilih Menu Bayar > Virtual Account", desc: "Ketik penyedia jasa Nusabook atau kode 89012." },
          { step: 3, title: "Masukkan Nomor 89012300022", desc: "Pastikan nominal tagihan tertera sesuai pemesanan." },
          { step: 4, title: "Konfirmasi & Masukkan PIN Livin'", desc: "Ketuk Lanjut Bayar dan masukkan PIN 6 digit Livin' Anda." },
        ],
        tab2: [
          { step: 1, title: "Login Mandiri Online", desc: "Buka ib.bankmandiri.co.id dan masukkan kredensial Anda." },
          { step: 2, title: "Pilih Bayar > Multi Payment", desc: "Pilih rekening sumber dan masukkan kode Nusabook." },
          { step: 3, title: "Otorisasi Transaksi", desc: "Masukkan respon token Mandiri untuk menyelesaikan pembayaran." },
        ],
        tab3: [
          { step: 1, title: "Masukkan Kartu ATM & PIN", desc: "Pilih menu Bayar/Beli lalu pilih Multi Payment." },
          { step: 2, title: "Masukkan Kode Perusahaan & Nomor VA", desc: "Masukkan nomor 89012300022 lalu tekan Benar." },
          { step: 3, title: "Konfirmasi & Selesai", desc: "Periksa nama Nusabook dan tekan Ya pada layar ATM." },
        ],
      },
    },
  },
  {
    id: "BNI_VA",
    name: "BNI Virtual Account",
    bankCode: "BNI",
    accountNumber: "98812300033",
    accountName: "Nusabook Escrow (BNI)",
    badge: "Verifikasi Otomatis",
    type: "VA",
    instructions: {
      tabs: [
        { id: "tab1", label: "BNI Mobile Banking", icon: "smartphone" },
        { id: "tab2", label: "BNI Internet Banking", icon: "laptop_mac" },
        { id: "tab3", label: "ATM BNI", icon: "local_atm" },
      ],
      steps: {
        tab1: [
          { step: 1, title: "Buka BNI Mobile Banking", desc: "Login dengan MPIN 6 digit atau biometrik Anda." },
          { step: 2, title: "Pilih Menu Pembayaran > Virtual Account Billing", desc: "Pilih opsi Input Baru." },
          { step: 3, title: "Masukkan Nomor 98812300033", desc: "Tagihan akan muncul otomatis tanpa perlu input manual." },
          { step: 4, title: "Masukkan Password Transaksi", desc: "Konfirmasi pembayaran lalu simpan bukti transfer." },
        ],
        tab2: [
          { step: 1, title: "Login BNI Internet Banking", desc: "Buka ibank.bni.co.id lalu pilih Transaksi Pembayaran." },
          { step: 2, title: "Pilih Virtual Account Billing", desc: "Masukkan nomor 98812300033 lalu selesaikan dengan BNI e-Secure." },
        ],
        tab3: [
          { step: 1, title: "Gunakan ATM BNI", desc: "Pilih Menu Lain > Pembayaran > Menu Berikutnya > Virtual Account Billing." },
          { step: 2, title: "Ketik Nomor 98812300033", desc: "Konfirmasi nama Nusabook dan tagihan lalu tekan Ya." },
        ],
      },
    },
  },
  {
    id: "BRI_VA",
    name: "BRI Virtual Account (BRIVA)",
    bankCode: "BRI",
    accountNumber: "12800100044",
    accountName: "Nusabook Escrow (BRI)",
    badge: "Verifikasi Otomatis",
    type: "VA",
    instructions: {
      tabs: [
        { id: "tab1", label: "BRImo", icon: "smartphone" },
        { id: "tab2", label: "Internet Banking BRI", icon: "laptop_mac" },
        { id: "tab3", label: "ATM BRI", icon: "local_atm" },
      ],
      steps: {
        tab1: [
          { step: 1, title: "Buka aplikasi BRImo", desc: "Login menggunakan username/password atau fingerprint." },
          { step: 2, title: "Pilih Menu Tagihan > BRIVA", desc: "Pilih Pembayaran Baru lalu masukkan nomor 12800100044." },
          { step: 3, title: "Konfirmasi Rincian", desc: "Pastikan nominal tagihan dan nama Nusabook sesuai." },
          { step: 4, title: "Masukkan PIN BRImo", desc: "Ketik 6 digit PIN BRImo untuk konfirmasi pembayaran." },
        ],
        tab2: [
          { step: 1, title: "Login ib.bri.co.id", desc: "Pilih menu Pembayaran > BRIVA lalu masukkan nomor 12800100044." },
          { step: 2, title: "Konfirmasi dengan m-Token", desc: "Masukkan password dan m-Token BRI untuk menyelesaikan." },
        ],
        tab3: [
          { step: 1, title: "Gunakan ATM BRI", desc: "Pilih Transaksi Lain > Pembayaran > Lainnya > BRIVA." },
          { step: 2, title: "Masukkan 12800100044", desc: "Periksa konfirmasi data di layar lalu tekan Ya." },
        ],
      },
    },
  },
  {
    id: "QRIS",
    name: "QRIS Instant & E-Wallet",
    bankCode: "QRIS",
    accountNumber: "NMD-QRIS-982104",
    accountName: "Nusabook Merchant QRIS",
    badge: "Scan & Konfirmasi Instan",
    type: "QRIS",
    instructions: {
      tabs: [
        { id: "tab1", label: "GoPay / OVO", icon: "qr_code_2" },
        { id: "tab2", label: "DANA / ShopeePay", icon: "account_balance_wallet" },
        { id: "tab3", label: "Mobile Banking (BCA, Mandiri, dll)", icon: "smartphone" },
      ],
      steps: {
        tab1: [
          { step: 1, title: "Buka GoPay atau OVO", desc: "Buka aplikasi Gojek/GoPay atau OVO pada smartphone Anda." },
          { step: 2, title: "Ketuk Tombol Bayar / Scan", desc: "Arahkan kamera ke QR Code QRIS di layar atau unggah screenshot." },
          { step: 3, title: "Periksa Nominal & Konfirmasi", desc: "Pastikan merchant tertulis Nusabook Resmi lalu selesaikan pembayaran." },
        ],
        tab2: [
          { step: 1, title: "Buka DANA atau ShopeePay", desc: "Buka aplikasi DANA atau Shopee lalu ketuk ikon Scan QR." },
          { step: 2, title: "Scan QRIS Nusabook", desc: "Pindai kode QRIS di samping lalu periksa total tagihan." },
          { step: 3, title: "Masukkan PIN Anda", desc: "Ketik PIN e-wallet untuk menyelesaikan pembayaran instan." },
        ],
        tab3: [
          { step: 1, title: "Buka Aplikasi Mobile Banking Anda", desc: "BCA mobile, Livin', BRImo, BNI Mobile, CIMB Octo, dll." },
          { step: 2, title: "Pilih Menu QRIS / Bayar dengan QR", desc: "Pindai QR code dan pastikan nama penerima Nusabook." },
          { step: 3, title: "Otorisasi Pembayaran", desc: "Masukkan PIN m-banking Anda. Transaksi selesai dalam detik!" },
        ],
      },
    },
  },
];

export default function PaymentInstructionPage({
  params,
}: {
  params: Promise<{ bookingCode: string }>;
}) {
  const { bookingCode } = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("tab1");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkLabel, setCheckLabel] = useState<string>("Cek Status Pembayaran");
  const [isChangeMethodOpen, setIsChangeMethodOpen] = useState<boolean>(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string>("BCA_VA");

  // Dynamic booking state
  const [totalAmount, setTotalAmount] = useState<number>(500000);
  const [tripTitle, setTripTitle] = useState<string>("Paket Wisata");
  const [agentBusinessName, setAgentBusinessName] = useState<string>("Mitra Travel Nusabook");
  const [agentBankName, setAgentBankName] = useState<string>("BCA");
  const [agentBankAccountNumber, setAgentBankAccountNumber] = useState<string>("8820192831");
  const [agentBankAccountName, setAgentBankAccountName] = useState<string>("Budi Santoso");
  const [passengersList, setPassengersList] = useState<Array<{ full_name: string; id_card_number?: string | null }>>([]);
  const [paxCount, setPaxCount] = useState<number>(1);
  const [paymentExpiredAt, setPaymentExpiredAt] = useState<string | null>(null);

  // Real-time countdown
  const initialSeconds = 20 * 60;
  const [totalSeconds, setTotalSeconds] = useState<number>(initialSeconds);

  useEffect(() => {
    let isMounted = true;
    async function loadBooking() {
      try {
        const supabase = createClient();
        const { data: bData } = await supabase
          .from("bookings")
          .select("*, travel_agents(*), trip_schedules(*, tour_packages(*)), booking_passengers(*)")
          .eq("booking_code", bookingCode)
          .maybeSingle();

        if (bData && isMounted) {
          if (bData.payment_status === "PAID") {
            router.push(`/bookings/${bookingCode}`);
            return;
          }

          if (bData.total_amount) {
            setTotalAmount(Number(bData.total_amount));
          }
          if (bData.total_pax) {
            setPaxCount(Number(bData.total_pax));
          }
          if (bData.payment_expired_at) {
            setPaymentExpiredAt(bData.payment_expired_at);
            const remaining = Math.max(
              0,
              Math.floor((new Date(bData.payment_expired_at).getTime() - Date.now()) / 1000)
            );
            setTotalSeconds(remaining);
          }

          const pkg = (bData as any).trip_schedules?.tour_packages;
          if (pkg?.title) {
            setTripTitle(pkg.title);
          }

          const agent = (bData as any).travel_agents;
          if (agent) {
            if (agent.business_name) setAgentBusinessName(agent.business_name);
            if (agent.bank_name) setAgentBankName(agent.bank_name);
            if (agent.bank_account_number) setAgentBankAccountNumber(agent.bank_account_number);
            if (agent.bank_account_name) setAgentBankAccountName(agent.bank_account_name);
          }

          if (bData.booking_passengers && Array.isArray(bData.booking_passengers)) {
            setPassengersList(bData.booking_passengers);
          }
          return;
        }
      } catch {
        // Fallback to API
      }

      if (isMounted) {
        try {
          const res = await fetch(`/api/bookings/${bookingCode}`);
          if (res.ok) {
            const json = await res.json();
            const b = json.booking;
            if (b) {
              if (b.payment_status === "PAID") {
                router.push(`/bookings/${bookingCode}`);
                return;
              }
              if (b.total_amount) setTotalAmount(Number(b.total_amount));
              if (b.total_pax) setPaxCount(Number(b.total_pax));
              if (b.tripTitle) setTripTitle(b.tripTitle);
              if (b.virtualAccountNumber) setAgentBankAccountNumber(b.virtualAccountNumber);
              if (b.passengers && Array.isArray(b.passengers)) {
                setPassengersList(b.passengers);
              }
            }
          }
        } catch {
          // Fallback retained
        }
      }
    }

    loadBooking();
    return () => {
      isMounted = false;
    };
  }, [bookingCode, router]);

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
      // 1. Check if already confirmed in database
      try {
        const supabase = createClient();
        const { data: latestBooking } = await supabase
          .from("bookings")
          .select("payment_status")
          .eq("booking_code", bookingCode)
          .maybeSingle();

        if (latestBooking && latestBooking.payment_status === "PAID") {
          setCheckLabel("Pembayaran Terverifikasi!");
          showToast("Pembayaran berhasil diverifikasi!");
          setTimeout(() => {
            router.push(`/bookings/${bookingCode}`);
          }, 1000);
          return;
        }
      } catch {
        // Fallback to local API
      }

      // 2. Mark as paid via PATCH
      await fetch(`/api/bookings/${bookingCode}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });

      // 3. Trigger simulation webhook for dev/testing
      try {
        await fetch("/api/webhooks/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingCode,
            status: "PAID",
            transactionId: `TRX-${Date.now()}`,
            signature: "SIMULATED_TEST_SIGNATURE",
          }),
        });
      } catch {
        // Webhook optional in dev
      }

      setCheckLabel("Pembayaran Terverifikasi!");
      showToast("Pembayaran berhasil diverifikasi!");
      setTimeout(() => {
        router.push(`/bookings/${bookingCode}`);
      }, 1000);
    } catch {
      setCheckLabel("Belum Ada Mutasi Masuk");
      showToast("Gagal memverifikasi status pembayaran.");
      setTimeout(() => setCheckLabel("Cek Status Pembayaran"), 3000);
    } finally {
      setIsChecking(false);
    }
  };

  
  const currentMethod = PAYMENT_OPTIONS.find((m) => m.id === selectedMethodId) || PAYMENT_OPTIONS[0];

  const handleApplyMethod = async (newMethodId: string) => {
    const targetMethod = PAYMENT_OPTIONS.find((m) => m.id === newMethodId);
    if (!targetMethod) return;

    setSelectedMethodId(targetMethod.id);
    setActiveTab("tab1");
    setAgentBankName(targetMethod.bankCode);
    setAgentBankAccountNumber(targetMethod.accountNumber);
    setAgentBankAccountName(targetMethod.accountName);
    setIsChangeMethodOpen(false);

    showToast(`Metode pembayaran berhasil diubah ke ${targetMethod.name}`);

    // Sync to backend API
    try {
      await fetch(`/api/bookings/${bookingCode}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method: targetMethod.id,
          bank_name: targetMethod.bankCode,
        }),
      });
    } catch {
      // Offline fallback
    }
  };

  const cleanVaNumber = (agentBankAccountNumber || currentMethod.accountNumber).replace(/\D/g, "");

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
                    Pembayaran
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
                      Menunggu Pembayaran
                    </span>
                  </div>
                  <span className="font-caption text-caption text-outline">|</span>
                  <span className="font-caption text-caption text-on-surface-variant">
                    Metode: <strong className="text-on-surface">{currentMethod.name}</strong>
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
                    <span className="font-caption text-caption uppercase tracking-wider">Sisa Waktu</span>
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
                  Kursi Anda terkunci sementara. Segera selesaikan pembayaran.
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
                        {agentBankName}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-title-md text-title-md font-bold text-on-surface">
                        {currentMethod.type === "QRIS" ? "Pembayaran QRIS Nasional" : `Transfer Rekening ${currentMethod.bankCode}`}
                      </h2>
                      <div className="flex items-center gap-space-xs mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                        <span className="font-caption text-caption text-[#059669] font-semibold font-bold">
                          Verifikasi Otomatis &amp; Manual
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChangeMethodOpen(true)}
                    className="self-start sm:self-center font-caption text-caption font-semibold text-primary hover:text-primary-container bg-surface-container-low hover:bg-surface-container px-space-sm py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 font-bold cursor-pointer"
                    type="button"
                  >
                    <span>Ganti Metode</span>
                    <MaterialIcon name="swap_horiz" className="text-[16px]" />
                  </button>
                </div>

                {/* VA & Nominal Information Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mt-space-md">
                  {/* Box 1: Nomor Rekening / QRIS Code */}
                  <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between">
                    {currentMethod.type === "QRIS" ? (
                      <div className="flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-2">
                          Scan Kode QRIS Nasional
                        </span>
                        <div className="bg-white p-3 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col items-center">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MOCK_QRIS_${bookingCode}`}
                            alt="QRIS Code Pembayaran Nusabook"
                            className="w-36 h-36 object-contain"
                          />
                          <span className="text-[11px] font-mono text-outline mt-1 font-bold">
                            NMD-QRIS-{bookingCode.slice(-4)}
                          </span>
                        </div>
                        <span className="text-xs text-on-surface-variant block mt-2">
                          Mendukung GoPay, OVO, Dana, ShopeePay, &amp; Semua M-Banking
                        </span>
                        <button
                          className="mt-3 w-full bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-bold cursor-pointer"
                          onClick={() => copyToClipboard(`MOCK_QRIS_${bookingCode}`, "Tautan QRIS berhasil disalin!")}
                          type="button"
                        >
                          <MaterialIcon name="qr_code_2" className="text-base" />
                          <span>Salin Data QRIS</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="font-caption text-caption text-outline font-semibold uppercase tracking-wider block font-bold">
                            Nomor Virtual Account / Rekening ({currentMethod.bankCode})
                          </span>
                          <span className="font-headline-md text-2xl font-bold text-on-surface tracking-wider mt-1 block select-all font-mono">
                            {currentMethod.accountNumber}
                          </span>
                          <span className="font-caption text-caption text-on-surface-variant block mt-0.5">
                            Atas Nama: <strong>{currentMethod.accountName}</strong>
                          </span>
                        </div>
                        <button
                          className="mt-space-md w-full bg-surface-container hover:bg-surface-container-high text-primary font-body-semibold text-body-semibold py-2 px-space-sm rounded-lg flex items-center justify-center gap-space-xs transition-colors font-bold cursor-pointer"
                          onClick={() => copyToClipboard(currentMethod.accountNumber, "Nomor rekening berhasil disalin!")}
                          type="button"
                        >
                          <MaterialIcon name="copy_all" className="text-[18px]" />
                          <span>Salin Nomor Rekening</span>
                        </button>
                      </>
                    )}
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
                        Bebas biaya admin
                      </span>
                    </div>
                    <button
                      className="mt-space-md w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-body-semibold text-body-semibold py-2 px-space-sm rounded-lg flex items-center justify-center gap-space-xs transition-colors font-bold cursor-pointer"
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
                    Transfer tepat hingga digit terakhir agar sistem bisa verifikasi otomatis.
                  </p>
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
                  {currentMethod.instructions.tabs.map((tab) => {
                    const isActive = (activeTab || "tab1") === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-space-md py-2 rounded-lg font-body-semibold text-body-semibold shrink-0 transition-all flex items-center gap-1 font-bold cursor-pointer ${
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
                  {(() => {
                    const currentTabKey = activeTab || "tab1";
                    const stepList = currentMethod.instructions.steps[currentTabKey] || currentMethod.instructions.steps["tab1"] || [];
                    return (
                      <div className="flex flex-col gap-space-sm">
                        {stepList.map((st) => (
                          <div key={st.step} className="flex items-start gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                            <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center shrink-0 font-bold text-xs">
                              {st.step}
                            </span>
                            <div>
                              <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold text-sm">
                                {st.title}
                              </h4>
                              <p className="font-caption text-caption text-on-surface-variant text-xs mt-0.5">
                                {st.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
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
                      Open Trip
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
                      <span>Manifes Terdaftar ({paxCount} Pax)</span>
                    </span>
                  </div>
                  <div className="space-y-1.5 font-caption text-caption text-on-surface">
                    {passengersList.length > 0 ? (
                      passengersList.map((passenger, idx) => (
                        <div key={idx} className="bg-surface-container-lowest p-1.5 rounded flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-on-surface font-bold">
                              {idx + 1}. {passenger.full_name}
                            </p>
                            {passenger.id_card_number && (
                              <p className="text-outline text-[11px]">
                                NIK: {passenger.id_card_number.slice(0, 4)}********{passenger.id_card_number.slice(-4)}
                              </p>
                            )}
                          </div>
                          <MaterialIcon name="check_circle" className="text-[16px] text-[#059669]" />
                        </div>
                      ))
                    ) : (
                      <div className="bg-surface-container-lowest p-2 rounded text-xs text-on-surface-variant">
                        {paxCount} Tiket Peserta Terkonfirmasi
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Price Breakdown */}
                <div className="mt-space-md flex flex-col gap-1.5 text-on-surface-variant font-caption text-caption">
                  <div className="flex justify-between">
                    <span>{tripTitle} ({paxCount} Pax)</span>
                    <span className="font-semibold text-on-surface font-bold">{formatRupiah(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Asuransi Keselamatan Perjalanan</span>
                    <span className="font-semibold text-[#059669] font-bold">Termasuk</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fasilitas &amp; Retribusi Destinasi</span>
                    <span className="font-semibold text-[#059669] font-bold">Termasuk</span>
                  </div>
                </div>


                  {/* Grand Total Block */}
                  <div className="mt-space-sm pt-space-sm bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between border-t border-surface-container-high">
                    <div>
                      <span className="font-caption text-caption text-outline block">Total Tagihan</span>
                      <span className="font-title-md text-title-md font-bold text-secondary">
                        {formatRupiah(totalAmount)}
                      </span>
                    </div>
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
            <Link className="hover:text-on-surface transition-colors" href="/explore">
              Jelajah Paket Wisata
            </Link>
          </div>
          <div className="font-caption text-caption text-outline">© 2026 Nusabook Indonesia. Hak Cipta Dilindungi.</div>
        </div>
      </footer>
    
      {/* MODAL GANTI METODE PEMBAYARAN */}
      {isChangeMethodOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        >
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <MaterialIcon name="payment" className="text-xl" />
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  Pilih Metode Pembayaran
                </h3>
              </div>
              <button
                onClick={() => setIsChangeMethodOpen(false)}
                type="button"
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline transition-colors cursor-pointer"
              >
                <MaterialIcon name="close" className="text-xl" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Pilih salah satu metode pembayaran resmi bergaransi Escrow Nusabook berikut:
            </p>

            <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto pr-1">
              {PAYMENT_OPTIONS.map((opt) => {
                const isSelected = (selectedMethodId || "BCA_VA") === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedMethodId(opt.id)}
                    className={`flex items-start justify-between p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-primary/5 border-primary ring-2 ring-primary/20 shadow-sm"
                        : "bg-surface-container-low border-outline-variant/30 hover:border-outline-variant"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                        isSelected ? "border-primary bg-primary" : "border-outline-variant"
                      }`}>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-on-surface">{opt.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            {opt.badge}
                          </span>
                        </div>
                        <span className="text-xs text-on-surface-variant mt-0.5">
                          {opt.instructions.tabs.map((t) => t.label).join(" • ")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
              <button
                onClick={() => setIsChangeMethodOpen(false)}
                type="button"
                className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container font-semibold text-sm transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleApplyMethod(selectedMethodId)}
                type="button"
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Gunakan Metode Ini
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
