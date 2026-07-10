"use client";

import { motion } from "framer-motion";
import { GraduationCap, Building2, Truck, Check, ArrowLeft } from "lucide-react";

type Industry = {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  tagline: string;
  features: string[];
  isAvailable?: boolean;
};

const INDUSTRIES: Industry[] = [
  {
    icon: GraduationCap,
    name: "الاستشارات التعليميّة",
    tagline: "بوت يقترح البرامج الجامعيّة ويُرتّب القبول.",
    features: [
      "مطابقة المعدّل والميزانية فورًا",
      "حجز جلسات استشارة من المحادثة",
      "تنبيهات مواعيد التقديم تلقائيًّا",
    ],
    isAvailable: true,
  },
  {
    icon: Truck,
    name: "الخدمات اللوجستية",
    tagline: "بوت يتابع الشحنات ويجيب على استفسارات التوصيل.",
    features: [
      "تتبع الشحنات برقم البوليصة فوراً",
      "إعادة جدولة مواعيد التوصيل",
      "معالجة الشكاوى والتعويضات آلياً",
    ],
    isAvailable: false,
  },
  {
    icon: Building2,
    name: "العقارات",
    tagline: "بوت يعرض الوحدات ويحجز المعاينات.",
    features: [
      "فلترة فوريّة حسب السعر والموقع",
      "جولات افتراضيّة داخل المحادثة",
      "توقيع وثائق الحجز رقميًّا",
    ],
    isAvailable: false,
  },
];

export default function ProductSection() {
  return (
    <section id="product" className="relative z-10 flex flex-col items-center" style={{ paddingTop: "6%", paddingBottom: "6%" }}>
      <div className="w-full max-w-6xl mx-auto px-4 flex flex-col gap-8">
        <motion.div
          className="text-right"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-foreground mb-3 text-balance text-right">
            بوتات ذكاء اصطناعيّ <span className="text-primary">مُتخصِّصة</span>،
            <br />
            جاهزة من اليوم الأوّل.
          </h2>

          <p className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-xl ml-auto text-pretty text-right">
            نحن نبني، نُدرّب، ونُشغّل لك بوتًا متخصّصًا في مجال عملك—ببياناته، قواعده،
            وخبرة الصناعة جاهزة من أوّل يوم—على بنيتنا التحتية بالكامل، باشتراك شهريّ
            واحد. لا فرق تقنيّة، لا إعداد، فقط منتج جاهز يعمل.
          </p>
        </motion.div>

        {/* Three industry cards */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {INDUSTRIES.map((industry) => (
            <IndustryCard key={industry.name} industry={industry} />
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-foreground/65 mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-1 font-bold text-primary">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#e69605" }}
              aria-hidden="true"
            />
            اشتراك شهريّ ثابت
          </span>
          <span className="h-3 w-px bg-border" aria-hidden="true" />
          <span>بدون رسوم إعداد</span>
          <span className="h-3 w-px bg-border" aria-hidden="true" />
          <span>إلغاء في أيّ وقت</span>
          <span className="h-3 w-px bg-border" aria-hidden="true" />
          <span>بياناتك تبقى ملكك</span>
        </motion.div>
      </div>
    </section>
  );
}

function IndustryCard({ industry }: { industry: Industry }) {
  const { icon: Icon, name, tagline, features } = industry;

  return (
    <motion.article
      className="group relative flex flex-col gap-3 rounded-2xl glass p-5 lg:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-16px_rgba(230,150,5,0.4)]"
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
    >
      <div className="glass-highlight-top opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Top row */}
      <div className="flex items-center justify-between">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl silver-surface"
          aria-hidden="true"
        >
          <Icon className="h-4 w-4 text-white" />
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide"
          style={{ backgroundColor: "#18181b", color: "#ffffff" }}
        >
          اشتراك شهريّ
        </span>
      </div>

      {/* Title */}
      <div className="text-right mt-1">
        <h3 className="text-base md:text-lg font-semibold leading-tight text-foreground mb-1">
          {name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
          {tagline}
        </p>
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-2 text-right mt-1">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start justify-end gap-2 text-xs text-foreground/80 leading-relaxed"
          >
            <span className="flex-1">{feature}</span>
            <span
              className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10"
              aria-hidden="true"
            >
              <Check className="h-2.5 w-2.5 text-primary" />
            </span>
          </li>
        ))}
      </ul>

      {/* Footer CTA row */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border min-h-[44px]">
        {industry.isAvailable ? (
          <>
            <span className="text-xs font-medium text-muted-foreground tracking-wide">
              جاهز للتشغيل
            </span>
            <span
              className="text-xs inline-flex items-center gap-1 font-bold transition-transform duration-200 group-hover:-translate-x-1 text-primary cursor-pointer"
            >
              اطلب البوت
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </>
        ) : (
          <span className="text-xs font-medium text-muted-foreground tracking-wide bg-foreground/5 px-4 py-1.5 rounded-full mx-auto w-full text-center">
            قريباً ...
          </span>
        )}
      </div>
    </motion.article>
  );
}
