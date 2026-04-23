import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getMyAttendance, getLectures, markAttendance,
  getMySubmissions, getMyMarks, getMyComment, addComment
} from '../services/api';

// ─── Color Palette ───────────────────────────────────────────────
const C = {
  bg: '#f0f4ff',
  card: '#ffffff',
  primary: '#4338ca',
  primaryLight: '#eef2ff',
  accent: '#7c3aed',
  green: '#059669',
  greenLight: '#ecfdf5',
  amber: '#d97706',
  amberLight: '#fffbeb',
  red: '#dc2626',
  redLight: '#fef2f2',
  text: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',
};

// ─── Reusable Card ────────────────────────────────────────────────
const Card = ({ title, icon, children, accent = C.primary }) => (
  <div style={{ background: C.card, borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `2px solid ${accent}20` }}>
      <span style={{ fontSize: '1.4rem' }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: C.text }}>{title}</h2>
    </div>
    {children}
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────
const Badge = ({ label, color = 'green' }) => {
  const map = { green: [C.green, C.greenLight], amber: [C.amber, C.amberLight], red: [C.red, C.redLight], gray: [C.muted, '#f1f5f9'] };
  const [fg, bg] = map[color] || map.gray;
  return (
    <span style={{ background: bg, color: fg, padding: '0.25rem 0.7rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.3px' }}>
      {label}
    </span>
  );
};

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [marks, setMarks] = useState(null);
  const [comment, setComment] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    Promise.all([
      getMyAttendance().then(r => setAttendance(r.data)),
      getLectures().then(r => setLectures(r.data)),
      getMySubmissions().then(r => setSubmissions(r.data)),
      getMyMarks().then(r => setMarks(r.data)),
      getMyComment().then(r => setComment(r.data)),
    ]).catch(console.error);
  }, []);

  const handleMarkAttendance = async (lectureId, status, proxyFlag = false) => {
    try {
      await markAttendance({ lectureId, status, proxyFlag });
      const res = await getMyAttendance();
      setAttendance(res.data);
      setMsg('Attendance marked successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error marking attendance');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await addComment({ text: commentText });
      setComment(res.data);
      setMsg('Comment submitted!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error submitting comment');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'attendance', label: 'Attendance', icon: '📅' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'marks', label: 'Marks', icon: '🏆' },
    { id: 'comments', label: 'Comments', icon: '💬' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Top Nav */}
      <nav style={{ background: 'white', borderBottom: `1px solid ${C.border}`, padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🎓</span>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', color: C.primary }}>AttendX</span>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
          {navItems.map(n => (
            <a key={n.id} href={`#${n.id}`} onClick={() => setActiveSection(n.id)}
              style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none', background: activeSection === n.id ? C.primaryLight : 'transparent', color: activeSection === n.id ? C.primary : C.muted, whiteSpace: 'nowrap' }}>
              {n.icon} {n.label}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.875rem', color: C.muted, fontWeight: '600' }}>{user?.name}</span>
          <button onClick={handleLogout} style={{ padding: '0.4rem 0.9rem', borderRadius: '8px', border: '1.5px solid #fca5a5', background: 'transparent', color: C.red, cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Toast */}
      {msg && (
        <div style={{ position: 'fixed', top: '80px', right: '1.5rem', zIndex: 200, background: C.green, color: 'white', padding: '0.75rem 1.25rem', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', fontWeight: '600', fontSize: '0.9rem' }}>
          {msg}
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── PROFILE ─────────────────────────────────── */}
        <section id="profile">
          <Card title="My Profile" icon="👤" accent="#4338ca">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Full Name', value: user?.name },
                { label: 'Enrollment No.', value: user?.enrollmentNumber || '—' },
                { label: 'Semester', value: user?.semester || '—' },
                { label: 'Class', value: user?.class || '—' },
                { label: 'Email', value: user?.email },
                { label: 'Role', value: 'Student' },
              ].map((item, i) => (
                <div key={i} style={{ background: C.primaryLight, borderRadius: '10px', padding: '0.875rem 1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: C.muted, fontWeight: '600', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: C.text, wordBreak: 'break-word' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ── ATTENDANCE ──────────────────────────────── */}
        <section id="attendance">
          <Card title="Attendance" icon="📅" accent="#059669">
            {attendance && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Total Classes', value: attendance.totalLectures, color: C.primary },
                    { label: 'Attended', value: attendance.attended, color: C.green },
                    { label: 'Percentage', value: `${attendance.percentage}%`, color: attendance.percentage >= 75 ? C.green : C.red },
                  ].map((stat, i) => (
                    <div key={i} style={{ textAlign: 'center', background: '#f8fafc', borderRadius: '12px', padding: '1.25rem' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: '0.8rem', color: C.muted, fontWeight: '600', marginTop: '0.25rem' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', color: C.muted, fontWeight: '600' }}>Attendance Progress</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: attendance.percentage >= 75 ? C.green : C.red }}>{attendance.percentage}%</span>
                  </div>
                  <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(attendance.percentage, 100)}%`, background: attendance.percentage >= 75 ? `linear-gradient(90deg, ${C.green}, #34d399)` : `linear-gradient(90deg, ${C.red}, #f87171)`, borderRadius: '999px', transition: 'width 0.5s ease' }} />
                  </div>
                  {attendance.percentage < 75 && (
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: C.red, fontWeight: '600' }}>⚠️ Below 75% threshold — attend more classes!</p>
                  )}
                </div>

                {/* Mark Attendance */}
                <div>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: '700', color: C.text }}>Mark Attendance for Lecture</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {lectures.map(lec => {
                      const alreadyMarked = attendance.records?.some(r => r.lectureId?._id === lec._id);
                      return (
                        <div key={lec._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: '#f8fafc', borderRadius: '10px', border: `1px solid ${C.border}`, flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: C.text }}>{lec.subject}</div>
                            <div style={{ fontSize: '0.8rem', color: C.muted }}>{new Date(lec.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</div>
                          </div>
                          {alreadyMarked ? (
                            <Badge label="✓ Marked" color="green" />
                          ) : (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => handleMarkAttendance(lec._id, 'Present', false)}
                                style={{ padding: '0.4rem 0.9rem', borderRadius: '7px', border: 'none', background: C.green, color: 'white', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                                ✓ Present
                              </button>
                              <button onClick={() => handleMarkAttendance(lec._id, 'Present', true)}
                                style={{ padding: '0.4rem 0.9rem', borderRadius: '7px', border: `1.5px solid ${C.amber}`, background: 'white', color: C.amber, fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                                🔄 Proxy
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {lectures.length === 0 && <p style={{ color: C.muted, fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>No lectures available yet.</p>}
                  </div>
                </div>
              </>
            )}
          </Card>
        </section>

        {/* ── ASSIGNMENTS ─────────────────────────────── */}
        <section id="assignments">
          <Card title="Assignments" icon="📝" accent="#d97706">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {submissions.map(sub => {
                const asgn = sub.assignmentId;
                const isLate = new Date() > new Date(asgn?.dueDate) && sub.status === 'Pending';
                const statusColor = sub.status === 'Submitted' ? 'green' : sub.status === 'Late' || isLate ? 'red' : 'amber';
                return (
                  <div key={sub._id} style={{ padding: '1rem', background: '#fafafa', borderRadius: '10px', border: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontWeight: '700', color: C.text, fontSize: '0.95rem' }}>{asgn?.title}</div>
                      <Badge label={isLate && sub.status === 'Pending' ? 'Late' : sub.status} color={statusColor} />
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: C.muted }}>{asgn?.description}</p>
                    <span style={{ fontSize: '0.8rem', color: C.muted, fontWeight: '600' }}>
                      Due: {asgn?.dueDate ? new Date(asgn.dueDate).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—'}
                    </span>
                  </div>
                );
              })}
              {submissions.length === 0 && <p style={{ color: C.muted, fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>No assignments yet.</p>}
            </div>
          </Card>
        </section>

        {/* ── MARKS ───────────────────────────────────── */}
        <section id="marks">
          <Card title="Academic Marks" icon="🏆" accent="#7c3aed">
            {marks ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Internal', value: marks.internal, max: 30 },
                  { label: 'CAP Marks', value: marks.cap, max: 25 },
                  { label: 'Mid-Term', value: marks.midTerm, max: 25 },
                  { label: 'End-Term', value: marks.endTerm, max: 70 },
                ].map((m, i) => {
                  const pct = (m.value / m.max) * 100;
                  return (
                    <div key={i} style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: C.muted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>{m.label}</div>
                      <div style={{ fontSize: '2rem', fontWeight: '800', color: '#7c3aed', lineHeight: 1 }}>{m.value}</div>
                      <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: '0.25rem' }}>out of {m.max}</div>
                      <div style={{ background: '#e9d5ff', borderRadius: '999px', height: '5px', marginTop: '0.75rem', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: '#7c3aed', borderRadius: '999px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: C.muted, textAlign: 'center', padding: '1rem' }}>No marks available yet.</p>
            )}
          </Card>
        </section>

        {/* ── COMMENTS ────────────────────────────────── */}
        <section id="comments">
          <Card title="My Feedback" icon="💬" accent="#0891b2">
            {comment ? (
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '1.25rem' }}>
                <p style={{ margin: 0, color: C.text, lineHeight: 1.7, fontSize: '0.95rem' }}>"{comment.text}"</p>
                <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: C.muted, fontWeight: '600' }}>
                  Submitted on {new Date(comment.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                </p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: C.muted }}>Comments cannot be edited after submission.</p>
              </div>
            ) : (
              <div>
                <p style={{ color: C.muted, fontSize: '0.9rem', marginTop: 0 }}>Share your feedback. You can only submit once and cannot edit afterward.</p>
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Write your comment here..."
                  rows={4}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1.5px solid ${C.border}`, fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', color: C.text, boxSizing: 'border-box' }}
                />
                <button onClick={handleComment}
                  style={{ marginTop: '0.75rem', padding: '0.7rem 1.5rem', background: '#0891b2', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>
                  Submit Comment
                </button>
              </div>
            )}
          </Card>
        </section>

      </div>
    </div>
  );
}