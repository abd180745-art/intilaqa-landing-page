'use client'

import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

// Tokenized lines so we can syntax-highlight without a heavy dependency.
type Tok = { t: string; c: string }
const lines: Tok[][] = [
  [
    { t: 'import', c: 'text-[#c792ea]' },
    { t: ' { ', c: 'text-[oklch(0.74_0.006_286)]' },
    { t: 'Intilaqa', c: 'text-amber-soft' },
    { t: ' } ', c: 'text-[oklch(0.74_0.006_286)]' },
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
    { t: 'const', c: 'text-[#c792ea]' },
    { t: ' response ', c: 'text-[oklch(0.93_0_0)]' },
    { t: '= ', c: 'text-[oklch(0.74_0.006_286)]' },
    { t: 'await', c: 'text-[#c792ea]' },
    { t: ' client', c: 'text-[oklch(0.93_0_0)]' },
    { t: '.sendMessageStream', c: 'text-amber' },
    { t: '({', c: 'text-[oklch(0.74_0.006_286)]' },
  ],
  [
    { t: '  model', c: 'text-[#82aaff]' },
    { t: ': ', c: 'text-[oklch(0.74_0.006_286)]' },
    { t: "'intilaqa-pro'", c: 'text-[#a5d6a7]' },
    { t: ',', c: 'text-[oklch(0.74_0.006_286)]' },
  ],
  [
    { t: '  stream', c: 'text-[#82aaff]' },
    { t: ': ', c: 'text-[oklch(0.74_0.006_286)]' },
    { t: 'true', c: 'text-amber-soft' },
    { t: ',', c: 'text-[oklch(0.74_0.006_286)]' },
  ],
  [{ t: '})', c: 'text-[oklch(0.74_0.006_286)]' }],
  [],
  [
    { t: 'for await', c: 'text-[#c792ea]' },
    { t: ' (', c: 'text-[oklch(0.74_0.006_286)]' },
    { t: 'const', c: 'text-[#c792ea]' },
    { t: ' chunk ', c: 'text-[oklch(0.93_0_0)]' },
    { t: 'of', c: 'text-[#c792ea]' },
    { t: ' response) {', c: 'text-[oklch(0.74_0.006_286)]' },
  ],
  [
    { t: '  render', c: 'text-amber' },
    { t: '(chunk', c: 'text-[oklch(0.74_0.006_286)]' },
    { t: '.delta', c: 'text-[#82aaff]' },
    { t: ')', c: 'text-[oklch(0.74_0.006_286)]' },
  ],
  [{ t: '}', c: 'text-[oklch(0.74_0.006_286)]' }],
]

const flat = lines.map((l) => l.map((tok) => tok.t).join(''))
const totalChars = flat.reduce((acc, l) => acc + l.length + 1, 0)

export function CodeTerminal() {
  const [count, setCount] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    let i = 0
    const tick = () => {
      i += 1
      setCount((c) => (c >= totalChars ? c : c + 1))
      if (i < totalChars) {
        raf.current = window.setTimeout(tick, 26) as unknown as number
      } else {
        // loop with a pause
        raf.current = window.setTimeout(() => setCount(0), 2600) as unknown as number
      }
    }
    raf.current = window.setTimeout(tick, 600) as unknown as number
    return () => {
      if (raf.current) clearTimeout(raf.current)
    }
  }, [count === 0])

  // figure how many chars to show per line
  let remaining = count
  const visible: number[] = []
  for (const l of flat) {
    const show = Math.max(0, Math.min(l.length, remaining))
    visible.push(show)
    remaining -= l.length + 1
  }

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-[oklch(1_0_0/8%)] bg-[oklch(0.18_0.006_286)] shadow-[0_30px_80px_-24px_oklch(0.21_0.006_286/35%)]">
      {/* amber glow top */}
      <div className="pointer-events-none absolute -top-px left-0 h-px w-full bg-gradient-to-r from-transparent via-amber to-transparent opacity-70" />
      <div className="flex items-center gap-2 border-b border-[oklch(1_0_0/8%)] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-[oklch(0.7_0.006_286)]">
          stream.ts — NDJSON
        </span>
      </div>

      <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-6">
        <code>
          {lines.map((line, li) => {
            let shown = visible[li]
            return (
              <div key={li} className="min-h-[1.5rem] whitespace-pre">
                {line.map((tok, ti) => {
                  if (shown <= 0) return null
                  const slice = tok.t.slice(0, shown)
                  shown -= tok.t.length
                  return (
                    <span key={ti} className={tok.c}>
                      {slice}
                    </span>
                  )
                })}
              </div>
            )
          })}
        </code>
      </pre>

      {/* live NDJSON output */}
      <div className="border-t border-[oklch(1_0_0/8%)] bg-[oklch(0.15_0.006_286)] px-5 py-3 font-mono text-[11px] text-[oklch(0.7_0.006_286)]">
        <div className="flex items-center gap-2">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-amber"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="text-amber-soft">stream</span>
          <span>{'{"delta":"The","done":false}'}</span>
        </div>
      </div>
    </div>
  )
}
