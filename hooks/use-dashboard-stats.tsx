"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { createClient } from "@/utils/supabase/client"

export interface DashboardStats {
  role?: "admin" | "client"
  totalTokensUsed: number
  totalConversations: number
  clientsCount: number
  totalBalance: number
  conversationsLast24h: number
  conversationsPrev24h: number
  tokensLast24h: number
  tokensPrevDay: number
  tokensThisWeek: number
  tokensPrevWeek: number
  tokensThisMonth: number
  tokensLastMonth: number
  clientsLast24h: number
  satisfactionLast24h: number | null

  weeklyActivity: Array<{
    day: string
    conversations: number
    tokens: number
  }>
  clientWeeklyActivity: Record<string, Array<{
    day: string
    conversations: number
    tokens: number
  }>>
  sourceWeeklyActivity: Record<string, Array<{
    day: string
    conversations: number
    tokens: number
  }>>
  recentConversations: Array<{
    id: string
    title: string
    botResponse?: string
    time: string
    messages: number
    likes: number
    dislikes: number
    tokens?: number
    status: "active" | "resolved" | "flagged"
  }>
  topClients: Array<{
    name: string
    apiKey: string
    used: number
    total: number
    status?: string
    createdAt?: string
    createdIso?: string
    algoliaIndexName?: string
    customPromptId?: string
    customPersona?: string
  }>
  liveActivity: Array<{
    id: string
    kind: "chat" | "rating" | "alert" | "tokens" | "client"
    title: string
    meta: string
    time: string
  }>
}

interface DashboardStatsContextType {
  data: DashboardStats | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

const DashboardStatsContext = createContext<DashboardStatsContextType>({
  data: null,
  isLoading: true,
  error: null,
  refetch: () => {},
})

export function DashboardStatsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error("Unauthorized")

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      const role = roleData?.role === 'admin' ? 'admin' : 'client'

      const workerBaseUrl = process.env.NEXT_PUBLIC_INTILAQA_ENGINE_URL ?? "https://intilaqa-ai.abo200004.workers.dev"
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token

      const response = await fetch(`${workerBaseUrl}/api/admin/dashboard-stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats")
      }

      const realData = await response.json()

      setData({
        role,
        ...realData
      })
      setError(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <DashboardStatsContext.Provider value={{ data, isLoading, error, refetch: fetchStats }}>
      {children}
    </DashboardStatsContext.Provider>
  )
}

export function useDashboardStats() {
  return useContext(DashboardStatsContext)
}
