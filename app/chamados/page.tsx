'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

interface Chamado {
  id: string
  cliente_nome: string
  cliente_whatsapp: string
  problema: string
  status: string
  created_at: string
}

export default function ChamadosPage() {
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [loading, setLoading] = useState(true)
  const [resolvendo, setResolvendo] = useState<string | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchChamados() {
      const { data } = await supabase
        .from('chamados')
        .select('*')
        .order('created_at', { ascending: false })

      setChamados(data || [])
      setLoading(false)
    }

    fetchChamados()

    const channel = supabase
      .channel('chamados-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chamados' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setChamados((prev) => [payload.new as Chamado, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setChamados((prev) =>
              prev.map((c) => (c.id === payload.new.id ? (payload.new as Chamado) : c))
            )
          } else if (payload.eventType === 'DELETE') {
            setChamados((prev) => prev.filter((c) => c.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function marcarResolvido(id: string) {
    setResolvendo(id)
    await supabase.from('chamados').update({ status: 'resolvido' }).eq('id', id)
    setResolvendo(null)
  }

  const abertos = chamados.filter((c) => c.status === 'aberto').length
  const resolvidos = chamados.filter((c) => c.status === 'resolvido').length

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <Header />

      <main className="p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Chamados</h2>
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}
            >
              {abertos} aberto{abertos !== 1 ? 's' : ''}
            </span>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}
            >
              {resolvidos} resolvido{resolvidos !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 animate-pulse"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-40 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-28 mb-3" />
                    <div className="h-3 bg-white/10 rounded w-full mb-1" />
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                  </div>
                  <div className="h-6 bg-white/10 rounded-full w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : chamados.length === 0 ? (
          <div
            className="flex items-center justify-center rounded-2xl py-20"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-white/30 text-sm">Nenhum chamado registrado ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {chamados.map((chamado) => {
              const isAberto = chamado.status === 'aberto'
              const date = new Date(chamado.created_at)
              const dateStr = date.toLocaleDateString('pt-BR')
              const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

              return (
                <div
                  key={chamado.id}
                  className="rounded-2xl p-5 transition-colors hover:bg-white/[0.02]"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isAberto ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-semibold text-white truncate">
                          {chamado.cliente_nome || '—'}
                        </p>
                        <span
                          className="text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0"
                          style={
                            isAberto
                              ? { background: 'rgba(248,113,113,0.15)', color: '#f87171' }
                              : { background: 'rgba(34,197,94,0.15)', color: '#4ade80' }
                          }
                        >
                          {isAberto ? 'aberto' : 'resolvido'}
                        </span>
                      </div>

                      <p className="text-xs text-white/40 mb-3">
                        {chamado.cliente_whatsapp || '—'} &nbsp;·&nbsp; {dateStr} às {timeStr}
                      </p>

                      <p className="text-sm text-white/70 leading-relaxed">
                        {chamado.problema || '—'}
                      </p>
                    </div>

                    {/* Ação */}
                    {isAberto && (
                      <button
                        onClick={() => marcarResolvido(chamado.id)}
                        disabled={resolvendo === chamado.id}
                        className="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                        style={{
                          background: 'rgba(34,197,94,0.12)',
                          border: '1px solid rgba(34,197,94,0.2)',
                          color: '#4ade80',
                        }}
                      >
                        {resolvendo === chamado.id ? 'Salvando...' : 'Marcar como resolvido'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
