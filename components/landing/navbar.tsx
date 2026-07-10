'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'
import { ArrowUpRight } from '@phosphor-icons/react'
import { ArrowLogo } from './arrow-logo'
import Link from 'next/link'

const sectionsToTrack = [
  { id: 'hero', title: 'The Engine' },
  { id: 'showcase', title: 'Product' },
  { id: 'industries', title: 'Industries' },
  { id: 'bento', title: 'Platform' },
  { id: 'developers', title: 'Developers' },
  { id: 'contact', title: 'Contact Us' },
]

const links = [
  { label: 'Product', href: '/#showcase' },
  { label: 'Industries', href: '/#industries' },
  { label: 'Platform', href: '/#bento' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Developers', href: '/#developers' },
  { label: 'Contact Us', href: '#contact' },
]

export function Navbar() {
  const [activeSection, setActiveSection] = useState('The Engine')
  const pathname = usePathname()
  
  const isInnerPage = pathname !== '/'
  const pageTitle = isInnerPage 
    ? pathname.split('/')[1].charAt(0).toUpperCase() + pathname.split('/')[1].slice(1)
    : ''

  useEffect(() => {
    const handleScroll = () => {
      let current = 'The Engine'
      for (const { id, title } of sectionsToTrack) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          // If the section is near the top of the viewport
          if (rect.top <= 200 && rect.bottom >= 200) {
            current = title
          }
        }
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Also run once on mount
    setTimeout(handleScroll, 100)
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const activeIndex = links.findIndex(link => link.label === activeSection)

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 mx-auto flex w-[min(1100px,92%)] items-center justify-between rounded-2xl px-4 py-3 overflow-hidden shadow-sm transition-all duration-500"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
      }}
    >
      {/* Dynamic huge solid text in the center, visible only after scrolling */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <AnimatePresence mode="wait">
          {(isInnerPage || activeSection !== 'The Engine') && (
            <motion.span
              key={isInnerPage ? pageTitle : activeSection}
              initial={{ y: 15, opacity: 0, filter: 'blur(6px)' }}
              animate={{ y: 0, opacity: activeSection === 'Contact Us' ? 1 : 0.35, filter: 'blur(0px)' }}
              exit={{ y: -15, opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.4 }}
              className={`text-2xl sm:text-3xl md:text-4xl font-medium uppercase tracking-[0.15em] whitespace-nowrap ${
                activeSection === 'Contact Us' ? 'text-primary drop-shadow-[0_0_25px_oklch(0.72_0.16_62/60%)]' : 'text-silver/70'
              }`}
            >
              {isInnerPage ? pageTitle : activeSection}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <Link href="/" className="flex items-center relative z-10 cursor-pointer shrink-0">
        <img src="/logo.png" className="h-7 sm:h-8 md:h-9 w-auto object-contain" alt="Intilaqa AI Logo" />
      </Link>

      {/* Nav links - Center originally, but shrink and move to the side when the big text appears */}
      <motion.nav 
        layout
        className={`hidden items-center md:flex relative z-10 ${
          isInnerPage
            ? 'gap-4 opacity-70 ml-auto mr-4'
            : activeSection !== 'The Engine'
              ? 'gap-3 scale-90 opacity-40 ml-auto mr-4'
              : 'gap-8'
        }`}
      >
        {(isInnerPage ? [{ label: 'Home', href: '/' }] : links)
          .filter((l, index) => isInnerPage || index > activeIndex)
          .map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
      </motion.nav>

      <div className="flex items-center gap-3 relative z-10">
        <a
          href="/login"
          className="group inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_oklch(0.72_0.16_62/40%)] transition-all hover:shadow-[0_0_36px_oklch(0.72_0.16_62/60%)]"
        >
          Sign in
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </motion.header>
  )
}
