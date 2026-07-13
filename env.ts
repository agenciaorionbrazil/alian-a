"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/entrar");
    router.refresh();
  }

  return (
    <Button onClick={signOut} type="button" variant="secondary">
      <LogOut className="size-4" />
      Sair
    </Button>
  );
}
