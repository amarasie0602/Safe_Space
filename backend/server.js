require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const threadRoutes = require('./routes/threadRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/', postRoutes);
app.use('/', threadRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

app.get('/', (req, res) => {
  res.json({ status: 'SafeSpace API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
