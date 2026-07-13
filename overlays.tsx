import { TrendingUp } from "lucide-react";
import { EmptyModule } from "@/features/platform/empty-module";

export const metadata = { title: "Relatorio" };

export default function ReportPage() {
  return <EmptyModule description="Relatorios positivos de evolucao sem expor respostas privadas do parceiro." icon={TrendingUp} title="Relatorio" />;
}
