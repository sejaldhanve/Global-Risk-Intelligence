import { Search } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Top Search Bar / Header Area */}
      <header className="h-[76px] border-b border-[#302F2D] flex items-center px-8 justify-between bg-[#1F1E1C]">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9BA1A6]" />
          <input 
            type="text" 
            placeholder="Search risk events, locations, or reports..." 
            className="w-full bg-[#181715] border border-[#302F2D] rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-[#9BA1A6] focus:outline-none focus:border-[#E96013] transition-colors"
          />
        </div>
      </header>

      {/* Main Content Area Placeholder */}
      <div className="flex-1 p-8 overflow-y-auto bg-[#181715]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white tracking-wide">Enterprise Dashboard</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#302F2D] hover:bg-[#3D3B39] text-[#9BA1A6] rounded-md text-sm font-medium transition-colors">
              Filter Data
            </button>
            <button className="px-4 py-2 bg-[#E96013] hover:bg-[#c95210] text-white rounded-md text-sm font-medium transition-colors shadow-lg">
              Generate Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="w-full h-[300px] border border-[#302F2D] rounded-xl flex items-center justify-center bg-[#1F1E1C] bg-opacity-50">
            <span className="text-[#9BA1A6]">Active Threats Overview</span>
          </div>
          <div className="w-full h-[300px] border border-[#302F2D] rounded-xl flex items-center justify-center bg-[#1F1E1C] bg-opacity-50">
            <span className="text-[#9BA1A6]">Global Intelligence Feed</span>
          </div>
          <div className="w-full h-[300px] border border-[#302F2D] rounded-xl flex items-center justify-center bg-[#1F1E1C] bg-opacity-50">
            <span className="text-[#9BA1A6]">Monitored Assets Status</span>
          </div>
        </div>
      </div>
    </div>
  );
}
