import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const C = {
  bg: '#f0f4ff',
  primary: '#4338ca',
  primaryLight: '#eef2ff',
  text: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',
  red: '#dc2626',
};

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const modules = [
    { title: 'Attendance Management', desc: 'Create lectures, view attendance, detect proxy flags', icon: '📅', color: '#059669', bg: '#ecfdf5', path: '/teacher/attendance' },
    { title: 'Assignment Management', desc: 'Create assignments and update submission statuses', icon: '📝', color: '#d97706', bg: '#fffbeb', path: '/teacher/assignments' },
    { title: 'Marks Management', desc: 'Add and update internal, CAP, mid-term and end-term marks', icon: '🏆', color: '#7c3aed', bg: '#faf5ff', path: '/teacher/marks' },
    { title: 'Student Comments', desc: 'View all student feedback and comments', icon: '💬', color: '#0891b2', bg: '#f0f9ff', path: '/teacher/comments' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: `1px solid ${C.border}`, padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🎓</span>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', color: C.primary }}>AttendX</span>
          <span style={{ marginLeft: '0.5rem', background: C.primaryLight, color: C.primary, fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>TEACHER</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.875rem', color: C.muted, fontWeight: '600' }}>{user?.name}</span>
          <button onClick={handleLogout} style={{ padding: '0.4rem 0.9rem', borderRadius: '8px', border: '1.5px solid #fca5a5', background: 'transparent', color: C.red, cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: C.text, margin: '0 0 0.5rem 0' }}>
          Welcome, {user?.name} 👋
        </h1>
        <p style={{ color: C.muted, marginBottom: '3rem', fontSize: '1rem' }}>Select a module to manage your class</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {modules.map((mod, i) => (
            <div key={i} onClick={() => navigate(mod.path)}
              style={{ background: 'white', borderRadius: '16px', padding: '2rem', cursor: 'pointer', border: `1px solid ${C.border}`, transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: mod.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                {mod.icon}
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '700', color: C.text }}>{mod.title}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: C.muted, lineHeight: 1.6 }}>{mod.desc}</p>
              <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', fontWeight: '700', color: mod.color }}>
                Open →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}