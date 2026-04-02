// Mobile-only bottom navigation — mirrors the sidebar icons, placed at the bottom
import { Home, BarChart2, Landmark, Mail, Clock, Network, FileText, DollarSign } from 'lucide-react';
import { useState } from 'react';

const TABS = [
  { icon: Home,       label: 'Home' },
  { icon: BarChart2,  label: 'Dashboard' },
  { icon: Landmark,   label: 'Bank' },
  { icon: Mail,       label: 'Messages' },
  { icon: Clock,      label: 'Settings' },
  { icon: Network,    label: 'Network' },
  { icon: FileText,   label: 'Reports' },
  { icon: DollarSign, label: 'Wallet' },
];

export default function BottomNav() {
  const [active, setActive] = useState('Dashboard');

  return (
    <>
      <style>{`
        .bottom-nav-wrapper { display: none; }
        @media (max-width: 1023px) {
          .bottom-nav-wrapper { display: block; }
        }
      `}</style>

      {/* Outer wrapper — provides the gap from all screen edges */}
      <div
        className="bottom-nav-wrapper"
        style={{
          position: 'fixed',
          bottom: '12px',
          left: '12px',
          right: '12px',
          zIndex: 50,
        }}
      >
        <nav
          style={{
            backgroundColor: 'var(--c-nav-bg)',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'stretch',
            padding: '0 4px 8px',
            fontFamily: "'Manrope', sans-serif",
            overflow: 'hidden',
          }}
        >
        {TABS.map(({ icon: Icon, label }) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              onClick={() => setActive(label)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.38)',
                fontSize: '10px',
                fontWeight: isActive ? '700' : '400',
                fontFamily: "'Manrope', sans-serif",
                padding: '10px 6px 4px',
                transition: 'color 0.15s ease',
                flex: 1,
                outline: 'none',
              }}
            >
              {/* Top active indicator bar — mirrors sidebar's left bar */}
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: isActive ? '22px' : '0px',
                  height: '3px',
                  backgroundColor: '#ffffff',
                  borderRadius: '0 0 3px 3px',
                  transition: 'width 0.2s ease',
                }}
              />
              <Icon size={19} strokeWidth={isActive ? 2.2 : 1.6} />
              {label}
            </button>
          );
        })}
        </nav>
      </div>
    </>
  );
}

