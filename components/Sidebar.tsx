'use client'

import { usePathname } from 'next/navigation'
import { Eye, EyeOff, LayoutDashboard, ShoppingCart, Package, Users, BarChart2, Settings } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { MenuBar } from '@/components/ui/glow-menu'

const PURPLE_GRADIENT = 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(124,58,237,0.10) 50%, rgba(109,40,217,0) 100%)'
const PURPLE_ICON = 'text-purple-400'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard',     href: '/',             gradient: PURPLE_GRADIENT, iconColor: PURPLE_ICON },
  { icon: ShoppingCart,    label: 'Vendas',         href: '/vendas',       gradient: PURPLE_GRADIENT, iconColor: PURPLE_ICON },
  { icon: Package,         label: 'Estoque',        href: '/estoque',      gradient: PURPLE_GRADIENT, iconColor: PURPLE_ICON },
  { icon: Users,           label: 'Clientes',       href: '#',             gradient: PURPLE_GRADIENT, iconColor: PURPLE_ICON },
  { icon: BarChart2,       label: 'Relatórios',     href: '#',             gradient: PURPLE_GRADIENT, iconColor: PURPLE_ICON },
  { icon: Settings,        label: 'Configurações',  href: '#',             gradient: PURPLE_GRADIENT, iconColor: PURPLE_ICON },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { dark, setDark } = useTheme()

  const activeLabel = menuItems.find((m) => m.href === pathname)?.label ?? 'Dashboard'

  return (
    <nav
      className="flex items-center gap-2 px-6 py-3 w-full"
      style={{
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center mr-8 ml-6">
        <img
          src="/logo-opta.png"
          alt="Opta"
          className="h-8 w-auto object-contain"
          style={{ mixBlendMode: 'lighten', filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* Menu */}
      <div className="flex-1 flex justify-center">
        <MenuBar items={menuItems} activeItem={activeLabel} />
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:bg-white/10"
        style={{ color: 'rgba(255,255,255,0.5)' }}
        title={dark ? 'Modo claro' : 'Modo escuro'}
      >
        {dark ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </nav>
  )
}
