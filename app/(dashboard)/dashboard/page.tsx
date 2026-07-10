import { Sparkle, ArrowLeft } from "@phosphor-icons/react/dist/ssr"

import { HeroMetric } from "@/components/dashboard/hero-metric"
import { TokenRing } from "@/components/dashboard/token-ring"
import { QuickStatsRail } from "@/components/dashboard/quick-stats-rail"
import { UsageChart } from "@/components/dashboard/usage-chart"
import { LiveActivity } from "@/components/dashboard/live-activity"
import { TopClients } from "@/components/dashboard/top-clients"
import { SystemStatusBar } from "@/components/dashboard/system-status-bar"
import { ClientApiKeyBar } from "@/components/dashboard/client-api-key-bar"
import { Button } from "@/components/ui/button"

export default function DashboardHome() {
  return (
    <>
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
        {/* ─── Slim editorial intro ──────────────────────────── */}
        <section
          aria-labelledby="intro-heading"
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/55 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
              <Sparkle className="h-3 w-3 text-primary" weight="fill" />
              <span className="font-mono">intilaqa-ai</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">v1.1.4</span>
            </span>
            <h2
              id="intro-heading"
              className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-4xl"
            >
              مرحبًا بك في{" "}
              <span className="text-orange-gradient">مركز القيادة</span>
              <br />
              للمستشار الذكي.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty md:text-[15px]">
              يتعامل الوكيل الآن مع عملاء SaaS نشطين عبر ستّ خدمات موصولة.
              إليك ما يحدث لحظة بلحظة، وحالة استهلاك التوكنز، وأبرز الإشارات الآن.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-border/60 bg-white/55 text-xs font-semibold backdrop-blur hover:bg-white/80"
            >
              تصدير تقرير اليوم
              <ArrowLeft className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              className="cta-orange rounded-full text-xs font-semibold"
            >
              محادثة تجريبية مع الوكيل
              <ArrowLeft className="h-3 w-3" />
            </Button>
          </div>
        </section>

        {/* ─── Client API Key Bar (only shows for clients) ─ */}
        <ClientApiKeyBar />

        {/* ─── Bento Row 1: Hero Metric + Token Ring ──────── */}
        <section
          aria-label="الاستهلاك"
          className="grid grid-cols-12 gap-4 md:gap-5"
        >
          <div className="col-span-12 lg:col-span-8">
            <HeroMetric />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <TokenRing />
          </div>
        </section>

        {/* ─── Bento Row 2: Quick Stats Rail ──────────────── */}
        <section aria-label="مؤشرات سريعة">
          <QuickStatsRail />
        </section>

        {/* ─── Bento Row 3: Usage Chart ─────────── */}
        <section
          aria-label="الاستخدام الأسبوعي"
          className="grid grid-cols-12 gap-4 md:gap-5"
        >
          <div className="col-span-12">
            <UsageChart />
          </div>
        </section>

        {/* ─── Bento Row 4: Live Activity + Top Clients ──── */}
        <section
          aria-label="النشاط والعملاء"
          className="grid grid-cols-12 gap-4 md:gap-5"
        >
          <div className="col-span-12 lg:col-span-6">
            <LiveActivity />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <TopClients />
          </div>
        </section>

        {/* ─── Bottom: System status inline bar ────────────── */}
        <section aria-label="حالة الأنظمة">
          <SystemStatusBar />
        </section>
      </div>
    </>
  )
}
