"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Key,
  Database,
  Trophy,
  BookOpen,
  ShieldCheck,
  SpinnerGap,
  CheckCircle,
  Warning,
  Star,
  EnvelopeSimple,
  Coins,
} from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type TabId = "policies" | "search"

const settingsTabs: { id: TabId; icon: any; label: string; description: string }[] = [
  { id: "policies", icon: ShieldCheck, label: "سياسات القبول والاستخدام", description: "شروط الفيزا، والقبول، والاستخدام" },
  { id: "search", icon: BookOpen, label: "إعدادات البحث المتقدم", description: "نطاقات المصادر الرسمية للبحث" },
]

const WORKER = process.env.NEXT_PUBLIC_INTILAQA_ENGINE_URL ?? "https://intilaqa-engine.abo200004.workers.dev"

type Settings = Record<string, string>

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("policies")
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const update = useCallback((key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  // ── Load from Worker API on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/worker/admin/settings`)
        if (res.ok) {
          const data = await res.json()
          if (data.settings) setSettings(data.settings)
        }
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  // ── Save via Worker API
  const handleSave = async () => {
    setSaving(true); setSaveMsg(null)
    try {
      const res = await fetch(`/api/worker/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error ?? res.statusText)
      
      setSaveMsg({ ok: true, text: `تم الحفظ بنجاح` })
    } catch (e: any) {
      setSaveMsg({ ok: false, text: e.message })
    } finally { setSaving(false) }
  }

  const currentTab = settingsTabs.find((t) => t.id === activeTab) || settingsTabs[0]
  const TabIcon = currentTab.icon

  return (
    <main className="flex-1 space-y-8 p-4 pt-6 md:p-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main panel */}
        <div className="space-y-6">
          <section className="glass glass-highlight-top relative overflow-hidden rounded-3xl p-6 md:p-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl silver-surface text-primary ring-1 ring-inset ring-white/60 shadow-sm">
                  <TabIcon className="h-5 w-5" weight="duotone" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    {currentTab.label}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {currentTab.description}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success ring-1 ring-inset ring-success/25">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                </span>
                النظام متصل
              </span>
            </div>

            <div className="hairline-orange mt-5" />

            <div className="mt-6 animate-in fade-in duration-300">
              {loading ? (
                <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground text-sm">
                  <SpinnerGap className="h-5 w-5 animate-spin text-primary" /> جاري تحميل الإعدادات...
                </div>
              ) : (
                <>
                  {activeTab === "policies" && <PoliciesSettings s={settings} u={update} />}
                  {activeTab === "search" && <SearchSettings s={settings} u={update} />}
                </>
              )}
            </div>
          </section>

          <div className="glass-pill flex flex-col items-start justify-between gap-4 rounded-full px-5 py-4 md:flex-row md:items-center md:px-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground text-pretty">
                يتم الحفظ مباشرة في Supabase — يسري على الـ Worker فوراً بدون إعادة نشر.
              </p>
              {saveMsg && (
                <p className={`flex items-center gap-1.5 text-xs font-semibold ${
                  saveMsg.ok ? "text-success" : "text-destructive"
                }`}>
                  {saveMsg.ok
                    ? <CheckCircle className="h-3.5 w-3.5" weight="fill" />
                    : <Warning className="h-3.5 w-3.5" weight="fill" />}
                  {saveMsg.text}
                </p>
              )}
            </div>
            <Button size="lg" className="cta-orange rounded-full shadow-sm" onClick={handleSave} disabled={saving || loading}>
              {saving ? <SpinnerGap className="h-4 w-4 animate-spin" /> : null}
              {saving ? "جاري الحفظ..." : "حفظ جميع التغييرات"}
            </Button>
          </div>
        </div>

        {/* Side nav */}
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="glass glass-highlight-top relative overflow-hidden rounded-3xl p-2">
            <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              إعدادات المحرك (SaaS)
            </p>
            <ul className="space-y-0.5">
              {settingsTabs.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-right text-sm transition-all ${
                      activeTab === item.id
                        ? "bg-primary/10 font-semibold text-primary ring-1 ring-inset ring-primary/15 shadow-[0_1px_0_0_oklch(1_0_0/0.8)_inset]"
                        : "text-muted-foreground hover:bg-white/60 hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" weight={activeTab === item.id ? "fill" : "regular"} />
                    <span className="truncate text-pretty">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}

const COUNTRIES = [
  { key: "turkey",   flag: "🇹🇷", label: "تركيا",    desc: "إجراءات الفيزا، شروط القبول، مدد الإقامة" },
  { key: "germany",  flag: "🇩🇪", label: "ألمانيا",  desc: "متطلبات اللغة، تصاريح الإقامة، الرسوم" },
  { key: "malaysia", flag: "🇲🇾", label: "ماليزيا",  desc: "شروط الدراسة، سياسات الدخول، تأشيرة الطالب" },
  { key: "cyprus",   flag: "🇨🇾", label: "قبرص",    desc: "الإجراءات، شروط الالتحاق، الرسوم الحكومية" },
]

function PoliciesSettings({ s, u }: { s: Record<string, string>; u: (k: string, v: string) => void }) {
  const [activeCountry, setActiveCountry] = useState("turkey")
  const current = COUNTRIES.find(c => c.key === activeCountry) || COUNTRIES[0]

  return (
    <div className="space-y-6">
      {/* Country Tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-2xl bg-muted/30 p-1.5">
        {COUNTRIES.map(c => (
          <button
            key={c.key}
            type="button"
            onClick={() => setActiveCountry(c.key)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
              activeCountry === c.key
                ? "bg-white shadow-sm text-primary ring-1 ring-border/40"
                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
            }`}
          >
            <span>{c.flag}</span> {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        <p className="text-[11px] text-muted-foreground">{current.desc}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`policies-${activeCountry}`} className="text-sm font-semibold">
          📋 سياسات وإجراءات {current.flag} {current.label}
        </Label>
        <Textarea
          key={activeCountry}
          id={`policies-${activeCountry}`}
          rows={8}
          placeholder={`أضف هنا سياسات القبول، إجراءات الفيزا، ومدد الدراسة الخاصة بـ${current.label}...`}
          value={s[`general_policies_${activeCountry}`] ?? ""}
          onChange={e => u(`general_policies_${activeCountry}`, e.target.value)}
          className="resize-none rounded-xl border-border/60 bg-white/70 text-sm backdrop-blur focus-visible:ring-primary/30"
        />
        <p className="text-[11px] text-muted-foreground">
          الـ key المحفوظ في Supabase: <code dir="ltr" className="font-mono text-primary">general_policies_{activeCountry}</code>
        </p>
      </div>

      <div className="hairline-orange" />

      <div className="space-y-2">
        <Label htmlFor="usage-policy" className="text-sm font-semibold">📄 نص سياسة الاستخدام (للمستخدم النهائي — مشترك لجميع البلدان)</Label>
        <Textarea
          id="usage-policy"
          rows={4}
          placeholder="سياسة الاستخدام الظاهرة للمستخدمين في تبويب 'السياسات' داخل الويدجت..."
          value={s.usage_policy_text ?? ""}
          onChange={e => u("usage_policy_text", e.target.value)}
          className="resize-none rounded-xl border-border/60 bg-white/70 text-sm backdrop-blur focus-visible:ring-primary/30"
        />
        <p className="text-[11px] text-muted-foreground">الـ key: <code dir="ltr" className="font-mono text-primary">usage_policy_text</code></p>
      </div>
    </div>
  )
}

function SearchSettings({ s, u }: { s: Record<string, string>; u: (k: string, v: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">نطاقات المصادر الرسمية (Official Domains)</Label>
        <Textarea rows={5} dir="ltr" placeholder="qs.com&#10;timeshighereducation.com&#10;..."
          value={s.tavily_allowed_domains ?? ""}
          onChange={e => u("tavily_allowed_domains", e.target.value)}
          className="resize-none rounded-xl border-border/60 bg-white/70 font-mono text-xs backdrop-blur focus-visible:ring-primary/30" />
        <p className="text-[11px] text-muted-foreground">أدخل نطاق واحد في كل سطر. سيقتصر بحث تصنيفات الجامعات الحية على هذه المواقع.</p>
      </div>
    </div>
  )
}

function LimitsSettings({ s, u }: { s: Record<string, string>; u: (k: string, v: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Max Output Tokens</Label>
          <Input type="number" dir="ltr" placeholder="600"
            value={s.max_output_tokens ?? ""}
            onChange={e => u("max_output_tokens", e.target.value)}
            className="rounded-xl border-border/60 bg-white/70" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">الحد الأقصى للطلبات (Rate Limit)</Label>
          <Input type="number" dir="ltr" placeholder="10"
            value={s.rate_limit_max ?? ""}
            onChange={e => u("rate_limit_max", e.target.value)}
            className="rounded-xl border-border/60 bg-white/70" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">نافذة الحد الزمني (بالثواني)</Label>
          <Input type="number" dir="ltr" placeholder="60"
            value={s.rate_limit_window ?? ""}
            onChange={e => u("rate_limit_window", e.target.value)}
            className="rounded-xl border-border/60 bg-white/70" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">عدد الرسائل المحفوظة بالذاكرة (History)</Label>
          <Input type="number" dir="ltr" placeholder="5"
            value={s.history_messages ?? ""}
            onChange={e => u("history_messages", e.target.value)}
            className="rounded-xl border-border/60 bg-white/70" />
        </div>
        <div className="space-y-3 pt-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-warning">
            <input type="checkbox"
              checked={s.debug_mode === "true"}
              onChange={e => u("debug_mode", e.target.checked ? "true" : "false")}
              className="h-4 w-4 rounded border-border/60 text-warning focus:ring-warning/30" />
            تفعيل وضع التشخيص (Debug Mode) 🐛
          </label>
        </div>
      </div>
    </div>
  )
}


