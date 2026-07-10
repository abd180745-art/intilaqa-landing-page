import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
    try {
        const supabaseServer = await createClient();
        const { data: { user } } = await supabaseServer.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ plan: 'free' });
        }

        const adminClient = createAdminClient();
        const { data } = await adminClient
            .from('clients_balances')
            .select('plan_name')
            .eq('user_id', user.id)
            .single();
        
        return NextResponse.json({ plan: data?.plan_name || 'free' });
    } catch (error) {
        console.error('Error fetching plan:', error);
        return NextResponse.json({ plan: 'free' });
    }
}
