// functions/src/utils/middlewares.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).send('Authorization token required');
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).send('Forbidden');
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
