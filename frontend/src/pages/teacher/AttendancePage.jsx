import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLecture, getLectures, getLectureAttendance } from '../../services/api';

const C = { bg: '#f0f4ff', card: '#ffffff', primary: '#4338ca', primaryLight: '#eef2ff', green: '#059669', greenLight: '#ecfdf5', amber: '#d97706', red: '#dc2626', text: '#0f172a', muted: '#64748b', border: '#e2e8f0' };

export default function AttendancePage() {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => { getLectures().then(r => setLectures(r.data)); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createLecture({ subject, date });
      const res = await getLectures();
      setLectures(res.data);
      setSubject('');
      setMsg('Lecture created!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const viewAttendance = async (lec) => {
    setSelectedLecture(lec);
    const res = await getLectureAttendance(lec._id);
    setAttendanceRecords(res.data);
  };

  const proxyCount = attendanceRecords.filter(r => r.proxyFlag).length;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: `1px solid ${C.border}`, padding: '0 2rem', display: 'flex', alignItems: 'center', height: '64px', gap: '1rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate('/teacher')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: C.muted, fontSize: '0.9rem', fontWeight: '600' }}>← Back</button>
        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: C.primary }}>📅 Attendance Management</span>
        {msg && <span style={{ marginLeft: 'auto', background: C.green, color: 'white', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}>{msg}</span>}
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Create Lecture */}
        <div style={{ background: C.card, borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: '700', color: C.text }}>Create Lecture Session</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: C.muted, display: 'block', marginBottom: '0.4rem' }}>Subject</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} required placeholder="e.g., Data Structures"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '9px', border: `1.5px solid ${C.border}`, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: C.muted, display: 'block', marginBottom: '0.4rem' }}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '9px', border: `1.5px solid ${C.border}`, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ padding: '0.75rem', background: C.primary, color: 'white', border: 'none', borderRadius: '9px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}>
              + Create Lecture
            </button>
          </form>
        </div>

        {/* Lectures List */}
        <div style={{ background: C.card, borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: '700', color: C.text }}>All Lectures ({lectures.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
            {lectures.map(lec => (
              <div key={lec._id} style={{ padding: '0.875rem 1rem', background: selectedLecture?._id === lec._id ? C.primaryLight : '#f8fafc', borderRadius: '10px', border: `1px solid ${selectedLecture?._id === lec._id ? C.primary : C.border}`, cursor: 'pointer' }}
                onClick={() => viewAttendance(lec)}>
                <div style={{ fontWeight: '700', color: C.text, fontSize: '0.9rem' }}>{lec.subject}</div>
                <div style={{ fontSize: '0.8rem', color: C.muted, marginTop: '0.2rem' }}>
                  {new Date(lec.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · by {lec.createdBy?.name}
                </div>
              </div>
            ))}
            {lectures.length === 0 && <p style={{ color: C.muted, textAlign: 'center', fontSize: '0.9rem' }}>No lectures yet.</p>}
          </div>
        </div>

        {/* Attendance Records */}
        {selectedLecture && (
          <div style={{ gridColumn: '1 / -1', background: C.card, borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: C.text }}>
                Attendance: {selectedLecture.subject}
              </h2>
              {proxyCount > 0 && (
                <span style={{ background: '#fef3c7', color: C.amber, padding: '0.35rem 0.9rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>
                  ⚠️ {proxyCount} Proxy Flag{proxyCount > 1 ? 's' : ''} Detected
                </span>
              )}
            </div>
            {attendanceRecords.length === 0 ? (
              <p style={{ color: C.muted, textAlign: 'center' }}>No attendance records yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Name', 'Enrollment', 'Class', 'Status', 'Proxy Flag'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '700', color: C.muted, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map(r => (
                      <tr key={r._id} style={{ borderTop: `1px solid ${C.border}` }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: C.text }}>{r.studentId?.name}</td>
                        <td style={{ padding: '0.75rem 1rem', color: C.muted }}>{r.studentId?.enrollmentNumber}</td>
                        <td style={{ padding: '0.75rem 1rem', color: C.muted }}>{r.studentId?.class}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ background: r.status === 'Present' ? C.greenLight : '#fef2f2', color: r.status === 'Present' ? C.green : C.red, padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700' }}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          {r.proxyFlag ? (
                            <span style={{ background: '#fef3c7', color: C.amber, padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700' }}>🔄 Proxy</span>
                          ) : (
                            <span style={{ color: C.muted, fontSize: '0.8rem' }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}