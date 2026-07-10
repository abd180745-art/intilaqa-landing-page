"use client";

import { motion } from "framer-motion";
import { Zap, Wallet, Clock, User, TrendingDown, FileText, Bot, CheckCircle2, Server, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SolutionsSection() {
  return (
    <section id="solutions" className="relative z-10 px-4 overflow-hidden" dir="rtl" style={{ paddingTop: "6%", paddingBottom: "6%" }}>
      
      {/* Title */}
      <motion.div
        className="text-center mb-16 w-full max-w-6xl mx-auto relative z-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >

        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-balance text-foreground mx-auto mb-6">
          انطلاقة حقيقية تصب في <span className="text-primary">مصلحة عملك</span>
        </h2>
      </motion.div>

      {/* BENTO GRID WITH INTEGRATED ANIMATIONS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
        
        {/* CARD 1: Speed (Span 2) */}
        <BentoCard className="md:col-span-2 overflow-hidden flex flex-col md:flex-row bg-primary/5 border-primary/20" delay={0.1}>
          <div className="p-6 md:p-8 flex flex-col justify-center flex-1 z-10 relative">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-primary flex items-center justify-center border border-primary/20 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">استجابة فورية فائقة السرعة</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              ردود دقيقة وفورية على مدار الساعة. وكيل انطلاقة يحلل استفسارات الطلاب (كالتخصصات والتكاليف) ويرد عليها فوراً وباحترافية تامة، مما يضاعف معدلات التسجيل ويمنع تسرب أي طالب.
            </p>
          </div>
          {/* Animated Visual (Chat) */}
          <div className="relative flex-1 min-h-[250px] bg-background/40 flex items-center justify-center p-6 border-r border-white/5">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(230,150,5,0.1)_0%,transparent_70%)] rounded-full pointer-events-none" />
            <SpeedVisual />
          </div>
        </BentoCard>

        {/* CARD 2: Cost (Span 1) */}
        <BentoCard className="flex flex-col overflow-hidden bg-primary/5 border-primary/20" delay={0.2}>
          <div className="p-6 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 mb-4">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">تكلفة تشغيل أقل</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              توفير هائل في مصاريف فرق الدعم والمبيعات، مع قدرة استيعاب آلاف العملاء في نفس اللحظة بأداء يتفوق على الكوادر البشرية.
            </p>
          </div>
          {/* Animated Visual (Chart) */}
          <div className="relative mt-auto h-[160px] bg-background/40 flex items-end p-6 border-t border-white/5">
             <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(230,150,5,0.1)_0%,transparent_70%)] rounded-full pointer-events-none" />
             <CostVisual />
          </div>
        </BentoCard>

        {/* CARD 3: Training (Span 1) */}
        <BentoCard className="flex flex-col overflow-hidden bg-primary/5 border-primary/20" delay={0.3}>
          <div className="p-6 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">قاعدة بيانات ضخمة ومخصصة</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              نمتلك قاعدة بيانات جاهزة لجميع التخصصات! وبإمكانك أيضاً رفع ملفاتك الخاصة (كالخصومات وعروض الأسعار الحصرية) ليتمكن الوكيل من الرد بناءً عليها فوراً.
            </p>
          </div>
          {/* Animated Visual (Data flow) */}
          <div className="relative mt-auto h-[180px] bg-background/40 flex items-center justify-center p-4 border-t border-white/5">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(230,150,5,0.1)_0%,transparent_70%)] rounded-full pointer-events-none" />
             <TrainingVisual />
          </div>
        </BentoCard>

        {/* CARD 4: Client Experience (Span 2) */}
        <BentoCard className="md:col-span-2 overflow-hidden bg-primary/5 border-primary/30 flex flex-col md:flex-row items-center justify-between p-8" delay={0.4}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(230,150,5,0.3)]">
                <User className="w-7 h-7" />
              </div>
              <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center gap-1 border border-primary/20">
                <Activity className="w-4 h-4" />
                رضا 100%
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-foreground mb-3">تجربة الطالب المثالية</h3>
            <p className="text-muted-foreground text-base max-w-md">
              الهدف الأسمى هو بناء ثقة الطالب. تفاعل إنساني دافئ يُشعر الطالب بأنه يتحدث مع مستشار تعليمي خبير يرشده خطوة بخطوة حتى لحظة القبول الجامعي.
            </p>
          </div>

          <div className="relative z-10 mt-8 md:mt-0">
             <div className="w-40 h-40 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-4 border-primary/40 border-t-primary animate-spin" style={{ animationDuration: '3s' }} />
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white">
                  <User className="w-12 h-12" />
                </div>
             </div>
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[radial-gradient(circle,rgba(230,150,5,0.15)_0%,transparent_70%)] rounded-full pointer-events-none" />
        </BentoCard>

      </div>
    </section>
  );
}

