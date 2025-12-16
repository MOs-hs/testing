const Provider = require('../models/Provider');
const logger = require('../config/logger');

/**
 * Admin Controller - Handles admin-related operations
 * @module controllers/adminController
 */

/**
 * Get all pending provider requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getPendingProviders = async (req, res, next) => {
  try {
    const providers = await Provider.findAll({ status: 'Pending' });
    res.json(providers);
  } catch (error) {
    logger.error('Error fetching pending providers', { error: error.message });
    next(error);
  }
};

/**
 * Approve a provider
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.approveProvider = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const provider = await Provider.updateStatus(providerId, 'Approved');

    logger.info('Provider approved', { providerId, adminId: req.user.UserID });

    // TODO: Send email notification to provider

    res.json({ message: 'Provider approved successfully', provider });
  } catch (error) {
    logger.error('Error approving provider', { error: error.message, providerId: req.params.providerId });
    next(error);
  }
};

/**
 * Reject a provider
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.rejectProvider = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const provider = await Provider.updateStatus(providerId, 'Rejected');

    logger.info('Provider rejected', { providerId, adminId: req.user.UserID });

    // TODO: Send email notification to provider

    res.json({ message: 'Provider rejected successfully', provider });
  } catch (error) {
    logger.error('Error rejecting provider', { error: error.message, providerId: req.params.providerId });
    next(error);
  }
};
