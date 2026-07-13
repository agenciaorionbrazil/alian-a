import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function SOSFloatingButton() {
  return (
    <Link
      aria-label="Abrir area SOS"
      className="fixed bottom-24 right-4 z-20 inline-flex size-12 items-center justify-center rounded-full bg-danger text-white shadow-soft transition hover:bg-danger/90 lg:bottom-6"
      href="/sos"
    >
      <ShieldAlert className="size-5" />
    </Link>
  );
}
