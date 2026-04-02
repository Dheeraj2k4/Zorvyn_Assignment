// A reusable stat card displaying a label, large value, and optional % change badge
import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function useAnimatedNumber(target, duration = 1300) {
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const frameRef = useRef(null);
  useEffect(() => {
    const from = currentRef.current;
    const startTime = performance.now();
    cancelAnimationFrame(frameRef.current);
    const animate = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = from + (target - from) * eased;
      currentRef.current = next;
      setCurrent(next);
      if (p < 1) frameRef.current = requestAnimationFrame(animate);
      else {
        currentRef.current = target;
        setCurrent(target);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);
  return current;
}

// Exact full rupee format for tooltip
const formatExact = (n) =>
  '\u20B9' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// Shortened display: Cr / L / K for 6+ digits, else full
function formatShort(n) {
  const abs = Math.abs(n);
  if (abs >= 1_00_00_000) return `\u20B9${(n / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000)    return `\u20B9${(n / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000)       return `\u20B9${(n / 1_000).toFixed(2)}K`;
  return `\u20B9${n.toFixed(2)}`;
}

function formatValue(n, isCurrency) {
  if (!isCurrency) return Math.round(n).toString();
  return formatShort(n);
}

export default function StatCard({ label, value, isCurrency = true, badge, badgePositive, className = '' }) {
  const numericValue = typeof value === 'number' ? value : 0;
  const animated = useAnimatedNumber(numericValue);
  const displayValue = formatValue(animated, isCurrency);
  const exactValue = isCurrency ? formatExact(numericValue) : String(numericValue);
  // Only show tooltip when value is shortened (6+ digits)
  const isShortened = isCurrency && Math.abs(numericValue) >= 1_000;
  const [showTip, setShowTip] = useState(false);

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        boxShadow: 'var(--shadow-float)',
        fontFamily: "'Poppins', sans-serif",
        flex: 1,
        minWidth: 0,
      }}
      className={className}
    >
      <span
        style={{
          fontSize: '12px',
          fontWeight: '600',
          color: 'var(--color-on-surface-variant)',
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </span>

      {/* Value row with optional badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Value with hover tooltip */}
        <span
          style={{ position: 'relative', cursor: isShortened ? 'help' : 'default' }}
          onMouseEnter={() => isShortened && setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
        >
          <span
            style={{
              fontSize: '1.65rem',
              fontWeight: '800',
              fontFamily: "'Poppins', sans-serif",
              color: 'var(--color-on-surface)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            {displayValue}
          </span>
          {/* Exact value bubble */}
          {showTip && (
            <span
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 6px)',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#1a1f2e',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif",
                padding: '5px 10px',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                zIndex: 50,
                pointerEvents: 'none',
              }}
            >
              {exactValue}
            </span>
          )}
        </span>

        {badge && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              padding: '3px 8px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: '700',
              backgroundColor: badgePositive ? 'var(--c-income-badge-bg)' : 'var(--c-expense-badge-bg)',
              color: badgePositive ? 'var(--c-income-badge-text)' : 'var(--c-expense-badge-text)',
            }}
          >
            {badgePositive
              ? <TrendingUp size={11} strokeWidth={2.5} />
              : <TrendingDown size={11} strokeWidth={2.5} />
            }
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
