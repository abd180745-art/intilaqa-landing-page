"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Supabase client automatically processes the hash fragment 
    // and stores the session in localStorage.
    // We just need to wait a tick and redirect to the dashboard.
    const handleAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        router.push("/dashboard")
      } else {
        // Fallback if processing takes a bit longer or failed
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      }
    }
    
    handleAuth()
  }, [router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        <p className="text-sm font-medium text-zinc-500">Authenticating...</p>
      </div>
    </div>
  )
}
