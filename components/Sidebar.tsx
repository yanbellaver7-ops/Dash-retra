'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const menuItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Vendas', href: '/vendas', badge: 4 },
  { label: 'Produtos', href: '#' },
  { label: 'Clientes', href: '#' },
  { label: 'Relatórios', href: '#' },
  { label: 'Configurações', href: '#' },
]

export default function Sidebar() {
  const pathname = usePathname()

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
        {menuItems.map(({ label, href, badge }) => {
          const active = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                active ? 'text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
              style={active ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' } : {}}
            >
              {label}
              {badge && (
                <span className="text-xs bg-white/15 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
