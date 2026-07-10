"use client"

import { useMemo, useState } from "react"
import { MagnifyingGlass, Robot, User, ChatCircleDots, Check, Checks } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Avatar } from "./avatar"
import type { Contact } from "./data"

type Filter = "all" | "unread"

const filterTabs: { key: Filter; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "unread", label: "غير مقروء" },
]

interface ContactsListProps {
  contacts: Contact[]
  activeId: string | null
  onSelect: (contact: Contact) => void
}

export function ContactsList({ contacts, activeId, onSelect }: ContactsListProps) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchesQuery =
        c.name.includes(query) || c.lastMessage.includes(query)
      const matchesFilter = filter === "all" ? true : c.unread > 0
      return matchesQuery && matchesFilter
    })
  }, [query, filter, contacts])

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 space-y-4 border-b border-border/50 bg-card/80 px-4 pb-4 pt-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">المحادثات</h2>
            <p className="text-xs text-muted-foreground">لديك {contacts.filter((c) => c.unread > 0).length} محادثات جديدة</p>
          </div>
          <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ChatCircleDots size={20} weight="duotone" />
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlass
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن محادثة..."
            className="w-full rounded-2xl border border-border/60 bg-background/60 py-2.5 pr-10 pl-4 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 rounded-2xl bg-muted/60 p-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={cn(
                "flex-1 rounded-xl px-2 py-1.5 text-xs font-medium transition-all duration-300",
                filter === tab.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable list */}
      <div className="elegant-scroll flex-1 space-y-1 overflow-y-auto p-2">
        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            لا توجد محادثات مطابقة
          </p>
        )}
        {filtered.map((contact) => {
          const isActive = contact.id === activeId
          return (
            <button
              key={contact.id}
              type="button"
              onClick={() => onSelect(contact)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-2xl border p-3 text-right transition-all duration-300 hover:scale-[1.02]",
                isActive
                  ? "border-primary/30 bg-primary/[0.06] shadow-sm"
                  : "border-transparent hover:bg-muted/60",
              )}
            >
              <Avatar
                initials={contact.initials}
                tone={contact.tone}
                online={contact.online}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold text-foreground">
                    {contact.name}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-[11px]",
                      contact.unread > 0
                        ? "font-semibold text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {contact.timestamp}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
                    {contact.status === "bot" && (
                      <Robot size={13} className="shrink-0 text-primary/70" weight="fill" />
                    )}
                    {contact.status === "human" && (
                      <User size={13} className="shrink-0 text-emerald-500" weight="fill" />
                    )}
                    {contact.lastMessageFromMe && (
                      contact.lastMessageReceipt === "read" ? (
                        <Checks size={14} className="text-blue-500 shrink-0" weight="bold" />
                      ) : contact.lastMessageReceipt === "delivered" ? (
                        <Checks size={14} className="text-gray-400 shrink-0" weight="bold" />
                      ) : (
                        <Check size={14} className="text-gray-400 shrink-0" weight="bold" />
                      )
                    )}
                    <span className="truncate">{contact.lastMessage}</span>
                  </span>
                  {contact.unread > 0 && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-sm">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
