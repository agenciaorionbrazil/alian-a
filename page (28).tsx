import { ArrowRight, BookOpen, HeartHandshake, ShieldAlert } from "lucide-react";
import { Button, SectionHeader } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative bg-[linear-gradient(180deg,#FFFDFC_0%,#FFFDFC_70%,#F9EEF2_100%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24 lg:pt-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-primary">ALIANCA</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-text-primary sm:text-5xl">
              Fortaleca sua fe. Proteja seu relacionamento.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary">
              Uma plataforma para casais transformarem Palavra, conversa e compromisso em presenca diaria, com privacidade desde a base.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="group px-5" href="/cadastro">
                Criar conta
                <ArrowRight className="size-4 transition duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Button href="/entrar" variant="secondary">
                Entrar
              </Button>
            </div>
          </div>
          <div className="rounded-2xl bg-surface/92 p-6 shadow-soft ring-1 ring-divider/80 backdrop-blur">
            <div className="grid gap-4">
              {[
                { icon: BookOpen, title: "Devocional diario", text: "Conteudo biblico revisado para conversa e atitude." },
                { icon: HeartHandshake, title: "Dois perfis, uma jornada", text: "Privacidade individual e momentos compartilhados." },
                { icon: ShieldAlert, title: "Area SOS", text: "Apoio responsavel para conflitos e momentos emocionais." }
              ].map((item, index) => (
                <div
                  className="flex gap-4 rounded-xl bg-background-main/90 p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-surface hover:shadow-soft"
                  key={item.title}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-background-soft text-brand-primary">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-secondary/70">0{index + 1}</p>
                    <h2 className="mt-1 font-semibold text-text-primary">{item.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-divider" />
      </section>

      <section className="relative bg-background-soft px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            description="A fundacao tecnica ja nasce preparada para separar dados privados, compartilhados e administrativos."
            eyebrow="Privacidade"
            title="Cuidado com o relacionamento sem expor o individuo."
          />
        </div>
      </section>
    </main>
  );
}
