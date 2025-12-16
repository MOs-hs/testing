const User = require('../models/User');
const Customer = require('../models/Customer');
const Provider = require('../models/Provider');

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
    try {
        const { page, limit, role } = req.query;

        const result = await User.findAll(
            parseInt(page) || 1,
            parseInt(limit) || 20,
            role
        );

        res.json({
            users: result.users,
            total: result.total,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });
    } catch (error) {
        next(error);
    }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        next(error);
    }
};

// Update user
exports.updateUser = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;

        // Users can only update their own profile unless they're admin
        if (req.user.Role !== 'admin' && req.user.UserID !== parseInt(req.params.id)) {
            return res.status(403).json({ error: 'You can only update your own profile' });
        }

        const user = await User.update(req.params.id, { name, email, phone });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        next(error);
    }
};

// Delete user (admin only)
exports.deleteUser = async (req, res, next) => {
    try {
        const deleted = await User.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Update password
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Users can only update their own password
        if (req.user.UserID !== parseInt(req.params.id)) {
            return res.status(403).json({ error: 'You can only update your own password' });
        }

        // Verify current password
        const user = await User.findByEmail(req.user.Email, true);
        const isMatch = await User.comparePassword(currentPassword, user.PasswordHash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        await User.updatePassword(req.params.id, newPassword);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};
