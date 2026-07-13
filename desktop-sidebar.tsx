import { BookOpen, HeartHandshake, ShieldAlert } from "lucide-react";
import { Badge, Button, PageHeader, SectionHeader, Skeleton } from "@/components/ui";

export const metadata = { title: "Hoje" };

export default function TodayPage() {
  return (
    <>
      <PageHeader
        description="Seu painel diario esta preparado para devocional, compromisso, conversa guiada e sinais de cuidado."
        title="Hoje"
      />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl bg-surface p-6 shadow-soft">
          <SectionHeader
            eyebrow="Devocional"
            title="Nenhum devocional liberado ainda"
            description="A biblioteca biblica revisada sera conectada antes de qualquer conteudo funcional aparecer aqui."
            action={<Badge>Sem dados simulados</Badge>}
          />
          <div className="mt-8 grid gap-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </section>
        <aside className="grid gap-4">
          {[
            { href: "/devocional", label: "Abrir devocional", icon: BookOpen },
            { href: "/conexao", label: "Conexao do casal", icon: HeartHandshake },
            { href: "/sos", label: "Area SOS", icon: ShieldAlert }
          ].map((item) => (
            <Button className="justify-start" href={item.href} key={item.href} variant={item.href === "/sos" ? "danger" : "secondary"}>
              <item.icon className="size-4" />
              {item.label}
            </Button>
          ))}
        </aside>
      </div>
    </>
  );
}
