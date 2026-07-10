"use server"

import { createClient } from '@supabase/supabase-js'

export async function getUserSubscription(userId: string) {
  if (!userId) return null

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_supabase_service_role_key_here' 
    ? null 
    : process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const { data, error } = await supabaseAdmin
    .from('clients_balances')
    .select('paddle_price_id, total_quota, token_balance, subscription_status, current_period_end, paddle_subscription_id')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error("Error fetching subscription:", error)
    return null
  }

  return data
}
