import { Navbar } from '@/components/landing/navbar'
import { Pricing } from '@/components/landing/pricing'
import { CtaFooter } from '@/components/landing/cta-footer'

export default function PricingPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />
      <Pricing />
      <CtaFooter />
    </main>
  )
}
