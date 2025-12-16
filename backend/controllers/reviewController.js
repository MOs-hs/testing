const Review = require('../models/Review');
const ServiceRequest = require('../models/ServiceRequest');
const Customer = require('../models/Customer');

// Get all reviews
exports.getAllReviews = async (req, res, next) => {
    try {
        const { serviceId, providerId, customerId, page, limit } = req.query;

        const reviews = await Review.findAll({
            serviceId,
            providerId,
            customerId,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });

        res.json({ reviews, count: reviews.length });
    } catch (error) {
        next(error);
    }
};

// Get review by ID
exports.getReviewById = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.json({ review });
    } catch (error) {
        next(error);
    }
};

// Create review (customer only, for completed requests)
exports.createReview = async (req, res, next) => {
    try {
        const { requestId, rating, comment } = req.body;

        // Get customer ID from authenticated user
        const customer = await Customer.findByUserId(req.user.UserID);
        if (!customer) {
            return res.status(403).json({ error: 'Only customers can create reviews' });
        }

        // Verify request exists and belongs to customer
        const request = await ServiceRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (request.CustomerID !== customer.CustomerID) {
            return res.status(403).json({ error: 'You can only review your own requests' });
        }

        // Check if request is completed
        // Check StatusID 4 (Completed)
        if (request.StatusID != 4) {
            return res.status(400).json({ error: 'You can only review completed requests' });
        }

        // Check if review already exists
        const reviewExists = await Review.existsForRequest(requestId);
        if (reviewExists) {
            return res.status(400).json({ error: 'You have already reviewed this request' });
        }

        const reviewId = await Review.create({ requestId, rating, comment });
        const review = await Review.findById(reviewId);

        res.status(201).json({
            message: 'Review created successfully',
            review
        });
    } catch (error) {
        next(error);
    }
};

// Update review
exports.updateReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;

        const review = await Review.update(req.params.id, { rating, comment });

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.json({
            message: 'Review updated successfully',
            review
        });
    } catch (error) {
        next(error);
    }
};

// Delete review
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Use optional chaining for safe property access and role handling
        const userRole = req.user.Role || req.user.role;
        const isAdmin = userRole === 'admin';

        // Use loose equality for ID comparison (string vs number)
        if (!isAdmin && review.CustomerID != req.user.CustomerID) {
            // If customer object exists in req.user (middleware might attach it differently)
            // safe check: if not admin, must be the owner.
            // We need to fetch customer ID if not in req.user directly.
            const customer = await Customer.findByUserId(req.user.UserID);
            if (!customer || review.CustomerID !== customer.CustomerID) {
                return res.status(403).json({ error: 'You can only delete your own reviews' });
            }
        }

        const deleted = await Review.delete(req.params.id);

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get reviews by service
exports.getServiceReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findByService(req.params.serviceId);
        res.json({ reviews, count: reviews.length });
    } catch (error) {
        next(error);
    }
};
