import { EnvelopeSimple, Phone, Tag, NotePencil, X } from "@phosphor-icons/react"
import { Avatar } from "./avatar"
import { StatusPill } from "./status"
import type { Contact } from "./data"

export function CrmSidebar({
  contact,
  onClose,
}: {
  contact: Contact
  onClose: () => void
}) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col overflow-hidden border-r border-border/50 bg-card/60">
      <div className="elegant-scroll flex-1 overflow-y-auto p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">بيانات العميل</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق لوحة البيانات"
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="mt-5 flex flex-col items-center text-center">
          <Avatar
            initials={contact.initials}
            tone={contact.tone}
            online={contact.online}
            size="lg"
          />
          <p className="mt-3 font-bold text-foreground">{contact.name}</p>
          <div className="mt-2">
            <StatusPill status={contact.status} />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <InfoRow icon={Phone} label="رقم الهاتف" value={contact.phone} />
          <InfoRow icon={EnvelopeSimple} label="البريد الإلكتروني" value={contact.email} />
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Tag size={14} weight="fill" className="text-primary" />
            الوسوم
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {contact.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <NotePencil size={14} weight="fill" className="text-primary" />
            ملاحظات
          </div>
          <p className="mt-2 rounded-2xl border border-border/60 bg-muted/40 p-3 text-sm leading-relaxed text-foreground">
            {contact.note}
          </p>
        </div>
      </div>
    </aside>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={16} weight="duotone" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p dir="ltr" className="truncate text-right text-sm font-medium text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}
