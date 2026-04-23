import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllComments } from '../../services/api';

const C = { bg: '#f0f4ff', card: '#ffffff', primary: '#4338ca', cyan: '#0891b2', cyanLight: '#f0f9ff', text: '#0f172a', muted: '#64748b', border: '#e2e8f0' };

export default function CommentsPage() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);

  useEffect(() => { getAllComments().then(r => setComments(r.data)); }, []);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: `1px solid ${C.border}`, padding: '0 2rem', display: 'flex', alignItems: 'center', height: '64px', gap: '1rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate('/teacher')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: C.muted, fontSize: '0.9rem', fontWeight: '600' }}>← Back</button>
        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: C.primary }}>💬 Student Comments</span>
        <span style={{ marginLeft: 'auto', background: C.cyanLight, color: C.cyan, padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>
          {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </span>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {comments.length === 0 ? (
          <div style={{ background: C.card, borderRadius: '16px', padding: '3rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
            <p style={{ color: C.muted, fontSize: '1rem' }}>No student comments yet.</p>
          </div>
        ) : (
          comments.map((c, i) => (
            <div key={c._id} style={{ background: C.card, borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `hsl(${(i * 53) % 360}, 60%, 85%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.95rem', color: `hsl(${(i * 53) % 360}, 60%, 35%)`, flexShrink: 0 }}>
                  {c.studentId?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: C.text, fontSize: '0.95rem' }}>{c.studentId?.name}</div>
                  <div style={{ fontSize: '0.78rem', color: C.muted }}>{c.studentId?.enrollmentNumber}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: C.muted, fontWeight: '600' }}>
                  {new Date(c.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </div>
              </div>
              <p style={{ margin: 0, color: C.text, lineHeight: 1.7, fontSize: '0.95rem', background: C.cyanLight, padding: '1rem', borderRadius: '10px', borderLeft: `3px solid ${C.cyan}` }}>
                "{c.text}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}