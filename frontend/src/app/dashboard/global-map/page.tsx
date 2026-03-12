"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#181715]">
      <div className="text-[#E96013] font-bold">Loading Map Intelligence...</div>
    </div>
  ),
});

export default function GlobalMapPage() {
  return (
    <div className="w-full h-full relative z-0">
      <Map />
    </div>
  );
}
