// Global error handler
const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    logger.error('Error:', { 
        error: err.message, 
        stack: err.stack, 
        code: err.code,
        path: req.path,
        method: req.method
    });

    // Default error
    let error = {
        message: err.message || 'Server Error',
        statusCode: err.statusCode || 500
    };

    // MySQL duplicate key error
    if (err.code === 'ER_DUP_ENTRY') {
        error.message = 'Duplicate entry. This record already exists.';
        error.statusCode = 400;
    }

    // MySQL foreign key constraint error
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        error.message = 'Referenced record does not exist.';
        error.statusCode = 400;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error.message = 'Invalid token';
        error.statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        error.message = 'Token expired';
        error.statusCode = 401;
    }

    res.status(error.statusCode).json({
        error: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
