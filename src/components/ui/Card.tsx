import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col border border-black/10 bg-white shadow-sm shadow-black/5 transition hover:-translate-y-1 hover:shadow-editorial",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 px-6 py-5 sm:px-8 sm:py-6", className)}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-6 py-4 sm:px-8 sm:py-5 border-b border-black/5",
        className,
      )}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-t border-black/5 px-6 py-4 sm:px-8 sm:py-5",
        className,
      )}
      {...props}
    />
  );
}
