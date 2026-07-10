import { ChatsCircle, Sparkle } from "@phosphor-icons/react"

export function ChatEmptyState() {
  return (
    <div className="chat-pattern flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="relative">
        <div className="flex size-24 items-center justify-center rounded-[2rem] border border-border/60 bg-card shadow-sm">
          <ChatsCircle size={44} weight="duotone" className="text-primary" />
        </div>
        <span className="absolute -left-2 -top-2 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <Sparkle size={16} weight="fill" />
        </span>
      </div>
      <h2 className="mt-6 text-xl font-bold tracking-tight text-foreground text-balance">
        مركز المحادثات
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
        اختر محادثة من القائمة على اليمين لبدء الرد على عملائك، أو دع الذكاء
        الاصطناعي يتولى المهمة نيابة عنك.
      </p>
      <p className="mt-6 rounded-full border border-border/60 bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
        حدّد محادثة للبدء
      </p>
    </div>
  )
}
