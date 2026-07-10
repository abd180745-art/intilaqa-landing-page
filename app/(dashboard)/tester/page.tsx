"use client"

import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { SpinnerGap, Monitor } from "@phosphor-icons/react/dist/ssr"
import { Suspense } from "react"

export default function TesterPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-8"><SpinnerGap className="h-8 w-8 animate-spin text-primary" /></div>}>
      <TesterContent />
    </Suspense>
  )
}

function TesterContent() {
  const { data, isLoading } = useDashboardStats()
  const apiKey = data?.topClients?.[0]?.apiKey ?? null

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center p-4 pt-6 md:p-8">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <SpinnerGap className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">جاري تحميل بيئة الاختبار...</p>
        </div>
      </main>
    )
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="utf-8">
      <title>Widget Tester Sandbox</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: system-ui, -apple-system, sans-serif; 
          background: #f8fafc; 
          margin: 0; 
          display: flex; 
          flex-direction: column;
          align-items: center; 
          justify-content: center; 
          height: 100vh; 
          color: #64748b;
        }
        .sandbox-watermark {
          text-align: center;
          padding: 2rem;
          border: 2px dashed #cbd5e1;
          border-radius: 1rem;
          background: #ffffff;
        }
      </style>
    </head>
    <body>
      <div class="sandbox-watermark">
        <h2 style="color: #334155; margin-bottom: 0.5rem;">هذه نافذة محاكاة حقيقية 100%</h2>
        <p>الودجت سيعمل في أسفل الشاشة تماماً كما يظهر في موقع العميل.</p>
        <p style="font-size: 13px; margin-top: 1rem;">(مفتاح API: ${apiKey ? apiKey.substring(0, 10) + '...' : 'غير متوفر'})</p>
      </div>
      
      <script>
        window.IntilaqaAIConfig = {
          engineUrl: "https://intilaqa-engine.abo200004.workers.dev/",
          licenseKey: "${apiKey}",
          agencyName: "بيئة الاختبار",
          botName: "المستشار التجريبي",
          botLogoUrl: "https://intilaqa-edu.com/wp-content/uploads/2025/12/intilaqa-footer.svg",
          welcomeMessage: "مرحباً، أنا المساعد الذكي",
          welcomeSubMessage: "هذه نافذة تجريبية لاختبار سرعة الاستجابة.",
          placeholder: "اكتب رسالتك هنا...",
          primaryColor: "#E69605",
          secondaryColor: "#1e3a5f",
          backgroundColor: "#1f2937"
        };
      </script>
      <script src="https://intilaqa-ai.abo200004.workers.dev/intilaqa-widget.js" defer></script>
    </body>
    </html>
  `;

  return (
    <main className="flex-1 space-y-6 p-4 pt-6 md:p-8 h-full flex flex-col">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Monitor className="h-6 w-6 text-primary" weight="duotone" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              نافذة التجريب الحية (Live Sandbox)
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            هذه الصفحة توفر بيئة معزولة لتجربة الودجت الحقيقي والتأكد من سرعة البث (Streaming) كما سيراه العميل.
          </p>
        </div>

      </section>

      <div className="min-h-[600px] w-full rounded-2xl overflow-hidden border border-border/60 shadow-inner bg-slate-50 relative mt-4">
        <iframe 
          srcDoc={htmlContent} 
          className="absolute inset-0 w-full h-full border-none"
          title="Widget Live Sandbox"
        />
      </div>
    </main>
  )
}
