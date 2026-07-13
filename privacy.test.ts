import Link from "next/link";
import { mainMobileNavigation } from "@/components/layout/navigation";

export function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-divider bg-surface/95 px-2 py-2 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {mainMobileNavigation.map((item) => (
          <Link
            className="tap-highlight flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[0.7rem] font-semibold text-text-secondary hover:bg-background-soft hover:text-brand-primary"
            href={item.href}
            key={item.href}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
