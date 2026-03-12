"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Globe2, 
  Sparkles, 
  FileText, 
  Settings 
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] h-screen bg-[#050510] text-white flex flex-col border-r border-white/10 font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-32 bg-[#fca311]/5 blur-3xl pointer-events-none" />
      
      {/* Header / Logo Area */}
      <div className="p-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center h-12 shrink-0">
            {/* White glow effect so dark logos are clearly visible */}
            <div className="absolute inset-0 bg-white/70 blur-xl rounded-full scale-[1.8] z-0 pointer-events-none"></div>
            <img src="/images/logo.png" alt="GRI Logo" className="h-12 w-auto object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)] relative z-10 pb-1" />
          </div>
          <div className="flex flex-col z-10">
            <h2 className="font-bold text-[15px] leading-tight text-white drop-shadow-sm truncate">Global Risk<br/>Intelligence</h2>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 flex flex-col gap-2 relative z-10">
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
            pathname === '/dashboard' 
              ? 'bg-[#fca311]/10 border border-[#fca311]/30 text-[#fca311] shadow-[inset_0_0_15px_rgba(252,163,17,0.05)] font-bold mb-1' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 transition-colors ${pathname === '/dashboard' ? '' : 'group-hover:text-white'}`} />
          <span className="text-[14px]">Dashboard</span>
        </Link>

        <Link 
          href="/dashboard/global-map" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
            pathname === '/dashboard/global-map' 
              ? 'bg-[#fca311]/10 border border-[#fca311]/30 text-[#fca311] shadow-[inset_0_0_15px_rgba(252,163,17,0.05)] font-bold mb-1' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe2 className={`w-5 h-5 transition-colors ${pathname === '/dashboard/global-map' ? '' : 'group-hover:text-white'}`} />
          <span className="text-[14px]">Global Map</span>
        </Link>

        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors group">
          <FileText className="w-5 h-5 group-hover:text-[#fca311] transition-colors" />
          <span className="text-[14px] font-medium">Risk Reports</span>
        </Link>

        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors group">
          <Settings className="w-5 h-5 group-hover:text-[#fca311] transition-colors" />
          <span className="text-[14px] font-medium">Settings</span>
        </Link>
      </nav>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-white/10 relative z-10">
        <div className="bg-[#fca311]/5 border border-[#fca311]/20 rounded-lg p-3 backdrop-blur-sm">
          <h3 className="text-[#fca311] text-xs font-bold mb-2 uppercase tracking-wider">System Health</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
            <span className="text-gray-300 text-[11px]">Real-time Data Active</span>
          </div>
        </div>
      </div>
      
    </aside>
  );
}
