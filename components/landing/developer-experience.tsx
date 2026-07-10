'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { Reveal } from './reveal'

type Tok = { t: string; c: string }

const tabs: { id: string; label: string; code: Tok[][] }[] = [
  {
    id: 'curl',
    label: 'cURL',
    code: [
      [
        { t: 'curl', c: 'text-amber' },
        { t: ' https://api.intilaqa.ai/v1/stream', c: 'text-[#a5d6a7]' },
        { t: ' \\', c: 'text-[oklch(0.74_0.006_286)]' },
      ],
      [
        { t: '  -H ', c: 'text-[oklch(0.93_0_0)]' },
        { t: '"Authorization: Bearer $KEY"', c: 'text-[#a5d6a7]' },
        { t: ' \\', c: 'text-[oklch(0.74_0.006_286)]' },
      ],
      [
        { t: '  -H ', c: 'text-[oklch(0.93_0_0)]' },
        { t: '"Content-Type: application/x-ndjson"', c: 'text-[#a5d6a7]' },
        { t: ' \\', c: 'text-[oklch(0.74_0.006_286)]' },
      ],
      [
        { t: '  -d ', c: 'text-[oklch(0.93_0_0)]' },
        { t: `'{"model":"intilaqa-pro","stream":true}'`, c: 'text-[#a5d6a7]' },
      ],
    ],
  },
  {
    id: 'node',
    label: 'Node.js',
    code: [
      [
        { t: 'const', c: 'text-[#c792ea]' },
        { t: ' res ', c: 'text-[oklch(0.93_0_0)]' },
        { t: '= ', c: 'text-[oklch(0.74_0.006_286)]' },
        { t: 'await', c: 'text-[#c792ea]' },
        { t: ' fetch', c: 'text-amber' },
        { t: '(', c: 'text-[oklch(0.74_0.006_286)]' },
        { t: "'https://api.intilaqa.ai/v1/stream'", c: 'text-[#a5d6a7]' },
        { t: ', {', c: 'text-[oklch(0.74_0.006_286)]' },
      ],
      [
        { t: '  method', c: 'text-[#82aaff]' },
        { t: ': ', c: 'text-[oklch(0.74_0.006_286)]' },
        { t: "'POST'", c: 'text-[#a5d6a7]' },
        { t: ',', c: 'text-[oklch(0.74_0.006_286)]' },
      ],
      [
        { t: '  headers', c: 'text-[#82aaff]' },
        { t: ': { Authorization: ', c: 'text-[oklch(0.74_0.006_286)]' },
        { t: '`Bearer ${key}`', c: 'text-[#a5d6a7]' },
        { t: ' },', c: 'text-[oklch(0.74_0.006_286)]' },
      ],
      [{ t: '})', c: 'text-[oklch(0.74_0.006_286)]' }],
      [
        { t: 'const', c: 'text-[#c792ea]' },
        { t: ' reader ', c: 'text-[oklch(0.93_0_0)]' },
        { t: '= res.body', c: 'text-[oklch(0.93_0_0)]' },
        { t: '.getReader', c: 'text-amber' },
        { t: '()', c: 'text-[oklch(0.74_0.006_286)]' },
      ],
    ],
  },
  {
    id: 'sdk',
    label: 'SDK',
    code: [
      [
        { t: 'import', c: 'text-[#c792ea]' },
        { t: ' { Intilaqa } ', c: 'text-[oklch(0.74_0.006_286)]' },
        { t: 'from', c: 'text-[#c792ea]' },
        { t: " 'intilaqa'", c: 'text-[#a5d6a7]' },
      ],
      [],
      [
        { t: 'const', c: 'text-[#c792ea]' },
        { t: ' client ', c: 'text-[oklch(0.93_0_0)]' },
        { t: '= ', c: 'text-[oklch(0.74_0.006_286)]' },
        { t: 'new', c: 'text-[#c792ea]' },
        { t: ' Intilaqa', c: 'text-amber-soft' },
        { t: '({ apiKey })', c: 'text-[oklch(0.74_0.006_286)]' },
      ],
      [],
      [
        { t: 'for await', c: 'text-[#c792ea]' },
        { t: ' (', c: 'text-[oklch(0.74_0.006_286)]' },
        { t: 'const', c: 'text-[#c792ea]' },
        { t: ' chunk ', c: 'text-[oklch(0.93_0_0)]' },
        { t: 'of', c: 'text-[#c792ea]' },
        { t: ' client', c: 'text-[oklch(0.93_0_0)]' },
        { t: '.stream', c: 'text-amber' },
        { t: '(prompt))', c: 'text-[oklch(0.74_0.006_286)]' },
      ],
      [
        { t: '  console', c: 'text-[oklch(0.93_0_0)]' },
        { t: '.log', c: 'text-amber' },
        { t: '(chunk.delta)', c: 'text-[oklch(0.74_0.006_286)]' },
      ],
    ],
  },
]

export function DeveloperExperience() {
  const [active, setActive] = useState('sdk')
  const current = tabs.find((t) => t.id === active)!

  return (
    <section id="developers" className="relative py-28">
      <div className="pointer-events-none absolute left-1/2 top-24 h-80 w-[600px] -translate-x-1/2 rounded-full bg-amber/8 blur-[130px]" />
      <div className="relative mx-auto w-[min(1180px,92%)]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber">
            Developer experience
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Integrate in minutes, not weeks
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Choose your weapon. The same streaming engine, exposed however you
            like to build.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <div className="relative mx-auto max-w-3xl rounded-3xl p-px">
            {/* animated gradient border */}
            <div className="animated-border absolute inset-0 rounded-3xl animate-shimmer" />
            <div className="relative overflow-hidden rounded-3xl border border-[oklch(1_0_0/8%)] bg-[oklch(0.18_0.006_286)] shadow-[0_30px_80px_-24px_oklch(0.21_0.006_286/35%)]">
              <div className="flex items-center gap-1 border-b border-[oklch(1_0_0/8%)] px-3 py-2">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActive(t.id)}
                    className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      active === t.id
                        ? 'text-[oklch(0.97_0_0)]'
                        : 'text-[oklch(0.7_0.006_286)] hover:text-[oklch(0.97_0_0)]'
                    }`}
                  >
                    {active === t.id && (
                      <motion.span
                        layoutId="tab-pill"
                        className="absolute inset-0 rounded-lg bg-[oklch(1_0_0/12%)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{t.label}</span>
                  </button>
                ))}
              </div>

              <div className="min-h-[220px] px-6 py-5">
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={active}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-x-auto font-mono text-[13px] leading-7"
                  >
                    <code>
                      {current.code.map((line, li) => (
                        <div key={li} className="min-h-[1.75rem] whitespace-pre">
                          {line.map((tok, ti) => (
                            <span key={ti} className={tok.c}>
                              {tok.t}
                            </span>
                          ))}
                        </div>
                      ))}
                    </code>
                  </motion.pre>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
