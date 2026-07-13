import { notFound } from "next/navigation";
import { Heart, Mail, ShieldAlert } from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  EmptyState,
  Input,
  PageHeader,
  PasswordInput,
  ProgressBar,
  RadioCard,
  ScaleSelector,
  SectionHeader,
  Select,
  StepIndicator,
  Textarea
} from "@/components/ui";

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl bg-background-main px-4 py-10">
      <PageHeader description="Pagina visivel apenas em desenvolvimento para validar os componentes reutilizaveis." title="Design System" />
      <div className="grid gap-8">
        <section className="grid gap-4 rounded-2xl bg-surface p-6 shadow-soft">
          <SectionHeader title="Acoes" description="Botoes, badges e indicadores." />
          <div className="flex flex-wrap gap-3">
            <Button>Primario</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="ghost">Fantasma</Button>
            <Button variant="danger">
              <ShieldAlert className="size-4" />
              SOS
            </Button>
            <Badge>Neutro</Badge>
            <Badge tone="success">Ativo</Badge>
            <Badge tone="danger">Atencao</Badge>
          </div>
          <ProgressBar value={42} />
          <StepIndicator current={2} total={5} />
        </section>
        <section className="grid gap-4 rounded-2xl bg-surface p-6 shadow-soft">
          <SectionHeader title="Formulario" description="Campos acessiveis e consistentes." />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Nome" placeholder="Seu nome" />
            <Input label="E-mail" placeholder="voce@email.com" type="email" />
            <PasswordInput label="Senha" />
            <Select label="Relacionamento">
              <option>Namoro</option>
              <option>Noivado</option>
              <option>Casamento</option>
            </Select>
            <Textarea className="md:col-span-2" label="Reflexao" placeholder="Escreva com calma..." />
          </div>
          <Checkbox label="Compartilhar voluntariamente com meu parceiro" />
          <ScaleSelector value={3} onChange={() => undefined} />
        </section>
        <section className="grid gap-4 rounded-2xl bg-surface p-6 shadow-soft">
          <SectionHeader title="Estados" description="Vazio, selecao e perfil." />
          <div className="grid gap-4 md:grid-cols-3">
            <RadioCard checked description="Privado por padrao." title="Reflexao individual" />
            <RadioCard description="Liberado apos consentimento." title="Compromisso compartilhado" />
            <div className="flex items-center gap-3 rounded-lg bg-background-soft p-4">
              <Avatar name="Alianca" />
              <div>
                <p className="font-semibold text-text-primary">ALIANCA</p>
                <p className="text-sm text-text-secondary">Perfil ativo</p>
              </div>
            </div>
          </div>
          <EmptyState description="Estado usado quando nao ha dados reais persistidos ainda." title="Nada por aqui" />
          <div className="flex gap-2 text-brand-primary">
            <Heart className="size-5" />
            <Mail className="size-5" />
          </div>
        </section>
      </div>
    </main>
  );
}
