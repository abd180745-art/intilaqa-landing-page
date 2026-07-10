'use client'

import { motion } from 'motion/react'
import { ArrowsOutSimple } from '@phosphor-icons/react'
import { Reveal } from './reveal'
import { WhatsappWindow } from './whatsapp-window'
import { WidgetWindow } from './widget-window'

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

function ShowcaseCard({
  title,
  description,
  children,
  delay,
}: {
  title: string
  description: string
  children: React.ReactNode
  delay: number
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 250, damping: 24 }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.06),0_24px_60px_-30px_rgba(0,0,0,0.25)]"
      >
        {/* Card header — Stripe style */}
        <div className="flex items-start justify-between gap-4 p-6 pb-4 sm:p-7 sm:pb-4">
          <div className="min-w-0">
            <h3 className="text-pretty text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
              {title}
            </h3>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-amber transition-colors"
          >
            <ArrowsOutSimple weight="bold" className="h-4 w-4" />
          </span>
        </div>

        {/* Live demo */}
        <div className="relative flex min-h-[420px] flex-1 flex-col px-4 pb-4 sm:px-5 sm:pb-5">
          <div className="pointer-events-none absolute inset-x-8 bottom-2 top-8 rounded-[2rem] bg-amber/8 blur-2xl" />
          <div className="relative flex h-full flex-1 flex-col">{children}</div>
        </div>
      </motion.article>
    </Reveal>
  )
}

export function DualShowcase() {
  return (
    <section id="showcase" className="relative py-28" dir="rtl">
      <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-[700px] -translate-x-1/2 rounded-full bg-amber/8 blur-[130px]" />
      <div className="relative mx-auto w-[min(1180px,92%)]">
        <SectionHeading
          eyebrow="محرك واحد · واجهتان"
          title="بوت واتساب متكامل وودجت لموقعك"
          subtitle="نفس المحرك الذكي يشغّل مساعد واتساب يرد على عملائك مباشرة، وودجت أنيق تدمجه في موقعك بسطر واحد."
        />

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <ShowcaseCard
            title="أتمتة محادثات واتساب بالكامل"
            description="مساعد آلي يرد على عملائك على واتساب على مدار الساعة، مربوط مباشرة بقاعدة معرفتك."
            delay={0.05}
          >
            <WhatsappWindow />
          </ShowcaseCard>

          <ShowcaseCard
            title="ودجت دردشة يعيش داخل موقعك"
            description="تركيب بسطر واحد، تخصيص كامل لهويتك، وبث للردود لحظياً يحوّل الزوار إلى عملاء."
            delay={0.12}
          >
            <WidgetWindow />
          </ShowcaseCard>
        </div>
      </div>
    </section>
  )
}
