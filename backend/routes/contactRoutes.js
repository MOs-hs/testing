const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const contactFormValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

// Public route to submit message
router.post('/', contactFormValidation, validate, contactController.submitContactForm);

// Admin only routes
router.get('/', authenticate, authorize('admin'), contactController.getAllMessages);
router.delete('/:id', authenticate, authorize('admin'), contactController.deleteMessage);

module.exports = router;
