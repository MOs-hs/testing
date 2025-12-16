const Notification = require('../models/Notification');

// Get user notifications
exports.getUserNotifications = async (req, res, next) => {
    try {
        const { isRead, type, page, limit } = req.query;

        const notifications = await Notification.findByUser(req.user.UserID, {
            isRead: isRead !== undefined ? isRead === 'true' : undefined,
            type,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });

        const unreadCount = await Notification.getUnreadCount(req.user.UserID);

        res.json({ notifications, unreadCount, count: notifications.length });
    } catch (error) {
        next(error);
    }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
    try {
        await Notification.markAsRead(req.params.id);
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        next(error);
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.markAllAsRead(req.user.UserID);
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        next(error);
    }
};

// Delete notification
exports.deleteNotification = async (req, res, next) => {
    try {
        const deleted = await Notification.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get unread count
exports.getUnreadCount = async (req, res, next) => {
    try {
        const count = await Notification.getUnreadCount(req.user.UserID);
        res.json({ unreadCount: count });
    } catch (error) {
        next(error);
    }
};
