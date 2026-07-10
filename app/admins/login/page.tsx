"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: signInError, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !data.user) {
      setError("Could not authenticate admin")
      setIsLoading(false)
      return
    }

    // Verify admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single()

    if (roleData?.role !== 'admin') {
      await supabase.auth.signOut()
      setError("Unauthorized. Admin access required.")
      setIsLoading(false)
      return
    }

    router.push("/agents") // Redirect to default admin page
    router.refresh()
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
              Intilaqa Admin Portal
            </h1>
            <p className="text-sm text-muted-foreground">
              Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 px-1" htmlFor="email">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@intilaqa.com"
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/60 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 px-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/60 text-foreground"
              />
            </div>

            {error && (
              <div className="p-3 mt-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-4 py-3.5 rounded-xl font-medium text-white cta-orange flex items-center justify-center gap-2 group shadow-md disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Secure Admin Sign In"}
              {!isLoading && <span className="transition-transform group-hover:translate-x-1">→</span>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/40 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <span className="pulse-dot"></span>
              Secure Connection Authorized
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
