'use client'

import { motion } from 'motion/react'
import { PaperPlaneRight, X, ArrowsClockwise, Sparkle, Lock } from '@phosphor-icons/react'

const chat = [
  { role: 'bot', text: 'أهلاً بك في أكاديمية المستقبل 👋 كيف أقدر أساعدك اليوم؟' },
  { role: 'user', text: 'متى يبدأ التسجيل للفصل القادم؟' },
  {
    role: 'bot',
    text: 'يبدأ التسجيل يوم 15 أيلول ويستمر لمدة أسبوعين. تحب أرسل لك رابط التسجيل المباشر؟',
  },
]

export function WidgetWindow() {
  return (
    <div className="relative mx-auto w-full">
      {/* Browser frame */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_90px_-30px_rgba(0,0,0,0.35)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-border bg-secondary px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex w-[min(60%,320px)] items-center justify-center gap-2 rounded-lg bg-background px-3 py-1.5 text-[11px] text-muted-foreground">
            <Lock weight="fill" className="h-3 w-3 text-[#28c840]" />
            future-academy.com
          </div>
        </div>

        {/* Faux website canvas */}
        <div
          className="relative h-[440px] overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(120% 80% at 20% 0%, rgba(230,150,5,0.10), transparent 60%), radial-gradient(100% 90% at 100% 30%, rgba(113,113,122,0.10), transparent 55%)',
          }}
        >
          {/* dimmed page content mock */}
          <div className="pointer-events-none select-none p-8 opacity-40" dir="rtl">
            <div className="h-3 w-24 rounded-full bg-foreground/20" />
            <div className="mt-6 h-8 w-4/5 rounded-lg bg-foreground/25" />
            <div className="mt-3 h-8 w-2/3 rounded-lg bg-foreground/15" />
            <div className="mt-6 h-3 w-full rounded-full bg-foreground/10" />
            <div className="mt-2 h-3 w-11/12 rounded-full bg-foreground/10" />
            <div className="mt-2 h-3 w-3/4 rounded-full bg-foreground/10" />
            <div className="mt-8 flex gap-3">
              <div className="h-9 w-32 rounded-xl bg-[#e69605]/50" />
              <div className="h-9 w-28 rounded-xl bg-foreground/10" />
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-foreground/10" />
              ))}
            </div>
          </div>

          {/* The embedded widget */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-5 left-5 flex w-[300px] flex-col overflow-hidden rounded-[22px] border border-border bg-card shadow-2xl"
            dir="rtl"
          >
            {/* widget header */}
            <div className="flex items-center justify-between bg-[#e69605] px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Sparkle weight="fill" className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-none">مساعد الأكاديمية</p>
                  <p className="mt-1 text-[10.5px] text-white/80">يرد خلال ثوانٍ</p>
                </div>
              </div>
              <X weight="bold" className="h-4 w-4 text-white/70" />
            </div>

            {/* widget messages */}
            <div className="flex flex-col gap-2.5 bg-background px-3.5 py-4">
              {chat.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.4, duration: 0.4 }}
                  className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-[12.5px] leading-relaxed ${
                      m.role === 'user'
                        ? 'rounded-br-md bg-[#e69605] text-white'
                        : 'rounded-bl-md bg-secondary text-foreground'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + chat.length * 0.4 }}
                className="flex justify-end"
              >
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-secondary px-3 py-2.5">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-[#e69605]"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* widget input */}
            <div className="border-t border-border bg-card px-3 py-3">
              <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2">
                <span className="flex-1 text-[12px] text-muted-foreground">اسأل أي سؤال…</span>
                <PaperPlaneRight weight="fill" className="h-4 w-4 text-[#e69605]" />
              </div>
              <div className="mt-2 flex items-center justify-between px-1">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ArrowsClockwise className="h-3 w-3" /> سؤال جديد
                </span>
                <span className="text-[10px] text-muted-foreground" dir="ltr">
                  Powered by <span className="font-semibold text-[#e69605]">Intilaqa</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* launcher bubble */}
          <div className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#e69605] text-white shadow-lg">
            <Sparkle weight="fill" className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  )
}
