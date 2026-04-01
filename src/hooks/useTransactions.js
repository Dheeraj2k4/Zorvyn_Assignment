// Custom hook to provide filtered, sorted transactions based on current store state
import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

export const useTransactions = () => {
  const { transactions, searchQuery, categoryFilter, sortConfig } = useFinanceStore();

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((t) => 
        t.description.toLowerCase().includes(lowerQuery) || t.category.toLowerCase().includes(lowerQuery)
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    result.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, searchQuery, categoryFilter, sortConfig]);

  return { transactions: filteredAndSorted };
};