import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-card border-t border-border w-[100vw] max-w-[100vw] left-1/2 right-1/2 -mx-[50vw]" dir="rtl">
      <div className="w-full max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Links Column 1 */}
          <div className="flex flex-col gap-4 text-right">
            <h4 className="text-foreground font-semibold mb-2 text-sm">الحلول</h4>
            <Link href="#product" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">الاستشارات التعليمية</Link>
            <Link href="#product" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">الخدمات اللوجستية</Link>
            <Link href="#product" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">العقارات</Link>
          </div>
          
          {/* Links Column 2 */}
          <div className="flex flex-col gap-4 text-right">
            <h4 className="text-foreground font-semibold mb-2 text-sm">الشركة</h4>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">تواصل معنا</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">الشروط والأحكام</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">سياسة الخصوصية</Link>
          </div>

          {/* Brand Column (Moved to Left) */}
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-4 text-left items-end">
            <Link href="/" className="inline-block w-fit">
              <img src="/logo.png" className="h-10 md:h-12 w-auto object-contain" alt="Intilaqa AI Logo" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mt-2 text-pretty text-left">
              نظام وكلاء ذكاء اصطناعي متكامل للشركات. صُمم لخدمة عملائك، وتمكين فريقك الداخلي، بلا تعقيد تقني.
            </p>
          </div>
          
        </div>
        
        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} انطلاقة. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>صُنع بشغف لتمكين الشركات</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
