"use client"

import { useEffect, useState, useCallback } from "react"
import {
  MagnifyingGlass, Database, ArrowsClockwise, Plus, Brain,
  DotsThree, CheckCircle, ArrowLeft, Sparkle, SpinnerGap,
  Warning, CaretDown, Trash, PencilSimple, X, BookOpenText, FileText,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

// ── Types ────────────────────────────────────────────────────────────────────
interface NsEntry { name: string; vectors: number }
interface VectorItem { id: string; metadata: Record<string, any> }
interface KnowledgeStats {
  pinecone: { namespacesCount: number | null; totalVectors: number | null; namespaceList: NsEntry[]; error: string | null }
  algolia: { indexCount: number; totalRecords: number; indexes: { name: string; entries: number }[]; error: string | null }
}

const WORKER = process.env.NEXT_PUBLIC_INTILAQA_ENGINE_URL ?? "https://intilaqa-engine.abo200004.workers.dev"
const fmt = (n: number | null | undefined) => n == null ? "—" : n.toLocaleString("ar-EG")

const categories = [
  { label: "الجامعات", count: 128, percent: 82 },
  { label: "التخصصات", count: 94, percent: 68 },
  { label: "المنح والقبول", count: 76, percent: 54 },
  { label: "المسارات المهنية", count: 42, percent: 31 },
]

// ── Edit Metadata Modal ──────────────────────────────────────────────────────
function EditModal({ vector, namespace, onClose, onSave }: {
  vector: VectorItem; namespace: string; onClose: () => void; onSave: () => void
}) {
  const [raw, setRaw] = useState(JSON.stringify(vector.metadata, null, 2))
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const save = async () => {
    setSaving(true); setErr(null)
    try {
      const metadata = JSON.parse(raw)
      const res = await fetch(`/api/worker/admin/pinecone/vectors`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: vector.id, metadata, namespace })
      })
      if (!res.ok) throw new Error((await res.json()).error ?? res.statusText)
      onSave()
    } catch (e: any) { setErr(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">تعديل الـ Metadata</h3>
            <code className="text-[11px] text-muted-foreground font-mono">{vector.id}</code>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <textarea
          value={raw}
          onChange={e => setRaw(e.target.value)}
          rows={12}
          className="w-full rounded-xl border border-border/60 bg-muted/30 p-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          dir="ltr"
          spellCheck={false}
        />
        {err && <p className="mt-2 text-xs text-destructive flex items-center gap-1"><Warning className="h-3.5 w-3.5" />{err}</p>}
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={onClose}>إلغاء</Button>
          <Button size="sm" className="cta-orange rounded-full" onClick={save} disabled={saving}>
            {saving ? <SpinnerGap className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
            حفظ التعديلات
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Vectors Table ────────────────────────────────────────────────────────────
function VectorsTable({ initialNamespace, namespaceList }: { initialNamespace: string; namespaceList: NsEntry[] }) {
  const [activeNs, setActiveNs] = useState<string>(initialNamespace)
  const [nsDropOpen, setNsDropOpen] = useState(false)
  const [vectors, setVectors] = useState<VectorItem[]>([])
  const [loading, setLoading] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [editTarget, setEditTarget] = useState<VectorItem | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  // When initialNamespace changes from parent (after stats load), sync once
  useEffect(() => { if (initialNamespace && activeNs === "") setActiveNs(initialNamespace) }, [initialNamespace])

  const loadSingle = useCallback(async (ns: string, cursor?: string) => {
    let url = `/api/worker/admin/pinecone/vectors?namespace=${encodeURIComponent(ns)}&limit=50`
    if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`
    const res = await fetch(url)
    return res.json()
  }, [])

  const load = useCallback(async (cursor?: string) => {
    setLoading(true)
    try {
      if (activeNs === "__all__") {
        // Load from every namespace and merge
        const results = await Promise.allSettled(
          namespaceList.map(ns => loadSingle(ns.name))
        )
        const merged: VectorItem[] = []
        results.forEach((r, i) => {
          if (r.status === "fulfilled") {
            ;(r.value.vectors ?? []).forEach((v: VectorItem) =>
              merged.push({ ...v, metadata: { ...v.metadata, _ns: namespaceList[i].name } })
            )
          }
        })
        setVectors(merged)
        setNextCursor(null)
      } else {
        const data = await loadSingle(activeNs, cursor)
        setVectors(prev => cursor ? [...prev, ...(data.vectors ?? [])] : (data.vectors ?? []))
        setNextCursor(data.nextCursor ?? null)
      }
    } catch {}
    finally { setLoading(false) }
  }, [activeNs, namespaceList, loadSingle])

  useEffect(() => { setVectors([]); setNextCursor(null); load() }, [load])

  const handleDelete = async (id: string) => {
    if (!confirm(`حذف Vector: ${id}؟`)) return
    setDeleting(id)
    try {
      const ns = activeNs === "__all__"
        ? (vectors.find(v => v.id === id)?.metadata?._ns ?? "")
        : activeNs
      await fetch(`/api/worker/admin/pinecone/vectors`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id], namespace: ns })
      })
      setVectors(prev => prev.filter(v => v.id !== id))
    } catch {}
    finally { setDeleting(null) }
  }

  const filtered = search
    ? vectors.filter(v => v.id.toLowerCase().includes(search.toLowerCase()) ||
        JSON.stringify(v.metadata).toLowerCase().includes(search.toLowerCase()))
    : vectors

  const topMeta = (m: Record<string, any>) => {
    const keys = Object.keys(m).filter(k => k !== "_ns").slice(0, 2)
    return keys.map(k => `${k}: ${String(m[k]).slice(0, 30)}`).join(" · ")
  }

  return (
    <>
      {editTarget && (
        <EditModal
          vector={editTarget}
          namespace={activeNs === "__all__" ? (editTarget.metadata?._ns ?? "") : activeNs}
          onClose={() => setEditTarget(null)}
          onSave={() => { setEditTarget(null); load() }}
        />
      )}

      <div className="glass glass-highlight-top relative col-span-12 overflow-hidden rounded-3xl lg:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Vectors</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {filtered.length} vector{nextCursor ? "+" : ""} · انقر للتعديل أو الحذف
              </p>
            </div>
            {/* Namespace selector inside table */}
            {namespaceList.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setNsDropOpen(v => !v)}
                  className="flex items-center gap-1.5 rounded-full border border-border/60 bg-white/70 px-3 py-1.5 text-[11px] font-semibold backdrop-blur hover:bg-white transition-colors"
                >
                  <code className="max-w-[100px] truncate font-mono">
                    {activeNs === "__all__" ? "الكل" : activeNs || "(default)"}
                  </code>
                  <CaretDown className="h-3 w-3 shrink-0 text-muted-foreground" weight="bold" />
                </button>
                {nsDropOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[210px] overflow-hidden rounded-2xl border border-border/60 bg-white/95 shadow-lg backdrop-blur">
                    <button
                      onClick={() => { setActiveNs("__all__"); setNsDropOpen(false) }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-right text-xs hover:bg-primary/5 transition-colors ${
                        activeNs === "__all__" ? "font-semibold text-primary" : "text-foreground"
                      }`}
                    >
                      <span>🌐 جميع الـ Namespaces</span>
                    </button>
                    <div className="h-px bg-border/40 mx-3" />
                    {namespaceList.map(ns => (
                      <button
                        key={ns.name}
                        onClick={() => { setActiveNs(ns.name); setNsDropOpen(false) }}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-right text-xs hover:bg-primary/5 transition-colors ${
                          activeNs === ns.name ? "font-semibold text-primary" : "text-foreground"
                        }`}
                      >
                        <code className="font-mono truncate max-w-[130px]">{ns.name || "(default)"}</code>
                        <span className="text-muted-foreground font-mono">{fmt(ns.vectors)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <MagnifyingGlass className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث بالـ ID أو المحتوى..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-52 rounded-full border-border/60 bg-white/60 pr-9 text-xs backdrop-blur focus-visible:ring-primary/30"
            />
          </div>
        </div>
        <div className="hairline-orange mx-5 md:mx-6" />

        {loading && !vectors.length ? (
          <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground text-sm">
            <SpinnerGap className="h-5 w-5 animate-spin text-primary" /> جاري تحميل الـ Vectors...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-sm gap-2">
            <Database className="h-8 w-8 opacity-30" weight="duotone" />
            <span>لا توجد نتائج</span>
          </div>
        ) : (
          <ul className="divide-y divide-border/30">
            {filtered.map(v => (
              <li key={v.id} className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/40 md:px-6">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                  <Database className="h-4 w-4" weight="duotone" />
                </div>
                <div className="min-w-0 flex-1">
                  <code className="block truncate text-xs font-semibold text-foreground" dir="ltr">{v.id}</code>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{topMeta(v.metadata) || "لا توجد بيانات إضافية"}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
                    onClick={() => setEditTarget(v)}>
                    <PencilSimple className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(v.id)} disabled={deleting === v.id}>
                    {deleting === v.id ? <SpinnerGap className="h-3.5 w-3.5 animate-spin" /> : <Trash className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-border/30 bg-white/30 px-5 py-3 md:px-6">
          <p className="text-[11px] text-muted-foreground">
            {loading ? "جاري التحميل..." : `يُعرض ${filtered.length} vector`}
          </p>
          {nextCursor && (
            <Button variant="ghost" size="sm" onClick={() => load(nextCursor)} disabled={loading}
              className="h-7 rounded-full text-xs font-semibold text-primary hover:bg-primary/10">
              تحميل المزيد <ArrowLeft className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function KnowledgePage() {
  const [stats, setStats] = useState<KnowledgeStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNs, setSelectedNs] = useState<string>("__all__")
  const [nsDropdownOpen, setNsDropdownOpen] = useState(false)

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/worker/admin/knowledge-stats`)
      const data = await res.json()
      setStats(data)
      // Auto-select first namespace for vectors table
      if (data.pinecone?.namespaceList?.length > 0 && selectedNs === "__all__") {
        setSelectedNs(data.pinecone.namespaceList[0].name)
      }
    } catch {}
    finally { setIsLoading(false) }
  }

  useEffect(() => { fetchStats() }, [])

  const namespaceList: NsEntry[] = stats?.pinecone?.namespaceList ?? []
  const displayedVectors = selectedNs === "__all__"
    ? stats?.pinecone?.totalVectors
    : namespaceList.find(n => n.name === selectedNs)?.vectors ?? null

  return (
    <>
      <main className="flex-1 space-y-8 p-4 pt-6 md:p-8">
        {/* Hero */}
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/55 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
              <Brain className="h-3 w-3 text-primary" weight="fill" />
              <span className="font-mono">pinecone · algolia</span>
              <span className="text-muted-foreground">·</span>
              <span className={stats && !stats?.pinecone?.error ? "text-success" : "text-muted-foreground"}>
                {isLoading ? "جاري الفحص..." : stats && !stats?.pinecone?.error ? "متصل" : "خطأ"}
              </span>
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              قواعد المعرفة{" "}
              <span className="text-orange-gradient">الحقيقية</span>
              <br />
              لعقل الوكيل.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchStats}
              className="rounded-full border-border/60 bg-white/55 text-xs font-semibold backdrop-blur hover:bg-white/80">
              <ArrowsClockwise className="h-3 w-3" weight="bold" /> تحديث
            </Button>
          </div>
        </section>

        {/* Pinecone + Algolia Stats */}
        <section className="grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-2">
          {/* Pinecone */}
          <div className="glass glass-highlight-top relative overflow-hidden rounded-3xl p-5 md:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl silver-surface text-primary ring-1 ring-inset ring-white/60 shadow-sm">
                  <Database className="h-5 w-5" weight="duotone" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Pinecone</h3>
                  <p className="text-[11px] text-muted-foreground font-mono">Vector Database · RAG</p>
                </div>
              </div>
              {!isLoading && namespaceList.length > 0 && (
                <div className="relative">
                  <button onClick={() => setNsDropdownOpen(v => !v)}
                    className="flex items-center gap-1.5 rounded-full border border-border/60 bg-white/70 px-3 py-1.5 text-[11px] font-semibold backdrop-blur hover:bg-white transition-colors">
                    <span className="max-w-[100px] truncate">{selectedNs === "__all__" ? "الكل" : selectedNs}</span>
                    <CaretDown className="h-3 w-3 shrink-0 text-muted-foreground" weight="bold" />
                  </button>
                  {nsDropdownOpen && (
                    <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[200px] overflow-hidden rounded-2xl border border-border/60 bg-white/95 shadow-lg backdrop-blur">
                      <button onClick={() => { setSelectedNs("__all__"); setNsDropdownOpen(false) }}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-right text-xs hover:bg-primary/5 ${selectedNs === "__all__" ? "font-semibold text-primary" : "text-foreground"}`}>
                        <span>جميع الـ Namespaces</span>
                        <span className="font-mono text-muted-foreground">{fmt(stats?.pinecone?.totalVectors)}</span>
                      </button>
                      <div className="h-px bg-border/40 mx-3" />
                      {namespaceList.map(ns => (
                        <button key={ns.name} onClick={() => { setSelectedNs(ns.name); setNsDropdownOpen(false) }}
                          className={`flex w-full items-center justify-between px-4 py-2.5 text-right text-xs hover:bg-primary/5 ${selectedNs === ns.name ? "font-semibold text-primary" : "text-foreground"}`}>
                          <span className="font-mono truncate max-w-[130px]">{ns.name}</span>
                          <span className="font-mono text-muted-foreground">{fmt(ns.vectors)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="hairline-orange" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-muted-foreground">Namespaces</p>
                {isLoading ? <SpinnerGap className="mt-1 h-5 w-5 animate-spin text-primary" />
                  : <p className="mt-0.5 text-3xl font-bold tabular-nums">{fmt(stats?.pinecone?.namespacesCount)}</p>}
                <p className="text-[10px] text-muted-foreground mt-1">مساحة اسمية</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">{selectedNs === "__all__" ? "إجمالي المتجهات" : selectedNs}</p>
                {isLoading ? <SpinnerGap className="mt-1 h-5 w-5 animate-spin text-primary" />
                  : <p className="mt-0.5 text-3xl font-bold tabular-nums">
                      {displayedVectors != null
                        ? displayedVectors >= 1000 ? (displayedVectors / 1000).toFixed(1) + "K" : displayedVectors
                        : "—"}
                    </p>}
                <p className="text-[10px] text-muted-foreground mt-1">vector مُخزَّن</p>
              </div>
            </div>
            {!isLoading && namespaceList.length > 0 && (
              <div className="mt-4 border-t border-border/30 pt-3 space-y-2.5">
                {namespaceList.map(ns => {
                  const total = stats?.pinecone?.totalVectors ?? 1
                  const pct = total > 0 ? Math.round((ns.vectors / total) * 100) : 0
                  return (
                    <button key={ns.name} onClick={() => setSelectedNs(ns.name === selectedNs ? "__all__" : ns.name)}
                      className={`w-full text-right transition-opacity ${selectedNs !== "__all__" && selectedNs !== ns.name ? "opacity-40" : "opacity-100"}`}>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <code className={`font-mono truncate max-w-[120px] ${selectedNs === ns.name ? "text-primary font-semibold" : "text-muted-foreground"}`}>{ns.name}</code>
                        <span className="tabular-nums font-semibold">{fmt(ns.vectors)}</span>
                      </div>
                      <Progress value={pct} className="h-1 bg-muted/60 [&>div]:bg-primary" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Algolia */}
          <div className="glass glass-highlight-top relative overflow-hidden rounded-3xl p-5 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl silver-surface text-primary ring-1 ring-inset ring-white/60 shadow-sm">
                <MagnifyingGlass className="h-5 w-5" weight="duotone" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Algolia</h3>
                <p className="text-[11px] text-muted-foreground font-mono">Search Engine · Universities</p>
              </div>
            </div>
            <div className="hairline-orange" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-muted-foreground">الفهارس</p>
                {isLoading ? <SpinnerGap className="mt-1 h-5 w-5 animate-spin text-primary" />
                  : <p className="mt-0.5 text-3xl font-bold tabular-nums">{fmt(stats?.algolia?.indexCount)}</p>}
                <p className="text-[10px] text-muted-foreground mt-1">Index نشط</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">إجمالي السجلات</p>
                {isLoading ? <SpinnerGap className="mt-1 h-5 w-5 animate-spin text-primary" />
                  : <p className="mt-0.5 text-3xl font-bold tabular-nums">{fmt(stats?.algolia?.totalRecords)}</p>}
                <p className="text-[10px] text-muted-foreground mt-1">سجل مُفهرَس</p>
              </div>
            </div>
            {!isLoading && (stats?.algolia?.indexes ?? []).length > 0 && (
              <div className="mt-4 border-t border-border/30 pt-3 space-y-2">
                {(stats?.algolia?.indexes ?? []).map(idx => (
                  <div key={idx.name} className="flex items-center justify-between text-[11px]">
                    <code className="font-mono text-muted-foreground truncate max-w-[140px]">{idx.name}</code>
                    <span className="tabular-nums font-semibold">{fmt(idx.entries)} سجل</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Vectors Browser + Side */}
        <section className="grid grid-cols-12 gap-4 md:gap-5">
          {/* Vectors Table - now with its own namespace selector */}
          <VectorsTable
            initialNamespace={namespaceList[0]?.name ?? ""}
            namespaceList={namespaceList}
          />

          {/* Side */}
          <div className="col-span-12 flex flex-col gap-4 md:gap-5 lg:col-span-4">
            <div className="glass glass-highlight-top relative overflow-hidden rounded-3xl p-5 md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl silver-surface text-primary ring-1 ring-inset ring-white/60 shadow-sm">
                  <Sparkle className="h-4 w-4" weight="fill" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-foreground">تغطية المعرفة</h3>
                  <p className="text-[11px] text-muted-foreground">حسب التصنيف الدلالي</p>
                </div>
              </div>
              <ul className="mt-5 space-y-4">
                {categories.map(cat => (
                  <li key={cat.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold">{cat.label}</span>
                      <span className="font-mono tabular-nums text-muted-foreground">{fmt(cat.count)}</span>
                    </div>
                    <Progress value={cat.percent} className="h-1 bg-muted/60 [&>div]:bg-primary" />
                  </li>
                ))}
              </ul>
            </div>
            <UploadPanel namespaceList={namespaceList} algoliaIndexes={stats?.algolia?.indexes ?? []} onDone={fetchStats} />
          </div>
        </section>
      </main>
    </>
  )
}

// ── Upload Panel ─────────────────────────────────────────────────────────────
function UploadPanel({ namespaceList, algoliaIndexes, onDone }: {
  namespaceList: NsEntry[]
  algoliaIndexes: { name: string; entries: number }[]
  onDone: () => void
}) {
  const [mode, setMode] = useState<"algolia" | "pinecone">("algolia")

  // Algolia state
  const [algIndex, setAlgIndex] = useState("")
  const [algFile, setAlgFile] = useState<File | null>(null)
  const [algJson, setAlgJson] = useState("")
  const [algLoading, setAlgLoading] = useState(false)
  const [algMsg, setAlgMsg] = useState<{ ok: boolean; text: string } | null>(null)

  // Pinecone state
  const [pcNs, setPcNs] = useState(namespaceList[0]?.name ?? "")
  const [pcJson, setPcJson] = useState(`[
  {
    "id": "vec-001",
    "values": [0.1, 0.2, 0.3],
    "metadata": { "text": "محتوى المتجه هنا" }
  }
]`)
  const [pcLoading, setPcLoading] = useState(false)
  const [pcMsg, setPcMsg] = useState<{ ok: boolean; text: string } | null>(null)

  // File → JSON text
  const handleAlgFile = (f: File | null) => {
    setAlgFile(f)
    if (!f) return
    const reader = new FileReader()
    reader.onload = e => setAlgJson(e.target?.result as string ?? "")
    reader.readAsText(f)
  }

  const submitAlgolia = async () => {
    setAlgLoading(true); setAlgMsg(null)
    try {
      const records = JSON.parse(algJson)
      if (!Array.isArray(records)) throw new Error("الملف يجب أن يحتوي على مصفوفة JSON")
      const res = await fetch(`/api/worker/admin/algolia/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ indexName: algIndex || undefined, records })
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error ?? res.statusText)
      setAlgMsg({ ok: true, text: `✅ تم رفع ${records.length} سجل بنجاح` })
      onDone()
    } catch (e: any) { setAlgMsg({ ok: false, text: e.message }) }
    finally { setAlgLoading(false) }
  }

  const submitPinecone = async () => {
    setPcLoading(true); setPcMsg(null)
    try {
      const vectors = JSON.parse(pcJson)
      if (!Array.isArray(vectors)) throw new Error("يجب أن يكون المحتوى مصفوفة JSON")
      const res = await fetch(`/api/worker/admin/pinecone/upsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vectors, namespace: pcNs })
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error ?? res.statusText)
      setPcMsg({ ok: true, text: `✅ تم رفع ${vectors.length} vector بنجاح` })
      onDone()
    } catch (e: any) { setPcMsg({ ok: false, text: e.message }) }
    finally { setPcLoading(false) }
  }

  const [algDropOpen, setAlgDropOpen] = useState(false)
  const [pcNsDropOpen, setPcNsDropOpen] = useState(false)

  return (
    <div className="glass glass-highlight-top relative overflow-hidden rounded-3xl p-5 md:p-6">
      {/* Toggle tabs — no emojis, icon only */}
      <div className="flex items-center gap-1 rounded-2xl bg-muted/40 p-1 mb-5">
        {(["algolia", "pinecone"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${
              mode === m
                ? "bg-white shadow-sm text-primary ring-1 ring-border/40"
                : "text-muted-foreground hover:text-foreground"
            }`}>
            {m === "algolia"
              ? <><MagnifyingGlass className="h-3.5 w-3.5" weight="bold" /> Algolia</>
              : <><Database className="h-3.5 w-3.5" weight="bold" /> Pinecone</>}
          </button>
        ))}
      </div>

      {/* ── Algolia form ── */}
      {mode === "algolia" && (
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-foreground mb-1 block">اسم الـ Index</label>
            {algoliaIndexes.length > 0 ? (
              <div className="relative">
                <button type="button" onClick={() => setAlgDropOpen(v => !v)}
                  className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2 text-xs hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <span className={algIndex ? "text-foreground" : "text-muted-foreground"}>
                    {algIndex ? algIndex : "اختر Index..."}
                  </span>
                  <CaretDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" weight="bold" />
                </button>
                {algDropOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-lg">
                    {algoliaIndexes.map(i => (
                      <button key={i.name} type="button"
                        onClick={() => { setAlgIndex(i.name); setAlgDropOpen(false) }}
                        className={`flex w-full items-center justify-between px-3 py-2.5 text-right text-xs hover:bg-primary/5 transition-colors ${algIndex === i.name ? "font-semibold text-primary" : "text-foreground"}`}>
                        <span className="font-mono">{i.name}</span>
                        <span className="text-muted-foreground">{i.entries?.toLocaleString("ar-EG")} سجل</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Input value={algIndex} onChange={e => setAlgIndex(e.target.value)}
                placeholder="universities_ar" dir="ltr"
                className="rounded-xl border-border/60 bg-white/70 text-xs" />
            )}
          </div>

          {/* File upload */}
          <div>
            <label className="text-[11px] font-semibold text-foreground mb-1 block">رفع ملف JSON</label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border/60 bg-white/50 px-3 py-3 text-xs text-muted-foreground hover:bg-white/80 transition-colors">
              <FileText className="h-4 w-4 shrink-0" weight="duotone" />
              <span className="truncate">{algFile ? algFile.name : "اضغط لاختيار ملف .json"}</span>
              <input type="file" accept=".json" className="hidden"
                onChange={e => handleAlgFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>

          {/* Or paste JSON */}
          <div>
            <label className="text-[11px] font-semibold text-foreground mb-1 block">أو الصق JSON مباشرة</label>
            <textarea value={algJson} onChange={e => setAlgJson(e.target.value)}
              rows={5} dir="ltr" placeholder='[{"objectID":"1","name":"جامعة دمشق",...}]'
              className="w-full rounded-xl border border-border/60 bg-white/70 p-2.5 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>

          {algMsg && <p className={`text-[11px] ${algMsg.ok ? "text-success" : "text-destructive"}`}>{algMsg.text}</p>}

          <Button onClick={submitAlgolia} disabled={algLoading || !algJson.trim()}
            className="cta-orange w-full rounded-full text-xs font-semibold">
            {algLoading ? <SpinnerGap className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            رفع إلى Algolia
          </Button>
        </div>
      )}

      {/* ── Pinecone form ── */}
      {mode === "pinecone" && (
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-foreground mb-1 block">Namespace</label>
            {namespaceList.length > 0 ? (
              <div className="relative">
                <button type="button" onClick={() => setPcNsDropOpen(v => !v)}
                  className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2 text-xs hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <span className={pcNs ? "font-mono text-foreground" : "text-muted-foreground"}>
                    {pcNs || "(default)"}
                  </span>
                  <CaretDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" weight="bold" />
                </button>
                {pcNsDropOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-lg">
                    <button type="button" onClick={() => { setPcNs(""); setPcNsDropOpen(false) }}
                      className={`flex w-full items-center justify-between px-3 py-2.5 text-right text-xs hover:bg-primary/5 transition-colors ${!pcNs ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                      <span>(default)</span>
                    </button>
                    {namespaceList.map(ns => (
                      <button key={ns.name} type="button"
                        onClick={() => { setPcNs(ns.name); setPcNsDropOpen(false) }}
                        className={`flex w-full items-center justify-between px-3 py-2.5 text-right text-xs hover:bg-primary/5 transition-colors ${pcNs === ns.name ? "font-semibold text-primary" : "text-foreground"}`}>
                        <span className="font-mono">{ns.name}</span>
                        <span className="text-muted-foreground">{ns.vectors?.toLocaleString("ar-EG")} vector</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Input value={pcNs} onChange={e => setPcNs(e.target.value)}
                placeholder="universities" dir="ltr"
                className="rounded-xl border-border/60 bg-white/70 text-xs" />
            )}
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground mb-1 block">Vectors JSON</label>
            <p className="text-[10px] text-muted-foreground mb-1.5">
              مصفوفة تحتوي: <code dir="ltr" className="font-mono">id</code>، <code dir="ltr" className="font-mono">values</code>، و <code dir="ltr" className="font-mono">metadata</code> (اختياري)
            </p>
            <textarea value={pcJson} onChange={e => setPcJson(e.target.value)}
              rows={7} dir="ltr"
              className="w-full rounded-xl border border-border/60 bg-white/70 p-2.5 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>

          {pcMsg && <p className={`text-[11px] ${pcMsg.ok ? "text-success" : "text-destructive"}`}>{pcMsg.text}</p>}

          <Button onClick={submitPinecone} disabled={pcLoading || !pcJson.trim()}
            className="cta-orange w-full rounded-full text-xs font-semibold">
            {pcLoading ? <SpinnerGap className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            رفع إلى Pinecone
          </Button>
        </div>
      )}
    </div>
  )
}


