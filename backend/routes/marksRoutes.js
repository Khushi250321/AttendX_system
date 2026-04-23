const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const { upsertMarks, getMyMarks, getAllMarks } = require('../controllers/marksController');

router.put('/:studentId', protect, roleCheck('teacher'), upsertMarks);
router.get('/my', protect, roleCheck('student'), getMyMarks);
router.get('/all', protect, roleCheck('teacher'), getAllMarks);

module.exports = router;