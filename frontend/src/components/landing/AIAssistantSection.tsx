"use client";

import { useEffect, useRef, useState } from "react";

export function AIAssistantSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#0a0a16] flex flex-col md:flex-row items-center justify-center px-4 md:px-12 py-24 overflow-hidden gap-12"
    >
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#fca311]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ffd166]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Text Content */}
      <div 
        className={`w-full md:w-1/2 max-w-2xl z-10 transition-all duration-1000 ease-out transform ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fca311]/10 border border-[#fca311]/30 text-[#fca311] text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fca311] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fca311]"></span>
          </span>
          Next-Gen AI Core
        </div>
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          AI Geopolitical <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fca311] to-[#ffd166]">
            Intelligence Assistant
          </span>
        </h2>
        
        <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-8">
          An AI agent that interprets global events, analyzes system risks, and explains complex geopolitical interactions in simple terms.
        </p>

        <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-medium hover:bg-white/10 hover:border-[#fca311]/50 transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.05)] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]">
          Talk to the AI Agent
        </button>
      </div>

      {/* Image / Animated Container */}
      <div 
        className={`w-full md:w-1/2 max-w-xl aspect-square relative z-10 transition-all duration-1000 delay-300 ease-out transform ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
        }`}
      >
        {/* Animated Rings/Layers behind the image to simulate video-like continuous movement */}
        <div className="absolute inset-4 rounded-full border border-[#fca311]/20 animate-[spin_10s_linear_infinite]" />
        <div className="absolute inset-8 rounded-full border border-[#ffd166]/30 border-dashed animate-[spin_15s_linear_infinite_reverse]" />
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#fca311]/5 to-[#ffd166]/5 rounded-3xl backdrop-blur-sm border border-white/10 shadow-[0_0_40px_rgba(0,240,255,0.1)] overflow-hidden flex items-center justify-center group">
          
          {/* Pulsing core glow */}
          <div className="absolute inset-0 bg-[#fca311]/20 blur-3xl rounded-full scale-50 animate-pulse group-hover:scale-75 transition-transform duration-700" />
          
          {/* Main Image Container */}
          <div className="relative w-[85%] h-[85%] animate-[pulse_6s_ease-in-out_infinite] flex items-center justify-center rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(252,163,17,0.4)] border border-[#ffd166]/20">
            <img 
              src="/ai_assistant.jpeg" 
              alt="AI Geopolitical Assistant" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Temporary fallback if image hasn't been uploaded yet
                (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/600x600/14213d/fca311?text=AI+Assistant';
              }}
            />
          </div>
          
          {/* Scanning line animation overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fca311]/10 to-transparent h-1/4 w-full animate-[bounce_3s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
