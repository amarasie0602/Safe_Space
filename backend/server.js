require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const threadRoutes = require('./routes/threadRoutes');
const replyRoutes = require('./routes/replyRoutes');
const counselorRoutes = require('./routes/counselorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
app.use(express.json());

// In production, only the configured frontend origin(s) may call this API.
// Falls back to reflecting any origin in dev/test so local Vite ports and
// the test suite keep working without extra setup.
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
}));

app.use('/auth', authRoutes);
app.use('/', postRoutes);
app.use('/', threadRoutes);
app.use('/', replyRoutes);
app.use('/', counselorRoutes);
app.use('/', bookingRoutes);
app.use('/', reportRoutes);
app.use('/', adminUserRoutes);
app.use('/', analyticsRoutes);
app.use('/', notificationRoutes);

// This network's replica-set primary discovery is slower than Mongoose's
// default 10s query-buffering timeout, which was causing every query to fail
// with a buffering-timeout error even though the connection itself succeeds.
mongoose.set('bufferTimeoutMS', 30000);

app.get('/', (req, res) => {
  res.json({ status: 'SafeSpace API running' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Catches anything an async route handler throws/rejects (Express 5 forwards
// promise rejections here automatically). Only leaks the real error message
// outside production, so a deployed instance never returns a stack trace.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong.' : err.message,
  });
});

// Only connect to Mongo and bind a port when run directly (`node server.js`
// / `npm run dev`) — not when required by the test suite, which manages its
// own in-memory database and calls supertest against `app` directly.
if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000 })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Connection error:', err));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
