'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'motion/react'
import { Check, Star, ArrowRight, CircleNotch } from '@phosphor-icons/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { initializePaddle, Paddle } from '@paddle/paddle-js'
import { toast } from 'sonner'

type Tier = {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  href: string
  popular?: boolean
  planId?: string
}

const tiers: Tier[] = [
  {
    name: 'Basic',
    price: '$30',
    period: '/ month',
    description: 'Perfect for startups and small businesses to start with smart customer support.',
    features: [
      '1 Customer Service Bot',
      '5,000,000 Tokens / month',
      'Basic Company Data Training',
      'Basic Dashboard & Analytics',
      'Standard Support',
    ],
    cta: 'Subscribe Now',
    href: '/register?next=%2Fpricing%3Fplan%3Dbasic',
    planId: 'basic',
  },
  {
    name: 'Pro',
    price: '$50',
    period: '/ month',
    description: 'For growing businesses needing higher capabilities and more interactions.',
    features: [
      'Advanced Customer Service Bot',
      '15,000,000 Tokens / month',
      'Continuous Data Training',
      'Detailed Analytics Reports',
      'Priority Support',
    ],
    cta: 'Subscribe Now',
    href: '/register?next=%2Fpricing%3Fplan%3Dpro',
    planId: 'pro',
    popular: true,
  },
  {
    name: 'Ultimate',
    price: '$150',
    period: '/ month',
    description: 'The complete solution combining customer service and internal employee empowerment.',
    features: [
      'Includes Internal Employee Assistant',
      'Advanced Customer Service Bot',
      '50,000,000 Tokens / month',
      'Internal Systems Integration (API)',
      'Dedicated Account Manager',
    ],
    cta: 'Subscribe Now',
    href: '/register?next=%2Fpricing%3Fplan%3Dultimate',
    planId: 'ultimate',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored solutions for large corporations with high security requirements.',
    features: [
      'Multi-Agent System',
      'Unlimited Messages & Requests',
      'Private Cloud Deployment',
      'Full ERP/CRM Integration',
      '24/7 Consultative Support',
    ],
    cta: 'Contact Sales',
    href: 'mailto:info@intilaqa.com',
  },
]

function PricingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const [userId, setUserId] = useState<string | null>(null)
  const [paddle, setPaddle] = useState<Paddle>()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [hasSubscription, setHasSubscription] = useState<boolean>(false)

  useEffect(() => {
    const loadAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        // Check if user has an active subscription
        const { getUserSubscription } = await import('@/app/actions/user')
        const sub = await getUserSubscription(user.id)
        if (sub && sub.paddle_subscription_id) {
          setHasSubscription(true)
        }
      }
    }
    loadAuth()

    const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
    const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production"
    if (clientToken) {
      initializePaddle({ environment: environment || "sandbox", token: clientToken }).then(
        (inst) => { if (inst) setPaddle(inst) }
      )
    }
  }, [supabase])

  const handleUpgrade = async (planId: string) => {
    if (!planId || !userId || !paddle) return

    let priceId = ""
    if (planId === "basic") priceId = process.env.NEXT_PUBLIC_PADDLE_BASIC_PRICE_ID || ""
    if (planId === "pro") priceId = process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || ""
    if (planId === "ultimate") priceId = process.env.NEXT_PUBLIC_PADDLE_ULTIMATE_PRICE_ID || ""
    
    if (!priceId) return

    setLoadingPlan(planId)
    try {
      if (hasSubscription) {
        // Upgrade existing subscription
        const res = await fetch('/api/paddle/upgrade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId, userId })
        })
        const data = await res.json()

        if (data.requiresPayment && data.paymentUrl) {
          window.location.href = data.paymentUrl
          return
        }

        if (data.success) {
          toast.success("Subscribed successfully!")
          router.push("/dashboard")
        } else {
          toast.error("An unknown error occurred.")
        }
        setLoadingPlan(null)
      } else {
        // Open native Paddle Checkout for new subscription
        paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customData: { userId },
          successCallback: () => {
            toast.success("Subscribed successfully! Redirecting to dashboard...")
            router.push("/dashboard")
            setLoadingPlan(null)
          },
          closeCallback: () => {
            setLoadingPlan(null)
          }
        })
      }
    } catch {
      toast.error("Failed to connect to the server.")
      setLoadingPlan(null)
    }
  }

  // Auto-trigger checkout if redirected with a plan and authenticated
  useEffect(() => {
    const plan = searchParams?.get('plan')
    // Wait until hasSubscription is resolved (userId is set)
    if (plan && userId && paddle && !loadingPlan) {
      // Remove query param to prevent infinite loops
      router.replace('/pricing', { scroll: false })
      handleUpgrade(plan)
    }
  }, [searchParams, userId, paddle, router, loadingPlan, hasSubscription])

  return (
    <section
      id="pricing"
      className="relative overflow-hidden px-4 pb-28 pt-36 font-sans"
    >
      {/* Soft aurora blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[12%] h-[420px] w-[420px] rounded-full bg-[#e69605]/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-[8%] h-[360px] w-[360px] rounded-full bg-[#e69605]/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-4 py-1.5 text-sm font-medium text-[#e69605] backdrop-blur-md"
          >
            <Star weight="fill" className="h-4 w-4" />
            Pricing Plans
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-pretty text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            A Smart Investment for the Future of Your Customer Service
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            Flexible plans tailored to your business. Start for free and upgrade as you grow.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
          {tiers.map((tier, i) => (
            <PricingCard 
              key={tier.name} 
              tier={tier} 
              index={i} 
              userId={userId}
              handleUpgrade={handleUpgrade}
              loadingPlan={loadingPlan}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function Pricing() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PricingContent />
    </Suspense>
  )
}

function PricingCard({ 
  tier, 
  index,
  userId,
  handleUpgrade,
  loadingPlan
}: { 
  tier: Tier; 
  index: number;
  userId: string | null;
  handleUpgrade: (planId: string) => void;
  loadingPlan: string | null;
}) {
  const popular = tier.popular
  const isEnterprise = tier.name === 'Enterprise'
  const isLoading = loadingPlan === tier.planId

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative flex h-full flex-col rounded-3xl p-8 transition-all duration-500 ${
        popular
          ? 'z-10 scale-105 border-transparent bg-white shadow-[0_30px_80px_-24px_oklch(0.72_0.16_62/30%)]'
          : 'border border-border/50 bg-white/50 backdrop-blur-md hover:border-[#e69605]/30 hover:bg-white/80'
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e69605] px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
            <Star weight="fill" className="h-3 w-3" />
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-foreground">{tier.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {tier.description}
        </p>
      </div>

      <div className="mb-8 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-tight text-foreground">
          {tier.price}
        </span>
        {tier.period && (
          <span className="text-sm font-medium text-muted-foreground">
            {tier.period}
          </span>
        )}
      </div>

      <ul className="mb-8 flex flex-1 flex-col gap-4 text-sm">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                popular ? 'bg-[#e69605]/10 text-[#e69605]' : 'bg-primary/5 text-primary/70'
              }`}
            >
              <Check weight="bold" className="h-3 w-3" />
            </span>
            <span className="leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      {isEnterprise ? (
        <a
          href={tier.href}
          className={`group/btn mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
            popular
              ? 'bg-[#e69605] text-primary-foreground shadow-[0_0_28px_oklch(0.72_0.16_62/45%)] hover:shadow-[0_0_40px_oklch(0.72_0.16_62/65%)]'
              : 'border border-foreground/15 bg-white/50 text-foreground hover:border-[#e69605]/50 hover:text-[#e69605]'
          }`}
        >
          {tier.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
        </a>
      ) : userId && tier.planId ? (
        <button
          onClick={() => handleUpgrade(tier.planId as string)}
          disabled={isLoading || loadingPlan !== null}
          className={`group/btn mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            popular
              ? 'bg-[#e69605] text-primary-foreground shadow-[0_0_28px_oklch(0.72_0.16_62/45%)] hover:shadow-[0_0_40px_oklch(0.72_0.16_62/65%)]'
              : 'border border-foreground/15 bg-white/50 text-foreground hover:border-[#e69605]/50 hover:text-[#e69605]'
          }`}
        >
          {isLoading ? (
             <>
               Processing...
               <CircleNotch className="h-4 w-4 animate-spin" />
             </>
          ) : (
            <>
              {tier.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
            </>
          )}
        </button>
      ) : (
        <a
          href={tier.href}
          className={`group/btn mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
            popular
              ? 'bg-[#e69605] text-primary-foreground shadow-[0_0_28px_oklch(0.72_0.16_62/45%)] hover:shadow-[0_0_40px_oklch(0.72_0.16_62/65%)]'
              : 'border border-foreground/15 bg-white/50 text-foreground hover:border-[#e69605]/50 hover:text-[#e69605]'
          }`}
        >
          {tier.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
        </a>
      )}
    </motion.div>
  )
}
