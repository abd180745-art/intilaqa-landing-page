'use client'

import { motion } from 'motion/react'
import {
  Checks,
  DotsThreeVertical,
  MagnifyingGlass,
  Plus,
  Microphone,
  Smiley,
  WhatsappLogo,
} from '@phosphor-icons/react'

const conversation = [
  {
    role: 'in',
    text: 'مرحباً، شو شروط القبول لتخصص طب الأسنان بتركيا؟',
    time: '10:32',
  },
  {
    role: 'out',
    text: 'أهلاً فيك! لتخصص طب الأسنان بتحتاج معدل 85% وما فوق بالثانوية، وشهادة YÖS أو SAT.',
    time: '10:32',
  },
  {
    role: 'out',
    text: 'الأقساط تبدأ من 6,500$ سنوياً. أرسلك مقارنة بين 3 جامعات؟',
    time: '10:32',
  },
  {
    role: 'in',
    text: 'اي رائع، ابعتلي المقارنة 🙏',
    time: '10:33',
  },
]

const chatList = [
  { name: 'محمد الأحمد', msg: 'اي رائع، ابعتلي المقارنة 🙏', time: '10:33', active: true, unread: 0 },
  { name: 'سارة خليل', msg: 'شكراً كتير، استفدت 🌟', time: '09:58', active: false, unread: 0 },
  { name: 'عمر ديب', msg: 'قديش رسوم السنة التحضيرية؟', time: '09:41', active: false, unread: 2 },
  { name: 'لين حمود', msg: 'تم التسجيل بنجاح ✅', time: 'أمس', active: false, unread: 0 },
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
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.35, ease: 'easeOut' }}
      className={`flex ${isOut ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`relative max-w-[78%] rounded-lg px-2.5 py-1.5 text-[11.5px] leading-relaxed shadow-sm ${
          isOut
            ? 'rounded-tl-none bg-[#d9fdd3] text-[#111b21]'
            : 'rounded-tr-none bg-white text-[#111b21]'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
        <div className="mt-0.5 flex items-center justify-end gap-1">
          <span className="text-[9px] text-[#667781]">{time}</span>
          {isOut && <Checks weight="bold" className="h-3 w-3 text-[#53bdeb]" />}
        </div>
      </div>
    </motion.div>
  )
}

export function WhatsappWindow() {
  return (
    <div
      className="flex h-full w-full overflow-hidden rounded-xl border border-border bg-white text-[#111b21] shadow-sm"
      dir="rtl"
    >
      {/* Sidebar: chat list */}
      <div className="hidden w-[38%] min-w-[170px] shrink-0 flex-col border-l border-[#e9edef] bg-white sm:flex">
        {/* sidebar header */}
        <div className="flex items-center justify-between bg-[#f0f2f5] px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00a884] text-[11px] font-bold text-white">
            IN
          </span>
          <div className="flex items-center gap-3 text-[#54656f]">
            <Plus weight="bold" className="h-4 w-4" />
            <DotsThreeVertical weight="bold" className="h-4 w-4" />
          </div>
        </div>
        {/* search */}
        <div className="px-2.5 py-2">
          <div className="flex items-center gap-2 rounded-lg bg-[#f0f2f5] px-3 py-1.5 text-[11px] text-[#667781]">
            <MagnifyingGlass className="h-3.5 w-3.5" />
            بحث أو بدء محادثة
          </div>
        </div>
        {/* chats */}
        <div className="flex-1 overflow-hidden">
          {chatList.map((c) => (
            <div
              key={c.name}
              className={`flex items-center gap-2.5 border-b border-[#f0f2f5] px-3 py-2.5 ${
                c.active ? 'bg-[#f0f2f5]' : ''
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e69605]/15 text-[11px] font-semibold text-[#b37400]">
                {c.name.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[12px] font-semibold">{c.name}</p>
                  <span className="shrink-0 text-[9px] text-[#667781]">{c.time}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[10.5px] text-[#667781]">{c.msg}</p>
                  {c.unread > 0 && (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-[8.5px] font-bold text-white">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* chat header */}
        <div className="flex items-center justify-between bg-[#f0f2f5] px-3.5 py-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e69605]/15 text-[11px] font-semibold text-[#b37400]">
              م
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-semibold leading-none">محمد الأحمد</p>
              <p className="mt-0.5 text-[10px] text-[#667781]">متصل الآن</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[#54656f]">
            <MagnifyingGlass className="h-4 w-4" />
            <DotsThreeVertical weight="bold" className="h-4 w-4" />
          </div>
        </div>

        {/* automation strip */}
        <div className="flex items-center justify-center gap-1.5 bg-[#e69605]/10 py-1 text-[9.5px] font-medium text-[#b37400]">
          <WhatsappLogo weight="fill" className="h-3 w-3" />
          الرد آلي عبر Intilaqa · متصل بقاعدة المعرفة
        </div>

        {/* messages */}
        <div
          className="flex flex-1 flex-col gap-1.5 overflow-hidden px-3 py-3"
          style={{
            backgroundColor: '#efeae2',
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        >
          <div className="mx-auto rounded-md bg-white/80 px-2.5 py-0.5 text-[9px] font-medium text-[#667781] shadow-sm">
            اليوم
          </div>
          {conversation.map((m, i) => (
            <Bubble key={i} {...m} delay={0.15 + i * 0.3} />
          ))}
          {/* typing */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + conversation.length * 0.3 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-1 rounded-lg rounded-tl-none bg-[#d9fdd3] px-2.5 py-2 shadow-sm">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="h-1 w-1 rounded-full bg-[#667781]"
                  animate={{ y: [0, -2.5, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* input bar */}
        <div className="flex items-center gap-2 bg-[#f0f2f5] px-3 py-2">
          <Smiley className="h-[18px] w-[18px] shrink-0 text-[#54656f]" />
          <Plus weight="bold" className="h-4 w-4 shrink-0 text-[#54656f]" />
          <div className="flex-1 rounded-lg bg-white px-3 py-1.5 text-[11px] text-[#667781]">
            اكتب رسالة…
          </div>
          <Microphone className="h-[18px] w-[18px] shrink-0 text-[#54656f]" />
        </div>
      </div>
    </div>
  )
}
