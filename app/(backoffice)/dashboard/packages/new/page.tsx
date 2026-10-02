import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PackageForm } from "@/components/dashboard/package-form";

export const metadata = {
  title: "Tambah Paket Wisata Baru - Nusabook",
  description: "Formulir pembuatan paket wisata baru untuk katalog agen.",
};

export default async function NewPackagePage() {
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

  return <PackageForm agentId={agent.id} isEditing={false} />;
}
