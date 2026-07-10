"use client"

import type { Icon } from "@phosphor-icons/react"
import {
  ArrowDownRight,
  ArrowUpRight,
  ChatCircleDots,
  ThumbsUp,
  UsersThree,
  Lightning,
} from "@phosphor-icons/react/dist/ssr"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

type Stat = {
  label: string
  value: string
  icon: Icon
  trend: { value: string; direction: "up" | "down" }
  trailing?: string
}

export function QuickStatsRail() {
  const { data, isLoading } = useDashboardStats()

  const last24h = data?.conversationsLast24h || 0;
  const prev24h = data?.conversationsPrev24h || 0;

  let diffPercent = 0;
  if (prev24h > 0) {
    diffPercent = ((last24h - prev24h) / prev24h) * 100;
  } else if (last24h > 0) {
    diffPercent = 100;
  }

  const isClient = data?.role === "client"

  const liveStats: Stat[] = [
    {
      label: "المحادثات · آخر 24 ساعة",
      value: isLoading ? "---" : last24h.toLocaleString("en-US"),
      icon: ChatCircleDots,
      trend: { value: `${Math.abs(diffPercent).toFixed(1)}%`, direction: diffPercent >= 0 ? "up" : "down" },
      trailing: "محادثة",
    },
    {
      label: "استهلاك التوكنز · 24 ساعة",
      value: isLoading ? "---" : (data?.tokensLast24h ?? 0).toLocaleString("en-US"),
      icon: Lightning,
      trend: { value: (data?.tokensLast24h ?? 0) > 0 ? "نشط" : "مستقر", direction: (data?.tokensLast24h ?? 0) > 0 ? "up" : "down" },
      trailing: "توكن",
    },
    ...(isClient
      ? [
          {
            label: "إجمالي الاستهلاك",
            value: isLoading ? "---" : (data?.totalTokensUsed ?? 0).toLocaleString("en-US"),
            icon: Lightning as Icon,
            trend: { value: (data?.totalTokensUsed ?? 0) > 0 ? "مسجّل" : "لا يوجد", direction: ((data?.totalTokensUsed ?? 0) > 0 ? "up" : "down") as "up" | "down" },
            trailing: "توكن",
          },
          {
            label: "إجمالي المحادثات",
            value: isLoading ? "---" : (data?.totalConversations ?? 0).toLocaleString("en-US"),
            icon: ChatCircleDots as Icon,
            trend: { value: (data?.totalConversations ?? 0) > 0 ? "نشط" : "لا يوجد", direction: ((data?.totalConversations ?? 0) > 0 ? "up" : "down") as "up" | "down" },
            trailing: "محادثة",
          },
        ]
      : [
          {
            label: "العملاء النشطون · 24 ساعة",
            value: isLoading ? "---" : (data?.clientsLast24h ?? 0).toLocaleString("en-US"),
            icon: UsersThree as Icon,
            trend: { value: (data?.clientsLast24h ?? 0) > 0 ? "نشط" : "لا يوجد", direction: ((data?.clientsLast24h ?? 0) > 0 ? "up" : "down") as "up" | "down" },
            trailing: "حساب SaaS",
          },
          {
            label: "نسبة الرضا · 24 ساعة",
            value: isLoading ? "---" : data?.satisfactionLast24h != null ? String(data.satisfactionLast24h) : "—",
            icon: ThumbsUp as Icon,
            trend: {
              value: data?.satisfactionLast24h != null
                ? (data.satisfactionLast24h >= 70 ? "جيد" : "منخفض")
                : "لا تقييمات",
              direction: ((data?.satisfactionLast24h ?? 0) >= 70 ? "up" : "down") as "up" | "down"
            },
            trailing: data?.satisfactionLast24h != null ? "% من المحادثات" : "",
          },
        ]
    ),
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {liveStats.map((s) => {
        const Up = s.trend.direction === "up"
        return (
          <div
            key={s.label}
            className="ghost-card relative overflow-hidden rounded-2xl bg-white/45 p-4 backdrop-blur-md transition-colors hover:bg-white/65"
          >
            <div className="flex items-center gap-2">
              <s.icon className="h-3.5 w-3.5 text-muted-foreground" weight="duotone" />
              <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </span>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-mono text-[32px] font-medium leading-none tracking-tighter-2 text-foreground tabular-nums">
                {s.value}
              </span>
              {s.trailing && (
                <span className="pb-1 text-[11px] text-muted-foreground">
                  {s.trailing}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px]">
              <span
                className={`inline-flex items-center gap-0.5 font-semibold ${
                  Up ? "text-success" : "text-destructive"
                }`}
              >
                {Up ? (
                  <ArrowUpRight className="h-3 w-3" weight="bold" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" weight="bold" />
                )}
                {s.trend.value}
              </span>
              <span className="text-muted-foreground">vs. السابق</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
