"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import {
  Users,
  Calendar,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronRight,
  User,
  Phone,
  Mail,
  CreditCard,
} from "lucide-react";

interface PassengerInput {
  fullName: string;
  idCardNumber: string;
  gender: "MALE" | "FEMALE";
  phoneNumber: string;
  emergencyContact: string;
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const slug = (params.slug as string) || "pesona-merapi";
  const scheduleId =
    searchParams.get("scheduleId") || "33333333-3333-3333-3333-333333333333";

  const [pax, setPax] = useState<number>(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pricePerPax = 250000;
  const tripTitle = "Sunrise Lava Tour Merapi & Bunker Kaliadem";
  const tripDate = "Sabtu, 4 Oktober 2026";

  const [passengers, setPassengers] = useState<PassengerInput[]>([
    {
      fullName: "",
      idCardNumber: "",
      gender: "MALE",
      phoneNumber: "",
      emergencyContact: "",
    },
  ]);

  const handlePaxChange = (newPax: number) => {
    if (newPax < 1 || newPax > 10) return;
    setPax(newPax);

    setPassengers((prev) => {
      const next = [...prev];
      if (newPax > prev.length) {
        for (let i = prev.length; i < newPax; i++) {
          next.push({
            fullName: "",
            idCardNumber: "",
            gender: "MALE",
            phoneNumber: "",
            emergencyContact: "",
          });
        }
      } else {
        next.splice(newPax);
      }
      return next;
    });
  };

  const handlePassengerChange = (
    index: number,
    field: keyof PassengerInput,
    value: string
  ) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
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
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrorMsg(data.error || "Gagal memproses reservasi.");
          return;
        }

        router.push(data.redirectUrl || `/bookings/${data.bookingCode}/payment`);
      } catch (err: any) {
        setErrorMsg("Terjadi gangguan koneksi. Silakan coba kembali.");
      }
    });
  };

  const totalAmount = pax * pricePerPax;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-700 font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-500" />
            Checkout Aman Nusabook
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-8 flex-1 w-full space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Formulir Reservasi & Manifes Tiket
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Data peserta digunakan untuk manifes resmi perjalanan, asuransi, dan e-ticket.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Perhatian:</span>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Ringkasan Trip */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-accent-600 uppercase tracking-wider">
              Paket Wisata
            </span>
            <h3 className="text-lg font-bold text-slate-900">{tripTitle}</h3>
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-700" />
                {tripDate}
              </span>
              <span>•</span>
              <span>{formatRupiah(pricePerPax)} / orang</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-700">Jumlah Pax:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePaxChange(pax - 1)}
                disabled={pax <= 1 || isPending}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-sm text-slate-900">
                {pax}
              </span>
              <button
                type="button"
                onClick={() => handlePaxChange(pax + 1)}
                disabled={pax >= 10 || isPending}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Kontak Pemesan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-brand-700" />
              <h2 className="text-lg font-bold text-slate-900">Data Kontak Pemesan</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap Pemesan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor WhatsApp Pemesan *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={customerWhatsapp}
                    onChange={(e) => setCustomerWhatsapp(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Alamat Email (Untuk Pengiriman E-Ticket) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="Contoh: budi@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section Data Peserta (Manifes) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-700" />
                <h2 className="text-lg font-bold text-slate-900">
                  Data Peserta ({pax} Orang)
                </h2>
              </div>
              <span className="text-xs text-slate-500">Wajib sesuai kartu identitas</span>
            </div>

            {passengers.map((passenger, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-100">
                    Peserta #{index + 1} {index === 0 && "(Pemesan Utama)"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sesuai KTP / Paspor"
                      value={passenger.fullName}
                      onChange={(e) =>
                        handlePassengerChange(index, "fullName", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Jenis Kelamin *
                    </label>
                    <select
                      value={passenger.gender}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "gender",
                          e.target.value as "MALE" | "FEMALE"
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
                    >
                      <option value="MALE">Laki-laki (L)</option>
                      <option value="FEMALE">Perempuan (P)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      NIK / Paspor (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="16 digit NIK"
                      value={passenger.idCardNumber}
                      onChange={(e) =>
                        handlePassengerChange(index, "idCardNumber", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={passenger.phoneNumber}
                      onChange={(e) =>
                        handlePassengerChange(index, "phoneNumber", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Kontak Darurat
                    </label>
                    <input
                      type="text"
                      placeholder="Nama & No HP Keluarga"
                      value={passenger.emergencyContact}
                      onChange={(e) =>
                        handlePassengerChange(index, "emergencyContact", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Bar / Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 font-medium">Total Pembayaran ({pax} Pax)</span>
              <p className="text-3xl font-extrabold text-brand-700 mt-0.5">
                {formatRupiah(totalAmount)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Termasuk asuransi, retribusi & instruksi bayar instan
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengunci Kuota...
                </>
              ) : (
                <>
                  Lanjut ke Pembayaran
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
