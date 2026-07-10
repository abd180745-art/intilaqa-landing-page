"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import {
  SquaresFour,
  ChatCircleDots,
  Star,
  Users,
  GearSix,

  BookOpen,
  Lifebuoy,
  SignOut,
  PushPin,
  PushPinSlash,
  Bell,
  BellRinging,
  MagnifyingGlass,
  Graph,
  CodeBlock,
  CaretDown,
  Monitor,
  Globe,
  WhatsappLogo,
} from "@phosphor-icons/react"
import { createClient } from "@/utils/supabase/client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Crown, Sparkle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

const primaryNav = [
  { title: "الرئيسية", href: "/dashboard", icon: SquaresFour },
  { title: "المحادثات", href: "/conversations", icon: ChatCircleDots, badge: "12" },
  { title: "التقييمات", href: "/feedback", icon: Star },
  { title: "العملاء", href: "/clients", icon: Users },
  { 
    title: "الربط البرمجي", 
    href: "/integration", 
    icon: CodeBlock,
    subItems: [
      { title: "الويدجت الجاهز (Widget)", href: "/integration?tab=widget" },
      { title: "واجهة المطورين (API)", href: "/integration?tab=api" },
    ]
  },
]

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { NovuProvider, useNotifications } from '@novu/react'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

const secondaryNav = [
  { title: "قاعدة المعرفة", href: "/knowledge", icon: BookOpen },
  { title: "الزاحف الذكي", href: "/crawler", icon: Globe },
  { 
    title: "نافذة التجريب الحية", 
    href: "/tester", 
    icon: Monitor,
    subItems: [
      { title: "مختبر الودجت (الموقع)", href: "/tester" },
      { title: "أداة محاكاة المحادثات (Simulator)", href: "/extension-tester" },
    ]
  },
  { title: "الإشعارات والتواصل", href: "/notifications", icon: BellRinging },
  { title: "المخزن (الموجه الديناميكي)", href: "/inventory", icon: PushPin },
  { 
    title: "إعدادات الوكيل", 
    href: "/settings", 
    icon: GearSix,
    subItems: [
      { title: "إدارة الفوترة والاشتراك", href: "/settings?tab=billing" },
      { title: "سياسات القبول والاستخدام", href: "/settings?tab=policies" },
      { title: "إعدادات البحث المتقدم", href: "/settings?tab=search" },
    ]
  },
]

export function AppSidebar({ isAdmin = true, userEmail = "admin@intilaqa.ai", planName = "free" }: { isAdmin?: boolean, userEmail?: string, planName?: string }) {
  return (
    <Suspense fallback={<div className="w-[16rem]" />}>
      <AppSidebarInner isAdmin={isAdmin} userEmail={userEmail} planName={planName} />
    </Suspense>
  )
}

