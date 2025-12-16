const ServiceRequest = require('../models/ServiceRequest');
const Customer = require('../models/Customer');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const Notification = require('../models/Notification');

// Get all requests
exports.getAllRequests = async (req, res, next) => {
    try {
        const { customerId, providerId, statusId, page, limit } = req.query;

        const requests = await ServiceRequest.findAll({
            customerId,
            providerId,
            statusId,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });

        res.json({ requests, count: requests.length });
    } catch (error) {
        next(error);
    }
};

// Get current user's requests (for customers)
exports.getMyRequests = async (req, res, next) => {
    try {
        const { page, limit } = req.query;

        // Get customer ID from authenticated user
        const customer = await Customer.findByUserId(req.user.UserID);
        if (!customer) {
            return res.status(403).json({ error: 'Customer profile not found' });
        }

        const requests = await ServiceRequest.findByCustomer(
            customer.CustomerID,
            parseInt(page) || 1,
            parseInt(limit) || 50
        );

        res.json({ requests, count: requests.length });
    } catch (error) {
        next(error);
    }
};

// Get request by ID
exports.getRequestById = async (req, res, next) => {
    try {
        const request = await ServiceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json({ request });
    } catch (error) {
        next(error);
    }
};

// Create service request (customer only)
exports.createRequest = async (req, res, next) => {
    try {
        const { serviceId, scheduledDate, details, addressLine, city } = req.body;

        // Get customer ID from authenticated user
        const customer = await Customer.findByUserId(req.user.UserID);
        if (!customer) {
            return res.status(403).json({ error: 'Only customers can create service requests' });
        }

        // Verify service exists
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const requestId = await ServiceRequest.create({
            customerId: customer.CustomerID,
            serviceId,
            scheduledDate,
            details,
            addressLine,
            city
        });

        const request = await ServiceRequest.findById(requestId);

        // Notify provider
        const provider = await Provider.findById(service.ProviderID);
        if (provider) {
            await Notification.create({
                userId: provider.UserID,
                title: 'New Service Request',
                message: `You have a new request for ${service.Title}`,
                type: 'request'
            });
        }

        res.status(201).json({
            message: 'Service request created successfully',
            request
        });
    } catch (error) {
        next(error);
    }
};

// Update request status
exports.updateRequestStatus = async (req, res, next) => {
    try {
        const { statusId, finalPrice } = req.body;

        const request = await ServiceRequest.updateStatus(req.params.id, statusId, finalPrice);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Notify customer about status change
        const customer = await Customer.findById(request.CustomerID);
        if (customer) {
            await Notification.create({
                userId: customer.UserID,
                title: 'Request Status Updated',
                message: `Your request for ${request.ServiceTitle} is now ${request.StatusName}`,
                type: 'status'
            });
        }

        res.json({
            message: 'Request status updated successfully',
            request
        });
    } catch (error) {
        next(error);
    }
};

// Update request
exports.updateRequest = async (req, res, next) => {
    try {
        const { scheduledDate, details, addressLine, city, statusId } = req.body;

        const request = await ServiceRequest.update(req.params.id, {
            scheduledDate,
            details,
            addressLine,
            city,
            statusId
        });

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json({
            message: 'Request updated successfully',
            request
        });
    } catch (error) {
        next(error);
    }
};

// Cancel/Delete request
exports.deleteRequest = async (req, res, next) => {
    try {
        const deleted = await ServiceRequest.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json({ message: 'Request cancelled successfully' });
    } catch (error) {
        next(error);
    }
};

// Get customer's requests
exports.getCustomerRequests = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const requests = await ServiceRequest.findByCustomer(
            req.params.customerId,
            parseInt(page) || 1,
            parseInt(limit) || 20
        );

        res.json({ requests, count: requests.length });
    } catch (error) {
        next(error);
    }
};

// Get provider's requests
exports.getProviderRequests = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const requests = await ServiceRequest.findByProvider(
            req.params.providerId,
            parseInt(page) || 1,
            parseInt(limit) || 20
        );

        res.json({ requests, count: requests.length });
    } catch (error) {
        next(error);
    }
};

// Get all statuses
exports.getAllStatuses = async (req, res, next) => {
    try {
        const statuses = await ServiceRequest.getAllStatuses();
        res.json({ statuses });
    } catch (error) {
        next(error);
    }
};
