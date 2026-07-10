import { CodeBlock } from "@/components/docs/code-block"

export default function CDNDocsPage() {
  const cdnSetupCode = `<!-- 1. Include the library link -->
<script src="https://intilaqa-ai.abo200004.workers.dev/intilaqa-sdk.min.js"></script>

<!-- 2. Use the library -->
<script>
  // Initialize the engine with your license key
  const client = new Intilaqa.IntilaqaClient({ 
    licenseKey: 'intq_client_571d5220' 
  });

  async function sendMessage() {
    try {
      // Send a message and receive the response as a stream
      const stream = await client.sendMessageStream("Hello, who are you?");

      for await (const chunk of stream) {
        if (chunk.type === 'content') {
          // Update your UI here character by character
          console.log(chunk.text);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  
  sendMessage();
</script>`

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-4 text-[#e69605]">
          Using the CDN (Vanilla JS)
        </h1>
        <p className="text-lg text-muted-foreground/90 leading-relaxed max-w-3xl">
          This method is aimed at developers who want to build their own custom UI from scratch using HTML and Vanilla JavaScript without using complex frameworks like React.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight border-b border-black/5 pb-2 text-foreground">How does it work?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          We have provided a very small and minified version of our library that you can include directly in your page via a <code className="text-[#e69605] font-mono bg-white/50 px-2 py-0.5 rounded-md border border-[#e69605]/10 shadow-sm">&lt;script&gt;</code> tag. This library will automatically provide a global object called <code className="text-[#e69605] font-mono bg-white/50 px-2 py-0.5 rounded-md border border-[#e69605]/10 shadow-sm">Intilaqa</code> in the browser.
        </p>
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-2xl font-bold tracking-tight border-b border-black/5 pb-2 text-foreground">Practical Streaming Example</h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          The following example shows you how to connect to the engine and receive the response character by character as you see in ChatGPT, so you can print it in the interface you designed.
        </p>
        
        <CodeBlock code={cdnSetupCode} language="html" />
      </div>

      <div className="bg-[#e69605]/10 border border-[#e69605]/20 shadow-[0_0_20px_rgba(230,150,5,0.03)] rounded-2xl p-8 mt-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e69605]/10 blur-3xl rounded-full" />
        <h3 className="text-xl font-bold mb-3 text-[#e69605] flex items-center gap-2">💡 Developer Tip:</h3>
        <p className="text-foreground/80 text-base leading-relaxed relative z-10">
          Our library handles all the complex tasks for you: from secure server connection, to byte decoding, and parsing the complex NDJSON format. 
          Your only job is to take the pure text (<code className="text-[#e69605] font-mono bg-white/50 px-2 py-0.5 rounded-md border border-[#e69605]/10 shadow-sm">chunk.text</code>) and append it to your HTML element (like a <code className="text-[#e69605] font-mono bg-white/50 px-2 py-0.5 rounded-md border border-[#e69605]/10 shadow-sm">div</code>).
        </p>
      </div>
    </div>
  )
}




