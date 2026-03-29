'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { GlowCard } from '@/components/ui/spotlight-card'

export default function StockCard() {
  const [quantidade, setQuantidade] = useState<number | null>(null)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase
      .from('estoque')
      .select('quantidade')
      .eq('id', 1)
      .single()
      .then(({ data }) => setQuantidade(data?.quantidade ?? 0))
  }, [])

  const semEstoque = quantidade === 0
  const baixoEstoque = quantidade !== null && quantidade > 0 && quantidade <= 10

  return (
    <GlowCard className="p-5 flex flex-col justify-between h-full">
      <p className="text-sm text-white/50 font-medium mb-4">Estoque</p>

      <div className="flex flex-col items-center justify-center flex-1 py-4">
        <p
          className="text-6xl font-bold"
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            color: semEstoque ? '#f87171' : baixoEstoque ? '#fbbf24' : '#ffffff',
          }}
        >
          {quantidade ?? '—'}
        </p>
        <p className="text-xs text-white/30 mt-2">unidades disponíveis</p>
      </div>

      {semEstoque && (
        <div
          className="text-xs font-semibold text-center py-1.5 rounded-lg mt-2"
          style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}
        >
          Sem estoque
        </div>
      )}
      {baixoEstoque && (
        <div
          className="text-xs font-semibold text-center py-1.5 rounded-lg mt-2"
          style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
        >
          Estoque baixo
        </div>
      )}
    </GlowCard>
  )
}
