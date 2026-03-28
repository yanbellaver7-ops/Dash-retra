'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { GlowCard } from '@/components/ui/spotlight-card'

interface Movimento {
  id: string
  tipo: 'entrada' | 'saida'
  quantidade: number
  descricao: string
  created_at: string
}

export default function EstoquePage() {
  const [total, setTotal] = useState<number>(0)
  const [movimentos, setMovimentos] = useState<Movimento[]>([])
  const [loading, setLoading] = useState(true)
  const [qtd, setQtd] = useState('')
  const [saving, setSaving] = useState(false)

  function getSupabase() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  async function fetchEstoque() {
    const supabase = getSupabase()
    const { data: mov } = await supabase
      .from('estoque_movimentos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)

    const { data: totRow } = await supabase
      .from('estoque')
      .select('quantidade')
      .eq('id', 1)
      .single()

    setMovimentos(mov || [])
    setTotal(totRow?.quantidade ?? 0)
    setLoading(false)
  }

  useEffect(() => {
    fetchEstoque()
  }, [])

  async function adicionarEstoque() {
    const n = parseInt(qtd)
    if (!n || n <= 0) return
    setSaving(true)

    const supabase = getSupabase()
    await supabase.rpc('ajustar_estoque', { delta: n })
    await supabase.from('estoque_movimentos').insert({
      tipo: 'entrada',
      quantidade: n,
      descricao: 'Adição manual',
    })

    setQtd('')
    await fetchEstoque()
    setSaving(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <Header />

      <main className="p-4 flex flex-col gap-4 max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Estoque</h2>
          <span className="text-xs text-white/40">Retra Max</span>
        </div>

        {/* Total */}
        <GlowCard className="p-6">
          <p className="text-sm text-white/50 mb-2">Total em estoque</p>
          <p
            className="text-5xl font-bold text-white"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {loading ? '—' : total}
          </p>
          <p className="text-xs text-white/30 mt-2">unidades disponíveis</p>
        </GlowCard>

        {/* Adicionar estoque */}
        <GlowCard className="p-5">
          <p className="text-sm text-white/50 font-medium mb-3">Adicionar unidades</p>
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              value={qtd}
              onChange={(e) => setQtd(e.target.value)}
              placeholder="Quantidade"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
              }}
            />
            <button
              onClick={adicionarEstoque}
              disabled={saving || !qtd}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: 'white' }}
            >
              {saving ? 'Salvando…' : 'Adicionar'}
            </button>
          </div>
        </GlowCard>

        {/* Histórico */}
        <GlowCard className="p-5">
          <p className="text-sm text-white/50 font-medium mb-4">Histórico de movimentações</p>
          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-white/05 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : movimentos.length === 0 ? (
            <p className="text-xs text-white/30 text-center py-6">Nenhuma movimentação ainda.</p>
          ) : (
            <div className="flex flex-col gap-0">
              {movimentos.map((m, i) => {
                const date = new Date(m.created_at)
                const dateStr = date.toLocaleDateString('pt-BR')
                const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between py-3"
                    style={{ borderBottom: i < movimentos.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{
                          background: m.tipo === 'entrada' ? 'rgba(34,197,94,0.15)' : 'rgba(248,113,113,0.15)',
                          color: m.tipo === 'entrada' ? '#4ade80' : '#f87171',
                        }}
                      >
                        {m.tipo === 'entrada' ? '+' : '−'}
                      </span>
                      <div>
                        <p className="text-sm text-white/80">{m.descricao}</p>
                        <p className="text-xs text-white/30">{dateStr} às {timeStr}</p>
                      </div>
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        color: m.tipo === 'entrada' ? '#4ade80' : '#f87171',
                      }}
                    >
                      {m.tipo === 'entrada' ? '+' : '−'}{m.quantidade}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </GlowCard>
      </main>
    </div>
  )
}
