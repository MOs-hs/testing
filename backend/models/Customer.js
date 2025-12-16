const db = require('../config/database');

class Customer {
    // Create customer (after user registration)
    static async create(userId) {
        const [result] = await db.query(
            'INSERT INTO customer (UserID) VALUES (?)',
            [userId]
        );

        return result.insertId;
    }

    // Get customer by ID
    static async findById(customerId) {
        const [customers] = await db.query(`
      SELECT 
        c.CustomerID,
        u.UserID, u.Name, u.Email, u.Phone, u.CreatedAt
      FROM customer c
      JOIN user u ON c.UserID = u.UserID
      WHERE c.CustomerID = ?
    `, [customerId]);

        return customers[0];
    }

    // Get customer by user ID
    static async findByUserId(userId) {
        const [customers] = await db.query(`
      SELECT 
        c.CustomerID,
        u.UserID, u.Name, u.Email, u.Phone, u.CreatedAt
      FROM customer c
      JOIN user u ON c.UserID = u.UserID
      WHERE c.UserID = ?
    `, [userId]);

        return customers[0];
    }

    // Get all customers
    static async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const [customers] = await db.query(`
      SELECT 
        c.CustomerID,
        u.UserID, u.Name, u.Email, u.Phone, u.CreatedAt
      FROM customer c
      JOIN user u ON c.UserID = u.UserID
      ORDER BY u.CreatedAt DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

        return customers;
    }

    // Get customer statistics
    static async getStatistics(customerId) {
        const [stats] = await db.query(`
      SELECT 
        COUNT(DISTINCT sr.RequestID) as totalRequests,
        COUNT(DISTINCT CASE WHEN st.StatusName = 'Completed' THEN sr.RequestID END) as completedRequests,
        COUNT(DISTINCT CASE WHEN st.StatusName = 'Pending' THEN sr.RequestID END) as pendingRequests,
        COALESCE(SUM(CASE WHEN p.PaymentStatus = 'paid' THEN p.Amount ELSE 0 END), 0) as totalSpent
      FROM customer c
      LEFT JOIN servicerequest sr ON c.CustomerID = sr.CustomerID
      LEFT JOIN status st ON sr.StatusID = st.StatusID
      LEFT JOIN payment p ON sr.RequestID = p.RequestID
      WHERE c.CustomerID = ?
      GROUP BY c.CustomerID
    `, [customerId]);

        return stats[0] || {
            totalRequests: 0,
            completedRequests: 0,
            pendingRequests: 0,
            totalSpent: 0
        };
    }
}

module.exports = Customer;
