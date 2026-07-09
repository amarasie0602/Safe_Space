const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['post_reply', 'thread_reply', 'booking_status'],
    required: true,
  },
  message: { type: String, required: true, trim: true },
  // Frontend route to send the user to when they click the notification.
  // Posts have no standalone detail page, so post-reply notifications link
  // back to the feed rather than a specific post.
  link: { type: String, trim: true, default: '/' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
