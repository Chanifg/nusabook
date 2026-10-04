import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PackageDetailClient from "./package-detail-client";

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string; packageSlug: string }>;
}) {
  const { slug, packageSlug } = await params;
  const supabase = await createClient();

  // 1. Verify agent exists & active
  const { data: agent } = (await supabase
    .from("travel_agents")
    .select("id, business_name, slug, is_active")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()) as any;

  if (!agent) {
    notFound();
  }

  // 2. Fetch package and schedules
  const { data: pkg } = (await supabase
    .from("tour_packages")
    .select("*, trip_schedules(*)")
    .eq("agent_id", agent.id)
    .eq("slug", packageSlug)
    .eq("is_published", true)
    .maybeSingle()) as any;

  if (!pkg) {
    notFound();
  }

  // Map trip_schedules to schedule options
  const schedules = (pkg.trip_schedules || []).map((s: any) => ({
    id: s.id,
    dateText: new Date(s.departure_date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    departureTime: "Midnight 00:00 WIB",
    availableSeats: s.quota_remaining,
    status:
      s.quota_remaining <= 2 && s.quota_remaining > 0
        ? "urgent"
        : s.quota_remaining === 0
        ? "sold_out"
        : "available",
    statusBadge:
      s.quota_remaining === 0
        ? "Habis (Sold Out)"
        : s.quota_remaining <= 2
        ? `Sisa ${s.quota_remaining} Kursi!`
        : `Tersedia ${s.quota_remaining} Kursi`,
    isSoldOut: s.quota_remaining === 0,
    price: s.price,
  }));

  return (
    <PackageDetailClient
      slug={slug}
      packageSlug={packageSlug}
      pkg={pkg}
      schedules={schedules}
    />
  );
}
