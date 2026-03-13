import { Link, useLocation } from 'react-router-dom'
import { Globe, LayoutDashboard, Bot, Compass } from 'lucide-react'

export default function Layout({ children }) {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: false },
    { path: '/features', label: 'Features', icon: Compass },
    { path: '/assistant', label: 'AI Assistant', icon: Bot, exact: true }
  ]

  // If on the landing page, render without the white layout and padded container
  if (location.pathname === '/') {
    return <div className="min-h-screen bg-black">{children}</div>
  }

  return (
    <div className="min-h-screen bg-[#050510] text-gray-100 relative overflow-x-hidden">
      {/* Global Dynamic Background elements for a premium feel */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#fca311] opacity-[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-150px] w-[600px] h-[600px] bg-red-600 opacity-[0.02] rounded-full blur-[120px] pointer-events-none" />

      <nav className="bg-[#050510]/80 backdrop-blur-md shadow-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link to="/dashboard" className="flex items-center relative group">
              <div className="absolute inset-0 bg-white/60 blur-2xl rounded-full scale-[1.5] z-0 pointer-events-none transition-all duration-300 group-hover:bg-[#fca311]/40 group-hover:scale-[1.8]"></div>
              <img src="/images/logo.png" alt="Global Risk Intelligence" className="h-10 w-auto object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)] relative z-10 transition-transform duration-300 group-hover:scale-105" />
            </Link>
            
            <div className="flex space-x-4 items-center">
              {navItems.map(({ path, label, icon: Icon, exact }) => {
                const isActive = exact ? location.pathname === path : location.pathname.startsWith(path)
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 relative group ${
                      isActive ? 'bg-white/10 text-[#fca311]' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {!isActive && (
                      <div className="absolute inset-0 bg-white/5 rounded-md scale-95 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"></div>
                    )}
                    <Icon className="h-5 w-5 mr-2 relative z-10" />
                    <span className="relative z-10">{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      <main 
        key={location.pathname} 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative z-10"
      >
        {children}
      </main>
    </div>
  )
}
