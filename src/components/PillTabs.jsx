// Reusable pill-style tab switcher — reads/writes timePeriod from the global Zustand store
import { useFinanceStore } from '../store/useFinanceStore';

export default function PillTabs({ tabs = [], onChange, className = '' }) {
  const { timePeriod, setTimePeriod } = useFinanceStore();

  const handleSelect = (tab) => {
    const value = tab?.value ?? tab;
    setTimePeriod(value);
    onChange?.(value);
  };

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {tabs.map((tab) => {
        const value = tab?.value ?? tab;
        const label = tab?.label ?? tab;
        const isActive = timePeriod === value;

        return (
          <button
            key={value}
            onClick={() => handleSelect(tab)}
            style={{
              padding: '7px 18px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: isActive ? '600' : '500',
              fontFamily: "'Poppins', sans-serif",
              backgroundColor: isActive ? 'var(--c-pill-active-bg)' : 'transparent',
              color: isActive ? 'var(--c-pill-active-text)' : 'var(--c-pill-inactive-text)',
              transition: 'background-color 0.18s ease, color 0.18s ease',
              outline: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
