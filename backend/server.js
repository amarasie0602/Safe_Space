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
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/', postRoutes);
app.use('/', threadRoutes);
app.use('/', replyRoutes);
app.use('/', counselorRoutes);
app.use('/', bookingRoutes);
app.use('/', reportRoutes);
app.use('/', analyticsRoutes);

// This network's replica-set primary discovery is slower than Mongoose's
// default 10s query-buffering timeout, which was causing every query to fail
// with a buffering-timeout error even though the connection itself succeeds.
mongoose.set('bufferTimeoutMS', 30000);

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000 })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

app.get('/', (req, res) => {
  res.json({ status: 'SafeSpace API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
