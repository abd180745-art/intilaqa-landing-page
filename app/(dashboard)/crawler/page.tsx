"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FloppyDisk, Play, Info } from "@phosphor-icons/react"
import { WORKER_BASE_URL } from "@/lib/agent-flow"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CrawlerPage() {
  const [urls, setUrls] = useState<string>("")
  const [lastStatus, setLastStatus] = useState<string>("لا يوجد بيانات سابقة للزحف.")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/worker/admin/settings`);
        if (!res.ok) throw new Error("Failed to load settings");
        const json = await res.json();
        const data = json.settings || {};
        
        if (data.crawler_urls) {
          try {
            const parsed = JSON.parse(data.crawler_urls);
            setUrls(Array.isArray(parsed) ? parsed.join("\n") : "");
          } catch (e) {
            setUrls(data.crawler_urls);
          }
        }
        
        if (data.crawler_status) {
          setLastStatus(data.crawler_status);
        }
      } catch (err) {
        console.error("Error loading crawler settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Split by newline and remove empty lines
      const urlArray = urls.split("\n").map(u => u.trim()).filter(u => u.length > 0);
      
      const payload = {
        crawler_urls: JSON.stringify(urlArray)
      };

      const res = await fetch(`/api/worker/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("فشل الحفظ");
      
      setMessage({ text: "تم حفظ الروابط بنجاح!", type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ text: "حدث خطأ أثناء الحفظ", type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:to-gray-300 mb-2">الزاحف الذكي (Smart Crawler)</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            أضف المواقع التي تريد سحب بياناتها. سيقوم السكربت الموجود على حاسوبك بقراءة هذه القائمة تلقائياً، جلب النصوص وتصفيتها باستخدام الذكاء الاصطناعي، ثم تحديث Pinecone لمنع التكرار.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all rounded-xl h-10 px-5"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>جاري الحفظ...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FloppyDisk className="w-5 h-5" weight="fill" />
                <span className="font-semibold">حفظ التعديلات</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-700 border border-green-500/20' : 'bg-red-500/10 text-red-700 border border-red-500/20'}`}>
          <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-bold text-foreground flex items-center gap-2">
                الروابط المستهدفة (Target URLs)
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-[200px] text-xs">أضف رابطاً واحداً في كل سطر. سيقوم الزاحف بزيارة هذه الروابط بالترتيب.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Textarea 
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://example1.com/majors&#10;https://example2.com/housing&#10;..."
              className="min-h-[300px] rounded-xl border-border/60 bg-white/50 dark:bg-zinc-950/50 resize-y font-mono text-sm"
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground mt-3">
              إجمالي الروابط الحالية: {urls.split("\n").filter(u => u.trim().length > 0).length}
            </p>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900/80 dark:to-zinc-900/40 border border-border/50 rounded-2xl p-6 shadow-sm">
            <Label className="text-base font-bold text-foreground mb-4 block">
              حالة آخر زحف (Status)
            </Label>
            <div className="bg-white/80 dark:bg-zinc-950/80 rounded-xl p-4 border border-border/40 min-h-[100px]">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {lastStatus}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border/50">
              <Label className="text-sm font-bold text-foreground mb-2 block">
                كيف أقوم بتشغيل الزاحف؟
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                هذه الواجهة مخصصة لإدارة الروابط فقط. عملية الزحف هي عملية ثقيلة وتتطلب موارد.
                لتشغيل الزاحف، افتح موجه الأوامر (Terminal) في مجلد المشروع وقم بتشغيل السكربت:
              </p>
              <code className="block bg-zinc-900 text-zinc-100 p-3 rounded-lg text-xs font-mono select-all">
                node scripts/crawler.js
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

