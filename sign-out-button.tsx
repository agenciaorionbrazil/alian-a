"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Checkbox, ErrorState, Input } from "@/components/ui";
import {
  consentsSchema,
  preferencesSchema,
  type ConsentsInput,
  type PreferencesInput
} from "@/lib/validation/profile";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Nao foi possivel concluir a acao.");
  return data;
}

export function SettingsForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const preferencesForm = useForm<PreferencesInput>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      devotionalTime: "",
      timezone: "America/Sao_Paulo",
      notificationsEnabled: false
    }
  });
  const consentsForm = useForm<ConsentsInput>({
    resolver: zodResolver(consentsSchema),
    defaultValues: {
      terms: false,
      privacyPolicy: false,
      personalData: false,
      sensitiveData: false,
      communications: false,
      partnerSharing: false
    }
  });

  useEffect(() => {
    requestJson<{
      preferences: {
        devotional_time: string | null;
        timezone: string;
        notifications_enabled: boolean;
      } | null;
    }>("/api/preferences")
      .then((data) => {
        if (!data.preferences) return;
        preferencesForm.reset({
          devotionalTime: data.preferences.devotional_time ?? "",
          timezone: data.preferences.timezone,
          notificationsEnabled: data.preferences.notifications_enabled
        });
      })
      .catch(() => undefined);

    requestJson<{
      consents: { consent_type: string; granted: boolean }[];
    }>("/api/consents")
      .then((data) => {
        const granted = Object.fromEntries(data.consents.map((consent) => [consent.consent_type, consent.granted]));
        consentsForm.reset({
          terms: Boolean(granted.terms),
          privacyPolicy: Boolean(granted.privacy_policy),
          personalData: Boolean(granted.personal_data),
          sensitiveData: Boolean(granted.sensitive_data),
          communications: Boolean(granted.communications),
          partnerSharing: Boolean(granted.partner_sharing)
        });
      })
      .catch(() => undefined);
  }, [consentsForm, preferencesForm]);

  async function savePreferences(values: PreferencesInput) {
    setError(null);
    setStatus(null);
    try {
      await requestJson<{ ok: true }>("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      setStatus("Preferencias salvas.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel salvar preferencias.");
    }
  }

  async function saveConsents(values: ConsentsInput) {
    setError(null);
    setStatus(null);
    try {
      await requestJson<{ ok: true }>("/api/consents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      setStatus("Consentimentos salvos.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel salvar consentimentos.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {error ? <ErrorState description={error} title="Configuracao nao salva" /> : null}
      {status ? <p className="rounded-lg bg-success/10 p-3 text-sm font-medium text-success lg:col-span-2">{status}</p> : null}

      <form className="grid gap-4 rounded-2xl bg-surface p-6 shadow-soft" onSubmit={preferencesForm.handleSubmit(savePreferences)}>
        <h2 className="font-semibold text-text-primary">Preferencias</h2>
        <Input label="Horario do devocional" type="time" {...preferencesForm.register("devotionalTime")} />
        <Input label="Fuso horario" {...preferencesForm.register("timezone")} />
        <Checkbox label="Receber notificacoes" {...preferencesForm.register("notificationsEnabled")} />
        <Button disabled={preferencesForm.formState.isSubmitting} type="submit">
          <Save className="size-4" />
          Salvar preferencias
        </Button>
      </form>

      <form className="grid gap-4 rounded-2xl bg-surface p-6 shadow-soft" onSubmit={consentsForm.handleSubmit(saveConsents)}>
        <h2 className="font-semibold text-text-primary">Consentimentos</h2>
        <Checkbox label="Aceito os termos de uso" {...consentsForm.register("terms")} />
        <Checkbox label="Aceito a politica de privacidade" {...consentsForm.register("privacyPolicy")} />
        <Checkbox label="Autorizo tratamento de dados pessoais" {...consentsForm.register("personalData")} />
        <Checkbox label="Autorizo tratamento de dados sensiveis" {...consentsForm.register("sensitiveData")} />
        <Checkbox label="Quero receber comunicacoes" {...consentsForm.register("communications")} />
        <Checkbox label="Autorizo compartilhamento voluntario com meu parceiro" {...consentsForm.register("partnerSharing")} />
        <Button disabled={consentsForm.formState.isSubmitting} type="submit">
          <Save className="size-4" />
          Salvar consentimentos
        </Button>
      </form>
    </div>
  );
}
