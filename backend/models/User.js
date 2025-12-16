const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Create new user
    static async create(userData) {
        const { name, email, phone, password, role } = userData;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO user (Name, Email, Phone, PasswordHash, Role) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, passwordHash, role || 'customer']
        );

        return result.insertId;
    }

    // Find user by ID
    static async findById(userId) {
        const [users] = await db.query(
            'SELECT UserID, Name, Email, Phone, Role, CreatedAt FROM user WHERE UserID = ?',
            [userId]
        );
        return users[0];
    }

    // Find user by email (with password for login)
    static async findByEmail(email, includePassword = false) {
        const fields = includePassword
            ? 'UserID, Name, Email, Phone, PasswordHash, Role, CreatedAt'
            : 'UserID, Name, Email, Phone, Role, CreatedAt';

        const [users] = await db.query(
            `SELECT ${fields} FROM user WHERE Email = ?`,
            [email]
        );
        return users[0];
    }

    // Update user
    static async update(userId, userData) {
        const { name, email, phone } = userData;

        await db.query(
            'UPDATE user SET Name = ?, Email = ?, Phone = ? WHERE UserID = ?',
            [name, email, phone, userId]
        );

        return this.findById(userId);
    }

    // Delete user
    static async delete(userId) {
        const [result] = await db.query('DELETE FROM user WHERE UserID = ?', [userId]);
        return result.affectedRows > 0;
    }

    // Get all users with pagination
    static async findAll(page = 1, limit = 10, role = null) {
        const offset = (page - 1) * limit;

        let query = 'SELECT UserID, Name, Email, Phone, Role, CreatedAt FROM user';
        const params = [];

        if (role) {
            query += ' WHERE Role = ?';
            params.push(role);
        }

        query += ' ORDER BY CreatedAt DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [users] = await db.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM user';
        if (role) {
            countQuery += ' WHERE Role = ?';
            const [countResult] = await db.query(countQuery, [role]);
            return { users, total: countResult[0].total };
        }

        const [countResult] = await db.query(countQuery);
        return { users, total: countResult[0].total };
    }

    // Compare password
    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Update password
    static async updatePassword(userId, newPassword) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        await db.query(
            'UPDATE user SET PasswordHash = ? WHERE UserID = ?',
            [passwordHash, userId]
        );
    }

    // Save reset token
    static async saveResetToken(userId, token, expires) {
        await db.query(
            'UPDATE user SET ResetPasswordToken = ?, ResetPasswordExpires = ? WHERE UserID = ?',
            [token, expires, userId]
        );
    }

    // Find user by reset token
    static async findByResetToken(token) {
        const [users] = await db.query(
            'SELECT * FROM user WHERE ResetPasswordToken = ? AND ResetPasswordExpires > NOW()',
            [token]
        );
        return users[0];
    }
}

module.exports = User;
