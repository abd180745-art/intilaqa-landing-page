'use client'

import { motion } from 'motion/react'
import { Users, HardDrives, ChatTeardropText, Database, ArrowRight } from '@phosphor-icons/react'
import { Reveal } from './reveal'

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-pretty text-muted-foreground">{subtitle}</p>
    </Reveal>
  )
}

export function DualShowcase() {
  return (
    <section id="showcase" className="relative py-28">
      <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-[700px] -translate-x-1/2 rounded-full bg-amber/8 blur-[130px]" />
      <div className="relative mx-auto w-[min(1180px,92%)]">
        <SectionHeading
          eyebrow="One engine, two surfaces"
          title="B2C Customer Bots vs B2B Internal Tools"
          subtitle="The same headless core powers polished customer-facing widgets and powerful internal data flows."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* B2C card */}
          <Reveal delay={0.05}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
              className="group relative h-full overflow-hidden rounded-3xl glass p-8"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber/20 blur-[80px] transition-opacity group-hover:opacity-100" />
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-silver">
                <Users weight="fill" className="h-3.5 w-3.5 text-amber" /> B2C
              </span>
              <h3 className="mt-5 text-2xl font-semibold">Customer Bots</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Drop-in glassmorphic widgets that match your brand, stream
                instantly, and convert visitors.
              </p>

              {/* visual UI mock */}
              <div className="mt-7 space-y-3 rounded-2xl border border-border bg-background/40 p-4">
                <div className="flex items-start gap-2">
                  <ChatTeardropText weight="fill" className="mt-0.5 h-4 w-4 text-amber" />
                  <div className="rounded-xl rounded-tl-sm bg-secondary px-3 py-2 text-xs text-secondary-foreground">
                    Hi! How can I help you today?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="rounded-xl rounded-tr-sm bg-primary px-3 py-2 text-xs text-primary-foreground">
                    What are the requirements for Medical admission?
                  </div>
                </div>
                <motion.div
                  className="flex gap-1 pl-6"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 rounded-full bg-amber" />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </Reveal>

          {/* B2B card */}
          <Reveal delay={0.12}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
              className="group relative h-full overflow-hidden rounded-3xl glass p-8"
            >
              <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-silver/15 blur-[80px]" />
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-silver">
                <HardDrives weight="fill" className="h-3.5 w-3.5 text-amber" /> B2B
              </span>
              <h3 className="mt-5 text-2xl font-semibold">Internal Tools</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Wire the engine straight into your data warehouse and internal
                APIs for agents that actually do work.
              </p>

              {/* backend data flow mock */}
              <div className="mt-7 rounded-2xl border border-border bg-background/40 p-4 font-mono text-[11px]">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-amber-soft">
                    <Database weight="fill" className="h-3.5 w-3.5" /> whatsapp_extension_active
                  </span>
                  <span className="text-amber">142ms ⚡</span>
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    'Client: "Compare Medicine vs Dentistry in TR (2026 Prices)?"',
                    '→ Intilaqa parsing 400+ university PDF brochures...',
                    '→ Exact comparison & pricing generated. Ready to send.',
                  ].map((row, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.25 }}
                      className="flex items-center gap-2 text-silver"
                    >
                      <ArrowRight weight="bold" className="h-3 w-3 text-amber" />
                      {row}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
