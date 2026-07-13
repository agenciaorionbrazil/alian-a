import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/features/platform/settings-form";

export const metadata = { title: "Configuracoes" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        description="Preferencias e consentimentos ficam persistidos individualmente. Consentimentos opcionais nunca sao pre-marcados."
        title="Configuracoes"
      />
      <SettingsForm />
    </>
  );
}
