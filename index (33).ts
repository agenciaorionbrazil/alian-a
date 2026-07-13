import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-white shadow-[0_10px_22px_rgba(122,35,72,0.18)] hover:-translate-y-0.5 hover:bg-brand-primary-hover hover:shadow-[0_16px_30px_rgba(122,35,72,0.24)] active:translate-y-0 focus-visible:shadow-focus",
  secondary:
    "bg-background-soft text-brand-primary hover:-translate-y-0.5 hover:bg-brand-soft/70 hover:shadow-soft active:translate-y-0 focus-visible:shadow-focus",
  ghost:
    "bg-transparent text-text-primary hover:bg-background-soft focus-visible:shadow-focus",
  danger:
    "bg-danger text-white shadow-[0_10px_22px_rgba(165,63,76,0.16)] hover:-translate-y-0.5 hover:bg-danger/90 hover:shadow-[0_16px_30px_rgba(165,63,76,0.22)] active:translate-y-0 focus-visible:shadow-focus"
};

type CommonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkButtonProps = CommonProps & {
  href: string;
};

const baseClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none";

export function Button(props: ButtonProps | LinkButtonProps) {
  const variant = props.variant ?? "primary";
  const className = cn(baseClass, variants[variant], props.className);

  if ("href" in props && props.href) {
    return (
      <Link className={className} href={props.href}>
        {props.children}
      </Link>
    );
  }

  const { children, className: _className, variant: _variant, ...buttonProps } = props;
  return (
    <button className={className} {...buttonProps}>
      {children}
    </button>
  );
}
