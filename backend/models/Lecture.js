const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  subject: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Lecture', lectureSchema);