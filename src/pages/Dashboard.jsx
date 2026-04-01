// Main dashboard page — assembles all sections: header, stat cards, charts, transactions, and insights
import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { getChartDataByPeriod } from '../data/mockTransactions';

import DashboardHeader     from '../components/layout/DashboardHeader';
import StatCard            from '../components/StatCard';
import PillTabs            from '../components/PillTabs';
import IncomeVsExpensesChart  from '../components/IncomeVsExpensesChart';
import SpendingCategoryChart  from '../components/SpendingCategoryChart';
import RecentTransactions  from '../components/RecentTransactions';
import InsightsPanel       from '../components/insights/InsightsPanel';

export default function Dashboard() {
  const { transactions, role, timePeriod } = useFinanceStore();

  const chartData = useMemo(() => getChartDataByPeriod(timePeriod), [timePeriod]);

  const { totalBalance, totalIncome, totalExpenses, savings, highestCategory, monthlyChangePct } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const byCat = {};
    transactions.forEach((t) => {
      if (t.type === 'Income') income += t.amount;
      else {
        expense += t.amount;
        byCat[t.category] = (byCat[t.category] || 0) + t.amount;
      }
    });
    const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
    return {
      totalBalance: income - expense,
      totalIncome: income,
      totalExpenses: expense,
      savings: Math.max(0, (income - expense) * 0.034),
      highestCategory: topCat,
      monthlyChangePct: +12,
    };
  }, [transactions]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface)',
        minWidth: 0,
      }}
    >
      {/* ── Main Content ─────────────────────────────────────── */}
      <main
        className="db-main"
        style={{
          flex: 1,
          padding: '32px 28px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          overflowY: 'auto',
          minWidth: 0,
        }}
      >
        {/* Header */}
        <DashboardHeader />

        {/* Stat Cards */}
        <div
          className="db-stat-grid"
          style={{
            display: 'grid',
            gap: '16px',
          }}
        >
          <StatCard label="Total Balance"  value={totalBalance}  />
          <StatCard label="Total Income"   value={totalIncome}   badge="+5%"  badgePositive />
          <StatCard label="Total Expenses" value={totalExpenses} badge="-2%"  badgePositive={false} />
          <StatCard label="Savings"        value={savings}       />
        </div>

        {/* Time range tabs */}
        <PillTabs tabs={['This Month', 'Last Month', 'Year']} />

        {/* Charts side-by-side */}
        <div
          className="db-charts"
          style={{
            display: 'grid',
            gap: '20px',
            alignItems: 'stretch',
          }}
        >
          <IncomeVsExpensesChart key={timePeriod} data={chartData} />
          <SpendingCategoryChart key={`pie-₹{timePeriod}`} transactions={transactions} />
        </div>

        {/* Mobile-only insights row — hidden on desktop (shown via .db-mobile-insights class) */}
        <div className="db-mobile-insights">
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 2px 8px rgba(20,29,31,0.04)' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', fontFamily: "'Manrope', sans-serif", color: '#6b7280' }}>Monthly Change</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: "'Plus Jakarta Sans', sans-serif", color: monthlyChangePct >= 0 ? '#111827' : '#ba1a1a', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {monthlyChangePct >= 0 ? '+' : ''}{monthlyChangePct}%
            </span>
          </div>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 2px 8px rgba(20,29,31,0.04)' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', fontFamily: "'Manrope', sans-serif", color: '#6b7280' }}>Top Spending</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#111827', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {highestCategory}
            </span>
          </div>
        </div>

        {/* Recent Transactions */}
        <RecentTransactions isAdmin={role === 'Admin'} />
      </main>

      {/* ── Right Insights Panel — desktop only ──────────────── */}
      <aside className="db-insights">
        <InsightsPanel transactions={transactions} />
      </aside>
    </div>
  );
}
