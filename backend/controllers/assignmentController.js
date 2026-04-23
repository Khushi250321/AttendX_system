const Assignment = require('../models/Assignment');
const SubmissionStatus = require('../models/SubmissionStatus');
const User = require('../models/User');
const { sendEmail, assignmentEmail } = require('../utils/sendEmail'); // ← NEW LINE

// @POST /api/assignments — Teacher creates assignment
const createAssignment = async (req, res) => {
  const { title, description, dueDate } = req.body;
  try {
    const assignment = await Assignment.create({ title, description, dueDate, createdBy: req.user._id });

    // Auto-create Pending status for all students
    const students = await User.find({ role: 'student' });
    const statuses = students.map(s => ({
      studentId: s._id,
      assignmentId: assignment._id,
      status: 'Pending',
    }));
    await SubmissionStatus.insertMany(statuses, { ordered: false });

    // ── NEW: email every student about the new assignment ───────────────────
    students.forEach(student => {
      sendEmail(
        student.email,
        `📝 New Assignment: ${title}`,
        assignmentEmail(student.name, title, description, dueDate)
      );
    });
    // ────────────────────────────────────────────────────────────────────────

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/assignments — Get all assignments
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/assignments/submission/:submissionId — Teacher updates status
const updateSubmissionStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const submission = await SubmissionStatus.findByIdAndUpdate(
      req.params.submissionId,
      { status, updatedBy: req.user._id },
      { new: true }
    );
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/assignments/my-submissions — Student's own submission statuses
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await SubmissionStatus.find({ studentId: req.user._id })
      .populate('assignmentId');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/assignments/all-submissions — Teacher sees all submissions
const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await SubmissionStatus.find()
      .populate('studentId', 'name enrollmentNumber')
      .populate('assignmentId', 'title dueDate');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAssignment, getAssignments, updateSubmissionStatus, getMySubmissions, getAllSubmissions };
