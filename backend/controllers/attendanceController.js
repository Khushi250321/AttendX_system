const Lecture = require('../models/Lecture');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { sendEmail, attendanceEmail } = require('../utils/sendEmail'); // ← NEW LINE

// @POST /api/attendance/lecture — Teacher creates lecture
const createLecture = async (req, res) => {
  const { subject, date } = req.body;
  try {
    const lecture = await Lecture.create({ subject, date, createdBy: req.user._id });
    res.status(201).json(lecture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/attendance/lectures — Get all lectures
const getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find().populate('createdBy', 'name').sort({ date: -1 });
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/attendance/mark — Student marks attendance
const markAttendance = async (req, res) => {
  const { lectureId, status, proxyFlag } = req.body;
  try {
    const existing = await Attendance.findOne({ studentId: req.user._id, lectureId });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this lecture' });
    }
    const attendance = await Attendance.create({
      studentId: req.user._id,
      lectureId,
      status,
      proxyFlag: proxyFlag || false,
    });

    // ── NEW: email the student their attendance result ──────────────────────
    const lecture = await Lecture.findById(lectureId);
    if (lecture && req.user.email) {
      sendEmail(
        req.user.email,
        `Attendance Recorded — ${lecture.subject}`,
        attendanceEmail(req.user.name, lecture.subject, lecture.date, status)
      );
    }
    // ────────────────────────────────────────────────────────────────────────

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/attendance/my — Student's own attendance summary
const getMyAttendance = async (req, res) => {
  try {
    const totalLectures = await Lecture.countDocuments();
    const attended = await Attendance.countDocuments({
      studentId: req.user._id,
      status: 'Present',
    });
    const records = await Attendance.find({ studentId: req.user._id }).populate('lectureId');
    const percentage = totalLectures > 0 ? ((attended / totalLectures) * 100).toFixed(1) : 0;
    res.json({ totalLectures, attended, percentage, records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/attendance/lecture/:lectureId — Teacher views attendance for a lecture
const getLectureAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ lectureId: req.params.lectureId })
      .populate('studentId', 'name enrollmentNumber class');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createLecture, getLectures, markAttendance, getMyAttendance, getLectureAttendance };
