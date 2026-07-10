'use client'

import { motion } from 'motion/react'
import { ArrowUp, Sparkle } from '@phosphor-icons/react'

const messages = [
  { role: 'user', text: 'How fast can Intilaqa stream a response?' },
  {
    role: 'bot',
    text: 'Tokens begin streaming in under 200ms over NDJSON — fully headless and edge-ready.',
  },
]

export function ChatWidget() {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl glass shadow-[0_30px_80px_-24px_oklch(0.21_0.006_286/30%)]">
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-silver/15 blur-[80px]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber/15 blur-[80px]" />
      <div className="relative flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
          <Sparkle className="h-4 w-4 text-amber" />
        </span>
        <div>
          <p className="text-sm font-medium leading-none">Intilaqa Assistant</p>
          <p className="mt-1 text-xs text-muted-foreground">Online · B2C widget</p>
        </div>
      </div>

      <div className="relative flex flex-col gap-3 px-5 py-5">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.4, duration: 0.5 }}
            className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'self-end border border-border bg-background/40 text-foreground shadow-sm'
                : 'self-start bg-secondary/50 text-muted-foreground'
            }`}
          >
            {m.text}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3 }}
          className="flex items-center gap-1 self-start rounded-2xl bg-secondary/50 px-4 py-3"
        >
          {[0, 1, 2].map((d) => (
            <motion.span
              key={d}
              className="h-1.5 w-1.5 rounded-full bg-amber"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
            />
          ))}
        </motion.div>
      </div>

      <div className="relative m-4 mt-0 flex items-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2">
        <input
          aria-label="Message"
          placeholder="Ask anything…"
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-amber">
          <ArrowUp className="h-4 w-4" />
        </span>
      </div>
    </div>
  )
}
