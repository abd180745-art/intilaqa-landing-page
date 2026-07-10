'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Book, Code, Globe, LayoutTemplate } from 'lucide-react'
import { motion } from 'motion/react'

const routes = [
  {
    title: 'Introduction',
    href: '/docs',
    icon: Book,
  },
  {
    title: 'Ready-made Widget',
    href: '/docs/widget',
    icon: LayoutTemplate,
  },
  {
    title: 'CDN Link (HTML/JS)',
    href: '/docs/cdn',
    icon: Globe,
  },
  {
    title: 'React Library (NPM)',
    href: '/docs/react',
    icon: Code,
  },
]

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-full flex flex-col gap-2 px-4 relative">
      <h1 className="text-2xl font-extrabold mb-6 px-2 text-foreground tracking-tight pt-2 border-b border-black/5 pb-4">
        Developer Docs
      </h1>
      
      <div className="relative flex flex-col gap-1.5">
        {routes.map((route) => {
          const isActive = pathname === route.href
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium z-10",
                isActive 
                  ? "text-[#e69605]" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/40"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 rounded-xl bg-white/60 shadow-[0_0_15px_rgba(230,150,5,0.15)] border border-[#e69605]/20 -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <route.icon className={cn("h-4 w-4", isActive ? "text-[#e69605]" : "opacity-70")} />
              {route.title}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}




