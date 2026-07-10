'use client'

import { motion } from 'motion/react'
import {
  MagnifyingGlass,
  ChatCircleDots,
  Robot,
  User,
  Checks,
  Phone,
  Info,
  DotsThreeVertical,
  Sparkle,
  NotePencil,
  MagicWand,
  Paperclip,
  Microphone,
  PaperPlaneRight,
  ArrowsClockwise,
} from '@phosphor-icons/react'

const contacts = [
  {
    initials: 'SK',
    name: 'Sarah Khalil',
    time: '10:33',
    snippet: 'Do you accept SAT scores?',
    tone: 'bg-primary/15 text-primary',
    active: true,
    unread: 0,
    icon: 'human',
    read: false,
  },
  {
    initials: 'MA',
    name: 'Mohammed Ahmad',
    time: '09:58',
    snippet: 'Thanks, that was helpful!',
    tone: 'bg-emerald-500/15 text-emerald-600',
    active: false,
    unread: 0,
    icon: 'bot',
    read: true,
  },
  {
    initials: 'OD',
    name: 'Omar Deeb',
    time: '09:41',
    snippet: 'How much is the tuition fee…',
    tone: 'bg-sky-500/15 text-sky-600',
    active: false,
    unread: 2,
    icon: 'bot',
    read: false,
  },
  {
    initials: 'LH',
    name: 'Leen Hamoud',
    time: 'Yesterday',
    snippet: 'Registration completed',
    tone: 'bg-rose-500/15 text-rose-600',
    active: false,
    unread: 0,
    icon: 'human',
    read: true,
  },
]

const aiActions = [
  { icon: Sparkle, label: 'Suggest reply' },
  { icon: NotePencil, label: 'Summarize' },
  { icon: MagicWand, label: 'Improve tone' },
  { icon: Robot, label: 'Hand to bot' },
]

export function WhatsappWindow() {
  return (
    <div
      dir="ltr"
      className="flex h-full min-h-[460px] w-full overflow-hidden rounded-xl border border-border bg-background text-left shadow-sm"
    >
      {/* Conversations sidebar */}
      <aside className="hidden w-[195px] shrink-0 flex-col border-r border-border/60 bg-card sm:flex">
        <div className="space-y-2.5 border-b border-border/50 px-3 pb-3 pt-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-bold text-foreground">Conversations</p>
              <p className="text-[10px] text-muted-foreground">2 new conversations</p>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ChatCircleDots weight="duotone" className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-2.5 py-1.5">
            <MagnifyingGlass className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="text-[10.5px] text-muted-foreground/70">Search conversations…</span>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-0.5">
            <span className="flex-1 rounded-lg bg-card px-2 py-1 text-center text-[10px] font-medium text-foreground shadow-sm">
              All
            </span>
            <span className="flex-1 rounded-lg px-2 py-1 text-center text-[10px] font-medium text-muted-foreground">
              Unread
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-0.5 overflow-hidden p-1.5">
          {contacts.map((c) => (
            <div
              key={c.name}
              className={`flex items-center gap-2 rounded-xl border p-2 ${
                c.active
                  ? 'border-primary/30 bg-primary/[0.06] shadow-sm'
                  : 'border-transparent'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${c.tone}`}
              >
                {c.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate text-[11px] font-semibold text-foreground">
                    {c.name}
                  </span>
                  <span
                    className={`shrink-0 text-[9px] ${c.unread > 0 ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
                  >
                    {c.time}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-1">
                  <span className="flex min-w-0 items-center gap-1 text-[10px] text-muted-foreground">
                    {c.icon === 'bot' ? (
                      <Robot weight="fill" className="h-2.5 w-2.5 shrink-0 text-primary/70" />
                    ) : (
                      <User weight="fill" className="h-2.5 w-2.5 shrink-0 text-emerald-500" />
                    )}
                    {c.read && <Checks weight="bold" className="h-3 w-3 shrink-0 text-sky-500" />}
                    <span className="truncate">{c.snippet}</span>
                  </span>
                  {c.unread > 0 && (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex min-w-0 flex-1 flex-col bg-card">
        {/* Header */}
        <header className="flex items-center justify-between gap-2 border-b border-border/50 bg-card/80 px-3 py-2.5 backdrop-blur-xl">
          <div className="flex min-w-0 items-center gap-2">
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
              SK
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-bold text-foreground">Sarah Khalil</p>
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
                <User weight="fill" className="h-2.5 w-2.5" />
                Human agent
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone weight="duotone" className="h-4 w-4" />
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Info weight="duotone" className="h-4 w-4" />
            </span>
            <DotsThreeVertical weight="bold" className="h-4 w-4" />
          </div>
        </header>

        {/* Messages */}
        <div className="chat-pattern flex-1 space-y-2 overflow-hidden px-3 py-3">
          <div className="flex justify-center">
            <span className="rounded-full border border-border/60 bg-card/80 px-2.5 py-0.5 text-[9px] font-medium text-muted-foreground shadow-sm">
              Today
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-card px-3 py-2 text-[11.5px] leading-relaxed text-foreground shadow-sm ring-1 ring-inset ring-border/60">
              {'Hi! What are the admission requirements for the dentistry program?'}
              <div className="mt-0.5 text-right text-[9px] text-muted-foreground">10:32</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="flex justify-end"
          >
            <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary/[0.12] px-3 py-2 text-[11.5px] leading-relaxed text-foreground shadow-sm ring-1 ring-inset ring-primary/20">
              {'Happy to help! Which intake are you applying for — Fall or Spring?'}
              <div className="mt-0.5 flex items-center justify-end gap-1 text-[9px] text-muted-foreground">
                10:32 <Checks weight="bold" className="h-3 w-3 text-sky-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-card px-3 py-2 text-[11.5px] leading-relaxed text-foreground shadow-sm ring-1 ring-inset ring-border/60">
              {'Fall intake. Also, do you accept SAT scores?'}
              <div className="mt-0.5 text-right text-[9px] text-muted-foreground">10:33</div>
            </div>
          </motion.div>

          {/* AI copilot suggestion */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.45 }}
            className="rounded-2xl border border-primary/25 bg-primary/[0.06] p-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-primary">
                <Sparkle weight="fill" className="h-3 w-3" />
                AI Copilot · drafted from your knowledge base
              </span>
              <ArrowsClockwise className="h-3 w-3 text-primary/60" />
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/90">
              {'Yes — for Fall intake we accept SAT (min. 1100) or YÖS. Dentistry requires a high-school GPA of 85%+. Want me to send the full checklist?'}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground shadow-sm">
                Insert reply
              </span>
              <span className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                Edit
              </span>
            </div>
          </motion.div>
        </div>

        {/* Composer */}
        <div className="border-t border-border/50 bg-card/70 p-2.5">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {aiActions.map((a) => (
              <span
                key={a.label}
                className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2 py-1 text-[9.5px] font-medium text-muted-foreground shadow-sm"
              >
                <a.icon weight="duotone" className="h-3 w-3" />
                {a.label}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 rounded-2xl border border-border/60 bg-background/60 p-1.5">
            <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 text-[11px] text-muted-foreground/70">Type a message…</span>
            <Microphone className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <PaperPlaneRight weight="fill" className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
