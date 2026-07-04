const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  pseudonym: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 32 },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user',
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
