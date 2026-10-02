"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { TourPackage } from "@/types/database.types";
import {
  Package,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  Compass,
} from "lucide-react";

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
  const [isSlugManual, setIsSlugManual] = useState(isEditing);
  const [category, setCategory] = useState<"open_trip" | "private_trip">(
    initialData?.category || "open_trip"
  );
  const [destinationCity, setDestinationCity] = useState(
    initialData?.destination_city || ""
  );
  const [durationDays, setDurationDays] = useState(
    initialData?.duration_days || 1
  );
  const [durationNights, setDurationNights] = useState(
    initialData?.duration_nights || 0
  );
  const [meetingPoint, setMeetingPoint] = useState(
    initialData?.meeting_point || ""
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  // Dynamic Itinerary State
  const parseInitialItinerary = (): ItineraryDay[] => {
    if (!initialData?.itinerary || !Array.isArray(initialData.itinerary)) {
      return [
        {
          day: 1,
          activities: [
            {
              time: "08:00",
              title: "Kumpul dan Briefing",
              description: "Pertemuan di meeting point dan persiapan perjalanan.",
            },
          ],
        },
      ];
    }

    // Check if format is day-based or flat activity list
    const firstItem = initialData.itinerary[0];
    if (firstItem && typeof firstItem === "object" && "day" in firstItem) {
      return initialData.itinerary as unknown as ItineraryDay[];
    }

    // Convert flat list into day 1
    return [
      {
        day: 1,
        activities: initialData.itinerary.map((act: any) => ({
          time: act.time || "",
          title: act.title || act.activity || "Aktivitas Perjalanan",
          description: act.description || act.desc || "",
        })),
      },
    ];
  };

  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    parseInitialItinerary()
  );

  // Dynamic Facilities
  const [facilitiesIncluded, setFacilitiesIncluded] = useState<string[]>(
    initialData?.facilities_included || [
      "Transportasi AC / Armada Jeep",
      "Tiket Masuk Wisata",
      "Pemandu Lokal Berpengalaman",
      "Air Mineral",
    ]
  );
  const [facilitiesExcluded, setFacilitiesExcluded] = useState<string[]>(
    initialData?.facilities_excluded || [
      "Pengeluaran Pribadi",
      "Tips Pemandu / Kru",
      "Asuransi Tambahan",
    ]
  );

  const [newIncludedItem, setNewIncludedItem] = useState("");
  const [newExcludedItem, setNewExcludedItem] = useState("");

  // Additional Fields
  const [cancellationPolicy, setCancellationPolicy] = useState(
    initialData?.cancellation_policy ||
      "Pembatalan hingga H-3 keberangkatan mendapatkan pengembalian 50%. Pembatalan kurang dari 48 jam tidak dapat di-refund."
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnail_url || ""
  );
  const [isPublished, setIsPublished] = useState(
    initialData ? initialData.is_published : true
  );

  // Status & Validation
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);

  // Slug generator helper
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s-]+/g, "-");
  };

  // Auto generate slug
  useEffect(() => {
    if (!isSlugManual && title.trim()) {
      setSlug(generateSlug(title));
    }
  }, [title, isSlugManual]);

  // Live slug uniqueness verification in current agent scope
  useEffect(() => {
    if (!slug.trim()) {
      setIsSlugAvailable(null);
      return;
    }

    const checkSlug = async () => {
      setSlugChecking(true);
      try {
        let query = supabase
          .from("tour_packages")
          .select("id")
          .eq("agent_id", agentId)
          .eq("slug", slug.trim());

        if (isEditing && initialData?.id) {
          query = query.neq("id", initialData.id);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
          setIsSlugAvailable(true);
        } else {
          setIsSlugAvailable(!data);
        }
      } catch {
        setIsSlugAvailable(true);
      } finally {
        setSlugChecking(false);
      }
    };

    const timeout = setTimeout(checkSlug, 350);
    return () => clearTimeout(timeout);
  }, [slug, agentId, isEditing, initialData?.id]);

  // Itinerary helper methods
  const addDay = () => {
    setItinerary((prev) => [
      ...prev,
      {
        day: prev.length + 1,
        activities: [
          {
            time: "08:00",
            title: "Aktivitas Hari Ini",
            description: "Deskripsi kegiatan perjalanan.",
          },
        ],
      },
    ]);
  };

  const removeDay = (dayIndex: number) => {
    if (itinerary.length <= 1) return;
    setItinerary((prev) =>
      prev
        .filter((_, idx) => idx !== dayIndex)
        .map((item, idx) => ({ ...item, day: idx + 1 }))
    );
  };

  const addActivity = (dayIndex: number) => {
    setItinerary((prev) =>
      prev.map((dayItem, idx) => {
        if (idx !== dayIndex) return dayItem;
        return {
          ...dayItem,
          activities: [
            ...dayItem.activities,
            { time: "10:00", title: "Kegiatan Baru", description: "" },
          ],
        };
      })
    );
  };

  const removeActivity = (dayIndex: number, actIndex: number) => {
    setItinerary((prev) =>
      prev.map((dayItem, idx) => {
        if (idx !== dayIndex) return dayItem;
        return {
          ...dayItem,
          activities: dayItem.activities.filter((_, aIdx) => aIdx !== actIndex),
        };
      })
    );
  };

  const updateActivity = (
    dayIndex: number,
    actIndex: number,
    field: keyof ItineraryActivity,
    val: string
  ) => {
    setItinerary((prev) =>
      prev.map((dayItem, idx) => {
        if (idx !== dayIndex) return dayItem;
        return {
          ...dayItem,
          activities: dayItem.activities.map((act, aIdx) => {
            if (aIdx !== actIndex) return act;
            return { ...act, [field]: val };
          }),
        };
      })
    );
  };

  // Facilities helper methods
  const addIncludedFacility = () => {
    if (!newIncludedItem.trim()) return;
    setFacilitiesIncluded((prev) => [...prev, newIncludedItem.trim()]);
    setNewIncludedItem("");
  };

  const removeIncludedFacility = (index: number) => {
    setFacilitiesIncluded((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addExcludedFacility = () => {
    if (!newExcludedItem.trim()) return;
    setFacilitiesExcluded((prev) => [...prev, newExcludedItem.trim()]);
    setNewExcludedItem("");
  };

  const removeExcludedFacility = (index: number) => {
    setFacilitiesExcluded((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (
      !title.trim() ||
      !slug.trim() ||
      !destinationCity.trim() ||
      !meetingPoint.trim() ||
      !description.trim()
    ) {
      setErrorMessage("Silakan lengkapi seluruh kolom informasi utama paket wisata.");
      return;
    }

    if (durationDays < 1) {
      setErrorMessage("Durasi perjalanan minimal 1 hari.");
      return;
    }

    if (isSlugAvailable === false) {
      setErrorMessage("Slug paket wisata sudah digunakan oleh paket lain di akun Anda.");
      return;
    }

    setIsLoading(true);

    const payload = {
      agent_id: agentId,
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      category,
      destination_city: destinationCity.trim(),
      duration_days: Number(durationDays),
      duration_nights: Number(durationNights),
      meeting_point: meetingPoint.trim(),
      description: description.trim(),
      itinerary,
      facilities_included: facilitiesIncluded,
      facilities_excluded: facilitiesExcluded,
      cancellation_policy: cancellationPolicy.trim() || null,
      thumbnail_url: thumbnailUrl.trim() || null,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEditing && initialData?.id) {
        // Update package
        const { error } = await supabase
          .from("tour_packages")
          .update(payload as any)
          .eq("id", initialData.id)
          .eq("agent_id", agentId);

        if (error) {
          console.error("Update package error:", error);
          setErrorMessage("Gagal memperbarui paket wisata: " + error.message);
          setIsLoading(false);
          return;
        }
      } else {
        // Create new package
        const { error } = await supabase
          .from("tour_packages")
          .insert(payload as any);

        if (error) {
          console.error("Create package error:", error);
          setErrorMessage("Gagal membuat paket wisata: " + error.message);
          setIsLoading(false);
          return;
        }
      }

      router.push("/dashboard/packages");
      router.refresh();
    } catch (err) {
      console.error("Fatal form error:", err);
      setErrorMessage("Terjadi kesalahan sistem saat menyimpan data.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button & Title */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/packages"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-brand-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Daftar Paket</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {isEditing ? "Edit Paket Wisata" : "Buat Paket Wisata Baru"}
        </h2>
        <span className="text-xs text-slate-500">
          Kolom bertanda bintang (*) wajib diisi.
        </span>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Informasi Utama */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            1. Informasi Utama Paket
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Paket Wisata *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Sunrise Lava Tour Merapi & Bunker Kaliadem"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Slug URL Paket *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setIsSlugManual(true);
                    setSlug(generateSlug(e.target.value));
                  }}
                  placeholder="sunrise-lava-tour-merapi"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-20 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {slugChecking ? (
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  ) : isSlugAvailable === true ? (
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Tersedia
                    </span>
                  ) : isSlugAvailable === false ? (
                    <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Terpakai
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Kategori Paket *
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "open_trip" | "private_trip")
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
              >
                <option value="open_trip">Open Trip (Gabungan)</option>
                <option value="private_trip">Private Trip (Rombongan Khusus)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Destination City */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Kota Destinasi *
              </label>
              <input
                type="text"
                required
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                placeholder="Yogyakarta / Sleman"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
              />
            </div>

            {/* Duration Days */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Durasi Hari *
              </label>
              <input
                type="number"
                min={1}
                required
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
              />
            </div>

            {/* Duration Nights */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Durasi Malam
              </label>
              <input
                type="number"
                min={0}
                required
                value={durationNights}
                onChange={(e) => setDurationNights(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
              />
            </div>
          </div>

          {/* Meeting Point */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Titik Kumpul (Meeting Point) *
            </label>
            <input
              type="text"
              required
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
              placeholder="Basecamp Jeep Kaliurang, Sleman (04:00 WIB)"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Deskripsi Lengkap Paket *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan keunggulan paket wisata, spot foto menarik, dan pengalaman yang didapatkan wisatawan..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
          </div>
        </div>

        {/* Section 2: Dynamic Itinerary Builder */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                2. Rencana Perjalanan (Itinerary)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Susun jadwal agenda bertahap per hari beserta jam kegiatannya.
              </p>
            </div>
            <button
              type="button"
              onClick={addDay}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 hover:border-brand-100 transition shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Hari</span>
            </button>
          </div>

          <div className="space-y-6">
            {itinerary.map((dayItem, dayIdx) => (
              <div
                key={dayIdx}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-lg">
                    Hari Ke-{dayItem.day}
                  </span>
                  {itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(dayIdx)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus Hari</span>
                    </button>
                  )}
                </div>

                {/* Activities in this day */}
                <div className="space-y-3">
                  {dayItem.activities.map((act, actIdx) => (
                    <div
                      key={actIdx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs"
                    >
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                          Waktu / Jam
                        </label>
                        <input
                          type="text"
                          value={act.time || ""}
                          onChange={(e) =>
                            updateActivity(dayIdx, actIdx, "time", e.target.value)
                          }
                          placeholder="04:00"
                          className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-brand-700 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                          Judul Aktivitas *
                        </label>
                        <input
                          type="text"
                          required
                          value={act.title}
                          onChange={(e) =>
                            updateActivity(dayIdx, actIdx, "title", e.target.value)
                          }
                          placeholder="Spot Sunrise Kaliadem"
                          className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-brand-700 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                          Keterangan Aktivitas
                        </label>
                        <input
                          type="text"
                          value={act.description}
                          onChange={(e) =>
                            updateActivity(
                              dayIdx,
                              actIdx,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Briefing keselamatan dan menikmati golden sunrise."
                          className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-brand-700 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-1 flex items-end justify-center pb-1">
                        <button
                          type="button"
                          onClick={() => removeActivity(dayIdx, actIdx)}
                          disabled={dayItem.activities.length <= 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 disabled:opacity-30 transition"
                          title="Hapus aktivitas"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addActivity(dayIdx)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-900 pt-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Aktivitas di Hari Ke-{dayItem.day}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Fasilitas Included & Excluded */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            3. Fasilitas Paket Perjalanan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fasilitas Termasuk */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Fasilitas Sudah Termasuk (Included)
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIncludedItem}
                  onChange={(e) => setNewIncludedItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addIncludedFacility();
                    }
                  }}
                  placeholder="Contoh: Tiket Masuk & Retribusi"
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-brand-700 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addIncludedFacility}
                  className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Tambah
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                {facilitiesIncluded.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 rounded-lg bg-emerald-50/70 border border-emerald-100 px-3 py-1.5 text-xs text-emerald-900"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeIncludedFacility(idx)}
                      className="text-emerald-700 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Fasilitas Tidak Termasuk */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-rose-800 uppercase tracking-wider">
                Fasilitas Belum Termasuk (Excluded)
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newExcludedItem}
                  onChange={(e) => setNewExcludedItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addExcludedFacility();
                    }
                  }}
                  placeholder="Contoh: Pengeluaran Pribadi"
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-brand-700 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addExcludedFacility}
                  className="rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition"
                >
                  Tambah
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                {facilitiesExcluded.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 rounded-lg bg-rose-50/70 border border-rose-100 px-3 py-1.5 text-xs text-rose-900"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeExcludedFacility(idx)}
                      className="text-rose-700 hover:text-rose-900"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Gambar, Kebijakan, dan Publikasi */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            4. Pengaturan Publikasi & Kebijakan
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              URL Thumbnail / Foto Utama Paket
            </label>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Gunakan tautan gambar resolusi tinggi (16:9 atau 4:3) untuk tampilan menarik di etalase wisatawan.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Kebijakan Pembatalan & Refund
            </label>
            <textarea
              rows={2}
              value={cancellationPolicy}
              onChange={(e) => setCancellationPolicy(e.target.value)}
              placeholder="Jelaskan batas waktu pembatalan yang diperbolehkan..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
          </div>

          {/* Toggle Publish */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-5 w-5 rounded-md border-slate-300 text-brand-700 focus:ring-brand-700"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">
                  Terbitkan Langsung ke Storefront (Live)
                </span>
                <span className="text-xs text-slate-500">
                  Jika tidak dicentang, paket disimpan sebagai Draf dan tidak terlihat oleh wisatawan.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/dashboard/packages"
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={isLoading || isSlugAvailable === false}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-900 transition disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan Paket...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isEditing ? "Perbarui Paket Wisata" : "Simpan Paket Wisata"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}