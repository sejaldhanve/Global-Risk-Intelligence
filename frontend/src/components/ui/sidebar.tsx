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
    <aside className="w-[280px] h-screen bg-[#1F1E1C] text-white flex flex-col border-r border-[#302F2D] font-sans">
      
      {/* Header / Logo Area */}
      <div className="p-6 border-b border-[#302F2D]">
        <div className="flex items-center gap-3">
          <div className="bg-[#E96013] p-2 rounded-lg shadow-lg">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-[15px] leading-tight text-white drop-shadow-sm">Risk Intelligence</h2>
            <p className="text-[#E96013] text-[10px] font-bold tracking-wider uppercase mt-0.5">Enterprise Tier</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors group ${
            pathname === '/dashboard' 
              ? 'bg-[#332316] border border-[#4A3220] text-[#E96013] shadow-inner font-bold mt-1 mb-1' 
              : 'text-[#9BA1A6] hover:text-white hover:bg-[#302F2D]'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 transition-colors ${pathname === '/dashboard' ? '' : 'group-hover:text-white'}`} />
          <span className="text-[14px]">Dashboard</span>
        </Link>

        <Link 
          href="/dashboard/global-map" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors group ${
            pathname === '/dashboard/global-map' 
              ? 'bg-[#332316] border border-[#4A3220] text-[#E96013] shadow-inner font-bold mt-1 mb-1' 
              : 'text-[#9BA1A6] hover:text-white hover:bg-[#302F2D]'
          }`}
        >
          <Globe2 className={`w-5 h-5 transition-colors ${pathname === '/dashboard/global-map' ? '' : 'group-hover:text-white'}`} />
          <span className="text-[14px]">Global Map</span>
        </Link>


        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#9BA1A6] hover:text-white hover:bg-[#302F2D] transition-colors group">
          <FileText className="w-5 h-5 group-hover:text-white transition-colors" />
          <span className="text-[14px] font-medium">Risk Reports</span>
        </Link>

        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#9BA1A6] hover:text-white hover:bg-[#302F2D] transition-colors group">
          <Settings className="w-5 h-5 group-hover:text-white transition-colors" />
          <span className="text-[14px] font-medium">Settings</span>
        </Link>
      </nav>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-[#302F2D]">
        <div className="bg-[#26201b] border border-[#3A2E24] rounded-lg p-3">
          <h3 className="text-[#E96013] text-xs font-bold mb-2">System Health</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="text-[#9BA1A6] text-[11px]">Real-time Data Active</span>
          </div>
        </div>
      </div>
      
    </aside>
  );
}
