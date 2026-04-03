'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { GlowCard } from '@/components/ui/spotlight-card'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = '/brazil-states.geojson'

interface StateData {
  sigla: string
  count: number
  percent: number
}

interface Props {
  productFilter?: string
  accentColor?: string
  glowColor?: 'purple' | 'teal' | 'duo'
  dateFrom?: string
  dateTo?: string
  showMap?: boolean
}

function interpolateColor(percent: number, hue: number): string {
  const opacity = 0.15 + (percent / 100) * 0.75
  return `hsla(${hue}, 75%, 55%, ${opacity.toFixed(2)})`
}

export default function BrazilMap({
  productFilter,
  accentColor = '#A855F7',
  glowColor = 'purple',
  dateFrom,
  dateTo,
  showMap = true,
}: Props) {
  const [stateData, setStateData] = useState<Record<string, StateData>>({})
  const [tooltip, setTooltip] = useState<{ name: string; sigla: string; count: number; percent: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  const hue = glowColor === 'teal' ? 175 : 280
  const hoverFill = glowColor === 'teal' ? 'rgba(20,184,166,0.6)' : 'rgba(168,85,247,0.6)'

  useEffect(() => {
    setMounted(true)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    async function fetchData() {
      let query = supabase
        .from('vendas')
        .select('estado')
        .in('status', ['paid', 'approved'])
      if (productFilter) query = (query as any).ilike('produto_nome', `%${productFilter}%`)
      if (dateFrom) query = (query as any).gte('created_at', `${dateFrom}T00:00:00.000Z`)
      if (dateTo)   query = (query as any).lte('created_at', `${dateTo}T23:59:59.999Z`)
      const { data } = await query
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
    fetchData()
  }, [productFilter, dateFrom, dateTo])

  const top5 = Object.values(stateData).sort((a, b) => b.count - a.count).slice(0, 5)

  return (
    <GlowCard className="p-5 flex flex-col" glowColor={glowColor}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-white/50 font-medium">Vendas por Estado</p>
        {Object.keys(stateData).length > 0 && (
          <p className="text-xs text-white/30">{Object.keys(stateData).length} estados</p>
        )}
      </div>

      {/* Mapa — apenas no Dashboard */}
      {showMap && (
        <div className="relative overflow-hidden rounded-xl mb-4" style={{ height: 260 }}>
          {tooltip && (
            <div
              className="absolute top-2 left-2 z-20 px-3 py-2 rounded-xl text-xs pointer-events-none"
              style={{ background: 'rgba(13,11,26,0.95)', border: `1px solid ${accentColor}4D` }}
            >
              <p className="text-white font-semibold">{tooltip.name} ({tooltip.sigla})</p>
              <p style={{ color: accentColor }}>{tooltip.count} venda{tooltip.count !== 1 ? 's' : ''} — {tooltip.percent}%</p>
            </div>
          )}
          {mounted && (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 980, center: [-54, -15] }}
              style={{ width: '100%', height: '260px' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const sigla = geo.properties.sigla?.toUpperCase() || ''
                    const data = stateData[sigla]
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={data ? interpolateColor(data.percent, hue) : 'rgba(255,255,255,0.08)'}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth={0.6}
                        style={{
                          default: { outline: 'none', transition: 'fill 0.2s' },
                          hover: { outline: 'none', fill: hoverFill, cursor: 'pointer' },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={() => setTooltip({ name: geo.properties.name || sigla, sigla, count: data?.count || 0, percent: data?.percent || 0 })}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    )
                  })
                }
              </Geographies>
            </ComposableMap>
          )}
        </div>
      )}

      {/* Lista de estados */}
      <div className="flex flex-col gap-3">
        {top5.length === 0 ? (
          <p className="text-xs text-white/20">Sem dados ainda.</p>
        ) : (
          top5.map((s, i) => (
            <div key={s.sigla} className="flex items-center gap-2">
              <span className="text-xs text-white/20 w-3 shrink-0">{i + 1}</span>
              <span className="text-xs text-white/70 font-semibold w-6 shrink-0">{s.sigla}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${s.percent}%`, background: `linear-gradient(90deg, ${accentColor}88, ${accentColor})` }}
                />
              </div>
              <span className="text-xs font-bold w-9 text-right shrink-0" style={{ color: accentColor }}>
                {s.percent}%
              </span>
            </div>
          ))
        )}
      </div>
    </GlowCard>
  )
}
