"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-[100vh] snap-center snap-always" dir="rtl">
      <div className="w-full max-w-6xl mx-auto px-4 relative z-20">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          
          <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 md:py-24 max-w-3xl mx-auto">

            
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-foreground mb-4 text-balance">
              جاهز للارتقاء بأداء شركتك؟
            </h2>
            
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground mb-10 max-w-xl mx-auto text-pretty">
              تخلّص من الردود التقليدية البطيئة، واجعل لشركتك واجهة ذكية تعمل على مدار الساعة بثقة واحترافية. لا يلزم وجود فريق تقني للبدء.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ backgroundColor: "#e69605", color: "#ffffff" }}
              >
                <span>ابدأ الآن مجاناً</span>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
              
              <Link
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border transition-all duration-300"
              >
                <span>تحدث مع المبيعات</span>
              </Link>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                <span>بدون بطاقة ائتمان</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>جاهز للعمل في دقائق</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
