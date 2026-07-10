"use client"

import Link from "next/link"
import { ArrowLeft, ChatCircle, ThumbsDown, ThumbsUp } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

const statusMap = {
  active: {
    label: "نشطة",
    className: "bg-success/10 text-success ring-success/25",
  },
  resolved: {
    label: "منتهية",
    className: "bg-muted/50 text-muted-foreground ring-border",
  },
  flagged: {
    label: "مراجعة",
    className: "bg-destructive/10 text-destructive ring-destructive/25",
  },
}

export function RecentConversations() {
  const { data } = useDashboardStats()
  const conversations =
    data?.recentConversations && data.recentConversations.length > 0
      ? data.recentConversations
      : []

  return (
    <div className="glass glass-highlight-top relative h-full overflow-hidden rounded-3xl">
      <div className="flex items-start justify-between gap-4 p-6 pb-4 md:p-7 md:pb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Recent Conversations
          </p>
          <h3 className="mt-1 text-base font-bold tracking-tight text-foreground">
            أحدث المحادثات
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-1 rounded-full text-xs hover:bg-foreground/5"
        >
          <Link href="/conversations">
            عرض الكل
            <ArrowLeft className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      <div className="hairline-orange mx-6 md:mx-7" />

      <ul className="px-2 py-2 md:px-3">
        {conversations.map((c) => {
          const status = statusMap[c.status]
          return (
            <li key={c.id}>
              <Link
                href="/conversations"
                className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-white/50 md:px-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                  <ChatCircle className="h-4 w-4" weight="fill" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {c.title}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-mono text-[10px] opacity-75">
                      {c.id}
                    </span>
                    <span aria-hidden className="text-border">·</span>
                    <span className="tabular-nums">{c.time}</span>
                    <span aria-hidden className="text-border">·</span>
                    <span className="tabular-nums">{c.messages} رسالة</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-success ring-1 ring-inset ring-success/20 tabular-nums">
                    <ThumbsUp className="h-3 w-3" weight="fill" />
                    {c.likes}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-destructive ring-1 ring-inset ring-destructive/20 tabular-nums">
                    <ThumbsDown className="h-3 w-3" weight="fill" />
                    {c.dislikes}
                  </span>
                </div>
              </Link>
            </li>
          )
        })}
        {conversations.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted-foreground">
            لا توجد محادثات حديثة بعد.
          </li>
        )}
      </ul>
    </div>
  )
}
