"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Building2, UserCircle, Briefcase, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { createClient } from "@/utils/supabase/client";

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  isPopular?: boolean;
  buttonText: string;
  priceId?: string; // Add optional priceId for Paddle mapping
};

const tiers: PricingTier[] = [
  {
    name: "الباقة الأساسية",
    price: "30$",
    description: "مثالية للشركات الناشئة والمشاريع الصغيرة للبدء بخدمة عملاء ذكية.",
    icon: <UserCircle className="w-5 h-5" />,
    features: [
      "بوت خدمة عملاء واحد",
      "5,000,000 توكن شهرياً",
      "تدريب على بيانات الشركة الأساسية",
      "لوحة تحكم وتحليلات أساسية",
      "دعم فني قياسي",
    ],
    buttonText: "اشترك الآن",
    priceId: process.env.NEXT_PUBLIC_PADDLE_BASIC_PRICE_ID,
  },
  {
    name: "الباقة الاحترافية",
    price: "50$",
    description: "للشركات النامية التي تحتاج إلى قدرات أعلى وتفاعلات أكثر.",
    icon: <Briefcase className="w-5 h-5" />,
    isPopular: true,
    features: [
      "بوت خدمة عملاء متقدم",
      "15,000,000 توكن شهرياً",
      "تحديث وتدريب مستمر للبيانات",
      "تقارير تحليلية مفصلة",
      "أولوية في الدعم الفني",
    ],
    buttonText: "اشترك الآن",
    // Link to the real price ID configured in .env.local
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID,
  },
  {
    name: "الباقة الشاملة",
    price: "150$",
    description: "الحل الكامل الذي يدمج بين خدمة العملاء وتمكين الموظفين الداخليين.",
    icon: <Building2 className="w-5 h-5" />,
    features: [
      "يشمل مساعد الموظفين الداخلي",
      "بوت خدمة عملاء متقدم",
      "50,000,000 توكن شهرياً",
      "تكامل مع أنظمتك الداخلية (API)",
      "مدير حساب مخصص",
    ],
    buttonText: "اشترك الآن",
    priceId: process.env.NEXT_PUBLIC_PADDLE_ULTIMATE_PRICE_ID,
  },
  {
    name: "باقة الشركات",
    price: "مخصص",
    description: "حلول مفصلة للشركات الكبرى ومتطلبات الأمان العالية.",
    icon: <Sparkles className="w-5 h-5" />,
    features: [
      "نظام وكلاء متعدد (Multi-Agent)",
      "رسائل وطلبات غير محدودة",
      "نشر سحابي خاص (Private Cloud)",
      "تكامل شامل مع أنظمة ERP/CRM",
      "دعم فني استشاري 24/7",
    ],
    buttonText: "تواصل معنا",
  },
];

export default function PricingSection() {
  const router = useRouter();
  const [paddle, setPaddle] = useState<Paddle>();
  const [userId, setUserId] = useState<string>("");
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(false);
  const supabase = createClient();

  useEffect(() => {
    // 1. Get user ID and check subscription status
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        
        // Check if user has an active subscription
        supabase
          .from('clients_balances')
          .select('paddle_subscription_id, subscription_status')
          .eq('user_id', data.user.id)
          .single()
          .then(({ data: clientData }) => {
            if (clientData?.paddle_subscription_id && clientData?.subscription_status === 'active') {
              setHasActiveSubscription(true);
            }
          });
      }
    });

    // 2. Initialize Paddle
    const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production";

    if (clientToken) {
      initializePaddle({ environment: environment || "sandbox", token: clientToken }).then(
        (paddleInstance) => {
          if (paddleInstance) {
            setPaddle(paddleInstance);
          }
        }
      );
    }
  }, [supabase]);

  const handleCheckout = (tier: PricingTier) => {
    // If the tier doesn't have a priceId mapped, ignore or show coming soon
    if (!tier.priceId) {
      alert("هذه الباقة غير متاحة للدفع المباشر حالياً. يرجى التواصل معنا.");
      return;
    }

    // Require Login first
    if (!userId) {
      router.push("/login?next=/#pricing");
      return;
    }

    // If user already has a subscription, redirect to dashboard billing
    if (hasActiveSubscription) {
      router.push("/dashboard");
      return;
    }

    // Require Paddle initialized
    if (!paddle) {
      alert("جاري تحميل بوابة الدفع، يرجى الانتظار لحظة...");
      return;
    }

    // New subscription flow
    paddle.Checkout.open({
      items: [{ priceId: tier.priceId, quantity: 1 }],
      customData: {
        userId: userId,
      },
    });
  };

  return (
    <section id="pricing" className="relative z-10 flex flex-col items-center py-20 md:py-32" dir="rtl">
      <div className="w-full max-w-[100vw] overflow-hidden flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center mb-16">
          <motion.div
            className="text-center max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-foreground mb-4 text-balance">
              استثمار بسيط، <span className="text-primary">عائد مضاعف</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground text-pretty">
              اختر الباقة التي تناسب حجم شركتك واحتياجاتك. أسعارنا واضحة وشفافة بدون أي رسوم خفية، لتبدأ رحلتك في عالم الذكاء الاصطناعي بثقة.
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards (3 + 1 Layout) */}
        <div className="w-full max-w-7xl mx-auto px-4">
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
            className="flex flex-wrap justify-center gap-6 md:gap-8 w-full"
          >
            {tiers.map((tier) => (
              <motion.div
                key={tier.name}
                className={`relative flex flex-col w-full max-w-[360px] rounded-3xl p-6 md:p-8 transition-all duration-300 ${
                  tier.isPopular 
                    ? "bg-card border-2 border-primary shadow-[0_24px_50px_-12px_rgba(230,150,5,0.25)] md:-translate-y-2 z-10" 
                    : "bg-card border border-border shadow-sm hover:shadow-lg"
                }`}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
              >
                {/* Popular Badge */}
                {tier.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    الأكثر طلباً
                  </div>
                )}

                {/* Card Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl ${tier.isPopular ? "bg-primary/10 text-primary" : "bg-foreground/5 text-foreground"}`}>
                    {tier.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground">{tier.price}</span>
                    {tier.price !== "مخصص" && <span className="text-sm font-medium text-muted-foreground">/ شهرياً</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed min-h-[40px]">
                    {tier.description}
                  </p>
                </div>

                <div className="h-px w-full bg-border my-6" />

                {/* Features List */}
                <ul className="flex flex-col gap-3.5 mb-8 flex-1">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-success" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-foreground/80 leading-relaxed font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button 
                  onClick={() => tier.priceId ? handleCheckout(tier) : null}
                  className={`w-full py-3.5 flex justify-center items-center gap-2 rounded-full font-bold text-sm transition-all duration-300 mt-auto ${
                    tier.isPopular
                      ? "bg-primary text-white hover:shadow-lg hover:shadow-primary/30 hover:bg-primary/90"
                      : "bg-foreground/5 text-foreground hover:bg-foreground/10 border border-border"
                  }`}
                >
                  {tier.priceId && <CreditCard className="w-4 h-4" />}
                  {tier.buttonText}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
