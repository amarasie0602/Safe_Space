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
  // Free-text summary shown on cards/profile (e.g. "Available this week").
  availability: { type: String, trim: true, default: 'Availability not listed' },
  // Real weekly recurring schedule, set by the counselor themselves. Each
  // entry is one day of the week (0=Sunday..6=Saturday) with the "HH:MM"
  // slots they're open for bookings on that day.
  weeklySchedule: [{
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    slots: [{ type: String, trim: true }],
    _id: false,
  }],
  rating: { type: Number, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ['counselor'], default: 'counselor' },
}, { timestamps: true });

module.exports = mongoose.model('Counselor', counselorSchema);
