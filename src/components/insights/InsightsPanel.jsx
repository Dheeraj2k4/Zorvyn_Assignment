// Right-panel displaying computed financial insights — three plain white cards on a light surface
import { useMemo } from 'react';

export default function InsightsPanel({ transactions = [] }) {
  const { highestCategory, monthlyChangePct } = useMemo(() => {
    const expenseByCategory = {};
    transactions.filter(t => t.type === 'Expense').forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });
    const sorted = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
    const topCat = sorted[0]?.[0] ?? '—';
    return { highestCategory: topCat, monthlyChangePct: +12 };
  }, [transactions]);

  const isPositiveChange = monthlyChangePct >= 0;

  // Shared card style — plain white, rounded, no border, no left accent bar
  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxShadow: '0 2px 8px rgba(20,29,31,0.04)',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: "'Manrope', sans-serif",
    color: '#6b7280',
    lineHeight: 1.4,
  };

  const valueStyle = {
    fontSize: '1.6rem',
    fontWeight: '800',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#111827',
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
  };

  return (
    <aside
      style={{
        backgroundColor: '#d6e8f0',
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
          color: '#111827',
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
        <span style={{ ...valueStyle, color: isPositiveChange ? '#111827' : '#ba1a1a' }}>
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
            color: '#111827',
          }}
        >
          Your grocery spending is 10% lower than last month.
        </p>
      </div>
    </aside>
  );
}

