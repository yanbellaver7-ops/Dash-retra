'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { GlowCard } from '@/components/ui/spotlight-card'
import { formatBRL } from '@/lib/utils'

interface DailyData {
  vendasPeriodo: number
  receitaPeriodo: number
  mediaDiaria: number
  pendentesPeriodo: number
  valorPendentePeriodo: number
}

interface Props {
  productFilter?: string
  glowColor?: 'purple' | 'teal' | 'duo'
  dateFrom?: string
  dateTo?: string
}

function startOfDay(dateStr: string) {
  return `${dateStr}T00:00:00.000Z`
}
function endOfDay(dateStr: string) {
  return `${dateStr}T23:59:59.999Z`
}
function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function DailySalesCards({ productFilter, glowColor = 'purple', dateFrom, dateTo }: Props) {
  const [data, setData] = useState<DailyData | null>(null)
  const [loading, setLoading] = useState(true)

  const from = dateFrom || todayStr()
  const to = dateTo || todayStr()
  const isToday = from === todayStr() && to === todayStr() && !dateFrom

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function fetchData() {
      setLoading(true)

      const applyFilters = (q: any) => {
        if (dateFrom) q = q.gte('created_at', startOfDay(from))
        if (dateTo)   q = q.lte('created_at', endOfDay(to))
        else if (!dateFrom) {
          q = q.gte('created_at', startOfDay(todayStr())).lte('created_at', endOfDay(todayStr()))
        }
        if (productFilter) q = q.ilike('produto_nome', `%${productFilter}%`)
        return q
      }

      let qAprovadas = applyFilters(
        supabase.from('vendas').select('valor, status').in('status', ['paid', 'approved'])
      )
      const { data: aprovadas } = await qAprovadas

      let qPendentes = applyFilters(
        supabase.from('vendas').select('valor, status').in('status', ['pending', 'cancelled', 'refused', 'chargeback'])
      )
      const { data: pendentes } = await qPendentes

      // Média diária: total aprovado / número de dias distintos no período
      let qTodas = supabase.from('vendas').select('valor, created_at').in('status', ['paid', 'approved'])
      if (productFilter) qTodas = (qTodas as any).ilike('produto_nome', `%${productFilter}%`)
      if (dateFrom) qTodas = (qTodas as any).gte('created_at', startOfDay(from))
      if (dateTo)   qTodas = (qTodas as any).lte('created_at', endOfDay(to))
      const { data: todasVendas } = await qTodas

      let mediaDiaria = 0
      if (todasVendas && todasVendas.length > 0) {
        const totalGeral = todasVendas.reduce((sum, v) => sum + (v.valor || 0), 0)
        const datas = new Set(todasVendas.map(v => v.created_at?.slice(0, 10)))
        mediaDiaria = totalGeral / Math.max(datas.size, 1)
      }

      setData({
        vendasPeriodo: aprovadas?.length || 0,
        receitaPeriodo: aprovadas?.reduce((s: number, v: any) => s + (v.valor || 0), 0) || 0,
        mediaDiaria,
        pendentesPeriodo: pendentes?.length || 0,
        valorPendentePeriodo: pendentes?.reduce((s: number, v: any) => s + (v.valor || 0), 0) || 0,
      })
      setLoading(false)
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [productFilter, dateFrom, dateTo])

  const label1 = isToday ? 'Vendas do Dia' : 'Vendas no Período'
  const label3 = isToday ? 'Pendentes do Dia' : 'Pendentes'

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <GlowCard key={i} className="p-5 animate-pulse" glowColor={glowColor}>
            <div className="h-3 bg-white/10 rounded w-32 mb-3" />
            <div className="h-7 bg-white/10 rounded w-24 mb-2" />
          </GlowCard>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-3">

      <GlowCard className="p-3" glowColor={glowColor}>
        <p className="text-xs text-white/50 font-medium mb-1.5">{label1}</p>
        <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
          {data?.vendasPeriodo ?? 0}
        </p>
      </GlowCard>

      <GlowCard className="p-3" glowColor={glowColor}>
        <p className="text-xs text-white/50 font-medium mb-1.5">Média Diária</p>
        <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
          {formatBRL(data?.mediaDiaria ?? 0)}
        </p>
      </GlowCard>

      <GlowCard className="p-3" glowColor={glowColor}>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-white/50 font-medium">{label3}</p>
          {(data?.pendentesPeriodo ?? 0) > 0 && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
              {data?.pendentesPeriodo}
            </span>
          )}
        </div>
        <p
          className="text-xl font-bold"
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            color: (data?.pendentesPeriodo ?? 0) > 0 ? '#fbbf24' : 'rgba(255,255,255,0.9)',
          }}
        >
          {formatBRL(data?.valorPendentePeriodo ?? 0)}
        </p>
      </GlowCard>

    </div>
  )
}
