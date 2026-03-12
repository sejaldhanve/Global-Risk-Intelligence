"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Send } from "lucide-react";

export function AiAssistantChat({ delay = 0 }: { delay?: number }) {
  return (
    <GlassPanel delay={delay} className="col-span-1 row-span-2 flex flex-col h-[500px]">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--panel-border)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#b026ff] animate-pulse"></div>
          <h3 className="text-lg font-semibold tracking-wide text-gray-800 dark:text-gray-100">Apollo AI</h3>
        </div>
        <span className="text-xs text-gray-400">System Ready</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg rounded-tl-none border border-[var(--panel-border)]">
          <p className="text-sm text-gray-800 dark:text-gray-200">
            Scanning global networks... 4 new systemic risks identified. How would you like me to filter the data?
          </p>
        </div>
        <div className="bg-[#00f0ff]/10 p-3 rounded-lg rounded-tr-none border border-[#00f0ff]/30 self-end ml-8">
          <p className="text-sm text-gray-800 dark:text-white">
            Analyze the energy pipeline impact.
          </p>
        </div>
        <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg rounded-tl-none border border-[var(--panel-border)]">
          <p className="text-sm text-gray-800 dark:text-gray-200">
            Working... Analyzing supply route disruptions and cascading market effects...
          </p>
        </div>
      </div>
      
      <div className="relative mt-auto">
        <input 
          type="text" 
          placeholder="Command Apollo..." 
          className="w-full bg-[#181715]/50 border border-[var(--panel-border)] rounded-md py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-[#b026ff] transition-colors dark:text-white"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#b026ff] transition-colors rounded">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </GlassPanel>
  );
}
