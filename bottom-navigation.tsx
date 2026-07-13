import type { ReactNode } from "react";
import { PlatformShell } from "@/components/layout";
import { hasSupabaseEnv } from "@/lib/env";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (hasSupabaseEnv()) {
    await requireAdmin();
  }

  return <PlatformShell>{children}</PlatformShell>;
}
