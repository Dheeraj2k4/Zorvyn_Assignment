// Global Zustand store for managing transactions, user role, filter/sort config, and selected time period
import { create } from 'zustand';
import { mockTransactions } from '../data/mockTransactions';

// Filter any array of transactions by period — used everywhere instead of the static-import version
const filterByPeriod = (arr, period) => {
  const YEAR = 2026;
  return arr.filter((t) => {
    const d = new Date(t.date);
    if (period === 'This Month') return d.getFullYear() === YEAR && d.getMonth() === 2;
    if (period === 'Last Month') return d.getFullYear() === YEAR && d.getMonth() === 1;
    return d.getFullYear() === YEAR;
  });
};

export const useFinanceStore = create((set, get) => ({
  allTransactions: mockTransactions,           // full source of truth
  transactions: filterByPeriod(mockTransactions, 'This Month'), // displayed set
  role: 'Admin',
  searchQuery: '',
  categoryFilter: 'All',
  sortConfig: { key: 'date', direction: 'desc' },
  timePeriod: 'This Month',                    // 'This Month' | 'Last Month' | 'Year'

  setRole: (role) => set({ role }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setSortConfig: (sortConfig) => set({ sortConfig }),

  setTimePeriod: (timePeriod) => set((state) => ({
    timePeriod,
    transactions: filterByPeriod(state.allTransactions, timePeriod),
    searchQuery: '',
    categoryFilter: 'All',
  })),

  addTransaction: (transaction) => set((state) => {
    const updated = [transaction, ...state.allTransactions];
    return {
      allTransactions: updated,
      transactions: filterByPeriod(updated, state.timePeriod),
    };
  }),

  editTransaction: (updated) => set((state) => ({
    allTransactions: state.allTransactions.map(t => t.id === updated.id ? updated : t),
    transactions: state.transactions.map(t => t.id === updated.id ? updated : t),
  })),

  deleteTransaction: (id) => set((state) => ({
    allTransactions: state.allTransactions.filter(t => t.id !== id),
    transactions: state.transactions.filter(t => t.id !== id),
  })),
}));