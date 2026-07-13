import { HeartHandshake } from "lucide-react";
import { EmptyModule } from "@/features/platform/empty-module";

export const metadata = { title: "Conexao" };

export default function ConnectionPage() {
  return <EmptyModule description="Atividades e compromissos do casal com visibilidade compartilhada autorizada." icon={HeartHandshake} title="Conexao" />;
}
