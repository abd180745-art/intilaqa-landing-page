'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'javascript' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-2xl overflow-hidden my-8 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.3)] border border-white/20" dir="ltr">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a]/95 to-[#0a0a0a]/95 backdrop-blur-xl -z-10" />
      
      <div className="flex items-center justify-between px-5 py-3 bg-white/[0.03] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="font-mono text-xs text-white/50">{language}</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 transition-all" 
          onClick={onCopy}
        >
          {copied ? <Check className="h-4 w-4 text-[#e69605]" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <div className="p-5 overflow-x-auto text-sm leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <pre className="text-gray-300 font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

