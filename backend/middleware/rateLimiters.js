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

// The IP-based contentLimiter above stops scripted flooding but still lets a
// single account fire off posts/replies back-to-back — exactly the pattern
// behind pile-ons and brigading in a peer-support feed. This adds a short
// per-user cooldown on top of it. In-memory is fine here: same
// single-instance assumption the rest of this app already makes (no Redis).
const COOLDOWN_MS = 10 * 1000;
const lastPostAt = new Map();

const postCooldown = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next();

  const userId = req.user.id;
  const now = Date.now();
  const last = lastPostAt.get(userId);

  if (last && now - last < COOLDOWN_MS) {
    const waitSeconds = Math.ceil((COOLDOWN_MS - (now - last)) / 1000);
    return res.status(429).json({ message: `Please wait ${waitSeconds}s before posting again.` });
  }

  lastPostAt.set(userId, now);
  next();
};

module.exports = { authLimiter, contentLimiter, postCooldown };
