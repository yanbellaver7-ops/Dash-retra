import { formatBRL } from '@/lib/utils'
import { GlowCard } from '@/components/ui/spotlight-card'

interface Transaction {
  nome: string
  valor: number
  change: number
  positive: boolean
}

export default function MonthlyRevenue({ transactions, glowColor = 'purple' }: { transactions: Transaction[]; glowColor?: 'purple' | 'teal' }) {
  const total = transactions.reduce((acc, t) => acc + t.valor, 0)

  return (
    <GlowCard className="p-3" glowColor={glowColor}>
      <p className="text-xs font-semibold text-white/50 mb-2">Últimas Vendas</p>

      <p
        className="text-xl font-bold text-white mb-2"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {formatBRL(total)}
      </p>

      <div className="flex flex-col gap-2">
        {transactions.length === 0 ? (
          <p className="text-xs text-white/30 text-center py-4">Nenhuma venda ainda.</p>
        ) : (
          transactions.map((t) => (
            <div key={t.nome} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  {t.nome.charAt(0)}
                </div>
                <p className="text-xs text-white/80 font-medium">{t.nome}</p>
              </div>
              <p
                className="text-xs font-semibold text-white"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {formatBRL(t.valor)}
              </p>
            </div>
          ))
        )}
      </div>
    </GlowCard>
  )
}
