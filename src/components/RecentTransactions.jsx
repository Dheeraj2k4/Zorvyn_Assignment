// Reusable Recent Transactions panel with search, category filter, add/edit/delete actions
import { useState, useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Pencil, Trash2, Search, Plus } from 'lucide-react';
import DropdownSelect from './DropdownSelect';
import TransactionModal from './TransactionModal';

const CATEGORIES = ['All', 'Food', 'Salary', 'Bills', 'Shopping', 'Travel', 'Investments'];

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

function DeleteConfirmModal({ transaction, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(3px)',
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '18px', padding: '28px 24px',
        width: '100%', maxWidth: '340px', fontFamily: "'Poppins', sans-serif",
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)', textAlign: 'center',
        margin: '0 16px',
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <Trash2 size={22} color="#ba1a1a" />
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '700', color: '#111827' }}>
          Delete Transaction?
        </h3>
        <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
          Are you sure you want to delete <strong>{transaction.description}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db',
            backgroundColor: 'transparent', color: '#374151', fontFamily: "'Poppins', sans-serif",
            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
            backgroundColor: '#ba1a1a', color: '#fff', fontFamily: "'Poppins', sans-serif",
            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function RecentTransactions({ isAdmin = true }) {
  const { transactions, addTransaction, editTransaction, deleteTransaction } = useFinanceStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [addModal, setAddModal] = useState(false);
  const [editTx, setEditTx] = useState(null);   // transaction being edited
  const [deleteTx, setDeleteTx] = useState(null); // transaction pending delete confirm

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || t.category === category;
      return matchSearch && matchCat;
    });
  }, [transactions, search, category]);

  const th = {
    padding: '10px 0',
    fontSize: '13px',
    fontWeight: '700',
    color: '#111827',
    textAlign: 'left',
    fontFamily: "'Poppins', sans-serif",
    borderBottom: '2px solid #b8ccd6',
  };

  const td = {
    padding: '14px 0',
    fontSize: '13px',
    color: '#374151',
    fontFamily: "'Poppins', sans-serif",
    borderBottom: '1px solid #c5d8e2',
  };

  return (
    <div style={{
      backgroundColor: '#d6e8f0',
      borderRadius: '20px',
      padding: '24px',
      fontFamily: "'Poppins', sans-serif",
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>Recent Transactions</h3>
        {isAdmin && (
          <button
            onClick={() => setAddModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '10px', border: 'none',
              backgroundColor: '#111827', color: '#fff',
              fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Transaction
          </button>
        )}
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '160px', maxWidth: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7a90a0' }} />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 34px',
              borderRadius: '10px', border: '1px solid #b8ccd6',
              backgroundColor: '#eaf3f7', fontFamily: "'Poppins', sans-serif",
              fontSize: '13px', color: '#374151', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <DropdownSelect
          options={CATEGORIES}
          value={category}
          onChange={setCategory}
          labelMap={{ All: 'Category' }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Date</th>
              <th style={th}>Amount</th>
              <th style={th}>Category</th>
              <th style={th}>Type</th>
              {isAdmin && <th style={{ ...th, textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} style={{ ...td, textAlign: 'center', color: '#7a90a0', padding: '28px 0' }}>
                  No transactions found
                </td>
              </tr>
            ) : (
              filtered.map(tx => (
                <tr key={tx.id}>
                  <td style={td}>{formatDate(tx.date)}</td>
                  <td style={{ ...td, fontWeight: '600', color: tx.type === 'Income' ? '#2ab5a5' : '#111827' }}>
                    {formatCurrency(tx.amount)}
                  </td>
                  <td style={td}>{tx.category}</td>
                  <td style={td}>{tx.type}</td>
                  {isAdmin && (
                    <td style={{ ...td, textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end' }}>
                        <button
                          title="Edit"
                          onClick={() => setEditTx(tx)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a90a0', padding: 0 }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => setDeleteTx(tx)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ba1a1a', padding: 0 }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add modal */}
      {addModal && (
        <TransactionModal
          mode="add"
          onClose={() => setAddModal(false)}
          onSave={addTransaction}
        />
      )}

      {/* Edit modal */}
      {editTx && (
        <TransactionModal
          mode="edit"
          initial={editTx}
          onClose={() => setEditTx(null)}
          onSave={editTransaction}
        />
      )}

      {/* Delete confirmation */}
      {deleteTx && (
        <DeleteConfirmModal
          transaction={deleteTx}
          onConfirm={() => { deleteTransaction(deleteTx.id); setDeleteTx(null); }}
          onCancel={() => setDeleteTx(null)}
        />
      )}
    </div>
  );
}
