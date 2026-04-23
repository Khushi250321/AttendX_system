const mongoose = require('mongoose');

const submissionStatusSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  status: { type: String, enum: ['Pending', 'Submitted', 'Late'], default: 'Pending' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// One submission status per student per assignment
submissionStatusSchema.index({ studentId: 1, assignmentId: 1 }, { unique: true });

module.exports = mongoose.model('SubmissionStatus', submissionStatusSchema);