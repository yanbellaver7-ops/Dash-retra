'use client'

import { formatBRL } from '@/lib/utils'
import { GlowCard } from '@/components/ui/spotlight-card'

interface StateSale {
  uf: string
  nome: string
  valor: number
  percentual: number
  color: string
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="w-9 h-9 rounded-lg bg-white/10" />
          <div className="flex-1">
            <div className="h-3 bg-white/10 rounded w-2/3 mb-2" />
            <div className="h-2 bg-white/10 rounded w-full" />
          </div>
          <div className="h-3 bg-white/10 rounded w-16" />
        </div>
      ))}
    </div>
  )
}

export default function StatesSales({
  states,
  loading = false,
}: {
  states: StateSale[]
  loading?: boolean
}) {
  return (
    <GlowCard className="p-5 flex-1">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-white">Vendas por Estado</p>
        <button className="text-white/30 hover:text-white/60">
          <span className="text-lg leading-none">···</span>
        </button>
      </div>

      {loading ? (
        <Skeleton />
      ) : (
        <div className="flex flex-col gap-4">
          {states.map((s) => (
            <div key={s.uf}>
              <div className="flex items-center gap-3 mb-1.5">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: `${s.color}22`, border: `1px solid ${s.color}44` }}
                >
                  {s.uf}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-white/80 font-medium truncate">{s.nome}</p>
                    <p
                      className="text-xs font-semibold ml-2 shrink-0"
                      style={{ fontFamily: 'var(--font-geist-mono), monospace', color: s.color }}
                    >
                      {formatBRL(s.valor)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 h-1.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.07)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${s.percentual}%`, background: s.color }}
                      />
                    </div>
                    <span className="text-xs text-white/40 w-9 text-right shrink-0">
                      {s.percentual}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlowCard>
  )
}
