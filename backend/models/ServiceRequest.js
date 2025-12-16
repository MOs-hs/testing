const db = require('../config/database');

class ServiceRequest {
    // Create service request
    static async create(requestData) {
        const { customerId, serviceId, scheduledDate, details, addressLine, city } = requestData;

        const [result] = await db.query(
            'INSERT INTO servicerequest (CustomerID, ServiceID, ScheduledDate, Details, AddressLine, City, StatusID) VALUES (?, ?, ?, ?, ?, ?, 1)',
            [customerId, serviceId, scheduledDate, details, addressLine, city]
        );

        return result.insertId;
    }

    // Get all requests with filters
    static async findAll(filters = {}) {
        let query = `
      SELECT 
        sr.RequestID, sr.RequestDate, sr.ScheduledDate, sr.Details, sr.AddressLine, sr.City, sr.FinalPrice,
        s.ServiceID, s.Title as ServiceTitle, s.Price,
        c.CustomerID, cu.Name as CustomerName, cu.Email as CustomerEmail, cu.Phone as CustomerPhone,
        p.ProviderID, pu.Name as ProviderName, pu.Email as ProviderEmail, pu.Phone as ProviderPhone,
        st.StatusID, st.StatusName, st.Description as StatusDescription
      FROM servicerequest sr
      JOIN service s ON sr.ServiceID = s.ServiceID
      JOIN customer c ON sr.CustomerID = c.CustomerID
      JOIN user cu ON c.UserID = cu.UserID
      JOIN provider p ON s.ProviderID = p.ProviderID
      JOIN user pu ON p.UserID = pu.UserID
      LEFT JOIN status st ON sr.StatusID = st.StatusID
      WHERE 1=1
    `;

        const params = [];

        if (filters.customerId) {
            query += ' AND sr.CustomerID = ?';
            params.push(filters.customerId);
        }

        if (filters.providerId) {
            query += ' AND p.ProviderID = ?';
            params.push(filters.providerId);
        }

        if (filters.statusId) {
            query += ' AND sr.StatusID = ?';
            params.push(filters.statusId);
        }

        query += ' ORDER BY sr.RequestDate DESC';

        if (filters.limit) {
            const offset = ((filters.page || 1) - 1) * filters.limit;
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(filters.limit), offset);
        }

        const [requests] = await db.query(query, params);
        return requests;
    }

    // Get request by ID
    static async findById(requestId) {
        const [requests] = await db.query(`
      SELECT 
        sr.RequestID, sr.RequestDate, sr.ScheduledDate, sr.Details, sr.AddressLine, sr.City, sr.FinalPrice,
        s.ServiceID, s.Title as ServiceTitle, s.Description as ServiceDescription, s.Price,
        c.CustomerID, cu.Name as CustomerName, cu.Email as CustomerEmail, cu.Phone as CustomerPhone,
        p.ProviderID, pu.Name as ProviderName, pu.Email as ProviderEmail, pu.Phone as ProviderPhone,
        st.StatusID, st.StatusName, st.Description as StatusDescription
      FROM servicerequest sr
      JOIN service s ON sr.ServiceID = s.ServiceID
      JOIN customer c ON sr.CustomerID = c.CustomerID
      JOIN user cu ON c.UserID = cu.UserID
      JOIN provider p ON s.ProviderID = p.ProviderID
      JOIN user pu ON p.UserID = pu.UserID
      LEFT JOIN status st ON sr.StatusID = st.StatusID
      WHERE sr.RequestID = ?
    `, [requestId]);

        return requests[0];
    }

    // Update request status
    static async updateStatus(requestId, statusId, finalPrice = null) {
        if (finalPrice !== null) {
            await db.query(
                'UPDATE servicerequest SET StatusID = ?, FinalPrice = ? WHERE RequestID = ?',
                [statusId, finalPrice, requestId]
            );
        } else {
            await db.query(
                'UPDATE servicerequest SET StatusID = ? WHERE RequestID = ?',
                [statusId, requestId]
            );
        }

        return this.findById(requestId);
    }

    // Update request details
    static async update(requestId, requestData) {
        const { scheduledDate, details, addressLine, city, statusId } = requestData;

        await db.query(
            'UPDATE servicerequest SET ScheduledDate = ?, Details = ?, AddressLine = ?, City = ?, StatusID = ? WHERE RequestID = ?',
            [scheduledDate, details, addressLine, city, statusId, requestId]
        );

        return this.findById(requestId);
    }

    // Delete request
    static async delete(requestId) {
        const [result] = await db.query('DELETE FROM servicerequest WHERE RequestID = ?', [requestId]);
        return result.affectedRows > 0;
    }

    // Get requests by customer
    static async findByCustomer(customerId, page = 1, limit = 10) {
        return this.findAll({ customerId, page, limit });
    }

    // Get requests by provider
    static async findByProvider(providerId, page = 1, limit = 10) {
        return this.findAll({ providerId, page, limit });
    }

    // Get all statuses
    static async getAllStatuses() {
        const [statuses] = await db.query('SELECT StatusID, StatusName, Description FROM status');
        return statuses;
    }
}

module.exports = ServiceRequest;
