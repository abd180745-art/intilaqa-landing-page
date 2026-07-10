import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const event = body.event;
    const data = body.data;
    const instance = body.instance || "default_instance";
    
    const supabase = createAdminClient();

    if (event === 'messaging-history.set' || event === 'messages.set') {
        const historyMessages = Array.isArray(data) ? data : (data?.messages || []);
        
        if (historyMessages.length > 0) {
            console.log(`Processing ${historyMessages.length} historical messages...`);
            const messagesToInsert = [];
            const contactsToInsert = [];

            for (const msg of historyMessages) {
               try {
                   const remoteJid = msg.key?.remoteJid;
                   const id = msg.key?.id;
                   if (!remoteJid || !id) continue;
                   
                   const isGroup = remoteJid.includes('@g.us');
                   const isStatus = remoteJid === 'status@broadcast';
                   if (isStatus) continue;

                   const fromMe = msg.key?.fromMe || false;
                   const participant = isGroup && !fromMe ? msg.key?.participant : null;
                   const participantAlt = msg.key?.participantAlt || null;
                    
                   if (participantAlt && remoteJid.includes('@lid')) {
                       contactsToInsert.push({
                           id: remoteJid,
                           instance_id: instance,
                           real_number: participantAlt,
                           updated_at: new Date().toISOString()
                       });
                   }
                   
                   const messageContent = msg.message;
                   if (!messageContent) continue;
                   
                   let messageType = Object.keys(messageContent)[0];
                   let content = "";
                   
                   if (messageType === 'conversation') {
                       content = messageContent.conversation;
                   } else if (messageType === 'extendedTextMessage') {
                       content = messageContent.extendedTextMessage?.text;
                   } else {
                       content = `[${messageType}]`;
                   }

                   let status = "SERVER_ACK";
                   if (msg.status === 'ERROR') status = "ERROR";
                   else if (msg.status === 'PENDING') status = "PENDING";
                   else if (msg.status === 'SERVER_ACK') status = "SERVER_ACK";
                   else if (msg.status === 'DELIVERY_ACK') status = "DELIVERY_ACK";
                   else if (msg.status === 'READ') status = "READ";
                   else if (msg.status === 'PLAYED') status = "PLAYED";
                   
                   if (msg.userReceipt && Array.isArray(msg.userReceipt)) {
                       for(const receipt of msg.userReceipt) {
                           if (receipt.readTimestamp) status = "READ";
                           else if (receipt.deliveredTimestamp && status !== "READ") status = "DELIVERY_ACK";
                       }
                   }

                   messagesToInsert.push({
                       id: id,
                       instance_id: instance,
                       remote_jid: remoteJid,
                       from_me: fromMe,
                       participant: participant,
                       push_name: msg.pushName || null,
                       message_timestamp: new Date((msg.messageTimestamp || Date.now() / 1000) * 1000).toISOString(),
                       message_type: messageType,
                       content: content,
                       status: status,
                       raw_message: msg
                   });
               } catch (err) {
                   console.error("Error formatting historical message:", err);
               }
            }
            
            if (contactsToInsert.length > 0) {
                await supabase.from('contacts').upsert(contactsToInsert, { onConflict: 'instance_id, id' });
            }
            if (messagesToInsert.length > 0) {
                // To satisfy Foreign Key constraint, ensure all remote_jids exist in contacts first
                const uniqueJids = messagesToInsert.map(m => m.remote_jid).filter((v, i, a) => a.indexOf(v) === i);
                const fallbackContacts = uniqueJids.map(jid => ({ id: jid, instance_id: instance }));
                await supabase.from('contacts').upsert(fallbackContacts, { onConflict: 'instance_id, id' });

                // Upsert in chunks if necessary, but Supabase can handle a few thousand usually
                const { error } = await supabase.from('messages').upsert(messagesToInsert, { onConflict: 'id' });
                if (error) console.error("Supabase bulk insert error:", error);
            }
            console.log(`Finished processing historical messages.`);
        }
    } else if (event === 'messages.upsert' || event === 'send.message') {
        // Evolution API v2 sends the message object directly inside `data`
        const msgs = Array.isArray(data) ? data : [data];
        for(const msg of msgs) {
            try {
                const remoteJid = msg.key?.remoteJid;
                const id = msg.key?.id;
                if (!remoteJid || !id) continue;
                
                const isGroup = remoteJid.includes('@g.us');
                if (remoteJid === 'status@broadcast') continue;

                const fromMe = msg.key?.fromMe || false;
                const participant = isGroup && !fromMe ? msg.key?.participant : null;
                const participantAlt = msg.key?.participantAlt || null;
                
                if (participantAlt && remoteJid.includes('@lid')) {
                    await supabase.from('contacts').upsert({
                        id: remoteJid,
                        instance_id: instance,
                        real_number: participantAlt,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'instance_id, id' });
                }
                
                const messageContent = msg.message;
                if (!messageContent) continue;
                
                let messageType = Object.keys(messageContent)[0];
                let content = "";
                
                if (messageType === 'conversation') {
                    content = messageContent.conversation;
                } else if (messageType === 'extendedTextMessage') {
                    content = messageContent.extendedTextMessage?.text;
                } else {
                    content = `[${messageType}]`;
                }

                // Ensure contact exists before inserting message to satisfy foreign key constraint!
                await supabase.from('contacts').upsert({ id: remoteJid, instance_id: instance }, { onConflict: 'instance_id, id' });

                // Prevent overwriting advanced status (race condition)
                const { data: existingMsg } = await supabase.from('messages').select('status').eq('id', id).single();
                let finalStatus = msg.status || msg.update?.status || "SERVER_ACK";
                if (existingMsg && existingMsg.status) {
                    const statuses = ["PENDING", "SERVER_ACK", "DELIVERY_ACK", "READ", "PLAYED"];
                    const existingIdx = statuses.indexOf(existingMsg.status);
                    const newIdx = statuses.indexOf(finalStatus);
                    if (existingIdx > newIdx) {
                        finalStatus = existingMsg.status;
                    }
                }

                const { error } = await supabase.from('messages').upsert({
                    id: id,
                    instance_id: instance,
                    remote_jid: remoteJid,
                    from_me: fromMe,
                    participant: participant,
                    push_name: msg.pushName || null,
                    message_timestamp: new Date((msg.messageTimestamp || Date.now() / 1000) * 1000).toISOString(),
                    message_type: messageType,
                    content: content,
                    status: finalStatus,
                    raw_message: msg
                }, { onConflict: 'id' });
                
                if (error) console.error("Supabase upsert error:", error);

            } catch (err) {
                console.error("Error saving upsert message:", err);
            }
        }
    } else if (event === 'contacts.update' || event === 'contacts.upsert' || event === 'contacts.set') {
        const contactList = Array.isArray(data) ? data : [data];
        for (const c of contactList) {
            try {
                if (!c.remoteJid) continue;
                const finalName = c.name || c.pushName || null;
                
                const updateData: any = {
                    id: c.remoteJid,
                    instance_id: instance,
                    updated_at: new Date().toISOString()
                };
                if (finalName) updateData.push_name = finalName;
                if (c.profilePicUrl) updateData.profile_picture_url = c.profilePicUrl;
                if (c.lidJid) updateData.real_number = c.lidJid;

                await supabase.from('contacts').upsert(updateData, { onConflict: 'instance_id, id' });
            } catch (err) {
                console.error("Error saving contact:", err);
            }
        }
    } else if (event === 'messages.update') {
        const updates = Array.isArray(data) ? data : [data];
        for(const update of updates) {
            try {
                // Evolution API v2 sends keyId and status directly in the object
                const id = update.keyId || update.key?.id;
                const status = update.status || update.update?.status;
                
                if (id && status) {
                    // RACE CONDITION FIX: If messages.update arrives BEFORE send.message finishes,
                    // the update will be lost because the row doesn't exist yet.
                    const { data: existingMsg } = await supabase.from('messages').select('status').eq('id', id).single();
                    if (!existingMsg) {
                        // Wait 1.5 seconds to give send.message webhook time to insert the row
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    } else {
                        // Prevent backwards status updates if row already exists
                        const statuses = ["PENDING", "SERVER_ACK", "DELIVERY_ACK", "READ", "PLAYED"];
                        const existingIdx = statuses.indexOf(existingMsg.status);
                        const newIdx = statuses.indexOf(status);
                        if (existingIdx > newIdx) {
                            continue; // Skip update if current status is better
                        }
                    }

                    await supabase.from('messages')
                        .update({ status: status })
                        .eq('id', id);
                }
            } catch(err) {
                console.error("Error updating message status:", err);
            }
        }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Evolution Webhook Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
