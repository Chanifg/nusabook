import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Mitra - Nusabook",
  description: "Panel kendali operasional, manajemen paket wisata, dan pembukuan agen tour & travel.",
};

export default async function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Server-side session verification
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Query user profile and travel agent details
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone_number, role")
    .eq("id", user.id)
    .maybeSingle();

  const { data: agent } = await supabase
    .from("travel_agents")
    .select("business_name, slug, is_verified, is_active")
    .eq("owner_id", user.id)
    .maybeSingle();

  const businessName = agent?.business_name || "Mitra Tour & Travel";
  const agentSlug = agent?.slug;
  const userName = profile?.full_name || user.email?.split("@")[0] || "Pemilik Agen";
  const userEmail = user.email;
  const isVerified = agent?.is_verified ?? false;

  return (
    <DashboardShell
      businessName={businessName}
      agentSlug={agentSlug}
      userName={userName}
      userEmail={userEmail}
      isVerified={isVerified}
    >
      {children}
    </DashboardShell>
  );
}
