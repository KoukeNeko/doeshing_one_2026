import { Github, Linkedin, PenLine, Twitter } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { NAV_LINKS, SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";

const iconMap: Record<string, ReactNode> = {
  github: <Github size={18} strokeWidth={1.5} />,
  linkedin: <Linkedin size={18} strokeWidth={1.5} />,
  twitter: <Twitter size={18} strokeWidth={1.5} />,
  pen: <PenLine size={18} strokeWidth={1.5} />,
};

export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-newspaper-gray">
            {SITE_NAME}
          </p>
          <p className="mt-4 max-w-xl text-sm text-newspaper-gray">
            Crafted with Next.js, Tailwind, Prisma, and a lifelong obsession
            with editorial design. Each dispatch aims to mix thoughtful words,
            visuals, and code into a cohesive story.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray">
            Sitemap
          </p>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm uppercase tracking-[0.25em] text-newspaper-gray transition hover:text-newspaper-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray">
            Follow
          </p>
          <ul className="mt-4 space-y-3">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.platform}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-newspaper-gray transition hover:text-newspaper-accent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-newspaper-paper">
                    {iconMap[link.icon]}
                  </span>
                  {link.platform}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-black/10 bg-newspaper-paper py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-newspaper-gray md:flex-row md:px-6">
          <span>
            &copy; {new Date().getFullYear()} Doeshing. All rights reserved.
          </span>
          <span className="uppercase tracking-[0.35em]">
            Built with Next.js + Vercel
          </span>
        </div>
      </div>
    </footer>
  );
}
