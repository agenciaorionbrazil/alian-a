import { CalendarHeart } from "lucide-react";
import { EmptyModule } from "@/features/platform/empty-module";

export const metadata = { title: "Jornada" };

export default function JourneyPage() {
  return <EmptyModule description="Jornadas tematicas para crescimento espiritual, emocional e relacional." icon={CalendarHeart} title="Jornada" />;
}
