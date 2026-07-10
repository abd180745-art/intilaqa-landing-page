"use client"

import { useState, useRef } from "react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { SpinnerGap, Robot, User, MagicWand, Plus, Trash } from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

type Message = {
  id: string
  direction: "in" | "out"
  text: string
}

export default function ExtensionTesterPage() {
  const { data, isLoading } = useDashboardStats()
  const apiKey = data?.topClients?.[0]?.apiKey ?? ""

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", direction: "in", text: "مرحبا، أريد الاستفسار عن دراسة الطب في تركيا" }
  ])
  const [newMessage, setNewMessage] = useState("")
  const [customCommand, setCustomCommand] = useState("")
  const [resultStream, setResultStream] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const addMessage = (direction: "in" | "out") => {
    if (!newMessage.trim()) return
    setMessages([...messages, { id: Date.now().toString(), direction, text: newMessage.trim() }])
    setNewMessage("")
  }

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(m => m.id !== id))
  }

  const handleAction = async (actionType: string, customInstruction = "") => {
    if (!apiKey) {
      alert("لا يوجد مفتاح API متاح. يرجى التأكد من لوحة التحكم.")
      return
    }

    // Stop any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setIsProcessing(true)
    setResultStream("")

    // Format history for the API
    const history = messages.map(m => ({
      role: m.direction === "in" ? "user" : "assistant",
      content: m.text
    }))
    
    // The last message is considered the 'active' message if actionType is analyze
    const activeMessage = history.length > 0 ? history[history.length - 1].content : ""

    try {
      const res = await fetch("https://intilaqa-engine.abo200004.workers.dev/api/extension-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-Key": apiKey
        },
        body: JSON.stringify({
          message: activeMessage,
          history: history,
          action_type: actionType,
          custom_instruction: customInstruction
        }),
        signal: abortControllerRef.current.signal
      })

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`)
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder("utf-8")

      if (reader) {
        let done = false
        while (!done) {
          const { value, done: readerDone } = await reader.read()
          done = readerDone
          if (value) {
            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n').filter(l => l.trim())
            for (const line of lines) {
              try {
                const parsed = JSON.parse(line)
                if (parsed.type === "chunk_delta" && parsed.content) {
                  setResultStream(prev => prev + parsed.content)
                }
                if (parsed.type === "error") {
                  const errMsg = parsed.message || parsed.content || "خطأ غير معروف";
                  setResultStream(prev => prev + "\n\n❌ " + errMsg)
                }
              } catch (e) {
                // Ignore parse errors for partial chunks
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setResultStream(prev => prev + "\n\n[حدث خطأ: " + err.message + "]")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <SpinnerGap className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="flex-1 space-y-6 p-4 pt-6 md:p-8 h-full flex flex-col max-w-6xl mx-auto">
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Robot className="h-6 w-6 text-primary" weight="duotone" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            أداة محاكاة المحادثات (Simulator)
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          محاكاة بيئة الواتساب. قم ببناء محادثة وهمية ثم اختبر كيف سيقوم عقل البوت باقتراح الردود أو التحليل للموظف.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[600px]">
        
        {/* Chat History Builder */}
        <div className="flex flex-col border border-border/60 rounded-xl bg-card overflow-hidden shadow-sm">
          <div className="bg-muted/50 p-3 border-b border-border/60 font-semibold text-sm flex items-center gap-2">
            <User className="h-4 w-4" /> محاكاة محادثة الواتساب
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#efeae2]">
            {messages.length === 0 && (
              <div className="text-center text-xs text-muted-foreground mt-10">
                لا توجد رسائل. أضف رسائل لبناء السياق.
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.direction === "in" ? "justify-start" : "justify-end"} group relative`}>
                <div className={`max-w-[80%] rounded-lg p-3 text-sm shadow-sm relative ${m.direction === "in" ? "bg-white text-slate-800" : "bg-[#d9fdd3] text-slate-800"}`}>
                  {m.text}
                  <button onClick={() => deleteMessage(m.id)} className="absolute -top-2 -left-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-white border-t border-border/60 flex flex-col gap-2">
            <Textarea 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              placeholder="اكتب رسالة جديدة لإضافتها للسياق..." 
              className="resize-none h-16 text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={() => addMessage("in")} variant="secondary" className="flex-1 h-8 text-xs">
                <Plus className="mr-1 h-3 w-3" /> كرسالة طالب (In)
              </Button>
              <Button onClick={() => addMessage("out")} variant="outline" className="flex-1 h-8 text-xs">
                <Plus className="mr-1 h-3 w-3" /> كرسالة موظف (Out)
              </Button>
            </div>
          </div>
        </div>

        {/* Extension Actions & Result */}
        <div className="flex flex-col gap-4">
          <div className="border border-border/60 rounded-xl bg-card p-4 shadow-sm flex flex-col gap-3">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
              <MagicWand className="h-4 w-4 text-primary" /> إجراءات الإكستنشن
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => handleAction("analyze")} disabled={isProcessing} className="w-full text-xs" variant="default">
                تحليل الرسالة الأخيرة
              </Button>
              <Button onClick={() => handleAction("suggest_response")} disabled={isProcessing} className="w-full text-xs" variant="secondary">
                اقتراح رد مناسب
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Input 
                value={customCommand} 
                onChange={(e) => setCustomCommand(e.target.value)} 
                placeholder="أمر مخصص (مثال: اشرح له بالتفصيل)" 
                className="flex-1 text-xs h-9"
              />
              <Button 
                onClick={() => handleAction("custom", customCommand)} 
                disabled={isProcessing || !customCommand.trim()} 
                className="h-9 text-xs whitespace-nowrap"
              >
                تنفيذ أمر مخصص
              </Button>
            </div>
          </div>

          <div className="flex-1 border border-border/60 rounded-xl bg-[#1e1e1e] overflow-hidden flex flex-col shadow-sm">
            <div className="bg-[#2d2d2d] p-2 border-b border-white/10 flex justify-between items-center">
              <span className="text-xs text-white/70 font-mono">Output Stream</span>
              {isProcessing && <SpinnerGap className="h-4 w-4 animate-spin text-amber-500" />}
            </div>
            <div className="flex-1 p-4 overflow-y-auto text-sm text-[#d4d4d4] font-mono whitespace-pre-wrap leading-relaxed">
              {resultStream || <span className="text-white/30 italic">في انتظار تنفيذ الإجراء...</span>}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
