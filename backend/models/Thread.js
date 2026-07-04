const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: ['mental_health', 'family', 'financial', 'academic', 'relationships', 'addiction'],
    required: true,
  },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  body: { type: String, required: true, trim: true, maxlength: 5000 },
  upvotes: { type: Number, default: 0 },
}, { timestamps: true });

threadSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('Thread', threadSchema);
