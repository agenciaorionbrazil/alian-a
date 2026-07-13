import Link from "next/link";
import { platformNavigation } from "@/components/layout/navigation";
import { BrandLogo } from "@/components/brand";
import { cn } from "@/lib/utils";

export function DesktopSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-divider bg-surface px-4 py-5 lg:block">
      <BrandLogo className="w-40" />
      <nav className="mt-8 grid gap-1">
        {platformNavigation.map((item) => (
          <Link
            className={cn(
              "flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-secondary transition hover:bg-background-soft hover:text-brand-primary"
            )}
            href={item.href}
            key={item.href}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
