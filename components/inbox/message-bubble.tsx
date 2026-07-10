import { useState } from "react"
import {
  ArrowBendUpLeft,
  Trash,
  Translate,
  BookmarkSimple,
  TrashSimple
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { ReadReceipt } from "./status"
import type { ChatMessage } from "./data"
import { MediaRenderer } from "./media-renderer"

export function MessageBubble({ 
  message, 
  onReply, 
  onDelete 
}: { 
  message: ChatMessage,
  onReply?: (msg: ChatMessage) => void,
  onDelete?: (msg: ChatMessage, forEveryone: boolean) => void
}) {
  const isOutgoing = message.direction === "outgoing"
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div
      className={cn(
        "group flex w-full items-end gap-2",
        isOutgoing ? "justify-start flex-row-reverse" : "justify-start",
      )}
    >
      <div className={cn("flex max-w-[78%] flex-col", isOutgoing && "items-start")}>
        <div
          className={cn(
            "relative rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ring-1 ring-inset transition-all duration-300",
            isOutgoing
              ? "rounded-bl-md bg-primary/[0.12] text-foreground ring-primary/20"
              : "rounded-br-md bg-card text-foreground ring-border/60",
          )}
        >
          {message.quoted && (
            <div
              className={cn(
                "mb-2 rounded-xl border-r-2 px-2.5 py-1.5 text-xs",
                isOutgoing
                  ? "border-primary/60 bg-primary/[0.08]"
                  : "border-primary/50 bg-muted/70",
              )}
            >
              <p className="font-semibold text-primary">{message.quoted.author}</p>
              <p className="truncate text-muted-foreground">{message.quoted.text}</p>
            </div>
          )}
          {message.mediaObj && (
            <div className="mb-2">
              <MediaRenderer 
                mediaObj={message.mediaObj} 
                apiKey="intilaqa-secret-key-1234" 
                baseUrl="http://localhost:8080" 
                instance={message.mediaObj._instance || ""} 
              />
            </div>
          )}
          {message.text && typeof message.text === 'string' && <p className="whitespace-pre-wrap break-words">{message.text}</p>}
          {message.text && typeof message.text !== 'string' && <p className="whitespace-pre-wrap break-words text-red-500">[{typeof message.text} data]</p>}
          <div className="mt-1 flex items-center justify-end gap-1">
            <span className="text-[10px] text-muted-foreground">{typeof message.time === 'string' ? message.time : ""}</span>
            {isOutgoing && message.receipt && <ReadReceipt status={message.receipt} />}
          </div>
        </div>
      </div>

      {/* Hover actions - glass popover */}
      <div
        className={cn(
          "flex items-center gap-0.5 rounded-full border border-border/60 bg-card/70 p-1 opacity-0 shadow-md backdrop-blur-md transition-all duration-300 group-hover:opacity-100",
        )}
      >
        <button
          type="button"
          aria-label="رد"
          title="رد"
          onClick={() => onReply && onReply(message)}
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
        >
          <ArrowBendUpLeft size={15} weight="bold" />
        </button>

        <button
          type="button"
          aria-label="ترجمة"
          title="ترجمة"
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
        >
          <Translate size={15} weight="bold" />
        </button>

        <button
          type="button"
          aria-label="إضافة للمعرفة"
          title="إضافة للمعرفة"
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
        >
          <BookmarkSimple size={15} weight="bold" />
        </button>
        
        {isOutgoing && (
          <div className="relative">
            <button
              type="button"
              aria-label="حذف"
              title="حذف"
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
            >
              <Trash size={15} weight="bold" />
            </button>
            
            {showDeleteConfirm && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 rounded-lg border border-border/60 bg-card shadow-lg p-1 z-50">
                <button
                  className="w-full text-right px-2 py-1.5 text-xs rounded hover:bg-muted text-red-500"
                  onClick={() => { setShowDeleteConfirm(false); onDelete && onDelete(message, true); }}
                >
                  حذف لدى الجميع
                </button>
                <button
                  className="w-full text-right px-2 py-1.5 text-xs rounded hover:bg-muted"
                  onClick={() => { setShowDeleteConfirm(false); onDelete && onDelete(message, false); }}
                >
                  حذف لدي
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
