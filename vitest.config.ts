"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, LinkIcon, MailPlus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, ErrorState, Input, Select } from "@/components/ui";
import {
  acceptInviteSchema,
  createCoupleSchema,
  createInviteSchema,
  type AcceptInviteInput,
  type CreateCoupleInput,
  type CreateInviteInput
} from "@/lib/validation/couple";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Nao foi possivel concluir a acao.");
  }

  return data;
}

export function InviteFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [coupleId, setCoupleId] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createCoupleForm = useForm<CreateCoupleInput>({
    resolver: zodResolver(createCoupleSchema),
    defaultValues: { relationshipType: "dating", startedOn: "", journeyName: "" }
  });
  const inviteForm = useForm<CreateInviteInput>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: { coupleId: "", invitedEmail: "", invitedPhone: "" }
  });
  const acceptForm = useForm<AcceptInviteInput>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      code: searchParams.get("code") ?? "",
      token: searchParams.get("token") ?? ""
    }
  });

  async function createCouple(values: CreateCoupleInput) {
    setError(null);
    try {
      const data = await postJson<{ coupleId: string }>("/api/couples", values);
      setCoupleId(data.coupleId);
      inviteForm.setValue("coupleId", data.coupleId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel criar a relacao.");
    }
  }

  async function createInvite(values: CreateInviteInput) {
    setError(null);
    try {
      const data = await postJson<{ inviteUrl: string }>("/api/invites", values);
      setInviteUrl(data.inviteUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel criar o convite.");
    }
  }

  async function acceptInvite(values: AcceptInviteInput) {
    setError(null);
    try {
      await postJson<{ coupleId: string }>("/api/invites/accept", values);
      router.replace("/hoje");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel aceitar o convite.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {error ? <ErrorState description={error} title="Fluxo nao concluido" /> : null}

      <section className="rounded-2xl bg-surface p-6 shadow-soft">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-background-soft text-brand-primary">
            <MailPlus className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold text-text-primary">Criar relacao e convite</h2>
            <p className="text-sm text-text-secondary">Gere uma relacao e envie um link seguro ao parceiro.</p>
          </div>
        </div>
        <form className="grid gap-4" onSubmit={createCoupleForm.handleSubmit(createCouple)}>
          <Select label="Tipo de relacionamento" {...createCoupleForm.register("relationshipType")}>
            <option value="dating">Namoro</option>
            <option value="engaged">Noivado</option>
            <option value="married">Casamento</option>
            <option value="other">Outro</option>
          </Select>
          <Input label="Inicio aproximado" type="date" {...createCoupleForm.register("startedOn")} />
          <Input label="Nome da jornada" placeholder="Ex.: Nossa caminhada" {...createCoupleForm.register("journeyName")} />
          <Button disabled={createCoupleForm.formState.isSubmitting} type="submit">
            Criar relacao
          </Button>
        </form>

        <form className="mt-6 grid gap-4" onSubmit={inviteForm.handleSubmit(createInvite)}>
          <Input label="ID da relacao" readOnly {...inviteForm.register("coupleId")} value={coupleId || inviteForm.watch("coupleId")} />
          <Input error={inviteForm.formState.errors.invitedEmail?.message} label="E-mail do parceiro" type="email" {...inviteForm.register("invitedEmail")} />
          <Input label="Telefone do parceiro" {...inviteForm.register("invitedPhone")} />
          <Button disabled={!inviteForm.watch("coupleId") || inviteForm.formState.isSubmitting} type="submit" variant="secondary">
            Gerar convite seguro
          </Button>
        </form>

        {inviteUrl ? (
          <div className="mt-6 rounded-xl bg-background-soft p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <LinkIcon className="size-4 text-brand-primary" />
              Link do convite
            </p>
            <p className="mt-2 break-all text-sm text-text-secondary">{inviteUrl}</p>
            <Button className="mt-4" onClick={() => navigator.clipboard.writeText(inviteUrl)} type="button" variant="secondary">
              <Copy className="size-4" />
              Copiar link
            </Button>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl bg-surface p-6 shadow-soft">
        <h2 className="font-semibold text-text-primary">Aceitar convite</h2>
        <p className="mt-1 text-sm leading-6 text-text-secondary">
          O parceiro precisa estar autenticado. O codigo e o token sao validados por RPC no banco.
        </p>
        <form className="mt-5 grid gap-4" onSubmit={acceptForm.handleSubmit(acceptInvite)}>
          <Input error={acceptForm.formState.errors.code?.message} label="Codigo publico" {...acceptForm.register("code")} />
          <Input error={acceptForm.formState.errors.token?.message} label="Token seguro" {...acceptForm.register("token")} />
          <Button disabled={acceptForm.formState.isSubmitting} type="submit">
            Aceitar convite
          </Button>
        </form>
      </section>
    </div>
  );
}
