// Reusable donut chart showing spending breakdown by category with percentage labels and a legend
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';

const formatINR = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

const formatINRShort = (v) => {
  if (v >= 1_00_000) return `₹${(v / 1_00_000).toFixed(1)}L`;
  if (v >= 1_000)    return `₹${(v / 1_000).toFixed(1)}K`;
  return `₹${v.toFixed(0)}`;
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const { name, value, payload: p } = payload[0];
  return (
    <div style={{
      backgroundColor: '#1a1f2e',
      borderRadius: '10px',
      padding: '9px 14px',
      fontFamily: "'Poppins', sans-serif",
      fontSize: '12px',
      color: '#fff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      pointerEvents: 'none',
    }}>
      <div style={{ fontWeight: '700', marginBottom: '3px' }}>{name}</div>
      <div style={{ color: '#a0aec0' }}>{formatINR(value)}</div>
    </div>
  );
};

// Renders center label (total) inside the donut hole via absolute positioning
const CenterLabel = ({ total, isDark }) => {
  const labelColor = isDark ? '#F0F0F0' : '#111827';
  const subColor   = isDark ? '#8A8FA8' : '#6b7280';
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px', fontWeight: '800', color: labelColor, lineHeight: 1.2 }}>
        {formatINRShort(total)}
      </span>
      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '10px', fontWeight: '500', color: subColor, marginTop: '2px' }}>
        total spent
      </span>
    </div>
  );
};

const CATEGORY_COLORS_LIGHT = {
  Food:        '#2ab5a5',
  Travel:      '#2d3748',
  Shopping:    '#6b8fa8',
  Bills:       '#a8ccd8',
  Salary:      '#4a7c6f',
  Investments: '#7cb8b0',
};
const CATEGORY_COLORS_DARK = {
  Food:        '#2DD4BF',
  Travel:      '#4a5568',
  Shopping:    '#6b8fa8',
  Bills:       '#a8d8e2',
  Salary:      '#4a9e8e',
  Investments: '#7cb8b0',
};
const FALLBACK_COLOR = '#94a3b8';

export default function SpendingCategoryChart({ transactions = [], title = 'Spending Category' }) {
  const isDark = useFinanceStore(s => s.theme === 'dark');
  const CATEGORY_COLORS = isDark ? CATEGORY_COLORS_DARK : CATEGORY_COLORS_LIGHT;
  const DEFAULT_DATA = [
    { name: 'Food',     value: 35, color: CATEGORY_COLORS.Food },
    { name: 'Travel',   value: 25, color: CATEGORY_COLORS.Travel },
    { name: 'Shopping', value: 20, color: CATEGORY_COLORS.Shopping },
    { name: 'Bills',    value: 20, color: CATEGORY_COLORS.Bills },
  ];
  const legendTextColor  = isDark ? '#C0C5D8' : '#374151';
  const legendValueColor = isDark ? '#8A8FA8'  : '#6b7280';
  const panelBg = isDark ? '#1E2130' : '#d6e8f0';

  const { chartData, totalExpenses } = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    if (expenses.length === 0) {
      const total = DEFAULT_DATA.reduce((s, d) => s + d.value, 0);
      return { chartData: DEFAULT_DATA, totalExpenses: total };
    }
    const totals = {};
    expenses.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    const data = Object.entries(totals)
      .map(([name, amount]) => ({
        name,
        value: amount,
        color: CATEGORY_COLORS[name] || FALLBACK_COLOR,
      }))
      .sort((a, b) => b.value - a.value);
    const total = data.reduce((s, d) => s + d.value, 0);
    return { chartData: data, totalExpenses: total };
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
      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--c-text-1)', fontFamily: "'Poppins', sans-serif", flexShrink: 0 }}>
        {title}
      </h3>

      {/* Chart + Legend row */}
      <div className="pie-chart-row">
        {/* Donut with center label */}
        <div className="pie-chart-canvas" style={{ outline: 'none', position: 'relative' }}>
          <CenterLabel total={totalExpenses} isDark={isDark} />
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="42%"
                outerRadius="70%"
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={false}
                stroke="none"
                startAngle={90}
                endAngle={-270}
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend — name + amount, circle dot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
          {chartData.map((entry) => (
            <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                width: 11, height: 11, borderRadius: '50%',
                backgroundColor: entry.color, flexShrink: 0, display: 'inline-block',
              }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: legendTextColor, fontFamily: "'Poppins', sans-serif", lineHeight: 1.3 }}>
                  {entry.name}
                </span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: legendValueColor, fontFamily: "'Poppins', sans-serif", lineHeight: 1.3 }}>
                  {formatINR(entry.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
