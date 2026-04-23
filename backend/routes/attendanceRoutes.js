const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const {
  createLecture,
  getLectures,
  markAttendance,
  getMyAttendance,
  getLectureAttendance,
} = require('../controllers/attendanceController');

router.post('/lecture', protect, roleCheck('teacher'), createLecture);
router.get('/lectures', protect, getLectures);
router.post('/mark', protect, roleCheck('student'), markAttendance);
router.get('/my', protect, roleCheck('student'), getMyAttendance);
router.get('/lecture/:lectureId', protect, roleCheck('teacher'), getLectureAttendance);

module.exports = router;