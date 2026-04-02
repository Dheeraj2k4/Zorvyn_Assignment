// Reusable Recent Transactions panel with search, advanced filters, export, and add/edit/delete actions
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { Pencil, Trash2, Search, Plus, Download, SlidersHorizontal, X, FileJson, FileText } from 'lucide-react';
import DropdownSelect from './DropdownSelect';
import TransactionModal from './TransactionModal';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';

const CATEGORIES = ['All', 'Food', 'Salary', 'Bills', 'Shopping', 'Travel', 'Investments'];
const TYPE_OPTIONS = ['All', 'Income', 'Expense'];

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const day   = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year  = d.getFullYear();
  return `${day}/${month}/${year}`;
};

function DeleteConfirmModal({ transaction, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      <motion.div
        key="del-overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'var(--c-overlay)', backdropFilter: 'blur(3px)',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      >
        <motion.div
          key="del-card"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          style={{
            backgroundColor: 'var(--c-card)', borderRadius: '18px', padding: '28px 24px',
            width: '100%', maxWidth: '340px', fontFamily: "'Poppins', sans-serif",
            boxShadow: '0 8px 32px var(--c-modal-shadow)', textAlign: 'center',
            border: '1px solid var(--c-border)', margin: '0 16px',
          }}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            backgroundColor: 'var(--c-expense-badge-bg)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Trash2 size={22} color="var(--c-expense-badge-text)" />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)' }}>
            Delete Transaction?
          </h3>
          <p style={{ margin: '0 0 24px', fontSize: '13px', color: 'var(--c-text-3)', lineHeight: 1.6 }}>
            Are you sure you want to delete <strong>{transaction.description}</strong>? This cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onCancel} style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid var(--c-cancel-border)',
              backgroundColor: 'transparent', color: 'var(--c-cancel-text)', fontFamily: "'Poppins', sans-serif",
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}>Cancel</button>
            <button onClick={onConfirm} style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
              backgroundColor: '#ba1a1a', color: '#fff', fontFamily: "'Poppins', sans-serif",
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}>Delete</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function RecentTransactions({ isAdmin = true }) {
  const { transactions, addTransaction, editTransaction, deleteTransaction, loading, apiError, clearApiError } = useFinanceStore();

  // Basic filters
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort]         = useState({ key: 'date', dir: 'desc' });

  // Advanced filters
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [typeFilter, setTypeFilter]     = useState('All');
  const [amountMin, setAmountMin]       = useState('');
  const [amountMax, setAmountMax]       = useState('');
  const [dateFrom, setDateFrom]         = useState('');
  const [dateTo, setDateTo]             = useState('');

  // Modal state
  const [addModal, setAddModal] = useState(false);
  const [editTx, setEditTx]     = useState(null);
  const [deleteTx, setDeleteTx] = useState(null);

  // Export dropdown
  const [exportOpen, setExportOpen] = useState(false);

  const handleSort = (key) => {
    setSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const clearAdvanced = () => {
    setTypeFilter('All');
    setAmountMin('');
    setAmountMax('');
    setDateFrom('');
    setDateTo('');
  };

  const hasAdvancedFilters = typeFilter !== 'All' || amountMin !== '' || amountMax !== '' || dateFrom !== '' || dateTo !== '';

  const filtered = useMemo(() => {
    const minAmt = amountMin !== '' ? parseFloat(amountMin) : null;
    const maxAmt = amountMax !== '' ? parseFloat(amountMax) : null;
    const from   = dateFrom ? new Date(dateFrom) : null;
    const to     = dateTo   ? new Date(dateTo)   : null;

    const result = transactions.filter(t => {
      const matchSearch  = t.category.toLowerCase().includes(search.toLowerCase()) ||
                           t.description.toLowerCase().includes(search.toLowerCase());
      const matchCat     = category === 'All' || t.category === category;
      const matchType    = typeFilter === 'All' || t.type === typeFilter;
      const matchMinAmt  = minAmt === null || t.amount >= minAmt;
      const matchMaxAmt  = maxAmt === null || t.amount <= maxAmt;
      const txDate       = new Date(t.date);
      const matchFrom    = !from || txDate >= from;
      const matchTo      = !to   || txDate <= to;
      return matchSearch && matchCat && matchType && matchMinAmt && matchMaxAmt && matchFrom && matchTo;
    });

    return [...result].sort((a, b) => {
      if (sort.key === 'amount') {
        return sort.dir === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      return sort.dir === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });
  }, [transactions, search, category, sort, typeFilter, amountMin, amountMax, dateFrom, dateTo]);

  const th = {
    padding: '10px 0',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--c-text-1)',
    textAlign: 'left',
    fontFamily: "'Poppins', sans-serif",
    borderBottom: '2px solid var(--c-border)',
  };

  const td = {
    padding: '14px 0',
    fontSize: '13px',
    color: 'var(--c-text-2)',
    fontFamily: "'Poppins', sans-serif",
    borderBottom: '1px solid var(--c-divider)',
  };

  const inputSm = {
    padding: '7px 10px',
    borderRadius: '8px',
    border: '1px solid var(--c-border)',
    backgroundColor: 'var(--c-input)',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '12px',
    color: 'var(--c-text-2)',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      backgroundColor: 'var(--c-panel)',
      borderRadius: '20px',
      padding: '24px',
      fontFamily: "'Poppins', sans-serif",
      width: '100%',
      boxSizing: 'border-box',
    }}>

      {/* API Error Banner */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              backgroundColor: 'var(--c-expense-badge-bg)',
              color: 'var(--c-expense-badge-text)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '14px',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>⚠ {apiError}</span>
            <button onClick={clearApiError} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading bar */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{
              height: '3px',
              backgroundColor: 'var(--c-income-text)',
              borderRadius: '2px',
              marginBottom: '12px',
              transformOrigin: 'left',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Header row ─────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--c-text-1)' }}>
          Recent Transactions
          {filtered.length !== transactions.length && (
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--c-text-3)', marginLeft: '8px' }}>
              ({filtered.length} of {transactions.length})
            </span>
          )}
        </h3>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Export dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setExportOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', borderRadius: '10px',
                border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input)',
                color: 'var(--c-text-2)', fontFamily: "'Poppins', sans-serif",
                fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              }}
            >
              <Download size={14} />
              Export
            </button>
            <AnimatePresence>
              {exportOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100,
                    backgroundColor: 'var(--c-dropdown-bg)',
                    border: '1px solid var(--c-border)',
                    borderRadius: '12px', overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    minWidth: '140px',
                  }}
                >
                  {[
                    { label: 'Export CSV',  icon: FileText, action: () => { exportToCSV(filtered);  setExportOpen(false); } },
                    { label: 'Export JSON', icon: FileJson, action: () => { exportToJSON(filtered); setExportOpen(false); } },
                  ].map(({ label, icon: Icon, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        width: '100%', padding: '10px 16px',
                        border: 'none', backgroundColor: 'transparent',
                        color: 'var(--c-text-1)', fontFamily: "'Poppins', sans-serif",
                        fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--c-dropdown-hover)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Advanced filter toggle */}
          <button
            onClick={() => setShowAdvanced(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '8px 14px', borderRadius: '10px',
              border: `1px solid ${hasAdvancedFilters ? 'var(--c-income-text)' : 'var(--c-border)'}`,
              backgroundColor: hasAdvancedFilters ? 'var(--c-income-badge-bg)' : 'var(--c-input)',
              color: hasAdvancedFilters ? 'var(--c-income-text)' : 'var(--c-text-2)',
              fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={14} />
            Filters {hasAdvancedFilters && `(${[typeFilter !== 'All', amountMin, amountMax, dateFrom, dateTo].filter(Boolean).length})`}
          </button>

          {/* Add Transaction (Admin only) */}
          {isAdmin && (
            <button
              onClick={() => setAddModal(true)}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 18px', borderRadius: '10px', border: 'none',
                backgroundColor: 'var(--c-btn-dark-bg)', color: 'var(--c-btn-dark-text)',
                fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Plus size={15} strokeWidth={2.5} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* ── Basic Filters row ───────────────────────────── */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: showAdvanced ? '12px' : '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '160px', maxWidth: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-4)' }} />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 34px',
              borderRadius: '10px', border: '1px solid var(--c-border)',
              backgroundColor: 'var(--c-input)', fontFamily: "'Poppins', sans-serif",
              fontSize: '13px', color: 'var(--c-text-2)', outline: 'none', boxSizing: 'border-box',
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

      {/* ── Advanced Filters panel ──────────────────────── */}
      <AnimatePresence initial={false}>
        {showAdvanced && (
          <motion.div
            key="adv-filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              backgroundColor: 'var(--c-input)',
              borderRadius: '14px',
              border: '1px solid var(--c-border)',
              padding: '16px',
              marginBottom: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
            }}>
              {/* Type */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-text-3)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {TYPE_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setTypeFilter(opt)}
                      style={{
                        flex: 1, padding: '5px 0', borderRadius: '7px',
                        border: `1px solid ${typeFilter === opt ? 'var(--c-income-text)' : 'var(--c-border)'}`,
                        backgroundColor: typeFilter === opt ? 'var(--c-income-badge-bg)' : 'transparent',
                        color: typeFilter === opt ? 'var(--c-income-text)' : 'var(--c-text-3)',
                        fontFamily: "'Poppins', sans-serif", fontSize: '12px', fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >{opt}</button>
                  ))}
                </div>
              </div>

              {/* Amount Min */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-text-3)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Min Amount (₹)</label>
                <input type="number" placeholder="0" min="0" style={inputSm} value={amountMin} onChange={e => setAmountMin(e.target.value)} />
              </div>

              {/* Amount Max */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-text-3)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Max Amount (₹)</label>
                <input type="number" placeholder="∞" min="0" style={inputSm} value={amountMax} onChange={e => setAmountMax(e.target.value)} />
              </div>

              {/* Date From */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-text-3)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>From Date</label>
                <input type="date" style={inputSm} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              </div>

              {/* Date To */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-text-3)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>To Date</label>
                <input type="date" style={inputSm} value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </div>

              {/* Clear */}
              {hasAdvancedFilters && (
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    onClick={clearAdvanced}
                    style={{
                      width: '100%', padding: '7px', borderRadius: '8px',
                      border: '1px solid var(--c-cancel-border)',
                      backgroundColor: 'transparent', color: 'var(--c-text-3)',
                      fontFamily: "'Poppins', sans-serif", fontSize: '12px', fontWeight: '600',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                    }}
                  >
                    <X size={12} /> Clear Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Table ──────────────────────────────────────── */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...th, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }} onClick={() => handleSort('date')}>
                Date {sort.key === 'date' ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="tx-col-desc" style={th}>Description</th>
              <th style={{ ...th, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }} onClick={() => handleSort('amount')}>
                Amount {sort.key === 'amount' ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th style={{ ...th, whiteSpace: 'nowrap' }}>Category</th>
              <th style={{ ...th, whiteSpace: 'nowrap' }}>Type</th>
              {isAdmin && <th style={{ ...th, textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} style={{ ...td, textAlign: 'center', color: 'var(--c-text-4)', padding: '32px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <SlidersHorizontal size={28} strokeWidth={1.5} />
                    <span>No transactions match your filters</span>
                    {hasAdvancedFilters && (
                      <button
                        onClick={clearAdvanced}
                        style={{ fontSize: '12px', color: 'var(--c-income-text)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                      >Clear advanced filters</button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence initial={false}>
                {filtered.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.2, delay: i < 8 ? i * 0.03 : 0 }}
                  >
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{formatDate(tx.date)}</td>
                    <td className="tx-col-desc" style={{ ...td, maxWidth: '180px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                        {tx.description}
                      </div>
                    </td>
                    <td style={{ ...td, fontWeight: '600', color: tx.type === 'Income' ? 'var(--c-income-text)' : 'var(--c-text-1)' }}>
                      {formatCurrency(tx.amount)}
                    </td>
                    <td style={td}>{tx.category}</td>
                    <td style={td}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: tx.type === 'Income' ? 'var(--c-income-badge-bg)' : 'var(--c-expense-badge-bg)',
                        color: tx.type === 'Income' ? 'var(--c-income-badge-text)' : 'var(--c-expense-badge-text)',
                      }}>
                        {tx.type}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ ...td, textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end' }}>
                          <button
                            title="Edit"
                            onClick={() => setEditTx(tx)}
                            disabled={loading}
                            style={{ background: 'none', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', color: 'var(--c-text-4)', padding: 0, opacity: loading ? 0.5 : 1 }}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => setDeleteTx(tx)}
                            disabled={loading}
                            style={{ background: 'none', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', color: '#ba1a1a', padding: 0, opacity: loading ? 0.5 : 1 }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Add modal */}
      {addModal && (
        <TransactionModal mode="add" onClose={() => setAddModal(false)} onSave={addTransaction} />
      )}

      {/* Edit modal */}
      {editTx && (
        <TransactionModal mode="edit" initial={editTx} onClose={() => setEditTx(null)} onSave={editTransaction} />
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
