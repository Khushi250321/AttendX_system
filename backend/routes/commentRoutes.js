const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const { addComment, getMyComment, getAllComments } = require('../controllers/commentController');

router.post('/', protect, roleCheck('student'), addComment);
router.get('/my', protect, roleCheck('student'), getMyComment);
router.get('/all', protect, roleCheck('teacher'), getAllComments);

module.exports = router;