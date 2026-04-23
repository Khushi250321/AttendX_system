import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' 
});

// Attach token automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Attendance
export const createLecture = (data) => API.post('/attendance/lecture', data);
export const getLectures = () => API.get('/attendance/lectures');
export const markAttendance = (data) => API.post('/attendance/mark', data);
export const getMyAttendance = () => API.get('/attendance/my');
export const getLectureAttendance = (id) => API.get(`/attendance/lecture/${id}`);

// Assignments
export const createAssignment = (data) => API.post('/assignments', data);
export const getAssignments = () => API.get('/assignments');
export const updateSubmissionStatus = (id, data) => API.put(`/assignments/submission/${id}`, data);
export const getMySubmissions = () => API.get('/assignments/my-submissions');
export const getAllSubmissions = () => API.get('/assignments/all-submissions');

// Marks
export const upsertMarks = (studentId, data) => API.put(`/marks/${studentId}`, data);
export const getMyMarks = () => API.get('/marks/my');
export const getAllMarks = () => API.get('/marks/all');

// Comments
export const addComment = (data) => API.post('/comments', data);
export const getMyComment = () => API.get('/comments/my');
export const getAllComments = () => API.get('/comments/all');

// Announcements
export const createAnnouncement = (data) => API.post('/announcements', data);
export const getAnnouncements   = ()     => API.get('/announcements');
export const deleteAnnouncement = (id)   => API.delete(`/announcements/${id}`);
