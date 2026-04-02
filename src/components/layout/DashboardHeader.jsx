// Top header with greeting, role dropdown, theme toggle, and utility icon group
import { useFinanceStore } from '../../store/useFinanceStore';
import { Calendar, Timer, Bell, Sun, Moon } from 'lucide-react';
import DropdownSelect from '../DropdownSelect';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

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
          {getGreeting()}, Dheeraj!
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

        {/* Bell with notification dot */}
        <button
          title="Notifications"
          style={{ ...utilityIconStyle, position: 'relative', border: '1.5px solid var(--c-border)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)'; }}
        >
          <Bell size={17} strokeWidth={1.75} />
          <span
            style={{
              position: 'absolute',
              top: '7px',
              right: '7px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              border: '1.5px solid var(--color-surface-container-low)',
            }}
          />
        </button>

        {/* Avatar — user initials */}
        <div
          title="Profile"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-tertiary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '4px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#ffffff',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '0.03em',
            }}
          >
            DJ
          </span>
        </div>
      </div>
    </div>
  );
}
