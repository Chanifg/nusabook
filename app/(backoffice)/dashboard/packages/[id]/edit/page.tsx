import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PackageForm } from "@/components/dashboard/package-form";
import type { TourPackage } from "@/types/database.types";

export const metadata = {
  title: "Edit Paket Wisata - Nusabook",
  description: "Formulir pembaruan paket wisata agen tour & travel.",
};

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  // Strict ownership check: only fetch if package belongs to this agent
  const { data: packageData, error } = await supabase
    .from("tour_packages")
    .select("*")
    .eq("id", id)
    .eq("agent_id", agent.id)
    .maybeSingle();

  if (error || !packageData) {
    // Cross-tenant access attempt or package does not exist
    redirect("/dashboard/packages");
  }

  return (
    <PackageForm
      agentId={agent.id}
      initialData={packageData as TourPackage}
      isEditing={true}
    />
  );
}
