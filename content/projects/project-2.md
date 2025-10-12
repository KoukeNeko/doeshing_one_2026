---
title: "Field Notes: Immersive Annual Report"
description: "A narrative microsite blending data journalism, motion, and accessibility-first storytelling."
tags: ["React", "Data Viz", "Storytelling"]
image: "/images/projects/field-notes.svg"
github: "https://github.com/doeshing/field-notes"
demo: "https://field-notes.vercel.app"
date: "2024-08"
featured: false
status: "completed"
---

## Project Story

The client needed more than a PDF. Field Notes transformed their annual report into an exploratory journey, featuring scrollytelling sections, annotated charts, and embedded audio commentary from the research team.

### Editorial Structure

1. **Front Page:** Introduces the year's theme with a cinematic hero and quick metrics ribbon.
2. **Chapters:** Each chapter pairs long-form narrative with interactive data visualizations built on D3 and Canvas.
3. **Appendix:** Provides raw datasets, methodology notes, and downloadable resources.

### Accessibility

- Motion reduced for vestibular-sensitive readers via CSS media queries.
- All charts include long-form descriptions and alt text.
- Keyboard navigation mirrors print pagination.

### Technical Notes

```tsx
export function MetricTicker({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-[0.28em] text-newspaper-gray">{label}</span>
      <span className="text-3xl font-serif tracking-tight text-newspaper-ink">{value}</span>
    </div>
  );
}
```

### Impact

- 3.2× increase in average time on page.
- 18% conversion lift on lead magnet downloads.
- Stakeholder satisfaction score rose to 4.7/5.

## Learnings

Building a data-heavy editorial experience reinforced the importance of layering animations, providing fallbacks, and pairing every visual with well-considered copy.
