import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ConflictHeatmap } from "@/components/dashboard/ConflictHeatmap";
import { RiskForecastPanel } from "@/components/dashboard/RiskForecastPanel";
import { NarrativeTrendsChart } from "@/components/dashboard/NarrativeTrendsChart";
import { EnergyIndicatorsChart } from "@/components/dashboard/EnergyIndicatorsChart";
import { ShippingRoutesMap } from "@/components/dashboard/ShippingRoutesMap";
import { GlobalFeed } from "@/components/dashboard/GlobalFeed";
import { AiAssistantChat } from "@/components/dashboard/AiAssistantChat";

export default function DashboardPage() {
  return (
    <div className="w-full h-full flex flex-col bg-var(--background) transition-colors">
      {/* Top Search Bar / Header Area */}
      <header className="h-[76px] border-b border-[var(--panel-border)] flex items-center px-8 justify-between bg-black/5 dark:bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search risk events, locations, or reports..." 
            className="w-full bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-full py-2 pl-10 pr-4 text-sm text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-cyber-blue)] transition-colors"
          />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#b026ff] opacity-80 cursor-pointer hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-bold">JD</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-wide text-gray-900 dark:text-white mb-1">Global Risk Command Center</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Real-time systemic risk monitoring and geopolitical intelligence across all sectors.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2 bg-[var(--panel-bg)] hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--panel-border)] text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium transition-colors">
              Filter Data
            </button>
            <button className="px-5 py-2 bg-[#ff5722] hover:bg-[#ff2a2a] text-white rounded-md text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,87,34,0.4)] hover:shadow-[0_0_20px_rgba(255,42,42,0.6)]">
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

          {/* Right Sidebar - Feed & Chat */}
          <div className="col-span-1 lg:col-span-1 flex flex-col gap-6">
            <AiAssistantChat delay={0.2} />
          </div>

          <div className="col-span-1 lg:col-span-1 h-[400px]">
            <GlobalFeed delay={0.3} />
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
