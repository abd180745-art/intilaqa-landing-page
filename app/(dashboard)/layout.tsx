"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { AmbientBackdrop } from "@/components/dashboard/ambient-backdrop"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardStatsProvider } from "@/hooks/use-dashboard-stats"
import { createClient } from "@/utils/supabase/client"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [planName, setPlanName] = useState("free")
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        // حماية الصفحة من المتصفح (يتم طرده إذا لم يكن مسجل دخول)
        router.push("/login")
        return
      }

      setUserEmail(user.email || "")

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()
      
      setIsAdmin(roleData?.role === 'admin')

      // Fetch plan_name from local database but using direct server-side request bypassing RLS via our API
      try {
        const planRes = await fetch('/api/user/plan')
        if (planRes.ok) {
          const planData = await planRes.json()
          if (planData && planData.plan) {
            setPlanName(planData.plan)
          }
        }
      } catch (err) {
        console.error("Error fetching plan_name:", err)
      }

      setIsCheckingAuth(false)
    }

    checkUser()
  }, [router])

  // شاشة تحميل مؤقتة تمنع ظهور لوحة التحكم قبل التأكد من الحساب
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <DashboardStatsProvider>
      <div className="relative min-h-svh overflow-x-hidden w-full">
        <AmbientBackdrop />
        <SidebarProvider defaultOpen={false} style={{ overflowX: "hidden", width: "100%", maxWidth: "100vw" }}>
          <AppSidebar isAdmin={isAdmin} userEmail={userEmail} planName={planName} />
          <SidebarInset className="relative min-w-0 bg-transparent overflow-hidden h-screen">
            <div className="h-full overflow-y-auto overflow-x-hidden">
              <div className="min-h-full">
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </DashboardStatsProvider>
  )
}
