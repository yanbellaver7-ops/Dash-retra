'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { GlowCard } from '@/components/ui/spotlight-card'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = '/brazil-states.geojson'

interface StateData {
  sigla: string
  count: number
  percent: number
}

function interpolateColor(percent: number): string {
  const opacity = 0.15 + (percent / 100) * 0.75
  return `rgba(168, 85, 247, ${opacity.toFixed(2)})`
}

export default function BrazilMap() {
  const [stateData, setStateData] = useState<Record<string, StateData>>({})
  const [tooltip, setTooltip] = useState<{ name: string; sigla: string; count: number; percent: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function fetchSalesByState() {
      const { data } = await supabase
        .from('vendas')
        .select('estado')
        .in('status', ['paid', 'approved'])

      if (!data || data.length === 0) return

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
    }

    fetchSalesByState()
  }, [])

  return (
    <GlowCard className="p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-white/50 font-medium">Vendas por Estado</p>
        {Object.keys(stateData).length > 0 && (
          <p className="text-xs text-white/30">
            {Object.keys(stateData).length} estado{Object.keys(stateData).length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="flex gap-4 items-start">
        <div className="flex-1 relative" style={{ minHeight: 340 }}>
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

          {mounted && (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 750, center: [-54, -15] }}
              style={{ width: '100%', height: '340px' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const sigla = geo.properties.sigla?.toUpperCase() || ''
                    const data = stateData[sigla]
                    const fill = data ? interpolateColor(data.percent) : 'rgba(255,255,255,0.08)'

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth={0.6}
                        style={{
                          default: { outline: 'none', transition: 'fill 0.2s' },
                          hover: { outline: 'none', fill: 'rgba(168,85,247,0.6)', cursor: 'pointer' },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={() =>
                          setTooltip({
                            name: geo.properties.name || sigla,
                            sigla,
                            count: data?.count || 0,
                            percent: data?.percent || 0,
                          })
                        }
                        onMouseLeave={() => setTooltip(null)}
                      />
                    )
                  })
                }
              </Geographies>
            </ComposableMap>
          )}
        </div>

        {Object.keys(stateData).length > 0 && (
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
      </div>
    </GlowCard>
  )
}
