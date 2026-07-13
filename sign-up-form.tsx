import { AuthShell } from "@/components/layout";
import { RecoverPasswordForm } from "@/features/auth/recover-password-form";

export const metadata = { title: "Recuperar senha" };

export default function RecoverPasswordPage() {
  return (
    <AuthShell description="Receba um link seguro para definir uma nova senha." title="Recuperar senha">
      <RecoverPasswordForm />
    </AuthShell>
  );
}
