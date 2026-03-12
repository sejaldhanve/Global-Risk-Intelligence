import Header from "@/components/ui/header";
import Link from "next/link";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { ScrollSection } from "@/components/landing/ScrollSection";
import { AIAssistantSection } from "@/components/landing/AIAssistantSection";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  return (
    <main className="w-full bg-black text-white overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative w-screen h-screen overflow-hidden">
        {/* VIDEO BACKGROUND */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="
          absolute
          top-1/2
          left-1/2
          h-[100vw]
          w-[100vh]
          -translate-x-1/2
          -translate-y-1/2
          rotate-90
          object-cover
        "
      >
        <source src="/videos/earth2.mp4" type="video/mp4" />
      </video>

      {/* HEADER COMPONENT */}
      {/* <Header /> */}

      {/* TAGLINE */}
      <div className="absolute top-[60%] left-4 md:left-8 lg:left-12 -translate-y-1/2 z-20 max-w-2xl pointer-events-none">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white/80 tracking-tighter leading-[0.9] mix-blend-overlay drop-shadow-xl uppercase">
          See Global Risk<br />Before It<br />Happens.
        </h1>
      </div>

      {/* CALL TO ACTION BUTTON */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
          <Link href="/dashboard" className="
            group 
            flex flex-row items-center gap-3 
            bg-white text-black 
            px-10 py-4 rounded-full 
            font-extrabold text-sm sm:text-lg uppercase tracking-[0.15em] 
            transition-all duration-300 ease-out
            shadow-[0_0_40px_rgba(255,255,255,0.3)] 
            hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] 
            hover:-translate-y-1 
            active:scale-95 
            active:translate-y-0
          ">
            <span>Get Started</span>
            <svg 
              className="w-5 h-5 transition-transform duration-300 ease-out group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
      </div>
      </section>

      {/* SCROLL SECTION WITH TEXT AND VIDEO */}
      <ScrollSection />

      {/* AI ASSISTANT SECTION */}
      <AIAssistantSection />

      {/* FEATURE GRID SECTION */}
      {/* <FeatureGrid /> */}

      {/* PREMIUM DARK FOOTER */}
      <Footer />
    </main>
  );
}
