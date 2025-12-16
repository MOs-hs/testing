const db = require('../config/database');

class Certificate {
    // Create certificate
    static async create(certificateData) {
        const { providerId, certificateName, issueDate, expiryDate } = certificateData;

        const [result] = await db.query(
            'INSERT INTO certificate (ProviderID, CertificateName, IssueDate, ExpiryDate) VALUES (?, ?, ?, ?)',
            [providerId, certificateName, issueDate, expiryDate]
        );

        return result.insertId;
    }

    // Get certificates by provider
    static async findByProvider(providerId) {
        const [certificates] = await db.query(
            'SELECT CertificateID, CertificateName, IssueDate, ExpiryDate FROM certificate WHERE ProviderID = ? ORDER BY IssueDate DESC',
            [providerId]
        );

        return certificates;
    }

    // Get certificate by ID
    static async findById(certificateId) {
        const [certificates] = await db.query(
            'SELECT CertificateID, ProviderID, CertificateName, IssueDate, ExpiryDate FROM certificate WHERE CertificateID = ?',
            [certificateId]
        );

        return certificates[0];
    }

    // Update certificate
    static async update(certificateId, certificateData) {
        const { certificateName, issueDate, expiryDate } = certificateData;

        await db.query(
            'UPDATE certificate SET CertificateName = ?, IssueDate = ?, ExpiryDate = ? WHERE CertificateID = ?',
            [certificateName, issueDate, expiryDate, certificateId]
        );

        return this.findById(certificateId);
    }

    // Delete certificate
    static async delete(certificateId) {
        const [result] = await db.query(
            'DELETE FROM certificate WHERE CertificateID = ?',
            [certificateId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Certificate;
