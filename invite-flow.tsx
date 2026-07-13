import { PageHeader } from "@/components/ui";
import { InviteFlow } from "@/features/platform/invite-flow";

export const metadata = { title: "Convite" };

export default function InvitePage() {
  return (
    <>
      <PageHeader
        description="Crie uma relacao, gere um convite seguro ou aceite um convite recebido."
        title="Convite"
      />
      <InviteFlow />
    </>
  );
}
