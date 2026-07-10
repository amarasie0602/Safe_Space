const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  counselor: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselor', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // One review per completed booking, enforced by the unique index below.
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
