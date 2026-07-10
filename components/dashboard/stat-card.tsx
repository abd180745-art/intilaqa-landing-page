import type { Icon } from "@phosphor-icons/react"
import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  hint?: string
  icon: Icon
  trend?: {
    value: string
    direction: "up" | "down"
    label?: string
  }
  tone?: "primary" | "success" | "warning" | "silver" | "accent"
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary:
    "bg-primary/10 text-primary ring-1 ring-inset ring-primary/15",
  success:
    "bg-success/10 text-success ring-1 ring-inset ring-success/20",
  warning:
    "bg-warning/15 text-warning-foreground ring-1 ring-inset ring-warning/25",
  silver:
    "silver-surface text-foreground ring-1 ring-inset ring-white/60",
  accent:
    "bg-accent/10 text-accent ring-1 ring-inset ring-accent/20",
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  tone = "primary",
}: StatCardProps) {
  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Top highlight hairline */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums md:text-[32px]">
            {value}
          </span>
          {hint && (
            <span className="text-xs text-muted-foreground">{hint}</span>
          )}
        </div>

        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm",
            toneStyles[tone]
          )}
        >
          <Icon className="h-5 w-5" weight="duotone" aria-hidden="true" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
              trend.direction === "up"
                ? "bg-success/10 text-success ring-success/20"
                : "bg-destructive/10 text-destructive ring-destructive/20"
            )}
          >
            {trend.direction === "up" ? (
              <ArrowUpRight className="h-3 w-3" weight="bold" />
            ) : (
              <ArrowDownRight className="h-3 w-3" weight="bold" />
            )}
            {trend.value}
          </span>
          {trend.label && (
            <span className="text-[11px] text-muted-foreground">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
