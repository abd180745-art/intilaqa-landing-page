'use client'

const integrations = [
  'WhatsApp',
  'Chrome',
  'WordPress',
  'REST API',
  'JavaScript',
  'Webhooks',
  'React',
  'Node.js',
]

export function LogoMarquee() {
  return (
    <section className="relative border-y border-border py-10">
      <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Integrates with any stack or platform, exactly how you need it
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-16 pr-16">
          {[...Array(6)].flatMap(() => integrations).map((l, i) => (
            <span
              key={i}
              className="whitespace-nowrap text-xl font-bold tracking-tight text-silver/60 transition-colors hover:text-amber-soft cursor-default"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
