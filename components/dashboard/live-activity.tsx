"use client"

import {
  ChatCircleDots,
  ThumbsUp,
  Warning,
  Coins,
  UserPlus,
} from "@phosphor-icons/react/dist/ssr"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

type EventKind = "chat" | "rating" | "alert" | "tokens" | "client"

const fallbackEvents: Array<{
  id: string
  kind: EventKind
  title: string
  meta: string
  time: string
}> = []

const kindConfig: Record<
  EventKind,
  { icon: typeof ChatCircleDots; tone: string; ring: string }
> = {
  chat: {
    icon: ChatCircleDots,
    tone: "text-primary",
    ring: "bg-primary/10 ring-primary/20",
  },
  rating: {
    icon: ThumbsUp,
    tone: "text-success",
    ring: "bg-success/10 ring-success/20",
  },
  alert: {
    icon: Warning,
    tone: "text-warning-foreground",
    ring: "bg-warning/15 ring-warning/25",
  },
  tokens: {
    icon: Coins,
    tone: "text-primary",
    ring: "bg-primary/10 ring-primary/20",
  },
  client: {
    icon: UserPlus,
    tone: "text-accent",
    ring: "bg-accent/10 ring-accent/20",
  },
}

export function LiveActivity() {
  const { data } = useDashboardStats()
  const events =
    data?.liveActivity && data.liveActivity.length > 0
      ? data.liveActivity
      : fallbackEvents

  return (
    <div className="glass glass-highlight-top relative flex h-full flex-col overflow-hidden rounded-3xl p-6 md:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Live Activity
          </p>
          <h3 className="mt-1 text-base font-bold tracking-tight text-foreground">
            البث المباشر
          </h3>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-foreground">
          <span className="pulse-dot" />
          مباشر
        </span>
      </div>

      {/* Stream */}
      <div className="relative mt-5 flex-1">
        {/* Vertical timeline rail */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-2 top-2 w-px bg-gradient-to-b from-primary/50 via-border/50 to-transparent"
          style={{ insetInlineStart: "15px" }}
        />
        <ul className="space-y-4">
          {events.length === 0 ? (
            <li className="text-sm text-muted-foreground">لا توجد نشاطات حديثة.</li>
          ) : (
            events.map((e) => {
              const cfg = kindConfig[e.kind]
              const Icon = cfg.icon
              return (
                <li key={e.id} className="relative flex items-start gap-3 ps-10">
                  {/* Icon circle */}
                  <span
                    className={`absolute top-0.5 flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-inset ${cfg.ring}`}
                    style={{ insetInlineStart: "-1px" }}
                  >
                    <Icon className={`h-3.5 w-3.5 ${cfg.tone}`} weight="fill" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-snug text-foreground">
                      {e.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="font-mono opacity-80">{e.meta}</span>
                      <span aria-hidden className="text-border">·</span>
                      <span className="tabular-nums">{e.time}</span>
                    </p>
                  </div>
                </li>
              )
            })
          )}
        </ul>
      </div>

      <div className="mt-5 border-t border-border/40 pt-3 text-center text-[11px] text-muted-foreground">
        يتم التحديث تلقائيًا كل ٥ ثوانٍ
      </div>
    </div>
  )
}
