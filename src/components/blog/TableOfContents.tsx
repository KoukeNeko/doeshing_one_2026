"use client";

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (!items || items.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    // 獲取 Navigation 的高度
    const nav = document.querySelector('nav[aria-label="Primary Navigation"]');
    const navHeight = nav ? nav.getBoundingClientRect().height : 0;

    // 額外的容器邊界 padding (可以根據需求調整)
    const containerPadding = 24; // 1.5rem = 24px

    // 計算目標位置：元素位置 - 導航欄高度 - 容器邊界
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - navHeight - containerPadding;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });

    // 更新 URL hash
    window.history.pushState(null, "", `#${id}`);
  };

  return (
    <div
      className="min-w-[220px] border border-black/10 bg-white px-6 py-6 dark:border-white/10 dark:bg-zinc-900"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
        Contents
      </p>
      <nav className="mt-4 space-y-2 text-sm">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className="block text-newspaper-gray transition hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-100"
            style={{
              marginLeft: `${(item.depth - 2) * 12}px`,
            }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
