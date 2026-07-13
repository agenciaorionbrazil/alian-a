import { ListChecks } from "lucide-react";
import { EmptyModule } from "@/features/platform/empty-module";

export const metadata = { title: "Quiz" };

export default function QuizPage() {
  return <EmptyModule description="Diagnostico inicial com respostas individuais protegidas por RLS." icon={ListChecks} title="Quiz" />;
}
