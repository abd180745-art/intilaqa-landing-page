'use client'

import { motion } from 'motion/react'
import { ArrowUpRight, Lightning, ShieldCheck, Globe } from '@phosphor-icons/react'
import { ChatWidget } from './chat-widget'
import { CodeTerminal } from './code-terminal'
import { NeuralNetworkBg } from './neural-network-bg'
import Link from 'next/link'

const metrics = [
  { icon: Lightning, value: '<200ms', label: 'Token streaming' },
  { icon: ShieldCheck, value: '99.99%', label: 'Uptime SLA' },
  { icon: Globe, value: '24/7', label: 'AR · EN support' },
]

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pb-16 font-sans"
      dir="rtl"
    >
      {/* Interactive neural network — conveys raw technical power */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-90"
        style={{
          maskImage:
            'radial-gradient(ellipse at 50% 38%, black 0%, black 45%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 38%, black 0%, black 45%, transparent 85%)',
        }}
      >
        <NeuralNetworkBg />
      </div>

      {/* Subtle warm accents — kept faint so the hero blends with the page background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-[-6%] h-[560px] w-[760px] -translate-x-1/2 rounded-[100%] bg-amber/[0.07] blur-[150px] animate-pulse-glow" />
        <div className="absolute right-[2%] top-[28%] h-[420px] w-[420px] rounded-full bg-amber-soft/[0.05] blur-[150px] animate-float-slow" />
      </div>

      {/* Central power core — radiant orb behind the headline */}
      <div className="pointer-events-none absolute left-1/2 top-[34%] z-0 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(230,150,5,0.16)_0%,rgba(230,150,5,0.04)_45%,transparent_70%)] blur-2xl animate-pulse-glow" />
      </div>

      <div className="relative z-10 mx-auto flex w-[min(1180px,92%)] flex-col items-center">
        <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.13, delayChildren: 0.05 },
            },
          }}
          className="flex w-full max-w-5xl flex-col items-center justify-center gap-5 px-4 text-center"
        >
          {/* Headline */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 22 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: 'easeOut' },
              },
            }}
            className="mt-2 max-w-4xl text-balance text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl md:text-7xl"
          >
            <span className="text-foreground">Your Smart Agent</span>
            <br />
            <span className="text-amber">Powered by Intilaqa</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: 'easeOut' },
              },
            }}
            className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Specialized bots reply to your customers in Arabic and English around the
            clock — your data, your rules, your industry.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.92 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.5, ease: 'easeOut' },
              },
            }}
            className="mt-7 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              href="/login"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #f5b041 0%, #e69605 100%)',
                boxShadow:
                  '0 0 40px rgba(230,150,5,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer" />
              <span className="relative z-10 drop-shadow-sm">Start for free</span>
              <ArrowUpRight className="relative z-10 h-4 w-4 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 drop-shadow-sm" />
            </Link>
            <a
              href="#developers"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-medium text-foreground backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              Read the docs
            </a>
          </motion.div>

          {/* Power metrics strip — signals technical strength */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { delay: 0.4, duration: 0.7 },
              },
            }}
            className="glass-pill mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 rounded-2xl px-3 py-3 sm:gap-x-3"
            dir="ltr"
          >
            {metrics.map((m, i) => (
              <div key={m.label} className="flex items-center">
                <div className="flex items-center gap-3 px-3 sm:px-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber/10 text-amber">
                    <m.icon weight="fill" className="h-4 w-4" />
                  </span>
                  <div className="text-left">
                    <div className="text-base font-semibold leading-none text-foreground">
                      {m.value}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
                  </div>
                </div>
                {i < metrics.length - 1 && (
                  <span className="hidden h-8 w-px bg-border sm:block" />
                )}
              </div>
            ))}
          </motion.div>
          </motion.div>
        </div>

        {/* 3D-ish product showcase row */}
        <div
          className="relative mt-12 grid w-full items-center gap-6 pb-12 lg:grid-cols-2 lg:gap-8"
          dir="ltr"
        >
          <div className="absolute left-1/2 top-[40%] z-0 hidden -translate-x-1/2 -translate-y-1/2 opacity-50 lg:block pointer-events-none">
            <svg width="250" height="150" viewBox="0 0 250 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 0,75 C 60,75 60,20 125,20 C 190,20 190,130 250,130"
                stroke="url(#paint0_linear)"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                className="animate-pulse-glow"
              />
              <circle cx="0" cy="75" r="4" fill="#e69605" className="animate-ping" />
              <circle cx="250" cy="130" r="4" fill="#e69605" className="animate-ping" />
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="75" x2="250" y2="75" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#e69605" stopOpacity="0.2" />
                  <stop offset="0.5" stopColor="#e69605" stopOpacity="1" />
                  <stop offset="1" stopColor="#e69605" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -40, rotateY: 12 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="animate-float-slow [perspective:1200px]"
          >
            <ChatWidget />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -12 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="animate-float"
          >
            <CodeTerminal />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
