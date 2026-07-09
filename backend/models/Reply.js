const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
  upvotes: { type: Number, default: 0 },
  flagged: { type: Boolean, default: false },
}, { timestamps: true });

replySchema.index({ thread: 1, createdAt: 1 });
replySchema.index({ post: 1, createdAt: 1 });

// A reply belongs to exactly one parent — a thread or a post, never both or neither.
replySchema.pre('validate', function () {
  if (Boolean(this.thread) === Boolean(this.post)) {
    throw new Error('Reply must reference exactly one of thread or post');
  }
});

module.exports = mongoose.model('Reply', replySchema);
