"use client"

import { Lightning } from "@phosphor-icons/react/dist/ssr"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

/**
 * Circular progress ring for token quota.
 * Gradient stroke, huge tabular center, split legend at bottom.
 */
export function TokenRing() {
  const { data, isLoading } = useDashboardStats()
  const isClient = data?.role === "client"

  const used = data?.totalTokensUsed ?? 0
  // إجمالي الباقات الممنوحة = ما تم استهلاكه + ما تبقى في أرصدتهم
  const total = used + (data?.totalBalance ?? 0)
  const remaining = total - used
  const percent = total > 0 ? Math.round((used / total) * 100) : 0

  const size = 200
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="glass glass-highlight-top relative flex h-full flex-col overflow-hidden rounded-3xl p-6 md:p-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {isClient ? "My Quota" : "Clients Global Quota"}
          </p>
          <h3 className="mt-1 text-base font-bold tracking-tight text-foreground">
            {isClient ? "باقتي" : "إجمالي باقات العملاء"}
          </h3>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full silver-surface ring-1 ring-inset ring-white/70 shadow-sm">
          <Lightning className="h-4 w-4 text-primary" weight="fill" />
        </div>
      </div>

      {/* Ring */}
      <div className="relative mx-auto my-6 flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Glow behind ring */}
        <div
          aria-hidden
          className="absolute inset-4 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(230, 150, 5, 0.18), transparent 70%)",
            filter: "blur(12px)",
          }}
        />
        <svg width={size} height={size} className="-rotate-90 relative">
          <defs>
            <linearGradient id="ring-grad" x1="1" y1="0.5" x2="0" y2="0.5">
              <stop offset="0%" stopColor="#e69605" />
              <stop offset="100%" stopColor="#db4a00" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.88 0.008 250 / 0.5)"
            strokeWidth={stroke}
          />
          {/* Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-5xl font-medium leading-none tracking-tighter-2 text-foreground tabular-nums">
            {isLoading ? "--" : percent}
            <span className="ml-0.5 text-2xl text-muted-foreground">%</span>
          </span>
          <span className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            مستهلك
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border/40 pt-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              مستهلك
            </span>
          </div>
          <p className="mt-1 font-mono text-sm font-semibold text-foreground tabular-nums">
            {isLoading ? "---" : used.toLocaleString("en-US")}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              المتبقي
            </span>
          </div>
          <p className="mt-1 font-mono text-sm font-semibold text-foreground tabular-nums">
            {isLoading ? "---" : remaining.toLocaleString("en-US")}
          </p>
        </div>
      </div>
    </div>
  )
}
