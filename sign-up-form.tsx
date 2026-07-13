"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, ErrorState, Input } from "@/components/ui";
import { recoverPasswordSchema, type RecoverPasswordInput } from "@/lib/validation/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { absoluteUrl } from "@/lib/utils";

export function RecoverPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const form = useForm<RecoverPasswordInput>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: { email: "" }
  });

  async function onSubmit(values: RecoverPasswordInput) {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: absoluteUrl("/atualizar-senha")
    });

    if (resetError) {
      setError("Nao foi possivel enviar a recuperacao de senha.");
      return;
    }

    setSent(true);
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      {error ? <ErrorState description={error} title="Envio nao concluido" /> : null}
      {sent ? (
        <div className="rounded-xl bg-success/10 p-4 text-sm leading-6 text-success">
          Enviamos as instrucoes para seu e-mail, se ele estiver cadastrado.
        </div>
      ) : null}
      <Input error={form.formState.errors.email?.message} label="E-mail" type="email" {...form.register("email")} />
      <Button disabled={form.formState.isSubmitting} type="submit">
        Enviar recuperacao
      </Button>
      <Link className="text-sm font-semibold text-brand-primary hover:text-brand-primary-hover" href="/entrar">
        Voltar para entrada
      </Link>
    </form>
  );
}
