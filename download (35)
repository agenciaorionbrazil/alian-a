import type { ReactNode } from "react";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { SOSFloatingButton } from "@/components/sos/sos-floating-button";

export function PlatformShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background-main">
      <DesktopSidebar />
      <MobileHeader />
      <main className="safe-bottom mx-auto max-w-6xl px-4 py-8 lg:ml-64 lg:px-8">{children}</main>
      <SOSFloatingButton />
      <BottomNavigation />
    </div>
  );
}
