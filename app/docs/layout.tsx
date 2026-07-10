import { DocsSidebar } from "@/components/docs/sidebar"
import { Navbar } from "@/components/landing/navbar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div dir="ltr" className="flex h-screen w-full bg-background text-foreground font-sans overflow-hidden relative text-left">
      {/* Soft aurora blobs in the background */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-24 right-[12%] h-[420px] w-[420px] rounded-full bg-[#e69605]/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed top-1/3 left-[8%] h-[360px] w-[360px] rounded-full bg-[#e69605]/10 blur-[120px]"
      />

      <Navbar />

      {/* Fixed Sidebar (OpenAI Style) - Light Mode */}
      <aside className="w-72 shrink-0 h-full border-r border-border/50 bg-white flex flex-col overflow-y-auto pt-10 shadow-[0_0_30px_rgba(0,0,0,0.02)] z-10 relative">
        <div className="flex-1 py-4">
          <DocsSidebar />
        </div>
      </aside>

      {/* Main Content Area (Edge to Edge) */}
      <main className="flex-1 h-full overflow-y-auto bg-transparent pt-28">
        <div className="max-w-4xl mx-auto py-8 px-8 lg:px-16 pb-24">
          {children}
        </div>
      </main>
    </div>
  )
}



