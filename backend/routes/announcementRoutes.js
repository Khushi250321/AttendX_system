const express = require('express');
const router  = express.Router();
const { protect }   = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} = require('../controllers/announcementController');

router.post('/',      protect, roleCheck('teacher'), createAnnouncement);
router.get('/',       protect, getAnnouncements);
router.delete('/:id', protect, roleCheck('teacher'), deleteAnnouncement);

module.exports = router;
