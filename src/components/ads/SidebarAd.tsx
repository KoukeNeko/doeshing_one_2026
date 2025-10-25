'use client'

import { AdSense } from './AdSense'

interface SidebarAdProps {
  adSlot: string
}

export function SidebarAd({ adSlot }: SidebarAdProps) {
  return (
    <div className="sticky top-32 border border-black/10 bg-white px-6 py-6 dark:border-white/10 dark:bg-zinc-900">
      <p className="mb-4 text-xs uppercase tracking-wider text-black/60 dark:text-white/60">
        廣告
      </p>
      <AdSense
        adSlot={adSlot}
        adFormat="auto"
        fullWidthResponsive={true}
        className="min-h-[250px]"
      />
    </div>
  )
}
