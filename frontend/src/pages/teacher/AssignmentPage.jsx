import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAssignment, getAssignments, getAllSubmissions, updateSubmissionStatus } from '../../services/api';

const C = { bg: '#f0f4ff', card: '#ffffff', primary: '#4338ca', green: '#059669', greenLight: '#ecfdf5', amber: '#d97706', amberLight: '#fffbeb', red: '#dc2626', redLight: '#fef2f2', text: '#0f172a', muted: '#64748b', border: '#e2e8f0' };

export default function AssignmentPage() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const [msg, setMsg] = useState('');
  const [filter, setFilter] = useState('');

  const load = async () => {
    const [a, s] = await Promise.all([getAssignments(), getAllSubmissions()]);
    setAssignments(a.data);
    setSubmissions(s.data);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAssignment(form);
      setForm({ title: '', description: '', dueDate: '' });
      await load();
      setMsg('Assignment created!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleStatusChange = async (subId, status) => {
    try {
      await updateSubmissionStatus(subId, { status });
      await load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const statusColor = (s) => ({ Submitted: [C.green, C.greenLight], Late: [C.red, C.redLight], Pending: [C.amber, C.amberLight] }[s] || [C.muted, '#f1f5f9']);

  const filteredSubs = filter ? submissions.filter(s => s.assignmentId?._id === filter) : submissions;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: `1px solid ${C.border}`, padding: '0 2rem', display: 'flex', alignItems: 'center', height: '64px', gap: '1rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate('/teacher')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: C.muted, fontSize: '0.9rem', fontWeight: '600' }}>← Back</button>
        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: C.primary }}>📝 Assignment Management</span>
        {msg && <span style={{ marginLeft: 'auto', background: C.green, color: 'white', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}>{msg}</span>}
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Create Assignment */}
        <div style={{ background: C.card, borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: '700', color: C.text }}>Create New Assignment</h2>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: C.muted, display: 'block', marginBottom: '0.4rem' }}>Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Assignment title"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '9px', border: `1.5px solid ${C.border}`, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: C.muted, display: 'block', marginBottom: '0.4rem' }}>Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="Brief description"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '9px', border: `1.5px solid ${C.border}`, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: C.muted, display: 'block', marginBottom: '0.4rem' }}>Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '9px', border: `1.5px solid ${C.border}`, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ padding: '0.7rem 1.25rem', background: C.primary, color: 'white', border: 'none', borderRadius: '9px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              + Create
            </button>
          </form>
        </div>

        {/* Submissions Table */}
        <div style={{ background: C.card, borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: C.text }}>Submission Status</h2>
            <select value={filter} onChange={e => setFilter(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: `1.5px solid ${C.border}`, fontSize: '0.875rem', color: C.text, outline: 'none' }}>
              <option value="">All Assignments</option>
              {assignments.map(a => <option key={a._id} value={a._id}>{a.title}</option>)}
            </select>
          </div>

          {filteredSubs.length === 0 ? (
            <p style={{ color: C.muted, textAlign: 'center', padding: '2rem' }}>No submissions found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Student', 'Enrollment', 'Assignment', 'Due Date', 'Status', 'Update'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '700', color: C.muted, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.map(sub => {
                    const [fg, bg] = statusColor(sub.status);
                    return (
                      <tr key={sub._id} style={{ borderTop: `1px solid ${C.border}` }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: C.text }}>{sub.studentId?.name}</td>
                        <td style={{ padding: '0.75rem 1rem', color: C.muted }}>{sub.studentId?.enrollmentNumber}</td>
                        <td style={{ padding: '0.75rem 1rem', color: C.text }}>{sub.assignmentId?.title}</td>
                        <td style={{ padding: '0.75rem 1rem', color: C.muted, whiteSpace: 'nowrap' }}>
                          {sub.assignmentId?.dueDate ? new Date(sub.assignmentId.dueDate).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ background: bg, color: fg, padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '700' }}>{sub.status}</span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <select value={sub.status} onChange={e => handleStatusChange(sub._id, e.target.value)}
                            style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: `1px solid ${C.border}`, fontSize: '0.8rem', color: C.text, outline: 'none', cursor: 'pointer' }}>
                            <option value="Pending">Pending</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Late">Late</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}