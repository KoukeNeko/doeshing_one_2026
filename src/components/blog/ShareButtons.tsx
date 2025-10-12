import { Facebook, Linkedin, Share2, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="border border-black/10 bg-white px-6 py-5">
      <div className="flex items-center gap-3">
        <Share2 size={18} strokeWidth={1.5} className="text-newspaper-gray" />
        <span className="text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray">
          Share this article
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {[
          {
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            label: "Twitter/X",
            icon: <Twitter size={16} strokeWidth={1.5} />,
          },
          {
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            label: "Facebook",
            icon: <Facebook size={16} strokeWidth={1.5} />,
          },
          {
            href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
            label: "LinkedIn",
            icon: <Linkedin size={16} strokeWidth={1.5} />,
          },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 border border-newspaper-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-ink transition hover:bg-newspaper-ink hover:text-newspaper-paper",
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
