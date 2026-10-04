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

  // 1. Fetch active travel agent
  const { data: agentData } = (await supabase
    .from("travel_agents")
    .select("id, business_name, slug, city, whatsapp_number")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()) as any;

  if (!agentData) {
    notFound();
  }

  // 2. Fetch published tour package with its schedules
  const { data: packageData } = (await supabase
    .from("tour_packages")
    .select("*, trip_schedules(*)")
    .eq("agent_id", agentData.id)
    .eq("slug", packageSlug)
    .eq("is_published", true)
    .maybeSingle()) as any;

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
