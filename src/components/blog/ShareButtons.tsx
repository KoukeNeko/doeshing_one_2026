import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
}

// Simple SVG icons to replace deprecated lucide-react brand icons
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="8" y1="11" x2="8" y2="16" />
    <line x1="8" y1="8" x2="8" y2="8.01" />
    <line x1="12" y1="16" x2="12" y2="11" />
    <path d="M16 16v-3a2 2 0 0 0 -4 0" />
  </svg>
);

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      label: "Twitter/X",
      icon: <XIcon />,
    },
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: "Facebook",
      icon: <FacebookIcon />,
    },
    {
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      label: "LinkedIn",
      icon: <LinkedInIcon />,
    },
  ];

  return (
    <div className="border border-black/10 bg-white px-6 py-5 dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <Share2 size={18} strokeWidth={1.5} className="text-newspaper-gray dark:text-zinc-400" />
        <span className="text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
          Share this article
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {shareLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 border border-newspaper-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-ink transition hover:bg-newspaper-ink hover:text-newspaper-paper dark:border-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900",
            )}
          >
            {item.icon}
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
