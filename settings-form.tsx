import type { LucideIcon } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/ui";

export function EmptyModule({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <>
      <PageHeader description={description} title={title} />
      <div className="rounded-2xl bg-background-soft p-4 sm:p-8">
        <div className="mb-5 inline-grid size-11 place-items-center rounded-lg bg-surface text-brand-primary shadow-soft">
          <Icon className="size-5" />
        </div>
        <EmptyState
          description="Este modulo esta estruturado para receber dados reais e regras de privacidade nas proximas etapas. Nenhum dado simulado foi apresentado como funcional."
          title="Pronto para a proxima etapa"
        />
      </div>
    </>
  );
}
