'use client'

import { motion } from 'motion/react'
import { WhatsappLogo, Globe, Check } from '@phosphor-icons/react'
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

function ShowcaseColumn({
  icon: Icon,
  tag,
  title,
  description,
  features,
  children,
  delay,
}: {
  icon: typeof WhatsappLogo
  tag: string
  title: string
  description: string
  features: string[]
  children: React.ReactNode
  delay: number
}) {
  return (
    <Reveal delay={delay}>
      <div className="flex h-full flex-col">
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-6 -bottom-6 top-10 rounded-[2rem] bg-amber/8 blur-2xl" />
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 250, damping: 22 }}
            className="relative"
          >
            {children}
          </motion.div>
        </div>

        <div className="mt-8 px-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-silver">
            <Icon weight="fill" className="h-3.5 w-3.5 text-amber" /> {tag}
          </span>
          <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          <ul className="mt-5 space-y-2.5">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber/15">
                  <Check weight="bold" className="h-3 w-3 text-amber" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
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

        <div className="mt-16 grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
          <ShowcaseColumn
            icon={WhatsappLogo}
            tag="واتساب"
            title="مساعد واتساب آلي"
            description="يرد على استفسارات عملائك على واتساب على مدار الساعة، بالعربي والإنجليزي، ومربوط مباشرة بقاعدة معرفتك."
            features={[
              'ردود فورية ذكية بلهجة عملائك',
              'مربوط بقاعدة معرفة جامعاتك ومنتجاتك',
              'تسليم للموظف البشري عند الحاجة',
            ]}
            delay={0.05}
          >
            <WhatsappWindow />
          </ShowcaseColumn>

          <ShowcaseColumn
            icon={Globe}
            tag="ودجت الموقع"
            title="ودجت دردشة لموقعك"
            description="ودجت زجاجي أنيق يطابق هوية علامتك التجارية، يبث الردود لحظياً، ويحوّل زوار موقعك إلى عملاء."
            features={[
              'تركيب بسطر واحد على أي موقع',
              'تخصيص كامل للألوان والشعار',
              'بث الردود لحظياً بأقل من 200 مللي ثانية',
            ]}
            delay={0.12}
          >
            <WidgetWindow />
          </ShowcaseColumn>
        </div>
      </div>
    </section>
  )
}
