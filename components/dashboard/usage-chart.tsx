"use client"

import { useState, useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

const fallbackData: Array<{ day: string; conversations: number; tokens: number }> = []

const chartConfig = {
  conversations: { label: "المحادثات", color: "var(--chart-1)" },
  tokens: { label: "التوكنز", color: "var(--chart-2)" },
} satisfies ChartConfig

export function UsageChart() {
  const { data } = useDashboardStats()
  const [selectedClient, setSelectedClient] = useState<string>("all")

  const clients = data?.topClients || []

  // Use real client-specific data returned by the API
  const chartData = useMemo(() => {
    const globalData = data?.weeklyActivity && data.weeklyActivity.length > 0
      ? data.weeklyActivity
      : fallbackData

    if (selectedClient === "all") return globalData

    // Fetch the real per-client data from the API (Admin Role)
    if (data?.role === 'admin' && data?.clientWeeklyActivity && data.clientWeeklyActivity[selectedClient]) {
      return data.clientWeeklyActivity[selectedClient]
    }

    // Fetch the per-source data from the API (Client Role)
    if (data?.role !== 'admin' && data?.sourceWeeklyActivity && data.sourceWeeklyActivity[selectedClient]) {
      return data.sourceWeeklyActivity[selectedClient]
    }

    // Fallback if client has no data for the week yet
    return globalData.map((d) => ({
      ...d,
      conversations: 0,
      tokens: 0,
    }))
  }, [data?.weeklyActivity, data?.clientWeeklyActivity, data?.sourceWeeklyActivity, data?.role, selectedClient])

  const totalConversations = chartData.reduce(
    (sum, item) => sum + item.conversations,
    0,
  )
  const totalTokens = chartData.reduce((sum, item) => sum + item.tokens, 0)

  return (
    <div className="glass glass-highlight-top relative h-full overflow-hidden rounded-3xl p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Weekly Activity
            </p>
            <h3 className="mt-1 text-lg font-bold tracking-tight text-foreground">
              نشاط الاستخدام الأسبوعي
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              المحادثات والتوكنز المستهلكة خلال آخر ٧ أيام
            </p>
          </div>
          <div className="mt-2 w-48">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="h-8 text-xs bg-white/50 backdrop-blur-sm border-border/40">
                <SelectValue placeholder={data?.role === 'admin' ? "اختر العميل..." : "اختر المصدر..."} />
              </SelectTrigger>
              <SelectContent>
                {data?.role === 'admin' ? (
                  <>
                    <SelectItem value="all">كل العملاء (الإجمالي)</SelectItem>
                    {clients.map((c) => (
                      <SelectItem key={c.apiKey} value={c.apiKey}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </>
                ) : (
                  <>
                    <SelectItem value="all">كل الاستخدام (الإجمالي)</SelectItem>
                    <SelectItem value="widget">ويدجت الموقع (Frontend)</SelectItem>
                    <SelectItem value="extension">إضافة الموظفين (Staff)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--chart-1)] shadow-[0_0_0_3px_oklch(0.74_0.16_62/0.18)]" />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                محادثات
              </span>
              <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
                {totalConversations.toLocaleString("en-US")}
              </span>
            </div>
          </div>
          <span className="h-8 w-px bg-border/60" />
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--chart-2)] shadow-[0_0_0_3px_oklch(0.48_0.08_245/0.2)]" />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                توكنز
              </span>
              <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
                {totalTokens.toLocaleString("en-US")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="hairline-orange mt-5" />

      <div className="mt-5">
        {chartData.length === 0 ? (
          <div className="flex h-[260px] w-full items-center justify-center text-sm text-muted-foreground">
            لا توجد بيانات للاستخدام الأسبوعي.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <AreaChart
              key={selectedClient} // Forces re-render of Recharts to ensure animation/update
              data={chartData}
              margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillTokens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="1 6"
                stroke="oklch(0.55 0.04 250 / 0.18)"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                reversed
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                orientation="right"
                width={44}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                }}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area
                type="monotone"
                dataKey="tokens"
                stroke="var(--chart-2)"
                strokeWidth={1.5}
                fill="url(#fillTokens)"
                stackId="a"
              />
              <Area
                type="monotone"
                dataKey="conversations"
                stroke="var(--chart-1)"
                strokeWidth={2.25}
                fill="url(#fillConv)"
                stackId="b"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>
    </div>
  )
}
