import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand";

export function AuthShell({ children, title, description }: { children: ReactNode; title: string; description: string }) {
  return (
    <main className="grid min-h-screen bg-background-main px-4 py-8 lg:grid-cols-[1fr_560px] lg:px-0 lg:py-0">
      <section className="hidden bg-background-soft px-12 py-10 lg:flex lg:flex-col lg:justify-between">
        <BrandLogo className="w-52" />
        <div className="max-w-lg">
          <p className="font-serif text-4xl leading-tight text-text-primary">
            Fortaleca sua fe. Proteja seu relacionamento.
          </p>
          <p className="mt-5 text-base leading-7 text-text-secondary">
            Uma base serena para transformar devocional, conversa e compromisso em uma jornada compartilhada.
          </p>
        </div>
      </section>
      <section className="mx-auto flex w-full max-w-md flex-col justify-center">
        <div className="mb-10 lg:hidden">
          <BrandLogo className="w-48" />
        </div>
        <h1 className="text-3xl font-semibold text-text-primary">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
