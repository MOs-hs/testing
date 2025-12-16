const Provider = require('../models/Provider');
const Certificate = require('../models/Certificate');

// Get all providers
exports.getAllProviders = async (req, res, next) => {
    try {
        const { minRating, specialization, page, limit } = req.query;

        const providers = await Provider.findAll({
            minRating: parseFloat(minRating),
            specialization,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });

        res.json({ providers, count: providers.length });
    } catch (error) {
        next(error);
    }
};

// Get provider by ID
exports.getProviderById = async (req, res, next) => {
    try {
        const provider = await Provider.findById(req.params.id);

        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        // Get provider statistics
        const statistics = await Provider.getStatistics(req.params.id);

        res.json({ provider, statistics });
    } catch (error) {
        next(error);
    }
};

// Update provider profile
exports.updateProvider = async (req, res, next) => {
    try {
        const { specialization } = req.body;

        // Verify provider belongs to authenticated user
        const provider = await Provider.findByUserId(req.user.UserID);
        if (!provider || provider.ProviderID !== parseInt(req.params.id)) {
            return res.status(403).json({ error: 'You can only update your own profile' });
        }

        const updatedProvider = await Provider.update(req.params.id, { specialization });

        res.json({
            message: 'Provider profile updated successfully',
            provider: updatedProvider
        });
    } catch (error) {
        next(error);
    }
};

// Get provider certificates
exports.getProviderCertificates = async (req, res, next) => {
    try {
        const certificates = await Certificate.findByProvider(req.params.id);
        res.json({ certificates, count: certificates.length });
    } catch (error) {
        next(error);
    }
};

// Add certificate
exports.addCertificate = async (req, res, next) => {
    try {
        const { certificateName, issueDate, expiryDate } = req.body;

        // Verify provider belongs to authenticated user
        const provider = await Provider.findByUserId(req.user.UserID);
        if (!provider || provider.ProviderID !== parseInt(req.params.id)) {
            return res.status(403).json({ error: 'You can only add certificates to your own profile' });
        }

        const certificateId = await Certificate.create({
            providerId: req.params.id,
            certificateName,
            issueDate,
            expiryDate
        });

        const certificate = await Certificate.findById(certificateId);

        res.status(201).json({
            message: 'Certificate added successfully',
            certificate
        });
    } catch (error) {
        next(error);
    }
};

// Delete certificate
exports.deleteCertificate = async (req, res, next) => {
    try {
        const deleted = await Certificate.delete(req.params.certificateId);

        if (!deleted) {
            return res.status(404).json({ error: 'Certificate not found' });
        }

        res.json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get provider statistics
exports.getProviderStatistics = async (req, res, next) => {
    try {
        const provider = await Provider.findByUserId(req.user.UserID);
        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        const statistics = await Provider.getStatistics(provider.ProviderID);
        res.json({ statistics });
    } catch (error) {
        next(error);
    }
};
