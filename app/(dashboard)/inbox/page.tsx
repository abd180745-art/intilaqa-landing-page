"use client";

import { useEffect, useState, useRef, useMemo } from "react";

import { createClient } from "@/utils/supabase/client";

import { ContactsList } from "@/components/inbox/contacts-list";
import { ChatArea } from "@/components/inbox/chat-area";
import { ChatEmptyState } from "@/components/inbox/chat-empty-state";
import { ThemeToggle } from "@/components/inbox/theme-toggle";
import { Lightning } from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const BASE_URL = "/api/whatsapp";

export default function InboxPage() {
    const [INSTANCE, setINSTANCE] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isCheckingPlan, setIsCheckingPlan] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserAndPlan = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                setINSTANCE(`user_${user.id.replace(/-/g, '')}_wa`);
                
                try {
                    const planRes = await fetch('/api/user/plan');
                    if (planRes.ok) {
                        const planData = await planRes.json();
                        
                        // Check if admin first
                        const { data: roleData } = await supabase
                            .from('user_roles')
                            .select('role')
                            .eq('user_id', user.id)
                            .single();
                            
                        if (planData?.plan !== 'ultimate' && roleData?.role !== 'admin') {
                            router.push('/dashboard');
                            return;
                        }
                    } else {
                        router.push('/dashboard');
                        return;
                    }
                } catch (err) {
                    console.error("Error verifying plan:", err);
                    router.push('/dashboard');
                    return;
                }
            } else {
                router.push('/login');
                return;
            }
            setIsCheckingPlan(false);
        };
        fetchUserAndPlan();
    }, [router]);

    const [contacts, setContacts] = useState([]);
    const [visibleContactsCount, setVisibleContactsCount] = useState(30);
    const [selectedContact, setSelectedContact] = useState(null);
    const selectedContactRef = useRef(null);
    
    // Keep ref in sync
    useEffect(() => {
        selectedContactRef.current = selectedContact;
    }, [selectedContact]);

    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const messagesEndRef = useRef(null);

    // Recording states
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    const [waStatus, setWaStatus] = useState("initializing");
    const [waQrCode, setWaQrCode] = useState(null);
    const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);
    const [isSyncingHistory, setIsSyncingHistory] = useState(false);
    const syncTimeoutRef = useRef(null);

    // Fetch Connection Status & QR
    useEffect(() => {
        if (!INSTANCE) return;
        if (waStatus === 'connected') return; // Stop polling when connected!

        const checkWaStatus = async () => {
            try {
                const res = await fetch(`${BASE_URL}/instance/connectionState/${INSTANCE}`, {
                    headers: {}
                });
                if (res.status === 404) {
                    // Instance doesn't exist (maybe deleted on logout), create it
                    await fetch(`${BASE_URL}/instance/create`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            instanceName: INSTANCE,
                            qrcode: true,
                            integration: "WHATSAPP-BAILEYS"
                        })
                    });

                    // Enable deep history sync
                    await fetch(`${BASE_URL}/settings/set/${INSTANCE}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            rejectCall: false,
                            msgCall: '',
                            groupsIgnore: false,
                            alwaysOnline: false,
                            readMessages: false,
                            readStatus: false,
                            syncFullHistory: true 
                        })
                    });
                    
                    // Set webhook separately
                    await fetch(`${BASE_URL}/webhook/set/${INSTANCE}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            webhook: {
                                enabled: true,
                                url: "http://host.docker.internal:3000/api/webhooks/evolution",
                                webhookByEvents: false, // Send all to one URL
                                events: [
                                    "MESSAGES_SET",
                                    "CONNECTION_UPDATE",
                                    "MESSAGES_UPSERT",
                                    "MESSAGES_UPDATE",
                                    "MESSAGES_DELETE",
                                    "SEND_MESSAGE",
                                    "CONTACTS_SET",
                                    "CONTACTS_UPSERT",
                                    "CONTACTS_UPDATE",
                                    "PRESENCE_UPDATE",
                                    "CHATS_SET",
                                    "CHATS_UPSERT",
                                    "CHATS_UPDATE",
                                    "CHATS_DELETE"
                                ]
                            }
                        })
                    });
                    return; // Wait for next tick
                }
                if (!res.ok) throw new Error("Not ok");
                const data = await res.json();
                const state = data?.instance?.state || "disconnected";
                
                if (state === 'open') {
                    setWaStatus('connected');
                } else if (state === 'close' || state === 'connecting') {
                    const qrRes = await fetch(`${BASE_URL}/instance/connect/${INSTANCE}`, {
                        headers: {}
                    });
                    const qrData = await qrRes.json();
                    if (qrData.base64) {
                        setWaQrCode(qrData.base64);
                        setWaStatus('qr_ready');
                    } else if (state === 'connecting') {
                        setWaStatus('connecting');
                    } else {
                        setWaStatus('disconnected');
                    }
                } else {
                    setWaStatus('disconnected');
                }
            } catch (err) {
                setWaStatus("disconnected");
            }
        };
        
        checkWaStatus();
        const interval = setInterval(checkWaStatus, 3000);
        return () => clearInterval(interval);
    }, [INSTANCE]);

    // Fetch Contacts once
    useEffect(() => {
        if (!INSTANCE) return;
        if (waStatus !== 'connected') return;

        const fetchChats = async () => {
            try {
                setIsFetchingInitialData(true);
                const resChats = await fetch(`/api/chats?instance=${INSTANCE}`);

                if (resChats.ok) {
                    const data = await resChats.json();
                    
                    if (Array.isArray(data)) {
                        setContacts(data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch chats from local DB", err);
            } finally {
                setIsFetchingInitialData(false);
            }
        };

        fetchChats();
        
        // Expose to window for the websocket handler to re-trigger after history sync
        window.__reFetchChats = fetchChats;
    }, [waStatus, INSTANCE]);

    // Setup Supabase for Real-time WebSockets
    useEffect(() => {
        if (!INSTANCE || !userId) return;

        // Request Notification permission
        if (typeof window !== 'undefined' && "Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }

        const supabase = createClient();

        const channel = supabase.channel(`whatsapp_updates_${userId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `instance_id=eq.${INSTANCE}` },
                (payload) => {
                    const data = payload.new.raw_message;
                    if (!data) return;
                    
                    const now = Math.floor(Date.now() / 1000);
                    const msgTime = data.messageTimestamp || now;
                    
                    // Detect History Sync: If message is older than 5 minutes
                    if (now - msgTime > 300) {
                        setIsSyncingHistory(true);
                        
                        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
                        syncTimeoutRef.current = setTimeout(() => {
                            setIsSyncingHistory(false);
                            if (window.__reFetchChats) window.__reFetchChats(); // Re-fetch perfectly sorted from DB
                        }, 12000); // Wait 12 seconds of silence before assuming sync is fully complete
                        
                        return; // DO NOT update UI for bulk history messages!
                    }

                    const currentContact = selectedContactRef.current;
                    const isIncomingRealForCurrentLid = currentContact && currentContact.remoteJid.includes('@lid') && data.key?.remoteJid && !data.key.remoteJid.includes('@lid') && data.pushName === currentContact.pushName;
                    
                    const msgId = data.key?.id || data.id;
                    const existsInCurrentMessages = prevMessages => prevMessages.some(m => (m.key?.id || m.id) === msgId);
                    
                    const matchesSelected = currentContact && (
                        data.key?.remoteJid === currentContact.remoteJid || 
                        (currentContact.lidAliases && currentContact.lidAliases.includes(data.key?.remoteJid)) ||
                        isIncomingRealForCurrentLid ||
                        existsInCurrentMessages(messages) // If we already have this message ID, it's the same chat!
                    );

                    // Update messages array ONLY if we are currently chatting with this person
                    if (matchesSelected) {
                        setMessages(prevMessages => {
                            const existingIndex = prevMessages.findIndex(m => (m.key?.id || m.id) === (data.key?.id || data.id));
                            if (existingIndex !== -1) {
                                const updatedMessages = [...prevMessages];
                                updatedMessages[existingIndex] = {
                                    ...updatedMessages[existingIndex],
                                    ...data,
                                    MessageUpdate: data.MessageUpdate || updatedMessages[existingIndex].MessageUpdate
                                };
                                return updatedMessages.sort((a, b) => (a.messageTimestamp || 0) - (b.messageTimestamp || 0));
                            }
                            const updated = [...prevMessages, data];
                            return updated.sort((a, b) => (a.messageTimestamp || 0) - (b.messageTimestamp || 0));
                        });
                    }

                    // Notification Logic
                    const isFromMe = data.key?.fromMe || data.fromMe || data.pushName === INSTANCE;
                    if (!isFromMe && typeof window !== 'undefined' && "Notification" in window && Notification.permission === "granted") {
                        if (!matchesSelected || document.hidden) {
                            const senderName = data.pushName || data.key?.remoteJid?.split('@')[0] || "رسالة جديدة";
                            const text = data.message?.conversation || data.message?.extendedTextMessage?.text || "[مرفق/ميديا]";
                            new Notification(`رسالة من ${senderName}`, { body: text });
                        }
                    }

                    // Update contact list (move to top)
                    setContacts(prevContacts => {
                        const jid = data.key?.remoteJid;
                        if (!jid || jid.includes('status@broadcast') || jid.includes('@newsletter')) return prevContacts;
                        
                        // SMART MATCH: Did we just send this exact message ID to a LID contact?
                        const msgIdForMatch = data.key?.id || data.id;
                        const existingContactWithMsgId = prevContacts.find(c => (c.lastMessage?.key?.id || c.lastMessage?.id) === msgIdForMatch);
                        
                        let exists = false;
                        const updated = prevContacts.map(c => {
                            if (c.remoteJid === jid || c === existingContactWithMsgId) {
                                exists = true;
                                
                                // Dynamically learn the alias if the webhook sends a different JID for the same message
                                let newAliases = c.lidAliases || [];
                                if (c.remoteJid !== jid && !newAliases.includes(jid)) {
                                    newAliases = [...newAliases, jid];
                                    
                                    // Save mapping to database automatically!
                                    fetch('/api/contacts/merge', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ 
                                            oldJid: c.remoteJid, 
                                            newJid: jid, 
                                            instance: INSTANCE 
                                        })
                                    }).catch(err => console.error("Auto-merge failed", err));
                                }
                                
                                return { 
                                    ...c, 
                                    lidAliases: newAliases,
                                    conversationTimestamp: data.messageTimestamp || Math.floor(Date.now() / 1000),
                                    lastMessage: data 
                                };
                            }
                            return c;
                        });
                        
                        if (!exists) {
                            return [{
                                remoteJid: jid,
                                pushName: jid.includes('@g.us') ? "مجموعة (Group)" : ((!isFromMe && data.pushName) ? data.pushName : jid.split('@')[0]),
                                conversationTimestamp: data.messageTimestamp || Math.floor(Date.now() / 1000),
                                unreadCount: isFromMe ? 0 : 1,
                                lastMessage: data
                            }, ...updated];
                        }
                        return updated.sort((a, b) => (b.conversationTimestamp || 0) - (a.conversationTimestamp || 0));
                    });
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'messages', filter: `instance_id=eq.${INSTANCE}` },
                (payload) => {
                    const updatedRow = payload.new;
                    setMessages(prevMessages => {
                        return prevMessages.map(m => {
                            const dataId = updatedRow.id;
                            if ((m.key?.id || m.id) === dataId) {
                                const newStatus = updatedRow.status;
                                return {
                                    ...m,
                                    status: newStatus || m.status,
                                    MessageUpdate: [...(m.MessageUpdate || []), { status: newStatus }]
                                };
                            }
                            return m;
                        });
                    });
                    
                    // Also update the sidebar contact lastMessage status
                    setContacts(prevContacts => {
                        return prevContacts.map(c => {
                            if ((c.lastMessage?.key?.id || c.lastMessage?.id) === updatedRow.id) {
                                return {
                                    ...c,
                                    lastMessage: {
                                        ...c.lastMessage,
                                        status: updatedRow.status || c.lastMessage.status
                                    }
                                };
                            }
                            return c;
                        });
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [INSTANCE, userId]);

    // Fetch avatars slowly using a Queue
    const avatarQueue = useRef(new Set());
    const isFetchingAvatar = useRef(false);

    const handleImageError = (jid) => {
        // When an image expires, reset it to null so the queue refetches it
        setContacts(prev => prev.map(c => c.remoteJid === jid ? { ...c, profilePicUrl: null } : c));
    };

    useEffect(() => {
        const processQueue = async () => {
            if (isFetchingAvatar.current || avatarQueue.current.size === 0) return;
            isFetchingAvatar.current = true;

            const jid = Array.from(avatarQueue.current)[0];
            avatarQueue.current.delete(jid);

            try {
                const res = await fetch(`${BASE_URL}/chat/fetchProfilePictureUrl/${INSTANCE}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ number: jid })
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.profilePictureUrl) {
                        localStorage.setItem(`avatar_${jid}`, data.profilePictureUrl);
                        setContacts(prev => prev.map(c => c.remoteJid === jid ? { ...c, profilePicUrl: data.profilePictureUrl } : c));
                        if (selectedContact?.remoteJid === jid) {
                            setSelectedContact(prev => ({ ...prev, profilePicUrl: data.profilePictureUrl }));
                        }
                    } else {
                        localStorage.setItem(`avatar_${jid}`, 'none');
                        // Mark as none to prevent retrying
                        setContacts(prev => prev.map(c => c.remoteJid === jid ? { ...c, profilePicUrl: 'none' } : c));
                    }
                }
            } catch (err) {
                // Ignore errors
            }
            
            await new Promise(r => setTimeout(r, 2000)); // 2 second delay to avoid rate limit
            isFetchingAvatar.current = false;
            processQueue(); 
        };

        // Add all missing avatars to queue, but check localStorage first!
        let hasUpdates = false;
        const updatedContacts = contacts.map(c => {
            if (!c.profilePicUrl && c.profilePicUrl !== 'none') {
                const cached = localStorage.getItem(`avatar_${c.remoteJid}`);
                if (cached) {
                    hasUpdates = true;
                    return { ...c, profilePicUrl: cached };
                } else {
                    avatarQueue.current.add(c.remoteJid);
                }
            }
            return c;
        });

        if (hasUpdates) {
            setContacts(updatedContacts);
        } else if (!isFetchingAvatar.current && avatarQueue.current.size > 0) {
            processQueue();
        }
    }, [contacts]);

    // SMART MERGE: Group LID and Real contacts
    const displayContacts = useMemo(() => {
        const merged = [];

        // Filter out status, newsletters (channels)
        const validContacts = contacts.filter(c => 
            c.remoteJid && 
            !c.remoteJid.includes('status@broadcast') && 
            !c.remoteJid.includes('@newsletter')
        );

        // Separate standard contacts and LID contacts
        const realContacts = validContacts.filter(c => !c.remoteJid.includes('@lid'));
        const lidContacts = validContacts.filter(c => c.remoteJid.includes('@lid'));

        realContacts.forEach(rc => {
            // Find LID contacts that share the exact same profilePicUrl or exactly matching pushName, OR match by realNumber!
            const matchingLids = lidContacts.filter(lc => 
                (lc.realNumber && lc.realNumber === rc.remoteJid) ||
                (lc.profilePicUrl && rc.profilePicUrl && lc.profilePicUrl === rc.profilePicUrl && lc.profilePicUrl !== 'none') ||
                (lc.pushName && rc.pushName && lc.pushName !== 'Você' && rc.pushName === lc.pushName && !/^\d+$/.test(lc.pushName))
            );
            
            const rcCopy = { ...rc, lidAliases: [] };
            
            if (matchingLids.length > 0) {
                rcCopy.lidAliases = matchingLids.map(l => l.remoteJid);
                // Inherit timestamp and lastMessage from LID if it's more recent
                matchingLids.forEach(lc => {
                    if ((lc.conversationTimestamp || 0) > (rcCopy.conversationTimestamp || 0)) {
                        rcCopy.conversationTimestamp = lc.conversationTimestamp;
                        rcCopy.lastMessage = lc.lastMessage;
                    }
                });
                // Inherit pushName if real contact doesn't have one
                if (!rcCopy.pushName || /^\d+$/.test(rcCopy.pushName) || rcCopy.pushName === 'Você') {
                    const newestLidContact = matchingLids.sort((a, b) => (b.conversationTimestamp || 0) - (a.conversationTimestamp || 0))[0];
                    if (newestLidContact?.pushName && newestLidContact.pushName !== 'Você' && !/^\d+$/.test(newestLidContact.pushName)) {
                        rcCopy.pushName = newestLidContact.pushName;
                    }
                }
            }
            merged.push(rcCopy);
        });

        // Add remaining LID contacts that didn't match
        lidContacts.forEach(lc => {
            const isMerged = merged.some(rc => rc.lidAliases?.includes(lc.remoteJid));
            if (!isMerged) {
                // Group LID contacts with EXACT SAME pushName
                const existingGroup = merged.find(m => m.pushName && m.pushName !== 'Você' && m.pushName === lc.pushName && !/^\d+$/.test(lc.pushName));
                if (existingGroup) {
                    existingGroup.lidAliases.push(lc.remoteJid);
                } else {
                    merged.push(lc);
                }
            }
        });

        return merged.sort((a, b) => (b.conversationTimestamp || 0) - (a.conversationTimestamp || 0));
    }, [contacts]);

    // Fetch History ONCE when contact is selected
    useEffect(() => {
        if (!selectedContact || waStatus !== 'connected') return;
        
        setMessages([]); // Clear messages immediately when switching contact
        setHasMore(true);

        const fetchMessages = async () => {
            try {
                // Determine all JIDs to fetch (real + aliases)
                const jidsToFetch = [selectedContact.remoteJid];
                if (selectedContact.lidAliases && selectedContact.lidAliases.length > 0) {
                    jidsToFetch.push(...selectedContact.lidAliases);
                }

                const allMessages = [];

                for (const jid of jidsToFetch) {
                    const res = await fetch(`/api/messages?remoteJid=${jid}&instance=${INSTANCE}&limit=50`);
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data)) {
                            allMessages.push(...data);
                        }
                    }
                }

                // Deduplicate and sort all combined messages
                // Prioritize keeping the duplicate that has MessageUpdate elements or a status
                const msgMap = new Map();
                for (const m of allMessages) {
                    const id = m.key?.id || m.id;
                    const existing = msgMap.get(id);
                    
                    if (!existing) {
                        msgMap.set(id, m);
                    } else {
                        // If current has updates but existing doesn't, overwrite existing
                        const currentHasUpdates = (m.MessageUpdate && m.MessageUpdate.length > 0) || m.status;
                        const existingHasUpdates = (existing.MessageUpdate && existing.MessageUpdate.length > 0) || existing.status;
                        
                        if (currentHasUpdates && !existingHasUpdates) {
                            msgMap.set(id, m);
                        }
                    }
                }
                
                const uniqueMessages = Array.from(msgMap.values())
                                            .sort((a, b) => (a.messageTimestamp || 0) - (b.messageTimestamp || 0));
                
                setMessages(uniqueMessages);
                
                // Extract pushName from messages if the contact doesn't have one
                        if (!selectedContact.pushName || /^\d+$/.test(selectedContact.pushName) || selectedContact.pushName === 'Você') {
                            const firstMsgFromThem = uniqueMessages.find(m => !m.key?.fromMe && m.pushName && m.pushName !== 'Você' && !/^\d+$/.test(m.pushName));
                            if (firstMsgFromThem && firstMsgFromThem.pushName) {
                                setContacts(prev => prev.map(c => c.remoteJid === selectedContact.remoteJid ? { ...c, pushName: firstMsgFromThem.pushName } : c));
                                setSelectedContact(prev => ({ ...prev, pushName: firstMsgFromThem.pushName }));
                            }
                        }
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };

        fetchMessages();
    }, [selectedContact?.remoteJid, waStatus]);

    const loadMoreMessages = async () => {
        if (!selectedContact || isLoadingMore || !hasMore || messages.length === 0) return;
        
        setIsLoadingMore(true);
        // messages are sorted oldest first, so index 0 is the oldest
        const cursor = messages[0]?.messageTimestamp || 0;

        try {
            const jidsToFetch = [selectedContact.remoteJid];
            if (selectedContact.lidAliases && selectedContact.lidAliases.length > 0) {
                jidsToFetch.push(...selectedContact.lidAliases);
            }

            const allMessages = [];
            for (const jid of jidsToFetch) {
                const res = await fetch(`/api/messages?remoteJid=${jid}&instance=${INSTANCE}&cursor=${cursor}&limit=50`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        allMessages.push(...data);
                    }
                }
            }

            if (allMessages.length === 0) {
                setHasMore(false);
                setIsLoadingMore(false);
                return;
            }

            setMessages(prev => {
                const msgMap = new Map();
                for (const m of allMessages) {
                    msgMap.set(m.key?.id || m.id, m);
                }
                for (const m of prev) {
                    msgMap.set(m.key?.id || m.id, m);
                }
                return Array.from(msgMap.values()).sort((a, b) => (a.messageTimestamp || 0) - (b.messageTimestamp || 0));
            });
            
            if (allMessages.length < 50) {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Failed to fetch more messages", err);
        }
        setIsLoadingMore(false);
    };

    const prevLastMessageIdRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        if (!messages || messages.length === 0) {
            prevLastMessageIdRef.current = null;
            return;
        }
        
        const currentLastMessage = messages[messages.length - 1];
        const currentLastMessageId = currentLastMessage.key?.id || currentLastMessage.id;
        
        // Only scroll to bottom on initial load OR if a new message is added to the END
        if (prevLastMessageIdRef.current !== currentLastMessageId) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            prevLastMessageIdRef.current = currentLastMessageId;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!replyText.trim() || !selectedContact) return;
        const textToSend = replyText;
        setReplyText("");

        // Format number correctly (remove @s.whatsapp.net if present, but Evolution handles both)
        const number = selectedContact.remoteJid;
        
        // Optimistic UI Update (Instant display)
        const tempId = "temp_" + Date.now();
        const optimisticMsg = {
            key: { id: tempId, remoteJid: number, fromMe: true },
            message: { conversation: textToSend },
            messageTimestamp: Math.floor(Date.now() / 1000),
            status: "PENDING",
            pushName: "Você"
        };
        
        setMessages(prev => [...prev, optimisticMsg]);
        setContacts(prev => {
            const updated = prev.map(c => 
                c.remoteJid === number || (c.lidAliases && c.lidAliases.includes(number)) 
                    ? { ...c, conversationTimestamp: optimisticMsg.messageTimestamp, lastMessage: optimisticMsg } 
                    : c
            );
            return updated.sort((a, b) => (b.conversationTimestamp || 0) - (a.conversationTimestamp || 0));
        });

        try {
            const res = await fetch(`${BASE_URL}/message/sendText/${INSTANCE}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    number: number,
                    text: textToSend
                })
            });
            if (res.ok) {
                const newMsg = await res.json();
                setMessages(prev => {
                    const filtered = prev.filter(m => m.key?.id !== tempId);
                    if (filtered.some(m => (m.key?.id || m.id) === (newMsg.key?.id || newMsg.id))) return filtered;
                    return [...filtered, newMsg].sort((a, b) => (a.messageTimestamp || 0) - (b.messageTimestamp || 0));
                });
                setContacts(prev => {
                    const updated = prev.map(c => 
                        c.remoteJid === number || (c.lidAliases && c.lidAliases.includes(number)) 
                            ? { ...c, conversationTimestamp: newMsg.messageTimestamp || Math.floor(Date.now() / 1000), lastMessage: newMsg } 
                            : c
                    );
                    return updated.sort((a, b) => (b.conversationTimestamp || 0) - (a.conversationTimestamp || 0));
                });
            } else {
                // Remove optimistic message if failed
                setMessages(prev => prev.filter(m => m.key?.id !== tempId));
            }
        } catch (err) {
            console.error("Error sending message:", err);
            // Remove optimistic message if failed
            setMessages(prev => prev.filter(m => m.key?.id !== tempId));
        }
    };

    const handleLogout = async () => {
        try {
            // 1. Delete instance completely from Evolution API
            await fetch(`${BASE_URL}/instance/delete/${INSTANCE}`, { 
                method: "DELETE",
                headers: {}
            });

            // 2. Clear all messages and contacts from Supabase to prevent mixing if a new number is scanned
            await fetch(`/api/instance/clear?instance=${INSTANCE}`, {
                method: "DELETE"
            });

            setWaStatus("disconnected");
            setSelectedContact(null);
            setContacts([]);
            setMessages([]);
        } catch (err) {
            console.error("Error logging out:", err);
        }
    };

    const fileInputRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedContact) return;

        // Reset input
        e.target.value = null;

        const reader = new FileReader();
        reader.onload = async () => {
            const base64Data = reader.result;
            // Send Media using Evolution API Base64 format
            try {
                const res = await fetch(`${BASE_URL}/message/sendMedia/${INSTANCE}`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        number: selectedContact.remoteJid,
                        mediaMessage: {
                            mediatype: "document", // Evolution API usually auto-detects or we specify
                            fileName: file.name,
                            media: base64Data.split(',')[1] // remove data:image/png;base64,
                        }
                    })
                });
                if (res.ok) {
                    const newMsg = await res.json();
                    setMessages(prev => {
                        if (prev.some(m => (m.key?.id || m.id) === (newMsg.key?.id || newMsg.id))) return prev;
                        return [...prev, newMsg].sort((a, b) => (a.messageTimestamp || 0) - (b.messageTimestamp || 0));
                    });
                    setContacts(prev => {
                        const jid = selectedContact.remoteJid;
                        const updated = prev.map(c => 
                            c.remoteJid === jid || (c.lidAliases && c.lidAliases.includes(jid)) 
                                ? { ...c, conversationTimestamp: newMsg.messageTimestamp || Math.floor(Date.now() / 1000), lastMessage: newMsg } 
                                : c
                        );
                        return updated.sort((a, b) => (b.conversationTimestamp || 0) - (a.conversationTimestamp || 0));
                    });
                }
            } catch (err) {
                console.error("Error sending media:", err);
            }
        };
        reader.readAsDataURL(file);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                
                const reader = new FileReader();
                reader.onload = async () => {
                    const base64Data = reader.result;
                    try {
                        const res = await fetch(`${BASE_URL}/message/sendWhatsAppAudio/${INSTANCE}`, {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                number: selectedContact.remoteJid,
                                audioMessage: {
                                    audio: base64Data.split(',')[1]
                                }
                            })
                        });
                        if (res.ok) {
                            const newMsg = await res.json();
                            setMessages(prev => {
                                if (prev.some(m => (m.key?.id || m.id) === (newMsg.key?.id || newMsg.id))) return prev;
                                return [...prev, newMsg].sort((a, b) => (a.messageTimestamp || 0) - (b.messageTimestamp || 0));
                            });
                            setContacts(prev => {
                                const jid = selectedContact.remoteJid;
                                const updated = prev.map(c => 
                                    c.remoteJid === jid || (c.lidAliases && c.lidAliases.includes(jid)) 
                                        ? { ...c, conversationTimestamp: newMsg.messageTimestamp || Math.floor(Date.now() / 1000), lastMessage: newMsg } 
                                        : c
                                );
                                return updated.sort((a, b) => (b.conversationTimestamp || 0) - (a.conversationTimestamp || 0));
                            });
                        }
                    } catch (err) {
                        console.error("Error sending voice:", err);
                    }
                };
                reader.readAsDataURL(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);

        } catch (err) {
            console.error("Failed to access microphone:", err);
            alert("فشل الوصول إلى الميكروفون.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const mappedContacts = displayContacts.map(c => {
        let text = c.lastMessage?.message?.conversation || c.lastMessage?.message?.extendedTextMessage?.text || "";
        if (!text && c.lastMessage?.message?.imageMessage) text = "📷 صورة";
        if (!text && c.lastMessage?.message?.audioMessage) text = "🎵 مقطع صوتي";
        if (!text && c.lastMessage?.message?.documentMessage) text = "📄 مستند";
        if (!text && c.lastMessage?.message?.videoMessage) text = "🎥 فيديو";
        if (!text && c.lastMessage?.message?.stickerMessage) text = "🏷️ ملصق";
        if (!text) text = "رسالة";

        const isFromMe = c.lastMessage?.key?.fromMe || c.lastMessage?.fromMe || c.lastMessage?.pushName === INSTANCE;
        
        let receiptStatus = "sent";
        const realStatus = c.lastMessage?._realStatus || c.lastMessage?.status;
        const hasRead = realStatus === 'READ' || (c.lastMessage?.MessageUpdate && c.lastMessage.MessageUpdate.some(u => u.status === 'READ'));
        const hasDelivery = realStatus === 'DELIVERY_ACK' || hasRead || (c.lastMessage?.MessageUpdate && c.lastMessage.MessageUpdate.some(u => u.status === 'DELIVERY_ACK'));
        if (hasRead) receiptStatus = "read";
        else if (hasDelivery) receiptStatus = "delivered";

        return {
            id: c.remoteJid,
            name: c.remoteJid.includes('@g.us') ? "مجموعة (Group)" : ((!c.pushName || /^\d+$/.test(c.pushName) || c.pushName === 'Você') ? (c.realNumber ? '+' + c.realNumber.split('@')[0] : (c.remoteJid.includes('@lid') ? 'رقم خاص (مخفي من واتساب)' : '+' + c.remoteJid.split('@')[0])) : c.pushName),
            initials: c.remoteJid.includes('@g.us') ? "G" : ((!c.pushName || /^\d+$/.test(c.pushName) || c.pushName === 'Você') ? "?" : c.pushName.charAt(0)),
            tone: "orange",
            lastMessage: text,
            lastMessageFromMe: isFromMe,
            lastMessageReceipt: receiptStatus,
            timestamp: c.conversationTimestamp ? new Date(c.conversationTimestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "",
            unread: c.unreadCount || 0,
            status: "human", // Can map from tags if needed
            online: false,
            phone: (c.realNumber || c.remoteJid).split('@')[0],
            email: "",
            tags: [],
            note: "",
            messages: [],
            lidAliases: c.lidAliases
        };
    });

    const activeContact = mappedContacts.find(c => 
        c.id === selectedContact?.remoteJid || 
        (selectedContact?.remoteJid && c.lidAliases && c.lidAliases.includes(selectedContact.remoteJid))
    ) || null;

    // Automatically update selectedContact if it was merged so subsequent messages route correctly
    useEffect(() => {
        if (activeContact && selectedContact && activeContact.id !== selectedContact.remoteJid) {
            setSelectedContact({ remoteJid: activeContact.id, pushName: activeContact.name, realNumber: activeContact.phone });
        }
    }, [activeContact, selectedContact]);

    if (activeContact && selectedContact) {
        const mappedMsgs = messages.map(m => {
            const isFromMe = m.key?.fromMe || m.fromMe || m.pushName === INSTANCE;
            let text = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
            if (!text && m.message?.imageMessage) text = "📷 صورة";
            if (!text && m.message?.audioMessage) text = "🎵 مقطع صوتي";
            if (!text && m.message?.documentMessage) text = "📄 مستند";
            if (!text && m.message?.videoMessage) text = "🎥 فيديو";
            if (!text && m.message?.stickerMessage) text = "🏷️ ملصق";
            
            // Receipt logic
            let receiptStatus = "sent";
            const realStatus = m._realStatus || m.status;
            const hasRead = realStatus === 'READ' || (m.MessageUpdate && m.MessageUpdate.some(u => u.status === 'READ'));
            const hasDelivery = realStatus === 'DELIVERY_ACK' || hasRead || (m.MessageUpdate && m.MessageUpdate.some(u => u.status === 'DELIVERY_ACK'));
            if (hasRead) receiptStatus = "read";
            else if (hasDelivery) receiptStatus = "delivered";

            const mediaMessage = m.message?.imageMessage || m.message?.audioMessage || m.message?.videoMessage || m.message?.documentMessage || m.message?.stickerMessage;
            const mediaObj = mediaMessage ? { ...mediaMessage, _instance: INSTANCE, mimetype: mediaMessage.mimetype, fileName: mediaMessage.fileName } : null;

            return {
                id: m.key?.id || m.id,
                direction: isFromMe ? "outgoing" : "incoming",
                text: text,
                time: new Date((m.messageTimestamp || Date.now()/1000) * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                day: new Date((m.messageTimestamp || Date.now()/1000) * 1000).toISOString().split('T')[0],
                dayLabel: new Date((m.messageTimestamp || Date.now()/1000) * 1000).toLocaleDateString('ar-SA'),
                receipt: receiptStatus,
                mediaObj: mediaObj
            };
        });

        // Cascade read/delivery status backwards for UI robustness
        let maxReceiptLevel = 0;
        const receiptMap = { "sent": 0, "delivered": 1, "read": 2 };
        const reverseReceiptMap = { 0: "sent", 1: "delivered", 2: "read" };

        for (let i = mappedMsgs.length - 1; i >= 0; i--) {
            const msg = mappedMsgs[i];
            if (msg.direction === "outgoing") {
                const currentLevel = receiptMap[msg.receipt];
                if (currentLevel > maxReceiptLevel) {
                    maxReceiptLevel = currentLevel;
                } else if (currentLevel < maxReceiptLevel) {
                    msg.receipt = reverseReceiptMap[maxReceiptLevel];
                }
            } else {
                // If they sent us a message, they must have seen our older messages
                maxReceiptLevel = 2; // read
            }
        }
        
        activeContact.messages = mappedMsgs;
    }

    if (isSyncingHistory) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-background p-6" dir="rtl">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <h2 className="text-xl font-bold text-foreground">جاري مزامنة السجل...</h2>
                <p className="text-md text-muted-foreground text-center">يرجى الانتظار بينما نقوم بتحميل وترتيب رسائلك القديمة بشكل كامل. سيتم فتح الصفحة تلقائياً عند الانتهاء.</p>
            </div>
        );
    }

    if (isFetchingInitialData && waStatus === 'connected') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background" dir="rtl">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-md text-muted-foreground">جاري تحميل المحادثات...</p>
            </div>
        );
    }

    return (
        <main className="flex h-dvh flex-col bg-background p-3 sm:p-4 lg:p-6" dir="rtl">
            {/* Top bar */}
            <header className="mb-3 flex items-center justify-between px-1 sm:mb-4">
                <div></div>
                <div className="flex items-center gap-4">
                    {waStatus === 'connected' && (
                        <button 
                            onClick={handleLogout} 
                            className="text-xs font-semibold bg-red-100/50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors border border-red-200/50"
                        >
                            تسجيل خروج
                        </button>
                    )}
                    <span className={`w-3 h-3 rounded-full ${waStatus === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : waStatus === 'qr_ready' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></span>
                    <ThemeToggle />
                </div>
            </header>

            {waStatus === 'qr_ready' && waQrCode ? (
                <div className="flex flex-col items-center justify-center h-full bg-card rounded-3xl border border-border/60 shadow-sm p-8">
                    <h2 className="text-2xl font-bold mb-6 text-foreground">مسح رمز QR للاتصال بـ WhatsApp</h2>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
                        <img src={waQrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
                    </div>
                    <p className="mt-6 text-muted-foreground text-center">افتح واتساب على هاتفك، اذهب إلى الأجهزة المرتبطة، وقم بمسح هذا الرمز.</p>
                </div>
            ) : waStatus !== 'connected' ? (
                <div className="flex flex-col items-center justify-center h-full bg-card rounded-3xl border border-border/60 shadow-sm p-8 text-center">
                    <span className="flex size-16 items-center justify-center rounded-[2rem] border border-border/60 bg-card shadow-sm mb-6 animate-pulse">
                        <span className={`w-4 h-4 rounded-full ${waStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                    </span>
                    <h2 className="text-2xl font-bold mb-2 text-foreground">
                        {waStatus === 'connecting' ? 'جاري الاتصال...' : 'غير متصل'}
                    </h2>
                    <p className="text-muted-foreground max-w-sm">
                        {waStatus === 'connecting' 
                            ? 'يرجى الانتظار بينما نقوم بإنشاء جلسة الواتساب الخاصة بك.' 
                            : 'لا يمكن الاتصال بخوادم الواتساب. يرجى التأكد من أن الخادم يعمل بشكل صحيح.'}
                    </p>
                </div>
            ) : (
                <div className="flex min-h-0 flex-1 gap-4 lg:gap-6 relative">
                    <div className={cn("min-h-0 w-full lg:w-[32%] lg:max-w-sm", activeContact ? "hidden lg:block" : "block")}>
                        <ContactsList 
                            contacts={mappedContacts}
                            activeId={activeContact?.id ?? null} 
                            onSelect={(c) => setSelectedContact({ remoteJid: c.id, pushName: c.name, realNumber: c.phone })} 
                        />
                    </div>
                    <div className={cn("min-h-0 min-w-0 flex-1", activeContact ? "block" : "hidden lg:block")}>
                        {activeContact ? (
                            <ChatArea 
                                contact={activeContact} 
                                onBack={() => setSelectedContact(null)} 
                                replyingTo={replyingTo}
                                onReply={(msg) => setReplyingTo(msg)}
                                onCancelReply={() => setReplyingTo(null)}
                                onDeleteMessage={async (msg, forEveryone) => {
                                    // Optimistic UI update
                                    setMessages(prev => prev.filter(m => (m.key?.id || m.id) !== msg.id));
                                    
                                    try {
                                        const res = await fetch(`/api/messages/delete?instance=${INSTANCE}&number=${activeContact.id}&messageId=${msg.id}`, {
                                            method: 'DELETE'
                                        });
                                        if (!res.ok) {
                                            // Optional: handle failure by re-fetching or showing a toast
                                            console.error("Failed to delete message");
                                        }
                                    } catch (err) {
                                        console.error("Error deleting message:", err);
                                    }
                                }}
                                onSendMessage={async (text) => {
                                    if (text) {
                                        const textToSend = text;
                                        const number = activeContact.id;
                                        
                                        // Optimistic UI Update (Instant display)
                                        const tempId = "temp_" + Date.now();
                                        const optimisticMsg = {
                                            key: { id: tempId, remoteJid: number, fromMe: true },
                                            message: { conversation: textToSend },
                                            messageTimestamp: Math.floor(Date.now() / 1000),
                                            status: "PENDING",
                                            pushName: "Você"
                                        };
                                        
                                        if (replyingTo) {
                                            optimisticMsg.message.extendedTextMessage = {
                                                text: textToSend,
                                                contextInfo: {
                                                    stanzaId: replyingTo.id,
                                                    participant: replyingTo.direction === 'outgoing' ? INSTANCE : number,
                                                    quotedMessage: replyingTo.mediaObj || { conversation: replyingTo.text }
                                                }
                                            };
                                        }
                                        
                                        setMessages(prev => [...prev, optimisticMsg]);
                                        
                                        // Clear reply state
                                        const currentReply = replyingTo;
                                        setReplyingTo(null);
                                        
                                        try {
                                            const bodyData: any = { 
                                                number: number, 
                                                text: textToSend, // Keep for backward compatibility
                                                textMessage: { text: textToSend } // For Evolution v2
                                            };
                                            
                                            if (currentReply) {
                                                bodyData.options = {
                                                    delay: 0,
                                                    quoted: {
                                                        key: { 
                                                            id: currentReply.id,
                                                            remoteJid: number,
                                                            fromMe: currentReply.direction === 'outgoing'
                                                        },
                                                        message: { 
                                                            conversation: currentReply.text || "مرفق" 
                                                        }
                                                    }
                                                };
                                            }

                                            const res = await fetch(`${BASE_URL}/message/sendText/${INSTANCE}`, {
                                                method: "POST",
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(bodyData)
                                            });
                                            if (res.ok) {
                                                const newMsg = await res.json();
                                                setMessages(prev => {
                                                    const filtered = prev.filter(m => m.key?.id !== tempId);
                                                    if (filtered.some(m => (m.key?.id || m.id) === (newMsg.key?.id || newMsg.id))) return filtered;
                                                    return [...filtered, newMsg].sort((a, b) => (a.messageTimestamp || 0) - (b.messageTimestamp || 0));
                                                });
                                            } else {
                                                setMessages(prev => prev.filter(m => m.key?.id !== tempId));
                                            }
                                        } catch (err) {
                                            console.error("Error sending message:", err);
                                            setMessages(prev => prev.filter(m => m.key?.id !== tempId));
                                        }
                                    }
                                }}
                                onAttachClick={() => fileInputRef.current?.click()}
                                isRecording={isRecording}
                                recordingTime={recordingTime}
                                onRecordStart={startRecording}
                                onRecordStop={stopRecording}
                                onLoadMore={loadMoreMessages}
                                hasMore={hasMore}
                                isLoadingMore={isLoadingMore}
                            />
                        ) : (
                            <div className="h-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
                                <ChatEmptyState />
                            </div>
                        )}
                    </div>
                    {/* Hidden input for files */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileUpload}
                    />
                </div>
            )}
        </main>
    );
}
