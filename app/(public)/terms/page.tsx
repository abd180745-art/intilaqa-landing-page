"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-background z-0" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <main className="relative z-10 pt-32 pb-24 px-4 w-full max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            شروط <span className="text-primary">الاستخدام</span>
          </h1>
          <p className="text-muted-foreground">آخر تحديث: يونيو 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground"
        >
          <div className="glass-strong p-8 md:p-12 rounded-3xl border border-white/10 shadow-lg space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. القبول بالشروط</h2>
              <p className="leading-relaxed">
                مرحباً بك في "انطلاقة" (Intilaqa AI). باستخدامك لمنصتنا أو خدماتنا، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. وصف الخدمة</h2>
              <p className="leading-relaxed">
                تقدم "انطلاقة" منصة برمجية (SaaS) لبناء وإدارة وكلاء ذكاء اصطناعي مخصصين لقطاعات الأعمال المختلفة (مثل الاستشارات، العقارات، والعيادات). نحن نوفر البنية التحتية، لوحة التحكم، ونقاط الربط (APIs) مع قنوات التواصل كـ WhatsApp وغيرها.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. التزامات العميل</h2>
              <ul className="list-disc list-inside space-y-2 marker:text-primary">
                <li><strong>دقة البيانات:</strong> أنت مسؤول عن دقة وشرعية الملفات والبيانات التي ترفعها لتدريب الوكيل الذكي الخاص بك.</li>
                <li><strong>الاستخدام القانوني:</strong> يمنع استخدام خدماتنا لبناء وكلاء يقومون بأنشطة احتيالية، مضللة، أو تنتهك حقوق الملكية الفكرية لطرف ثالث.</li>
                <li><strong>سياسات واتساب:</strong> عند ربط الوكيل بتطبيق واتساب، فأنت ملزم بالامتثال لشروط وسياسات التجارة الخاصة بـ WhatsApp (WhatsApp Commerce Policy).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. الفواتير والاشتراكات</h2>
              <p className="leading-relaxed">
                تُقدم خدماتنا بنظام الاشتراكات (شهري / سنوي). يتم تجديد الاشتراك تلقائياً ما لم تقم بإلغائه قبل نهاية فترة الاشتراك الحالية. رسوم الاشتراك غير قابلة للاسترداد عن الفترات التي تم استخدامها جزئياً، إلا إذا نص قانون محلي على غير ذلك.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. إخلاء المسؤولية</h2>
              <p className="leading-relaxed">
                رغم أننا نستخدم أفضل نماذج الذكاء الاصطناعي المتاحة، إلا أن التكنولوجيا قد تخطئ أحياناً (Hallucinations). نحن نوفر أدوات للحد من هذه الأخطاء ومراقبتها، ولكن العميل يتحمل المسؤولية النهائية عن الإجابات التي يقدمها الوكيل لعملائه النهائيين.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. التعديل على الشروط</h2>
              <p className="leading-relaxed">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإبلاغك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار في لوحة التحكم الخاصة بك.
              </p>
            </section>

          </div>
        </motion.div>
      </main>
    </div>
  );
}
