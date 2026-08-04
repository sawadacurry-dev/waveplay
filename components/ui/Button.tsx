import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-sky-500 text-slate-950 hover:bg-sky-400",
  secondary:
    "bg-white/5 text-slate-100 ring-1 ring-inset ring-white/10 hover:bg-white/10",
  ghost: "text-slate-300 hover:bg-white/5",
};

export function Button({
  variant = "primary",
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400",
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
