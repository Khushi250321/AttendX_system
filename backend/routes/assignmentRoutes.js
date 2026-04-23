const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const {
  createAssignment,
  getAssignments,
  updateSubmissionStatus,
  getMySubmissions,
  getAllSubmissions,
} = require('../controllers/assignmentController');

router.post('/', protect, roleCheck('teacher'), createAssignment);
router.get('/', protect, getAssignments);
router.put('/submission/:submissionId', protect, roleCheck('teacher'), updateSubmissionStatus);
router.get('/my-submissions', protect, roleCheck('student'), getMySubmissions);
router.get('/all-submissions', protect, roleCheck('teacher'), getAllSubmissions);

module.exports = router;