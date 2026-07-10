"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-background z-0" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#2D63A6]/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <main className="relative z-10 pt-32 pb-24 px-4 w-full max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-right mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            تواصل <span className="text-primary">معنا</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            نحن هنا للإجابة على استفساراتك ومساعدتك في بناء الوكيل الذكي الأمثل لشركتك. 
            احجز استشارتك الآن لتكتشف كيف ستحول "انطلاقة" عملك.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div className="glass-strong p-6 rounded-2xl border border-white/20">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">البريد الإلكتروني</h3>
              <p className="text-muted-foreground text-sm mb-1">لفريق المبيعات والاستشارات:</p>
              <a href="mailto:hello@intilaqa.ai" className="text-primary font-medium hover:underline" dir="ltr">hello@intilaqa.ai</a>
            </div>

            <div className="glass-strong p-6 rounded-2xl border border-white/20">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">رقم الهاتف</h3>
              <p className="text-muted-foreground text-sm mb-1">تواصل معنا مباشرة عبر الواتساب:</p>
              <a href="tel:+905550000000" className="text-primary font-medium hover:underline" dir="ltr">+90 555 000 00 00</a>
            </div>

            <div className="glass-strong p-6 rounded-2xl border border-white/20">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">المقر الرئيسي</h3>
              <p className="text-muted-foreground text-sm">
                إسطنبول، تركيا<br />
                نقدم خدماتنا للشركات في كافة أنحاء العالم العربي.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-strong p-8 md:p-10 rounded-3xl border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">أرسل لنا رسالة</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">الاسم الكامل</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="محمد أحمد" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">البريد الإلكتروني للعمل</label>
                    <input type="email" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="name@company.com" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">اسم الشركة</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="شركة الأمل ذ.م.م" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">رقم الهاتف (الواتساب)</label>
                    <input type="tel" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="+966 5X XXX XXXX" dir="ltr" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">كيف يمكننا مساعدتك؟</label>
                  <textarea rows={4} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" placeholder="أخبرنا عن عملك وما هي المشاكل التي ترغب في حلها باستخدام الذكاء الاصطناعي..."></textarea>
                </div>

                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 group">
                  <span>إرسال الطلب</span>
                  <Send className="w-4 h-4 rtl:-scale-x-100 transition-transform group-hover:-translate-x-1" />
                </button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  بالضغط على إرسال، فإنك توافق على <Link href="/privacy" className="text-primary hover:underline">سياسة الخصوصية</Link> الخاصة بنا.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
