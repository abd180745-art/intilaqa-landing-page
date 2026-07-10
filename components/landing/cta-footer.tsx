'use client'

import { motion } from 'motion/react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { Reveal } from './reveal'
import { ArrowLogo } from './arrow-logo'
import Link from 'next/link'

export function CtaFooter() {
  return (
    <footer id="contact" className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden snap-start pt-20 pb-4">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/10 blur-[150px] animate-pulse-glow" />

      <div className="relative mx-auto flex w-[min(1180px,92%)] flex-1 flex-col justify-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
            visible: { 
              opacity: 1, 
              scale: 1, 
              filter: 'blur(0px)',
              transition: { 
                duration: 0.9, 
                ease: [0.16, 1, 0.3, 1],
                staggerChildren: 0.15,
                delayChildren: 0.2
              } 
            }
          }}
          className="relative overflow-hidden rounded-[2rem] glass px-8 py-16 text-center sm:px-16"
        >
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl"
          >
            <span className="text-gradient-silver">Build the future of</span>{' '}
            <span className="text-primary">conversation</span>
          </motion.h2>
          
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="mx-auto mt-5 max-w-lg text-pretty text-muted-foreground"
          >
            Join thousands of developers shipping streaming AI experiences on
            Intilaqa. Free to start, scales to billions of tokens.
          </motion.p>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_0_30px_oklch(0.72_0.16_62/45%)] transition-all hover:shadow-[0_0_48px_oklch(0.72_0.16_62/65%)]"
            >
              Start for free
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="mailto:info@intilaqa.com"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Talk to sales
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative mx-auto flex w-[min(1180px,92%)] flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
        <Link href="/" className="flex items-center cursor-pointer shrink-0">
            <img src="/logo.png" className="h-6 sm:h-7 md:h-8 w-auto object-contain" alt="Intilaqa AI Logo" />
        </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {[
              { label: 'Product', href: '/' },
              { label: 'Docs', href: '/docs' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Blog', href: '#' },
              { label: 'Careers', href: '#' },
              { label: 'Status', href: '#' }
            ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              ),
            )}
          </nav>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Intilaqa
          </p>
        </div>
    </footer>
  )
}
