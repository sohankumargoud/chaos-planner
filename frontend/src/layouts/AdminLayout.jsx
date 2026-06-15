import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/ui/Button'
import { ThemeToggle } from '../components/ui/ThemeToggle'

const navItems = [
  { label: 'Dashboard', icon: '⚡', path: '/admin/dashboard' },
  { label: 'Events', icon: '📅', path: '/admin/events' },
  { label: 'Registrations', icon: '📝', path: '/admin/registrations' },
  { label: 'Volunteer Shifts', icon: '🧑‍🤝‍🧑', path: '/admin/shifts' },
  { label: 'Rooms & Conflicts', icon: '🏛️', path: '/admin/rooms' },
  { label: 'QR Check-In', icon: '📷', path: '/admin/checkin' },
  { label: 'Announcements', icon: '📣', path: '/admin/announcements' },
  { label: 'Analytics', icon: '📊', path: '/admin/analytics' },
  { label: 'Profile Settings', icon: 'manage_accounts', path: '/admin/profile' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'

  return (
    <div className="flex min-h-screen bg-surface-container-lowest text-on-surface">
      {/* Sidebar */}
      <aside className="w-sidebar-width bg-surface-container-lowest border-r border-outline-variant flex flex-col fixed top-0 left-0 bottom-0 z-50 overflow-y-auto">
        <div className="p-5 border-b border-outline-variant">
          <h1 className="font-display text-headline-sm font-bold text-primary">⚡ Chaos Planner</h1>
          <span className="block text-[11px] font-semibold text-secondary uppercase tracking-widest mt-1">Admin Control Room</span>
        </div>

        <nav className="p-3 flex-1">
          <div className="text-[11px] font-bold text-outline uppercase tracking-widest px-3 py-2">Operations</div>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium transition-colors mb-0.5 ${
                  isActive 
                    ? 'bg-primary-container text-on-primary-container font-semibold' 
                    : 'text-secondary hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              {item.icon.length > 2 ? (
                 <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              ) : (
                 <span className="text-[16px] w-5 text-center">{item.icon}</span>
              )}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant">
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg mb-3 border border-outline-variant/50">
            <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <div className="text-body-sm font-semibold text-on-surface truncate">{user?.fullName || 'Admin'}</div>
              <div className="text-[11px] text-secondary truncate">Administrator</div>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-center border border-outline-variant">
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-sidebar-width flex-1 flex flex-col min-h-screen">
        <header className="h-header-height bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="font-headline-sm text-on-surface">Command Center</h2>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">
              notifications
            </button>
          </div>
        </header>
        <div className="p-8 flex-1 bg-surface-container-lowest">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
