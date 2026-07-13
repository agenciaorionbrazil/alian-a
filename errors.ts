"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Checkbox, ErrorState, Input, PasswordInput } from "@/components/ui";
import { signUpSchema, type SignUpInput } from "@/lib/validation/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { absoluteUrl } from "@/lib/utils";

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "" }
  });

  async function onSubmit(values: SignUpInput) {
    if (!accepted) {
      setError("Aceite os termos essenciais para criar sua conta.");
      return;
    }

    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName },
        emailRedirectTo: absoluteUrl("/api/auth/callback")
      }
    });

    if (signUpError) {
      setError("Nao foi possivel criar sua conta agora.");
      return;
    }

    router.replace("/hoje");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      {error ? <ErrorState description={error} title="Cadastro nao concluido" /> : null}
      <Input error={form.formState.errors.fullName?.message} label="Nome" {...form.register("fullName")} />
      <Input error={form.formState.errors.email?.message} label="E-mail" type="email" {...form.register("email")} />
      <PasswordInput error={form.formState.errors.password?.message} label="Senha" {...form.register("password")} />
      <Checkbox
        checked={accepted}
        label="Li e aceito os termos essenciais e a politica de privacidade. Consentimentos opcionais serao solicitados separadamente."
        onChange={(event) => setAccepted(event.target.checked)}
      />
      <Button disabled={form.formState.isSubmitting} type="submit">
        Criar conta
      </Button>
      <p className="text-sm text-text-secondary">
        Ja tem conta?{" "}
        <Link className="font-semibold text-brand-primary hover:text-brand-primary-hover" href="/entrar">
          Entrar
        </Link>
      </p>
    </form>
  );
}
