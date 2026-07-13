import { BookOpen } from "lucide-react";
import { EmptyModule } from "@/features/platform/empty-module";

export const metadata = { title: "Devocional" };

export default function DevotionalPage() {
  return <EmptyModule description="Devocional diario, contexto biblico revisado, aplicacao pratica e oracao." icon={BookOpen} title="Devocional" />;
}
