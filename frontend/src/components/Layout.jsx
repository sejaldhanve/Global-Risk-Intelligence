import { Link, useLocation } from 'react-router-dom'
import { Globe, LayoutDashboard, Bot, Compass } from 'lucide-react'

export default function Layout({ children }) {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/features', label: 'Features', icon: Compass },
    { path: '/assistant', label: 'AI Assistant', icon: Bot, exact: true }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Global Intel Platform
              </span>
            </div>
            
            <div className="flex space-x-4">
              {navItems.map(({ path, label, icon: Icon, exact }) => {
                const isActive = exact ? location.pathname === path : location.pathname.startsWith(path)
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
