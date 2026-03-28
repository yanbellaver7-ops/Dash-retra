'use client'

import { useState } from 'react'

const menuItems = [
  { label: 'Dashboard', active: true },
  { label: 'Vendas', badge: 4 },
  { label: 'Produtos' },
  { label: 'Clientes' },
  { label: 'Relatórios' },
  { label: 'Configurações' },
]

export default function Sidebar() {
  const [dark, setDark] = useState(true)

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
        {menuItems.map(({ label, active, badge }) => (
          <button
            key={label}
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
          </button>
        ))}
      </div>

      {/* Right side: theme toggle + CTA */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center rounded-lg p-0.5"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={() => setDark(false)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              !dark ? 'bg-white text-gray-900' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setDark(true)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              dark ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Dark
          </button>
        </div>

        <button
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
        >
          ✦ Powered by IA
        </button>
      </div>
    </nav>
  )
}
