"use client";

import { 
  Navigation, 
  ChevronDown, 
  FileText, 
  Globe, 
  Clock, 
  Key, 
  LogIn
} from "lucide-react";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full bg-white/10 backdrop-blur-md text-white flex items-center justify-between border-b border-white/20 h-[80px] z-50 font-sans shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      
      {/* Center drop-down handle */}
      <div className="absolute left-1/2 -bottom-[21px] w-16 h-[22px] bg-white/10 backdrop-blur-md border border-t-0 border-white/20 rounded-b-md flex justify-center items-center shadow-[0_4px_30px_rgba(0,0,0,0.1)] cursor-pointer hover:bg-white/20 -translate-x-1/2 z-40 transition-colors">
        <ChevronDown className="w-4 h-4 text-white" />
      </div>

      {/* Left section */}
      <div className="flex items-center h-full px-4 gap-4 overflow-hidden flex-1">
        {/* Logo Placeholder */}
        <div className="flex items-center justify-center shrink-0 h-14 sm:h-20 mr-2 sm:mr-4 group relative z-10 cursor-pointer">
          {/* White Smoke Effect */}
          <div className="absolute inset-0 bg-white/70 blur-2xl md:blur-3xl rounded-full scale-[2.5] transform-gpu z-0 pointer-events-none transition-opacity duration-300"></div>
          
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-14 sm:h-20 w-auto max-w-[220px] object-contain drop-shadow-[0_4px_16px_rgba(255,255,255,1)] relative z-10"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const nextEl = e.currentTarget.nextElementSibling;
              if (nextEl) nextEl.classList.remove('hidden');
            }}
          />
          <div className="hidden flex items-center justify-center shrink-0 w-10 h-10">
            <svg viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              <path d="M 20 20 L 20 80 A 15 15 0 0 0 50 80 L 50 40 M 50 80 L 50 60 L 80 80" />
            </svg>
          </div>
        </div>
        
        {/* Date */}
        <span className="text-[13px] text-[#e5e5e5] hidden sm:block shrink-0">
          11 March 2026
        </span>

        
      </div>

      {/* Right section */}
      <div className="flex items-center h-full hidden lg:flex border-l border-white/10 shrink-0">
        <button className="flex flex-col items-center justify-center gap-1 h-full min-w-[70px] px-3 text-[#e5e5e5] hover:text-[#fca311] hover:bg-[#000000]/20 transition-colors relative border-b-[3px] border-transparent border-l border-white/10 hover:border-[#fca311]/50">
          <LogIn className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[11px] font-medium">Login</span>
        </button>
      </div>
    </header>
  );
}