"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Buildings, Copy, Check } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

function formatNumber(n: number) {
  return n.toLocaleString("en-US")
}

/** Custom thin gradient progress bar */
function QuotaBar({ percent, danger }: { percent: number; danger: boolean }) {
  return (
    <div className="relative h-1 w-full overflow-hidden rounded-full bg-border/40">
      <div
        className="absolute inset-y-0 start-0 rounded-full"
        style={{
          width: `${percent}%`,
          background: danger
            ? "linear-gradient(90deg, oklch(0.65 0.19 30), oklch(0.58 0.21 25))"
            : "linear-gradient(270deg, #e69605, #db4a00)",
          boxShadow: danger
            ? "0 0 12px oklch(0.62 0.19 27 / 0.4)"
            : "0 0 12px rgba(230, 150, 5, 0.4)",
        }}
      />
    </div>
  )
}

export function TopClients() {
  const { data } = useDashboardStats()
  const clients = data?.topClients ?? []
  const isClientRole = data?.role === "client"
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isClientRole && clients.length > 0) {
    // Client view: API key is shown at top of page, no need for this card
    return null
  }

  return (
    <div className="glass glass-highlight-top relative h-full overflow-hidden rounded-3xl p-6 md:p-7">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Top Clients
          </p>
          <h3 className="mt-1 text-base font-bold tracking-tight text-foreground">
            أبرز العملاء · SaaS
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-1 rounded-full text-xs hover:bg-foreground/5"
        >
          <Link href="/clients">
            إدارة
            <ArrowLeft className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      <div className="hairline-orange mt-5" />

      <div className="mt-5 space-y-5">
        {clients.map((client) => {
          const percent = Math.round((client.used / client.total) * 100)
          const isNearLimit = percent >= 90
          return (
            <div key={client.apiKey} className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl silver-surface ring-1 ring-inset ring-white/60">
                    <Buildings className="h-4 w-4 text-primary" weight="duotone" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {client.name}
                    </p>
                    <p className="truncate font-mono text-[10px] text-muted-foreground">
                      {client.apiKey}
                    </p>
                  </div>
                </div>
                <div className="text-end">
                  <p className="font-mono text-base font-semibold text-foreground tabular-nums">
                    {percent}
                    <span className="text-[11px] text-muted-foreground">%</span>
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {formatNumber(client.used)}
                  </p>
                </div>
              </div>
              <QuotaBar percent={percent} danger={isNearLimit} />
            </div>
          )
        })}
        {clients.length === 0 && (
          <p className="text-sm text-muted-foreground">لا توجد بيانات عملاء حتى الآن.</p>
        )}
      </div>
    </div>
  )
}
