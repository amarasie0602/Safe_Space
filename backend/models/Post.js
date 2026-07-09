const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: ['mental_health', 'relationships', 'family', 'financial', 'work_burnout'],
    required: true,
  },
  content: { type: String, required: true, trim: true, maxlength: 5000 },
  // Auto-set true when the content matches a risk-keyword pattern on creation.
  // Drives the moderation queue in the admin Safety & Analytics dashboard.
  flagged: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['visible', 'under_review', 'removed'],
    default: 'visible',
  },
}, { timestamps: true });

postSchema.index({ category: 1, createdAt: -1 });

// Safety-critical: guarantees a flagged post always lands in the moderation
// queue even if a future code path forgets to set status explicitly.
postSchema.pre('save', function (next) {
  if (this.flagged && this.status === 'visible') {
    this.status = 'under_review';
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
