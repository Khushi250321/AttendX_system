import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [title,   setTitle]   = useState('');
  const [content, setContent] = useState('');
  const [pinned,  setPinned]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const fetchData = async () => {
    try { const r = await getAnnouncements(); setAnnouncements(r.data); } catch {}
  };

  useEffect(() => { fetchData(); }, []);

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return showToast('⚠️ Please fill in title and message');
    setLoading(true);
    try {
      await createAnnouncement({ title, content, pinned });
      setTitle(''); setContent(''); setPinned(false);
      showToast('✅ Posted! All students will be emailed.');
      fetchData();
    } catch { showToast('❌ Failed to post'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try { await deleteAnnouncement(id); fetchData(); showToast('🗑 Deleted'); } catch {}
  };

  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '24px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 660, margin: '0 auto' }}>

        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 20, padding: 0 }}
        >
          ← Back
        </button>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' }}>📢 Announcements</h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 28px' }}>
          {user?.role === 'teacher'
            ? 'Post announcements — all students are notified by email automatically.'
            : 'Latest updates from your teacher.'}
        </p>

        {/* Teacher post form */}
        {user?.role === 'teacher' && (
          <div style={{ background: '#fff', borderRadius: 14, padding: 24, marginBottom: 28, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 18px', color: '#374151', fontSize: 16 }}>Post New Announcement</h3>

            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6 }}>Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Exam postponed to Monday"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15, boxSizing: 'border-box', marginBottom: 14, outline: 'none' }}
            />

            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6 }}>Message</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write the full announcement here..."
              rows={4}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15, boxSizing: 'border-box', marginBottom: 14, resize: 'vertical', outline: 'none' }}
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, cursor: 'pointer', fontSize: 14, color: '#374151' }}>
              <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} />
              📌 Pin this announcement (shows at the top)
            </label>

            <button
              onClick={handlePost}
              disabled={loading}
              style={{ width: '100%', background: loading ? '#a5b4fc' : '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Posting & sending emails...' : '📤 Post Announcement'}
            </button>
          </div>
        )}

        {/* Announcement list */}
        {announcements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 15 }}>
            No announcements yet. Check back later!
          </div>
        ) : (
          announcements.map(ann => (
            <div
              key={ann._id}
              style={{
                background: ann.pinned ? '#fffbeb' : '#fff',
                border: ann.pinned ? '2px solid #fcd34d' : '1px solid #e2e8f0',
                borderRadius: 14, padding: 20, marginBottom: 14,
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 17, color: '#1e293b', flex: 1 }}>{ann.title}</span>
                {ann.pinned && (
                  <span style={{ background: '#f59e0b', color: '#fff', fontSize: 11, fontWeight: 800, borderRadius: 20, padding: '2px 9px', marginLeft: 10, whiteSpace: 'nowrap' }}>
                    📌 PINNED
                  </span>
                )}
              </div>
              <p style={{ color: '#4b5563', fontSize: 15, lineHeight: 1.65, margin: '0 0 10px', whiteSpace: 'pre-wrap' }}>{ann.content}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>
                  👤 {ann.createdBy?.name || 'Teacher'} · {fmt(ann.createdAt)}
                </span>
                {user?.role === 'teacher' && (
                  <button
                    onClick={() => handleDelete(ann._id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1e293b', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
