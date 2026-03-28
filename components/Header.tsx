'use client'

export default function Header() {
  return (
    <header
      className="flex items-center gap-4 px-6 py-4"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-white">Dashboard de Vendas</h1>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl w-64"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <input
          className="bg-transparent text-sm text-white/70 placeholder-white/30 outline-none flex-1"
          placeholder="Buscar..."
        />
        <span className="text-xs text-white/20 font-mono">⌘F</span>
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          SJ
        </div>
        <div>
          <p className="text-sm font-medium text-white leading-tight">Samuel Jr</p>
          <p className="text-xs text-white/40">@samjrw</p>
        </div>
      </div>
    </header>
  )
}
