import { HandHeart } from "lucide-react";
import { EmptyModule } from "@/features/platform/empty-module";

export const metadata = { title: "Oracoes" };

export default function PrayersPage() {
  return <EmptyModule description="Pedidos de oracao privados, compartilhados voluntariamente ou conjuntos." icon={HandHeart} title="Oracoes" />;
}
