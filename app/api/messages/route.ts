import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const remoteJid = searchParams.get('remoteJid');
    const instance = searchParams.get('instance');
    
    if (!remoteJid || !instance) {
        return NextResponse.json({ error: "Missing remoteJid or instance" }, { status: 400 });
    }

    const cursorStr = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = createAdminClient();

    let allJids = [remoteJid];
    
    // Find aliases from contacts table to fetch full history across both LID and Real Number
    const { data: aliasContacts } = await supabase
        .from('contacts')
        .select('id, real_number')
        .eq('instance_id', instance)
        .or(`id.eq."${remoteJid}",real_number.eq."${remoteJid}"`);
        
    if (aliasContacts) {
        aliasContacts.forEach(c => {
            if (c.id && !allJids.includes(c.id)) allJids.push(c.id);
            if (c.real_number && !allJids.includes(c.real_number)) allJids.push(c.real_number);
        });
    }

    let query = supabase
        .from('messages')
        .select('*')
        .eq('instance_id', instance)
        .in('remote_jid', allJids)
        .order('message_timestamp', { ascending: false })
        .limit(limit);

    if (cursorStr) {
        const cursorDate = new Date(parseInt(cursorStr) * 1000).toISOString();
        query = query.lt('message_timestamp', cursorDate);
    }

    const { data: chatMessages, error } = await query;

    if (error) throw error;

    // Reverse to chronological order for the frontend
    chatMessages.reverse();

    // Format to match what frontend expects (Baileys format)
    const formattedMessages = chatMessages.map(msg => ({
        key: {
            id: msg.id,
            remoteJid: msg.remote_jid,
            fromMe: msg.from_me,
            participant: msg.participant
        },
        message: msg.raw_message?.message || { conversation: msg.content },
        messageTimestamp: new Date(msg.message_timestamp).getTime() / 1000,
        status: msg.status,
        pushName: msg.push_name
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
