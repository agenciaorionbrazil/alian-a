"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, ErrorState, Input } from "@/components/ui";
import { profileSchema, type ProfileInput } from "@/lib/validation/profile";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Nao foi possivel carregar os dados.");
  return data;
}

export function ProfileForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", avatarUrl: "" }
  });

  useEffect(() => {
    requestJson<{ profile: { full_name: string | null; avatar_url: string | null } }>("/api/profile")
      .then((data) => {
        form.reset({
          fullName: data.profile.full_name ?? "",
          avatarUrl: data.profile.avatar_url ?? ""
        });
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Nao foi possivel carregar o perfil."));
  }, [form]);

  async function onSubmit(values: ProfileInput) {
    setError(null);
    setStatus(null);
    try {
      await requestJson<{ ok: true }>("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      setStatus("Perfil salvo com seguranca.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel salvar o perfil.");
    }
  }

  return (
    <form className="grid gap-4 rounded-2xl bg-surface p-6 shadow-soft" onSubmit={form.handleSubmit(onSubmit)}>
      {error ? <ErrorState description={error} title="Perfil nao salvo" /> : null}
      {status ? <p className="rounded-lg bg-success/10 p-3 text-sm font-medium text-success">{status}</p> : null}
      <Input error={form.formState.errors.fullName?.message} label="Nome" {...form.register("fullName")} />
      <Input error={form.formState.errors.avatarUrl?.message} label="URL do avatar" {...form.register("avatarUrl")} />
      <Button disabled={form.formState.isSubmitting} type="submit">
        <Save className="size-4" />
        Salvar perfil
      </Button>
    </form>
  );
}
