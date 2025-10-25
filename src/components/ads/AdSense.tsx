'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  adSlot: string
  adLayout?: 'in-article' | 'display'
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  style?: React.CSSProperties
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export function AdSense({
  adSlot,
  adLayout = 'in-article',
  adFormat = 'fluid',
  style = { display: 'block', textAlign: 'center' },
  className = '',
}: AdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client="ca-pub-3252699819735273"
      data-ad-slot={adSlot}
      data-ad-layout={adLayout}
      data-ad-format={adFormat}
    />
  )
}
