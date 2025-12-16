const db = require('../config/database');

class Provider {
  // Create provider (after user registration)
  static async create(userId, specialization = null, cvUrl = null, status = 'Pending') {
    const [result] = await db.query(
      'INSERT INTO provider (UserID, Specialization, CVURL, Status) VALUES (?, ?, ?, ?)',
      [userId, specialization, cvUrl, status]
    );

    return result.insertId;
  }

  // Get provider by ID
  static async findById(providerId) {
    const [providers] = await db.query(`
      SELECT 
        p.ProviderID, p.Specialization, p.Rating, p.TotalReviews, p.Status, p.CVURL,
        u.UserID, u.Name, u.Email, u.Phone, u.CreatedAt
      FROM provider p
      JOIN user u ON p.UserID = u.UserID
      WHERE p.ProviderID = ?
    `, [providerId]);

    return providers[0];
  }

  // Get provider by user ID
  static async findByUserId(userId) {
    const [providers] = await db.query(`
      SELECT 
        p.ProviderID, p.Specialization, p.Rating, p.TotalReviews, p.Status, p.CVURL,
        u.UserID, u.Name, u.Email, u.Phone, u.CreatedAt
      FROM provider p
      JOIN user u ON p.UserID = u.UserID
      WHERE p.UserID = ?
    `, [userId]);

    return providers[0];
  }

  // Get all providers
  static async findAll(filters = {}) {
    let query = `
      SELECT 
        p.ProviderID, p.Specialization, p.Rating, p.TotalReviews, p.Status, p.CVURL,
        u.UserID, u.Name, u.Email, u.Phone, u.CreatedAt
      FROM provider p
      JOIN user u ON p.UserID = u.UserID
      WHERE 1=1
    `;

    const params = [];

    if (filters.minRating) {
      query += ' AND p.Rating >= ?';
      params.push(filters.minRating);
    }

    if (filters.specialization) {
      query += ' AND p.Specialization LIKE ?';
      params.push(`%${filters.specialization}%`);
    }

    if (filters.status) {
      query += ' AND p.Status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY p.Rating DESC, p.TotalReviews DESC';

    if (filters.limit) {
      const offset = ((filters.page || 1) - 1) * filters.limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(filters.limit), offset);
    }

    const [providers] = await db.query(query, params);
    return providers;
  }

  // Update provider
  static async update(providerId, providerData) {
    const { specialization } = providerData;

    await db.query(
      'UPDATE provider SET Specialization = ? WHERE ProviderID = ?',
      [specialization, providerId]
    );

    return this.findById(providerId);
  }

  // Update provider status
  static async updateStatus(providerId, status) {
    await db.query(
      'UPDATE provider SET Status = ? WHERE ProviderID = ?',
      [status, providerId]
    );
    return this.findById(providerId);
  }

  // Get provider statistics
  static async getStatistics(providerId) {
    const [stats] = await db.query(`
      SELECT 
        COUNT(DISTINCT s.ServiceID) as totalServices,
        COUNT(DISTINCT sr.RequestID) as totalRequests,
        COUNT(DISTINCT CASE WHEN st.StatusName = 'Completed' THEN sr.RequestID END) as completedRequests,
        COALESCE(SUM(CASE WHEN p.PaymentStatus = 'paid' THEN p.Amount ELSE 0 END), 0) as totalEarnings,
        pr.Rating,
        pr.TotalReviews
      FROM provider pr
      LEFT JOIN service s ON pr.ProviderID = s.ProviderID
      LEFT JOIN servicerequest sr ON s.ServiceID = sr.ServiceID
      LEFT JOIN status st ON sr.StatusID = st.StatusID
      LEFT JOIN payment p ON sr.RequestID = p.RequestID
      WHERE pr.ProviderID = ?
      GROUP BY pr.ProviderID
    `, [providerId]);

    return stats[0] || {
      totalServices: 0,
      totalRequests: 0,
      completedRequests: 0,
      totalEarnings: 0,
      Rating: 0,
      TotalReviews: 0
    };
  }
}

module.exports = Provider;
