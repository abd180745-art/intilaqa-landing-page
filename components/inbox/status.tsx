import { Checks, Check, Robot, User, Clock } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import type { ChannelStatus, ReceiptStatus } from "./data"

export function ReadReceipt({ status }: { status: ReceiptStatus }) {
  if (status === "sent") {
    return <Check size={15} className="text-zinc-400 dark:text-zinc-500" weight="bold" />
  }
  if (status === "delivered") {
    return <Checks size={15} className="text-zinc-400 dark:text-zinc-500" weight="bold" />
  }
  return <Checks size={15} className="text-sky-500" weight="bold" />
}

const statusConfig: Record<
  ChannelStatus,
  { label: string; icon: typeof Robot; className: string }
> = {
  bot: {
    label: "البوت يتولى المحادثة",
    icon: Robot,
    className:
      "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
  },
  human: {
    label: "موظف بشري",
    icon: User,
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
  },
  waiting: {
    label: "بانتظار موظف",
    icon: Clock,
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20",
  },
}

export function StatusPill({
  status,
  className,
}: {
  status: ChannelStatus
  className?: string
}) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.className,
        className,
      )}
    >
      <Icon size={13} weight="fill" />
      {config.label}
    </span>
  )
}
