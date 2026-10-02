import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  SchedulesList,
  type ScheduleWithPackage,
  type PackageOption,
} from "@/components/dashboard/schedules-list";

export const metadata = {
  title: "Kelola Jadwal Keberangkatan - Nusabook",
  description: "Manajemen jadwal perjalanan, alokasi kuota, dan harga tiket trip.",
};

export default async function SchedulesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: agent } = await supabase
    .from("travel_agents")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!agent) {
    redirect("/login");
  }

  // 1. Fetch all packages of this agent for selection
  const { data: packagesData } = await supabase
    .from("tour_packages")
    .select("id, title")
    .eq("agent_id", agent.id)
    .order("title", { ascending: true });

  const packages: PackageOption[] = (packagesData || []).map((pkg) => ({
    id: pkg.id,
    title: pkg.title,
  }));

  const packageIds = packages.map((p) => p.id);

  // 2. Fetch trip schedules belonging to these packages
  let schedules: ScheduleWithPackage[] = [];

  if (packageIds.length > 0) {
    const { data: schedulesData } = await supabase
      .from("trip_schedules")
      .select(
        "id, package_id, departure_date, return_date, total_quota, reserved_quota, booked_quota, price_per_pax, status, version, created_at, updated_at, tour_package:tour_packages(id, title, slug, category, destination_city)"
      )
      .in("package_id", packageIds)
      .order("departure_date", { ascending: true });

    schedules = (schedulesData as unknown as ScheduleWithPackage[]) || [];
  }

  return <SchedulesList initialSchedules={schedules} packages={packages} />;
}
