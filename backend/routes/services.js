const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const serviceController = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const serviceValidation = [
    body('title').trim().notEmpty().withMessage('Service title is required'),
    body('description').optional().trim(),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('categoryId').isInt().withMessage('Valid category ID is required'),
    body('status').optional().isIn(['active', 'inactive']),
    validate
];

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.get('/provider/:providerId', serviceController.getServicesByProvider);

// Provider only routes
router.post('/', authenticate, authorize('provider'), serviceValidation, serviceController.createService);
router.put('/:id', authenticate, authorize('provider'), serviceValidation, serviceController.updateService);
router.delete('/:id', authenticate, authorize('provider'), serviceController.deleteService);

module.exports = router;
