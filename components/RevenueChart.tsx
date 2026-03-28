'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { mockChartData, mockWeeklyData } from '@/lib/mock-data'
import { formatBRL } from '@/lib/utils'
import { GlowCard } from '@/components/ui/spotlight-card'

const periods = ['Semanal', 'Mensal', 'Anual']

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl p-3 text-sm"
      style={{
        background: 'rgba(13,11,26,0.95)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <p className="text-white/60 mb-2 font-medium">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-white/70">
            {entry.name === 'receita' ? 'Receita: ' : 'Pedidos: '}
          </span>
          <span className="text-white font-semibold font-mono">
            {entry.name === 'receita' ? formatBRL(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function RevenueChart() {
  const [period, setPeriod] = useState('Mensal')
  const data = period === 'Semanal' ? mockWeeklyData : mockChartData
  const xKey = period === 'Semanal' ? 'day' : 'month'

  return (
    <GlowCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-white/50">Receita Total</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className="text-3xl font-bold gradient-purple-text"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              R$ 0,00
            </span>
            <span
              className="text-sm font-semibold px-2 py-0.5 rounded-full"
              style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.08)' }}
            >
              +0%
            </span>
          </div>
        </div>

        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                period === p
                  ? { background: 'rgba(255,255,255,0.12)', color: 'white' }
                  : { color: 'rgba(255,255,255,0.4)' }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="receita"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: 'white', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="pedidos"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={2}
            dot={false}
            strokeDasharray="4 4"
            activeDot={{ r: 4, fill: 'rgba(255,255,255,0.6)', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </GlowCard>
  )
}
