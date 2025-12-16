const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const paymentValidation = [
    body('requestId').isInt().withMessage('Valid request ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('paymentStatus').optional().isIn(['pending', 'paid', 'failed']),
    validate
];

const statusUpdateValidation = [
    body('paymentStatus').isIn(['pending', 'paid', 'failed']).withMessage('Invalid payment status'),
    validate
];

// Protected routes
router.get('/', authenticate, paymentController.getAllPayments);
router.get('/:id', authenticate, paymentController.getPaymentById);
router.post('/', authenticate, paymentValidation, paymentController.createPayment);
router.put('/:id/status', authenticate, statusUpdateValidation, paymentController.updatePaymentStatus);

module.exports = router;
