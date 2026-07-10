"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Database, Globe, Users, Network, Code, Server } from "lucide-react";

// Fake code typing effect helper
function TypewriterCode({ code, delay = 0, colorClass = "text-primary/90", active }: { code: string, delay?: number, colorClass?: string, active: boolean }) {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }
    
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(code.substring(0, i));
        i++;
        if (i > code.length) clearInterval(interval);
      }, 15);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [code, delay, active]);

  return <pre className={`font-mono text-[10px] leading-[1.4] text-left whitespace-pre-wrap ${colorClass}`}>{displayed}</pre>;
}

export default function TechProductSection() {
  const [activeTab, setActiveTab] = useState<"customer" | "employee">("customer");

  const customerJson = `{
  "timestamp": "2026",
  "intent": "BOOK_CONSULTATION",
  "confidence": 0.99,
  "action": "trigger_flow",
  "status": "success"
}`;

  const employeeLog = `> Scanning: university_admissions_2026.pdf
> Extracting: Medicine, GPA 85%
> Found: Koc Univ, Medipol Univ...
> Formatting response for employee...
> [OK] Ready in 18ms`;

  return (
    <section className="relative z-10 flex flex-col items-center justify-center px-4 overflow-hidden" dir="rtl" style={{ paddingTop: "6%", paddingBottom: "6%" }}>
      
      {/* CORE CONTAINER */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 relative z-20">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-balance text-foreground mb-3 mx-auto">
            محرك ذكاء اصطناعي واحد، <span className="text-primary">واجهتان متخصصتان</span>
          </h2>

          <p className="text-sm md:text-base leading-relaxed text-muted-foreground text-pretty max-w-xl mx-auto mb-5">
            تخلصنا من القوالب التقليدية. نظام متكامل ينقسم بذكاء لخدمة عملائك، وتمكين فريقك الداخلي.
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex bg-foreground/5 backdrop-blur-md border border-white/20 p-0.5 rounded-full relative z-20 shadow-inner">
            <button
              onClick={() => setActiveTab("customer")}
              className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === "customer" ? "text-white shadow-md" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {activeTab === "customer" && (
                <motion.div layoutId="active-pill" className="absolute inset-0 bg-gradient-to-r from-primary to-orange-400 rounded-full" />
              )}
              <Globe className={`w-3.5 h-3.5 relative z-10 ${activeTab === "customer" ? "text-white" : ""}`} />
              <span className="relative z-10 leading-none">واجهة العملاء والمبيعات</span>
            </button>

            <button
              onClick={() => setActiveTab("employee")}
              className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === "employee" ? "text-background shadow-md" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {activeTab === "employee" && (
                <motion.div layoutId="active-pill" className="absolute inset-0 bg-gradient-to-r from-foreground to-foreground/80 rounded-full" />
              )}
              <Users className={`w-3.5 h-3.5 relative z-10 ${activeTab === "employee" ? "text-background" : ""}`} />
              <span className="relative z-10 leading-none">مساعد الموظفين الداخلي</span>
            </button>
          </div>
        </motion.div>

        {/* DASHBOARD CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl glass-strong border border-white/40 overflow-hidden shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08)] w-full mx-auto"
        >
          {/* Window Controls */}
          <div className="absolute top-0 right-0 w-full h-8 border-b border-white/20 bg-foreground/5 flex items-center px-3 gap-1.5 z-30">
            <div className="w-2 h-2 rounded-full bg-destructive/80 shadow-sm" />
            <div className="w-2 h-2 rounded-full bg-warning/80 shadow-sm" />
            <div className="w-2 h-2 rounded-full bg-success/80 shadow-sm" />
            <div className="mr-auto text-[9px] font-mono text-foreground/40 flex items-center gap-1">
              <Server className="w-2.5 h-2.5" />
              INTILAQA_CORE_SYSTEM
            </div>
          </div>

          <div className="pt-10 pb-4 w-full relative">
            <AnimatePresence mode="wait">
              
              {/* === CUSTOMER TAB === */}
              {activeTab === "customer" && (
                <motion.div
                  key="customer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col lg:flex-row items-stretch px-4"
                >
                  {/* Info Panel */}
                  <div className="flex-[1.2] flex flex-col justify-center relative z-20 py-4 px-4">
                    <span className="rounded-md bg-primary/10 border border-primary/20 text-[9px] text-primary font-mono py-1 px-2 mb-3 inline-block w-fit">
                      CUSTOMER_FACING_BOT
                    </span>
                    
                    <h3 className="text-base md:text-lg font-semibold leading-tight text-foreground mb-2">
                      بنية تحتية مصممة للتعامل مع آلاف الزوار
                    </h3>
                    
                    <p className="text-xs md:text-sm leading-relaxed text-muted-foreground text-pretty mb-4">
                      تحليل نية العميل فورياً وتوجيهه في مسار البيع أو الاستشارة بدقة دون تدخل بشري.
                    </p>
                    
                    <div className="mt-auto flex flex-col gap-2">
                      {[
                        "تحليل فوري لنية العميل (Intent Recognition)",
                        "استجابة فورية لضمان سلاسة المحادثة",
                        "ربط مباشر مع أنظمة الحجز وإدارة العملاء",
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(230,150,5,0.8)]" />
                          <span className="text-xs font-medium text-foreground/90">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Visualizer */}
                  <div className="flex-1 glass rounded-xl relative p-4 flex flex-col justify-center border border-white/20 my-2">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Network className="w-16 h-16 text-primary" />
                    </div>
                    
                    {/* Chat Bubble */}
                    <div className="glass-strong border border-white/40 rounded-lg p-3 w-[90%] ml-auto mb-3 relative z-10 shadow-lg">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-4 h-4 rounded-full bg-foreground/10" />
                        <div className="text-[9px] text-foreground/50 font-mono leading-none">Visitor_992</div>
                      </div>
                      <div className="text-xs font-semibold text-foreground leading-tight">أريد حجز استشارة للدراسة بتركيا</div>
                    </div>

                    <div className="flex justify-center my-1 relative z-10">
                      <div className="h-4 w-px bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse" />
                    </div>

                    {/* Code Terminal */}
                    <div className="bg-foreground/5 backdrop-blur-md border border-white/30 rounded-lg p-3 relative z-10 shadow-inner mt-2">
                      <div className="border-b border-border/50 pb-2 mb-2 flex items-center justify-between">
                        <span className="text-[9px] text-foreground/50 font-mono flex items-center gap-1">
                          <Code className="w-3 h-3" />
                          nlp_processor.ts
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      </div>
                      <div dir="ltr">
                        <TypewriterCode code={customerJson} delay={0.2} colorClass="text-foreground/80 font-bold" active={activeTab === "customer"} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* === EMPLOYEE TAB === */}
              {activeTab === "employee" && (
                <motion.div
                  key="employee"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col lg:flex-row items-stretch px-4"
                >
                  {/* Info Panel */}
                  <div className="flex-[1.2] flex flex-col justify-center relative z-20 py-4 px-4">
                    <span className="rounded-md bg-foreground/10 border border-foreground/20 text-[9px] text-foreground font-mono py-1 px-2 mb-3 inline-block w-fit">
                      INTERNAL_KB_BOT
                    </span>
                    
                    <h3 className="text-base md:text-lg font-semibold leading-tight text-foreground mb-2">
                      مساعد الموظفين الداخلي العبقري
                    </h3>
                    
                    <p className="text-xs md:text-sm leading-relaxed text-muted-foreground text-pretty mb-4">
                      وصول آمن لقواعد البيانات الداخلية ولوائح الشركة. يحول الموظفين لخبراء بدقائق عبر بحث دلالي.
                    </p>
                    
                    <div className="mt-auto flex flex-col gap-2">
                      {[
                        "بحث دلالي (Vector Search) في وثائق الشركة",
                        "تخفيض وقت تدريب الموظفين (Onboarding) للصفر",
                        "تشفير عالي وأمان للبيانات الحساسة",
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-foreground shadow-[0_0_6px_rgba(0,0,0,0.5)]" />
                          <span className="text-xs font-medium text-foreground/90">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Visualizer */}
                  <div className="flex-1 glass rounded-xl relative p-4 flex flex-col justify-center border border-white/20 my-2">
                    <div className="absolute bottom-0 left-0 p-4 opacity-10">
                      <Database className="w-16 h-16 text-foreground" />
                    </div>
                    
                    {/* Search Input */}
                    <div className="glass-strong border border-white/40 rounded-lg p-3 w-full relative z-10 shadow-lg mb-3">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-foreground/70" />
                        <div className="text-foreground text-[10px] font-mono border-r border-foreground/30 pr-2 w-full font-bold">
                          Search query: "جامعات تركية تقبل 85% للطب؟"
                        </div>
                      </div>
                    </div>

                    {/* Terminal Output */}
                    <div className="bg-foreground/5 backdrop-blur-md border border-foreground/20 rounded-lg p-3 relative z-10 shadow-inner mt-2">
                      <div className="border-b border-border/50 pb-2 mb-2 flex items-center justify-between">
                        <span className="text-[9px] text-foreground/50 font-mono">vector_engine.log</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                      </div>
                      <div dir="ltr">
                        <TypewriterCode code={employeeLog} delay={0.2} colorClass="text-foreground/90 font-bold" active={activeTab === "employee"} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
