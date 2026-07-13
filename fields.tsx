import type { ReactNode } from "react";
import { PlatformShell } from "@/components/layout";
import { hasSupabaseEnv } from "@/lib/env";
import { requireUser } from "@/lib/auth/session";

export default async function PlatformLayout({ children }: { children: ReactNode }) {
  if (hasSupabaseEnv()) {
    await requireUser();
  }

  return <PlatformShell>{children}</PlatformShell>;
}
