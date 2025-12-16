const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const reportGenerationValidation = [
    body('reportType').optional().trim(),
    body('dataJSON').optional(),
    validate
];

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard and statistics
router.get('/dashboard', (req, res) => res.json({ message: 'Dashboard stats placeholder' })); // Placeholder until implemented
router.get('/stats', (req, res) => res.json({ message: 'System stats placeholder' })); // Placeholder until implemented

// Provider Management
router.get('/providers/pending', adminController.getPendingProviders);
router.put('/providers/:providerId/approve', adminController.approveProvider);
router.put('/providers/:providerId/reject', adminController.rejectProvider);

// Reports
router.get('/reports', (req, res) => res.json({ message: 'Reports placeholder' })); // Placeholder until implemented
router.post('/reports', reportGenerationValidation, (req, res) => res.json({ message: 'Generate report placeholder' })); // Placeholder until implemented

module.exports = router;
