const rateLimit = require('express-rate-limit');

// The test suite fires many requests back-to-back against a shared app
// instance — that's test-harness behavior, not the abuse pattern these
// limiters exist for, so it's exempted rather than tuned around.
const skip = () => process.env.NODE_ENV === 'test';

// Anonymous, low-friction registration/login is exactly the kind of surface
// that attracts credential-stuffing and spam-account creation without limits.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: { message: 'Too many attempts. Please try again later.' },
});

// Content-creation routes get a looser but still real cap, so a script can't
// flood the feed/threads with posts or replies.
const contentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: { message: 'You are posting too quickly. Please slow down.' },
});

module.exports = { authLimiter, contentLimiter };
