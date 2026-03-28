import { GlowCard } from '@/components/ui/spotlight-card'

interface KPICardProps {
  label: string
  value: string
  change: number
  positive: boolean
}

export default function KPICard({ label, value, change, positive }: KPICardProps) {
  return (
    <GlowCard className="p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-white/50 font-medium">{label}</p>
        <div
          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
          style={{
            color: positive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
            background: positive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
          }}
        >
          {positive ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      </div>
      <p
        className="text-2xl font-bold text-white tracking-tight"
        style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
      >
        {value}
      </p>
    </GlowCard>
  )
}
