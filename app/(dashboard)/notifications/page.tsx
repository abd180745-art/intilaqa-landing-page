"use client"

import { useState, useEffect } from "react"
import {
  Bell,
  BellRinging,
  Megaphone,
  EnvelopeSimple,
  Robot,
  CheckCircle,
  Warning,
  SpinnerGap,
  PaperPlaneTilt,
  Users,
  Coins,
  Star,
  Plus,
  PencilSimple,
  Trash
} from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/utils/supabase/client"

type Tab = "broadcast" | "direct" | "auto"

const WORKFLOW_ID = "intilaqa-ai" // Novu workflow identifier

interface AutoRule {
  id: string
  title: string
  triggerType: "low_balance" | "new_client" | "positive_review" | "subscription_expiring" | "custom"
  threshold: string
  subject: string
  body: string
  active: boolean
}

const DEFAULT_RULES: AutoRule[] = [
  {
    id: "r1",
    title: "تنبيه الرصيد المنخفض",
    triggerType: "low_balance",
    threshold: "10%",
    subject: "تنبيه: رصيدك قارب على الانتهاء",
    body: "عزيزي العميل، رصيد التوكنز الخاص بك انخفض إلى ما دون 10%. يرجى شحن الرصيد لضمان استمرار الخدمة.",
    active: true,
  },
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("broadcast")
  const { data } = useDashboardStats()
  const clients = data?.topClients || []

  // Broadcast state
  const [bSubject, setBSubject] = useState("")
  const [bBody, setBBody] = useState("")
  const [bLoading, setBLoading] = useState(false)
  const [bResult, setBResult] = useState<{ success: boolean; message: string } | null>(null)

  // Direct state
  const [dSelectedClient, setDSelectedClient] = useState("")
  const [dSubject, setDSubject] = useState("")
  const [dBody, setDBody] = useState("")
  const [dLoading, setDLoading] = useState(false)
  const [dResult, setDResult] = useState<{ success: boolean; message: string } | null>(null)

  // Auto Rules state
  const [rules, setRules] = useState<AutoRule[]>([])
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false)
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null)
  
  // Rule Form State
  const [rTitle, setRTitle] = useState("")
  const [rTrigger, setRTrigger] = useState<AutoRule["triggerType"]>("low_balance")
  const [rThreshold, setRThreshold] = useState("")
  const [rSubject, setRSubject] = useState("")
  const [rBody, setRBody] = useState("")

  // Load rules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("intilaqa_auto_rules")
    if (saved) {
      try {
        setRules(JSON.parse(saved))
      } catch (e) {
        setRules(DEFAULT_RULES)
      }
    } else {
      setRules(DEFAULT_RULES)
    }
  }, [])

  // Save rules to localStorage when changed
  useEffect(() => {
    if (rules.length > 0) {
      localStorage.setItem("intilaqa_auto_rules", JSON.stringify(rules))
    }
  }, [rules])

  const sendBroadcast = async () => {
    if (!bSubject.trim()) return
    setBLoading(true)
    setBResult(null)
    try {
      const workerUrl = process.env.NEXT_PUBLIC_INTILAQA_ENGINE_URL || "https://intilaqa-engine.abo200004.workers.dev"
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`/api/worker/admin/send-notification`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": session?.access_token ? `Bearer ${session.access_token}` : ""
        },
        body: JSON.stringify({
          type: "broadcast",
          workflowId: WORKFLOW_ID,
          subject: bSubject,
          body: bBody,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setBResult({ success: true, message: `تم الإرسال بنجاح إلى ${json.succeeded} عميل` })
        setBSubject("")
        setBBody("")
      } else {
        setBResult({ success: false, message: json.error || "حدث خطأ أثناء الإرسال" })
      }
    } catch {
      setBResult({ success: false, message: "تعذر الاتصال بالسيرفر" })
    } finally {
      setBLoading(false)
    }
  }

  const sendDirect = async () => {
    if (!dSelectedClient || !dSubject.trim()) return
    setDLoading(true)
    setDResult(null)
    try {
      const workerUrl = process.env.NEXT_PUBLIC_INTILAQA_ENGINE_URL || "https://intilaqa-engine.abo200004.workers.dev"
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`/api/worker/admin/send-notification`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": session?.access_token ? `Bearer ${session.access_token}` : ""
        },
        body: JSON.stringify({
          type: "direct",
          workflowId: WORKFLOW_ID,
          subscriberIds: [dSelectedClient],
          subject: dSubject,
          body: dBody,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setDResult({ success: true, message: "تم إرسال الإشعار بنجاح" })
        setDSubject("")
        setDBody("")
      } else {
        setDResult({ success: false, message: json.error || "حدث خطأ أثناء الإرسال" })
      }
    } catch {
      setDResult({ success: false, message: "تعذر الاتصال بالسيرفر" })
    } finally {
      setDLoading(false)
    }
  }

  const openNewRuleModal = () => {
    setEditingRuleId(null)
    setRTitle("")
    setRTrigger("low_balance")
    setRThreshold("10%")
    setRSubject("")
    setRBody("")
    setIsRuleModalOpen(true)
  }

  const openEditRuleModal = (rule: AutoRule) => {
    setEditingRuleId(rule.id)
    setRTitle(rule.title)
    setRTrigger(rule.triggerType)
    setRThreshold(rule.threshold)
    setRSubject(rule.subject)
    setRBody(rule.body)
    setIsRuleModalOpen(true)
  }

  const saveRule = () => {
    if (!rTitle.trim() || !rSubject.trim()) return

    if (editingRuleId) {
      setRules(rules.map(r => r.id === editingRuleId ? {
        ...r,
        title: rTitle,
        triggerType: rTrigger,
        threshold: rThreshold,
        subject: rSubject,
        body: rBody
      } : r))
    } else {
      const newRule: AutoRule = {
        id: Math.random().toString(36).substr(2, 9),
        title: rTitle,
        triggerType: rTrigger,
        threshold: rThreshold,
        subject: rSubject,
        body: rBody,
        active: true
      }
      setRules([...rules, newRule])
    }
    setIsRuleModalOpen(false)
  }

  const toggleRuleActive = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r))
  }

  const deleteRule = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه القاعدة التلقائية؟")) {
      setRules(rules.filter(r => r.id !== id))
    }
  }

  const tabs = [
    { id: "broadcast" as Tab, label: "إعلان جماعي", icon: Megaphone },
    { id: "direct" as Tab, label: "رسالة مباشرة", icon: EnvelopeSimple },
    { id: "auto" as Tab, label: "تنبيهات آلية", icon: Robot },
  ]

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case "low_balance": return Coins;
      case "positive_review": return Star;
      case "new_client": return Users;
      default: return Robot;
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BellRinging className="h-5 w-5" weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">مركز الإشعارات</h1>
            <p className="text-sm text-muted-foreground">تواصل مع عملائك وقم بأتمتة التنبيهات من مكان واحد</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "إجمالي العملاء", value: clients.length, icon: Users, color: "text-primary bg-primary/10" },
          { label: "قوالب Novu", value: "1", icon: Bell, color: "text-primary bg-primary/10" },
          { label: "قواعد آلية نشطة", value: rules.filter(r => r.active).length, icon: Robot, color: "text-primary bg-primary/10" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/40 bg-white p-5 shadow-[0_1px_0_0_oklch(1_0_0/0.8)_inset] flex items-center gap-4"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
              <stat.icon className="h-5 w-5" weight="duotone" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="rounded-3xl border border-border/40 bg-white shadow-[0_1px_0_0_oklch(1_0_0/0.8)_inset] overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-border/30 bg-muted/20 p-1.5 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 flex-1 justify-center",
                activeTab === tab.id
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50",
              ].join(" ")}
            >
              <tab.icon className="h-4 w-4" weight={activeTab === tab.id ? "fill" : "regular"} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {/* ── Broadcast Tab ── */}
          {activeTab === "broadcast" && (
            <div className="space-y-6 max-w-xl">
              <div className="space-y-1.5">
                <h2 className="font-semibold text-base">إعلان جماعي لجميع العملاء</h2>
                <p className="text-sm text-muted-foreground">
                  سيُرسل الإشعار إلى جميع العملاء المسجلين ({clients.length} عميل) في آنٍ واحد.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="b-subject">عنوان الإشعار <span className="text-destructive">*</span></Label>
                  <Input
                    id="b-subject"
                    placeholder="مثال: تحديث جديد في المنصة"
                    value={bSubject}
                    onChange={e => setBSubject(e.target.value)}
                    className="rounded-xl bg-white/80"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b-body">محتوى الإشعار</Label>
                  <Textarea
                    id="b-body"
                    placeholder="اكتب تفاصيل الإشعار هنا (اختياري)..."
                    value={bBody}
                    onChange={e => setBBody(e.target.value)}
                    rows={4}
                    className="rounded-xl bg-white/80 resize-none"
                  />
                </div>
              </div>

              {bResult && (
                <div className={[
                  "flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium",
                  bResult.success ? "bg-success/10 text-success border border-success/20" : "bg-destructive/10 text-destructive border border-destructive/20"
                ].join(" ")}>
                  {bResult.success ? <CheckCircle className="h-4 w-4 shrink-0" weight="fill" /> : <Warning className="h-4 w-4 shrink-0" weight="fill" />}
                  {bResult.message}
                </div>
              )}

              <Button
                onClick={sendBroadcast}
                disabled={bLoading || !bSubject.trim()}
                className="rounded-xl gap-2 h-11 px-6"
              >
                {bLoading ? <SpinnerGap className="h-4 w-4 animate-spin" /> : <PaperPlaneTilt className="h-4 w-4" weight="fill" />}
                {bLoading ? "جاري الإرسال..." : `إرسال للكل (${clients.length} عميل)`}
              </Button>
            </div>
          )}

          {/* ── Direct Tab ── */}
          {activeTab === "direct" && (
            <div className="space-y-6 max-w-xl">
              <div className="space-y-1.5">
                <h2 className="font-semibold text-base">رسالة مباشرة لعميل محدد</h2>
                <p className="text-sm text-muted-foreground">اختر العميل الذي تريد التواصل معه وأرسل له إشعاراً شخصياً.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="d-client">العميل <span className="text-destructive">*</span></Label>
                  <Select value={dSelectedClient} onValueChange={setDSelectedClient}>
                    <SelectTrigger className="w-full rounded-xl border-border/60 bg-white/70">
                      <SelectValue placeholder="— اختر عميلاً —" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c: any) => (
                        <SelectItem key={c.apiKey} value={c.email || c.apiKey}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="d-subject">عنوان الإشعار <span className="text-destructive">*</span></Label>
                  <Input
                    id="d-subject"
                    placeholder="مثال: تنبيه بشأن حسابك"
                    value={dSubject}
                    onChange={e => setDSubject(e.target.value)}
                    className="rounded-xl bg-white/80"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="d-body">محتوى الإشعار</Label>
                  <Textarea
                    id="d-body"
                    placeholder="اكتب رسالتك هنا..."
                    value={dBody}
                    onChange={e => setDBody(e.target.value)}
                    rows={4}
                    className="rounded-xl bg-white/80 resize-none"
                  />
                </div>
              </div>

              {dResult && (
                <div className={[
                  "flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium",
                  dResult.success ? "bg-success/10 text-success border border-success/20" : "bg-destructive/10 text-destructive border border-destructive/20"
                ].join(" ")}>
                  {dResult.success ? <CheckCircle className="h-4 w-4 shrink-0" weight="fill" /> : <Warning className="h-4 w-4 shrink-0" weight="fill" />}
                  {dResult.message}
                </div>
              )}

              <Button
                onClick={sendDirect}
                disabled={dLoading || !dSelectedClient || !dSubject.trim()}
                className="rounded-xl gap-2 h-11 px-6"
              >
                {dLoading ? <SpinnerGap className="h-4 w-4 animate-spin" /> : <PaperPlaneTilt className="h-4 w-4" weight="fill" />}
                {dLoading ? "جاري الإرسال..." : "إرسال الإشعار"}
              </Button>
            </div>
          )}

          {/* ── Auto Rules Tab ── */}
          {activeTab === "auto" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <h2 className="font-semibold text-base">القواعد والتنبيهات الآلية</h2>
                  <p className="text-sm text-muted-foreground">صمم قواعد مخصصة لإرسال إشعارات تلقائية للعملاء بناءً على شروط معينة.</p>
                </div>
                <Button onClick={openNewRuleModal} className="rounded-xl gap-2 h-10 px-4">
                  <Plus className="h-4 w-4" weight="bold" />
                  إضافة قاعدة جديدة
                </Button>
              </div>

              <div className="space-y-3">
                {rules.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
                      <Robot className="h-6 w-6" weight="duotone" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">لا توجد قواعد آلية</p>
                      <p className="text-xs text-muted-foreground mt-1">ابدأ بإنشاء قاعدة جديدة لإرسال رسائل تلقائية للعملاء.</p>
                    </div>
                  </div>
                ) : (
                  rules.map((rule) => {
                    const Icon = getTriggerIcon(rule.triggerType);
                    return (
                      <div
                        key={rule.id}
                        className="flex items-center gap-4 rounded-2xl border border-border/40 bg-white/60 p-5 transition-all duration-200"
                      >
                        <div className={[
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                          rule.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        ].join(" ")}>
                          <Icon className="h-5 w-5" weight="duotone" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{rule.title}</p>
                            <span className={[
                              "text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors",
                              rule.active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-muted text-muted-foreground hover:bg-muted/80"
                            ].join(" ")} onClick={() => toggleRuleActive(rule.id)}>
                              {rule.active ? "مفعّل" : "معطّل"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">رسالة: "{rule.subject}"</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-medium text-primary bg-primary/10 px-1.5 rounded">
                              الشرط: {
                                rule.triggerType === 'low_balance' ? 'رصيد منخفض' :
                                rule.triggerType === 'new_client' ? 'عميل جديد' :
                                rule.triggerType === 'positive_review' ? 'تقييم إيجابي' :
                                rule.triggerType === 'subscription_expiring' ? 'انتهاء اشتراك' : 'مخصص'
                              }
                            </span>
                            {rule.threshold && <span className="text-[11px] text-muted-foreground">الحد: {rule.threshold}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => openEditRuleModal(rule)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors" title="إعداد/تعديل">
                            <PencilSimple className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteRule(rule.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors" title="حذف">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rules Modal */}
      <Dialog open={isRuleModalOpen} onOpenChange={setIsRuleModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-border/40 bg-white">
          <DialogHeader>
            <DialogTitle>{editingRuleId ? "تعديل القاعدة التلقائية" : "إضافة قاعدة تلقائية جديدة"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="r-title">اسم القاعدة (لتمييزها داخلياً)</Label>
              <Input
                id="r-title"
                value={rTitle}
                onChange={e => setRTitle(e.target.value)}
                placeholder="مثال: تنبيه انخفاض الرصيد"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="r-trigger">الشرط (المُحفّز)</Label>
                <select
                  id="r-trigger"
                  value={rTrigger}
                  onChange={e => setRTrigger(e.target.value as any)}
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="low_balance">انخفاض الرصيد (التوكنز)</option>
                  <option value="new_client">تسجيل عميل جديد</option>
                  <option value="positive_review">تلقي تقييم إيجابي</option>
                  <option value="subscription_expiring">اقتراب انتهاء الاشتراك</option>
                  <option value="custom">شرط مخصص (API)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r-threshold">الحد/القيمة (اختياري)</Label>
                <Input
                  id="r-threshold"
                  value={rThreshold}
                  onChange={e => setRThreshold(e.target.value)}
                  placeholder="مثال: 10% أو 4 نجوم"
                  className="rounded-xl"
                />
              </div>
            </div>
            
            <div className="space-y-1.5 pt-2 border-t border-border/50">
              <p className="text-xs font-semibold text-muted-foreground mb-2">رسالة الإشعار التلقائية</p>
              <Label htmlFor="r-subject">عنوان الإشعار</Label>
              <Input
                id="r-subject"
                value={rSubject}
                onChange={e => setRSubject(e.target.value)}
                placeholder="عنوان الرسالة التي ستصل للعميل"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="r-body">تفاصيل الرسالة</Label>
              <Textarea
                id="r-body"
                value={rBody}
                onChange={e => setRBody(e.target.value)}
                placeholder="محتوى الإشعار التلقائي..."
                rows={3}
                className="rounded-xl resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRuleModalOpen(false)} className="rounded-xl">إلغاء</Button>
            <Button onClick={saveRule} disabled={!rTitle.trim() || !rSubject.trim()} className="rounded-xl px-6">
              حفظ القاعدة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

