const jwt = require('jsonwebtoken');
const db = require('../config/database');
const logger = require('../config/logger');

// Authenticate user with JWT token
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const [users] = await db.query(
            'SELECT UserID, Name, Email, Phone, Role FROM user WHERE UserID = ?',
            [decoded.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Token is not valid' });
        }

        // Attach user to request
        req.user = users[0];
        next();
    } catch (error) {
        logger.error('Auth middleware error:', { 
            error: error.message, 
            stack: error.stack,
            path: req.path 
        });
        res.status(401).json({ error: 'Token is not valid' });
    }
};

// Authorize based on roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!roles.includes(req.user.Role)) {
            return res.status(403).json({
                error: `Access denied. Required role: ${roles.join(' or ')}`
            });
        }

        next();
    };
};

module.exports = { authenticate, authorize };
