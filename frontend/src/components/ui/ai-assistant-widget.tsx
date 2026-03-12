"use client";

import { useState } from "react";
import { Sparkles, X, Send, Search } from "lucide-react";

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-[#E96013] hover:bg-[#c95210] text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all outline-none focus:outline-none ring-4 ring-[#181715]/50 group"
          >
            <Sparkles className="w-6 h-6 animate-pulse group-hover:animate-none" />
            <span className="font-bold tracking-wide pr-1">Ask AI</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] max-h-[80vh] bg-[#1F1E1C] border border-[#302F2D] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-[#181715] border-b border-[#302F2D] p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-[#E96013]" />
              <h3 className="font-bold tracking-wide">AI Risk Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#9BA1A6] hover:text-white hover:bg-[#302F2D] p-1.5 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Intro / Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#181715]">
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="bg-[#332316] p-4 rounded-full">
                <Search className="w-8 h-8 text-[#E96013]" />
              </div>
              <h3 className="text-xl font-bold text-white">How can I help you analyze risk today?</h3>
              <p className="text-[#9BA1A6] max-w-[280px] text-[13px] leading-relaxed">
                Ask me to summarize global events, pull specific risk reports, or analyze geopolitical trends affecting your enterprise tier assets.
              </p>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#1F1E1C] border-t border-[#302F2D] shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask something..."
                className="w-full bg-[#181715] border border-[#302F2D] rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-[#9BA1A6] focus:outline-none focus:border-[#E96013] transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#E96013] hover:text-white p-2 rounded-lg hover:bg-[#E96013] transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
