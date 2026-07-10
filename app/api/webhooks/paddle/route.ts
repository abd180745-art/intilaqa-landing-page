import { NextResponse } from 'next/server';
import { Paddle, Environment } from '@paddle/paddle-node-sdk';
import { createClient } from '@supabase/supabase-js';

const paddle = new Paddle(process.env.PADDLE_API_KEY || '', {
  environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production' ? Environment.production : Environment.sandbox,
});

// Use Service Role key if provided (and not the placeholder), otherwise fallback to ANON key
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_supabase_service_role_key_here' 
  ? null 
  : process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('paddle-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const bodyText = await req.text();
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET || 'fallback_secret';

    let eventData;
    try {
      // Very strictly verifies the signature
      eventData = paddle.webhooks.unmarshal(bodyText, webhookSecret, signature);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Bypass SDK object parsing issues by using raw JSON
    const rawBody = JSON.parse(bodyText);
    const eventTypeStr = rawBody.event_type;
    const dataObj = rawBody.data;

    console.log('Parsed Paddle Webhook Event:', eventTypeStr);
    console.log('Raw Data CustomData:', JSON.stringify((dataObj as any).custom_data));

    if (eventTypeStr === 'transaction.completed') {
      const customData = (dataObj as any).custom_data;
      const userId = customData?.userId;
      
      if (userId) {
        // Here we could handle initial one-time payments if needed.
        console.log(`Transaction completed for user ${userId}`);
      }
    }

    if (eventTypeStr === 'subscription.created' || eventTypeStr === 'subscription.updated') {
      const customData = (dataObj as any).custom_data;
      const userId = customData?.userId;
      const subId = (dataObj as any).id;
      const customerId = (dataObj as any).customer_id;
      const items = (dataObj as any).items;
      const priceId = items?.[0]?.price?.id;
      const status = (dataObj as any).status;
      const currentPeriodEnd = (dataObj as any).current_billing_period?.ends_at || null;

      if (userId) {
        // Determine quota based on the purchased package
        let newQuota = 0;
        let planName = 'free';
        if (status === 'active') {
          if (priceId === process.env.NEXT_PUBLIC_PADDLE_ULTIMATE_PRICE_ID) {
            newQuota = 50000000; // 50 Million Tokens
            planName = 'ultimate';
          } else if (priceId === process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID) {
            newQuota = 15000000; // 15 Million Tokens
            planName = 'pro';
          } else if (priceId === process.env.NEXT_PUBLIC_PADDLE_BASIC_PRICE_ID) {
            newQuota = 5000000; // 5 Million Tokens
            planName = 'basic';
          } else {
            newQuota = 15000000;
            planName = 'pro';
          }
        }

        if (eventTypeStr === 'subscription.created') {
          // Brand new subscription: set fresh quota
          const { error } = await supabase
            .from('clients_balances')
            .update({
              paddle_subscription_id: subId,
              paddle_customer_id: customerId,
              paddle_price_id: priceId,
              subscription_status: status,
              current_period_end: currentPeriodEnd,
              total_quota: newQuota,
              token_balance: newQuota,
              plan_name: planName
            })
            .eq('user_id', userId);

          if (error) {
            console.error('Supabase error on subscription.created:', error);
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
          }
          console.log(`New subscription created for user ${userId}, quota: ${newQuota}`);

        } else {
          // subscription.updated — could be upgrade, downgrade, or metadata change
          // First, fetch user's current balance and quota from DB
          const { data: currentData, error: fetchError } = await supabase
            .from('clients_balances')
            .select('token_balance, total_quota')
            .eq('user_id', userId)
            .single();

          if (fetchError || !currentData) {
            console.error('Could not fetch current balance for user:', fetchError);
            return NextResponse.json({ error: 'Could not fetch current data' }, { status: 500 });
          }

          const currentQuota = currentData.total_quota || 0;
          const currentBalance = currentData.token_balance || 0;

          if (newQuota > currentQuota) {
            // UPGRADE: Add the new plan's quota on top of remaining balance
            const upgradedBalance = currentBalance + newQuota;
            const { error } = await supabase
              .from('clients_balances')
              .update({
                paddle_subscription_id: subId,
                paddle_customer_id: customerId,
                paddle_price_id: priceId,
                subscription_status: status,
                current_period_end: currentPeriodEnd,
                total_quota: newQuota,
                token_balance: upgradedBalance,
                plan_name: planName
              })
              .eq('user_id', userId);

            if (error) {
              console.error('Supabase error on upgrade:', error);
              return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
            }
            console.log(`Upgraded user ${userId}: ${currentBalance} + ${newQuota} = ${upgradedBalance}`);

          } else {
            // DOWNGRADE or same plan: Only update metadata, do NOT touch balance
            const { error } = await supabase
              .from('clients_balances')
              .update({
                paddle_subscription_id: subId,
                paddle_customer_id: customerId,
                paddle_price_id: priceId,
                subscription_status: status,
                current_period_end: currentPeriodEnd,
                plan_name: planName
                // token_balance and total_quota are intentionally NOT updated
              })
              .eq('user_id', userId);

            if (error) {
              console.error('Supabase error on downgrade metadata:', error);
              return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
            }
            console.log(`Downgrade/same plan for user ${userId}: metadata updated, balance untouched (${currentBalance})`);
          }
        }
      }
    }

    if (eventTypeStr === 'subscription.canceled') {
      const subId = (dataObj as any).id;
      // Revoke quota or update status
      const { error } = await supabase
        .from('clients_balances')
        .update({
          subscription_status: 'canceled',
          total_quota: 0,
          plan_name: 'free'
        })
        .eq('paddle_subscription_id', subId);

      if (error) console.error('Supabase error on cancel:', error);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
