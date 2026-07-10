import { CodeBlock } from "@/components/docs/code-block"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Key, Terminal } from "lucide-react"

export default function DocsIntroductionPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-4 text-[#e69605]">
          Introduction to Intilaqa Engine
        </h1>
        <p className="text-lg text-muted-foreground/90 leading-relaxed max-w-3xl">
          Welcome to the Developer Docs center for the "Intilaqa" AI engine. 
          This guide provides you with all possible ways to integrate the engine into your website or application, whether you are a beginner looking for a ready-made solution, or a professional developer looking to build a fully customized interface.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight border-b border-black/5 pb-2 text-foreground">
          How does the system work?
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          The "Intilaqa" system is a <strong className="text-foreground">Headless SDK</strong>, which means we provide you with pure AI and real-time streaming data, and you choose how you want to present it to your users.
        </p>
      </div>

      <Alert className="bg-[#e69605]/10 border-[#e69605]/20 rounded-xl p-6">
        <Key className="h-6 w-6 text-[#e69605]" />
        <AlertTitle className="text-[#e69605] font-bold text-xl mb-3">License Key</AlertTitle>
        <AlertDescription className="text-foreground/80 leading-relaxed text-base">
          For all integration methods you will see in this documentation, you will need a valid <strong>License Key</strong> for the engine to work. 
          This key always starts with <code className="text-[#e69605] font-mono bg-white/50 px-2 py-0.5 rounded-md border border-[#e69605]/10 shadow-sm">intq_client_</code> 
          and you can get it from your dashboard.
        </AlertDescription>
      </Alert>

      <div className="space-y-6 pt-6">
        <h2 className="text-2xl font-bold tracking-tight border-b border-black/5 pb-2 text-foreground">
          Choose your preferred way to start:
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <a href="/docs/widget" className="group p-8 rounded-xl border border-white/40 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:border-[#e69605]/30 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-[#e69605] transition-colors flex items-center gap-3">
              <span className="bg-[#e69605]/10 p-2.5 rounded-lg text-[#e69605]"><Terminal className="h-5 w-5" /></span>
              Ready-made Widget Integration
            </h3>
            <p className="text-base text-muted-foreground/90 leading-relaxed">The fastest way. Copy one line and put it in your site and the chat box will work immediately with all its features.</p>
          </a>
          
          <a href="/docs/react" className="group p-8 rounded-xl border border-white/40 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:border-[#e69605]/30 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-[#e69605] transition-colors flex items-center gap-3">
              <span className="bg-[#e69605]/10 p-2.5 rounded-lg text-[#e69605]"><Terminal className="h-5 w-5" /></span>
              React Library (NPM)
            </h3>
            <p className="text-base text-muted-foreground/90 leading-relaxed">For professional developers. Use our ready-made Hooks to build your fully customized interface in React/Next.js.</p>
          </a>
        </div>
      </div>
    </div>
  )
}




