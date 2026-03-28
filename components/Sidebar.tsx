'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

const menuItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Vendas', href: '/vendas' },
  { label: 'Produtos', href: '#' },
  { label: 'Clientes', href: '#' },
  { label: 'Relatórios', href: '#' },
  { label: 'Configurações', href: '#' },
] as const

export default function Sidebar() {
  const pathname = usePathname()
  const { dark, setDark } = useTheme()

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
        <img src="/logo-opta.png" alt="Opta" className="h-8 w-auto object-contain" style={{ mixBlendMode: 'lighten', filter: 'brightness(0) invert(1)' }} />
      </div>

      {/* Menu items */}
      <div className="flex items-center gap-1 flex-1 justify-center">
        {menuItems.map(({ label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                active ? 'text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
              style={active ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' } : {}}
            >
              {label}
            </Link>
          )
        })}
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
