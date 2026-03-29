'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@supabase/supabase-js'
import { GlowCard } from '@/components/ui/spotlight-card'

const BrazilMapInner = dynamic(() => import('@/components/BrazilMapInner'), { ssr: false })

interface StateData {
  sigla: string
  count: number
  percent: number
}

export default function BrazilMap() {
  const [stateData, setStateData] = useState<Record<string, StateData>>({})
  const [tooltip, setTooltip] = useState<{ name: string; sigla: string; count: number; percent: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function fetchSalesByState() {
      const { data } = await supabase
        .from('vendas')
        .select('estado')
        .in('status', ['paid', 'approved'])

      if (!data || data.length === 0) { setLoading(false); return }

      const total = data.length
      const counts: Record<string, number> = {}
      data.forEach(({ estado }) => {
        if (estado) counts[estado.toUpperCase()] = (counts[estado.toUpperCase()] || 0) + 1
      })

      const result: Record<string, StateData> = {}
      Object.entries(counts).forEach(([sigla, count]) => {
        result[sigla] = { sigla, count, percent: Math.round((count / total) * 100) }
      })

      setStateData(result)
      setLoading(false)
    }

    fetchSalesByState()
  }, [])

  return (
    <GlowCard className="p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-white/50 font-medium">Vendas por Estado</p>
        {!loading && Object.keys(stateData).length > 0 && (
          <p className="text-xs text-white/30">
            {Object.keys(stateData).length} estado{Object.keys(stateData).length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="flex gap-4 items-start">
        {/* Mapa */}
        <div className="flex-1 relative" style={{ minHeight: 280 }}>
          {tooltip && (
            <div
              className="absolute top-2 left-2 z-20 px-3 py-2 rounded-xl text-xs pointer-events-none"
              style={{
                background: 'rgba(13,11,26,0.95)',
                border: '1px solid rgba(168,85,247,0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p className="text-white font-semibold">{tooltip.name} ({tooltip.sigla})</p>
              <p style={{ color: '#A855F7' }}>
                {tooltip.count} venda{tooltip.count !== 1 ? 's' : ''} — {tooltip.percent}%
              </p>
            </div>
          )}

          {loading ? (
            <div className="w-full h-[280px] rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ) : (
            <BrazilMapInner stateData={stateData} onHover={setTooltip} />
          )}
        </div>

        {/* Ranking lateral */}
        {!loading && Object.keys(stateData).length > 0 && (
          <div className="flex flex-col gap-1.5 min-w-[120px]">
            <p className="text-xs text-white/30 mb-1 uppercase tracking-wider">Top estados</p>
            {Object.values(stateData)
              .sort((a, b) => b.count - a.count)
              .slice(0, 8)
              .map((s) => (
                <div key={s.sigla} className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.percent}%`, background: 'linear-gradient(90deg, #7C3AED, #A855F7)' }}
                    />
                  </div>
                  <span className="text-xs text-white/60 font-medium w-7">{s.sigla}</span>
                  <span className="text-xs text-white/40">{s.percent}%</span>
                </div>
              ))}
          </div>
        )}

        {!loading && Object.keys(stateData).length === 0 && (
          <p className="text-xs text-white/30 py-8 text-center w-full">Nenhuma venda registrada ainda.</p>
        )}
      </div>
    </GlowCard>
  )
}
