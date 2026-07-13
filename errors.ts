import { AuthShell } from "@/components/layout";
import { UpdatePasswordForm } from "@/features/auth/update-password-form";

export const metadata = { title: "Atualizar senha" };

export default function UpdatePasswordPage() {
  return (
    <AuthShell description="Escolha uma nova senha para continuar sua jornada." title="Atualizar senha">
      <UpdatePasswordForm />
    </AuthShell>
  );
}
