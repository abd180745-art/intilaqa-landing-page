"use client";

import { motion } from "framer-motion";
import { Globe, Users, CheckCircle2 } from "lucide-react";

export default function VersionsSection() {
  return (
    <section id="versions" className="relative z-10 flex flex-col items-center pt-24 pb-12 overflow-hidden" dir="rtl">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >


          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-foreground mb-3 text-balance text-right">
            نوفر لك بوت ذكاء اصطناعي <span className="text-primary">مزدوج المهام</span>
          </h2>

          <p className="in-text-regular text-muted-foreground max-w-2xl mx-auto text-pretty">
            لأن احتياجات عملائك تختلف عن احتياجات فريقك، قمنا بتطوير نسختين منفصلتين تعتمدان على نفس الذكاء لتقديم أفضل تجربة لجميع الأطراف.
          </p>
        </motion.div>

        {/* The Two Versions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Version 1: Website / Customers */}
          <motion.div
            className="group relative flex flex-col rounded-[2.5rem] glass-strong p-8 md:p-12 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(230,150,5,0.2)] border border-white/20 overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 transition-opacity group-hover:opacity-100 opacity-50" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl silver-surface flex items-center justify-center shadow-lg border border-white/40">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <span className="in-pill bg-background/50 border border-border text-xs text-foreground/70">
                  لواجهة الجمهور
                </span>
              </div>
              
              <h3 className="in-title-card text-foreground mb-4">
                نسخة الموقع الإلكتروني
                <br />
                <span className="text-muted-foreground text-lg font-medium mt-2 block">Customer-Facing Bot</span>
              </h3>
              
              <p className="in-text-body text-foreground/70 mb-8 leading-relaxed">
                واجهة ذكية تتفاعل مع زوار موقعك أو منصاتك على مدار الساعة، تجيب على الاستفسارات، وتحول الزوار إلى عملاء محتملين بطريقة تفاعلية وسلسة.
              </p>
              
              <div className="mt-auto space-y-4">
                {[
                  "خدمة عملاء مستمرة 24/7 بلغات متعددة",
                  "حجز المواعيد واستقبال طلبات المبيعات آلياً",
                  "تحليل نية العميل وتوجيهه للقسم المختص",
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="in-text-small text-foreground/80 font-bold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Version 2: Employees / Internal */}
          <motion.div
            className="group relative flex flex-col rounded-[2.5rem] glass-strong p-8 md:p-12 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(45,99,166,0.2)] border border-white/20 overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2D63A6]/10 rounded-full blur-[80px] -ml-20 -mb-20 transition-opacity group-hover:opacity-100 opacity-50" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl silver-surface flex items-center justify-center shadow-lg border border-white/40">
                  <Users className="w-8 h-8 text-[#2D63A6]" />
                </div>
                <span className="in-pill bg-background/50 border border-border text-xs text-foreground/70">
                  للاستخدام الداخلي
                </span>
              </div>
              
              <h3 className="in-title-card text-foreground mb-4">
                نسخة فريق العمل
                <br />
                <span className="text-muted-foreground text-lg font-medium mt-2 block">Employee-Facing Bot</span>
              </h3>
              
              <p className="in-text-body text-foreground/70 mb-8 leading-relaxed">
                مساعد ذكي خاص بموظفيك، مدرب على كافة سياسات الشركة الداخلية وقواعد البيانات، يغنيهم عن البحث الطويل ويسرّع اندماج الموظفين الجدد.
              </p>
              
              <div className="mt-auto space-y-4">
                {[
                  "وصول فوري لجميع أدلة وإجراءات الشركة",
                  "تقليل وقت تدريب الموظفين الجدد (Onboarding) للصفر",
                  "مستوى أعلى من الصلاحيات والوصول لقواعد البيانات الداخلية",
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#2D63A6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2D63A6]" />
                    </div>
                    <span className="in-text-small text-foreground/80 font-bold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
