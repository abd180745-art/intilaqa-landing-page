import { Pulse } from "@phosphor-icons/react/dist/ssr"

type Status = "online" | "degraded" | "offline"

const services: Array<{ name: string; status: Status; meta: string }> = [
  { name: "OpenAI", status: "online", meta: "410ms" },
  { name: "Pinecone", status: "online", meta: "24,180" },
  { name: "Algolia", status: "online", meta: "1,240" },
  { name: "Tavily", status: "degraded", meta: "1.8s" },
  { name: "Supabase", status: "online", meta: "متصل" },
  { name: "Guardrails", status: "online", meta: "مفعّل" },
]

const dotClass: Record<Status, string> = {
  online: "dot-success",
  degraded: "dot-warning",
  offline: "dot-danger",
}

export function SystemStatusBar() {
  return (
    <div className="glass-pill flex items-center gap-4 overflow-x-auto rounded-full px-4 py-3 md:gap-6 md:px-6">
      <div className="flex shrink-0 items-center gap-2">
        <Pulse className="h-3.5 w-3.5 text-primary" weight="fill" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          الأنظمة
        </span>
      </div>
      <span aria-hidden className="h-4 w-px shrink-0 bg-border/70" />

      {services.map((s, i) => (
        <div key={s.name} className="flex shrink-0 items-center gap-2.5">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass[s.status]}`}
          />
          <span className="text-xs font-semibold text-foreground">
            {s.name}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
            {s.meta}
          </span>
          {i < services.length - 1 && (
            <span aria-hidden className="h-3 w-px bg-border/50" />
          )}
        </div>
      ))}

      <div className="ms-auto hidden shrink-0 items-center gap-2 lg:flex">
        <span className="pulse-dot" style={{ background: "var(--success)", boxShadow: "0 0 0 3px oklch(0.62 0.14 155 / 0.2)" }} />
        <span className="text-[11px] font-semibold text-success">
          كل الأنظمة تعمل
        </span>
      </div>
    </div>
  )
}
