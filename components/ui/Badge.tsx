import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        className
      )}
    >
      {children}
    </span>
  );
}

export function LiveBadge({ label = "LIVE" }: { label?: string }) {
  return (
    <Badge className="bg-red-500/15 text-red-400 ring-red-500/40">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
      {label}
    </Badge>
  );
}

export function SportBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return <Badge className={className}>{label}</Badge>;
}
