import React from 'react';
import { PaperPlaneRight, X, ArrowsClockwise } from '@phosphor-icons/react/dist/ssr';

interface LiveWidgetPreviewProps {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  agencyName: string;
  botName: string;
  botLogoUrl: string;
  welcomeMessage: string;
  welcomeSubMessage: string;
  placeholder: string;
}

export function LiveWidgetPreview(props: LiveWidgetPreviewProps) {
  return (
    <div className="flex justify-center items-center py-10 px-4 bg-slate-100 dark:bg-slate-900 rounded-b-2xl overflow-hidden shadow-inner">
      <div 
        style={{ backgroundColor: props.backgroundColor }}
        className="w-full max-w-[400px] h-[550px] rounded-[24px] shadow-2xl flex flex-col relative border border-black/5 dark:border-white/10"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <img src={props.botLogoUrl} alt="Logo" className="h-10 max-w-[150px] object-contain" />
          <button className="text-white/50 hover:text-white transition-colors">
            <X size={22} weight="bold" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4">
          <div className="bg-white rounded-[18px] p-8 text-center shadow-sm flex flex-col items-center" style={{ border: `1px solid ${props.primaryColor}` }}>
            <img src={props.botLogoUrl} alt="Bot Avatar" className="w-20 h-20 object-contain mb-5" />
            <h3 style={{ color: props.secondaryColor }} className="text-xl font-bold mb-2">
              {props.welcomeMessage}
            </h3>
            <p className="text-[15px] text-slate-500">
              {props.welcomeSubMessage}
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-black/5 dark:border-white/10 relative">
          <div className="bg-white border rounded-[24px] flex items-center px-4 py-3 shadow-sm" style={{ borderColor: props.primaryColor }}>
            <input 
              type="text" 
              placeholder={props.placeholder}
              className="bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 flex-grow text-[15px]"
              disabled
            />
            <button className="ms-2">
              <PaperPlaneRight size={22} weight="fill" color={props.primaryColor} />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3 px-2">
             <button className="text-[12px] flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors">
               <ArrowsClockwise size={14} /> سؤال جديد
             </button>
             <div className="text-[11.5px] text-slate-500 font-sans tracking-wide" dir="ltr">
               Powered by <span style={{ color: props.primaryColor }} className="font-semibold">Intilaqa</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
