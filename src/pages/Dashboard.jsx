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
  const { transactions, allTransactions, role, timePeriod } = useFinanceStore();

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

    // Dynamic month-over-month expense comparison (March vs February)
    const marchExp = allTransactions
      .filter(t => t.type === 'Expense' && new Date(t.date).getMonth() === 2)
      .reduce((s, t) => s + t.amount, 0);
    const febExp = allTransactions
      .filter(t => t.type === 'Expense' && new Date(t.date).getMonth() === 1)
      .reduce((s, t) => s + t.amount, 0);
    const changePct = febExp === 0 ? 0 : Math.round(((marchExp - febExp) / febExp) * 100);

    return {
      totalBalance: income - expense,
      totalIncome: income,
      totalExpenses: expense,
      savings: Math.max(0, (income - expense) * 0.034),
      highestCategory: topCat,
      monthlyChangePct: changePct,
    };
  }, [transactions, allTransactions]);

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
          <SpendingCategoryChart key={`pie-${timePeriod}`} transactions={transactions} />
        </div>

        {/* Mobile-only insights row — hidden on desktop (shown via .db-mobile-insights class) */}
        <div className="db-mobile-insights">
          <div style={{ backgroundColor: 'var(--c-card)', borderRadius: '16px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 2px 8px rgba(20,29,31,0.04)', border: '1px solid var(--c-border)' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', fontFamily: "'Manrope', sans-serif", color: 'var(--c-text-3)' }}>Monthly Change</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: "'Plus Jakarta Sans', sans-serif", color: monthlyChangePct >= 0 ? 'var(--c-text-1)' : 'var(--c-expense-badge-text)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {monthlyChangePct >= 0 ? '+' : ''}{monthlyChangePct}%
            </span>
          </div>
          <div style={{ backgroundColor: 'var(--c-card)', borderRadius: '16px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 2px 8px rgba(20,29,31,0.04)', border: '1px solid var(--c-border)' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', fontFamily: "'Manrope', sans-serif", color: 'var(--c-text-3)' }}>Top Spending</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--c-text-1)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
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
