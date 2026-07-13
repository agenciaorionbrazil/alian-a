import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export function Avatar({ name, className }: { name?: string | null; className?: string }) {
  const initials = name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <span className={cn("inline-grid size-10 place-items-center rounded-full bg-background-soft text-sm font-semibold text-brand-primary", className)}>
      {initials || <UserRound className="size-4" />}
    </span>
  );
}
