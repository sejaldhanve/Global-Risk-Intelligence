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
    <header className="absolute top-0 left-0 w-full bg-white text-gray-800 flex items-center justify-between border-b border-gray-200 h-[60px] z-50 font-sans shadow-sm">
      
      {/* Center drop-down handle */}
      <div className="absolute left-1/2 -bottom-[21px] w-16 h-[22px] bg-white border border-t-0 border-gray-200 rounded-b-md flex justify-center items-center shadow-sm cursor-pointer hover:bg-gray-50 -translate-x-1/2 z-40">
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      {/* Left section */}
      <div className="flex items-center h-full px-4 gap-4 overflow-x-auto flex-1">
        {/* Logo Placeholder */}
        <div className="flex items-center justify-center shrink-0 w-10 h-10 mr-1">
          <svg viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <path d="M 20 20 L 20 80 A 15 15 0 0 0 50 80 L 50 40 M 50 80 L 50 60 L 80 80" />
          </svg>
        </div>
        
        {/* Date */}
        <span className="text-[13px] text-[#5f6368] hidden sm:block shrink-0">
          11 March 2026
        </span>

        {/* Regions */}
        <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2">
          <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-3 py-1 rounded-[4px] text-sm font-bold tracking-wide transition-colors">
            Ukraine
          </button>
          <button className="text-[#3b82f6] hover:bg-blue-50 px-3 py-1 rounded-[4px] text-sm font-bold tracking-wide transition-colors">
            Lebanon
          </button>
          <button className="text-[#3b82f6] hover:bg-blue-50 px-3 py-1 rounded-[4px] text-sm font-bold tracking-wide transition-colors">
            Syria
          </button>
          <button className="text-[#3b82f6] hover:bg-blue-50 px-3 py-1 rounded-[4px] text-sm font-bold tracking-wide transition-colors">
            Iran
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <button className="flex items-center gap-2 text-[#5f6368] hover:text-gray-900 font-normal px-2 py-1 text-[13px] transition-colors group shrink-0">
            <Navigation className="w-4 h-4 group-hover:text-gray-800 text-gray-400 rotate-45" />
            <span>Select regions</span>
          </button>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center h-full hidden lg:flex border-l border-gray-100 shrink-0">
        
        <button className="flex flex-col items-center justify-center gap-1 h-full min-w-[70px] px-3 text-[#3b82f6] relative border-b-[3px] border-[#3b82f6] bg-blue-50/50">
          <FileText className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[11px] font-medium">News Live</span>
        </button>
        
        <button className="flex flex-col items-center justify-center gap-1 h-full min-w-[70px] px-3 text-[#5f6368] hover:bg-gray-50 transition-colors relative border-b-[3px] border-transparent">
          <Globe className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[11px] font-medium">Language</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-1 h-full min-w-[70px] px-3 text-[#5f6368] hover:bg-gray-50 transition-colors relative border-b-[3px] border-transparent">
          <Clock className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[11px] font-medium">Time</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-1 h-full min-w-[70px] px-3 text-[#5f6368] hover:bg-gray-50 transition-colors relative border-b-[3px] border-transparent">
          <Key className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[11px] font-medium">Key</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-1 h-full min-w-[70px] px-3 text-[#5f6368] hover:bg-gray-50 transition-colors relative border-b-[3px] border-transparent border-l border-gray-100">
          <LogIn className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[11px] font-medium">Login</span>
        </button>
      </div>
    </header>
  );
}