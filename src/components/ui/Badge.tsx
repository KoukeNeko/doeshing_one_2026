import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "outline" | "accent";

const badgeClasses: Record<BadgeVariant, string> = {
  default: "bg-newspaper-ink text-newspaper-paper border border-newspaper-ink dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100",
  outline:
    "border border-newspaper-ink/30 text-newspaper-gray hover:border-newspaper-ink hover:text-newspaper-ink dark:border-white/30 dark:text-zinc-400 dark:hover:border-white dark:hover:text-zinc-100",
  accent:
    "border border-newspaper-accent text-newspaper-accent hover:bg-newspaper-accent hover:text-newspaper-paper dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-zinc-900",
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
