"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";

export function Modal({ title, children, open, onClose }: { title: string; children: ReactNode; open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-text-primary/30 p-4">
      <section aria-modal="true" className="w-full max-w-lg rounded-xl bg-surface p-5 shadow-soft" role="dialog">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          <IconButton label="Fechar" onClick={onClose} type="button">
            <X className="size-4" />
          </IconButton>
        </div>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}

export function Drawer({ children, open }: { children: ReactNode; open: boolean }) {
  return (
    <aside className={cn("fixed inset-y-0 right-0 z-40 w-80 bg-surface p-5 shadow-soft transition-transform", open ? "translate-x-0" : "translate-x-full")}>
      {children}
    </aside>
  );
}

export function BottomSheet({ children, open }: { children: ReactNode; open: boolean }) {
  return (
    <div className={cn("fixed inset-x-0 bottom-0 z-40 rounded-t-2xl bg-surface p-5 shadow-soft transition-transform md:hidden", open ? "translate-y-0" : "translate-y-full")}>
      {children}
    </div>
  );
}

export function Toast({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-lg bg-text-primary px-4 py-3 text-sm text-white shadow-soft" role="status">
      <p className="font-semibold">{title}</p>
      {description ? <p className="mt-1 text-white/75">{description}</p> : null}
    </div>
  );
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-md bg-text-primary px-2 py-1 text-xs text-white group-hover:block">
        {label}
      </span>
    </span>
  );
}
