"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollSection() {
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
      className="relative w-full min-h-screen bg-[#050510] flex flex-col items-center justify-center px-4 py-24 overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#fca311]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#fca311]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Animated Text Content */}
      <div 
        className={`max-w-4xl text-center z-10 transition-all duration-1000 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          The World as a <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fca311] via-[#ffd166] to-[#fca311]">
            Living Intelligence Map
          </span>
        </h2>
        
        <p className={`text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed transition-all duration-1000 delay-300 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          Track geopolitical events, regional conflicts, and systemic impacts through an interactive global intelligence platform.
        </p>
      </div>

      {/* Video Container */}
      <div 
        className={`w-full z-10 relative overflow-hidden transition-all duration-1000 delay-300 ease-[cubic-bezier(0.25,1,0.5,1)] transform border border-white/10 shadow-[0_0_50px_rgba(252,163,17,0.1)] rounded-2xl ${
          isVisible ? "opacity-100 translate-y-0 scale-100 max-w-6xl mt-16" : "opacity-0 translate-y-32 scale-75 max-w-4xl mt-32"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl z-20 pointer-events-none" />
        
        <div className="aspect-video w-full bg-[#0a0a16] relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#14213d] to-[#0a0a16]">
               <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover opacity-80"
                >
                  <source src="/videos/laptop_video.mp4" type="video/mp4" />
                </video>
            </div>
        </div>
      </div>
    </section>
  );
}
