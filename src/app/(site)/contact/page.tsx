"use client";

import { Github, Linkedin, Mail, PenLine, Twitter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SOCIAL_LINKS } from "@/lib/constants";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  pen: PenLine,
};

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const email = "hello@doeshing.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy email", error);
    }
  };

  return (
    <div className="space-y-10">
      <SectionHeading
        kicker="Contact"
        title="Let’s craft the next edition together"
        description="Whether you need a design engineer for your next editorial build, or want to collaborate on a narrative experiment, drop a note."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6 border border-black/10 bg-white px-6 py-8 shadow-editorial dark:border-white/10 dark:bg-zinc-900">
          <h2 className="flex items-center gap-3 font-serif text-3xl text-newspaper-ink dark:text-zinc-50">
            <Mail size={24} strokeWidth={1.5} />
            Get in touch
          </h2>
          <p className="text-sm text-newspaper-gray dark:text-zinc-400">
            Send project briefs, collaboration ideas, or speaking invitations. I
            typically reply within two business days.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-lg font-semibold tracking-[0.18em] text-newspaper-ink dark:text-zinc-100">
            <Link href={`mailto:${email}`}>{email}</Link>
            <Button type="button" variant="secondary" onClick={handleCopy}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="space-y-6 border border-black/10 bg-white px-6 py-8 dark:border-white/10 dark:bg-zinc-900">
          <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
            Social channels
          </h3>
          <ul className="space-y-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = iconMap[social.icon] ?? PenLine;
              return (
                <li key={social.platform}>
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border border-black/10 px-4 py-3 text-sm text-newspaper-ink transition hover:border-newspaper-ink hover:text-newspaper-accent dark:border-white/10 dark:text-zinc-100 dark:hover:border-zinc-400 dark:hover:text-red-400"
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} strokeWidth={1.5} />
                      {social.platform}
                    </span>
                    <span className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                      Visit
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
