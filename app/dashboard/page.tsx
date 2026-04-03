'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { GlowCard } from '@/components/ui/spotlight-card'
import RevenueChart from '@/components/RevenueChart'
import DailySalesCards from '@/components/DailySalesCards'
import BrazilMap from '@/components/BrazilMap'
import DateFilter, { DateRange } from '@/components/DateFilter'
import { formatBRL } from '@/lib/utils'

interface KPIData {
  receitaTotal: number
  lucro: number
  totalPedidos: number
}

const MARGEM = 0.35

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '' })
  const [kpis, setKpis] = useState<KPIData>({ receitaTotal: 0, lucro: 0, totalPedidos: 0 })

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    async function fetchKPIs() {
      let query = supabase.from('vendas').select('valor').in('status', ['paid', 'approved'])
      if (dateRange.from) query = (query as any).gte('created_at', `${dateRange.from}T00:00:00.000Z`)
      if (dateRange.to)   query = (query as any).lte('created_at', `${dateRange.to}T23:59:59.999Z`)
      const { data } = await query
      if (!data) return
      const receitaTotal = data.reduce((sum, v) => sum + (v.valor || 0), 0)
      setKpis({ receitaTotal, lucro: receitaTotal * MARGEM, totalPedidos: data.length })
    }
    fetchKPIs()
  }, [dateRange])

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <Header />

      <main className="px-4 pt-2 pb-4 flex flex-col gap-2">

        {/* Filtro de data */}
        <div className="flex justify-end">
          <DateFilter value={dateRange} onChange={setDateRange} />
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 380px' }}>

          {/* Row 1 col 1 — KPI Cards */}
          <div className="grid grid-cols-3 gap-4" style={{ gridColumn: '1', gridRow: '1' }}>
            <GlowCard className="p-5" glowColor="duo">
              <p className="text-sm text-white/50 font-medium mb-3">Receita Total</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                {formatBRL(kpis.receitaTotal)}
              </p>
            </GlowCard>
            <GlowCard className="p-5" glowColor="duo">
              <p className="text-sm text-white/50 font-medium mb-3">Lucro</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                {formatBRL(kpis.lucro)}
              </p>
            </GlowCard>
            <GlowCard className="p-5" glowColor="duo">
              <p className="text-sm text-white/50 font-medium mb-3">Total de Pedidos</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                {kpis.totalPedidos}
              </p>
            </GlowCard>
          </div>

          {/* Rows 1-3 col 2 — Mapa */}
          <div style={{ gridColumn: '2', gridRow: '1 / 4' }}>
            <BrazilMap glowColor="duo" accentColor="#A855F7" dateFrom={dateRange.from} dateTo={dateRange.to} />
          </div>

          {/* Row 2 col 1 — Gráfico */}
          <div style={{ gridColumn: '1', gridRow: '2' }}>
            <RevenueChart glowColor="duo" showTotal={false} />
          </div>

          {/* Row 3 col 1 — Cards diários */}
          <div style={{ gridColumn: '1', gridRow: '3' }}>
            <DailySalesCards glowColor="duo" dateFrom={dateRange.from} dateTo={dateRange.to} />
          </div>

        </div>
      </main>
    </div>
  )
}
