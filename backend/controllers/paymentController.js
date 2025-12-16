const Payment = require('../models/Payment');
const ServiceRequest = require('../models/ServiceRequest');

// Get all payments
exports.getAllPayments = async (req, res, next) => {
    try {
        const { customerId, providerId, paymentStatus, page, limit } = req.query;

        const payments = await Payment.findAll({
            customerId,
            providerId,
            paymentStatus,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });

        res.json({ payments, count: payments.length });
    } catch (error) {
        next(error);
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json({ payment });
    } catch (error) {
        next(error);
    }
};

// Create payment
exports.createPayment = async (req, res, next) => {
    try {
        const { requestId, amount, paymentStatus } = req.body;

        // Verify request exists
        const request = await ServiceRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        const paymentId = await Payment.create({
            requestId,
            amount,
            paymentStatus
        });

        const payment = await Payment.findById(paymentId);

        res.status(201).json({
            message: 'Payment created successfully',
            payment
        });
    } catch (error) {
        next(error);
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res, next) => {
    try {
        const { paymentStatus } = req.body;

        const payment = await Payment.updateStatus(req.params.id, paymentStatus);

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json({
            message: 'Payment status updated successfully',
            payment
        });
    } catch (error) {
        next(error);
    }
};
