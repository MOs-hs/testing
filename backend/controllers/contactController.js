const ContactMessage = require('../models/ContactMessage');
const logger = require('../config/logger');

exports.submitContactForm = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        await ContactMessage.create({ name, email, message });

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        logger.error('Contact form error:', { error: error.message, stack: error.stack });
        next(error);
    }
};

exports.getAllMessages = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await ContactMessage.findAll(page, limit);
        res.status(200).json(result);
    } catch (error) {
        logger.error('Get messages error:', { error: error.message, stack: error.stack });
        next(error);
    }
};

exports.deleteMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        await ContactMessage.delete(id);
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        logger.error('Delete message error:', { error: error.message, stack: error.stack });
        next(error);
    }
};
