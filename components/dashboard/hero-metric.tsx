"use client"

import { useState, useMemo, useRef, useCallback } from "react"
import { ArrowUpRight, ArrowDownRight } from "@phosphor-icons/react/dist/ssr"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

// ── Interactive Sparkline ─────────────────────────────────────────────────────
function InteractiveSparkline({ points }: { points: { label: string; value: number }[] }) {
  const [hovered, setHovered] = useState<{ x: number; y: number; label: string; value: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const W = 800
  const H = 200
  const PAD = 10

  const values = points.map(p => p.value)
  const max = Math.max(...values, 1)
  const min = Math.min(...values)
  const range = max - min || 1

  // Convert data → SVG coordinates
  const coords = points.map((p, i) => ({
    x: PAD + (i / Math.max(points.length - 1, 1)) * (W - PAD * 2),
    y: H - PAD - ((p.value - min) / range) * (H - PAD * 2),
    ...p,
  }))

  // Smooth bezier path
  const linePath = coords.reduce((acc, pt, i) => {
    if (i === 0) return `M${pt.x},${pt.y}`
    const prev = coords[i - 1]
    const cx = (prev.x + pt.x) / 2
    return acc + ` C${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`
  }, "")

  const fillPath = linePath + ` L${coords[coords.length - 1]?.x ?? W},${H} L${coords[0]?.x ?? 0},${H} Z`

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect || coords.length === 0) return
    const relX = ((e.clientX - rect.left) / rect.width) * W
    // Find nearest point
    let nearest = coords[0]
    let minDist = Infinity
    for (const c of coords) {
      const d = Math.abs(c.x - relX)
      if (d < minDist) { minDist = d; nearest = c }
    }
    setHovered({ x: (nearest.x / W) * 100, y: (nearest.y / H) * 100, label: nearest.label, value: nearest.value })
  }, [coords])

  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-0 h-[55%] w-full">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
        className="h-full w-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}>
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="spark-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
            <stop offset="40%" stopColor="var(--primary)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <path d={fillPath} fill="url(#spark-fill)" />
        <path d={linePath} fill="none" stroke="url(#spark-line)" strokeWidth="2" strokeLinecap="round" />

        {/* Hover indicator */}
        {hovered && coords.find(c => c.label === hovered.label) && (() => {
          const pt = coords.find(c => c.label === hovered.label)!
          return (
            <>
              <line x1={pt.x} y1={0} x2={pt.x} y2={H} stroke="var(--primary)" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 3" />
              <circle cx={pt.x} cy={pt.y} r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
            </>
          )
        })()}
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-border/60 bg-white/90 px-3 py-2 shadow-lg backdrop-blur text-center"
          style={{ left: `${hovered.x}%`, top: `${hovered.y}%` }}>
          <p className="text-[10px] font-semibold text-muted-foreground">{hovered.label}</p>
          <p className="font-mono text-sm font-bold text-foreground">{hovered.value.toLocaleString("en-US")}</p>
          <p className="text-[10px] text-muted-foreground">توكن</p>
        </div>
      )}
    </div>
  )
}

