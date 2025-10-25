"use client";

import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-newspaper-ink text-newspaper-paper hover:bg-newspaper-accent hover:text-newspaper-paper dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-red-400 dark:hover:text-zinc-900",
  secondary:
    "border border-newspaper-ink text-newspaper-ink hover:bg-newspaper-ink hover:text-newspaper-paper dark:border-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900",
  ghost:
    "text-newspaper-ink hover:text-newspaper-accent hover:bg-newspaper-ink/5 dark:text-zinc-100 dark:hover:text-red-400 dark:hover:bg-white/5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", fullWidth, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] transition",
          variantClasses[variant],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
