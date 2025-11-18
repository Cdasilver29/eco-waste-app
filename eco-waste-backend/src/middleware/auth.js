const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided. Authentication required.' 
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ 
        error: 'Invalid or expired token' 
      });
    }

    // Find user
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.active) {
      return res.status(401).json({ 
        error: 'User not found or inactive' 
      });
    }

    // Attach user to request
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      message: error.message 
    });
  }
};

// Role check middleware
const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

module.exports = { authMiddleware, roleCheck };
