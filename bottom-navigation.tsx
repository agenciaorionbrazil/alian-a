import { PageHeader } from "@/components/ui";
import { ProfileForm } from "@/features/platform/profile-form";
import { SignOutButton } from "@/features/auth/sign-out-button";

export const metadata = { title: "Perfil" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader description="Gerencie seus dados individuais. O papel administrativo nao pode ser alterado aqui." title="Perfil" />
      <div className="grid gap-6">
        <ProfileForm />
        <SignOutButton />
      </div>
    </>
  );
}
