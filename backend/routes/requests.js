const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const requestController = require('../controllers/requestController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const requestValidation = [
    body('serviceId').isInt().withMessage('Valid service ID is required'),
    body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required'),
    body('details').optional().trim(),
    body('addressLine').trim().notEmpty().withMessage('Address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    validate
];

const statusUpdateValidation = [
    body('statusId').isInt().withMessage('Valid status ID is required'),
    validate
];

const requestUpdateValidation = [
    body('scheduledDate').optional().isISO8601().withMessage('Valid scheduled date is required'),
    body('details').optional().trim(),
    body('addressLine').optional().trim(),
    body('city').optional().trim(),
    body('statusId').optional().isInt().withMessage('Valid status ID is required'),
    validate
];

// Protected routes
router.get('/', authenticate, requestController.getAllRequests);
router.get('/my', authenticate, requestController.getMyRequests);
router.get('/statuses', requestController.getAllStatuses);
router.get('/:id', authenticate, requestController.getRequestById);
router.get('/customer/:customerId', authenticate, requestController.getCustomerRequests);
router.get('/provider/:providerId', authenticate, requestController.getProviderRequests);

// Customer only
router.post('/', authenticate, authorize('customer'), requestValidation, requestController.createRequest);

// Provider and customer can update
router.put('/:id/status', authenticate, authorize('provider', 'customer'), statusUpdateValidation, requestController.updateRequestStatus);
router.put('/:id', authenticate, requestUpdateValidation, requestController.updateRequest);
router.delete('/:id', authenticate, requestController.deleteRequest);

module.exports = router;
