'use client'

import { SmoothScrolling } from '@/components/smooth-scroll'
import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { LogoMarquee } from '@/components/landing/logo-marquee'
import { DualShowcase } from '@/components/landing/dual-showcase'
import { Industries } from '@/components/landing/industries'
import { BentoGrid } from '@/components/landing/bento-grid'
import { DeveloperExperience } from '@/components/landing/developer-experience'
import { CtaFooter } from '@/components/landing/cta-footer'

export default function LandingPage() {
  return (
    <SmoothScrolling>
      <main className="relative min-h-screen font-sans selection:bg-primary/30">
        <Navbar />
        <Hero />
        <LogoMarquee />
        <DualShowcase />
        <Industries />
        <BentoGrid />
        <DeveloperExperience />
        <CtaFooter />
      </main>
    </SmoothScrolling>
  )
}
