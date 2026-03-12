import Sidebar from "@/components/ui/sidebar";
import AIAssistantWidget from "@/components/ui/ai-assistant-widget";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#22211F] overflow-hidden text-white font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <AIAssistantWidget />
    </div>
  );
}
