import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markOnly?: boolean;
  href?: string;
};

export function BrandLogo({ className, markOnly = false, href = "/" }: BrandLogoProps) {
  const content = markOnly ? (
    <span className={cn("inline-grid size-10 place-items-center overflow-hidden rounded-lg bg-surface", className)}>
      <Image
        alt="ALIANCA"
        className="h-full w-full object-contain"
        height={120}
        priority
        src="/brand/alianca-logo.png"
        width={120}
      />
    </span>
  ) : (
    <Image
      alt="ALIANCA - Fortaleca sua fe. Proteja seu relacionamento."
      className={cn("h-auto w-44 object-contain", className)}
      height={320}
      priority
      src="/brand/alianca-logo.png"
      width={900}
    />
  );

  return (
    <Link aria-label="Ir para o inicio" className="inline-flex items-center" href={href}>
      {content}
    </Link>
  );
}
