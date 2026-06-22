// src/presentation/components/shared/Layout/AppLayout.tsx
import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Building2, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth, useLogout } from '@/core/auth'
import { Button } from '@/presentation/components/ui/button'
import logo from '@/assets/logo.png'

const navItems = [
  { to: '/scenarios', label: 'Escenarios', icon: LayoutDashboard },
  { to: '/accounts', label: 'Cuentas', icon: BookOpen },
  { to: '/cost-centers', label: 'Centros de Costo', icon: Building2 },
]

export function AppLayout() {
  const { user } = useAuth()
  const logout = useLogout()

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-56 border-r flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-4 border-b">
          <img src={logo} alt="Aguas Perlitas" className="h-10 object-contain" />
        </div>

        {/* Navegación */}
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

        {/* Usuario + Cerrar sesión */}
        <div className="p-3 border-t space-y-2">
          {user && (
            <div className="flex items-center gap-2 px-1 min-w-0">
              <User className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground truncate">{user.fullName}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
