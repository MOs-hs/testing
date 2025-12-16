const Service = require('../models/Service');
const Provider = require('../models/Provider');

// Get all services
exports.getAllServices = async (req, res, next) => {
    try {
        const { categoryId, providerId, status, search, page, limit } = req.query;

        const services = await Service.findAll({
            categoryId,
            providerId,
            status,
            search,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });

        res.json({ services, count: services.length });
    } catch (error) {
        next(error);
    }
};

// Get service by ID
exports.getServiceById = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json({ service });
    } catch (error) {
        next(error);
    }
};

// Create service (provider only)
exports.createService = async (req, res, next) => {
    try {
        const { title, description, price, categoryId, status } = req.body;

        // Get provider ID from authenticated user
        const provider = await Provider.findByUserId(req.user.UserID);
        if (!provider) {
            return res.status(403).json({ error: 'Only providers can create services' });
        }

        if (provider.Status !== 'Approved') {
            return res.status(403).json({ error: 'Your account is pending approval. You cannot create services yet.' });
        }

        const serviceId = await Service.create({
            title,
            description,
            price,
            categoryId,
            providerId: provider.ProviderID,
            status
        });

        const service = await Service.findById(serviceId);

        res.status(201).json({
            message: 'Service created successfully',
            service
        });
    } catch (error) {
        next(error);
    }
};

// Update service (provider only - own services)
exports.updateService = async (req, res, next) => {
    try {
        const { title, description, price, categoryId, status } = req.body;

        // Check if service exists and belongs to provider
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const provider = await Provider.findByUserId(req.user.UserID);
        if (service.ProviderID !== provider.ProviderID) {
            return res.status(403).json({ error: 'You can only update your own services' });
        }

        const updatedService = await Service.update(req.params.id, {
            title,
            description,
            price,
            categoryId,
            status
        });

        res.json({
            message: 'Service updated successfully',
            service: updatedService
        });
    } catch (error) {
        next(error);
    }
};

// Delete service (provider only - own services)
exports.deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const provider = await Provider.findByUserId(req.user.UserID);
        if (service.ProviderID !== provider.ProviderID) {
            return res.status(403).json({ error: 'You can only delete your own services' });
        }

        await Service.delete(req.params.id);

        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get services by provider
exports.getServicesByProvider = async (req, res, next) => {
    try {
        const services = await Service.findByProvider(req.params.providerId);
        res.json({ services, count: services.length });
    } catch (error) {
        next(error);
    }
};
