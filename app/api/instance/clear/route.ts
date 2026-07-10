import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export async function DELETE(req: Request) {
    try {
        const supabaseServer = await createClient();
        const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

        if (authError || !user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const instance = searchParams.get('instance');
        
        if (!instance) {
            return NextResponse.json({ error: "Missing instance parameter" }, { status: 400 });
        }

        // Verify admin or ultimate plan
        const { data: roleData } = await supabaseServer.from('user_roles').select('role').eq('user_id', user.id).single();
        const isAdmin = roleData?.role === 'admin';

        if (!isAdmin) {
          const { data: balanceData } = await supabaseServer.from('clients_balances').select('plan_name').eq('user_id', user.id).single();
          if (!balanceData || balanceData.plan_name !== 'ultimate') {
            return NextResponse.json({ error: "Forbidden: Requires Ultimate Plan" }, { status: 403 });
          }
        }

        const supabase = createAdminClient();

        // Delete all messages for this instance
        const { error: msgError } = await supabase
            .from('messages')
            .delete()
            .eq('instance_id', instance);

        if (msgError) throw msgError;

        // Delete all contacts for this instance
        const { error: contactsError } = await supabase
            .from('contacts')
            .delete()
            .eq('instance_id', instance);

        if (contactsError) throw contactsError;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error clearing instance data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
