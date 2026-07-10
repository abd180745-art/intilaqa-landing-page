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
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }

    // This removes the scheduled cancellation
    const subscription = await paddle.subscriptions.update(subscriptionId, {
      scheduledChange: null
    });

    // Update the DB immediately
    await supabase
      .from('clients_balances')
      .update({ subscription_status: 'active' })
      .eq('paddle_subscription_id', subscriptionId);

    return NextResponse.json({ success: true, subscription });
  } catch (err: any) {
    console.error('Paddle resume error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
