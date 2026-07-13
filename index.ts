import { ShieldAlert } from "lucide-react";
import { EmptyModule } from "@/features/platform/empty-module";

export const metadata = { title: "SOS" };

export default function SOSPage() {
  return <EmptyModule description="Espaco protegido para momentos emocionais e conflitos, sem diagnosticos nem pressao por reconciliacao." icon={ShieldAlert} title="SOS" />;
}
