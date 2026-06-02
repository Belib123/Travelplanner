'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  MapPin,
  Star,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      label: 'Destinations',
      href: '/admin/destinations',
      icon: MapPin,
    },
    {
      label: 'Reviews & Ratings',
      href: '/admin/reviews',
      icon: Star,
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: TrendingUp,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ]

  return (
    <div
      className={`${
        open ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-teal-700 to-teal-800 text-white transition-all duration-300 flex flex-col border-r border-teal-900`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-teal-600">
        {open && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-600 rounded-lg">
              <LayoutDashboard size={20} />
            </div>
            <span className="font-bold text-lg">Admin</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 hover:bg-teal-600 rounded-lg transition-colors ml-auto"
        >
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'text-teal-100 hover:bg-teal-600 hover:text-white'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {open && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {open && (
        <div className="p-4 border-t border-teal-600 text-teal-100 text-xs">
          <p>Travel Planner Admin</p>
          <p>v1.0.0</p>
        </div>
      )}
    </div>
  )
}
