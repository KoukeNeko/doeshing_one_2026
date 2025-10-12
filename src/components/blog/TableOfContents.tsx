interface TocItem {
  id: string;
  text: string;
  depth: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (!items.length) return null;

  return (
    <aside className="sticky top-32 hidden h-fit min-w-[220px] border border-black/10 bg-white px-6 py-6 lg:block">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray">
        Contents
      </p>
      <nav className="mt-4 space-y-2 text-sm">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="block text-newspaper-gray transition hover:text-newspaper-ink"
            style={{
              marginLeft: `${(item.depth - 2) * 12}px`,
            }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
