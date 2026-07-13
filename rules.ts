"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("flex items-start gap-3 text-sm text-text-primary", className)}>
      <input className="mt-1 size-4 accent-brand-primary" type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}

export function RadioCard({
  checked,
  title,
  description,
  children
}: {
  checked?: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface p-4 shadow-soft ring-1 ring-divider transition",
        checked && "ring-2 ring-brand-primary"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">{title}</p>
          {description ? <p className="mt-1 text-sm text-text-secondary">{description}</p> : null}
        </div>
        {checked ? <Check className="size-5 text-brand-primary" /> : null}
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

export function ScaleSelector({
  value,
  onChange,
  min = 1,
  max = 5
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: max - min + 1 }, (_, index) => min + index).map((item) => (
        <button
          className={cn(
            "aspect-square rounded-lg bg-background-soft text-sm font-semibold text-text-secondary transition hover:bg-brand-soft",
            item === value && "bg-brand-primary text-white"
          )}
          key={item}
          type="button"
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
