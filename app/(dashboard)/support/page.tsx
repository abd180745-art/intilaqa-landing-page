"use client"

import { useState, useEffect, useRef } from "react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { createClient } from "@/utils/supabase/client"
import { 
  PaperPlaneRight, 
  Lifebuoy, 
  Plus, 
  CheckCircle,
  ChatCircleText,
  Clock,
  CircleNotch,
  WarningCircle,
  User,
  Headset
} from "@phosphor-icons/react/dist/ssr"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"
import { toast } from "sonner" // Assuming sonner is used for toasts, or we can use another one. I'll stick to a simple UI first.

export default function SupportPage() {
  const { data, isLoading: isStatsLoading } = useDashboardStats()
  const [tickets, setTickets] = useState<any[]>([])
  const [activeTicket, setActiveTicket] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [newTicketTitle, setNewTicketTitle] = useState("")
  const [user, setUser] = useState<any>(null)
  const [clients, setClients] = useState<Record<string, any>>({})
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const isAdmin = data?.role === "admin"

  // Fetch current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  // Fetch Clients for Mapping (using dashboard stats which bypasses RLS)
  useEffect(() => {
    if (data?.topClients) {
      const clientsMap: Record<string, any> = {}
      data.topClients.forEach((c: any) => {
        if (c.userId) {
          clientsMap[c.userId] = { client_name: c.name, email: c.email }
        }
      })
      setClients(clientsMap)
    }
  }, [data?.topClients])

  // Fetch Tickets
  useEffect(() => {
    if (!user) return

    const fetchTickets = async () => {
      let query = supabase.from("support_tickets").select("*").order("updated_at", { ascending: false })
      if (!isAdmin) {
        query = query.eq("user_id", user.id)
      }
      const { data: ticketsData, error } = await query
      if (error) {
        console.error("Error fetching tickets:", error)
      } else {
        setTickets(ticketsData || [])
      }
    }
    
    fetchTickets()

    // Realtime for tickets
    const ticketsSubscription = supabase
      .channel('public:support_tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, (payload) => {
        fetchTickets() // For simplicity, just refetch
      })
      .subscribe()

    return () => {
      supabase.removeChannel(ticketsSubscription)
    }
  }, [user, isAdmin])

  // Fetch Messages for Active Ticket
  useEffect(() => {
    if (!activeTicket) {
      setMessages([])
      return
    }

    const fetchMessages = async () => {
      const { data: msgs, error } = await supabase
        .from("support_messages")
        .select("*")
        .eq("ticket_id", activeTicket.id)
        .order("created_at", { ascending: true })
      
      if (error) {
        console.error("Error fetching messages:", error)
      } else {
        setMessages(msgs || [])
        scrollToBottom()
      }
    }

    fetchMessages()

    // Realtime for messages
    const messagesSubscription = supabase
      .channel(`public:support_messages:ticket_id=eq.${activeTicket.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `ticket_id=eq.${activeTicket.id}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
        scrollToBottom()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(messagesSubscription)
    }
  }, [activeTicket])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTicketTitle.trim() || !user) return

    const { data: newTicket, error } = await supabase
      .from("support_tickets")
      .insert({
        title: newTicketTitle,
        user_id: user.id,
        status: "open"
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating ticket:", error)
      return
    }

    // Send Notification to Admin
    supabase.auth.getSession().then(({ data }) => {
      const token = data.session?.access_token
      if (token) {
        const workerBaseUrl = process.env.NEXT_PUBLIC_INTILAQA_ENGINE_URL ?? "https://intilaqa-ai.abo200004.workers.dev"
        fetch(`/api/worker/admin/send-notification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            type: 'notify_admins',
            subject: 'تذكرة دعم فني جديدة 🛟',
            body: `قام العميل ${clients[user.id]?.client_name || 'مستخدم'} بفتح تذكرة جديدة بعنوان:\n"${newTicketTitle}"`
          })
        }).catch(console.error)
      }
    })

    setIsCreating(false)
    setNewTicketTitle("")
    setActiveTicket(newTicket)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeTicket || !user) return

    const tempMessage = newMessage
    setNewMessage("")

    const { error } = await supabase
      .from("support_messages")
      .insert({
        ticket_id: activeTicket.id,
        sender_id: user.id,
        sender_role: isAdmin ? "admin" : "client",
        message: tempMessage
      })

    if (error) {
      console.error("Error sending message:", error)
      // Optionally restore the message if failed
      setNewMessage(tempMessage)
    } else {
      // Update ticket updated_at
      await supabase
        .from("support_tickets")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", activeTicket.id)

      // Send Notification
      supabase.auth.getSession().then(({ data }) => {
        const token = data.session?.access_token
        if (token) {
          const workerBaseUrl = process.env.NEXT_PUBLIC_INTILAQA_ENGINE_URL ?? "https://intilaqa-ai.abo200004.workers.dev"
          if (isAdmin) {
            // Notify Client
            const clientEmail = clients[activeTicket.user_id]?.email
            if (clientEmail) {
              fetch(`/api/worker/admin/send-notification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                  type: 'direct',
                  subscriberIds: clientEmail,
                  subject: 'رد جديد على تذكرة الدعم 💬',
                  body: `تم الرد على تذكرتك (${activeTicket.title}):\n"${tempMessage}"`
                })
              }).catch(console.error)
            }
          } else {
            // Notify Admin
            fetch(`/api/worker/admin/send-notification`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                type: 'notify_admins',
                subject: 'رد جديد من العميل 💬',
                body: `قام ${clients[user.id]?.client_name || 'العميل'} بالرد على التذكرة (${activeTicket.title}):\n"${tempMessage}"`
              })
            }).catch(console.error)
          }
        }
      })
    }
  }

  const handleResolveTicket = async () => {
    if (!activeTicket) return
    const { error } = await supabase
      .from("support_tickets")
      .update({ status: "resolved", updated_at: new Date().toISOString() })
      .eq("id", activeTicket.id)
      
    if (!error) {
      setActiveTicket({ ...activeTicket, status: "resolved" })
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-50/50 md:flex-row rtl:flex-row-reverse" dir="rtl">
      
      {/* ── Sidebar: Tickets List ── */}
      <div className="flex h-full w-full flex-col border-l border-border/40 bg-white/50 backdrop-blur-xl md:w-80 lg:w-96 shrink-0">
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Lifebuoy weight="duotone" className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-bold text-foreground">تذاكر الدعم</h1>
          </div>
          {!isAdmin && (
            <button
              onClick={() => setIsCreating(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
              title="تذكرة جديدة"
            >
              <Plus weight="bold" className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted">
          {isCreating && !isAdmin && (
            <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm animate-in fade-in slide-in-from-top-4">
              <h3 className="mb-2 text-sm font-semibold text-foreground">تذكرة جديدة</h3>
              <form onSubmit={handleCreateTicket} className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="عنوان المشكلة..."
                  className="w-full rounded-xl border border-border/50 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  value={newTicketTitle}
                  onChange={(e) => setNewTicketTitle(e.target.value)}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={!newTicketTitle.trim()}
                    className="rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
                  >
                    إنشاء
                  </button>
                </div>
              </form>
            </div>
          )}

          {tickets.length === 0 && !isCreating ? (
            <div className="flex h-40 flex-col items-center justify-center text-center opacity-50">
              <ChatCircleText weight="duotone" className="mb-2 h-10 w-10" />
              <p className="text-sm">لا توجد تذاكر حالياً</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {tickets.map(ticket => {
                const isActive = activeTicket?.id === ticket.id
                return (
                  <button
                    key={ticket.id}
                    onClick={() => { setActiveTicket(ticket); setIsCreating(false) }}
                    className={`flex flex-col items-start gap-1 rounded-2xl border p-4 text-start transition-all ${
                      isActive 
                        ? "border-primary/30 bg-primary/5 shadow-sm" 
                        : "border-transparent bg-white hover:border-border/50 hover:bg-white/80"
                    }`}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="font-semibold text-sm line-clamp-1">{ticket.title}</span>
                        {isAdmin && (
                          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {clients[ticket.user_id]?.client_name || 'عميل'}
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true, locale: ar })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        ticket.status === 'open' ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"
                      }`}>
                        {ticket.status === 'open' ? <CircleNotch weight="bold" className="h-3 w-3 animate-spin" /> : <CheckCircle weight="fill" className="h-3 w-3" />}
                        {ticket.status === 'open' ? 'مفتوحة' : 'محلولة'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Main Chat Area ── */}
      <div className="flex flex-1 flex-col bg-white">
        {activeTicket ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-border/40 bg-white/50 px-6 py-4 backdrop-blur-md">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">{activeTicket.title}</h2>
                  {isAdmin && (
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 border border-zinc-200">
                      {clients[activeTicket.user_id]?.client_name || 'عميل'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3.5 w-3.5" />
                  أنشئت {formatDistanceToNow(new Date(activeTicket.created_at), { addSuffix: true, locale: ar })}
                </p>
              </div>
              
              {activeTicket.status === 'open' && (
                <button
                  onClick={handleResolveTicket}
                  className="flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 px-4 py-2 text-sm font-semibold text-success transition-colors hover:bg-success/20"
                >
                  <CheckCircle weight="bold" className="h-4 w-4" />
                  إغلاق التذكرة كـ محلولة
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center opacity-40">
                  <ChatCircleText weight="duotone" className="mb-4 h-16 w-16" />
                  <p>لا توجد رسائل في هذه التذكرة بعد.</p>
                  <p className="text-sm mt-1">ابدأ بكتابة تفاصيل مشكلتك وسيقوم فريق الدعم بالرد عليك.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {messages.map((msg, i) => {
                    const isMyMessage = msg.sender_id === user?.id
                    const showAvatar = i === messages.length - 1 || messages[i + 1]?.sender_id !== msg.sender_id

                    return (
                      <div key={msg.id} className={`flex gap-3 ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}>
                        
                        <div className="flex flex-col justify-end">
                          {showAvatar ? (
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                              msg.sender_role === 'admin' 
                                ? "bg-primary text-white" 
                                : "bg-zinc-200 text-zinc-600"
                            }`} title={msg.sender_role === 'admin' ? 'الإدارة' : clients[msg.sender_id]?.client_name || 'عميل'}>
                              {msg.sender_role === 'admin' ? <Headset weight="fill" className="h-4 w-4" /> : <User weight="fill" className="h-4 w-4" />}
                            </div>
                          ) : (
                            <div className="w-8" />
                          )}
                        </div>

                        <div className={`flex max-w-[75%] flex-col ${isMyMessage ? "items-end" : "items-start"}`}>
                          {showAvatar && !isMyMessage && (
                            <span className="mb-1 text-[11px] font-medium text-zinc-500 px-1">
                              {msg.sender_role === 'admin' ? 'الإدارة' : clients[msg.sender_id]?.client_name || 'عميل'}
                            </span>
                          )}
                          <div className={`relative rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                            isMyMessage 
                              ? "bg-primary text-white rounded-br-sm" 
                              : "bg-zinc-100 text-zinc-800 rounded-bl-sm"
                          }`}>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                          </div>
                          <span className="mt-1 text-[10px] text-muted-foreground px-1">
                            {new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border/40 bg-white p-4">
              <form 
                onSubmit={handleSendMessage}
                className="flex items-end gap-3 rounded-2xl border border-border/60 bg-zinc-50/50 p-2 focus-within:border-primary/50 focus-within:bg-white focus-within:shadow-sm transition-all"
              >
                <textarea
                  placeholder={activeTicket.status === 'open' ? "اكتب رسالتك هنا..." : "هذه التذكرة مغلقة ولا يمكن الرد عليها"}
                  className="max-h-32 min-h-11 w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted disabled:opacity-50"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={activeTicket.status !== 'open'}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      if (newMessage.trim() && activeTicket.status === 'open') handleSendMessage(e)
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || activeTicket.status !== 'open'}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-all hover:bg-primary/90 disabled:opacity-40 disabled:hover:bg-primary"
                >
                  <PaperPlaneRight weight="fill" className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-50">
            <Lifebuoy weight="duotone" className="mb-4 h-24 w-24 text-primary" />
            <h2 className="text-xl font-bold">مركز الدعم الفني المباشر</h2>
            <p className="mt-2 max-w-sm text-sm">
              قم باختيار تذكرة من القائمة الجانبية أو افتح تذكرة جديدة للتواصل مع فريق الدعم لحل مشكلتك.
            </p>
          </div>
        )}
      </div>

    </div>
  )
}

