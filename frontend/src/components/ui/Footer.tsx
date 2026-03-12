import Link from "next/link";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#050510] border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#fca311]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="GRI Logo" className="h-16 md:h-20 w-auto max-w-[200px] object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The World as a Living Intelligence Map. Track geopolitical events, regional conflicts, and systemic impacts through an interactive global platform.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#fca311] hover:border-[#fca311]/50 hover:bg-[#fca311]/10 transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#fca311] hover:border-[#fca311]/50 hover:bg-[#fca311]/10 transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#fca311] hover:border-[#fca311]/50 hover:bg-[#fca311]/10 transition-all duration-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#fca311] hover:border-[#fca311]/50 hover:bg-[#fca311]/10 transition-all duration-300">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-white font-semibold mb-6">Platform</h3>
            <ul className="space-y-4">
              <li><Link href="/dashboard" className="text-gray-400 hover:text-[#fca311] transition-colors text-sm">Dashboard</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#fca311] transition-colors text-sm">AI Assistant</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#fca311] transition-colors text-sm">Live Intelligence</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#fca311] transition-colors text-sm">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-gray-400 hover:text-[#fca311] transition-colors text-sm">About Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#fca311] transition-colors text-sm">Careers</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#fca311] transition-colors text-sm">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#fca311] transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-gray-400 hover:text-[#fca311] transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#fca311] transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#fca311] transition-colors text-sm">Cookie Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#fca311] transition-colors text-sm">Security</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Global Risk Intelligence. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
