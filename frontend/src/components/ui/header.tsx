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
    <header className="absolute top-0 left-0 w-full bg-[#14213d]/80 backdrop-blur-md text-white flex items-center justify-between border-b border-white/10 h-[60px] z-50 font-sans shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      
      {/* Center drop-down handle */}
      <div className="absolute left-1/2 -bottom-[21px] w-16 h-[22px] bg-[#14213d]/80 backdrop-blur-md border border-t-0 border-white/10 rounded-b-md flex justify-center items-center shadow-[0_4px_30px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-[#14213d] -translate-x-1/2 z-40 transition-colors">
        <ChevronDown className="w-4 h-4 text-gray-300" />
      </div>

      {/* Left section */}
      <div className="flex items-center h-full px-4 gap-4 overflow-x-auto flex-1">
        {/* Logo Placeholder */}
        <div className="flex items-center justify-center shrink-0 w-10 h-10 mr-1">
          <svg viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            <path d="M 20 20 L 20 80 A 15 15 0 0 0 50 80 L 50 40 M 50 80 L 50 60 L 80 80" />
          </svg>
        </div>
        
        {/* Date */}
        <span className="text-[13px] text-[#e5e5e5] hidden sm:block shrink-0">
          11 March 2026
        </span>

        {/* Regions */}
        <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2">
          <button className="bg-[#fca311] hover:bg-[#ffb033] text-[#000000] px-3 py-1 rounded-[4px] text-sm font-bold tracking-wide transition-colors">
            Ukraine
          </button>
          <button className="text-[#e5e5e5] hover:bg-[#fca311]/20 hover:text-[#fca311] px-3 py-1 rounded-[4px] text-sm font-bold tracking-wide transition-colors">
            Lebanon
          </button>
          <button className="text-[#e5e5e5] hover:bg-[#fca311]/20 hover:text-[#fca311] px-3 py-1 rounded-[4px] text-sm font-bold tracking-wide transition-colors">
            Syria
          </button>
          <button className="text-[#e5e5e5] hover:bg-[#fca311]/20 hover:text-[#fca311] px-3 py-1 rounded-[4px] text-sm font-bold tracking-wide transition-colors">
            Iran
          </button>
          <div className="w-px h-6 bg-white/20 mx-1"></div>
          <button className="flex items-center gap-2 text-[#e5e5e5] hover:text-[#fca311] font-normal px-2 py-1 text-[13px] transition-colors group shrink-0">
            <Navigation className="w-4 h-4 group-hover:text-[#fca311] text-gray-400 rotate-45 transition-colors" />
            <span>Select regions</span>
          </button>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center h-full hidden lg:flex border-l border-white/10 shrink-0">
        
        <button className="flex flex-col items-center justify-center gap-1 h-full min-w-[70px] px-3 text-[#fca311] relative border-b-[3px] border-[#fca311] bg-[#000000]/40 transition-colors">
          <FileText className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[11px] font-medium">News Live</span>
        </button>
        
        <button className="flex flex-col items-center justify-center gap-1 h-full min-w-[70px] px-3 text-[#e5e5e5] hover:text-[#fca311] hover:bg-[#000000]/20 transition-colors relative border-b-[3px] border-transparent hover:border-[#fca311]/50">
          <Globe className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[11px] font-medium">Language</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-1 h-full min-w-[70px] px-3 text-[#e5e5e5] hover:text-[#fca311] hover:bg-[#000000]/20 transition-colors relative border-b-[3px] border-transparent hover:border-[#fca311]/50">
          <Clock className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[11px] font-medium">Time</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-1 h-full min-w-[70px] px-3 text-[#e5e5e5] hover:text-[#fca311] hover:bg-[#000000]/20 transition-colors relative border-b-[3px] border-transparent hover:border-[#fca311]/50">
          <Key className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[11px] font-medium">Key</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-1 h-full min-w-[70px] px-3 text-[#e5e5e5] hover:text-[#fca311] hover:bg-[#000000]/20 transition-colors relative border-b-[3px] border-transparent border-l border-white/10 hover:border-[#fca311]/50">
          <LogIn className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[11px] font-medium">Login</span>
        </button>
      </div>
    </header>
  );
}