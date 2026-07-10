const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// A Counselor's login token carries role: 'counselor' (see
// counselorController.signToken), so `protect` works for either a User or a
// Counselor — this just narrows to routes only a logged-in counselor may hit.
const counselorOnly = (req, res, next) => {
  if (req.user?.role !== 'counselor') {
    return res.status(403).json({ message: 'Counselor access required' });
  }
  next();
};

// A valid JWT can outlive a since-suspended/banned account (tokens last 7
// days), so content-creation routes re-check status against the database
// rather than trusting the token's snapshot of the user at login time.
const requireActiveUser = async (req, res, next) => {
  if (req.user?.role !== 'user') {
    return next();
  }
  const user = await User.findById(req.user.id).select('status suspendedUntil');
  if (!user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  if (user.status === 'banned') {
    return res.status(403).json({ message: 'This account has been banned.' });
  }
  if (user.status === 'suspended' && (!user.suspendedUntil || user.suspendedUntil > new Date())) {
    const until = user.suspendedUntil ? user.suspendedUntil.toLocaleDateString() : 'further notice';
    return res.status(403).json({ message: `This account is suspended until ${until}.` });
  }
  next();
};

module.exports = { protect, adminOnly, counselorOnly, requireActiveUser };
