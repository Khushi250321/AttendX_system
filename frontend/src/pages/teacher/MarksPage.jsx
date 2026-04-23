import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMarks, upsertMarks } from '../../services/api';
import axios from 'axios';

const C = { bg: '#f0f4ff', card: '#ffffff', primary: '#4338ca', purple: '#7c3aed', purpleLight: '#faf5ff', text: '#0f172a', muted: '#64748b', border: '#e2e8f0', green: '#059669' };

// We need to also fetch students list from backend
const API = axios.create({ baseURL: 'http://localhost:5000/api' });
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function MarksPage() {
  const navigate = useNavigate();
  const [marksData, setMarksData] = useState([]);
  const [editing, setEditing] = useState(null); // { studentId, internal, cap, midTerm, endTerm }
  const [msg, setMsg] = useState('');

  const load = async () => {
    const res = await getAllMarks();
    setMarksData(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (record) => {
    setEditing({
      studentId: record.studentId?._id,
      name: record.studentId?.name,
      enrollment: record.studentId?.enrollmentNumber,
      internal: record.internal,
      cap: record.cap,
      midTerm: record.midTerm,
      endTerm: record.endTerm,
    });
  };

  const handleSave = async () => {
    try {
      await upsertMarks(editing.studentId, {
        internal: Number(editing.internal),
        cap: Number(editing.cap),
        midTerm: Number(editing.midTerm),
        endTerm: Number(editing.endTerm),
      });
      await load();
      setEditing(null);
      setMsg('Marks updated!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving marks');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const field = (key, label, max) => (
    <div style={{ flex: 1 }}>
      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: C.muted, display: 'block', marginBottom: '0.3rem' }}>{label} (/{max})</label>
      <input type="number" min={0} max={max} value={editing[key]}
        onChange={e => setEditing({ ...editing, [key]: e.target.value })}
        style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: `1.5px solid ${C.border}`, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: `1px solid ${C.border}`, padding: '0 2rem', display: 'flex', alignItems: 'center', height: '64px', gap: '1rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate('/teacher')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: C.muted, fontSize: '0.9rem', fontWeight: '600' }}>← Back</button>
        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: C.primary }}>🏆 Marks Management</span>
        {msg && <span style={{ marginLeft: 'auto', background: C.green, color: 'white', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}>{msg}</span>}
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Edit Modal */}
        {editing && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '520px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
              <h3 style={{ margin: '0 0 0.25rem', color: C.text, fontSize: '1.1rem', fontWeight: '700' }}>Edit Marks</h3>
              <p style={{ margin: '0 0 1.5rem', color: C.muted, fontSize: '0.875rem' }}>{editing.name} · {editing.enrollment}</p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {field('internal', 'Internal', 30)}
                {field('cap', 'CAP', 25)}
                {field('midTerm', 'Mid-Term', 25)}
                {field('endTerm', 'End-Term', 70)}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button onClick={handleSave} style={{ flex: 1, padding: '0.75rem', background: C.purple, color: 'white', border: 'none', borderRadius: '9px', fontWeight: '700', cursor: 'pointer' }}>
                  Save Marks
                </button>
                <button onClick={() => setEditing(null)} style={{ padding: '0.75rem 1.25rem', background: '#f1f5f9', color: C.muted, border: 'none', borderRadius: '9px', fontWeight: '600', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ background: C.card, borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: '700', color: C.text }}>All Student Marks</h2>

          {marksData.length === 0 ? (
            <p style={{ color: C.muted, textAlign: 'center', padding: '2rem' }}>No marks records found. Marks are created when you add them for a student.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Student', 'Enrollment', 'Internal (/30)', 'CAP (/25)', 'Mid-Term (/25)', 'End-Term (/70)', 'Total (/150)', 'Action'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '700', color: C.muted, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {marksData.map(r => {
                    const total = (r.internal || 0) + (r.cap || 0) + (r.midTerm || 0) + (r.endTerm || 0);
                    const pct = ((total / 150) * 100).toFixed(0);
                    return (
                      <tr key={r._id} style={{ borderTop: `1px solid ${C.border}` }}>
                        <td style={{ padding: '0.875rem 1rem', fontWeight: '600', color: C.text }}>{r.studentId?.name}</td>
                        <td style={{ padding: '0.875rem 1rem', color: C.muted }}>{r.studentId?.enrollmentNumber}</td>
                        <td style={{ padding: '0.875rem 1rem', fontWeight: '600' }}>{r.internal}</td>
                        <td style={{ padding: '0.875rem 1rem', fontWeight: '600' }}>{r.cap}</td>
                        <td style={{ padding: '0.875rem 1rem', fontWeight: '600' }}>{r.midTerm}</td>
                        <td style={{ padding: '0.875rem 1rem', fontWeight: '600' }}>{r.endTerm}</td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span style={{ background: C.purpleLight, color: C.purple, padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: '700', fontSize: '0.8rem' }}>
                            {total} ({pct}%)
                          </span>
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <button onClick={() => handleEdit(r)}
                            style={{ padding: '0.35rem 0.85rem', borderRadius: '7px', border: `1px solid ${C.purple}`, background: 'transparent', color: C.purple, fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                            Edit
                          </button>
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