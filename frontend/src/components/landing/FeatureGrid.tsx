"use client";

import { BrainCircuit, Map, Activity, ShieldAlert, Cpu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function FeatureGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen bg-[#050510] py-24 px-6 md:px-12 lg:px-24 z-10 flex flex-col justify-center border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg text-white">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fca311] to-[#ffd166]">Enterprise Resilience</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Our platform provides unprecedented visibility into global systemic risks, enabling preemptive decision making and rapid response.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* AI Assistant */}
          <div className={`col-span-1 md:col-span-2 row-span-1 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:bg-white/10 hover:border-[#fca311]/50 hover:shadow-[0_0_30px_rgba(252,163,17,0.15)] transition-all duration-700 delay-100 flex flex-col justify-end relative overflow-hidden group transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fca311]/10 rounded-full blur-[80px] -mr-20 -mt-20 z-0 transition-opacity duration-500 group-hover:bg-[#fca311]/25"></div>
            <div className="z-10 transform transition-transform duration-500 group-hover:translate-x-2">
              <div className="bg-[#fca311]/10 w-fit p-3 rounded-xl mb-6 border border-[#fca311]/20 group-hover:scale-110 transition-transform duration-500">
                <Cpu className="w-8 h-8 text-[#fca311]" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">AI Risk Assistant</h3>
              <p className="text-gray-400 text-lg">Talk to your data with our specialized geopolitical LLM.</p>
            </div>
          </div>

          {/* Conflict Heatmaps */}
          <div className={`col-span-1 row-span-1 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:bg-white/10 hover:border-[#ffd166]/50 hover:shadow-[0_0_30px_rgba(255,209,102,0.15)] transition-all duration-700 delay-300 flex flex-col justify-end relative overflow-hidden group transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'}`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffd166]/10 rounded-full blur-[60px] -mr-10 -mt-10 z-0 transition-opacity duration-500 group-hover:bg-[#ffd166]/25"></div>
            <div className="z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
              <div className="bg-[#ffd166]/10 w-fit p-3 rounded-xl mb-6 border border-[#ffd166]/20 group-hover:scale-110 transition-transform duration-500">
                <ShieldAlert className="w-8 h-8 text-[#ffd166]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight">Dynamic Conflict Heatmaps</h3>
              <p className="text-gray-400 text-base">Monitor military, economic, and cyber threats in real-time.</p>
            </div>
          </div>

          {/* Supply Chain */}
          <div className={`col-span-1 md:col-span-3 row-span-1 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:bg-white/10 hover:border-white/30 transition-all duration-700 delay-500 flex flex-col justify-center relative overflow-hidden group transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-white/5 rounded-full blur-[100px] -mt-32 z-0 transition-opacity duration-700 group-hover:bg-white/10"></div>
            <div className="z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl transform transition-transform duration-500 group-hover:translate-x-2">
                <div className="bg-white/10 w-fit p-3 rounded-xl mb-6 border border-white/20 group-hover:rotate-12 transition-transform duration-500">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Supply Chain & Route Tracking</h3>
                <p className="text-gray-400 text-lg">Identify chokepoints before they impact your logistics.</p>
              </div>
              <div className="hidden md:block flex-1 h-32 bg-[#000000]/60 rounded-xl border border-white/10 relative overflow-hidden ml-8 shadow-inner group-hover:border-white/20 transition-colors duration-500">
                {/* Simulated Route tracking visualization */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-[#fca311]/20 shadow-[0_0_15px_rgba(252,163,17,0.5)]"></div>
                <div className="absolute top-1/2 left-1/4 w-3.5 h-3.5 bg-[#fca311] rounded-full shadow-[0_0_15px_rgba(252,163,17,0.8)] -translate-y-1/2 animate-pulse"></div>
                <div className="absolute top-1/2 left-[45%] w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_white] -translate-y-1/2 flex items-center justify-center">
                   <div className="absolute w-7 h-7 rounded-full border border-white/50 animate-ping"></div>
                </div>
                <div className="absolute top-1/2 left-3/4 w-3.5 h-3.5 bg-[#fca311] rounded-full shadow-[0_0_15px_rgba(252,163,17,0.8)] -translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                {/* Connecting curve */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  <path d="M 25% 50% Q 35% 20% 45% 50%" stroke="rgba(252, 163, 17, 0.4)" strokeWidth="2" fill="none" strokeDasharray="4 4" className="animate-[dash_3s_linear_infinite]" />
                  <path d="M 45% 50% Q 60% 80% 75% 50%" stroke="rgba(252, 163, 17, 0.4)" strokeWidth="2" fill="none" strokeDasharray="4 4" className="animate-[dash_3s_linear_infinite]" />
                </svg>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes dash {
                    to { stroke-dashoffset: -16; }
                  }
                `}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
