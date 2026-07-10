import React, { useState } from 'react';
import { Copy, CheckCircle, WarningCircle, Code, BracketsCurly, Books, TerminalWindow } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

interface ApiIntegrationTabProps {
  apiKey: string | null;
}

export function ApiIntegrationTab({ apiKey }: ApiIntegrationTabProps) {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'node' | 'sdk'>('curl');

  const endpointUrl = "https://intilaqa-engine.abo200004.workers.dev/";

  const snippets = {
    curl: `curl -X POST "${endpointUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "licenseKey": "${apiKey || 'YOUR_API_KEY'}",
    "message": "كيف يمكنني التسجيل؟"
  }'`,
    node: `const response = await fetch("${endpointUrl}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    licenseKey: "${apiKey || 'YOUR_API_KEY'}",
    message: "كيف يمكنني التسجيل؟"
  })
});

const data = await response.json();
console.log(data);`,
    sdk: `import { IntilaqaClient } from 'intilaqa-client-sdk';

const client = new IntilaqaClient({
  licenseKey: "${apiKey || 'YOUR_API_KEY'}"
});

// إرسال رسالة واستقبال الرد كتدفق (Streaming)
await client.sendMessageStream("كيف يمكنني التسجيل؟", (chunk) => {
  process.stdout.write(chunk); // طباعة كل كلمة فور وصولها
});`
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(type);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Overview & Key */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <BracketsCurly className="h-6 w-6 text-primary" weight="duotone" />
            بناء واجهات مخصصة باستخدام (REST API)
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            توفر واجهة برمجة التطبيقات (API) الخاصة بنا طريقة آمنة وسريعة لدمج الذكاء الاصطناعي في تطبيقاتك المخصصة. 
            بدلاً من استخدام الويدجت الجاهز، يمكنك بناء واجهتك الخاصة والتواصل مع خوادمنا لإرسال واستقبال الرسائل بمرونة تامة.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">المفتاح السري (License Key)</span>
            <code className="text-[14px] font-mono font-bold text-foreground bg-muted px-2.5 py-1 rounded-md border border-border/50 select-all">
              {apiKey || 'جاري تحميل المفتاح...'}
            </code>
          </div>
          <div className="h-10 w-[1px] bg-border" />
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleCopy(apiKey || '', 'key')}
            className="h-9 w-9 rounded-full"
            title="نسخ المفتاح"
          >
            {copiedSnippet === 'key' ? (
              <CheckCircle weight="fill" className="h-5 w-5 text-success" />
            ) : (
              <Copy weight="bold" className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Unified Code Viewer */}
        <div className="overflow-hidden rounded-3xl border border-border/80 bg-black shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <TerminalWindow className="h-4 w-4 text-zinc-400" />
              <span className="text-xs font-mono text-zinc-400">Terminal</span>
            </div>
            
            {/* Tabs */}
            <div className="flex rounded-lg bg-white/10 p-0.5">
              {(['curl', 'node', 'sdk'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCodeTab(tab)}
                  className={`rounded-md px-3 py-1 text-xs font-mono font-medium transition-all ${
                    activeCodeTab === tab
                      ? "bg-primary text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {tab === 'curl' ? 'cURL' : tab === 'node' ? 'Node.js' : 'Intilaqa SDK'}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(snippets[activeCodeTab], 'code')}
              className="h-7 gap-1.5 rounded-full px-3 text-[11px] font-semibold text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              {copiedSnippet === 'code' ? (
                <><CheckCircle weight="fill" className="h-3.5 w-3.5 text-success" /> تم النسخ</>
              ) : (
                <><Copy weight="bold" className="h-3.5 w-3.5" /> نسخ</>
              )}
            </Button>
          </div>

          {/* Code Body */}
          <div className="relative p-6 terminal-code-block" dir="ltr">
            <pre className="overflow-x-auto text-[13px] font-mono leading-relaxed text-zinc-300">
              <code>{snippets[activeCodeTab]}</code>
            </pre>
            
            {/* Syntax Highlight Fakes (just color coding for visual pop) */}
            <style dangerouslySetInnerHTML={{__html: `
              .terminal-code-block code { color: #e2e8f0; }
              .terminal-code-block code:contains("curl"), .terminal-code-block code:contains("fetch"), .terminal-code-block code:contains("const"), .terminal-code-block code:contains("await") { color: #cba6f7; }
              .terminal-code-block code:contains("POST"), .terminal-code-block code:contains("method"), .terminal-code-block code:contains("application/json") { color: #a6e3a1; }
              .terminal-code-block code:contains("https://") { color: #89b4fa; }
            `}} />
          </div>
        </div>

        {/* Sidebar Info Panels */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <h4 className="relative flex items-center gap-2 font-bold text-primary">
              <Books className="h-5 w-5" weight="duotone" />
              مكتبة المطورين (SDK)
            </h4>
            <p className="relative mt-3 text-[13px] leading-relaxed text-muted-foreground">
              لتسهيل بناء واجهتك، قمنا بإعداد مكتبة برمجية تدير حالة المحادثة تلقائياً (التحميل، إرسال الرسائل، حفظ الجلسة). 
              ننصح بشدة باستخدامها في بيئات Node.js أو React.
            </p>
            <Button className="relative mt-4 w-full rounded-full font-bold shadow-sm" size="sm">
              التوثيق الكامل
            </Button>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2 shrink-0">
                <WarningCircle className="h-6 w-6 text-primary" weight="fill" />
              </div>
              <div className="pt-0.5">
                <h4 className="font-bold text-foreground text-base">حماية المفتاح السري</h4>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground font-medium">
                  تأكد دائماً من إخفاء <code className="font-bold font-mono bg-muted px-1.5 py-0.5 rounded-md mx-0.5 text-foreground">License Key</code> الخاص بك في خوادمك الخلفية (Backend) ولا تقم بنشره في الـ Frontend لمنع سرقة رصيدك.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
