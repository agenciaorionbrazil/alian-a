"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ProgressBar({ value }: { value: number }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={safeValue} className="h-2 rounded-full bg-background-soft" role="progressbar">
      <div className="h-full rounded-full bg-brand-primary transition-all" style={{ width: `${safeValue}%` }} />
    </div>
  );
}

export function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Etapa ${current} de ${total}`}>
      {Array.from({ length: total }, (_, index) => index + 1).map((step) => (
        <span
          className={cn("h-2 flex-1 rounded-full bg-background-soft", step <= current && "bg-brand-primary")}
          key={step}
        />
      ))}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "danger" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-background-soft text-text-secondary",
        tone === "success" && "bg-success/10 text-success",
        tone === "danger" && "bg-danger/10 text-danger"
      )}
    >
      {children}
    </span>
  );
}

export function LoadingState({ title = "Carregando" }: { title?: string }) {
  return (
    <div className="grid min-h-52 place-items-center text-center">
      <div>
        <Loader2 className="mx-auto size-6 animate-spin text-brand-primary" />
        <p className="mt-3 text-sm font-medium text-text-secondary">{title}</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, description, actionHref, actionLabel }: { title: string; description: string; actionHref?: string; actionLabel?: string }) {
  return (
    <div className="mx-auto grid max-w-xl place-items-center rounded-xl bg-surface px-6 py-12 text-center shadow-soft">
      <CheckCircle2 className="size-8 text-brand-primary" />
      <h2 className="mt-4 text-xl font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
      {actionHref && actionLabel ? (
        <Button className="mt-6" href={actionHref} variant="secondary">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function ErrorState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl bg-danger/5 p-5 text-danger">
      <AlertCircle className="size-5" />
      <h2 className="mt-3 text-base font-semibold">{title}</h2>
      <p className="mt-1 text-sm leading-6">{description}</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-background-soft", className)} />;
}
