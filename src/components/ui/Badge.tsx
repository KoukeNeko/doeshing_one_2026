import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "outline" | "accent";

const badgeClasses: Record<BadgeVariant, string> = {
  default: "bg-newspaper-ink text-newspaper-paper border border-newspaper-ink",
  outline:
    "border border-newspaper-ink/30 text-newspaper-gray hover:border-newspaper-ink hover:text-newspaper-ink",
  accent:
    "border border-newspaper-accent text-newspaper-accent hover:bg-newspaper-accent hover:text-newspaper-paper",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  children,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] transition",
        badgeClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
