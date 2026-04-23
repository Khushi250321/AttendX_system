const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lectureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true },
  status: { type: String, enum: ['Present', 'Absent'], default: 'Absent' },
  proxyFlag: { type: Boolean, default: false },
}, { timestamps: true });

// One attendance record per student per lecture
attendanceSchema.index({ studentId: 1, lectureId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);