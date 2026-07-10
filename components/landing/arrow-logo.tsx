'use client'

import { ArrowUpRight } from '@phosphor-icons/react'

export function ArrowLogo({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber to-amber-soft shadow-[0_0_20px_oklch(0.72_0.16_62/45%)] ${className ?? ''}`}
    >
      <ArrowUpRight className="h-5 w-5 text-primary-foreground" strokeWidth={2.6} />
    </span>
  )
}
