"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, ErrorState, Input, PasswordInput } from "@/components/ui";
import { signInSchema, type SignInInput } from "@/lib/validation/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" }
  });

  async function onSubmit(values: SignInInput) {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword(values);

    if (signInError) {
      setError("Nao foi possivel entrar. Verifique seu e-mail e senha.");
      return;
    }

    router.replace(searchParams.get("redirectedFrom") ?? "/hoje");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      {error ? <ErrorState description={error} title="Entrada nao concluida" /> : null}
      <Input error={form.formState.errors.email?.message} label="E-mail" type="email" {...form.register("email")} />
      <PasswordInput error={form.formState.errors.password?.message} label="Senha" {...form.register("password")} />
      <Button disabled={form.formState.isSubmitting} type="submit">
        Entrar
      </Button>
      <div className="flex items-center justify-between text-sm">
        <Link className="font-semibold text-brand-primary hover:text-brand-primary-hover" href="/recuperar-senha">
          Esqueci minha senha
        </Link>
        <Link className="font-semibold text-text-secondary hover:text-brand-primary" href="/cadastro">
          Criar conta
        </Link>
      </div>
    </form>
  );
}
