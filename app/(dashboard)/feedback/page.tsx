"use client"

import { useMemo } from "react"
import {
  Star,
  ThumbsDown,
  ThumbsUp,
  ChatCircleDots,
  Smiley,
  ArrowLeft,
  TrendUp,
  Quotes,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr"

import { StatCard } from "@/components/dashboard/stat-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

const sentimentStyles: Record<string, string> = {
  success: "[&>div]:bg-success",
  accent: "[&>div]:bg-accent",
  destructive: "[&>div]:bg-destructive",
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i < count ? "text-primary" : "text-muted-foreground/30"}`}
          weight={i < count ? "fill" : "regular"}
        />
      ))}
    </div>
  )
}

export default function FeedbackPage() {
  const { data, isLoading } = useDashboardStats()

  const stats = useMemo(() => {
    const chats = data?.recentConversations || []
    
    // For MVP: Let's assume likes/dislikes come from the chat
    let totalLikes = 0
    let totalDislikes = 0
    let ratedChats = []

    chats.forEach(c => {
      if (c.likes > 0 || c.dislikes > 0) {
        totalLikes += c.likes
        totalDislikes += c.dislikes
        ratedChats.push(c)
      }
    })

    const totalRatings = totalLikes + totalDislikes
    const satisfactionRate = totalRatings > 0 ? Math.round((totalLikes / totalRatings) * 100) : 100

    return { totalLikes, totalDislikes, totalRatings, satisfactionRate, ratedChats }
  }, [data, isLoading])

  const sentiments = [
    { label: "إيجابية", value: stats.satisfactionRate, tone: "success" },
    { label: "محايدة", value: Math.max(0, 100 - stats.satisfactionRate - 5), tone: "accent" },
    { label: "سلبية", value: stats.totalRatings > 0 ? Math.round((stats.totalDislikes / stats.totalRatings) * 100) : 0, tone: "destructive" },
  ]

  return (
    <>
      <main className="flex-1 space-y-8 p-4 pt-6 md:p-8">
        {/* ─── Editorial hero ──────────────────────────── */}
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/55 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
              <Smiley className="h-3 w-3 text-primary" weight="fill" />
              <span>رضا المستخدمين</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-success">تحديث حي من المحادثات</span>
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-4xl">
              {isLoading ? "..." : `٪${stats.satisfactionRate}`} من المستخدمين{" "}
              <span className="text-orange-gradient">سعداء</span>
              <br />
              بتجربة الوكيل.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty md:text-[15px]">
              نتابع كل تقييم مُفصَّل، ونحوّل الاقتراحات إلى تحسينات دورية على
              البروميت وسلوك الوكيل. يتم حساب التقييمات بناءً على ردود أفعال المستخدمين على إجابات البوت.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-border/60 bg-white/55 text-xs font-semibold backdrop-blur hover:bg-white/80"
            >
              فلترة
            </Button>
            <Button size="sm" className="cta-orange rounded-full text-xs font-semibold">
              تصدير CSV
              <ArrowLeft className="h-3 w-3" />
            </Button>
          </div>
        </section>

        {/* ─── Stats row ─────────────────────────────────── */}
        <section className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          <StatCard
            label="تقييمات إيجابية"
            value={isLoading ? "..." : stats.totalLikes.toLocaleString("en-US")}
            icon={ThumbsUp}
            tone="primary"
          />
          <StatCard
            label="تقييمات سلبية"
            value={isLoading ? "..." : stats.totalDislikes.toLocaleString("en-US")}
            icon={ThumbsDown}
            tone="primary"
          />
          <StatCard
            label="معدل الرضا العام"
            value={isLoading ? "..." : `${stats.satisfactionRate}%`}
            icon={Star}
            tone="primary"
          />
          <StatCard
            label="المحادثات المُقيّمة"
            value={isLoading ? "..." : stats.ratedChats.length.toLocaleString("en-US")}
            icon={ChatCircleDots}
            tone="primary"
          />
        </section>

        {/* ─── Bento: Rating breakdown + Sentiment ──── */}
        <section className="grid grid-cols-12 gap-4 md:gap-5">
          {/* Sentiment */}
          <div className="glass glass-highlight-top relative col-span-12 overflow-hidden rounded-3xl p-5 md:col-span-12 md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl silver-surface text-primary ring-1 ring-inset ring-white/60 shadow-sm">
                <Sparkle className="h-4 w-4" weight="fill" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-foreground">
                  تحليل المشاعر للإجابات
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  محسوب من تفاعلات المستخدم المباشرة
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-4 max-w-2xl">
              {sentiments.map((s) => (
                <li key={s.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">
                      {s.label}
                    </span>
                    <span className="font-mono tabular-nums text-foreground">
                      {s.value}%
                    </span>
                  </div>
                  <Progress
                    value={s.value}
                    className={`h-1.5 bg-muted/60 ${sentimentStyles[s.tone]}`}
                  />
                </li>
              ))}
            </ul>

            <div className="hairline-orange my-5" />

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="pulse-dot" />
              <span>يتم التحديث تلقائياً مع كل عملية تقييم</span>
            </div>
          </div>
        </section>

        {/* ─── Highlighted feedback ─────────────────── */}
        <section className="glass glass-highlight-top relative overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between gap-3 p-5 md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl silver-surface text-primary ring-1 ring-inset ring-white/60 shadow-sm">
                <Quotes className="h-4 w-4" weight="fill" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  أصوات المستخدمين
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  أبرز المحادثات التي تم التفاعل معها
                </p>
              </div>
            </div>
          </div>
          <div className="hairline-orange mx-5 md:mx-6" />

          <ul className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3 md:gap-5 md:p-6">
            {stats.ratedChats.slice(0, 3).map((f) => (
              <li
                key={f.id}
                className="ghost-card relative flex flex-col gap-3 rounded-2xl bg-white/30 p-5 backdrop-blur transition-colors hover:bg-white/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20">
                      م
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        مستخدم
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground font-mono">
                        {f.id.split('-')[0]}
                      </p>
                    </div>
                  </div>
                  <StarRow count={f.likes > f.dislikes ? 5 : (f.dislikes > 0 ? 1 : 3)} />
                </div>

                <p className="text-xs leading-relaxed text-foreground/85 text-pretty">
                  <Quotes
                    className="ml-1 inline h-3 w-3 -translate-y-0.5 text-primary/60"
                    weight="fill"
                  />
                  {f.title}
                </p>

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/30 pt-3 text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <ChatCircleDots className="h-3 w-3" weight="duotone" />
                    محادثة
                  </span>
                  <span>{f.time}</span>
                </div>
              </li>
            ))}
            {stats.ratedChats.length === 0 && !isLoading && (
              <li className="col-span-full py-12 text-center text-sm text-muted-foreground">
                لا توجد تقييمات مسجلة مؤخراً في قاعدة البيانات.
              </li>
            )}
          </ul>
        </section>
      </main>
    </>
  )
}
