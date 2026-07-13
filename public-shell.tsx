import { Library } from "lucide-react";
import { EmptyModule } from "@/features/platform/empty-module";

export const metadata = { title: "Biblioteca" };

export default function LibraryPage() {
  return <EmptyModule description="Base revisada para versiculos, contextos biblicos e fundamentos centrais." icon={Library} title="Biblioteca" />;
}
