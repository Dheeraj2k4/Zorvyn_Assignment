// Top header with greeting, role dropdown, theme toggle, and utility icon group
import { useFinanceStore } from '../../store/useFinanceStore';
import { Calendar, Timer, Bell, User, Sun, Moon } from 'lucide-react';
import DropdownSelect from '../DropdownSelect';

export default function DashboardHeader() {
  const { role, setRole, theme, setTheme } = useFinanceStore();
  const isDark = theme === 'dark';

  const utilityIconStyle = {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-surface-container-low)',
    color: 'var(--c-text-2)',
    transition: 'background-color 0.15s ease',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {/* Left: Greeting + role switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '2rem',
            fontWeight: '800',
            fontFamily: "'Poppins', sans-serif",
            color: 'var(--color-on-surface)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          Good morning, Dheeraj!
        </h1>

        {/* Role dropdown */}
        <DropdownSelect
          options={['Admin', 'Viewer']}
          value={role}
          onChange={setRole}
        />

      </div>

      {/* Right: theme toggle + utility icons + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

        {/* Dark / Light mode toggle */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '9999px',
            border: `1px solid var(--c-border)`,
            backgroundColor: 'var(--color-surface-container-low)',
            color: 'var(--c-text-2)',
            cursor: 'pointer',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '12px',
            fontWeight: '600',
            transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
            marginRight: '4px',
          }}
        >
          {isDark
            ? <Sun size={14} strokeWidth={2} />
            : <Moon size={14} strokeWidth={2} />
          }
          {isDark ? 'Light' : 'Dark'}
        </button>

        {[
          { Icon: Calendar, label: 'Calendar' },
          { Icon: Timer,    label: 'Timer' },
          { Icon: Bell,     label: 'Notifications' },
        ].map(({ Icon, label }) => (
          <button
            key={label}
            title={label}
            style={utilityIconStyle}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)'; }}
          >
            <Icon size={17} strokeWidth={1.75} />
          </button>
        ))}

        {/* Avatar circle */}
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface-container-highest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '4px',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          <User size={19} color="#5f5e5e" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
