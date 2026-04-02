// Reusable modal for adding or editing a transaction
import { useState } from 'react';

const CATEGORIES = ['Food', 'Salary', 'Bills', 'Shopping', 'Travel', 'Investments'];

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid var(--c-border)',
  backgroundColor: 'var(--c-input)',
  fontFamily: "'Poppins', sans-serif",
  fontSize: '13px',
  color: 'var(--c-text-1)',
  outline: 'none',
  boxSizing: 'border-box',
};

/**
 * Props:
 *   mode        — 'add' | 'edit'
 *   initial     — transaction object to pre-fill when mode='edit' (optional)
 *   onClose     — () => void
 *   onSave      — (transaction) => void  — receives full tx object
 */
export default function TransactionModal({ mode = 'add', initial = null, onClose, onSave }) {
  const [form, setForm] = useState({
    date:        initial?.date        ?? new Date().toISOString().split('T')[0],
    amount:      initial?.amount      ?? '',
    description: initial?.description ?? '',
    category:    initial?.category    ?? 'Food',
    type:        initial?.type        ?? 'Expense',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const tx = {
      ...(initial ?? {}),
      id:          initial?.id ?? Date.now().toString(),
      description: form.description || form.category,
      date:        form.date,
      amount:      parseFloat(form.amount),
      category:    form.category,
      type:        form.type,
    };
    onSave(tx);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'var(--c-overlay)', backdropFilter: 'blur(3px)',
    }}>
      <div style={{
        backgroundColor: 'var(--c-modal-bg)', borderRadius: '18px', padding: '28px 24px',
        width: '100%', maxWidth: '380px', fontFamily: "'Poppins', sans-serif",
        boxShadow: '0 8px 32px var(--c-modal-shadow)',
        border: '1px solid var(--c-border)',
        margin: '0 16px',
      }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '17px', fontWeight: '700', color: 'var(--c-text-1)' }}>
          {mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c-text-2)', display: 'block', marginBottom: '4px' }}>Description</label>
            <input
              type="text"
              placeholder="e.g. Grocery Market"
              style={inputStyle}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c-text-2)', display: 'block', marginBottom: '4px' }}>Date</label>
            <input type="date" required style={inputStyle} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c-text-2)', display: 'block', marginBottom: '4px' }}>Amount (₹)</label>
            <input
              type="number" required min="0.01" step="0.01" placeholder="0.00"
              style={inputStyle} value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c-text-2)', display: 'block', marginBottom: '4px' }}>Category</label>
            <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c-text-2)', display: 'block', marginBottom: '4px' }}>Type</label>
            <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option>Expense</option>
              <option>Income</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid var(--c-cancel-border)',
              backgroundColor: 'transparent', color: 'var(--c-cancel-text)', fontFamily: "'Poppins', sans-serif",
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}>Cancel</button>
            <button type="submit" style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
              backgroundColor: 'var(--c-btn-dark-bg)', color: 'var(--c-btn-dark-text)', fontFamily: "'Poppins', sans-serif",
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}>{mode === 'edit' ? 'Save Changes' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
