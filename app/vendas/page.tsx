'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { createClient } from '@supabase/supabase-js'
import { formatBRL } from '@/lib/utils'

interface Venda {
  id: string
  payt_order_id: string
  cliente_nome: string
  cliente_email: string
  valor: number
  status: string
  produto_nome: string
  estado: string
  created_at: string
}

const statusColor: Record<string, { bg: string; color: string }> = {
  paid:      { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80' },
  approved:  { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80' },
  pending:   { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
  cancelled: { bg: 'rgba(248,113,113,0.15)',color: '#f87171' },
  refunded:  { bg: 'rgba(248,113,113,0.15)',color: '#f87171' },
}

const statusLabel: Record<string, string> = {
  paid:      'Aprovado',
  approved:  'Aprovado',
  pending:   'Aguardando',
  cancelled: 'Cancelado',
  refunded:  'Reembolsado',
}

function getInitials(name: string) {
  return name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?'
}

export default function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const perPage = 10

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function fetchVendas() {
      setLoading(true)
      const { data } = await supabase
        .from('vendas')
        .select('*')
        .order('created_at', { ascending: false })

      setVendas(data || [])
      setLoading(false)
    }

    fetchVendas()
  }, [])

  const totalPages = Math.ceil(vendas.length / perPage)
  const paginatedVendas = vendas.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <Header />

      <main className="p-4 flex flex-col gap-4">
        {/* Header da página */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Listagem de Vendas</h2>
          <span className="text-xs text-white/40">
            {vendas.length} resultado{vendas.length !== 1 ? 's' : ''} encontrado{vendas.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tabela */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
        >
          {/* Cabeçalho */}
          <div
            className="grid text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-3"
            style={{
              gridTemplateColumns: '120px 1fr 160px 160px 140px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span>Código</span>
            <span>Cliente / Produto</span>
            <span>Data da Compra</span>
            <span>Pagamento</span>
            <span>Status</span>
          </div>

          {/* Linhas */}
          {loading ? (
            <div className="flex flex-col gap-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="grid px-5 py-4 animate-pulse"
                  style={{
                    gridTemplateColumns: '120px 1fr 160px 160px 140px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <div className="h-4 bg-white/10 rounded w-20" />
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10" />
                    <div>
                      <div className="h-3 bg-white/10 rounded w-32 mb-2" />
                      <div className="h-3 bg-white/10 rounded w-48" />
                    </div>
                  </div>
                  <div className="h-4 bg-white/10 rounded w-24" />
                  <div className="h-4 bg-white/10 rounded w-20" />
                  <div className="h-6 bg-white/10 rounded-full w-24" />
                </div>
              ))}
            </div>
          ) : paginatedVendas.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-white/30 text-sm">
              Nenhuma venda registrada ainda.
            </div>
          ) : (
            paginatedVendas.map((venda, i) => {
              const s = statusColor[venda.status] || { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }
              const label = statusLabel[venda.status] || venda.status
              const date = new Date(venda.created_at)
              const dateStr = date.toLocaleDateString('pt-BR')
              const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

              return (
                <div
                  key={venda.id}
                  className="grid px-5 py-4 items-center transition-colors hover:bg-white/[0.02]"
                  style={{
                    gridTemplateColumns: '120px 1fr 160px 160px 140px',
                    borderBottom: i < paginatedVendas.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  {/* Código */}
                  <span
                    className="text-sm font-bold"
                    style={{ color: '#A855F7', fontFamily: 'var(--font-geist-mono), monospace' }}
                  >
                    {venda.payt_order_id?.slice(0, 8).toUpperCase() || '—'}
                  </span>

                  {/* Cliente / Produto */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.3)' }}
                    >
                      {getInitials(venda.cliente_nome || '')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">{venda.cliente_nome || '—'}</p>
                      <p className="text-xs text-white/40 mt-0.5">{venda.cliente_email || '—'}</p>
                      <p className="text-xs text-white/30 mt-0.5">{venda.produto_nome || '—'}</p>
                    </div>
                  </div>

                  {/* Data */}
                  <div>
                    <p className="text-sm text-white/80">{dateStr}</p>
                    <p className="text-xs text-white/40">{timeStr}</p>
                    {venda.estado && (
                      <span className="text-xs text-white/30">{venda.estado}</span>
                    )}
                  </div>

                  {/* Valor */}
                  <p
                    className="text-sm font-semibold text-white"
                    style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
                  >
                    {formatBRL(venda.valor || 0)}
                  </p>

                  {/* Status */}
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full inline-block w-fit"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {label}
                  </span>
                </div>
              )
            })
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
