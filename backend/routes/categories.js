const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const categoryValidation = [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('description').optional().trim(),
    validate
];

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin only routes
router.post('/', authenticate, authorize('admin'), categoryValidation, categoryController.createCategory);
router.put('/:id', authenticate, authorize('admin'), categoryValidation, categoryController.updateCategory);
router.delete('/:id', authenticate, authorize('admin'), categoryController.deleteCategory);

module.exports = router;
