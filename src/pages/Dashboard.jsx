// Main dashboard page — assembles all sections: header, stat cards, charts, transactions, and insights
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { getChartDataByPeriod } from '../data/mockTransactions';

import DashboardHeader        from '../components/layout/DashboardHeader';
import StatCard               from '../components/StatCard';
import PillTabs               from '../components/PillTabs';
import IncomeVsExpensesChart  from '../components/IncomeVsExpensesChart';
import SpendingCategoryChart  from '../components/SpendingCategoryChart';
import RecentTransactions     from '../components/RecentTransactions';
import InsightsPanel          from '../components/insights/InsightsPanel';

// Shared fade-up animation variants
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut', delay: i * 0.08 },
  }),
};

export default function Dashboard() {
  const { transactions, allTransactions, role, timePeriod } = useFinanceStore();

  const chartData = useMemo(() => getChartDataByPeriod(timePeriod), [timePeriod]);

  const { totalBalance, totalIncome, totalExpenses, savings, highestCategory, monthlyChangePct, incomeChangePct, expenseChangePct } = useMemo(() => {
    // Current-period totals (derived from the already-filtered `transactions` slice)
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

    // Previous-period filter — adapts to whichever tab is selected
    const YEAR = 2026;
    const prevFilter = (t) => {
      const d = new Date(t.date);
      if (timePeriod === 'This Month') return d.getFullYear() === YEAR && d.getMonth() === 1; // Feb
      if (timePeriod === 'Last Month') return d.getFullYear() === YEAR && d.getMonth() === 0; // Jan
      return d.getFullYear() === YEAR - 1; // Prior year for "Year" tab
    };

    const prevIncome = allTransactions
      .filter(t => t.type === 'Income' && prevFilter(t))
      .reduce((s, t) => s + t.amount, 0);
    const prevExpense = allTransactions
      .filter(t => t.type === 'Expense' && prevFilter(t))
      .reduce((s, t) => s + t.amount, 0);

    // null means no prior-period data (badge hidden rather than showing ÷0)
    const incomeChangePct  = prevIncome  === 0 ? null : Math.round(((income  - prevIncome)  / prevIncome)  * 100);
    const expenseChangePct = prevExpense === 0 ? null : Math.round(((expense - prevExpense) / prevExpense) * 100);

    return {
      totalBalance: income - expense,
      totalIncome: income,
      totalExpenses: expense,
      savings: Math.max(0, (income - expense) * 0.034),
      highestCategory: topCat,
      monthlyChangePct: expenseChangePct,
      incomeChangePct,
      expenseChangePct,
    };
  }, [transactions, allTransactions, timePeriod]);

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
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <DashboardHeader />
        </motion.div>

        {/* Stat Cards — staggered */}
        <div
          className="db-stat-grid"
          style={{ display: 'grid', gap: '16px' }}
        >
          {[
            { label: 'Total Balance',  value: totalBalance },
            {
              label: 'Total Income',
              value: totalIncome,
              badge: incomeChangePct !== null ? `${incomeChangePct >= 0 ? '+' : ''}${incomeChangePct}%` : undefined,
              badgePositive: incomeChangePct >= 0,
            },
            {
              label: 'Total Expenses',
              value: totalExpenses,
              badge: expenseChangePct !== null ? `${expenseChangePct >= 0 ? '+' : ''}${expenseChangePct}%` : undefined,
              badgePositive: expenseChangePct < 0,   // expenses going DOWN is good (green)
            },
            { label: 'Savings',        value: savings },
          ].map((card, i) => (
            <motion.div key={card.label} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}>
              <StatCard {...card} />
            </motion.div>
          ))}
        </div>

        {/* Time range tabs */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <PillTabs tabs={['This Month', 'Last Month', 'Year']} />
        </motion.div>

        {/* Charts side-by-side */}
        <motion.div
          className="db-charts"
          style={{ display: 'grid', gap: '20px', alignItems: 'stretch' }}
          variants={fadeUp} initial="hidden" animate="visible" custom={6}
        >
          <IncomeVsExpensesChart key={timePeriod} data={chartData} />
          <SpendingCategoryChart key={`pie-${timePeriod}`} transactions={transactions} />
        </motion.div>

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
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
          <RecentTransactions isAdmin={role === 'Admin'} />
        </motion.div>
      </main>

      {/* ── Right Insights Panel — desktop only ──────────────── */}
      <motion.aside
        className="db-insights"
        variants={fadeUp} initial="hidden" animate="visible" custom={8}
      >
        <InsightsPanel transactions={transactions} />
      </motion.aside>
    </div>
  );
}
