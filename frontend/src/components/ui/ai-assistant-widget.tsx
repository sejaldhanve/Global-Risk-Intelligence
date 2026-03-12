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
            className="flex items-center gap-2 bg-gradient-to-r from-[#fca311] to-[#ffd166] text-black hover:brightness-110 p-4 rounded-full shadow-[0_4px_20px_rgba(252,163,17,0.4)] hover:scale-105 transition-all outline-none focus:outline-none ring-4 ring-white/10 group"
          >
            <Sparkles className="w-6 h-6 animate-pulse group-hover:animate-none" />
            <span className="font-bold tracking-wide pr-1">Ask AI</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] max-h-[80vh] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2 text-gray-900">
              <Sparkles className="w-5 h-5 text-[#fca311]" />
              <h3 className="font-bold tracking-wide">AI Risk Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-200 p-1.5 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Intro / Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="bg-[#fca311]/10 p-4 rounded-full border border-[#fca311]/20">
                <Search className="w-8 h-8 text-[#fca311]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">How can I help you analyze risk today?</h3>
              <p className="text-gray-600 max-w-[280px] text-[13px] leading-relaxed">
                Ask me to summarize global events, pull specific risk reports, or analyze geopolitical trends affecting your enterprise tier assets.
              </p>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask something..."
                className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-4 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#fca311] focus:ring-1 focus:ring-[#fca311] transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#fca311] hover:text-white p-2 rounded-lg hover:bg-[#fca311] transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
