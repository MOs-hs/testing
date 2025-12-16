const mongoSanitize = require('express-mongo-sanitize');
const logger = require('../config/logger');

// Sanitize user input to prevent NoSQL injection
const sanitizeInput = () => {
    return mongoSanitize({
        replaceWith: '_',
        onSanitize: ({ req, key }) => {
            logger.warn(`Sanitized input detected`, { path: req.path, key });
        },
    });
};

// Additional XSS protection middleware
const xssProtection = (req, res, next) => {
    // Basic XSS protection - sanitize common attack vectors
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        }
        if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => {
                obj[key] = sanitize(obj[key]);
            });
        }
        return obj;
    };

    // Note: This is basic XSS protection. For production, consider using a library like xss
    // Uncomment below to enable (may interfere with legitimate HTML content)
    // if (req.body) req.body = sanitize(req.body);
    // if (req.query) req.query = sanitize(req.query);
    // if (req.params) req.params = sanitize(req.params);

    next();
};

module.exports = {
    sanitizeInput,
    xssProtection
};
