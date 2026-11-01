import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

  const agentData = agentRes.data as any;
  if (!agentData) {
    notFound();
  }

  const packageData = packageRes.data as any;
  if (!packageData) {
    notFound();
  }

  // 3. Map dynamic trip schedules
  const rawSchedules = packageData.trip_schedules || [];
  const schedules: ScheduleOption[] = rawSchedules.map((sch: any) => {
    const availableSeats = Math.max(
      0,
      sch.total_quota - sch.reserved_quota - sch.booked_quota
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
      departureTime: "Midnight 00:00 WIB",
      availableSeats,
      status: isSoldOut ? "sold_out" : availableSeats <= 3 ? "urgent" : "available",
      statusBadge: isSoldOut
        ? "Penuh (Sold Out)"
        : availableSeats <= 3
        ? `Sisa ${availableSeats} Kursi!`
        : `Tersedia ${availableSeats} Kursi`,
      isSoldOut,
      pricePerPax: sch.price_per_pax || 450000,
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
