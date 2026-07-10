"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-background z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />

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
            سياسة <span className="text-primary">الخصوصية</span>
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
              <h2 className="text-2xl font-bold text-foreground mb-4">1. مقدمة</h2>
              <p className="leading-relaxed">
                في "انطلاقة" (Intilaqa AI)، ندرك تماماً أهمية خصوصية بيانات عملائنا وبيانات عملائهم النهائيين. نحن نتعامل مع بيانات حساسة خاصة بالشركات والمؤسسات، ولذلك صممنا أنظمتنا وفق أعلى معايير الأمان والتشفير. توضح سياسة الخصوصية هذه كيفية جمعنا للمعلومات، استخدامها، وحمايتها.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. جمع البيانات</h2>
              <p className="leading-relaxed mb-4">نقوم بجمع الأنواع التالية من البيانات:</p>
              <ul className="list-disc list-inside space-y-2 marker:text-primary">
                <li><strong>بيانات الحساب:</strong> الاسم، البريد الإلكتروني، اسم الشركة، ورقم الهاتف عند التسجيل أو طلب استشارة.</li>
                <li><strong>بيانات التدريب (Knowledge Base):</strong> الملفات، المستندات، والروابط التي تقوم برفعها لتتدرب عليها نماذج الذكاء الاصطناعي الخاصة بك.</li>
                <li><strong>سجلات المحادثات (Chat Logs):</strong> المحادثات التي تجري بين الوكيل الذكي وعملائك النهائيين (عبر الواتساب أو الموقع) وذلك لغرض تحسين الأداء وتقديم تقارير لك.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. استخدام البيانات وتدريب النماذج</h2>
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-foreground mb-4">
                <strong>تعهد صارم:</strong> نحن لا نستخدم بياناتك الخاصة أو ملفات شركتك أو محادثات عملائك لتدريب أي نماذج ذكاء اصطناعي عامة. بياناتك معزولة تماماً في بيئة مخصصة لشركتك فقط.
              </div>
              <p className="leading-relaxed">
                تُستخدم البيانات المحفوظة لدينا حصرياً لـ:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-primary">
                <li>تشغيل وكلائك الذكيين بدقة.</li>
                <li>عرض التحليلات (Analytics) والمحادثات في لوحة التحكم الخاصة بك.</li>
                <li>توفير الدعم الفني لك عند الحاجة.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. أمن وحماية البيانات</h2>
              <p className="leading-relaxed">
                تخزن "انطلاقة" البيانات باستخدام تشفير متقدم (AES-256) أثناء التخزين (At Rest) وتشفير (TLS/SSL) أثناء النقل (In Transit). خوادمنا محمية خلف جدران حماية صارمة ولا يمكن الوصول إليها إلا للموظفين المصرح لهم فقط ولأغراض الدعم الفني بناءً على طلبك.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. الأطراف الثالثة</h2>
              <p className="leading-relaxed">
                لتوفير خدماتنا، نعتمد على شركاء تقنيين موثوقين (مثل مزودي خدمات الذكاء الاصطناعي كـ OpenAI أو Anthropic، ومزودي خدمات المراسلة كـ Meta/WhatsApp). نحن نضمن تفعيل خيارات (Zero Data Retention) مع هؤلاء المزودين حيثما أمكن، مما يعني أنهم لا يحتفظون بالبيانات التي تمر عبر أنظمتهم.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. التواصل معنا</h2>
              <p className="leading-relaxed">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية الخاصة بنا، يرجى التواصل معنا عبر البريد الإلكتروني: <a href="mailto:privacy@intilaqa.ai" className="text-primary hover:underline" dir="ltr">privacy@intilaqa.ai</a>
              </p>
            </section>

          </div>
        </motion.div>
      </main>
    </div>
  );
}
