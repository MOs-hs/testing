const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const providerController = require('../controllers/providerController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const providerUpdateValidation = [
    body('specialization').optional().trim(),
    validate
];

const certificateValidation = [
    body('certificateName').trim().notEmpty().withMessage('Certificate name is required'),
    body('issueDate').optional().isISO8601().withMessage('Valid issue date required'),
    body('expiryDate').optional().isISO8601().withMessage('Valid expiry date required'),
    validate
];

// Public routes
router.get('/', providerController.getAllProviders);
router.get('/:id', providerController.getProviderById);
router.get('/:id/certificates', providerController.getProviderCertificates);

// Provider only routes
router.put('/:id', authenticate, authorize('provider'), providerUpdateValidation, providerController.updateProvider);
router.post('/:id/certificates', authenticate, authorize('provider'), certificateValidation, providerController.addCertificate);
router.delete('/:id/certificates/:certificateId', authenticate, authorize('provider'), providerController.deleteCertificate);
router.get('/statistics/me', authenticate, authorize('provider'), providerController.getProviderStatistics);

module.exports = router;
