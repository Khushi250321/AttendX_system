const Marks = require('../models/Marks');
const User = require('../models/User');

// @PUT /api/marks/:studentId — Teacher adds/updates marks
const upsertMarks = async (req, res) => {
  const { internal, cap, midTerm, endTerm } = req.body;
  try {
    const marks = await Marks.findOneAndUpdate(
      { studentId: req.params.studentId },
      { internal, cap, midTerm, endTerm },
      { new: true, upsert: true }
    );
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/marks/my — Student's own marks
const getMyMarks = async (req, res) => {
  try {
    const marks = await Marks.findOne({ studentId: req.user._id });
    res.json(marks || { internal: 0, cap: 0, midTerm: 0, endTerm: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/marks/all — Teacher sees all students' marks
const getAllMarks = async (req, res) => {
  try {
    const marks = await Marks.find().populate('studentId', 'name enrollmentNumber class');
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { upsertMarks, getMyMarks, getAllMarks };