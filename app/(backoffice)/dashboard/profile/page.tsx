import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/dashboard/profile-form";
import type { TravelAgent, Profile } from "@/types/database.types";

export const metadata = {
  title: "Profil Usaha - Nusabook",
  description: "Pengaturan identitas bisnis dan rekening pencairan dana agen.",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: agent } = await supabase
    .from("travel_agents")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  return (
    <ProfileForm
      profile={profile as Profile | null}
      agent={agent as TravelAgent | null}
      userEmail={user.email}
    />
  );
}
