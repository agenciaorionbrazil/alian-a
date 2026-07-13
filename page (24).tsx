import { ShieldCheck } from "lucide-react";
import { EmptyModule } from "@/features/platform/empty-module";

export const metadata = { title: "Admin" };

export default function AdminPage() {
  return <EmptyModule description="Area administrativa protegida por perfil admin e politicas no banco." icon={ShieldCheck} title="Admin" />;
}
