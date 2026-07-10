'use client'

import { motion } from 'motion/react'
import { GraduationCap, Buildings, AirplaneTilt } from '@phosphor-icons/react'
import { Reveal } from './reveal'

const industries = [
  {
    id: 'education',
    title: 'Educational Consulting',
    description: 'Automate university admissions, student inquiries, and program matching with 100% accuracy.',
    icon: GraduationCap,
    status: 'Available Now',
    active: true,
  },
  {
    id: 'real-estate',
    title: 'Real Estate',
    description: 'Qualify leads, schedule property viewings, and answer complex queries instantly.',
    icon: Buildings,
    status: 'Coming Soon',
    active: false,
  },
  {
    id: 'tourism',
    title: 'Tourism & Travel',
    description: 'Handle bookings, itinerary planning, and 24/7 customer support for travelers.',
    icon: AirplaneTilt,
    status: 'Coming Soon',
    active: false,
  },
]

export function Industries() {
  return (
    <section id="industries" className="relative py-28">
      <div className="pointer-events-none absolute left-1/2 top-40 h-80 w-[600px] -translate-x-1/2 rounded-full bg-amber/10 blur-[130px]" />
      <div className="relative mx-auto w-[min(1180px,92%)]">
        
        {/* Section Heading */}
        <Reveal>
          <div className="mb-16 text-center">
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-silver">
              Industries
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Transforming Every Sector
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Intilaqa's AI agents are specialized and fine-tuned for the unique terminology and workflows of your specific industry.
            </p>
          </div>
        </Reveal>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {industries.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                className={`relative flex h-full flex-col overflow-hidden rounded-3xl glass p-8 ${
                  !item.active ? 'opacity-80 grayscale-[20%]' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm ${
                    item.active 
                      ? 'bg-primary/10 border-primary/20 text-primary shadow-primary/20' 
                      : 'bg-secondary border-border text-muted-foreground'
                  }`}>
                    <item.icon weight={item.active ? "fill" : "regular"} className="h-7 w-7" />
                  </div>
                  
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    item.active 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                
                {/* Visual Accent */}
                {item.active && (
                  <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-amber/15 blur-[60px]" />
                )}
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
