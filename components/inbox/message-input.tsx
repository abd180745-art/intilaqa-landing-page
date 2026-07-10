"use client"

import { useState } from "react"
import {
  Sparkle,
  NotePencil,
  MagicWand,
  Robot,
  Paperclip,
  Microphone,
  PaperPlaneRight,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const aiActions = [
  { icon: Sparkle, label: "اقتراح رد" },
  { icon: NotePencil, label: "تلخيص" },
  { icon: MagicWand, label: "تحسين الصياغة" },
  { icon: Robot, label: "تفويض للبوت" },
]

interface MessageInputProps {
  onSend: (text: string) => void
  onAttachClick: () => void
  isRecording: boolean
  recordingTime: number
  onRecordStart: () => void
  onRecordStop: () => void
}

export function MessageInput({ onSend, onAttachClick, isRecording, recordingTime, onRecordStart, onRecordStop }: MessageInputProps) {
  const [value, setValue] = useState("")

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      e.keyCode !== 229
    ) {
      e.preventDefault()
      if (value.trim()) {
        onSend(value.trim())
        setValue("")
      }
    }
  }

  return (
    <div className="border-t border-border/50 bg-card/70 p-3 backdrop-blur-xl sm:p-4">
      {/* AI toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {aiActions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-all duration-300 hover:scale-[1.03] hover:border-primary/40 hover:bg-primary/[0.07] hover:text-primary"
          >
            <action.icon size={15} weight="duotone" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-background/60 p-2 transition-all duration-300 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15">
        <button
          type="button"
          onClick={onAttachClick}
          aria-label="إرفاق ملف"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Paperclip size={19} />
        </button>
        <textarea
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب رسالتك هنا..."
          className="elegant-scroll max-h-32 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none"
        />
        <button
          type="button"
          aria-label="تسجيل رسالة صوتية"
          onClick={isRecording ? onRecordStop : onRecordStart}
          className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-muted", isRecording ? "text-red-500 animate-pulse bg-red-50" : "text-muted-foreground hover:text-foreground")}
        >
          {isRecording ? <span className="text-xs font-bold mr-1">{Math.floor(recordingTime/60)}:{(recordingTime%60).toString().padStart(2,'0')}</span> : null}
          <Microphone size={19} />
        </button>
        <button
          type="button"
          aria-label="إرسال"
          onClick={() => {
            if (value.trim()) {
              onSend(value.trim())
              setValue("")
            }
          }}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all duration-300 hover:scale-[1.05] hover:brightness-105"
        >
          <PaperPlaneRight size={18} weight="fill" className="-scale-x-100" />
        </button>
      </div>
    </div>
  )
}
