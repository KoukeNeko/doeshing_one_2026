import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
      )}
    >
      {kicker ? (
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-accent dark:text-red-400">
          {kicker}
        </span>
      ) : null}
      <h2 className="font-serif text-3xl tracking-tight text-newspaper-ink dark:text-zinc-50 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm text-newspaper-gray dark:text-zinc-400">{description}</p>
      ) : null}
      <div className="mt-4 h-px w-20 border-b border-newspaper-ink dark:border-zinc-100" />
    </div>
  );
}
