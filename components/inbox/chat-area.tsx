"use client"

import { Fragment, useState } from "react"
import { ArrowRight, Info, DotsThreeVertical, Phone } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Avatar } from "./avatar"
import { StatusPill } from "./status"
import { MessageBubble } from "./message-bubble"
import { MessageInput } from "./message-input"
import { CrmSidebar } from "./crm-sidebar"
import type { Contact } from "./data"

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl rounded-br-md bg-card px-4 py-3 shadow-sm ring-1 ring-inset ring-border/60">
      <span className="typing-dot size-2 rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
      <span className="typing-dot size-2 rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
      <span className="typing-dot size-2 rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
    </div>
  )
}

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="my-4 flex justify-center">
      <span className="rounded-full border border-border/60 bg-card/80 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur-md">
        {label}
      </span>
    </div>
  )
}

export function ChatArea({
  contact,
  onBack,
  onSendMessage,
  onAttachClick,
  isRecording,
  recordingTime,
  onRecordStart,
  onRecordStop,
  onLoadMore,
  hasMore,
  isLoadingMore,
  replyingTo,
  onReply,
  onCancelReply,
  onDeleteMessage
}: {
  contact: Contact
  onBack: () => void
  onSendMessage: (text: string) => void
  onAttachClick: () => void
  isRecording: boolean
  recordingTime: number
  onRecordStart: () => void
  onRecordStop: () => void
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
  replyingTo?: any
  onReply?: (msg: any) => void
  onCancelReply?: () => void
  onDeleteMessage?: (msg: any, forEveryone: boolean) => void
}) {
  const [showCrm, setShowCrm] = useState(false)

  return (
    <div className="flex h-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
      {showCrm && (
        <div className="hidden lg:block">
          <CrmSidebar contact={contact} onClose={() => setShowCrm(false)} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col relative">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-border/50 bg-card/80 px-4 py-3 backdrop-blur-xl">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="رجوع"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            >
              <ArrowRight size={18} weight="bold" />
            </button>
            <Avatar
              initials={contact.initials}
              tone={contact.tone}
              online={contact.online}
            />
            <div className="min-w-0">
              <p className="truncate font-bold text-foreground">{contact.name} ({contact.messages.length})</p>
              <div className="mt-0.5">
                <StatusPill status={contact.status} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="اتصال"
              className="hidden size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
            >
              <Phone size={18} weight="duotone" />
            </button>
            <button
              type="button"
              onClick={() => setShowCrm((s) => !s)}
              aria-label="بيانات العميل"
              className={cn(
                "flex size-9 items-center justify-center rounded-full transition-colors",
                showCrm
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Info size={19} weight="duotone" />
            </button>
            <button
              type="button"
              aria-label="خيارات"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <DotsThreeVertical size={20} weight="bold" />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="chat-pattern elegant-scroll flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-4 py-5">
          {hasMore && (
            <div className="flex justify-center my-4">
              <button
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="px-4 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoadingMore && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoadingMore ? "جاري التحميل..." : "تحميل الرسائل السابقة"}
              </button>
            </div>
          )}
          {contact.messages.map((message, index) => {
            const prev = contact.messages[index - 1]
            const showSeparator = !prev || prev.day !== message.day
            return (
              <Fragment key={message.id}>
                {showSeparator && <DateSeparator label={message.dayLabel} />}
                <div className="py-1">
                  <MessageBubble 
                    message={message} 
                    onReply={onReply}
                    onDelete={onDeleteMessage}
                  />
                </div>
              </Fragment>
            )
          })}
          {contact.status === "bot" && (
            <div className="flex justify-start py-1">
              <TypingIndicator />
            </div>
          )}
        </div>

        {/* Reply Preview Box */}
        {replyingTo && (
          <div className="absolute bottom-16 left-0 right-0 px-4 py-2 bg-card/95 backdrop-blur-sm border-t border-border/60 z-10 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <div className="flex-1 min-w-0 border-r-4 border-primary/70 pr-3 mr-1 opacity-80">
              <p className="text-xs font-bold text-primary mb-1">
                {replyingTo.direction === 'outgoing' ? 'أنت' : (contact.pushName || contact.name)}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {replyingTo.text || 'مرفق'}
              </p>
            </div>
            <button 
              onClick={onCancelReply}
              className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground shrink-0"
              title="إلغاء الرد"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input */}
        <div className={cn("transition-all duration-300", replyingTo ? "pt-12" : "")}>
          <MessageInput 
            onSend={onSendMessage}
            onAttachClick={onAttachClick}
            isRecording={isRecording}
            recordingTime={recordingTime}
            onRecordStart={onRecordStart}
            onRecordStop={onRecordStop}
          />
        </div>
      </div>
    </div>
  )
}
