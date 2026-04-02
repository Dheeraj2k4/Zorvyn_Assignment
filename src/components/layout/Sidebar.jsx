// Dark floating sidebar — rounded, spaced from edges, with a left-bar active indicator
import { Home, BarChart2, Landmark, Mail, Clock, Network, FileText, DollarSign, Settings } from 'lucide-react';
import { useState } from 'react';
import logoSvg from '../../assets/logo.svg';

const NAV_ITEMS = [
  { icon: Home,       label: 'Home' },
  { icon: BarChart2,  label: 'Dashboard' },
  { icon: Landmark,   label: 'Bank' },
  { icon: Mail,       label: 'Messages' },
  { icon: Clock,      label: 'Settings' },
  { icon: Network,    label: 'Network' },
  { icon: FileText,   label: 'Reports' },
  { icon: DollarSign, label: 'Wallet' },
];

export default function Sidebar() {
  const [active, setActive] = useState('Dashboard');

  return (
    // Outer wrapper — provides the spacing gap around the floating sidebar
    <div
      className="sidebar-desktop"
      style={{
        padding: '12px 0 12px 12px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexShrink: 0,
        zIndex: 40,
        boxSizing: 'border-box',
      }}
    >
      {/* The floating pill */}
      <aside
        style={{
          width: '72px',
          height: '100%',
          backgroundColor: 'var(--c-nav-bg)',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 0 20px',
          overflow: 'hidden',
        }}
      >
        {/* SVG Logo — invert(1) makes the dark logo white on black bg */}
        <div style={{ marginBottom: '32px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={logoSvg}
            alt="dappr"
            style={{ width: '36px', height: '36px', objectFit: 'contain', filter: 'invert(1)' }}
          />
        </div>

        {/* Nav icons */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%', gap: '4px' }}>
          {NAV_ITEMS.map(({ icon: Icon, label }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                title={label}
                onClick={() => setActive(label)}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '44px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.38)',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.38)';
                }}
              >
                {/* Left active bar indicator */}
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: isActive ? '22px' : '0px',
                    backgroundColor: '#ffffff',
                    borderRadius: '0 3px 3px 0',
                    transition: 'height 0.2s ease',
                  }}
                />
                <Icon size={19} strokeWidth={isActive ? 2.2 : 1.6} />
              </button>
            );
          })}
        </nav>

        {/* Settings pinned at bottom */}
        <button
          title="Settings"
          style={{
            position: 'relative',
            width: '100%',
            height: '44px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            color: 'rgba(255,255,255,0.38)',
            transition: 'color 0.15s ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; }}
        >
          <Settings size={19} strokeWidth={1.6} />
        </button>
      </aside>
    </div>
  );
}

