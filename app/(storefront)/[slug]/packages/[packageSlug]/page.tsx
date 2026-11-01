import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { findCatalogPackage } from "@/lib/catalog-data";
import { bookingStore } from "@/lib/booking-store";
import {
  PackageDetailView,
  ScheduleOption,
} from "./package-detail-view";

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string; packageSlug: string }>;
}) {
  const { slug, packageSlug } = await params;
  let agentData: any = null;
  let packageData: any = null;

  try {
    const supabase = await createClient();

    // Fetch active agent and published package in parallel to eliminate serial network waterfall
    const [agentRes, packageRes] = await Promise.all([
      supabase
        .from("travel_agents")
        .select("id, business_name, slug, city, whatsapp_number")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle(),
      supabase
        .from("tour_packages")
        .select("*, trip_schedules(*), travel_agents!inner(slug, is_active)")
        .eq("slug", packageSlug)
        .eq("travel_agents.slug", slug)
        .eq("travel_agents.is_active", true)
        .eq("is_published", true)
        .maybeSingle(),
    ]);

    agentData = agentRes.data;
    packageData = packageRes.data;
  } catch {
    // Local database connection offline, fallback to synchronized catalog
  }

  // Fallback to verified catalog package if DB returns empty
  if (!agentData || !packageData) {
    const catalogItem = findCatalogPackage(slug, packageSlug);
    if (!catalogItem) {
      notFound();
    }
    agentData = {
      id: catalogItem.agent.id,
      business_name: catalogItem.agent.business_name,
      slug: catalogItem.agent.slug,
      city: catalogItem.agent.city,
      whatsapp_number: catalogItem.agent.whatsapp_number,
    };
    packageData = {
      ...catalogItem,
      trip_schedules: catalogItem.schedules.map((s) => {
        const liveQ = bookingStore.getScheduleQuota(s.id);
        return {
          id: s.id,
          departure_date: s.departureDate,
          return_date: s.returnDate,
          total_quota: liveQ.total,
          reserved_quota: liveQ.reserved,
          booked_quota: liveQ.booked,
          price_per_pax: s.pricePerPax,
          status: s.status,
        };
      }),
    };
  }

  if (!agentData || !packageData) {
    notFound();
  }

  // Map dynamic trip schedules
  const rawSchedules = packageData.trip_schedules || [];
  const schedules: ScheduleOption[] = rawSchedules.map((sch: any) => {
    const liveQ = bookingStore.getScheduleQuota(sch.id);
    const availableSeats = Math.max(
      0,
      liveQ.total - liveQ.reserved - liveQ.booked
    );
    const isSoldOut =
      availableSeats === 0 ||
      sch.status === "SOLD_OUT" ||
      sch.status === "CLOSED";

    const dateObj = new Date(sch.departure_date);
    const dateText = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : sch.departure_date;

    return {
      id: sch.id,
      dateText,
      departureTime: "Pagi / Sesuai Jadwal",
      availableSeats,
      status: isSoldOut ? "sold_out" : availableSeats <= 3 ? "urgent" : "available",
      statusBadge: isSoldOut
        ? "Penuh (Sold Out)"
        : availableSeats <= 3
        ? `Sisa ${availableSeats} Kursi!`
        : `Tersedia ${availableSeats} Kursi`,
      isSoldOut,
      pricePerPax: sch.price_per_pax || 250000,
    };
  });

  return (
    <PackageDetailView
      slug={slug}
      packageSlug={packageSlug}
      agent={agentData}
      pkg={packageData}
      schedules={schedules}
    />
  );
}
