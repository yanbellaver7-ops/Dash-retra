'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { GlowCard } from '@/components/ui/spotlight-card'
import { formatBRL } from '@/lib/utils'

interface DailyData {
  vendasDia: number
  receitaDia: number
  mediaDiaria: number
  pendentesDia: number
  valorPendenteDia: number
}

function getStartOfDay() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function getEndOfDay() {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.toISOString()
}

export default function DailySalesCards() {
  const [data, setData] = useState<DailyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function fetchData() {
      const startOfDay = getStartOfDay()
      const endOfDay = getEndOfDay()

      // Vendas aprovadas do dia
      const { data: vendasHoje } = await supabase
        .from('vendas')
        .select('valor, status')
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .in('status', ['paid', 'approved'])

      // Pendentes do dia (pix não pago + cartão recusado)
      const { data: pendentesHoje } = await supabase
        .from('vendas')
        .select('valor, status')
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .in('status', ['pending', 'cancelled', 'refused', 'chargeback'])

      // Todas as vendas aprovadas (para média diária)
      const { data: todasVendas } = await supabase
        .from('vendas')
        .select('valor, created_at')
        .in('status', ['paid', 'approved'])

      // Calcula média diária
      let mediaDiaria = 0
      if (todasVendas && todasVendas.length > 0) {
        const totalGeral = todasVendas.reduce((sum, v) => sum + (v.valor || 0), 0)
        const datas = new Set(todasVendas.map(v => v.created_at?.slice(0, 10)))
        const diasAtivos = Math.max(datas.size, 1)
        mediaDiaria = totalGeral / diasAtivos
      }

      const vendasDia = vendasHoje?.length || 0
      const receitaDia = vendasHoje?.reduce((sum, v) => sum + (v.valor || 0), 0) || 0
      const pendentesDia = pendentesHoje?.length || 0
      const valorPendenteDia = pendentesHoje?.reduce((sum, v) => sum + (v.valor || 0), 0) || 0

      setData({ vendasDia, receitaDia, mediaDiaria, pendentesDia, valorPendenteDia })
      setLoading(false)
    }

    fetchData()

    // Atualiza a cada 60 segundos
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <GlowCard key={i} className="p-5 animate-pulse">
            <div className="h-3 bg-white/10 rounded w-32 mb-3" />
            <div className="h-7 bg-white/10 rounded w-24 mb-2" />
            <div className="h-3 bg-white/10 rounded w-20" />
          </GlowCard>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-3">

      {/* Vendas do Dia */}
      <GlowCard className="p-3">
        <p className="text-xs text-white/50 font-medium mb-1.5">Vendas do Dia</p>
        <p
          className="text-xl font-bold text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {data?.vendasDia ?? 0}
        </p>
      </GlowCard>

      {/* Média de Vendas Diária */}
      <GlowCard className="p-3">
        <p className="text-xs text-white/50 font-medium mb-1.5">Média Diária</p>
        <p
          className="text-xl font-bold text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {formatBRL(data?.mediaDiaria ?? 0)}
        </p>
      </GlowCard>

      {/* Vendas Pendentes do Dia */}
      <GlowCard className="p-3">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-white/50 font-medium">Pendentes do Dia</p>
          {(data?.pendentesDia ?? 0) > 0 && (
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
            >
              {data?.pendentesDia}
            </span>
          )}
        </div>
        <p
          className="text-xl font-bold"
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            color: (data?.pendentesDia ?? 0) > 0 ? '#fbbf24' : 'rgba(255,255,255,0.9)',
          }}
        >
          {formatBRL(data?.valorPendenteDia ?? 0)}
        </p>
      </GlowCard>

    </div>
  )
}
