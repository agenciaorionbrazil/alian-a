"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, ErrorState, PasswordInput } from "@/components/ui";
import { updatePasswordSchema, type UpdatePasswordInput } from "@/lib/validation/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: "" }
  });

  async function onSubmit(values: UpdatePasswordInput) {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password: values.password });

    if (updateError) {
      setError("Nao foi possivel atualizar sua senha.");
      return;
    }

    router.replace("/hoje");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      {error ? <ErrorState description={error} title="Senha nao atualizada" /> : null}
      <PasswordInput error={form.formState.errors.password?.message} label="Nova senha" {...form.register("password")} />
      <Button disabled={form.formState.isSubmitting} type="submit">
        Atualizar senha
      </Button>
    </form>
  );
}
