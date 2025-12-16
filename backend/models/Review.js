const db = require('../config/database');

class Review {
    // Create review
    static async create(reviewData) {
        const { requestId, rating, comment } = reviewData;

        const [result] = await db.query(
            'INSERT INTO review (RequestID, Rating, Comment) VALUES (?, ?, ?)',
            [requestId, rating, comment]
        );

        // Update provider rating
        await this.updateProviderRating(requestId);

        return result.insertId;
    }

    // Get review by ID
    static async findById(reviewId) {
        const [reviews] = await db.query(`
      SELECT 
        r.ReviewID, r.Rating, r.Comment, r.CreatedAt,
        sr.RequestID,
        s.ServiceID, s.Title as ServiceTitle,
        c.CustomerID, cu.Name as CustomerName,
        p.ProviderID, pu.Name as ProviderName
      FROM review r
      JOIN servicerequest sr ON r.RequestID = sr.RequestID
      JOIN service s ON sr.ServiceID = s.ServiceID
      JOIN customer c ON sr.CustomerID = c.CustomerID
      JOIN user cu ON c.UserID = cu.UserID
      JOIN provider p ON s.ProviderID = p.ProviderID
      JOIN user pu ON p.UserID = pu.UserID
      WHERE r.ReviewID = ?
    `, [reviewId]);

        return reviews[0];
    }

    // Get all reviews
    static async findAll(filters = {}) {
        let query = `
      SELECT 
        r.ReviewID, r.Rating, r.Comment, r.CreatedAt,
        sr.RequestID,
        s.ServiceID, s.Title as ServiceTitle,
        c.CustomerID, cu.Name as CustomerName,
        p.ProviderID, pu.Name as ProviderName
      FROM review r
      JOIN servicerequest sr ON r.RequestID = sr.RequestID
      JOIN service s ON sr.ServiceID = s.ServiceID
      JOIN customer c ON sr.CustomerID = c.CustomerID
      JOIN user cu ON c.UserID = cu.UserID
      JOIN provider p ON s.ProviderID = p.ProviderID
      JOIN user pu ON p.UserID = pu.UserID
      WHERE 1=1
    `;

        const params = [];

        if (filters.serviceId) {
            query += ' AND s.ServiceID = ?';
            params.push(filters.serviceId);
        }

        if (filters.providerId) {
            query += ' AND p.ProviderID = ?';
            params.push(filters.providerId);
        }

        if (filters.customerId) {
            query += ' AND c.CustomerID = ?';
            params.push(filters.customerId);
        }

        query += ' ORDER BY r.CreatedAt DESC';

        if (filters.limit) {
            const offset = ((filters.page || 1) - 1) * filters.limit;
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(filters.limit), offset);
        }

        const [reviews] = await db.query(query, params);
        return reviews;
    }

    // Get reviews by service
    static async findByService(serviceId) {
        return this.findAll({ serviceId });
    }

    // Get reviews by provider
    static async findByProvider(providerId) {
        return this.findAll({ providerId });
    }

    // Update review
    static async update(reviewId, reviewData) {
        const { rating, comment } = reviewData;

        await db.query(
            'UPDATE review SET Rating = ?, Comment = ? WHERE ReviewID = ?',
            [rating, comment, reviewId]
        );

        // Get request ID to update provider rating
        const [review] = await db.query('SELECT RequestID FROM review WHERE ReviewID = ?', [reviewId]);
        if (review.length > 0) {
            await this.updateProviderRating(review[0].RequestID);
        }

        return this.findById(reviewId);
    }

    // Delete review
    static async delete(reviewId) {
        // Get request ID before deleting
        const [review] = await db.query('SELECT RequestID FROM review WHERE ReviewID = ?', [reviewId]);

        const [result] = await db.query('DELETE FROM review WHERE ReviewID = ?', [reviewId]);

        // Update provider rating after deletion
        if (review.length > 0) {
            await this.updateProviderRating(review[0].RequestID);
        }

        return result.affectedRows > 0;
    }

    // Update provider rating based on reviews
    static async updateProviderRating(requestId) {
        // Get provider ID from request
        const [request] = await db.query(`
      SELECT p.ProviderID
      FROM servicerequest sr
      JOIN service s ON sr.ServiceID = s.ServiceID
      JOIN provider p ON s.ProviderID = p.ProviderID
      WHERE sr.RequestID = ?
    `, [requestId]);

        if (request.length === 0) return;

        const providerId = request[0].ProviderID;

        // Calculate average rating and total reviews for this provider
        const [stats] = await db.query(`
      SELECT 
        AVG(r.Rating) as avgRating,
        COUNT(r.ReviewID) as totalReviews
      FROM review r
      JOIN servicerequest sr ON r.RequestID = sr.RequestID
      JOIN service s ON sr.ServiceID = s.ServiceID
      WHERE s.ProviderID = ?
    `, [providerId]);

        const avgRating = stats[0].avgRating || 0;
        const totalReviews = stats[0].totalReviews || 0;

        // Update provider
        await db.query(
            'UPDATE provider SET Rating = ?, TotalReviews = ? WHERE ProviderID = ?',
            [avgRating, totalReviews, providerId]
        );
    }

    // Check if review exists for request
    static async existsForRequest(requestId) {
        const [reviews] = await db.query(
            'SELECT ReviewID FROM review WHERE RequestID = ?',
            [requestId]
        );
        return reviews.length > 0;
    }
}

module.exports = Review;