// ── HeroMetric ────────────────────────────────────────────────────────────────
export function HeroMetric() {
  const { data, isLoading } = useDashboardStats()
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("monthly")

  const activity = data?.weeklyActivity ?? []

  // ── Sparkline points based on timeRange ─────────────────────────
  const sparkPoints = useMemo(() => {
    if (!data) return []

    // السيرفر قد يرسل monthlyActivity غير مسجل في واجهة TypeScript
    const monthlyActivity = (data as any).monthlyActivity || (data as any).monthly_activity
    const weeklyActivity = data.weeklyActivity ?? []

    if (timeRange === "daily") {
      const hourlyActivity = (data as any).hourlyActivity || (data as any).hourly_activity
      if (hourlyActivity?.length) {
         return hourlyActivity.map((d: any) => ({ label: d.hour || d.time || "ساعة", value: d.tokens ?? 0 }))
      }
      // Fallback
      const today = weeklyActivity[weeklyActivity.length - 1]
      return [{ label: "منتصف الليل", value: 0 }, { label: "اليوم", value: today?.tokens ?? 0 }]
    }

    if (timeRange === "monthly") {
      // إذا كان السيرفر يرسل نشاط الشهر كاملاً
      if (monthlyActivity?.length) {
         return monthlyActivity.map((d: any) => ({ label: d.day, value: d.tokens ?? 0 }))
      }
      // إذا كانت مصفوفة weeklyActivity تحتوي أصلاً على 30 يوم
      if (weeklyActivity.length > 7) {
         return weeklyActivity.map(d => ({ label: d.day, value: d.tokens ?? 0 }))
      }
      return weeklyActivity.map(d => ({ label: d.day, value: d.tokens ?? 0 }))
    }

    // Weekly
    if (weeklyActivity.length > 7) {
       // جلب آخر 7 أيام فقط إذا كانت المصفوفة تحتوي على بيانات الشهر كاملاً
       return weeklyActivity.slice(-7).map(d => ({ label: d.day, value: d.tokens ?? 0 }))
    }
    return weeklyActivity.map(d => ({ label: d.day, value: d.tokens ?? 0 }))
  }, [data, timeRange])

  // ── Current period tokens ────────────────────────────────────────
  const displayedTokens = useMemo(() => {
    if (!data) return 0
    if (timeRange === "daily") return data.tokensLast24h ?? 0
    if (timeRange === "weekly") return data.tokensThisWeek || activity.reduce((s, d) => s + (d.tokens ?? 0), 0)
    return data.tokensThisMonth ?? 0
  }, [data, timeRange, activity])

  // ── Comparison ───────────────────────────────────────────────────
  const { diffPct, isUp, compLabel } = useMemo(() => {
    if (!data) return { diffPct: "0.0", isUp: true, compLabel: "" }
    let current = 0, previous = 0, compLabel = ""
    if (timeRange === "daily") {
      current = data.tokensLast24h ?? 0
      previous = data.tokensPrevDay ?? 0
      compLabel = "مقارنةً بالأمس"
    } else if (timeRange === "weekly") {
      current = data.tokensThisWeek || activity.reduce((s, d) => s + (d.tokens ?? 0), 0)
      previous = data.tokensPrevWeek ?? 0
      compLabel = "مقارنةً بالأسبوع الماضي"
    } else {
      current = data.tokensThisMonth ?? 0
      previous = data.tokensLastMonth ?? 0
      compLabel = "مقارنةً بالشهر الماضي"
    }
    const diff = previous > 0 ? ((current - previous) / previous) * 100 : current > 0 ? 100 : 0
    return { diffPct: Math.abs(diff).toFixed(1), isUp: diff >= 0, compLabel }
  }, [data, timeRange, activity])

  const totalTokens = data?.totalTokensUsed ?? 0
  const totalQuota = totalTokens + (data?.totalBalance ?? 0)
  const formatted = displayedTokens.toLocaleString("en-US")
  const parts = formatted.split(",")
  let firstPart = ""
  let lastPart = formatted
  if (parts.length > 1) {
    lastPart = parts.pop() ?? ""
    firstPart = parts.join(",") + ","
  }
  const labels = { daily: "استهلاك اليوم", weekly: "استهلاك الأسبوع", monthly: "استهلاك الشهر" }

  return (
    <div className="glass corner-ember glass-highlight-top relative overflow-hidden rounded-3xl p-6 pt-10 md:p-10 md:pt-12">

      {/* Interactive sparkline — replaces static SVG */}
      {!isLoading && sparkPoints.length > 0
        ? <InteractiveSparkline points={sparkPoints} />
        : (
          <svg aria-hidden viewBox="0 0 800 200" preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] w-full">
            <defs>
              <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,160 C60,150 120,145 180,130 C240,115 300,125 360,110 C420,95 480,70 540,60 C600,50 660,55 720,35 C760,22 780,18 800,12 L800,200 L0,200 Z" fill="url(#spark-fill)" />
          </svg>
        )
      }

      {/* Top row */}
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Live Usage · {labels[timeRange]}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {timeRange === "daily" ? "آخر 24 ساعة" :
              timeRange === "weekly" ? "آخر 7 أيام" : `من ١ ${new Date().toLocaleDateString('ar-EG', { month: 'long' })} حتى الآن`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-border/40 bg-white/40 p-1 backdrop-blur-md">
            {(["daily", "weekly", "monthly"] as const).map(range => {
              const rangeLabels = { daily: "يومي", weekly: "أسبوعي", monthly: "شهري" }
              return (
                <button key={range} onClick={() => setTimeRange(range)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${timeRange === range
                      ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                      : "text-muted-foreground hover:text-foreground"
                    }`}>
                  {rangeLabels[range]}
                </button>
              )
            })}
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
            <span className="pulse-dot" style={{ background: "var(--success)", boxShadow: "0 0 0 3px oklch(0.62 0.14 155 / 0.2)" }} />
            مباشر
          </span>
        </div>
      </div>

      {/* Big number */}
      <div className="relative mt-8">
        <p className="font-mono text-[56px] font-medium leading-none tracking-tighter-2 text-foreground tabular-nums sm:text-[72px] md:text-[88px]">
          {isLoading
            ? <span className="text-muted-foreground/30 animate-pulse">---,---</span>
            : <>{firstPart}<span className="text-orange-gradient">{lastPart || displayedTokens}</span></>}
        </p>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          <span className="font-semibold text-foreground">توكن</span> تم معالجتها عبر الوكيل الذكي
        </p>
      </div>

      {/* Bottom — comparison */}
      <div className="relative mt-8 flex flex-col gap-4 border-t border-border/40 pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          {isLoading
            ? <span className="h-7 w-20 animate-pulse rounded-full bg-muted/40" />
            : <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${isUp ? "bg-success/10 text-success ring-success/20" : "bg-destructive/10 text-destructive ring-destructive/20"
              }`}>
              {isUp ? <ArrowUpRight className="h-3.5 w-3.5" weight="bold" /> : <ArrowDownRight className="h-3.5 w-3.5" weight="bold" />}
              {isUp ? "+" : "-"}{Number(diffPct) > 999 ? ">999" : diffPct}%
            </span>}
          <span className="text-xs text-muted-foreground">{compLabel}</span>
        </div>

        <div className="text-start text-[11px] text-muted-foreground sm:text-end">
          <p>من أصل{" "}
            <span className="font-mono font-semibold text-foreground">
              {isLoading ? "---" : totalQuota.toLocaleString("en-US")}
            </span>{" "}توكن شهرياً
          </p>
          <p className="mt-0.5 font-mono tabular-nums">التجديد في ١ {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('ar-EG', { month: 'long' })}</p>
        </div>
      </div>
    </div>
  )
}

