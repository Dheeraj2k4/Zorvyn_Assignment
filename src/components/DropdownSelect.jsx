// Reusable dark-pill dropdown — matches the role switcher design from DashboardHeader
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

/**
 * Props:
 *   options   — array of strings (option values)
 *   value     — currently selected value
 *   onChange  — (value: string) => void
 *   labelMap  — optional { [value]: displayLabel } to show different text for a value
 */
export default function DropdownSelect({ options = [], value, onChange, labelMap = {} }) {
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState({});
  const triggerRef = useRef(null);
  const ref = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      const inTrigger = ref.current?.contains(e.target);
      const inPanel = panelRef.current?.contains(e.target);
      if (!inTrigger && !inPanel) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelStyle({
        position: 'fixed',
        top: rect.bottom + 6,
        left: rect.left,
        zIndex: 9999,
      });
    }
    setOpen((o) => !o);
  };

  const getLabel = (v) => labelMap[v] ?? v;

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      {/* Trigger pill */}
      <button
        ref={triggerRef}
        onClick={handleOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '8px 16px',
          borderRadius: '9999px',
          border: 'none',
          backgroundColor: 'var(--c-btn-dark-bg)',
          color: 'var(--c-btn-dark-text)',
          cursor: 'pointer',
          fontFamily: "'Manrope', sans-serif",
          fontSize: '13px',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          transition: 'opacity 0.15s ease',
        }}
      >
        {getLabel(value)}
        <ChevronDown
          size={13}
          style={{
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Dropdown panel — rendered in a portal so it escapes all scroll/overflow containers */}
      {open && createPortal(
        <div
          ref={panelRef}
          style={{
            ...panelStyle,
            backgroundColor: 'var(--c-dropdown-bg)',
            borderRadius: '14px',
            overflow: 'hidden',
            border: '1px solid var(--c-border)',
            boxShadow: '0 12px 40px rgba(20,29,31,0.12)',
            minWidth: '160px',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '11px 18px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '13px',
                fontWeight: value === opt ? '700' : '500',
                backgroundColor: value === opt ? 'var(--c-dropdown-selected)' : 'transparent',
                color: 'var(--c-text-1)',
                transition: 'background-color 0.12s ease',
              }}
              onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.backgroundColor = 'var(--c-dropdown-hover)'; }}
              onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {getLabel(opt)}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
