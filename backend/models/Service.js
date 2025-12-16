const db = require('../config/database');

class Service {
    // Create service
    static async create(serviceData) {
        const { title, description, price, categoryId, providerId, status } = serviceData;

        const [result] = await db.query(
            'INSERT INTO service (Title, Description, Price, CategoryID, ProviderID, Status) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, price, categoryId, providerId, status || 'active']
        );

        return result.insertId;
    }

    // Get all services with filters
    static async findAll(filters = {}) {
        let query = `
      SELECT 
        s.ServiceID, s.Title, s.Description, s.Price, s.Status,
        c.CategoryID, c.Name as CategoryName,
        p.ProviderID, u.Name as ProviderName, p.Rating, p.Specialization, p.TotalReviews
      FROM service s
      LEFT JOIN category c ON s.CategoryID = c.CategoryID
      LEFT JOIN provider p ON s.ProviderID = p.ProviderID
      LEFT JOIN user u ON p.UserID = u.UserID
      WHERE 1=1
    `;

        const params = [];

        if (filters.categoryId) {
            query += ' AND s.CategoryID = ?';
            params.push(filters.categoryId);
        }

        if (filters.providerId) {
            query += ' AND s.ProviderID = ?';
            params.push(filters.providerId);
        }

        if (filters.status) {
            query += ' AND s.Status = ?';
            params.push(filters.status);
        }

        if (filters.search) {
            query += ' AND (s.Title LIKE ? OR s.Description LIKE ?)';
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        query += ' ORDER BY s.ServiceID DESC';

        if (filters.limit) {
            const offset = ((filters.page || 1) - 1) * filters.limit;
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(filters.limit), offset);
        }

        const [services] = await db.query(query, params);
        return services;
    }

    // Get service by ID
    static async findById(serviceId) {
        const [services] = await db.query(`
      SELECT 
        s.ServiceID, s.Title, s.Description, s.Price, s.Status,
        c.CategoryID, c.Name as CategoryName,
        p.ProviderID, u.Name as ProviderName, u.Email as ProviderEmail, 
        u.Phone as ProviderPhone, p.Rating, p.Specialization, p.TotalReviews
      FROM service s
      LEFT JOIN category c ON s.CategoryID = c.CategoryID
      LEFT JOIN provider p ON s.ProviderID = p.ProviderID
      LEFT JOIN user u ON p.UserID = u.UserID
      WHERE s.ServiceID = ?
    `, [serviceId]);

        if (services.length === 0) return null;

        // Get service images
        const [images] = await db.query(
            'SELECT ImageID, ImageURL, Caption FROM serviceimage WHERE ServiceID = ?',
            [serviceId]
        );

        return { ...services[0], images };
    }

    // Update service
    static async update(serviceId, serviceData) {
        const { title, description, price, categoryId, status } = serviceData;

        await db.query(
            'UPDATE service SET Title = ?, Description = ?, Price = ?, CategoryID = ?, Status = ? WHERE ServiceID = ?',
            [title, description, price, categoryId, status, serviceId]
        );

        return this.findById(serviceId);
    }

    // Delete service (with related records to handle FK constraints)
    static async delete(serviceId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Delete service images
            await connection.query('DELETE FROM serviceimage WHERE ServiceID = ?', [serviceId]);

            // 2. Get all service requests for this service
            const [requests] = await connection.query(
                'SELECT RequestID FROM servicerequest WHERE ServiceID = ?',
                [serviceId]
            );

            // 3. Delete reviews linked to those requests
            if (requests.length > 0) {
                const requestIds = requests.map(r => r.RequestID);
                await connection.query(
                    `DELETE FROM review WHERE RequestID IN (${requestIds.map(() => '?').join(',')})`,
                    requestIds
                );

                // 4. Delete payments linked to those requests
                await connection.query(
                    `DELETE FROM payment WHERE RequestID IN (${requestIds.map(() => '?').join(',')})`,
                    requestIds
                );
            }

            // 5. Delete service requests
            await connection.query('DELETE FROM servicerequest WHERE ServiceID = ?', [serviceId]);

            // 6. Finally delete the service
            const [result] = await connection.query('DELETE FROM service WHERE ServiceID = ?', [serviceId]);

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Get services by provider
    static async findByProvider(providerId) {
        return this.findAll({ providerId });
    }

    // Get services by category
    static async findByCategory(categoryId) {
        return this.findAll({ categoryId });
    }

    // Add service image
    static async addImage(serviceId, imageUrl, caption = null) {
        const [result] = await db.query(
            'INSERT INTO serviceimage (ServiceID, ImageURL, Caption) VALUES (?, ?, ?)',
            [serviceId, imageUrl, caption]
        );
        return result.insertId;
    }

    // Delete service image
    static async deleteImage(imageId) {
        const [result] = await db.query('DELETE FROM serviceimage WHERE ImageID = ?', [imageId]);
        return result.affectedRows > 0;
    }
}

module.exports = Service;
