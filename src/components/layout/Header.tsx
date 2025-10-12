import Image from "next/image";
import Link from "next/link";
import { SearchButton } from "@/components/ui/Search";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getNewspaperDateline } from "@/lib/utils";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <>
      <header className="border-b border-black/10 bg-newspaper-paper dark:border-white/10 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:px-6 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
                {getNewspaperDateline()}
              </p>
              <Link href="/" className="group inline-flex items-baseline gap-3">
                <span className="text-3xl font-serif uppercase tracking-tight text-newspaper-ink dark:text-zinc-50 md:text-5xl">
                  Doeshing Gazette
                </span>
                <span className="hidden text-xs font-semibold uppercase tracking-[0.45em] text-newspaper-accent dark:text-red-400 md:inline">
                  Since 2020
                </span>
              </Link>
              <p className="max-w-2xl text-base text-newspaper-gray dark:text-zinc-400">
                Editorial experiments in code, product design, and storytelling. A
                living archive of work-in-progress ideas, published projects, and
                musings from the studio.
              </p>
            </div>
            <div className="flex items-end gap-6">
              <div className="hidden flex-col items-end gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400 md:flex">
                <span>Latest Issue</span>
                <span className="inline-flex items-center gap-2 text-newspaper-ink dark:text-zinc-50">
                  <Image
                    src="/images/stamp.svg"
                    alt=""
                    width={48}
                    height={48}
                    className="opacity-75 dark:invert"
                  />
                  Vol. 26
                </span>
              </div>
              <div className="hidden h-12 w-px bg-black/10 dark:bg-white/10 md:block" />
              <div className="flex flex-col gap-2 text-right text-xs uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
                <span>台北・遠端</span>
                <span>EST. 2016</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden md:block">
                  <SearchButton />
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>
      <Navigation />
    </>
  );
}
