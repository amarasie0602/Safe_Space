const mongoose = require('mongoose');

// Separate collection from anonymous users, since counselors carry real,
// verifiable credentials rather than a pseudonymous identity.
const counselorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true, select: false },
  specialties: [{
    type: String,
    enum: ['mental_health', 'family', 'financial', 'academic', 'relationships', 'addiction'],
  }],
  credentials: { type: String, trim: true },
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ['counselor'], default: 'counselor' },
}, { timestamps: true });

module.exports = mongoose.model('Counselor', counselorSchema);
