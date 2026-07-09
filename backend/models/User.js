const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  pseudonym: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 32 },
  passwordHash: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user',
  },
  // Index into the client's AVATAR_PRESETS list. Users pick from a fixed set
  // of illustrated placeholder avatars, never a real photo, to stay anonymous.
  avatarId: { type: Number, min: 0, max: 9, default: 0 },
  // Optional, short, self-written blurb — never a real name or identifying detail.
  bio: { type: String, trim: true, maxlength: 160, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
