"use client"

import { useState } from "react"
import {
  Coins,
  Plus,
  UsersThree,
  Wallet,
  ArrowLeft,
  Buildings,
  TrendUp,
  SpinnerGap,
  Gear,
  Trash,
  X
} from "@phosphor-icons/react/dist/ssr"

import { StatCard } from "@/components/dashboard/stat-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

function formatNumber(n: number) {
  return n.toLocaleString("ar-EG")
}

export default function ClientsPage() {
  const { data, isLoading, error, refetch } = useDashboardStats()

  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false)
  
  // Add Client Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newClientName, setNewClientName] = useState("")
  const [newClientTokens, setNewClientTokens] = useState("100000")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Edit Client Modal State
  const [editClientName, setEditClientName] = useState("")
  const [editAlgoliaIndex, setEditAlgoliaIndex] = useState("")
  const [editCustomPromptId, setEditCustomPromptId] = useState("")
  const [rechargeAmount, setRechargeAmount] = useState("50000")

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center space-y-4">
        <SpinnerGap className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">جاري تحميل بيانات العملاء...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center space-y-4">
        <p className="text-sm font-semibold text-destructive">{error}</p>
      </div>
    )
  }

  // Get real data from the stats hook
  const clients = data?.topClients || []
  const totalTokensUsed = data?.totalTokensUsed || 0
  const totalBalance = data?.totalBalance || 0
  const totalIssued = totalTokensUsed + totalBalance

  // Calculate Monthly Client Growth
  const now = new Date()
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  let clientsThisMonth = 0
  let clientsLastMonth = 0

  clients.forEach(c => {
    if (!c.createdIso) return
    const d = new Date(c.createdIso)
    if (d >= startOfThisMonth) {
      clientsThisMonth++
    } else if (d >= startOfLastMonth && d < startOfThisMonth) {
      clientsLastMonth++
    }
  })

  // Growth is how many *new* clients we got this month compared to *new* clients last month
  // Or, total clients at the end of this month compared to total clients at the end of last month?
  // Usually it's based on total clients. Let's do total.
  const totalBeforeThisMonth = clients.length - clientsThisMonth
  let growthRate = 0
  if (totalBeforeThisMonth === 0) {
    growthRate = clientsThisMonth > 0 ? 100 : 0
  } else {
    growthRate = Math.round((clientsThisMonth / totalBeforeThisMonth) * 100)
  }
  const growthText = growthRate >= 0 ? `+${growthRate}%` : `${growthRate}%`

  const handleDeleteClient = async (apiKey: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العميل؟ لن يمكن استرجاع بياناته!")) return
    try {
      const workerBaseUrl = process.env.NEXT_PUBLIC_INTILAQA_ENGINE_URL ?? "https://intilaqa-ai.abo200004.workers.dev"
      const res = await fetch(`/api/worker/admin/clients`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey })
      })
      if (res.ok) {
        refetch() // Refresh stats
      } else {
        const errorData = await res.json().catch(() => ({}))
        alert(`فشل حذف العميل: ${errorData.error || res.statusText}`)
      }
    } catch (e: any) {
      alert(`خطأ في الشبكة: ${e.message}`)
    }
  }

  const handleExportCSV = () => {
    const headers = ["اسم العميل", "API Key", "التوكنز المستهلكة", "إجمالي التوكنز", "الحالة", "تاريخ الإنشاء"]
    const csvContent = [
      headers.join(","),
      ...clients.map(c => `${c.name},${c.apiKey},${c.used},${c.total},${c.status === "active" ? "نشط" : "مستنفد"},${c.createdAt || "غير متوفر"}`)
    ].join("\n")
    
    // Add BOM for Excel Arabic support
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `Intilaqa_Clients_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddClient = async () => {
    if (!newClientName) return
    setIsSubmitting(true)
    try {
      const workerBaseUrl = process.env.NEXT_PUBLIC_INTILAQA_ENGINE_URL ?? "https://intilaqa-ai.abo200004.workers.dev"
      const res = await fetch(`/api/worker/admin/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_name: newClientName, token_balance: parseInt(newClientTokens) })
      })
      if (res.ok) {
        setIsAddModalOpen(false)
        setNewClientName("")
        refetch() // Refresh stats
      } else {
        const errorData = await res.json().catch(() => ({}))
        alert(`فشل إضافة العميل: ${errorData.error || res.statusText}`)
      }
    } catch (e: any) {
      alert(`خطأ في الشبكة: ${e.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClient = async () => {
    if (!selectedClient) return
    setIsSubmitting(true)
    try {
      const workerBaseUrl = process.env.NEXT_PUBLIC_INTILAQA_ENGINE_URL ?? "https://intilaqa-ai.abo200004.workers.dev"
      const res = await fetch(`/api/worker/admin/clients`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          api_key: selectedClient.apiKey,
          company_name: editClientName,
          algolia_index_name: editAlgoliaIndex,
          custom_prompt_id: editCustomPromptId
        })
      })
      if (res.ok) {
        setIsEditModalOpen(false)
        refetch()
      } else {
        const errorData = await res.json().catch(() => ({}))
        alert(`فشل التعديل: ${errorData.error || res.statusText}`)
      }
    } catch (e: any) {
      alert(`خطأ في الشبكة: ${e.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRechargeClient = async () => {
    const addAmount = parseInt(rechargeAmount)
    if (!selectedClient || isNaN(addAmount) || addAmount <= 0) return
    setIsSubmitting(true)
    try {
      const workerBaseUrl = process.env.NEXT_PUBLIC_INTILAQA_ENGINE_URL ?? "https://intilaqa-ai.abo200004.workers.dev"
      const currentRemaining = Math.max(0, selectedClient.total - selectedClient.used)
      const newBalance = currentRemaining + addAmount
      const newTotal = selectedClient.total + addAmount

      const res = await fetch(`/api/worker/admin/clients`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          api_key: selectedClient.apiKey,
          token_balance: newBalance,
          total_quota: newTotal
        })
      })
      if (res.ok) {
        setIsRechargeModalOpen(false)
        setRechargeAmount("50000")
        refetch()
      } else {
        const errorData = await res.json().catch(() => ({}))
        alert(`فشل الشحن: ${errorData.error || res.statusText}`)
      }
    } catch (e: any) {
      alert(`خطأ في الشبكة: ${e.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <main className="flex-1 space-y-8 p-4 pt-6 md:p-8">
        {/* ─── Editorial hero ──────────────────────────── */}
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/55 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
              <Buildings className="h-3 w-3 text-primary" weight="fill" />
              <span>مستأجرون نشطون</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-success">{clients.length}/{clients.length} بصحّة ممتازة</span>
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-4xl">
              كل عميل يمتلك{" "}
              <span className="text-orange-gradient">محركاً مستقلاً</span>
              <br />
              يعمل خلف مفتاحه.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty md:text-[15px]">
              كل شركة تحصل على API Key مخصص، حصة توكنز مستقلة، وسجل استهلاك كامل.
              يمكنك الشحن أو التعديل لأي عميل مباشرة من هذه اللوحة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="rounded-full border-border/60 bg-white/55 text-xs font-semibold backdrop-blur hover:bg-white/80"
            >
              تصدير قائمة العملاء
              <ArrowLeft className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsAddModalOpen(true)}
              className="cta-orange rounded-full text-xs font-semibold"
            >
              <Plus className="h-3 w-3" weight="bold" />
              إضافة عميل جديد
            </Button>
          </div>
        </section>

        {/* ─── Stats row ─────────────────────────────────── */}
        <section className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          <StatCard
            label="إجمالي العملاء"
            value={clients.length.toString()}
            icon={UsersThree}
            tone="primary"
          />
          <StatCard
            label="إجمالي التوكنز المُصدرة"
            value={formatNumber(totalIssued)}
            icon={Coins}
            tone="primary"
          />
          <StatCard
            label="الرصيد المتبقي"
            value={formatNumber(totalBalance)}
            icon={Wallet}
            tone="primary"
          />
          <StatCard
            label="نمو شهري"
            value={growthText}
            icon={TrendUp}
            tone="primary"
          />
        </section>

        {/* ─── Clients table ─────────────────────────────── */}
        <div className="glass glass-highlight-top relative overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between gap-3 p-5 md:p-6">
            <div>
              <h3 className="text-base font-bold tracking-tight text-foreground">
                العملاء النشطون
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                استهلاك التوكنز وحالة الاشتراك لكل عميل
              </p>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success ring-1 ring-inset ring-success/25 md:inline-flex">
              <span className="pulse-dot !bg-success" />
              مزامنة لحظية
            </span>
          </div>
          <div className="hairline-orange mx-5 md:mx-6" />

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 bg-white/40 hover:bg-white/40">
                  <TableHead className="text-right font-semibold">
                    اسم العميل / الشركة
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    API Key
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    استهلاك التوكنز
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    الحالة
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    تاريخ الإنشاء
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    الإجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      لا يوجد عملاء حالياً
                    </TableCell>
                  </TableRow>
                ) : clients.map((c) => {
                  const percent = c.total > 0 ? Math.round((c.used / c.total) * 100) : 0
                  return (
                    <TableRow
                      key={c.apiKey}
                      className="border-border/30 transition-colors hover:bg-white/40"
                    >
                      <TableCell className="font-semibold text-foreground">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20">
                            {c.name.charAt(0)}
                          </div>
                          <span className="truncate">{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                          ...{c.apiKey.slice(-10)}
                        </code>
                      </TableCell>
                      <TableCell className="min-w-[220px]">
                        <div className="space-y-1.5">
                          <Progress
                            value={percent}
                            className={`h-1.5 bg-muted/60 ${
                              percent >= 90
                                ? "[&>div]:bg-destructive"
                                : "[&>div]:bg-primary"
                            }`}
                          />
                          <p className="text-[10px] text-muted-foreground tabular-nums">
                            {formatNumber(c.used)} / {formatNumber(c.total)} توكن
                            مستهلك
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {c.status === "active" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success ring-1 ring-inset ring-success/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            نشط
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive ring-1 ring-inset ring-destructive/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                            مستنفد
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.createdAt || "غير متوفر"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-border/60 bg-white/60 text-xs font-semibold backdrop-blur hover:bg-white"
                            onClick={() => {
                              setSelectedClient(c)
                              setIsRechargeModalOpen(true)
                            }}
                          >
                            <Coins className="ml-1.5 h-3.5 w-3.5" weight="fill" />
                            شحن طوارئ
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full text-xs font-semibold shadow-sm"
                            onClick={() => {
                              setSelectedClient(c)
                              setEditClientName(c.name || "")
                              setEditAlgoliaIndex(c.algoliaIndexName || "")
                              setEditCustomPromptId(c.customPromptId || "")
                              setIsEditModalOpen(true)
                            }}
                          >
                            <Gear className="ml-1.5 h-3.5 w-3.5" weight="fill" />
                            بيانات العميل
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteClient(c.apiKey)}
                          >
                            <Trash className="h-4 w-4" weight="bold" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* ─── Edit Client Details Modal ────────────────────── */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>إعدادات العميل</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="companyName">اسم العميل / الشركة</Label>
                <Input id="companyName" value={editClientName} onChange={e => setEditClientName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apiKey">مفتاح الربط (API Key)</Label>
                <Input id="apiKey" value={selectedClient.apiKey} readOnly className="bg-muted/50 font-mono text-left" dir="ltr" />
                <p className="text-[11px] text-muted-foreground">هذا المفتاح يستخدمه العميل للربط مع المنصة.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="algoliaIndex">فهرس البحث (Algolia Index)</Label>
                <Input id="algoliaIndex" value={editAlgoliaIndex} onChange={e => setEditAlgoliaIndex(e.target.value)} className="text-left" dir="ltr" />
                <p className="text-[11px] text-muted-foreground">الـ Index المخصص لبيانات جامعات هذا العميل.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customPromptId">معرف برومبت مخصص (Prompt ID)</Label>
                <Input id="customPromptId" value={editCustomPromptId} onChange={e => setEditCustomPromptId(e.target.value)} className="text-left font-mono text-xs" dir="ltr" placeholder="pmpt_..." />
                <p className="text-[11px] text-muted-foreground">اختياري: لتشغيل هذا العميل ببرومبت OpenAI مختلف عن العام.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>إلغاء</Button>
            <Button onClick={handleEditClient} disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {isSubmitting ? <SpinnerGap className="mr-2 h-4 w-4 animate-spin" /> : null}
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Emergency Recharge Modal ─────────────────────── */}
      <Dialog open={isRechargeModalOpen} onOpenChange={setIsRechargeModalOpen}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>شحن طوارئ (يدوي)</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="grid gap-4 py-4">
              <div className="rounded-lg bg-warning/10 p-3 text-sm text-warning-foreground">
                <strong className="block mb-1">تنبيه:</strong>
                هذا الخيار مخصص لحالات الطوارئ فقط. سيتم توفير بوابة الدفع الآلية لاحقاً للمستخدمين.
              </div>
              
              <div className="grid gap-2">
                <Label>العميل</Label>
                <Input value={selectedClient.name} readOnly className="bg-muted/50" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="rechargeAmount">كمية التوكنز المضافة</Label>
                <Input 
                  id="rechargeAmount" 
                  type="number" 
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="text-left" 
                  dir="ltr" 
                />
                <p className="text-[11px] text-muted-foreground">الرصيد المتبقي حالياً: {formatNumber(Math.max(0, selectedClient.total - selectedClient.used))} توكن</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRechargeModalOpen(false)}>إلغاء</Button>
            <Button 
              className="bg-warning text-warning-foreground hover:bg-warning/90"
              onClick={handleRechargeClient}
              disabled={isSubmitting || !rechargeAmount}
            >
              {isSubmitting ? (
                <>
                  <SpinnerGap className="mr-2 h-4 w-4 animate-spin" />
                  جاري الشحن...
                </>
              ) : (
                "تأكيد الشحن"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Add Client Modal ─────────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة عميل جديد</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newCompanyName">اسم العميل / الشركة</Label>
              <Input 
                id="newCompanyName" 
                value={newClientName} 
                onChange={(e) => setNewClientName(e.target.value)} 
                placeholder="أكاديمية النور مثلاً..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="initialTokens">رصيد التوكنز الافتتاحي</Label>
              <Input 
                id="initialTokens" 
                type="number" 
                value={newClientTokens} 
                onChange={(e) => setNewClientTokens(e.target.value)} 
                className="text-left" 
                dir="ltr"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>إلغاء</Button>
            <Button 
              onClick={handleAddClient} 
              disabled={isSubmitting || !newClientName}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <SpinnerGap className="mr-2 h-4 w-4 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                "إضافة العميل"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

