const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // TODO: verify JWT from Authorization header
  next();
};

module.exports = { protect };
