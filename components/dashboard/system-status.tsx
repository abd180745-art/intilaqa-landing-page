import { CheckCircle2, Database, Key, Network, Search, Shield } from "lucide-react"

const services = [
  {
    name: "OpenAI API",
    description: "GPT-4o · Responses API",
    icon: Key,
    status: "online" as const,
    meta: "استجابة ٤١٠ms",
  },
  {
    name: "Pinecone",
    description: "قاعدة البيانات الموجهة",
    icon: Database,
    status: "online" as const,
    meta: "٢٤,١٨٠ متجه",
  },
  {
    name: "Algolia",
    description: "بحث الجامعات",
    icon: Search,
    status: "online" as const,
    meta: "١,٢٤٠ فهرس",
  },
  {
    name: "Tavily",
    description: "البحث الحي",
    icon: Network,
    status: "degraded" as const,
    meta: "بطء طفيف",
  },
  {
    name: "Supabase",
    description: "قاعدة بيانات SaaS",
    icon: Database,
    status: "online" as const,
    meta: "متصل",
  },
  {
    name: "Guardrails",
    description: "الحدود والأمان",
    icon: Shield,
    status: "online" as const,
    meta: "مفعّل",
  },
]

const statusConfig = {
  online: { label: "متصل", dot: "bg-success", text: "text-success" },
  degraded: {
    label: "بطء",
    dot: "bg-warning",
    text: "text-warning-foreground",
  },
  offline: {
    label: "منقطع",
    dot: "bg-destructive",
    text: "text-destructive",
  },
}

export function SystemStatus() {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-5 md:p-6">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
      />

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold tracking-tight text-foreground">
            حالة الأنظمة
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            الخدمات الموصولة بوكيل انطلاقة AI
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success ring-1 ring-inset ring-success/20">
          <CheckCircle2 className="h-3.5 w-3.5" />
          جاهز
        </span>
      </div>

      <ul className="mt-5 space-y-2">
        {services.map((service) => {
          const status = statusConfig[service.status]
          return (
            <li
              key={service.name}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-white/40 px-3 py-2.5 backdrop-blur-sm transition-colors hover:bg-white/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg silver-surface text-muted-foreground ring-1 ring-inset ring-white/60">
                <service.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {service.name}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {service.description}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${status.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {service.meta}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
