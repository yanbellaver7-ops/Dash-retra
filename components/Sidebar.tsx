'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

const menuItems = [
  { label: 'Dashboard',    href: '/dashboard' },
  { label: 'Retra',        href: '/' },
  { label: 'Bumbum',       href: '/bumbum' },
  { label: 'Vendas',       href: '/vendas' },
  { label: 'Estoque',      href: '/estoque' },
  { label: 'Clientes',     href: '#' },
  { label: 'Relatórios',   href: '#' },
  { label: 'Chamados',     href: '/chamados' },
  { label: 'Configurações',href: '#' },
]

const pageTheme: Record<string, { dark: string; light: string; border: string }> = {
  '/dashboard': {
    dark:  'linear-gradient(90deg, rgba(124,58,237,0.15) 0%, rgba(13,148,136,0.12) 60%, transparent 100%)',
    light: 'linear-gradient(90deg, #7C3AED 0%, #5b21b6 45%, #0D9488 100%)',
    border: 'rgba(100,60,180,0.3)',
  },
  '/': {
    dark:  'linear-gradient(90deg, rgba(124,58,237,0.18) 0%, rgba(168,85,247,0.08) 60%, transparent 100%)',
    light: 'linear-gradient(90deg, #7C3AED, #A855F7)',
    border: 'rgba(124,58,237,0.25)',
  },
  '/bumbum': {
    dark:  'linear-gradient(90deg, rgba(13,148,136,0.18) 0%, rgba(20,184,166,0.08) 60%, transparent 100%)',
    light: 'linear-gradient(90deg, #0D9488, #14B8A6)',
    border: 'rgba(13,148,136,0.25)',
  },
}

export default function Sidebar() {
  const pathname = usePathname()
  const { dark, setDark } = useTheme()

  const theme = pageTheme[pathname] ?? {
    dark:  'rgba(255,255,255,0.02)',
    light: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.06)',
  }

  return (
    <nav
      className="flex items-center gap-2 px-6 py-3 w-full"
      style={{
        background: dark ? theme.dark : theme.light,
        borderBottom: `1px solid ${theme.border}`,
        transition: 'background 0.4s ease',
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
