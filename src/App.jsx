// App root — composes the persistent sidebar, main dashboard, and mobile bottom nav
import Sidebar   from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface)',
        fontFamily: "'Manrope', sans-serif",
        color: 'var(--color-on-surface)',
      }}
    >
      <Sidebar />
      <Dashboard />
      <BottomNav />
    </div>
  );
}
