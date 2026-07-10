"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Key } from "@phosphor-icons/react/dist/ssr"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"

/**
 * Slim inline bar showing the client's API key with copy button.
 * Only renders when role === "client".
 */
export function ClientApiKeyBar() {
  const { data } = useDashboardStats()
  const [copied, setCopied] = useState(false)

  if (data?.role !== "client") return null

  const apiKey = data.topClients?.[0]?.apiKey ?? ""
  if (!apiKey) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass glass-highlight-top relative flex w-fit items-center gap-3 overflow-hidden rounded-full py-1.5 pl-1.5 pr-4">
      <div className="flex items-center gap-2">
        <Key className="h-4 w-4 text-primary" weight="duotone" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          License Key
        </span>
      </div>
      <div className="h-3 w-px bg-border/60" />
      <code className="font-mono text-sm font-semibold text-foreground">
        {apiKey}
      </code>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="ml-1 h-7 rounded-full bg-white/40 px-3 text-[11px] font-semibold hover:bg-white/60"
      >
        {copied ? (
          <>
            <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" weight="bold" />
            منسوخ
          </>
        ) : (
          <>
            <Copy className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" weight="bold" />
            نسخ
          </>
        )}
      </Button>
    </div>
  )
}
