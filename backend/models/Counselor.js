const mongoose = require('mongoose');

// Separate collection from anonymous users, since counselors carry real,
// verifiable credentials rather than a pseudonymous identity.
const counselorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true, select: false },
  specialties: [{
    type: String,
    enum: ['mental_health', 'relationships', 'family', 'financial', 'work_burnout'],
  }],
  credentials: { type: String, trim: true },
  // Free-text for now (e.g. "Available this week") — there's no real
  // scheduling/calendar system behind this yet.
  availability: { type: String, trim: true, default: 'Availability not listed' },
  rating: { type: Number, min: 0, max: 5 },
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ['counselor'], default: 'counselor' },
}, { timestamps: true });

module.exports = mongoose.model('Counselor', counselorSchema);
