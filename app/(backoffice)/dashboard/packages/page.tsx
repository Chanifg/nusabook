import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PackagesList, type PackageItem } from "@/components/dashboard/packages-list";
import type { TourPackage } from "@/types/database.types";

export const metadata = {
  title: "Kelola Paket Wisata - Nusabook",
  description: "Daftar paket wisata Open Trip dan Private Trip milik agen.",
};

type PackageWithSchedules = Pick<
  TourPackage,
  | "id"
  | "title"
  | "slug"
  | "category"
  | "destination_city"
  | "duration_days"
  | "duration_nights"
  | "thumbnail_url"
  | "is_published"
  | "created_at"
> & {
  trip_schedules: { id: string }[] | null;
};

export default async function PackagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: agent } = await supabase
    .from("travel_agents")
    .select("id, slug")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!agent) {
    redirect("/login");
  }

  // Fetch packages with associated schedules count
  const { data: packagesData } = await supabase
    .from("tour_packages")
    .select(
      "id, title, slug, category, destination_city, duration_days, duration_nights, thumbnail_url, is_published, created_at, trip_schedules(id)"
    )
    .eq("agent_id", agent.id)
    .order("created_at", { ascending: false });

  const typedPackages = (packagesData as unknown as PackageWithSchedules[]) || [];

  const formattedPackages: PackageItem[] = typedPackages.map((pkg) => ({
    id: pkg.id,
    title: pkg.title,
    slug: pkg.slug,
    category: pkg.category,
    destination_city: pkg.destination_city,
    duration_days: pkg.duration_days,
    duration_nights: pkg.duration_nights,
    thumbnail_url: pkg.thumbnail_url,
    is_published: pkg.is_published,
    created_at: pkg.created_at,
    schedules_count: Array.isArray(pkg.trip_schedules) ? pkg.trip_schedules.length : 0,
  }));

  return (
    <PackagesList
      initialPackages={formattedPackages}
      agentSlug={agent.slug}
      agentId={agent.id}
    />
  );
}
