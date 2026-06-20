import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Building2, FileSpreadsheet } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/scenarios', label: 'Escenarios', icon: LayoutDashboard },
  { to: '/accounts', label: 'Cuentas', icon: BookOpen },
  { to: '/cost-centers', label: 'Centros de Costo', icon: Building2 },
]

export function AppLayout() {
  return (
    <div className="flex h-screen bg-background">
      <aside className="w-56 border-r flex flex-col">
        <div className="h-14 flex items-center px-4 border-b">
          <FileSpreadsheet className="h-5 w-5 mr-2 text-primary" />
          <span className="font-semibold text-sm">Perlitas</span>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
