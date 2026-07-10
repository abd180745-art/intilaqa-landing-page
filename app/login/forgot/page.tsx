"use client"

import { useState } from "react"
import { ShieldCheck, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/reset`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Check your email for a password reset link!")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] blob-wave-1 opacity-70" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[120px] blob-wave-2 opacity-50" />
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="glass-strong rounded-3xl p-8 sm:p-10 shadow-soft border border-white/20">
          
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center mb-5 shadow-lg shadow-primary/30">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to receive a password reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left" dir="ltr">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100/10 border border-red-500/20 rounded-xl text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 text-sm text-green-600 bg-green-100/30 border border-green-500/30 rounded-xl text-center">
                {message}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Email Address</label>
              <input 
                name="email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
                placeholder="you@example.com"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3.5 rounded-xl font-semibold text-white bg-zinc-900 hover:bg-zinc-800 transition-all shadow-md mt-2 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/40 text-center">
            <Link href="/login" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
