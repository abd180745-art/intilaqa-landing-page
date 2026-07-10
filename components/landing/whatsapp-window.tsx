'use client'

import { motion } from 'motion/react'
import { WhatsappLogo, Checks, DotsThreeVertical, Phone, VideoCamera, Plus, Microphone } from '@phosphor-icons/react'

const conversation = [
  {
    role: 'in',
    text: 'مرحباً، بدي أعرف شو شروط القبول لتخصص طب الأسنان بتركيا؟',
    time: '10:32',
  },
  {
    role: 'out',
    text: 'أهلاً فيك! 🦷 لتخصص طب الأسنان بتركيا بتحتاج شهادة ثانوية بمعدل 85% وما فوق، وشهادة إتمام دورة اللغة (YÖS أو SAT).',
    time: '10:32',
  },
  {
    role: 'out',
    text: 'الأقساط بتبدأ من 6,500$ سنوياً بالجامعات الحكومية. بتحب أرسلك مقارنة كاملة بين 3 جامعات؟',
    time: '10:32',
  },
  {
    role: 'in',
    text: 'اي رائع، ابعتلي المقارنة 🙏',
    time: '10:33',
  },
]

function Bubble({
  role,
  text,
  time,
  delay,
}: {
  role: string
  text: string
  time: string
  delay: number
}) {
  const isOut = role === 'out'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={`flex ${isOut ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`relative max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed shadow-sm ${
          isOut
            ? 'rounded-bl-md bg-[#e69605]/12 text-foreground'
            : 'rounded-br-md bg-card text-foreground ring-1 ring-inset ring-border'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-[10px] text-muted-foreground">{time}</span>
          {isOut && <Checks weight="bold" className="h-3.5 w-3.5 text-[#25D366]" />}
        </div>
      </div>
    </motion.div>
  )
}

export function WhatsappWindow() {
  return (
    <div className="relative mx-auto w-full max-w-[380px]" dir="rtl">
      {/* Phone frame */}
      <div className="relative overflow-hidden rounded-[2.4rem] border border-border bg-card p-2.5 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.35)]">
        {/* Notch */}
        <div className="absolute left-1/2 top-2.5 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-foreground/90" />

        <div className="overflow-hidden rounded-[1.9rem] bg-background">
          {/* App header */}
          <div className="flex items-center justify-between gap-2 bg-[#075E54] px-4 pb-3 pt-8 text-white">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
                MA
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-none">محمد الأحمد</p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                  يكتب الآن…
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <VideoCamera weight="fill" className="h-4 w-4" />
              <Phone weight="fill" className="h-4 w-4" />
              <DotsThreeVertical weight="bold" className="h-4 w-4" />
            </div>
          </div>

          {/* Automation banner */}
          <div className="flex items-center justify-center gap-1.5 bg-[#e69605]/10 py-1.5 text-[10.5px] font-medium text-[#b37400]">
            <WhatsappLogo weight="fill" className="h-3.5 w-3.5" />
            الرد آلي عبر Intilaqa · متصل بقاعدة معرفة الجامعات
          </div>

          {/* Chat body */}
          <div
            className="flex flex-col gap-2 px-3.5 py-4"
            style={{
              backgroundColor: '#e5ddd5',
              backgroundImage:
                'radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          >
            <div className="mx-auto rounded-full bg-white/70 px-3 py-1 text-[10px] font-medium text-muted-foreground shadow-sm">
              اليوم
            </div>
            {conversation.map((m, i) => (
              <Bubble key={i} {...m} delay={0.15 + i * 0.35} />
            ))}

            {/* typing */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + conversation.length * 0.35 }}
              className="flex justify-end"
            >
              <div className="flex items-center gap-1 rounded-2xl rounded-br-md bg-card px-3 py-2.5 shadow-sm ring-1 ring-inset ring-border">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Input bar */}
          <div className="flex items-center gap-2 bg-[#f0f0f0] px-3 py-2.5">
            <Plus weight="bold" className="h-4 w-4 shrink-0 text-[#54656f]" />
            <div className="flex-1 rounded-full bg-white px-3 py-2 text-[12px] text-muted-foreground">
              اكتب رسالة…
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#075E54] text-white">
              <Microphone weight="fill" className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
