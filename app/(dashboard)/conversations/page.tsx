"use client"

import { useState } from "react"
import {
  ChatsCircle,
  ChatCircleDots,
  ClockCountdown,
  Funnel,
  ArrowLeft,
  Lightning,
  UserCircle,
  Coins,
  ThumbsUp,
  ThumbsDown,
  ChatCircle,
  Robot,
  User,
} from "@phosphor-icons/react/dist/ssr"

import { StatCard } from "@/components/dashboard/stat-card"
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

export default function ConversationsPage() {
  const { data, isLoading } = useDashboardStats()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const conversations = data?.recentConversations || []
  const selectedChat = conversations.find((c) => c.id === selectedId)

  const activeCount = conversations.filter(c => c.status === "active").length

  return (
    <>
      <main className="flex-1 space-y-8 p-4 pt-6 md:p-8">
        {/* ─── Editorial hero ──────────────────────────── */}
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/55 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
              <Lightning className="h-3 w-3 text-primary" weight="fill" />
              <span>{activeCount} جلسة نشطة مؤخراً</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-success">متوسط الاستجابة 1.4s</span>
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-4xl">
              سجل{" "}
              <span className="text-orange-gradient">المحادثات</span>
              <br />
              لمراقبة جودة الردود والاستهلاك.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty md:text-[15px]">
              استعرض أحدث المحادثات التي جرت بين المستخدمين ومحرك الذكاء الاصطناعي. يمكنك قراءة نص الاستفسار ورد البوت الفعلي للتحقق من جودة الإجابات.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-border/60 bg-white/55 text-xs font-semibold backdrop-blur hover:bg-white/80"
            >
              <Funnel className="h-3 w-3" weight="bold" />
              تصدير كملف CSV
            </Button>
          </div>
        </section>

        {/* ─── Stats row ─────────────────────────────────── */}
        <section className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          <StatCard
            label="محادثات آخر 24 ساعة"
            value={isLoading ? "..." : (data?.conversationsLast24h || 0).toLocaleString("en-US")}
            icon={ChatsCircle}
            tone="primary"
          />
          <StatCard
            label="استهلاك التوكنز · آخر 24 ساعة"
            value={isLoading ? "..." : (data?.tokensLast24h || 0).toLocaleString("en-US")}
            icon={Coins}
            tone="primary"
          />
          <StatCard
            label="الموظفين النشطون · آخر 24 ساعة"
            value={isLoading ? "..." : "0"}
            icon={ChatCircleDots}
            tone="primary"
          />
          <StatCard
            label="نسبة الرضا · آخر 24 ساعة"
            value={isLoading ? "..." : data?.satisfactionLast24h != null ? `${data.satisfactionLast24h}%` : "—"}
            icon={ThumbsUp}
            tone="primary"
          />
        </section>

        {/* ─── Bento: Conversations list + Details panel ─────── */}
        <section className="grid grid-cols-12 gap-4 md:gap-5">
          {/* List */}
          <div className="glass glass-highlight-top relative col-span-12 h-[600px] overflow-hidden overflow-y-auto rounded-3xl lg:col-span-6 xl:col-span-5">
            <div className="sticky top-0 z-10 border-b border-border/40 bg-white/50 p-4 backdrop-blur-md md:px-6">
              <h3 className="text-sm font-bold tracking-tight text-foreground">
                أحدث {conversations.length} محادثة
              </h3>
            </div>
            <ul className="flex flex-col p-2">
              {conversations.map((c) => {
                const status = statusMap[c.status]
                const isSelected = selectedId === c.id
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelectedId(c.id)}
                      className={`flex w-full items-start gap-3 rounded-2xl p-3 text-right transition-colors ${
                        isSelected
                          ? "bg-primary/5 ring-1 ring-inset ring-primary/20"
                          : "hover:bg-white/50"
                      }`}
                    >
                      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                        <ChatCircle className="h-4 w-4" weight="fill" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {c.title}
                          </p>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="font-mono text-[10px] opacity-75">
                            {c.id.split("-")[0]}
                          </span>
                          <span aria-hidden className="text-border">·</span>
                          <span className="tabular-nums">{c.time}</span>
                          <span aria-hidden className="text-border">·</span>
                          <span className="font-mono tabular-nums text-primary/70">{c.tokens?.toLocaleString("en-US")} توكن</span>
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
              {conversations.length === 0 && !isLoading && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  لا توجد محادثات بعد.
                </div>
              )}
            </ul>
          </div>

          {/* Details Panel */}
          <div className="glass glass-highlight-top relative col-span-12 h-[600px] overflow-hidden overflow-y-auto rounded-3xl lg:col-span-6 xl:col-span-7">
            {!selectedChat ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl silver-surface text-muted-foreground ring-1 ring-inset ring-white/60 shadow-sm">
                  <UserCircle className="h-7 w-7" weight="duotone" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  لم يتم اختيار جلسة
                </p>
                <p className="max-w-[240px] text-xs leading-relaxed text-muted-foreground text-pretty">
                  اختر جلسة من القائمة لعرض تفاصيلها وقراءة الرد الكامل الصادر من البوت.
                </p>
              </div>
            ) : (
              <div className="flex flex-col p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/40 pb-5">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      تفاصيل الجلسة
                    </h3>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {selectedChat.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ClockCountdown className="h-3.5 w-3.5" />
                      {selectedChat.time}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-mono font-semibold text-primary">
                      <Coins className="h-3.5 w-3.5" />
                      {selectedChat.tokens?.toLocaleString("en-US")} توكن
                    </span>
                  </div>
                </div>

                {/* Chat Bubbles */}
                <div className="mt-6 flex flex-col gap-6">
                  {/* User Bubble */}
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <User className="h-3.5 w-3.5" weight="bold" />
                      </div>
                      <span className="text-xs font-semibold text-foreground">المستخدم</span>
                    </div>
                    <div className="mr-9 rounded-2xl rounded-tr-none bg-muted/40 p-4 text-sm leading-relaxed text-foreground">
                      {selectedChat.title}
                    </div>
                  </div>

                  {/* Bot Bubble */}
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
                        <Robot className="h-3.5 w-3.5" weight="fill" />
                      </div>
                      <span className="text-xs font-semibold text-orange-600">المحرك (Bot)</span>
                    </div>
                    <div className="mr-9 whitespace-pre-wrap rounded-2xl rounded-tr-none bg-white p-4 text-sm leading-relaxed text-foreground shadow-sm ring-1 ring-black/5">
                      {selectedChat.botResponse || (
                        <span className="italic text-muted-foreground">لم يتم تسجيل رد أو أن الرد فارغ.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
