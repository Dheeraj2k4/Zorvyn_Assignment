// Reusable smooth area+line chart comparing Income vs Expenses across months, styled to match the design spec
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const defaultData = [
  { label: 'Jan', income: 5780,  expenses: 1444 },
  { label: 'Feb', income: 6150,  expenses: 980  },
  { label: 'Mar', income: 6400,  expenses: 1385 },
  { label: 'Apr', income: 5200,  expenses: 1100 },
  { label: 'May', income: 6800,  expenses: 1260 },
  { label: 'Jun', income: 7200,  expenses: 1500 },
  { label: 'Jul', income: 6900,  expenses: 1350 },
  { label: 'Aug', income: 7500,  expenses: 1620 },
  { label: 'Sep', income: 6700,  expenses: 1450 },
  { label: 'Oct', income: 7100,  expenses: 1380 },
  { label: 'Nov', income: 6600,  expenses: 1200 },
  { label: 'Dec', income: 7800,  expenses: 1700 },
];

const formatYAxis = (value) => {
  if (value === 0) return '0';
  if (value >= 1_00_00_000) return `\u20B9${value / 1_00_00_000}Cr`;
  if (value >= 1_00_000)    return `\u20B9${value / 1_00_000}L`;
  if (value >= 1_000)       return `\u20B9${value / 1_000}K`;
  return `\u20B9${value}`;
};

const formatCurrencyTooltip = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(value);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: '#1a1f2e',
        borderRadius: '10px',
        padding: '10px 14px',
        fontFamily: "'Poppins', sans-serif",
        fontSize: '12px',
        color: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        border: 'none',
        minWidth: '170px',
      }}
    >
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: i < payload.length - 1 ? '5px' : 0 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: entry.color,
              flexShrink: 0,
            }}
          />
          <span style={{ color: '#a0aec0' }}>
            {label}:&nbsp;
          </span>
          <span style={{ fontWeight: 600, color: '#fff' }}>
            {formatCurrencyTooltip(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomDot = (props) => {
  const { cx, cy, stroke } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="#fff"
      stroke={stroke}
      strokeWidth={2.5}
    />
  );
};

export default function IncomeVsExpensesChart({ data = defaultData, title = 'Income vs Expenses' }) {
  return (
    <div
      style={{
        backgroundColor: '#d6e8f0',
        borderRadius: '20px',
        padding: '28px 24px 16px',
        fontFamily: "'Poppins', sans-serif",
        width: '100%',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827', fontFamily: "'Poppins', sans-serif" }}>
          {title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ display: 'inline-block', width: '24px', height: '2.5px', backgroundColor: '#4bbfd4', borderRadius: '2px' }} />
            Income
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ display: 'inline-block', width: '24px', height: '2.5px', backgroundColor: '#374151', borderRadius: '2px' }} />
            Expenses
          </span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: 280, outline: 'none' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4bbfd4" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#4bbfd4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#374151" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#374151" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray=""
              stroke="#b8cdd6"
              strokeWidth={1}
              vertical={false}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 12,
                fill: '#6b7280',
                fontWeight: 500,
              }}
              dy={8}
            />

            <YAxis
              tickFormatter={formatYAxis}
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 12,
                fill: '#6b7280',
                fontWeight: 500,
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 3' }}
            />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#4bbfd4"
              strokeWidth={2.5}
              fill="url(#incomeGradient)"
              dot={false}
              activeDot={<CustomDot stroke="#4bbfd4" />}
            />

            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#374151"
              strokeWidth={2.5}
              fill="url(#expensesGradient)"
              dot={false}
              activeDot={<CustomDot stroke="#374151" />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
