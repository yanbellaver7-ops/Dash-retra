import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import KPICard from '@/components/KPICard'
import RevenueChart from '@/components/RevenueChart'
import MonthlyRevenue from '@/components/MonthlyRevenue'
import StatesSales from '@/components/StatesSales'
import DailySalesCards from '@/components/DailySalesCards'
import BrazilMap from '@/components/BrazilMap'
import { mockKPIs, mockTransactions, mockStatesSales } from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <Header />

      <main className="p-4 grid gap-4" style={{ gridTemplateColumns: '1fr 288px' }}>

        {/* Row 1 col 1 — KPI Cards */}
        <div className="grid grid-cols-3 gap-4" style={{ gridColumn: '1', gridRow: '1' }}>
          {mockKPIs.map((kpi) => (
            <KPICard key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Row 2 col 1 — RevenueChart */}
        <div style={{ gridColumn: '1', gridRow: '2' }}>
          <RevenueChart />
        </div>

        {/* Col 2 rows 1-2 — Card produto (alinhado topo KPIs até fim RevenueChart) */}
        <div
          className="rounded-2xl flex items-center justify-center p-4 group"
          style={{
            gridColumn: '2',
            gridRow: '1 / 3',
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

        {/* Row 3 col 1 — Daily Sales Cards */}
        <div style={{ gridColumn: '1', gridRow: '3' }}>
          <DailySalesCards />
        </div>

        {/* Row 3 col 2 — MonthlyRevenue */}
        <div style={{ gridColumn: '2', gridRow: '3' }}>
          <MonthlyRevenue transactions={mockTransactions} />
        </div>

        {/* Row 4 col 1 — Brazil Map */}
        <div style={{ gridColumn: '1', gridRow: '4' }}>
          <BrazilMap />
        </div>

        {/* Row 4 col 2 — StatesSales */}
        <div style={{ gridColumn: '2', gridRow: '4' }}>
          <StatesSales states={mockStatesSales} />
        </div>

      </main>
    </div>
  )
}
