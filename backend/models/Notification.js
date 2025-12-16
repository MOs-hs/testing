const db = require('../config/database');

class Notification {
    // Create notification
    static async create(notificationData) {
        const { userId, title, message, type } = notificationData;

        const [result] = await db.query(
            'INSERT INTO notification (UserID, Title, Message, Type) VALUES (?, ?, ?, ?)',
            [userId, title, message, type]
        );

        return result.insertId;
    }

    // Get user notifications
    static async findByUser(userId, filters = {}) {
        let query = `
      SELECT NotificationID, Title, Message, Type, IsRead, CreatedAt
      FROM notification
      WHERE UserID = ?
    `;

        const params = [userId];

        if (filters.isRead !== undefined) {
            query += ' AND IsRead = ?';
            params.push(filters.isRead ? 1 : 0);
        }

        if (filters.type) {
            query += ' AND Type = ?';
            params.push(filters.type);
        }

        query += ' ORDER BY CreatedAt DESC';

        if (filters.limit) {
            const offset = ((filters.page || 1) - 1) * filters.limit;
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(filters.limit), offset);
        }

        const [notifications] = await db.query(query, params);
        return notifications;
    }

    // Mark as read
    static async markAsRead(notificationId) {
        await db.query(
            'UPDATE notification SET IsRead = 1 WHERE NotificationID = ?',
            [notificationId]
        );
    }

    // Mark all as read for user
    static async markAllAsRead(userId) {
        await db.query(
            'UPDATE notification SET IsRead = 1 WHERE UserID = ? AND IsRead = 0',
            [userId]
        );
    }

    // Delete notification
    static async delete(notificationId) {
        const [result] = await db.query(
            'DELETE FROM notification WHERE NotificationID = ?',
            [notificationId]
        );
        return result.affectedRows > 0;
    }

    // Get unread count
    static async getUnreadCount(userId) {
        const [result] = await db.query(
            'SELECT COUNT(*) as count FROM notification WHERE UserID = ? AND IsRead = 0',
            [userId]
        );
        return result[0].count;
    }
}

module.exports = Notification;
