import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import KPICard from '@/components/KPICard'
import RevenueChart from '@/components/RevenueChart'
import TopProducts from '@/components/TopProducts'
import MonthlyRevenue from '@/components/MonthlyRevenue'
import StatesSales from '@/components/StatesSales'
import { mockKPIs, mockTransactions, mockStatesSales } from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <Header />

      <main className="p-4 grid gap-4" style={{ gridTemplateColumns: '1fr 288px' }}>

        {/* KPI Cards — col 1 */}
        <div className="grid grid-cols-3 gap-4">
          {mockKPIs.map((kpi) => (
            <KPICard key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Card produto — col 2, span 2 linhas (KPIs + Gráfico) */}
        <div
          className="row-span-2 rounded-2xl flex items-center justify-center p-4 group"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <img
            src="/RETRA-MAX_CAPS_MOCKUP.png"
            alt="Retra Max"
            className="w-full max-h-[480px] object-contain transition-transform duration-700 ease-in-out group-hover:rotate-12 group-hover:scale-110"
          />
        </div>

        {/* RevenueChart — col 1 */}
        <RevenueChart />

        {/* TopProducts — col 1 */}
        <TopProducts />

        {/* MonthlyRevenue — col 2, mesma linha do TopProducts */}
        <div style={{ gridColumn: '2', gridRow: '3' }}>
          <MonthlyRevenue transactions={mockTransactions} />
        </div>

        {/* StatesSales — col 2 */}
        <div style={{ gridColumn: '2' }}>
          <StatesSales states={mockStatesSales} />
        </div>

      </main>
    </div>
  )
}
