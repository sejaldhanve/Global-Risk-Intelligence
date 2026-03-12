import Header from "@/components/ui/header";
import Link from "next/link";
import { FeatureGrid } from "@/components/landing/FeatureGrid";

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
      <Header />

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

      {/* FEATURE GRID SECTION */}
      <FeatureGrid />
    </main>
  );
}
