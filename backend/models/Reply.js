const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
  upvotes: { type: Number, default: 0 },
  flagged: { type: Boolean, default: false },
}, { timestamps: true });

replySchema.index({ thread: 1, createdAt: 1 });

module.exports = mongoose.model('Reply', replySchema);
