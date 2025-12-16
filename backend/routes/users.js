const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const userUpdateValidation = [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
    body('phone').optional().trim(),
    validate
];

const passwordUpdateValidation = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validate
];

// Admin only routes
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

// Authenticated routes
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userUpdateValidation, userController.updateUser);
router.put('/:id/password', authenticate, passwordUpdateValidation, userController.updatePassword);

module.exports = router;
