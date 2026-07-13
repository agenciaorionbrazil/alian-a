import { AuthShell } from "@/components/layout";
import { SignInForm } from "@/features/auth/sign-in-form";

export const metadata = { title: "Entrar" };

export default function SignInPage() {
  return (
    <AuthShell description="Acesse sua jornada diaria com seguranca." title="Entrar">
      <SignInForm />
    </AuthShell>
  );
}
