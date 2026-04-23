const Announcement = require('../models/Announcement');
const User = require('../models/User');
const { sendEmail, announcementEmail } = require('../utils/sendEmail');

// POST /api/announcements  — Teacher only
const createAnnouncement = async (req, res) => {
  const { title, content, pinned } = req.body;
  try {
    const ann = await Announcement.create({
      title,
      content,
      pinned: pinned || false,
      createdBy: req.user._id,
    });

    // Email ALL students in the background (app does not wait for this)
    const students = await User.find({ role: 'student' }).select('email');
    if (students.length > 0) {
      const emails = students.map(s => s.email);
      sendEmail(emails, `📢 New Announcement: ${title}`,
        announcementEmail(req.user.name, title, content, pinned));
    }

    res.status(201).json(ann);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/announcements  — Everyone (teacher + student)
const getAnnouncements = async (req, res) => {
  try {
    const anns = await Announcement.find()
      .populate('createdBy', 'name')
      .sort({ pinned: -1, createdAt: -1 });
    res.json(anns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/announcements/:id  — Teacher only
const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAnnouncement, getAnnouncements, deleteAnnouncement };
