const Comment = require('../models/Comment');

// @POST /api/comments — Student adds comment (once only)
const addComment = async (req, res) => {
  const { text } = req.body;
  try {
    const existing = await Comment.findOne({ studentId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted a comment' });
    }
    const comment = await Comment.create({ studentId: req.user._id, text });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/comments/my — Student gets own comment
const getMyComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ studentId: req.user._id });
    res.json(comment || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/comments/all — Teacher views all comments
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate('studentId', 'name enrollmentNumber class');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, getMyComment, getAllComments };