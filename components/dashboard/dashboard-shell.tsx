"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

interface DashboardShellProps {
  children: React.ReactNode;
  businessName: string;
  agentSlug?: string;
  userName: string;
  userEmail?: string;
  isVerified?: boolean;
}

export function DashboardShell({
  children,
  businessName,
  agentSlug,
  userName,
  userEmail,
  isVerified = false,
}: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background font-body-regular text-body-regular text-on-surface min-h-screen antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        businessName={businessName}
        agentSlug={agentSlug}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="pl-0 lg:pl-72 flex flex-col min-h-screen">
        <Header
          businessName={businessName}
          userName={userName}
          userEmail={userEmail}
          agentSlug={agentSlug}
          isVerified={isVerified}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="w-full pt-16 bg-background min-h-screen px-space-md sm:px-space-lg py-space-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
