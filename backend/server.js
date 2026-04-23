const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
 origin: [
  'http://localhost:5173',
  'https://attend-x-kf65.vercel.app',
  'https://attend-x-system.vercel.app'
],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'API working!',
    mongoUri: process.env.MONGO_URI ? 'MONGO_URI is set' : 'MONGO_URI is MISSING',
    jwtSecret: process.env.JWT_SECRET ? 'JWT_SECRET is set' : 'JWT_SECRET is MISSING'
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/marks', require('./routes/marksRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes')); // ← NEW LINE

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
