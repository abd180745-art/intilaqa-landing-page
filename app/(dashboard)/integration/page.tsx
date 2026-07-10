"use client"

import { useState } from "react"
import { CodeBlock, Copy, CheckCircle, TerminalWindow, GlobeHemisphereWest, WarningCircle } from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"

export default function IntegrationPage() {
  const [copied, setCopied] = useState(false)
  
  // سنقوم لاحقاً بجلب هذا المفتاح من قاعدة البيانات (Supabase) للعميل المسجل حالياً
  const apiKey = "intq-lic-xxxxxxxxxxxxxxxxxxxx" 
  
  const embedCode = `<!-- كود الربط الخاص ببوت انطلاقة الذكي -->
<script>
  window.IntilaqaAIConfig = {
    licenseKey: "${apiKey}",
    primaryColor: "#E69605"
  };
</script>
<script src="https://cdn.intilaqa.ai/widget/intilaqa-widget.js" defer></script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="flex-1 space-y-8 p-4 pt-6 md:p-8">
      {/* ─── Hero Section ──────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-orange-600">
          <TerminalWindow className="h-8 w-8" weight="duotone" />
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            الربط البرمجي (Integration)
          </h2>
        </div>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          هنا تجد الكود الخاص بك لإضافة البوت إلى أي موقع مبرمج برمجياً (HTML/JS, React, PHP، وغيرها).
          كل ما عليك فعله هو نسخ الكود أدناه ووضعه في ترويسة موقعك.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* ─── Code Section ──────────────────────────── */}
        <div className="space-y-6">
          <div className="glass overflow-hidden rounded-2xl border border-border/50">
            <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CodeBlock className="h-4 w-4 text-primary" weight="bold" />
                كود التضمين (Embed Script)
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 gap-2 rounded-full text-xs font-semibold hover:bg-primary/10 hover:text-primary"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-success" weight="bold" />
                    <span className="text-success">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" weight="bold" />
                    نسخ الكود
                  </>
                )}
              </Button>
            </div>
            <div className="p-4" dir="ltr">
              <pre className="overflow-x-auto rounded-xl bg-[#0f172a] p-5 text-sm font-medium leading-relaxed text-slate-50">
                <code>{embedCode}</code>
              </pre>
            </div>
            <div className="bg-muted/20 px-5 py-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <WarningCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" weight="fill" />
                <p>
                  <strong className="text-foreground">تحذير أمني:</strong> هذا الكود يحتوي على المفتاح السري الخاص بك. يرجى عدم مشاركته مع أي شخص غير مصرح له، حيث يتم احتساب استهلاك التوكنز على هذا المفتاح.
                </p>
              </div>
            </div>
          </div>
          
          {/* ─── Instructions ──────────────────────────── */}
          <div className="space-y-4 rounded-2xl border border-border/50 bg-white/40 p-6 backdrop-blur">
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <GlobeHemisphereWest className="h-5 w-5 text-primary" weight="duotone" />
              طريقة التركيب
            </h3>
            <ol className="ms-5 list-decimal space-y-3 text-[15px] text-muted-foreground">
              <li>قم بنسخ الكود البرمجي من المربع المظلم في الأعلى.</li>
              <li>افتح ملفات موقعك (مثل <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">index.html</code> أو <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">header.php</code>).</li>
              <li>قم بلصق الكود قبل وسم الإغلاق <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground" dir="ltr">&lt;/head&gt;</code> أو <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground" dir="ltr">&lt;/body&gt;</code>.</li>
              <li>احفظ التعديلات، وسيظهر البوت فوراً في الزاوية السفلية لموقعك.</li>
            </ol>
          </div>
        </div>

        {/* ─── Sidebar info ──────────────────────────── */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <h4 className="font-bold text-primary">هل تستخدم ووردبريس؟</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              إذا كان موقعك يعمل بنظام ووردبريس، لست بحاجة لنسخ هذا الكود. يمكنك تحميل <strong className="text-foreground">إضافة انطلاقة ووردبريس</strong> ووضع مفتاح الربط (API Key) فقط داخل الإعدادات.
            </p>
            <Button variant="outline" className="mt-4 w-full rounded-full border-primary/20 bg-white font-semibold text-primary hover:bg-primary/10">
              تحميل إضافة ووردبريس
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
