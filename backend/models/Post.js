const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: ['mental_health', 'family', 'financial', 'academic', 'relationships', 'addiction'],
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

module.exports = mongoose.model('Post', postSchema);
