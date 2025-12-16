const db = require('../config/database');

class Payment {
    // Create payment
    static async create(paymentData) {
        const { requestId, amount, paymentStatus } = paymentData;

        const [result] = await db.query(
            'INSERT INTO payment (RequestID, Amount, PaymentStatus) VALUES (?, ?, ?)',
            [requestId, amount, paymentStatus || 'pending']
        );

        return result.insertId;
    }

    // Get payment by ID
    static async findById(paymentId) {
        const [payments] = await db.query(`
      SELECT 
        p.PaymentID, p.Amount, p.PaymentDate, p.PaymentStatus,
        sr.RequestID, sr.ScheduledDate,
        s.ServiceID, s.Title as ServiceTitle,
        c.CustomerID, cu.Name as CustomerName,
        pr.ProviderID, pu.Name as ProviderName
      FROM payment p
      JOIN servicerequest sr ON p.RequestID = sr.RequestID
      JOIN service s ON sr.ServiceID = s.ServiceID
      JOIN customer c ON sr.CustomerID = c.CustomerID
      JOIN user cu ON c.UserID = cu.UserID
      JOIN provider pr ON s.ProviderID = pr.ProviderID
      JOIN user pu ON pr.UserID = pu.UserID
      WHERE p.PaymentID = ?
    `, [paymentId]);

        return payments[0];
    }

    // Get all payments
    static async findAll(filters = {}) {
        let query = `
      SELECT 
        p.PaymentID, p.Amount, p.PaymentDate, p.PaymentStatus,
        sr.RequestID, sr.ScheduledDate,
        s.ServiceID, s.Title as ServiceTitle,
        c.CustomerID, cu.Name as CustomerName,
        pr.ProviderID, pu.Name as ProviderName
      FROM payment p
      JOIN servicerequest sr ON p.RequestID = sr.RequestID
      JOIN service s ON sr.ServiceID = s.ServiceID
      JOIN customer c ON sr.CustomerID = c.CustomerID
      JOIN user cu ON c.UserID = cu.UserID
      JOIN provider pr ON s.ProviderID = pr.ProviderID
      JOIN user pu ON pr.UserID = pu.UserID
      WHERE 1=1
    `;

        const params = [];

        if (filters.customerId) {
            query += ' AND c.CustomerID = ?';
            params.push(filters.customerId);
        }

        if (filters.providerId) {
            query += ' AND pr.ProviderID = ?';
            params.push(filters.providerId);
        }

        if (filters.paymentStatus) {
            query += ' AND p.PaymentStatus = ?';
            params.push(filters.paymentStatus);
        }

        query += ' ORDER BY p.PaymentDate DESC';

        if (filters.limit) {
            const offset = ((filters.page || 1) - 1) * filters.limit;
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(filters.limit), offset);
        }

        const [payments] = await db.query(query, params);
        return payments;
    }

    // Update payment status
    static async updateStatus(paymentId, paymentStatus) {
        await db.query(
            'UPDATE payment SET PaymentStatus = ? WHERE PaymentID = ?',
            [paymentStatus, paymentId]
        );

        return this.findById(paymentId);
    }

    // Get payment by request ID
    static async findByRequest(requestId) {
        const [payments] = await db.query(`
      SELECT 
        p.PaymentID, p.Amount, p.PaymentDate, p.PaymentStatus,
        sr.RequestID
      FROM payment p
      JOIN servicerequest sr ON p.RequestID = sr.RequestID
      WHERE sr.RequestID = ?
    `, [requestId]);

        return payments[0];
    }

    // Get total earnings for provider
    static async getProviderEarnings(providerId, filters = {}) {
        let query = `
      SELECT 
        SUM(p.Amount) as totalEarnings,
        COUNT(p.PaymentID) as totalPayments
      FROM payment p
      JOIN servicerequest sr ON p.RequestID = sr.RequestID
      JOIN service s ON sr.ServiceID = s.ServiceID
      WHERE s.ProviderID = ? AND p.PaymentStatus = 'paid'
    `;

        const params = [providerId];

        if (filters.startDate) {
            query += ' AND p.PaymentDate >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += ' AND p.PaymentDate <= ?';
            params.push(filters.endDate);
        }

        const [result] = await db.query(query, params);
        return result[0];
    }
}

module.exports = Payment;
