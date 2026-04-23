const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  internal: { type: Number, default: 0 },
  cap: { type: Number, default: 0 },
  midTerm: { type: Number, default: 0 },
  endTerm: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Marks', marksSchema);