// Global Zustand store — with localStorage persistence, async mock-API actions, and full filter state
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions } from '../data/mockTransactions';
import { mockApi } from '../api/mockApi';

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

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      allTransactions: mockTransactions,           // full source of truth
      transactions: filterByPeriod(mockTransactions, 'This Month'), // displayed set
      role: 'Admin',
      timePeriod: 'This Month',                    // 'This Month' | 'Last Month' | 'Year'
      theme: 'light',                              // 'light' | 'dark'
      loading: false,                              // true while a mock-API call is in-flight
      apiError: null,                              // string | null

      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),
      clearApiError: () => set({ apiError: null }),

      setTimePeriod: (timePeriod) => set((state) => ({
        timePeriod,
        transactions: filterByPeriod(state.allTransactions, timePeriod),
        searchQuery: '',
        categoryFilter: 'All',
      })),

      addTransaction: async (transaction) => {
        set({ loading: true, apiError: null });
        try {
          await mockApi.createTransaction(transaction);
          set((state) => {
            const updated = [transaction, ...state.allTransactions];
            return {
              allTransactions: updated,
              transactions: filterByPeriod(updated, state.timePeriod),
              loading: false,
            };
          });
        } catch (err) {
          set({ loading: false, apiError: err.message ?? 'Failed to add transaction' });
        }
      },

      editTransaction: async (updated) => {
        set({ loading: true, apiError: null });
        try {
          await mockApi.updateTransaction(updated);
          set((state) => ({
            allTransactions: state.allTransactions.map(t => t.id === updated.id ? updated : t),
            transactions: state.transactions.map(t => t.id === updated.id ? updated : t),
            loading: false,
          }));
        } catch (err) {
          set({ loading: false, apiError: err.message ?? 'Failed to update transaction' });
        }
      },

      deleteTransaction: async (id) => {
        set({ loading: true, apiError: null });
        try {
          await mockApi.deleteTransaction(id);
          set((state) => ({
            allTransactions: state.allTransactions.filter(t => t.id !== id),
            transactions: state.transactions.filter(t => t.id !== id),
            loading: false,
          }));
        } catch (err) {
          set({ loading: false, apiError: err.message ?? 'Failed to delete transaction' });
        }
      },
    }),
    {
      name: 'finance-dashboard-store',
      // Only persist the parts that matter across sessions
      partialize: (state) => ({
        allTransactions: state.allTransactions,
        theme:           state.theme,
        role:            state.role,
        timePeriod:      state.timePeriod,
      }),
      // After rehydration, rebuild the derived `transactions` slice
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.transactions = filterByPeriod(state.allTransactions, state.timePeriod);
        }
      },
    }
  )
);
