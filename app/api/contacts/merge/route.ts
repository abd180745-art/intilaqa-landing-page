import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(req: Request) {
    try {
        const { oldJid, newJid, instance } = await req.json();

        if (!oldJid || !newJid || !instance) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // 1. Update all messages belonging to oldJid to point to newJid
        const { error: msgError } = await supabase
            .from('messages')
            .update({ remote_jid: newJid })
            .eq('instance_id', instance)
            .eq('remote_jid', oldJid);

        if (msgError) {
            console.error("Error updating messages during merge:", msgError);
            throw msgError;
        }

        // 2. Delete the old contact from contacts table
        const { error: contactError } = await supabase
            .from('contacts')
            .delete()
            .eq('instance_id', instance)
            .eq('id', oldJid);

        if (contactError) {
            console.error("Error deleting old contact during merge:", contactError);
            // It's okay if this fails, the messages are already moved.
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Merge contacts error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
