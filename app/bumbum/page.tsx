'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import KPICard from '@/components/KPICard'
import RevenueChart from '@/components/RevenueChart'
import MonthlyRevenue from '@/components/MonthlyRevenue'
import StatesSales from '@/components/StatesSales'
import DailySalesCards from '@/components/DailySalesCards'
import BrazilMap from '@/components/BrazilMap'
import DateFilter, { DateRange } from '@/components/DateFilter'
import { mockTransactions } from '@/lib/mock-data'
import { formatBRL } from '@/lib/utils'

interface KPIData {
  receitaTotal: number
  ticketMedio: number
  totalPedidos: number
}

const bumbumStatesSales = [
  { uf: 'SP', nome: 'São Paulo',           valor: 0, percentual: 0, color: '#14B8A6' },
  { uf: 'SC', nome: 'Santa Catarina',      valor: 0, percentual: 0, color: '#14B8A6' },
  { uf: 'RJ', nome: 'Rio de Janeiro',      valor: 0, percentual: 0, color: '#14B8A6' },
  { uf: 'MG', nome: 'Minas Gerais',        valor: 0, percentual: 0, color: '#14B8A6' },
  { uf: 'RS', nome: 'Rio Grande do Sul',   valor: 0, percentual: 0, color: '#14B8A6' },
  { uf: 'PR', nome: 'Paraná',              valor: 0, percentual: 0, color: '#14B8A6' },
]

export default function BumbumPage() {
  const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '' })
  const [kpis, setKpis] = useState<KPIData>({ receitaTotal: 0, ticketMedio: 0, totalPedidos: 0 })

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    async function fetchKPIs() {
      let query = supabase
        .from('vendas')
        .select('valor')
        .in('status', ['paid', 'approved'])
        .ilike('produto_nome', '%bumbum%')
      if (dateRange.from) query = (query as any).gte('created_at', `${dateRange.from}T00:00:00.000Z`)
      if (dateRange.to)   query = (query as any).lte('created_at', `${dateRange.to}T23:59:59.999Z`)
      const { data } = await query
      if (!data) return
      const receitaTotal = data.reduce((sum, v) => sum + (v.valor || 0), 0)
      const totalPedidos = data.length
      const ticketMedio = totalPedidos > 0 ? receitaTotal / totalPedidos : 0
      setKpis({ receitaTotal, ticketMedio, totalPedidos })
    }
    fetchKPIs()
  }, [dateRange])

  const kpiCards = [
    { label: 'Receita Total',    value: formatBRL(kpis.receitaTotal), change: 0, positive: true },
    { label: 'Ticket Médio',     value: formatBRL(kpis.ticketMedio),  change: 0, positive: true },
    { label: 'Total de Pedidos', value: String(kpis.totalPedidos),    change: 0, positive: true },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <Header />

      <main className="px-4 pt-2 pb-4 flex flex-col gap-2">

        {/* Filtro de data */}
        <div className="flex justify-end">
          <DateFilter value={dateRange} onChange={setDateRange} />
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 288px' }}>

          {/* Row 1 col 1 — KPI Cards */}
          <div className="grid grid-cols-3 gap-4" style={{ gridColumn: '1', gridRow: '1' }}>
            {kpiCards.map((kpi) => (
              <KPICard key={kpi.label} {...kpi} glowColor="teal" />
            ))}
          </div>

          {/* Row 2 col 1 — RevenueChart */}
          <div style={{ gridColumn: '1', gridRow: '2' }}>
            <RevenueChart glowColor="teal" showTotal={false} />
          </div>

          {/* Col 2 rows 1-2 — Card produto */}
          <div
            className="rounded-2xl flex items-center justify-center p-4"
            style={{
              gridColumn: '2',
              gridRow: '1 / 3',
              border: '1px solid rgba(20,184,166,0.15)',
              background: 'rgba(20,184,166,0.03)',
            }}
          >
            <p className="text-xs text-white/20">Foto em breve</p>
          </div>

          {/* Row 3 col 1 — Daily Sales Cards */}
          <div style={{ gridColumn: '1', gridRow: '3' }}>
            <DailySalesCards productFilter="bumbum" glowColor="teal" dateFrom={dateRange.from} dateTo={dateRange.to} />
          </div>

          {/* Row 3 col 2 — MonthlyRevenue */}
          <div style={{ gridColumn: '2', gridRow: '3' }}>
            <MonthlyRevenue transactions={mockTransactions} glowColor="teal" />
          </div>

          {/* Row 4 col 1 — Brazil Map */}
          <div style={{ gridColumn: '1', gridRow: '4' }}>
            <BrazilMap productFilter="bumbum" accentColor="#14B8A6" glowColor="teal" dateFrom={dateRange.from} dateTo={dateRange.to} showMap={false} />
          </div>

          {/* Row 4 col 2 — StatesSales */}
          <div style={{ gridColumn: '2', gridRow: '4' }}>
            <StatesSales states={bumbumStatesSales} />
          </div>

        </div>
      </main>
    </div>
  )
}
