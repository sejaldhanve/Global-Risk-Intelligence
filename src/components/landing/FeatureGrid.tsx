import { BrainCircuit, Map, Activity } from "lucide-react";

export function FeatureGrid() {
  return (
    <section className="relative w-full min-h-screen bg-[#050505] py-24 px-6 md:px-12 lg:px-24 z-10 flex flex-col justify-center border-t border-white/10">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-lg text-white">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#b026ff]">Enterprise Resilience</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our platform provides unprecedented visibility into global systemic risks, enabling preemptive decision making and rapid response.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Apollo AI */}
          <div className="col-span-1 md:col-span-2 row-span-1 bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 flex flex-col justify-end relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#b026ff]/10 rounded-full blur-[80px] -mr-20 -mt-20 z-0 transition-opacity group-hover:bg-[#b026ff]/20"></div>
            <div className="z-10">
              <BrainCircuit className="w-10 h-10 text-[#b026ff] mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">AI Risk Assistant (Apollo AI)</h3>
              <p className="text-gray-400 text-lg">Talk to your data with our specialized geopolitical LLM.</p>
            </div>
          </div>

          {/* Conflict Heatmaps */}
          <div className="col-span-1 row-span-1 bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 flex flex-col justify-end relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff2a2a]/10 rounded-full blur-[60px] -mr-10 -mt-10 z-0 transition-opacity group-hover:bg-[#ff2a2a]/20"></div>
            <div className="z-10">
              <Map className="w-10 h-10 text-[#ff5722] mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Dynamic Conflict Heatmaps</h3>
              <p className="text-gray-400 text-lg">Monitor military, economic, and cyber threats in real-time.</p>
            </div>
          </div>

          {/* Supply Chain */}
          <div className="col-span-1 md:col-span-3 row-span-1 bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#00f0ff]/10 rounded-full blur-[80px] -mt-24 z-0 transition-opacity group-hover:bg-[#00f0ff]/20"></div>
            <div className="z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <Activity className="w-10 h-10 text-[#00f0ff] mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Supply Chain & Route Tracking</h3>
                <p className="text-gray-400 text-lg">Identify chokepoints before they impact your logistics.</p>
              </div>
              <div className="hidden md:block flex-1 h-32 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden ml-8">
                {/* Simulated Route tracking visualization */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-[#00f0ff]/20 shadow-[0_0_15px_#00f0ff]"></div>
                <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-[#00f0ff] rounded-full shadow-[0_0_15px_#00f0ff] -translate-y-1/2 animate-pulse"></div>
                <div className="absolute top-1/2 left-[45%] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-[#00f0ff] rounded-full shadow-[0_0_15px_#00f0ff] -translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                {/* Connecting curve */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  <path d="M 25% 50% Q 35% 20% 45% 50%" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
                  <path d="M 45% 50% Q 60% 80% 75% 50%" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
