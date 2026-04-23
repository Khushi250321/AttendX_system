import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AttendancePage from './pages/teacher/AttendancePage';
import AssignmentPage from './pages/teacher/AssignmentPage';
import MarksPage from './pages/teacher/MarksPage';
import CommentsPage from './pages/teacher/CommentsPage';
import AnnouncementsPage from './pages/AnnouncementsPage'; // ← NEW LINE

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', fontFamily: 'sans-serif' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/student" element={
            <PrivateRoute role="student"><StudentDashboard /></PrivateRoute>
          } />
          <Route path="/teacher" element={
            <PrivateRoute role="teacher"><TeacherDashboard /></PrivateRoute>
          } />
          <Route path="/teacher/attendance" element={
            <PrivateRoute role="teacher"><AttendancePage /></PrivateRoute>
          } />
          <Route path="/teacher/assignments" element={
            <PrivateRoute role="teacher"><AssignmentPage /></PrivateRoute>
          } />
          <Route path="/teacher/marks" element={
            <PrivateRoute role="teacher"><MarksPage /></PrivateRoute>
          } />
          <Route path="/teacher/comments" element={
            <PrivateRoute role="teacher"><CommentsPage /></PrivateRoute>
          } />

          {/* ── NEW: works for both teacher and student ── */}
          <Route path="/announcements" element={
            <PrivateRoute><AnnouncementsPage /></PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
