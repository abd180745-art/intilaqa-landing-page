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
  href,
  children,
  delay,
}: {
  title: string
  href: string
  children: React.ReactNode
  delay: number
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <motion.a
        href={href}
        aria-label={title}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 250, damping: 24 }}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.06),0_24px_60px_-30px_rgba(0,0,0,0.25)] transition-colors hover:border-amber/40"
      >
        {/* Card header — title only, Stripe style */}
        <div className="flex items-center justify-between gap-4 p-5 pb-3">
          <h3 className="text-pretty text-base font-semibold leading-snug tracking-tight sm:text-lg">
            {title}
          </h3>
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-amber transition-colors group-hover:bg-amber group-hover:text-background"
          >
            <ArrowsOutSimple weight="bold" className="h-4 w-4" />
          </span>
        </div>

        {/* Live demo fills the card */}
        <div className="relative flex flex-1 flex-col px-4 pb-4">
          <div className="pointer-events-none absolute inset-x-8 bottom-2 top-8 rounded-[2rem] bg-amber/8 blur-2xl" />
          <div className="relative flex h-full flex-1 flex-col">{children}</div>
        </div>
      </motion.a>
    </Reveal>
  )
}

export function DualShowcase() {
  return (
    <section id="showcase" className="relative py-28">
      <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-[700px] -translate-x-1/2 rounded-full bg-amber/8 blur-[130px]" />
      <div className="relative mx-auto w-[min(1180px,92%)]">
        <SectionHeading
          eyebrow="One engine · Two surfaces"
          title="A WhatsApp copilot and a widget for your site"
          subtitle="The same intelligent engine powers an AI copilot that assists your team on WhatsApp, and a sleek widget you embed on your website with one line."
        />

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <ShowcaseCard title="Supercharge your team on WhatsApp" href="#bento" delay={0.05}>
            <WhatsappWindow />
          </ShowcaseCard>

          <ShowcaseCard title="A chat widget that lives on your site" href="#developers" delay={0.12}>
            <WidgetWindow />
          </ShowcaseCard>
        </div>
      </div>
    </section>
  )
}
