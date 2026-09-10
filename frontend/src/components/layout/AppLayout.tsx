import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutDashboard,
  Upload,
  FileBarChart,
  Users,
  Search,
  GitCompare,
  LogOut,
  Activity,
  ChevronRight,
  User,
} from 'lucide-react'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

const athleteNav: NavItem[] = [
  { label: 'Dashboard', to: '/athlete/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Upload Video', to: '/athlete/upload', icon: <Upload size={18} /> },
  { label: 'My Reports', to: '/athlete/reports', icon: <FileBarChart size={18} /> },
]

const coachNav: NavItem[] = [
  { label: 'Dashboard', to: '/coach/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Search Athletes', to: '/coach/athletes', icon: <Search size={18} /> },
  { label: 'Compare Players', to: '/coach/compare', icon: <GitCompare size={18} /> },
]

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const navItems = user?.role === 'ATHLETE' ? athleteNav : coachNav

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleLabel = user?.role === 'ATHLETE' ? 'Athlete' : 'Coach'

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Activity size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">AthleteIQ</span>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-indigo-50">
            <div className="w-9 h-9 rounded-full bg-indigo-200 flex items-center justify-center shrink-0">
              <User size={16} className="text-indigo-700" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-indigo-600">{roleLabel}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="nav-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-gray-900">AthleteIQ</span>
            <ChevronRight size={14} />
            <span>{roleLabel} Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Hello, <strong>{user?.name?.split(' ')[0]}</strong></span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <User size={14} className="text-indigo-600" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
