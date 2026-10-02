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
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        businessName={businessName}
        agentSlug={agentSlug}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header
          businessName={businessName}
          userName={userName}
          userEmail={userEmail}
          agentSlug={agentSlug}
          isVerified={isVerified}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
