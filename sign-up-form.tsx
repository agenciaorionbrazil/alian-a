import { AuthShell } from "@/components/layout";
import { SignUpForm } from "@/features/auth/sign-up-form";

export const metadata = { title: "Cadastro" };

export default function SignUpPage() {
  return (
    <AuthShell description="Crie seu perfil individual. O papel de administrador nunca e selecionado no cadastro publico." title="Criar conta">
      <SignUpForm />
    </AuthShell>
  );
}
