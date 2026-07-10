'use client'

import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Cube, GitBranch, Gauge, ShieldCheck } from '@phosphor-icons/react'
import { Reveal } from './reveal'

function LatencyChart() {
  const [data, setData] = useState<number[]>(
    Array.from({ length: 28 }, () => 20 + Math.random() * 30),
  )

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => [...prev.slice(1), 14 + Math.random() * 34])
    }, 700)
    return () => clearInterval(id)
  }, [])

  const max = Math.max(...data)
  return (
    <div className="flex h-28 items-end gap-1">
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm bg-gradient-to-t from-amber/30 to-amber"
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export function BentoGrid() {
  return (
    <section id="bento" className="relative py-28">
      <div className="relative mx-auto w-[min(1180px,92%)]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber">
            The platform
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            A real leap for your business
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Engineered for lightning speed, massive cost reduction, and the perfect customer experience.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 md:grid-cols-6 md:grid-rows-2">
          {/* Headless SDK — large */}
          <Reveal className="md:col-span-4 md:row-span-1" delay={0.05}>
            <motion.div
              whileHover={{ y: -6 }}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl glass p-8"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber/15 blur-[80px]" />
              <div>
                <Cube weight="fill" className="h-6 w-6 text-amber" />
                <h3 className="mt-4 text-2xl font-semibold">Custom Knowledge Base</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Upload your custom files, university requirements, or exclusive discounts. The agent responds based strictly on your rules and data.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {['PDFs', 'Docs', 'URLs', 'Sync', 'API'].map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-border bg-background/40 px-2.5 py-1 font-mono text-xs text-silver"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </Reveal>

          {/* Latency — animated chart */}
          <Reveal className="md:col-span-2 md:row-span-1" delay={0.12}>
            <motion.div
              whileHover={{ y: -6 }}
              className="relative flex h-full flex-col overflow-hidden rounded-3xl glass p-7"
            >
              <div className="flex items-center justify-between">
                <Gauge weight="fill" className="h-6 w-6 text-amber" />
                <span className="font-mono text-2xl font-semibold text-primary">
                  187ms
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">Lightning Fast</h3>
              <p className="text-xs text-muted-foreground">Instant, accurate replies 24/7</p>
              <div className="mt-auto pt-4">
                <LatencyChart />
              </div>
            </motion.div>
          </Reveal>

          {/* Orchestration */}
          <Reveal className="md:col-span-2 md:row-span-1" delay={0.18}>
            <motion.div
              whileHover={{ y: -6 }}
              className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl glass p-7"
            >
              <GitBranch weight="fill" className="h-6 w-6 text-amber" />
              <div>
                <h3 className="mt-4 text-lg font-semibold">Lower Operational Cost</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Save massively on support and sales teams while serving thousands of clients simultaneously.
                </p>
              </div>
            </motion.div>
          </Reveal>

          {/* Security — wide */}
          <Reveal className="md:col-span-4 md:row-span-1" delay={0.24}>
            <motion.div
              whileHover={{ y: -6 }}
              className="group relative flex h-full items-center justify-between gap-6 overflow-hidden rounded-3xl glass p-8"
            >
              <div className="pointer-events-none absolute -left-16 -bottom-16 h-52 w-52 rounded-full bg-silver/10 blur-[80px]" />
              <div>
                <ShieldCheck weight="fill" className="h-6 w-6 text-amber" />
                <h3 className="mt-4 text-2xl font-semibold">
                  Perfect Customer Experience
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Warm, human-like bilingual interactions that build trust. Every user feels they are talking to an expert consultant.
                </p>
              </div>
              <div className="hidden shrink-0 grid-cols-2 gap-2 sm:grid">
                {['100% Satisfaction', 'Bilingual', 'Natural', 'Empathic'].map((b) => (
                  <span
                    key={b}
                    className="rounded-xl border border-border bg-background/40 px-3 py-2 text-center text-xs font-medium text-silver"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
