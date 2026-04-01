// All static mock data — transactions spanning Jan–Mar 2026, organised for filter-by-period use

export const mockTransactions = [
  // ── March 2026 (This Month) ────────────────────────────────────────
  { id: 'm1',  date: '2026-03-25', description: 'Grocery Market',     amount: 120.50, type: 'Expense', category: 'Food' },
  { id: 'm2',  date: '2026-03-24', description: 'Monthly Salary',     amount: 5000,   type: 'Income',  category: 'Salary' },
  { id: 'm3',  date: '2026-03-22', description: 'Internet Bill',      amount: 65,     type: 'Expense', category: 'Bills' },
  { id: 'm4',  date: '2026-03-20', description: 'Tech Gadget Store',  amount: 450,    type: 'Expense', category: 'Shopping' },
  { id: 'm5',  date: '2026-03-18', description: 'Flight Ticket',      amount: 350,    type: 'Expense', category: 'Travel' },
  { id: 'm6',  date: '2026-03-15', description: 'Dividends',          amount: 200,    type: 'Income',  category: 'Investments' },
  { id: 'm7',  date: '2026-03-12', description: 'Restaurant Dinner',  amount: 85,     type: 'Expense', category: 'Food' },
  { id: 'm8',  date: '2026-03-10', description: 'Electricity Bill',   amount: 110,    type: 'Expense', category: 'Bills' },
  { id: 'm9',  date: '2026-03-08', description: 'Clothes Shopping',   amount: 150,    type: 'Expense', category: 'Shopping' },
  { id: 'm10', date: '2026-03-05', description: 'Gas Station',        amount: 55,     type: 'Expense', category: 'Travel' },
  { id: 'm11', date: '2026-03-03', description: 'Freelance Payment',  amount: 1200,   type: 'Income',  category: 'Salary' },
  { id: 'm12', date: '2026-03-01', description: 'Streaming Service',  amount: 18,     type: 'Expense', category: 'Bills' },

  // ── February 2026 (Last Month) ─────────────────────────────────────
  { id: 'l1',  date: '2026-02-27', description: 'Supermarket Run',    amount: 145,    type: 'Expense', category: 'Food' },
  { id: 'l2',  date: '2026-02-25', description: 'Monthly Salary',     amount: 5000,   type: 'Income',  category: 'Salary' },
  { id: 'l3',  date: '2026-02-22', description: 'Phone Bill',         amount: 50,     type: 'Expense', category: 'Bills' },
  { id: 'l4',  date: '2026-02-20', description: 'Online Shopping',    amount: 320,    type: 'Expense', category: 'Shopping' },
  { id: 'l5',  date: '2026-02-17', description: 'Train Tickets',      amount: 90,     type: 'Expense', category: 'Travel' },
  { id: 'l6',  date: '2026-02-14', description: 'Valentine Dinner',   amount: 120,    type: 'Expense', category: 'Food' },
  { id: 'l7',  date: '2026-02-12', description: 'Bonus Payment',      amount: 800,    type: 'Income',  category: 'Salary' },
  { id: 'l8',  date: '2026-02-10', description: 'Electricity Bill',   amount: 105,    type: 'Expense', category: 'Bills' },
  { id: 'l9',  date: '2026-02-08', description: 'Gym Membership',     amount: 40,     type: 'Expense', category: 'Bills' },
  { id: 'l10', date: '2026-02-05', description: 'Taxi Rides',         amount: 75,     type: 'Expense', category: 'Travel' },
  { id: 'l11', date: '2026-02-03', description: 'Investment Return',  amount: 350,    type: 'Income',  category: 'Investments' },
  { id: 'l12', date: '2026-02-01', description: 'Book Purchase',      amount: 35,     type: 'Expense', category: 'Shopping' },

  // ── January 2026 (Year view only) ─────────────────────────────────
  { id: 'y1',  date: '2026-01-28', description: 'Grocery Store',      amount: 130,    type: 'Expense', category: 'Food' },
  { id: 'y2',  date: '2026-01-25', description: 'Monthly Salary',     amount: 5000,   type: 'Income',  category: 'Salary' },
  { id: 'y3',  date: '2026-01-22', description: 'Internet + Cable',   amount: 90,     type: 'Expense', category: 'Bills' },
  { id: 'y4',  date: '2026-01-20', description: 'Winter Jacket',      amount: 280,    type: 'Expense', category: 'Shopping' },
  { id: 'y5',  date: '2026-01-18', description: 'New Year Flight',    amount: 420,    type: 'Expense', category: 'Travel' },
  { id: 'y6',  date: '2026-01-15', description: 'Dividend Payout',    amount: 180,    type: 'Income',  category: 'Investments' },
  { id: 'y7',  date: '2026-01-12', description: 'Coffee & Lunch',     amount: 60,     type: 'Expense', category: 'Food' },
  { id: 'y8',  date: '2026-01-10', description: 'Electricity Bill',   amount: 120,    type: 'Expense', category: 'Bills' },
  { id: 'y9',  date: '2026-01-08', description: 'Shoe Shopping',      amount: 200,    type: 'Expense', category: 'Shopping' },
  { id: 'y10', date: '2026-01-05', description: 'Bus Pass',           amount: 45,     type: 'Expense', category: 'Travel' },
  { id: 'y11', date: '2026-01-03', description: 'Side Project Income',amount: 600,    type: 'Income',  category: 'Salary' },
  { id: 'y12', date: '2026-01-01', description: 'Software License',   amount: 99,     type: 'Expense', category: 'Bills' },
];

// ── Period filter helpers ──────────────────────────────────────────────
const YEAR  = 2026;
const MONTH_MAP = { 'This Month': 2, 'Last Month': 1, 'Year': null }; // 0-indexed months

export const getTransactionsByPeriod = (period) => {
  return mockTransactions.filter((t) => {
    const d = new Date(t.date);
    if (period === 'This Month') return d.getFullYear() === YEAR && d.getMonth() === 2; // March
    if (period === 'Last Month') return d.getFullYear() === YEAR && d.getMonth() === 1; // February
    return d.getFullYear() === YEAR; // All of 2026
  });
};

// ── Chart data helpers ─────────────────────────────────────────────────
export const getChartDataByPeriod = (period) => {
  if (period === 'This Month') {
    // Daily breakdown for March — group by week
    return [
      { label: 'Mar W1', income: 1800, expenses: 474 },
      { label: 'Mar W2', income: 200,  expenses: 195 },
      { label: 'Mar W3', income: 0,    expenses: 500 },
      { label: 'Mar W4', income: 5000, expenses: 635.50 },
    ];
  }
  if (period === 'Last Month') {
    return [
      { label: 'Feb W1', income: 950,  expenses: 299 },
      { label: 'Feb W2', income: 800,  expenses: 280 },
      { label: 'Feb W3', income: 5000, expenses: 165 },
      { label: 'Feb W4', income: 350,  expenses: 145 },
    ];
  }
  // Year view — monthly aggregates
  return [
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
};