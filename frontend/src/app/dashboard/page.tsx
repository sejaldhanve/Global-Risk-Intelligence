import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ConflictHeatmap } from "@/components/dashboard/ConflictHeatmap";
import { RiskForecastPanel } from "@/components/dashboard/RiskForecastPanel";
import { NarrativeTrendsChart } from "@/components/dashboard/NarrativeTrendsChart";
import { EnergyIndicatorsChart } from "@/components/dashboard/EnergyIndicatorsChart";
import { ShippingRoutesMap } from "@/components/dashboard/ShippingRoutesMap";
import { GlobalFeed } from "@/components/dashboard/GlobalFeed";

export default function DashboardPage() {
  return (
    <div className="w-full h-full flex flex-col bg-[#050510] transition-colors rounded-tl-3xl border-t border-l border-white/5 relative overflow-hidden">
      {/* Top Search Bar / Header Area */}
      <header className="h-[76px] border-b border-white/10 flex items-center px-8 justify-between bg-[#050510]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search risk events, locations, or reports..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#fca311]/50 focus:bg-white/10 transition-all shadow-[inset_0_0_10px_rgba(252,163,17,0.02)]"
          />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#fca311] to-[#ffd166] opacity-90 cursor-pointer hover:opacity-100 transition-opacity flex items-center justify-center shadow-[0_0_10px_rgba(252,163,17,0.3)]">
            <span className="text-black text-xs font-extrabold tracking-wide">JD</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Global Risk <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fca311] to-[#ffd166]">Command Center</span></h1>
            <p className="text-sm text-gray-400 font-light">Real-time systemic risk monitoring and geopolitical intelligence across all sectors.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 rounded-lg text-sm font-medium transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              Filter Data
            </button>
            <button className="px-5 py-2 bg-gradient-to-r from-[#fca311] to-[#ffd166] hover:brightness-110 text-black rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(252,163,17,0.4)] hover:shadow-[0_0_25px_rgba(252,163,17,0.6)]">
              Generate Briefing
            </button>
          </div>
        </div>

        {/* BENTO GRID DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Main Heatmap */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <ConflictHeatmap delay={0.1} />
          </div>

          {/* Right Sidebar - Feed */}
          {/* Replaced Apollo AI with Global Feed */}
          <div className="col-span-1 lg:col-span-1 h-full max-h-[500px]">
            <GlobalFeed delay={0.2} />
          </div>



          {/* Bottom Row Charts */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 h-[400px]">
            <RiskForecastPanel delay={0.4} />
          </div>
          <div className="col-span-1 lg:col-span-1 h-[400px]">
            <NarrativeTrendsChart delay={0.5} />
          </div>
          <div className="col-span-1 lg:col-span-1 h-[400px]">
            <EnergyIndicatorsChart delay={0.6} />
          </div>
          <div className="col-span-1 lg:col-span-1 h-[400px]">
            <ShippingRoutesMap delay={0.7} />
          </div>

        </div>
      </div>
    </div>
  );
}
