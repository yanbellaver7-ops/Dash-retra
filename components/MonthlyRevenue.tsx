import { formatBRL } from '@/lib/utils'
import { GlowCard } from '@/components/ui/spotlight-card'

interface Transaction {
  nome: string
  valor: number
  change: number
  positive: boolean
}

export default function MonthlyRevenue({ transactions }: { transactions: Transaction[] }) {
  return (
    <GlowCard className="p-5">
      <p className="text-sm font-semibold text-white mb-4">Últimas Vendas</p>

      <p
        className="text-3xl font-bold text-white mb-1"
        style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
      >
        R$ 143.000
        <span className="text-white/40">,00</span>
      </p>
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full mb-5 inline-block"
        style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.08)' }}
      >
        +6.7%
      </span>

      <div className="flex flex-col gap-3 mt-4">
        {transactions.map((t) => (
          <div key={t.nome} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                {t.nome.charAt(0)}
              </div>
              <p className="text-sm text-white/80 font-medium">{t.nome}</p>
            </div>
            <div className="text-right">
              <p
                className="text-sm font-semibold text-white"
                style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
              >
                {formatBRL(t.valor)}
              </p>
              <p
                className="text-xs"
                style={{ color: t.positive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}
              >
                {t.positive ? '↑' : '↓'} {Math.abs(t.change)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </GlowCard>
  )
}
