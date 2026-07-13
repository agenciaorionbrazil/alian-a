"use client";

import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";

const fieldClass =
  "min-h-11 w-full rounded-lg border border-divider bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-brand-secondary focus:shadow-focus";

type FieldShellProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

function FieldShell({ label, error, children }: FieldShellProps) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-text-primary">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}

export function Input({ label, error, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <FieldShell label={label} error={error}>
      <input className={cn(fieldClass, className)} {...props} />
    </FieldShell>
  );
}

export function PasswordInput({ label, error, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <FieldShell label={label} error={error}>
      <span className="relative block">
        <input className={cn(fieldClass, "pr-12", className)} type={visible ? "text" : "password"} {...props} />
        <IconButton
          className="absolute right-0 top-0"
          label={visible ? "Ocultar senha" : "Mostrar senha"}
          type="button"
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </IconButton>
      </span>
    </FieldShell>
  );
}

export function Textarea({ label, error, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return (
    <FieldShell label={label} error={error}>
      <textarea className={cn(fieldClass, "min-h-28 resize-y", className)} {...props} />
    </FieldShell>
  );
}

export function Select({ label, error, className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  return (
    <FieldShell label={label} error={error}>
      <select className={cn(fieldClass, className)} {...props}>
        {children}
      </select>
    </FieldShell>
  );
}
