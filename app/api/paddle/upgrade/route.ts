import { NextResponse } from 'next/server';
import { Paddle, Environment } from '@paddle/paddle-node-sdk';
import { createClient } from '@supabase/supabase-js';

const paddle = new Paddle(process.env.PADDLE_API_KEY || '', {
  environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production' ? Environment.production : Environment.sandbox,
});

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_supabase_service_role_key_here' 
  ? null 
  : process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  try {
    const { priceId, userId } = await req.json();

    if (!priceId || !userId) {
      return NextResponse.json({ error: 'Missing priceId or userId' }, { status: 400 });
    }

    // Map priceId to quota to determine if this is an upgrade or downgrade
    const QUOTA_MAP: Record<string, number> = {
      [process.env.NEXT_PUBLIC_PADDLE_BASIC_PRICE_ID || '']: 5000000,
      [process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || '']: 15000000,
      [process.env.NEXT_PUBLIC_PADDLE_ULTIMATE_PRICE_ID || '']: 50000000,
    };

    // Get user's current subscription AND current plan from database
    const { data: clientData, error } = await supabase
      .from('clients_balances')
      .select('paddle_subscription_id, subscription_status, paddle_price_id, total_quota')
      .eq('user_id', userId)
      .single();

    if (error || !clientData?.paddle_subscription_id) {
      return NextResponse.json({ error: 'No active subscription found for user' }, { status: 404 });
    }

    if (clientData.subscription_status !== 'active' && clientData.subscription_status !== 'trialing' && clientData.subscription_status !== 'canceled') {
      return NextResponse.json({ error: 'Subscription is not active' }, { status: 400 });
    }

    // If the subscription is canceled (pending cancellation), we must unlock it first by removing the scheduled change
    if (clientData.subscription_status === 'canceled') {
      await paddle.subscriptions.update(clientData.paddle_subscription_id, {
        scheduledChange: null
      });
    }

    // Check if this is a downgrade or upgrade
    const currentQuota = clientData.total_quota || QUOTA_MAP[clientData.paddle_price_id || ''] || 0;
    const newQuota = QUOTA_MAP[priceId] || 0;
    const isDowngrade = newQuota < currentQuota;

    // Update the subscription directly using Paddle API
    // If it's an upgrade, charge and apply immediately.
    // If it's a downgrade, schedule it for the next billing cycle so no money is refunded.
    const updatedSub = await paddle.subscriptions.update(clientData.paddle_subscription_id, {
      prorationBillingMode: isDowngrade ? 'prorated_next_billing_period' : 'prorated_immediately',
      items: [
        {
          priceId: priceId,
          quantity: 1,
        },
      ]
    });

    // Only sync the DB immediately if it's an UPGRADE, because the downgrade happens next cycle
    if (!isDowngrade) {
      const { error: dbError } = await supabase
        .from('clients_balances')
        .update({ 
          paddle_price_id: priceId,
          subscription_status: 'active'
        })
        .eq('paddle_subscription_id', clientData.paddle_subscription_id);

      if (dbError) {
        console.error('Error syncing DB after upgrade:', dbError);
      }
    }

    // If the update requires a manual payment action (e.g. 3DS), it will have a nextTransaction or past_due status
    if (updatedSub.status === 'past_due' && updatedSub.managementUrls?.updatePaymentMethod) {
      return NextResponse.json({ 
        requiresPayment: true, 
        paymentUrl: updatedSub.managementUrls.updatePaymentMethod 
      });
    }

    // Return whether it was a downgrade to show a specific message
    return NextResponse.json({ success: true, isDowngrade });
  } catch (error: any) {
    console.error('Error creating upgrade transaction:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
