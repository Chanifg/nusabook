"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MaterialIcon } from "@/components/ui/icon";
import type { TourPackage } from "@/types/database.types";

export interface ItineraryActivity {
  time?: string;
  title: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  activities: ItineraryActivity[];
}

interface PackageFormProps {
  agentId: string;
  initialData?: TourPackage | null;
  isEditing?: boolean;
}

export function PackageForm({
  agentId,
  initialData,
  isEditing = false,
}: PackageFormProps) {
  const router = useRouter();
  const supabase = createClient();

  // Basic Information
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState<"open_trip" | "private_trip">(
    initialData?.category || "open_trip"
  );
  const [destinationCity, setDestinationCity] = useState(
    initialData?.destination_city || "Kab. Probolinggo (Bromo)"
  );
  const [durationDays, setDurationDays] = useState(initialData?.duration_days || 1);
  const [durationNights, setDurationNights] = useState(initialData?.duration_nights || 0);
  const [meetingPoint, setMeetingPoint] = useState(
    initialData?.meeting_point || "Stasiun Malang Kotabaru"
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnail_url ||
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80"
  );
  const [activeStep, setActiveStep] = useState(1);

  // Inclusions & Exclusions
  const [inclusions, setInclusions] = useState<string[]>(
    Array.isArray(initialData?.facilities_included) && initialData.facilities_included.length > 0
      ? (initialData.facilities_included as string[])
      : [
          "Jeep Hardtop 4x4 & BBM Bromo",
          "Tiket Masuk TNBTS & SIMAKSI",
          "Asuransi Wisata Jasa Raharja",
          "Tour Leader / Kru Lapangan",
        ]
  );
  const [newInclusion, setNewInclusion] = useState("");

  const [exclusions, setExclusions] = useState<string[]>(
    Array.isArray(initialData?.facilities_excluded) && initialData.facilities_excluded.length > 0
      ? (initialData.facilities_excluded as string[])
      : ["Pengeluaran pribadi & jajan", "Sewa kuda di Laut Pasir"]
  );
  const [newExclusion, setNewExclusion] = useState("");

  // Dynamic Itinerary State
  const parseInitialItinerary = (): ItineraryDay[] => {
    if (!initialData?.itinerary || !Array.isArray(initialData.itinerary)) {
      return [
        {
          day: 1,
          activities: [
            {
              time: "00:15",
              title: "Meeting Point & Penataan Logistik",
              description: "Berkumpul di meeting point, presensi QR boarding pass.",
            },
            {
              time: "03:30",
              title: "Tiba di Penanjakan 1 Bromo",
              description: "Persiapan spot golden sunrise dan foto Milky Way.",
            },
          ],
        },
      ];
    }
    const firstItem = initialData.itinerary[0];
    if (firstItem && typeof firstItem === "object" && "day" in firstItem) {
      return initialData.itinerary as unknown as ItineraryDay[];
    }
    return [
      {
        day: 1,
        activities: initialData.itinerary.map((act: any) => ({
          time: act.time || "08:00",
          title: act.title || "Aktivitas",
          description: act.description || "",
        })),
      },
    ];
  };

  const [itinerary, setItinerary] = useState<ItineraryDay[]>(parseInitialItinerary);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-generate slug from title if new
  useEffect(() => {
    if (!isEditing && title) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 60);
      setSlug(generated);
    }
  }, [title, isEditing]);

  const handleAddInclusion = () => {
    if (newInclusion.trim()) {
      setInclusions([...inclusions, newInclusion.trim()]);
      setNewInclusion("");
    }
  };

  const handleRemoveInclusion = (idx: number) => {
    setInclusions(inclusions.filter((_, i) => i !== idx));
  };

  const handleAddExclusion = () => {
    if (newExclusion.trim()) {
      setExclusions([...exclusions, newExclusion.trim()]);
      setNewExclusion("");
    }
  };

  const handleRemoveExclusion = (idx: number) => {
    setExclusions(exclusions.filter((_, i) => i !== idx));
  };

  const handleAddActivity = (dayIndex: number) => {
    const updated = [...itinerary];
    updated[dayIndex].activities.push({
      time: "10:00",
      title: "Kunjungan Destinasi",
      description: "Rincian agenda kegiatan.",
    });
    setItinerary(updated);
  };

  const handleSave = async (publish: boolean) => {
    if (!title.trim()) {
      setErrorMessage("Nama paket wisata wajib diisi");
      return;
    }
    if (!destinationCity.trim()) {
      setErrorMessage("Kota destinasi wajib diisi");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      agent_id: agentId,
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/\s+/g, "-"),
      category,
      destination_city: destinationCity.trim(),
      duration_days: durationDays,
      duration_nights: durationNights,
      meeting_point: meetingPoint.trim(),
      description: description.trim(),
      thumbnail_url: thumbnailUrl.trim(),
      facilities_included: inclusions,
      facilities_excluded: exclusions,
      itinerary: itinerary as any,
      is_published: publish,
    };

    try {
      if (isEditing && initialData?.id) {
        const { error } = await supabase
          .from("tour_packages")
          .update(payload)
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("tour_packages").insert(payload);
        if (error) throw error;
      }

      router.push("/dashboard/packages");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan paket.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Top Command Ribbon / Header */}
      <div className="flex flex-col gap-space-sm mb-space-lg">
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs text-caption font-caption text-on-surface-variant mb-1">
              <span>Mitra Operator</span>
              <MaterialIcon name="chevron_right" className="text-xs" />
              <Link href="/dashboard/packages" className="hover:underline">
                Manajemen Paket Wisata
              </Link>
              <MaterialIcon name="chevron_right" className="text-xs" />
              <span className="text-primary font-body-semibold">
                {isEditing ? "Edit Rincian Paket" : "Buat Paket Baru"}
              </span>
            </div>
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
                {isEditing ? "Edit Paket Wisata" : "Tambah Paket Wisata Baru"}
              </h1>
              <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-micro-badge text-micro-badge uppercase tracking-wider font-bold">
                Modul FR-5.1
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <Link
              href="/dashboard/packages"
              className="px-space-md py-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-semibold text-body-semibold transition-colors flex items-center gap-1 shadow-sm text-sm"
            >
              <MaterialIcon name="close" className="text-lg" />
              <span>Batalkan</span>
            </Link>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave(false)}
              className="px-space-md py-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant font-body-semibold text-body-semibold transition-colors flex items-center gap-1 shadow-sm text-sm disabled:opacity-50"
            >
              <MaterialIcon name="bookmark_border" className="text-lg" />
              <span>Simpan Draf</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave(true)}
              className="px-space-md py-space-sm rounded-lg bg-secondary-container hover:bg-secondary text-on-primary font-body-semibold text-body-semibold transition-all shadow-sm flex items-center gap-1.5 group text-sm disabled:opacity-50"
            >
              <MaterialIcon name="rocket_launch" className="text-lg" />
              <span>{isSubmitting ? "Memproses..." : "Publikasikan Paket"}</span>
            </button>
          </div>
        </div>

        {/* Stepper Navigation Tab Strip */}
        <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm overflow-x-auto border border-outline-variant/20">
          <div className="grid grid-cols-5 min-w-[760px] gap-space-xs">
            {[
              { num: 1, label: "Info Dasar & Destinasi" },
              { num: 2, label: "Rute & Itinerary Jam" },
              { num: 3, label: "Fasilitas & Inklusi" },
              { num: 4, label: "Kuota & Pricing Tier" },
              { num: 5, label: "SIMAKSI & Asuransi" },
            ].map((step) => {
              const isActive = activeStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(step.num)}
                  className={`flex items-center gap-space-sm p-space-sm rounded-lg text-left transition-all ${
                    isActive
                      ? "bg-primary-container text-on-primary shadow-sm"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-full font-body-semibold text-xs ${
                      isActive
                        ? "bg-on-primary/20 text-on-primary"
                        : "bg-surface-container-highest text-primary"
                    }`}
                  >
                    {step.num}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-micro-badge text-[10px] uppercase tracking-wider opacity-80">
                      Langkah {step.num}
                    </span>
                    <span className="font-body-semibold text-xs truncate leading-tight">
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-error-container text-on-error-container flex items-center gap-2">
          <MaterialIcon name="error" className="text-xl" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Canvas: 12-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg pb-16">
        {/* Main Left Panel (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Step 1: Info Dasar */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-low">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                  <MaterialIcon name="edit_note" className="text-lg" />
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Informasi Dasar Paket
                  </h2>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Konfigurasi metadata penamaan, SEO slug, dan spesifikasi grup perjalanan.
                  </p>
                </div>
              </div>
              <span className="font-micro-badge text-micro-badge px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                REQ-FUNC-TOUR-01
              </span>
            </div>

            {/* Judul Paket */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body-semibold text-body-semibold text-on-surface flex items-center justify-between">
                <span>
                  Nama / Judul Paket Wisata <span className="text-error">*</span>
                </span>
                <span className="font-caption text-caption text-on-surface-variant">
                  Maks 80 Karakter
                </span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Open Trip Bromo Golden Sunrise & Kawah Aktif"
                className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular text-body-regular focus:bg-surface-container-lowest outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30 text-sm"
                required
              />
            </div>

            {/* Slug URL */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body-semibold text-body-semibold text-on-surface">
                Slug URL SEO
              </label>
              <div className="flex items-center rounded-lg bg-surface-container-high px-space-md py-space-sm text-caption font-caption text-on-surface-variant">
                <span className="font-body-regular text-outline select-none">
                  nusabook.id/pesona/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-transparent font-body-semibold text-primary outline-none px-1 text-sm"
                />
              </div>
            </div>

            {/* Kategori Paket Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body-semibold text-body-semibold text-on-surface">
                Kategori Perjalanan <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <label
                  className={`relative flex items-start gap-space-sm p-space-md rounded-xl cursor-pointer transition-all border ${
                    category === "open_trip"
                      ? "bg-primary-fixed/30 border-primary"
                      : "bg-surface-container-low border-transparent hover:bg-surface-container"
                  }`}
                >
                  <input
                    type="radio"
                    name="trip_category"
                    checked={category === "open_trip"}
                    onChange={() => setCategory("open_trip")}
                    className="mt-1 accent-primary w-4 h-4 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-body-semibold text-body-semibold text-primary flex items-center gap-1">
                      Open Trip (Publik)
                      <MaterialIcon name="groups" className="text-base text-secondary-container" />
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant mt-0.5">
                      Penjualan per kursi (pax individual). Konkurensi kuota real-time terkunci
                      pesimis saat checkout.
                    </span>
                  </div>
                </label>

                <label
                  className={`relative flex items-start gap-space-sm p-space-md rounded-xl cursor-pointer transition-all border ${
                    category === "private_trip"
                      ? "bg-secondary-fixed/30 border-secondary"
                      : "bg-surface-container-low border-transparent hover:bg-surface-container"
                  }`}
                >
                  <input
                    type="radio"
                    name="trip_category"
                    checked={category === "private_trip"}
                    onChange={() => setCategory("private_trip")}
                    className="mt-1 accent-secondary w-4 h-4 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-body-semibold text-body-semibold text-secondary flex items-center gap-1">
                      Private Charter
                      <MaterialIcon name="directions_car" className="text-base" />
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant mt-0.5">
                      Pemesanan satu rombongan flat. Alokasi satu unit armada shuttle dan tour guide
                      eksklusif.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Kota Destinasi & Meeting Point */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label className="font-body-semibold text-body-semibold text-on-surface">
                  Kota / Kawasan Destinasi
                </label>
                <input
                  type="text"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  placeholder="Contoh: Kab. Probolinggo (Bromo)"
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular border border-outline-variant/30 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body-semibold text-body-semibold text-on-surface">
                  Titik Kumpul Utama (Meeting Point)
                </label>
                <input
                  type="text"
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  placeholder="Contoh: Stasiun Malang Kotabaru"
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular border border-outline-variant/30 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Durasi Perjalanan */}
            <div className="grid grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label className="font-body-semibold text-body-semibold text-on-surface">
                  Durasi (Hari)
                </label>
                <input
                  type="number"
                  min="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular border border-outline-variant/30 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-body-semibold text-body-semibold text-on-surface">
                  Durasi (Malam)
                </label>
                <input
                  type="number"
                  min="0"
                  value={durationNights}
                  onChange={(e) => setDurationNights(parseInt(e.target.value) || 0)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular border border-outline-variant/30 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* URL Thumbnail Foto */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body-semibold text-body-semibold text-on-surface">
                URL Banner / Foto Cover
              </label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular border border-outline-variant/30 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Deskripsi */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body-semibold text-body-semibold text-on-surface">
                Deskripsi Lengkap Paket
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan daya tarik wisata, pemandangan, dan keunggulan paket..."
                className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular border border-outline-variant/30 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </section>

          {/* Section 2: Itinerary */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-low">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                  <MaterialIcon name="schedule" className="text-lg" />
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Rute &amp; Itinerary Perjalanan
                  </h2>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Susun timeline aktivitas agar calon wisatawan memahami alur perjalanan.
                  </p>
                </div>
              </div>
            </div>

            {itinerary.map((dayGroup, dIdx) => (
              <div key={dayGroup.day} className="flex flex-col gap-space-sm p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-body-semibold text-primary font-bold">
                    Hari ke-{dayGroup.day}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddActivity(dIdx)}
                    className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
                  >
                    <MaterialIcon name="add" className="text-xs" /> Tambah Aktivitas
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {dayGroup.activities.map((act, aIdx) => (
                    <div
                      key={aIdx}
                      className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={act.time}
                        onChange={(e) => {
                          const updated = [...itinerary];
                          updated[dIdx].activities[aIdx].time = e.target.value;
                          setItinerary(updated);
                        }}
                        placeholder="Jam (08:00)"
                        className="sm:col-span-2 px-2 py-1 rounded bg-surface-container-low text-xs font-mono outline-none border border-outline-variant/20"
                      />
                      <input
                        type="text"
                        value={act.title}
                        onChange={(e) => {
                          const updated = [...itinerary];
                          updated[dIdx].activities[aIdx].title = e.target.value;
                          setItinerary(updated);
                        }}
                        placeholder="Nama Kegiatan"
                        className="sm:col-span-4 px-2 py-1 rounded bg-surface-container-low text-xs font-semibold outline-none border border-outline-variant/20"
                      />
                      <input
                        type="text"
                        value={act.description}
                        onChange={(e) => {
                          const updated = [...itinerary];
                          updated[dIdx].activities[aIdx].description = e.target.value;
                          setItinerary(updated);
                        }}
                        placeholder="Keterangan singkat kegiatan..."
                        className="sm:col-span-5 px-2 py-1 rounded bg-surface-container-low text-xs outline-none border border-outline-variant/20"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...itinerary];
                          updated[dIdx].activities = updated[dIdx].activities.filter(
                            (_, i) => i !== aIdx
                          );
                          setItinerary(updated);
                        }}
                        className="sm:col-span-1 p-1 text-on-surface-variant hover:text-error text-center"
                      >
                        <MaterialIcon name="delete" className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Section 3: Inklusi & Eksklusi */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center gap-space-sm pb-space-xs border-b border-surface-container-low">
              <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <MaterialIcon name="task_alt" className="text-lg" />
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Fasilitas &amp; Inklusi Paket
                </h2>
                <p className="font-caption text-caption text-on-surface-variant">
                  Transparansi fasilitas yang ditanggung dan tidak ditanggung untuk mencegah sengketa.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {/* Inclusions */}
              <div className="flex flex-col gap-2">
                <span className="font-body-semibold text-primary font-bold text-sm">
                  Termasuk (Inclusions)
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInclusion())}
                    placeholder="Contoh: Tiket Masuk TNBTS"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddInclusion}
                    className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold"
                  >
                    Tambah
                  </button>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  {inclusions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-xs text-on-surface"
                    >
                      <span className="flex items-center gap-1.5">
                        <MaterialIcon name="check" className="text-xs text-primary" /> {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(idx)}
                        className="text-outline hover:text-error"
                      >
                        <MaterialIcon name="close" className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions */}
              <div className="flex flex-col gap-2">
                <span className="font-body-semibold text-secondary font-bold text-sm">
                  Tidak Termasuk (Exclusions)
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddExclusion())}
                    placeholder="Contoh: Pengeluaran pribadi"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddExclusion}
                    className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-semibold"
                  >
                    Tambah
                  </button>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  {exclusions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-xs text-on-surface"
                    >
                      <span className="flex items-center gap-1.5">
                        <MaterialIcon name="close" className="text-xs text-outline" /> {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExclusion(idx)}
                        className="text-outline hover:text-error"
                      >
                        <MaterialIcon name="close" className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Live Preview Card */}
          <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
            <span className="font-caption text-caption uppercase text-on-surface-variant font-bold tracking-wider">
              Pratinjau Kartu Marketplace
            </span>

            <div className="rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/20 shadow-sm flex flex-col">
              <div className="relative h-44 w-full bg-surface-container">
                <img
                  src={thumbnailUrl}
                  alt={title || "Paket"}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-on-primary font-micro-badge text-micro-badge font-bold uppercase">
                  {category === "private_trip" ? "PRIVATE TRIP" : "OPEN TRIP"}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white font-mono text-[10px]">
                  {durationDays}D{durationNights > 0 ? `${durationNights}N` : ""}
                </span>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-title-md text-title-md font-bold text-on-surface line-clamp-2">
                  {title || "Judul Paket Wisata"}
                </h3>
                <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                  <MaterialIcon name="pin_drop" className="text-sm text-primary" />
                  <span>{destinationCity}</span>
                </div>
                <div className="pt-2 border-t border-surface-container flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">Mulai Dari:</span>
                  <span className="text-base font-bold text-primary font-headline-sm">
                    Rp 375.000
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Transparansi Escrow & Komisi 2% Flat */}
          <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
            <div className="flex items-center gap-2">
              <MaterialIcon name="shield" className="text-primary text-xl" />
              <span className="font-title-md text-title-md text-on-surface font-bold">
                Jaminan Perlindungan Escrow
              </span>
            </div>
            <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
              Pembayaran dari wisatawan disimpan aman di NusaBook Safe Vault. Dana cair otomatis ke
              rekening mitra H+1 setelah presensi check-in selesai dipindai.
            </p>
            <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between text-xs">
              <span>Potongan Layanan Platform:</span>
              <strong className="text-primary font-bold">2.0% Flat</strong>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}