// Reusable donut chart showing spending breakdown by category with percentage labels and a legend
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';

const CATEGORY_COLORS_LIGHT = {
  Food:     '#2ab5a5',
  Travel:   '#2d3748',
  Shopping: '#6b8fa8',
  Bills:    '#a8ccd8',
};
const CATEGORY_COLORS_DARK = {
  Food:     '#2DD4BF',
  Travel:   '#4a5568',
  Shopping: '#6b8fa8',
  Bills:    '#a8d8e2',
};
const FALLBACK_COLOR = '#94a3b8';

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: '13px',
        fontWeight: '600',
        fill: '#ffffff',
      }}
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
};

export default function SpendingCategoryChart({ transactions = [], title = 'Spending Category' }) {
  const isDark = useFinanceStore(s => s.theme === 'dark');
  const CATEGORY_COLORS = isDark ? CATEGORY_COLORS_DARK : CATEGORY_COLORS_LIGHT;
  const DEFAULT_DATA = [
    { name: 'Food',     value: 35, color: CATEGORY_COLORS.Food },
    { name: 'Travel',   value: 25, color: CATEGORY_COLORS.Travel },
    { name: 'Shopping', value: 20, color: CATEGORY_COLORS.Shopping },
    { name: 'Bills',    value: 20, color: CATEGORY_COLORS.Bills },
  ];
  const legendTextColor = isDark ? '#C0C5D8' : '#374151';
  const panelBg = isDark ? '#1E2130' : '#d6e8f0';

  const chartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    if (expenses.length === 0) return DEFAULT_DATA;

    const totals = {};
    expenses.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    return Object.entries(totals)
      .map(([name, amount]) => ({
        name,
        value: amount,   // raw amount — Recharts computes percent accurately
        color: CATEGORY_COLORS[name] || FALLBACK_COLOR,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);
  return (
    <div
      style={{
        backgroundColor: panelBg,
        borderRadius: '20px',
        padding: '24px',
        fontFamily: "'Poppins', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Title */}
      <h3
        style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '700',
          color: 'var(--c-text-1)',
          fontFamily: "'Poppins', sans-serif",
          flexShrink: 0,
        }}
      >
        {title}
      </h3>

      {/* Chart + Legend row — fills remaining space */}
      <div className="pie-chart-row">
        {/* Donut — fixed pixel height so Recharts can always measure it */}
        <div className="pie-chart-canvas" style={{ outline: 'none' }}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="68%"
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
                stroke="none"
                startAngle={90}
                endAngle={-270}
                isAnimationActive={true}
                activeShape={{ stroke: 'none', strokeWidth: 0 }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {chartData.map((entry) => (
            <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '3px',
                  backgroundColor: entry.color,
                  flexShrink: 0,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: legendTextColor,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
