import { Settings, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function WidgetDocsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-4 text-[#e69605]">
          Ready-made Widget (The Easiest Option)
        </h1>
        <p className="text-lg text-muted-foreground/90 leading-relaxed max-w-3xl">
          This is the fastest and most common method. If you have a website (whether it's WordPress, Shopify, or a plain HTML site), you can add our ready-made chat box easily without writing any code.
        </p>
      </div>

      <div className="my-8">
        <h2 className="text-xl font-bold text-foreground mb-3 tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-[#e69605]" />
          No Coding Required!
        </h2>
        <div className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
          Instead of manually typing code and configuring properties here, we have built a fully interactive <strong>Widget Customizer</strong> inside your Dashboard. 
          <br /><br />
          You can visually customize the bot's colors, name, and welcome message. Once you are happy with the design, you can simply click <strong>"Copy Code"</strong> and paste the generated snippet directly into your website.
        </div>
        
        <div className="mt-8">
          <Link 
            href="/dashboard/widget" 
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#e69605] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#e69605]/20 hover:bg-[#d48805] hover:shadow-[#e69605]/30 transition-all duration-300 group whitespace-nowrap"
          >
            Go to Widget Customizer
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
