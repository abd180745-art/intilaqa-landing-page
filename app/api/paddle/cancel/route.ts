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
  let subscriptionId: string | null = null;
  
  try {
    const body = await req.json();
    subscriptionId = body.subscriptionId;

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }

    const subscription = await paddle.subscriptions.cancel(subscriptionId, {
      effectiveFrom: 'next_billing_period'
    });

    // Update the DB immediately so the UI knows it's canceled
    await supabase
      .from('clients_balances')
      .update({ subscription_status: 'canceled' })
      .eq('paddle_subscription_id', subscriptionId);

    return NextResponse.json({ success: true, subscription });
  } catch (err: any) {
    console.error('Paddle cancel error:', err);
    
    // If Paddle says it already has scheduled changes, it's likely already canceled
    if (err.message && err.message.includes('pending scheduled changes')) {
      // Sync DB
      await supabase
        .from('clients_balances')
        .update({ subscription_status: 'canceled' })
        .eq('paddle_subscription_id', subscriptionId);
      
      return NextResponse.json({ success: true, message: 'Subscription was already pending cancellation. Synced successfully.' });
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
