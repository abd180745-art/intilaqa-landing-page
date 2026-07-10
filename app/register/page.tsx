'use client'

import { useState, Suspense } from 'react'
import { motion } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  GoogleLogo,
  Envelope,
  Lock,
  ArrowRight,
  CircleNotch,
} from '@phosphor-icons/react'
import { IntilaqaIcon } from '@/components/intilaqa-icon'
import { NeuralNetworkBg } from '@/components/landing/neural-network-bg'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams?.get('next') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message || "Failed to create account")
        setIsLoading(false)
      } else {
        router.push(next)
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during registration")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
        },
      })
      if (error) {
        setError(error.message || "Could not login with Google")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during Google login")
    }
  }

  return (
    <main dir="ltr" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-200 px-4 py-12 font-sans text-foreground">
      {/* Ambient depth orbs */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-[#e69605]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />

      {/* Interactive neural network */}
      <div className="absolute inset-0 opacity-80">
        <NeuralNetworkBg />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="relative z-10 w-[90vw] sm:w-[60vw] md:w-[50vw] lg:w-[35vw] xl:w-[28vw] 2xl:w-[24vw] min-w-[320px]"
      >
        <div className="bg-white relative overflow-hidden rounded-[2rem] p-[5vh] sm:p-[6vh] shadow-2xl border border-white/40">
          
          <motion.div variants={container} initial="hidden" animate="show" className="relative z-10">
            {/* Logo */}
            <motion.div variants={item} className="flex justify-center">
              <IntilaqaIcon className="h-[7vh] w-[7vh] min-h-[48px] min-w-[48px] text-[#e69605] drop-shadow-md" />
            </motion.div>

            {/* Header */}
            <motion.div variants={item} className="mt-[3vh] text-center">
              <h1 className="text-[3vh] min-text-xl font-bold tracking-tight text-foreground">
                Create an account
              </h1>
              <p className="mt-[1vh] text-[1.5vh] min-text-xs text-muted-foreground">
                Join the Intilaqa workspace
              </p>
            </motion.div>

            {error && (
              <motion.div variants={item} className="mt-[3vh] rounded-xl bg-red-50 p-[1.5vh] text-center text-[1.5vh] font-medium text-red-600 border border-red-100">
                {error}
              </motion.div>
            )}

            {/* Social auth */}
            <motion.div variants={item} className="mt-[4vh] flex flex-col gap-[1.5vh]">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="group flex w-full items-center justify-center gap-3 rounded-xl border border-border/40 bg-white/60 px-4 py-[1.5vh] text-[1.6vh] min-text-sm font-semibold text-foreground transition-all hover:bg-white hover:shadow-sm"
              >
                <GoogleLogo weight="bold" className="h-[2.5vh] w-[2.5vh] min-h-[16px] min-w-[16px] transition-transform group-hover:scale-110" />
                Sign up with Google
              </button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={item} className="my-[3.5vh] flex items-center gap-4 opacity-70">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border" />
              <span className="text-[1.2vh] font-bold uppercase tracking-widest text-muted-foreground">
                Or email
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border" />
            </motion.div>

            {/* Form */}
            <motion.form
              variants={item}
              className="flex flex-col gap-[2.5vh]"
              onSubmit={handleRegister}
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-[1vh] block text-[1.3vh] font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Email Address
                </label>
                <div
                  className={`flex items-center gap-3 rounded-xl border bg-white/50 px-4 transition-all duration-300 ${
                    focused === 'email'
                      ? 'border-[#e69605] ring-1 ring-[#e69605] bg-white shadow-[0_0_15px_rgba(230,150,5,0.1)]'
                      : 'border-border/40 hover:border-border/80 hover:bg-white/70'
                  }`}
                >
                  <Envelope className={`h-[2.5vh] w-[2.5vh] min-h-[16px] min-w-[16px] shrink-0 transition-colors ${focused === 'email' ? 'text-[#e69605]' : 'text-muted-foreground'}`} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-transparent py-[1.5vh] text-[1.6vh] min-text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-[1vh] flex items-center justify-between ml-1">
                  <label
                    htmlFor="password"
                    className="block text-[1.3vh] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Password
                  </label>
                </div>
                <div
                  className={`flex items-center gap-3 rounded-xl border bg-white/50 px-4 transition-all duration-300 ${
                    focused === 'password'
                      ? 'border-[#e69605] ring-1 ring-[#e69605] bg-white shadow-[0_0_15px_rgba(230,150,5,0.1)]'
                      : 'border-border/40 hover:border-border/80 hover:bg-white/70'
                  }`}
                >
                  <Lock className={`h-[2.5vh] w-[2.5vh] min-h-[16px] min-w-[16px] shrink-0 transition-colors ${focused === 'password' ? 'text-[#e69605]' : 'text-muted-foreground'}`} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-transparent py-[1.5vh] text-[1.6vh] min-text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group mt-[1vh] flex items-center justify-center gap-2 rounded-xl bg-[#e69605] px-4 py-[1.8vh] text-[1.6vh] font-bold text-white shadow-[0_8px_20px_-4px_rgba(230,150,5,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-4px_rgba(230,150,5,0.6)] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_20px_-4px_rgba(230,150,5,0.4)]"
              >
                {isLoading ? (
                  <CircleNotch weight="bold" className="h-[2.5vh] w-[2.5vh] animate-spin" />
                ) : (
                  <>
                    Sign Up
                    <ArrowRight
                      weight="bold"
                      className="h-[2vh] w-[2vh] transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </>
                )}
              </button>
            </motion.form>

            {/* Footer */}
            <motion.p
              variants={item}
              className="mt-[4vh] text-center text-[1.5vh] font-medium text-muted-foreground"
            >
              {"Already have an account? "}
              <Link
                href="/login"
                className="font-bold text-foreground transition-colors hover:text-[#e69605]"
              >
                Sign in
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-200">
        <CircleNotch weight="bold" className="h-8 w-8 animate-spin text-[#e69605]" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