function AppSidebarInner({ isAdmin = true, userEmail = "admin@intilaqa.ai", planName = "free" }: { isAdmin?: boolean, userEmail?: string, planName?: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get("tab")
  const router = useRouter()
  const { setOpen, open } = useSidebar()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [pinned, setPinned] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }
  const [hoverFloat, setHoverFloat] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const isMouseInside = useRef(false)
  const prevNotificationOpen = useRef(isNotificationOpen)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    
    const [basePath, query] = href.split("?")
    if (query) {
      const urlParams = new URLSearchParams(query)
      const hrefTab = urlParams.get("tab")
      return pathname === basePath && currentTab === hrefTab
    }
    
    return pathname.startsWith(href)
  }

  const handleMouseEnter = () => {
    isMouseInside.current = true
    if (pinned) return
    setOpen(true)
    setHoverFloat(true)
  }

  const handleMouseLeave = () => {
    isMouseInside.current = false
    if (pinned || isNotificationOpen) return
    setOpen(false)
    setHoverFloat(false)
  }

  useEffect(() => {
    if (prevNotificationOpen.current && !isNotificationOpen) {
      // The popover just closed. Check if the mouse is outside the sidebar.
      if (!isMouseInside.current && !pinned) {
        setOpen(false)
        setHoverFloat(false)
      }
    }
    prevNotificationOpen.current = isNotificationOpen
  }, [isNotificationOpen, pinned, setOpen])

  const togglePin = () => {
    const next = !pinned
    setPinned(next)
    setOpen(next)
    setHoverFloat(false)
  }

  // When hovered (not pinned), keep the layout "gap" at icon-width so the
  // main content does NOT shift and cause a horizontal scrollbar. The fixed
  // container still expands to full sidebar-width, floating over content.
  const floatOverlayClasses = hoverFloat
    ? [
        "[&>div[data-slot=sidebar-gap]]:!w-(--sidebar-width-icon)",
        "[&>div[data-slot=sidebar-container]]:!w-(--sidebar-width)",
      ].join(" ")
    : ""

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={[
        // Outer container: transparent so glass layer is visible through parent
        "border-l-0 bg-transparent",
        // Inner panel: apply glass effect with subtle hairline + soft shadow
        "[&>div[data-sidebar=sidebar]]:relative",
        "[&>div[data-sidebar=sidebar]]:border-l",
        "[&>div[data-sidebar=sidebar]]:border-sidebar-border/40",
        "[&>div[data-sidebar=sidebar]]:bg-[var(--glass-bg-strong)]",
        "[&>div[data-sidebar=sidebar]]:backdrop-blur-2xl",
        "[&>div[data-sidebar=sidebar]]:backdrop-saturate-[180%]",
        "[&>div[data-sidebar=sidebar]]:shadow-[0_1px_0_0_var(--glass-highlight)_inset,0_30px_80px_-30px_oklch(0.45_0.02_250/0.22)]",
        // Removed backdrop-filter transition to fix FPS stuttering
        floatOverlayClasses,
      ].join(" ")}
    >
      {/* subtle aurora wash behind glass — only visible via backdrop blur */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(520px 320px at 100% 0%, oklch(0.82 0.14 65 / 0.28), transparent 60%), radial-gradient(420px 340px at 0% 100%, oklch(0.60 0.10 245 / 0.22), transparent 60%)",
        }}
      />

      <SidebarHeader
        className="relative flex flex-col gap-2 px-0 py-2"
      >
        <div 
          className="relative flex w-full items-center overflow-visible transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ height: open ? "112px" : "40px" }}
        >
          {/* Expanded Full Logo */}
          <div 
            className={[
              "absolute right-0 flex w-full items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
              open ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
            ].join(" ")}
          >
            <img src="/logo.png" className="h-10 md:h-12 w-auto object-contain" alt="Intilaqa AI Logo" />
          </div>

          {/* Collapsed Icon */}
          <div 
            className={[
              "absolute right-0 flex w-[3rem] items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
              !open ? "opacity-100 scale-100" : "opacity-0 scale-125 pointer-events-none"
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1000 1000"
              className="h-8 w-8"
            >
              <path fill="#e69605" d="M873.68,247.8l-221.09,610.55c-19.73,54.49-91.05,67.19-128.38,22.85L106.01,384.46c-37.32-44.33-12.66-112.45,44.4-122.6l639.29-113.81c57.06-10.16,103.71,45.26,83.98,99.75Z"/>
            </svg>
          </div>
        </div>

        {/* Quick Actions — expanded only */}
        <div
          className={[
            "flex items-center justify-end gap-1",
            "transition-[opacity,height,margin] duration-300",
            open
              ? "opacity-100 h-auto mt-1"
              : "opacity-0 h-0 mt-0 overflow-hidden pointer-events-none",
          ].join(" ")}
        >
          <div className="flex items-center gap-0.5">
            <button
              aria-label="البحث"
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-foreground/5 text-sidebar-foreground/70 transition-colors"
            >
              <MagnifyingGlass className="h-4 w-4" />
            </button>
            <NovuProviderWrapper subscriberId={userEmail} isNotificationOpen={isNotificationOpen} setIsNotificationOpen={setIsNotificationOpen} />
          </div>
        </div>
      </SidebarHeader>


      <SidebarContent
        className="relative gap-0"
        style={{ padding: open ? "0 8px" : "0" }}
      >
        <SidebarGroup className="py-1">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {primaryNav.map((item) => {
                // Hide the /clients route if not admin
                if (!isAdmin && item.href === "/clients") return null;
                const active = isActive(item.href)
                const isParentOpen = pathname.startsWith(item.href)

                if (item.subItems) {
                  return (
                    <SidebarMenuItem key={item.href} className="group/nav-item flex flex-col">
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isParentOpen}
                        className={[
                          "h-10 rounded-xl transition-all duration-300",
                          isParentOpen ? "text-primary font-semibold" : "text-sidebar-foreground",
                          "hover:bg-white/70 hover:backdrop-blur-xl"
                        ].join(" ")}
                      >
                        <Link href={item.href}>
                          <item.icon weight={isParentOpen ? "fill" : "regular"} className="shrink-0" />
                          <span className="truncate transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      
                      <div className={`grid transition-[grid-template-rows] duration-300 ease-out group-data-[collapsible=icon]:hidden ${isParentOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] group-hover/nav-item:grid-rows-[1fr]"}`}>
                        <div className="overflow-hidden">
                          <SidebarMenuSub className="mt-1 mb-1 border-l-2 border-primary/20 pr-0 pl-0">
                            {item.subItems.map((subItem) => {
                              const subActive = isActive(subItem.href)
                              return (
                                <SidebarMenuSubItem key={subItem.href}>
                                  <SidebarMenuSubButton 
                                    asChild 
                                    isActive={subActive} 
                                    className={[
                                      "text-[13px] h-9 rounded-lg font-medium pr-3 transition-colors duration-200",
                                      subActive 
                                        ? "bg-gradient-to-l from-primary/15 to-primary/5 text-primary shadow-[inset_0_0_0_1px_oklch(0.74_0.16_62/0.22),0_1px_0_0_oklch(1_0_0/0.6)_inset]" 
                                        : "text-sidebar-foreground hover:bg-white/50"
                                    ].join(" ")}
                                  >
                                    <Link href={subItem.href}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                          </SidebarMenuSub>
                        </div>
                      </div>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={[
                        "h-10 rounded-xl transition-all duration-300",
                        "data-[active=true]:bg-gradient-to-l data-[active=true]:from-primary/15 data-[active=true]:to-primary/5",
                        "data-[active=true]:text-primary data-[active=true]:font-semibold",
                        "data-[active=true]:shadow-[inset_0_0_0_1px_oklch(0.74_0.16_62/0.22),0_1px_0_0_oklch(1_0_0/0.6)_inset]",
                        "hover:bg-white/70 hover:backdrop-blur-xl hover:shadow-[0_1px_0_0_oklch(1_0_0/0.8)_inset]"
                      ].join(" ")}
                    >
                      <Link href={item.href}>
                        <item.icon weight={active ? "fill" : "regular"} className="shrink-0" />
                        <span className="truncate transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              {isAdmin && secondaryNav.map((item) => {
                const active = isActive(item.href)
                const isParentOpen = pathname.startsWith(item.href)

                if (item.subItems) {
                  return (
                    <SidebarMenuItem key={item.href} className="group/nav-item flex flex-col">
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isParentOpen}
                        className={[
                          "h-10 rounded-xl transition-all duration-300",
                          isParentOpen ? "text-primary font-semibold" : "text-sidebar-foreground",
                          "hover:bg-white/70 hover:backdrop-blur-xl"
                        ].join(" ")}
                      >
                        <Link href={item.href}>
                          <item.icon weight={isParentOpen ? "fill" : "regular"} className="shrink-0" />
                          <span className="truncate transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      
                      <div className={`grid transition-[grid-template-rows] duration-300 ease-out group-data-[collapsible=icon]:hidden ${isParentOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] group-hover/nav-item:grid-rows-[1fr]"}`}>
                        <div className="overflow-hidden">
                          <SidebarMenuSub className="mt-1 mb-1 border-l-2 border-primary/20 pr-0 pl-0">
                            {item.subItems.map((subItem) => {
                              const subActive = isActive(subItem.href)
                              return (
                                <SidebarMenuSubItem key={subItem.href}>
                                  <SidebarMenuSubButton 
                                    asChild 
                                    isActive={subActive} 
                                    className={[
                                      "text-[13px] h-9 rounded-lg font-medium pr-3 transition-colors duration-200",
                                      subActive 
                                        ? "bg-gradient-to-l from-primary/15 to-primary/5 text-primary shadow-[inset_0_0_0_1px_oklch(0.74_0.16_62/0.22),0_1px_0_0_oklch(1_0_0/0.6)_inset]" 
                                        : "text-sidebar-foreground hover:bg-white/50"
                                    ].join(" ")}
                                  >
                                    <Link href={subItem.href}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                          </SidebarMenuSub>
                        </div>
                      </div>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={[
                        "h-10 rounded-xl transition-all duration-300",
                        "data-[active=true]:bg-gradient-to-l data-[active=true]:from-primary/15 data-[active=true]:to-primary/5",
                        "data-[active=true]:text-primary data-[active=true]:font-semibold",
                        "data-[active=true]:shadow-[inset_0_0_0_1px_oklch(0.74_0.16_62/0.22),0_1px_0_0_oklch(1_0_0/0.6)_inset]",
                        "hover:bg-white/70 hover:backdrop-blur-xl hover:shadow-[0_1px_0_0_oklch(1_0_0/0.8)_inset]"
                      ].join(" ")}
                    >
                      <Link href={item.href}>
                        <item.icon weight={active ? "fill" : "regular"} className="shrink-0" />
                        <span className="truncate transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/inbox")}
                  tooltip="إدارة الواتساب"
                  onClick={(e) => {
                    if (planName !== 'ultimate' && !isAdmin) {
                      e.preventDefault()
                      setShowUpgradeModal(true)
                    }
                  }}
                  className={[
                    "h-10 rounded-xl transition-all duration-300 relative group/inbox",
                    isActive("/inbox") ? "bg-gradient-to-l from-primary/15 to-primary/5 text-primary font-semibold shadow-[inset_0_0_0_1px_oklch(0.74_0.16_62/0.22),0_1px_0_0_oklch(1_0_0/0.6)_inset]" : "",
                    "hover:bg-white/70 hover:backdrop-blur-xl hover:shadow-[0_1px_0_0_oklch(1_0_0/0.8)_inset]"
                  ].join(" ")}
                >
                  <Link href="/inbox">
                    <WhatsappLogo weight={isActive("/inbox") ? "fill" : "regular"} className="shrink-0 text-green-600" />
                    <span className="truncate transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">إدارة الواتساب</span>
                    {(planName !== 'ultimate' && !isAdmin) && (
                      <Crown weight="fill" className="shrink-0 text-amber-500 absolute left-2 h-4 w-4 drop-shadow-sm group-hover/inbox:scale-110 transition-transform" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
                <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:bg-zinc-950/95 rounded-3xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                  <div className="p-6 pt-8 text-center relative z-10 flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white mb-6 shadow-lg shadow-amber-500/20 ring-4 ring-amber-500/10">
                      <Sparkle className="h-8 w-8" weight="fill" />
                    </div>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold tracking-tight text-foreground text-center">ميزة حصرية لباقة Ultimate</DialogTitle>
                      <DialogDescription className="text-center pt-3 text-muted-foreground leading-relaxed">
                        قم بربط رقم الواتساب الخاص بك ودع الذكاء الاصطناعي يرد على عملائك تلقائياً على مدار الساعة!
                        <br/><br/>
                        هذه الميزة القوية متاحة فقط لمشتركي باقة <strong>Ultimate</strong>. قم بالترقية الآن لتفتح آفاقاً جديدة لعملك.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-8 flex gap-3 w-full">
                      <Button variant="outline" className="flex-1 rounded-xl h-11 border-border/50 hover:bg-muted/50" onClick={() => setShowUpgradeModal(false)}>
                        لاحقاً
                      </Button>
                      <Button className="flex-1 rounded-xl h-11 bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20" onClick={() => { setShowUpgradeModal(false); router.push('/settings?tab=billing') }}>
                        الترقية الآن <Crown className="ml-1.5 h-4 w-4" weight="fill" />
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/support")}
                  tooltip="المساعدة والدعم"
                  className={[
                    "h-10 rounded-xl transition-all duration-300",
                    isActive("/support") ? "bg-gradient-to-l from-primary/15 to-primary/5 text-primary font-semibold shadow-[inset_0_0_0_1px_oklch(0.74_0.16_62/0.22),0_1px_0_0_oklch(1_0_0/0.6)_inset]" : "",
                    "hover:bg-white/70 hover:backdrop-blur-xl hover:shadow-[0_1px_0_0_oklch(1_0_0/0.8)_inset]"
                  ].join(" ")}
                >
                  <Link href="/support">
                    <Lifebuoy weight={isActive("/support") ? "fill" : "regular"} className="shrink-0 text-amber-600" />
                    <span className="truncate transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">المساعدة والدعم</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={togglePin}
                  tooltip={pinned ? "إلغاء تثبيت القائمة" : "تثبيت القائمة"}
                  className={[
                    "h-10 rounded-xl hover:bg-white/70 hover:backdrop-blur-xl",
                    pinned
                      ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
                      : "",
                  ].join(" ")}
                >
                  {pinned ? <PushPinSlash weight="fill" className="shrink-0" /> : <PushPin className="shrink-0" />}
                  <span className="truncate transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">{pinned ? "إلغاء التثبيت" : "تثبيت القائمة"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  tooltip="تسجيل الخروج"
                  className="h-10 rounded-xl hover:bg-destructive/10 hover:text-destructive w-full"
                >
                  <SignOut className="shrink-0" />
                  <span className="truncate transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">تسجيل الخروج</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ——— Footer: Admin card (expanded only) ——— */}
      <SidebarFooter className="relative px-2 py-2">
        <Link
          href="/settings"
          className={[
            "flex items-center gap-2.5 overflow-hidden rounded-xl",
            "border border-sidebar-border/50 bg-white/70 px-2 py-2",
            "backdrop-blur-xl shadow-[0_1px_0_0_oklch(1_0_0/0.8)_inset]",
            "transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            "hover:bg-primary/5 hover:border-primary/30 cursor-pointer",
            open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none",
          ].join(" ")}
        >

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.64_0.19_48)] text-primary-foreground text-xs font-bold ring-1 ring-inset ring-white/50 shadow-[0_2px_6px_-2px_oklch(0.74_0.16_62/0.5)]">
            أ
          </div>
          <div className="flex min-w-0 flex-col text-xs leading-tight">
            <span className="truncate font-semibold text-sidebar-foreground">
              {isAdmin ? "مدير المنصة" : "عميل مسجل"}
            </span>
            <span className="truncate text-[10px] text-sidebar-foreground/60">
              {userEmail}
            </span>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}

function NovuProviderWrapper({ subscriberId, isNotificationOpen, setIsNotificationOpen }: { subscriberId: string, isNotificationOpen: boolean, setIsNotificationOpen: (v: boolean) => void }) {
  const appId = process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER || "";
  if (!appId || !subscriberId) {
    return (
      <button
        aria-label="الإشعارات"
        className="relative flex h-7 w-7 items-center justify-center rounded-full hover:bg-foreground/5 text-sidebar-foreground/70 transition-colors outline-none"
      >
        <Bell className="h-4 w-4" />
      </button>
    )
  }

  return (
    <NovuProvider 
      subscriberId={subscriberId} 
      applicationIdentifier={appId}
      socketUrl="wss://socket.novu.co"
    >
      <NotificationInner isOpen={isNotificationOpen} setIsOpen={setIsNotificationOpen} />
    </NovuProvider>
  )
}

function NotificationInner({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  const { notifications, readAll } = useNotifications();
  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;
  const router = useRouter();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="الإشعارات"
          className="relative flex h-7 w-7 items-center justify-center rounded-full hover:bg-foreground/5 text-sidebar-foreground/70 transition-colors outline-none"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && <span className="absolute right-1 top-1 flex h-1.5 w-1.5 rounded-full bg-primary" />}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        side="left" 
        align="start" 
        sideOffset={24}
        className="w-80 p-0 border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:bg-zinc-950/95 rounded-2xl overflow-hidden"
      >
        <div className="flex flex-col">
          <div className="px-5 py-4 flex items-center justify-between">
            <h4 className="font-semibold text-[15px] tracking-tight">الإشعارات</h4>
            {unreadCount > 0 && (
              <span className="text-[11px] font-bold text-orange-gradient">{unreadCount} جديد</span>
            )}
          </div>
          <div className="flex flex-col max-h-[320px] overflow-y-auto">
            {(!notifications || notifications.length === 0) ? (
              <div className="p-8 text-center text-sm text-muted-foreground">لا توجد إشعارات حالياً</div>
            ) : (
              notifications.map((notif: any) => (
                <div 
                  key={notif.id} 
                  onClick={() => {
                    if (!notif.isRead && typeof notif.read === 'function') {
                      notif.read();
                    }
                    setIsOpen(false);
                    router.push('/support');
                  }}
                  className="relative flex items-start gap-4 px-5 py-4 hover:bg-muted/40 transition-all cursor-pointer group border-b border-border/30 last:border-0"
                >
                  {!notif.isRead && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-orange-gradient transition-all duration-300 group-hover:h-1/2 rounded-l-full" />
                  )}
                  
                  {/* Professional Icon Layout */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary mt-0.5 ring-1 ring-inset ring-primary/20 shadow-sm transition-transform group-hover:scale-105">
                    {notif.subject?.includes('تذكرة') || notif.subject?.includes('دعم') ? (
                      <Lifebuoy className="h-5 w-5" weight="fill" />
                    ) : notif.subject?.includes('رد') ? (
                      <ChatCircleDots className="h-5 w-5" weight="fill" />
                    ) : (
                      <Bell className="h-5 w-5" weight="fill" />
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1 w-full overflow-hidden">
                    <p className="text-[13px] font-bold leading-tight text-foreground tracking-tight">{notif.subject}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{notif.body}</p>
                    {notif.createdAt && (
                      <span className="text-[10px] text-muted-foreground/60 font-medium mt-0.5">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: ar })}
                      </span>
                    )}
                  </div>

                  {!notif.isRead && (
                    <div className="absolute top-5 right-5 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                  )}
                </div>
              ))
            )}
          </div>
          {unreadCount > 0 && (
            <div className="p-2 border-t border-border/30 bg-muted/10">
              <button 
                onClick={() => {
                  if (typeof readAll === 'function') readAll();
                }}
                className="w-full text-center text-[12px] font-semibold text-muted-foreground hover:text-foreground py-2 transition-colors rounded-lg hover:bg-muted/50"
              >
                تحديد الكل كمقروء
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
