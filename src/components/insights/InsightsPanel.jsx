// Right-panel displaying computed financial insights — three plain white cards on a light surface
import { useMemo } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';

export default function InsightsPanel({ transactions = [] }) {
  const { allTransactions } = useFinanceStore();

  const { highestCategory, highestAmount, monthlyChangePct, insightTip } = useMemo(() => {
    const expenseByCategory = {};
    transactions.filter(t => t.type === 'Expense').forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });
    const sorted = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
    const topCat = sorted[0]?.[0] ?? '—';
    const topAmt = sorted[0]?.[1] ?? 0;

    // Dynamic month-over-month expense comparison (March vs February)
    const marchExp = allTransactions
      .filter(t => t.type === 'Expense' && new Date(t.date).getMonth() === 2)
      .reduce((s, t) => s + t.amount, 0);
    const febExp = allTransactions
      .filter(t => t.type === 'Expense' && new Date(t.date).getMonth() === 1)
      .reduce((s, t) => s + t.amount, 0);
    const changePct = febExp === 0 ? 0 : Math.round(((marchExp - febExp) / febExp) * 100);

    const tip = topCat !== '—'
      ? `Your highest spend this period is ${topCat} (₹${topAmt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}). Consider reviewing this category to find savings.`
      : 'No expense data available for the selected period.';

    return { highestCategory: topCat, highestAmount: topAmt, monthlyChangePct: changePct, insightTip: tip };
  }, [transactions, allTransactions]);

  const isPositiveChange = monthlyChangePct >= 0;

  // Shared card style
  const cardStyle = {
    backgroundColor: 'var(--c-card)',
    borderRadius: '16px',
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxShadow: '0 2px 8px rgba(20,29,31,0.04)',
    border: '1px solid var(--c-border)',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: "'Manrope', sans-serif",
    color: 'var(--c-text-3)',
    lineHeight: 1.4,
  };

  const valueStyle = {
    fontSize: '1.6rem',
    fontWeight: '800',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: 'var(--c-text-1)',
    letterSpacing: '-0.02em',
  };

  return (
    <aside
      style={{
        backgroundColor: 'var(--c-panel)',
        borderRadius: '20px',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Section title */}
      <h2
        style={{
          margin: '0 0 4px',
          fontSize: '16px',
          fontWeight: '700',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: 'var(--c-text-1)',
        }}
      >
        Insights
      </h2>

      {/* Card 1 — Highest Spending */}
      <div style={cardStyle}>
        <span style={labelStyle}>Highest Spending</span>
        <span style={valueStyle}>{highestCategory}</span>
      </div>

      {/* Card 2 — Monthly Change */}
      <div style={cardStyle}>
        <span style={labelStyle}>Monthly Change</span>
        <span style={{ ...valueStyle, color: isPositiveChange ? 'var(--c-text-1)' : 'var(--c-expense-badge-text)' }}>
          {isPositiveChange ? '+' : ''}{monthlyChangePct}%
        </span>
      </div>

      {/* Card 3 — Tip text, no label */}
      <div style={cardStyle}>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.65',
            fontFamily: "'Manrope', sans-serif",
            fontWeight: '500',
            color: 'var(--c-text-1)',
          }}
        >
          {insightTip}
        </p>
      </div>
    </aside>
  );
}

