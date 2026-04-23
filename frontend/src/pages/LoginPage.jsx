import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'student', enrollmentNumber: '', semester: '', class: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email: form.email, password: form.password });
      loginUser(res.data.token, res.data.user);
      navigate(res.data.user.role === 'teacher' ? '/teacher' : '/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        enrollmentNumber: form.enrollmentNumber,
        semester: form.semester,
        class: form.class,
      });
      loginUser(res.data.token, res.data.user);
      navigate(res.data.user.role === 'teacher' ? '/teacher' : '/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrapper}>
      {/* ─── LEFT PANE ─── */}
      <div style={s.leftPane}>
        <div style={s.brandBlock}>
          <div style={s.logoIcon}>🎓</div>
          <h1 style={s.brandTitle}>AttendX</h1>
          <p style={s.brandSub}>Smart Attendance Management System</p>
          <div style={s.featureList}>
            {['Track attendance in real-time','Manage assignments effortlessly',
              'Monitor academic performance','Collaborative feedback system'].map((f, i) => (
              <div key={i} style={s.featureItem}>
                <span style={s.featureDot}>◆</span><span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANE ─── */}
      <div style={s.rightPane}>
        <div style={s.card}>
          {/* Tabs */}
          <div style={s.tabs}>
            <button style={{ ...s.tab, ...(tab === 'login' ? s.tabActive : {}) }}
              onClick={() => { setTab('login'); setError(''); }}>
              Sign In
            </button>
            <button style={{ ...s.tab, ...(tab === 'register' ? s.tabActive : {}) }}
              onClick={() => { setTab('register'); setError(''); }}>
              Create Account
            </button>
          </div>

          {error && <div style={s.errorBox}>{error}</div>}

          {/* ─── LOGIN FORM ─── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} style={s.form}>
              <div style={s.header}>
                <h2 style={s.title}>Welcome Back</h2>
                <p style={s.sub}>Sign in with your registered email</p>
              </div>
              <Field label="Email Address" type="email" value={form.email}
                onChange={update('email')} placeholder="you@example.com" />
              <Field label="Password" type="password" value={form.password}
                onChange={update('password')} placeholder="••••••••" />
              <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
              <p style={s.switchHint}>
                No account?{' '}
                <span style={s.link} onClick={() => { setTab('register'); setError(''); }}>
                  Create one free
                </span>
              </p>
            </form>
          )}

          {/* ─── REGISTER FORM ─── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} style={s.form}>
              <div style={s.header}>
                <h2 style={s.title}>Create Account</h2>
                <p style={s.sub}>Register with any Gmail or email address</p>
              </div>
              <Field label="Full Name" value={form.name} onChange={update('name')} placeholder="Arjun Sharma" />
              <Field label="Email Address" type="email" value={form.email}
                onChange={update('email')} placeholder="you@gmail.com" />

              {/* Role selector */}
              <div style={s.fieldGroup}>
                <label style={s.label}>I am a</label>
                <div style={s.roleRow}>
                  {['student', 'teacher'].map(r => (
                    <button key={r} type="button"
                      onClick={() => setForm(f => ({ ...f, role: r }))}
                      style={{ ...s.roleBtn, ...(form.role === r ? s.roleBtnActive : {}) }}>
                      {r === 'student' ? '🎒 Student' : '👨‍🏫 Teacher'}
                    </button>
                  ))}
                </div>
              </div>

              {form.role === 'student' && (
                <div style={s.row}>
                  <Field label="Enrollment No." value={form.enrollmentNumber}
                    onChange={update('enrollmentNumber')} placeholder="e.g. 2022BCS001" half />
                  <Field label="Semester" value={form.semester}
                    onChange={update('semester')} placeholder="e.g. 4" half />
                </div>
              )}
              {form.role === 'student' && (
                <Field label="Class / Section" value={form.class}
                  onChange={update('class')} placeholder="e.g. CS-B" />
              )}

              <Field label="Password" type="password" value={form.password}
                onChange={update('password')} placeholder="Min 6 characters" />
              <Field label="Confirm Password" type="password" value={form.confirmPassword}
                onChange={update('confirmPassword')} placeholder="Re-enter password" />

              <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating account…' : 'Create Account →'}
              </button>
              <p style={s.switchHint}>
                Already have an account?{' '}
                <span style={s.link} onClick={() => { setTab('login'); setError(''); }}>
                  Sign in
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder, half }) {
  return (
    <div style={{ ...s.fieldGroup, flex: half ? 1 : undefined }}>
      <label style={s.label}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        required style={s.input}
        onFocus={e => e.target.style.borderColor = '#6366f1'}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
    </div>
  );
}

const s = {
  wrapper: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  leftPane: {
    flex: 1, background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem',
  },
  brandBlock: { maxWidth: '420px', color: 'white' },
  logoIcon: { fontSize: '3.5rem', marginBottom: '1rem' },
  brandTitle: {
    fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-1px',
    background: 'linear-gradient(90deg, #fff, #a5b4fc)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  brandSub: { fontSize: '1.1rem', color: '#a5b4fc', margin: '0 0 3rem 0', lineHeight: 1.6 },
  featureList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#c7d2fe', fontSize: '0.95rem' },
  featureDot: { color: '#818cf8', fontSize: '0.6rem' },
  rightPane: {
    width: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem', background: '#f8fafc', overflowY: 'auto',
  },
  card: {
    width: '100%', maxWidth: '430px', background: 'white', borderRadius: '20px',
    padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
  },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#f1f5f9', borderRadius: '12px', padding: '4px' },
  tab: {
    flex: 1, padding: '0.6rem', border: 'none', borderRadius: '9px',
    fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', background: 'transparent', color: '#64748b',
    transition: 'all 0.2s',
  },
  tabActive: { background: 'white', color: '#4338ca', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  header: { marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.4rem 0' },
  sub: { color: '#64748b', margin: 0, fontSize: '0.9rem' },
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.875rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.8rem', fontWeight: '600', color: '#374151' },
  input: {
    padding: '0.7rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0',
    fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', color: '#0f172a', background: '#f8fafc',
  },
  roleRow: { display: 'flex', gap: '0.5rem' },
  roleBtn: {
    flex: 1, padding: '0.65rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', background: '#f8fafc', color: '#64748b', transition: 'all 0.2s',
  },
  roleBtnActive: { borderColor: '#6366f1', background: '#eef2ff', color: '#4338ca' },
  row: { display: 'flex', gap: '0.75rem' },
  btn: {
    marginTop: '0.25rem', padding: '0.85rem',
    background: 'linear-gradient(135deg, #4338ca, #6366f1)',
    color: 'white', border: 'none', borderRadius: '10px',
    fontSize: '1rem', fontWeight: '700', cursor: 'pointer', transition: 'opacity 0.2s',
  },
  switchHint: { textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8', margin: '0.25rem 0 0' },
  link: { color: '#6366f1', fontWeight: '600', cursor: 'pointer' },
};
