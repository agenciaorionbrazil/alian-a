import type { ReactNode } from "react";

export function SectionHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-primary">{eyebrow}</p> : null}
        <h2 className="mt-2 text-2xl font-semibold text-text-primary">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-8 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-normal text-text-primary sm:text-4xl">{title}</h1>
      {description ? <p className="mt-3 text-base leading-7 text-text-secondary">{description}</p> : null}
    </header>
  );
}
