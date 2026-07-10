import { CodeBlock } from "@/components/docs/code-block"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export default function ReactDocsPage() {
  const installCode = `npm install intilaqa-developer-sdk`
  
  const reactCode = `import { useState } from 'react';
import { IntilaqaClient } from 'intilaqa-developer-sdk';

// 1. Initialize the engine outside the Component
const client = new IntilaqaClient({
  licenseKey: 'intq_client_571d5220'
});

export default function ChatBot() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message to UI
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Add an empty assistant message to be filled gradually
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      const stream = await client.sendMessageStream(userMsg.content);

      for await (const chunk of stream) {
        if (chunk.type === 'content') {
          // Update the content of the last message (bot message) character by character
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              content: newMessages[lastIndex].content + chunk.text
            };
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {messages.map((m, i) => (
        <div key={i} className={\`message \${m.role}\`}>
          {m.content}
        </div>
      ))}
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Type your message..." 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}`

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-4 text-[#e69605]">
          React Library (NPM SDK)
        </h1>
        <p className="text-lg text-muted-foreground/90 leading-relaxed max-w-3xl">
          This section is aimed at professional developers who use modern frameworks like React or Next.js and want to build a deeply integrated chat interface with their systems (Deep Integration).
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight border-b border-black/5 pb-2 text-foreground">1. Installation</h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          Install our SDK package directly via NPM:
        </p>
        <CodeBlock code={installCode} language="bash" />
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-2xl font-bold tracking-tight border-b border-black/5 pb-2 text-foreground">2. Usage with React (with Streaming)</h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          The following example is a complete <code>Component</code> showing you how to easily manage Streaming State inside React.
        </p>
        
        <Alert className="bg-[#e69605]/10 border-[#e69605]/20 shadow-[0_0_20px_rgba(230,150,5,0.05)] rounded-2xl p-6 my-6">
          <Terminal className="h-6 w-6 text-[#e69605]" />
          <AlertTitle className="text-[#e69605] font-bold text-xl mb-3">Important Architectural Note</AlertTitle>
          <AlertDescription className="text-foreground/80 leading-relaxed text-base">
            Our library is <strong>Framework Agnostic</strong>, meaning it's not exclusively tied to React. We provide you with the raw data (the streaming text), and you manage the UI State using whatever method you prefer, whether it's <code className="text-[#e69605] font-mono bg-white/50 px-2 py-0.5 rounded-md border border-[#e69605]/10 shadow-sm">useState</code>, Zustand, or Redux.
          </AlertDescription>
        </Alert>

        <CodeBlock code={reactCode} language="tsx" />
      </div>
    </div>
  )
}




