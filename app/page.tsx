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

        {/* KPI Cards — col 1 */}
        <div className="grid grid-cols-3 gap-4">
          {mockKPIs.map((kpi) => (
            <KPICard key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Card produto — col 2, alinhado com RevenueChart */}
        <div
          className="rounded-2xl flex items-center justify-center p-4 group"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            gridColumn: '2',
            gridRow: '2',
            alignSelf: 'start',
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

        {/* Daily Sales Cards — col 1 */}
        <DailySalesCards />

        {/* Brazil Map — col 1 */}
        <BrazilMap />

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
