export type ChannelStatus = "bot" | "human" | "waiting"

export type ReceiptStatus = "sent" | "delivered" | "read"

export type MessageDirection = "incoming" | "outgoing"

export interface QuotedMessage {
  author: string
  text: string
}

export interface ChatMessage {
  id: string
  direction: MessageDirection
  text: string
  time: string
  /** ISO day key used for date separators */
  day: string
  dayLabel: string
  receipt?: ReceiptStatus
  quoted?: QuotedMessage
  mediaObj?: any
}

export interface Contact {
  id: string
  name: string
  initials: string
  /** avatar accent tone */
  tone: string
  lastMessage: string
  lastMessageFromMe?: boolean
  lastMessageReceipt?: ReceiptStatus
  timestamp: string
  unread: number
  status: ChannelStatus
  online: boolean
  phone: string
  email: string
  tags: string[]
  note: string
  messages: ChatMessage[]
}

export const statusLabels: Record<ChannelStatus, string> = {
  bot: "البوت يتولى المحادثة",
  human: "موظف بشري",
  waiting: "بانتظار موظف",
}

export const contacts: Contact[] = [
  {
    id: "1",
    name: "سارة العتيبي",
    initials: "س ع",
    tone: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    lastMessage: "شكراً جزيلاً، الطلب وصل بحالة ممتازة 🌟",
    timestamp: "الآن",
    unread: 3,
    status: "waiting",
    online: true,
    phone: "+966 55 123 4567",
    email: "sara.otaibi@example.com",
    tags: ["عميل مميز", "الرياض", "متجر"],
    note: "تفضّل التواصل في المساء. مهتمة بالباقة السنوية.",
    messages: [
      {
        id: "m1",
        direction: "incoming",
        text: "مرحباً، كيف يمكنني مساعدتك؟",
        time: "9:12 ص",
        day: "2024-06-01",
        dayLabel: "أمس",
      },
      {
        id: "m2",
        direction: "outgoing",
        text: "أهلاً سارة! يسعدنا خدمتك. طلبك رقم ‎#48213‎ قيد الشحن الآن.",
        time: "9:14 ص",
        day: "2024-06-01",
        dayLabel: "أمس",
        receipt: "read",
      },
      {
        id: "m3",
        direction: "incoming",
        text: "متى تتوقعون وصوله تقريباً؟",
        time: "8:02 ص",
        day: "2024-06-02",
        dayLabel: "اليوم",
        quoted: {
          author: "أنت",
          text: "طلبك رقم ‎#48213‎ قيد الشحن الآن.",
        },
      },
      {
        id: "m4",
        direction: "outgoing",
        text: "من المتوقع وصوله خلال يومي عمل كحد أقصى. سنرسل لك رابط التتبع فور خروجه من المستودع.",
        time: "8:05 ص",
        day: "2024-06-02",
        dayLabel: "اليوم",
        receipt: "read",
      },
      {
        id: "m5",
        direction: "incoming",
        text: "شكراً جزيلاً، الطلب وصل بحالة ممتازة 🌟",
        time: "8:40 ص",
        day: "2024-06-02",
        dayLabel: "اليوم",
      },
    ],
  },
  {
    id: "2",
    name: "خالد المنصور",
    initials: "خ م",
    tone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    lastMessage: "تمام، سأنتظر عرض السعر المفصّل.",
    timestamp: "10:24 ص",
    unread: 0,
    status: "human",
    online: true,
    phone: "+966 50 987 6543",
    email: "khalid.m@example.com",
    tags: ["مبيعات", "جدة", "B2B"],
    note: "شركة متوسطة الحجم — 40 موظف. يحتاج فاتورة ضريبية.",
    messages: [
      {
        id: "m1",
        direction: "incoming",
        text: "السلام عليكم، أبحث عن باقة مناسبة لفريق من ٤٠ موظف.",
        time: "10:10 ص",
        day: "2024-06-02",
        dayLabel: "اليوم",
      },
      {
        id: "m2",
        direction: "outgoing",
        text: "وعليكم السلام أستاذ خالد! لدينا الباقة الاحترافية التي تناسب فرق العمل. أجهّز لك عرض سعر الآن.",
        time: "10:18 ص",
        day: "2024-06-02",
        dayLabel: "اليوم",
        receipt: "read",
      },
      {
        id: "m3",
        direction: "incoming",
        text: "تمام، سأنتظر عرض السعر المفصّل.",
        time: "10:24 ص",
        day: "2024-06-02",
        dayLabel: "اليوم",
      },
    ],
  },
  {
    id: "3",
    name: "نورة الحربي",
    initials: "ن ح",
    tone: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    lastMessage: "هل يوجد خصم على الاشتراك السنوي؟",
    timestamp: "9:47 ص",
    unread: 1,
    status: "bot",
    online: false,
    phone: "+966 53 445 2211",
    email: "noura.h@example.com",
    tags: ["استفسار", "الدمام"],
    note: "أول تواصل — لم يتم التحويل بعد.",
    messages: [
      {
        id: "m1",
        direction: "incoming",
        text: "مرحباً، هل يوجد خصم على الاشتراك السنوي؟",
        time: "9:47 ص",
        day: "2024-06-02",
        dayLabel: "اليوم",
      },
      {
        id: "m2",
        direction: "outgoing",
        text: "أهلاً بك! نعم، يوجد خصم ٢٠٪ عند الاشتراك السنوي مقارنة بالدفع الشهري.",
        time: "9:47 ص",
        day: "2024-06-02",
        dayLabel: "اليوم",
        receipt: "delivered",
      },
    ],
  },
  {
    id: "4",
    name: "عبدالله القحطاني",
    initials: "ع ق",
    tone: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    lastMessage: "تم إلغاء الطلب، أحتاج استرجاع المبلغ.",
    timestamp: "أمس",
    unread: 0,
    status: "human",
    online: false,
    phone: "+966 56 778 9900",
    email: "abdullah.q@example.com",
    tags: ["دعم", "استرجاع"],
    note: "طلب استرجاع قيد المعالجة من قسم المالية.",
    messages: [
      {
        id: "m1",
        direction: "incoming",
        text: "تم إلغاء الطلب، أحتاج استرجاع المبلغ.",
        time: "6:30 م",
        day: "2024-06-01",
        dayLabel: "أمس",
      },
    ],
  },
  {
    id: "5",
    name: "ريم الشمري",
    initials: "ر ش",
    tone: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    lastMessage: "رائع! سأجرب النسخة التجريبية اليوم.",
    timestamp: "أمس",
    unread: 0,
    status: "bot",
    online: false,
    phone: "+966 59 112 3344",
    email: "reem.sh@example.com",
    tags: ["تجربة مجانية", "مسوّقة"],
    note: "مهتمة بميزات الأتمتة والردود الذكية.",
    messages: [
      {
        id: "m1",
        direction: "incoming",
        text: "هل يمكنني تجربة المنصة قبل الاشتراك؟",
        time: "4:15 م",
        day: "2024-06-01",
        dayLabel: "أمس",
      },
      {
        id: "m2",
        direction: "outgoing",
        text: "بالتأكيد! نوفر نسخة تجريبية مجانية لمدة ١٤ يوماً بدون بطاقة ائتمانية.",
        time: "4:16 م",
        day: "2024-06-01",
        dayLabel: "أمس",
        receipt: "read",
      },
      {
        id: "m3",
        direction: "incoming",
        text: "رائع! سأجرب النسخة التجريبية اليوم.",
        time: "4:20 م",
        day: "2024-06-01",
        dayLabel: "أمس",
      },
    ],
  },
  {
    id: "6",
    name: "فهد الدوسري",
    initials: "ف د",
    tone: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    lastMessage: "شكراً لكم على الخدمة الممتازة.",
    timestamp: "الاثنين",
    unread: 0,
    status: "human",
    online: false,
    phone: "+966 54 667 8899",
    email: "fahd.d@example.com",
    tags: ["عميل حالي"],
    note: "عميل منذ ٢٠٢٢ — راضٍ عن الخدمة.",
    messages: [
      {
        id: "m1",
        direction: "incoming",
        text: "شكراً لكم على الخدمة الممتازة.",
        time: "1:05 م",
        day: "2024-05-27",
        dayLabel: "الاثنين",
      },
    ],
  },
]
