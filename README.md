# Finance Dashboard

A clean, responsive, and interactive personal finance dashboard built with React, Zustand, and Recharts. Users can track their financial activity, explore transactions, understand spending patterns, and switch between role-based views — all driven by mock data on the frontend.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 19 + Vite | Fast dev/build with modern React features |
| Styling | Tailwind CSS v4 + inline styles | Utility classes for layout, inline styles for component-level theming |
| State | Zustand | Lightweight, hook-based global state without boilerplate |
| Charts | Recharts | Composable, responsive chart primitives |
| Icons | Lucide React | Consistent, tree-shakeable SVG icon set |

---

## How to Run

1. Ensure Node ≥ 18 is installed.
2. Navigate to the project folder:
   ```
   cd finance-dashboard
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open the URL printed in the terminal (usually `http://localhost:5173`).

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, DashboardHeader (role switcher), BottomNav
│   ├── insights/        # InsightsPanel — computed stats sidebar
│   ├── StatCard.jsx     # Animated summary metric card
│   ├── IncomeVsExpensesChart.jsx  # Area chart — time-based visualization
│   ├── SpendingCategoryChart.jsx  # Donut chart — categorical breakdown
│   ├── RecentTransactions.jsx     # Full transactions table with filters and sorting
│   ├── TransactionModal.jsx       # Add / Edit modal form
│   └── DropdownSelect.jsx         # Reusable styled dropdown
├── data/
│   └── mockTransactions.js        # Static mock data (Jan–Mar 2026) + chart helpers
├── hooks/
│   └── useTransactions.js         # Memoized filter + sort hook
├── pages/
│   └── Dashboard.jsx              # Main page — assembles all sections
├── store/
│   └── useFinanceStore.js         # Zustand store — single source of truth
└── utils/
    └── helpers.js                 # Currency and date formatters
```

---

## Feature Walkthrough

### 1. Dashboard Overview
- **Summary cards**: Total Balance, Total Income, Total Expenses, and Savings — all animated with an easing number counter on load/update.
- **Time-based chart**: `IncomeVsExpensesChart` — a smooth area chart (Recharts) comparing income vs expenses per week or per month, depending on the selected time period.
- **Categorical chart**: `SpendingCategoryChart` — a donut chart (Recharts) breaking down expenses by category with percentage labels and a legend.
- **Time period tabs**: "This Month", "Last Month", "Year" — switching re-filters all charts and stats simultaneously.

### 2. Transactions Section
- Full table showing: **Date**, **Description**, **Amount**, **Category**, **Type**.
- **Search**: Filters by description or category in real time.
- **Category filter**: Dropdown to isolate a specific spending category.
- **Sorting**: Click the **Date** or **Amount** column header to toggle ascending/descending sort.
- **Empty state**: Displays a friendly "No transactions found" message when filters return nothing.

### 3. Role-Based UI
- Toggle between **Admin** and **Viewer** using the dropdown in the dashboard header.
- **Admin**: Can add new transactions (modal form), edit existing ones (inline edit modal), and delete with a confirmation dialog.
- **Viewer**: All mutation controls (Add, Edit, Delete buttons) are hidden — read-only view of data.
- No backend or auth required — role is stored in the Zustand store and drives conditional rendering.

### 4. Insights Section
- **Highest Spending Category**: Computed live from the current period's transactions.
- **Monthly Change %**: Dynamically calculated by comparing March 2026 vs February 2026 total expenses.
- **Insight Tip**: A contextual message highlighting the top spending category and its total amount.
- On mobile, a condensed two-card version of these insights is shown inline in the main content area.

### 5. State Management (Zustand)
All application state lives in `useFinanceStore`:
- `allTransactions` — the authoritative transaction list (persists add/edit/delete).
- `transactions` — the current-period-filtered view derived from `allTransactions`.
- `role` — `'Admin'` or `'Viewer'`, drives RBAC rendering.
- `timePeriod` — `'This Month'`, `'Last Month'`, or `'Year'`.
- `searchQuery`, `categoryFilter`, `sortConfig` — exposed for the `useTransactions` hook.

### 6. Responsive Design
- **Desktop**: Floating dark icon sidebar on the left + main content + right insights panel.
- **Mobile**: Sidebar is hidden; a bottom navigation bar replaces it. The right insights panel collapses into an inline card row within the main content.
- Breakpoints are handled via Tailwind utility classes (`sidebar-desktop`, `db-insights`, `db-mobile-insights`).

---

## Assumptions

- Date range is fixed to Jan–Mar 2026 to match the mock data.
- "Monthly Change" always compares March (current) vs February (previous) regardless of the selected time period tab — this reflects the most recent real comparison.
- The savings figure is derived from a fixed 3.4% rate applied to the net balance (income − expenses) as an illustrative metric.
- No backend, authentication, or persistent storage is implemented — this is a pure frontend evaluation project.

---

## Optional Enhancements Included

- Animated number counters on all StatCards.
- Sortable table columns (Date, Amount).
- Delete confirmation dialog to prevent accidental data loss.
- Contextual dynamic insight tip based on actual spending data.
