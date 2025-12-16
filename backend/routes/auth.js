const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['customer', 'provider', 'admin']).withMessage('Invalid role'),
    body('specialization').optional().trim(),
    validate
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    validate
];

const resetPasswordValidation = [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
];

// Routes
const { uploadSingleDocument } = require('../middleware/upload');

router.post('/register', uploadSingleDocument('cv'), registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, authController.resetPassword);

module.exports = router;
