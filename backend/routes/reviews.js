const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const reviewValidation = [
    body('requestId').isInt().withMessage('Valid request ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim(),
    validate
];

const reviewUpdateValidation = [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim(),
    validate
];

// Public routes
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.get('/service/:serviceId', reviewController.getServiceReviews);

// Customer and Admin routes
router.post('/', authenticate, authorize('customer'), reviewValidation, reviewController.createReview);
router.put('/:id', authenticate, authorize('customer'), reviewUpdateValidation, reviewController.updateReview);
router.delete('/:id', authenticate, authorize(['customer', 'admin']), reviewController.deleteReview);

module.exports = router;
