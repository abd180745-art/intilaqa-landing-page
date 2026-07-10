import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
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

    const supabase = createAdminClient();

    // Verify admin or ultimate plan
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
    const isAdmin = roleData?.role === 'admin';

    if (!isAdmin) {
      const { data: balanceData } = await supabase.from('clients_balances').select('plan_name').eq('user_id', user.id).single();
      if (!balanceData || balanceData.plan_name !== 'ultimate') {
        return NextResponse.json({ error: "Forbidden: Requires Ultimate Plan" }, { status: 403 });
      }
    }

    // Fetch the 1000 most recent messages for this instance
    const { data: recentMessages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('instance_id', instance)
        .order('message_timestamp', { ascending: false })
        .limit(1000);

    if (msgError) throw msgError;

    // Group by remote_jid to get the latest message for each chat
    const latestMessagesMap = new Map();
    const contactIdsToFetch = new Set();

    for (const msg of (recentMessages || [])) {
        if (!latestMessagesMap.has(msg.remote_jid)) {
            latestMessagesMap.set(msg.remote_jid, msg);
            contactIdsToFetch.add(msg.remote_jid);
        }
    }

    // Fetch contacts for these JIDs
    let contactsMap = new Map();
    if (contactIdsToFetch.size > 0) {
        const { data: contactsData, error: contactsError } = await supabase
            .from('contacts')
            .select('*')
            .eq('instance_id', instance)
            .in('id', Array.from(contactIdsToFetch));
        
        if (!contactsError && contactsData) {
            for (const c of contactsData) {
                contactsMap.set(c.id, c);
            }
        }
    }

    const chats = Array.from(latestMessagesMap.values()).map(m => {
        const contact = contactsMap.get(m.remote_jid) || {};
        
        let finalPushName = contact.push_name && contact.push_name !== 'Você' ? contact.push_name : null;
        
        if (!finalPushName) {
            if (m.remote_jid.includes('@g.us')) {
                finalPushName = "مجموعة (Group)";
            } else {
                finalPushName = (m.push_name && m.push_name !== 'Você' && !m.from_me ? m.push_name : null);
            }
        }

        return {
            remoteJid: m.remote_jid,
            content: m.content,
            messageTimestamp: m.message_timestamp,
            status: m.status,
            fromMe: m.from_me,
            messageType: m.message_type,
            pushName: finalPushName,
            realNumber: contact.real_number,
            profilePicUrl: contact.profile_picture_url
        };
    });

    // Transform to match what frontend expects
    const formattedChats = chats.map((chat: any) => ({
      remoteJid: chat.remoteJid,
      pushName: chat.pushName || (chat.realNumber ? chat.realNumber.split('@')[0] : chat.remoteJid.split('@')[0]),
      realNumber: chat.realNumber || null,
      profilePicUrl: chat.profilePicUrl,
      conversationTimestamp: new Date(chat.messageTimestamp).getTime() / 1000,
      unreadCount: 0,
      lastMessage: {
        key: {
            remoteJid: chat.remoteJid,
            fromMe: chat.fromMe,
        },
        message: {
            conversation: chat.content,
            type: chat.messageType
        },
        status: chat.status
      }
    }));

    return NextResponse.json(formattedChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
