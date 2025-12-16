const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Provider = require('../models/Provider');
const Notification = require('../models/Notification');
const { sendWelcomeEmail } = require('../services/emailService');
const logger = require('../config/logger');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Register new user
exports.register = async (req, res, next) => {
    let userId = null;
    try {
        const { name, email, phone, password, role, specialization } = req.body;

        logger.info('Registration attempt', { email, role });

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            logger.warn('Registration failed: email already exists', { email });
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Validate provider-specific fields
        if (role === 'provider') {
            if (!specialization) {
                logger.warn('Registration failed: specialization required for provider', { email });
                return res.status(400).json({ error: 'Specialization is required for provider registration' });
            }
            if (!req.file && !req.body.cvUrl) { // Support both file upload and direct URL (if needed later)
                logger.warn('Registration failed: CV required for provider', { email });
                return res.status(400).json({ error: 'CV is required for provider registration. Please upload your CV.' });
            }
        }

        // Create user
        userId = await User.create({ name, email, phone, password, role });
        logger.info('User created successfully', { userId, email, role });

        // Create role-specific record
        try {
            if (role === 'customer') {
                await Customer.create(userId);
                logger.info('Customer record created', { userId });
            } else if (role === 'provider') {
                const cvUrl = req.file ? req.file.path.replace(/\\/g, '/') : null;
                // Provider status defaults to Pending in DB, but we can be explicit
                await Provider.create(userId, specialization || null, cvUrl, 'Pending');
                logger.info('Provider record created', { userId, specialization, status: 'Pending' });
            }
        } catch (roleError) {
            logger.error('Failed to create role-specific record', {
                error: roleError.message,
                stack: roleError.stack,
                userId,
                role
            });
            // Clean up: delete the user if role-specific creation fails
            if (userId) {
                await User.delete(userId).catch(deleteErr =>
                    logger.error('Failed to clean up user after role creation failure', { error: deleteErr.message })
                );
            }
            throw roleError;
        }

        // Create welcome notification (don't fail registration if this fails)
        try {
            await Notification.create({
                userId,
                title: 'Welcome to Khadamati!',
                message: `Welcome ${name}! Your account has been created successfully.`,
                type: 'info'
            });
        } catch (notifError) {
            logger.warn('Failed to create welcome notification', {
                error: notifError.message,
                userId
            });
            // Continue registration even if notification fails
        }

        // Get user data
        const user = await User.findById(userId);

        // Send welcome email (don't wait for it)
        sendWelcomeEmail({ name, email, role }).catch(err =>
            logger.error(`Failed to send welcome email: ${err.message}`)
        );

        // Generate token
        const token = generateToken(userId);

        logger.info('Registration successful', { userId, email, role });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user
        });
    } catch (error) {
        logger.error('Registration error', {
            error: error.message,
            stack: error.stack,
            email: req.body?.email,
            role: req.body?.role,
            userId
        });
        next(error);
    }
};

// Login user
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Get user with password
        const user = await User.findByEmail(email, true);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await User.comparePassword(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user.UserID);

        // Remove password from response
        delete user.PasswordHash;

        res.json({
            message: 'Login successful',
            token,
            user
        });
    } catch (error) {
        next(error);
    }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.UserID);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get role-specific data
        let roleData = null;
        if (user.Role === 'customer') {
            roleData = await Customer.findByUserId(user.UserID);
        } else if (user.Role === 'provider') {
            roleData = await Provider.findByUserId(user.UserID);
        }

        res.json({
            user,
            roleData
        });
    } catch (error) {
        next(error);
    }
};

// Logout (client-side token removal, but we can track it here)
exports.logout = async (req, res, next) => {
    try {
        // In a more advanced implementation, you could blacklist the token
        res.json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
};
// Forgot Password
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        await User.saveResetToken(user.UserID, resetToken, resetPasswordExpires);

        // In a real app, send email here
        // For now, just return token in development or log it
        logger.info(`Reset Password Link: ${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`);

        res.json({ message: 'Email sent' });
    } catch (error) {
        next(error);
    }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findByResetToken(token);

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        await User.updatePassword(user.UserID, password);
        await User.saveResetToken(user.UserID, null, null);

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};
