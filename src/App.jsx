// App root — composes the persistent sidebar, main dashboard, and mobile bottom nav
import { useEffect } from 'react';
import Sidebar   from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './pages/Dashboard';
import { useFinanceStore } from './store/useFinanceStore';

export default function App() {
  const theme = useFinanceStore(s => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface)',
        fontFamily: "'Manrope', sans-serif",
        color: 'var(--color-on-surface)',
        transition: 'background-color 0.25s ease, color 0.25s ease',
      }}
    >
      <Sidebar />
      <Dashboard />
      <BottomNav />
    </div>
  );
}