function BentoCard({ children, className, delay }: { children: React.ReactNode, className?: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn(
        "relative rounded-3xl border glass-strong backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
}


/* ========================================================================
   INLINE ANIMATED COMPONENTS
   ======================================================================== */

function SpeedVisual() {
  return (
    <div className="relative w-full max-w-[280px] flex flex-col gap-3 z-10">
      <motion.div 
        className="self-end bg-background border border-white/10 text-foreground px-4 py-3 rounded-2xl rounded-tr-sm text-xs shadow-sm"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.2 }}
      >
        أريد القبول في دراسة الطب بتركيا، ما هي التكاليف؟
      </motion.div>
      
      <motion.div 
        className="self-start flex items-center gap-1 text-[10px] font-mono text-primary/80 mb-1"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0] }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <Zap className="w-3 h-3" /> Processing in 42ms...
      </motion.div>

      <motion.div 
        className="self-start bg-primary/10 border border-primary/30 text-foreground px-4 py-3 rounded-2xl rounded-tl-sm text-xs shadow-lg max-w-[95%]"
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Bot className="w-3 h-3 text-primary/80" />
          <span className="font-bold text-primary/80 text-[10px]">وكيل انطلاقة الذكي</span>
        </div>
        أهلاً بك! لدراسة الطب في الجامعات الخاصة، التكلفة تبدأ من 15,000$ سنوياً. هل أرسل لك قائمة بأفضل الجامعات التي تناسب معدلك؟
      </motion.div>
    </div>
  );
}

function CostVisual() {
  return (
    <div className="relative w-full h-full flex flex-col justify-end z-10">
      <div className="flex justify-between items-end mb-2 absolute top-0 left-0 right-0">
        <div>
          <h3 className="text-2xl font-extrabold text-foreground">-78%</h3>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <TrendingDown className="w-4 h-4" />
        </div>
      </div>
      
      <div className="relative h-20 w-full flex items-end justify-between gap-1.5 mt-8">
        {[100, 95, 85, 60, 40, 25, 20].map((height, i) => (
          <motion.div 
            key={i}
            className={cn("w-full rounded-t-sm", i > 3 ? "bg-primary" : "bg-muted")}
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.1 * i, duration: 0.5, type: "spring" }}
          />
        ))}
        
        <motion.svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#e69605" />
              <stop offset="100%" stopColor="#e69605" />
            </linearGradient>
            <filter id="lineShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
            </filter>
          </defs>
          <motion.path 
            d="M100,10 C 75,15 50,60 0,88" 
            fill="none" 
            stroke="url(#lineGrad)" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            filter="url(#lineShadow)"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
          />
        </motion.svg>
      </div>
    </div>
  );
}

function TrainingVisual() {
  return (
    <div className="relative flex items-center justify-between w-full max-w-[240px] z-10">
      <div className="flex flex-col gap-2 relative z-20">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            className="w-10 h-10 glass border border-white/10 rounded-lg flex items-center justify-center bg-background/80 shadow-md"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.1 * i }}
          >
            <FileText className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        ))}
      </div>

      {/* Moving Particles */}
      <motion.div 
        className="absolute top-1/2 left-8 w-16 h-0.5 bg-gradient-to-r from-transparent to-primary rounded-full"
        animate={{ x: [0, 60], opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
      <motion.div 
        className="absolute top-1/3 left-8 w-12 h-0.5 bg-gradient-to-r from-transparent to-primary rounded-full"
        animate={{ x: [0, 60], opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear", delay: 0.5 }}
      />

      <div className="relative z-10">
        {/* Composited glow (animates opacity/scale instead of box-shadow, so the
            infinite pulse stays on the GPU and never triggers a repaint). */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: "0 0 40px rgba(230,150,5,0.5)",
            willChange: "opacity, transform",
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        <motion.div 
          className="relative w-20 h-20 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center shadow-[0_0_20px_rgba(230,150,5,0.3)]"
          style={{ willChange: "transform" }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Server className="w-8 h-8 text-primary/80" />
        </motion.div>
      </div>

      <motion.div 
        className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-20"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.8, type: "spring" }}
      >
        <div className="w-8 h-8 rounded-full bg-green-500 border border-primary/60 flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
      </motion.div>
    </div>
  );
}
