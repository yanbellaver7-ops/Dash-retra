import { mockTopProducts } from '@/lib/mock-data'
import { formatBRL } from '@/lib/utils'
import { GlowCard } from '@/components/ui/spotlight-card'

export default function TopProducts() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-white">Top Produtos</p>
        <button className="text-xs font-medium text-white/40 hover:text-white/70 transition-colors">
          Ver todos
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {mockTopProducts.map((p) => (
          <GlowCard key={p.nome} className="p-4">
            <p className="text-sm font-semibold text-white truncate mb-1">{p.nome}</p>
            <p className="text-xs text-white/40 mb-3">{p.periodo}</p>
            <p
              className="text-lg font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {formatBRL(p.valor)}
            </p>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: p.positive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                background: p.positive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
              }}
            >
              {p.positive ? '+' : ''}{p.badge}%
            </span>
          </GlowCard>
        ))}
      </div>
    </div>
  )
}
