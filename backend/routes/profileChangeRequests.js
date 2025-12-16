const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const db = require('../config/database');

// Submit profile change request (authenticated users)
router.post('/',
    authenticate,
    [
        body('name').optional().trim().notEmpty(),
        body('email').optional().isEmail(),
        body('phone').optional().trim(),
        body('specialization').optional().trim()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: 'Validation failed', details: errors.array() });
            }

            const userId = req.user.UserID;
            const requestedChanges = req.body;

            // Check if user already has a pending request
            const [pending] = await db.query(
                'SELECT RequestID FROM profile_change_request WHERE UserID = ? AND Status = "pending"',
                [userId]
            );

            if (pending.length > 0) {
                return res.status(400).json({
                    error: 'You already have a pending profile change request. Please wait for admin approval.'
                });
            }

            // Get current user data
            const [currentUser] = await db.query(
                'SELECT Name, Email, Phone FROM user WHERE UserID = ?',
                [userId]
            );

            if (currentUser.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Get role-specific data
            let roleData = {};
            const userRole = req.user.Role;

            if (userRole === 'provider') {
                const [providerData] = await db.query(
                    'SELECT Specialization FROM provider WHERE UserID = ?',
                    [userId]
                );
                if (providerData.length > 0) {
                    roleData = providerData[0];
                }
            }

            const currentData = {
                ...currentUser[0],
                ...roleData
            };

            // Insert change request
            const [result] = await db.query(
                `INSERT INTO profile_change_request 
        (UserID, RequestType, CurrentData, RequestedChanges, Status) 
        VALUES (?, ?, ?, ?, 'pending')`,
                [
                    userId,
                    userRole,
                    JSON.stringify(currentData),
                    JSON.stringify(requestedChanges)
                ]
            );

            res.status(201).json({
                message: 'Profile change request submitted successfully. Awaiting admin approval.',
                requestId: result.insertId
            });
        } catch (error) {
            console.error('Error submitting profile change request:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// Get user's own pending/recent change requests
router.get('/my-requests', authenticate, async (req, res) => {
    try {
        const userId = req.user.UserID;

        const [requests] = await db.query(
            `SELECT 
        RequestID,
        RequestType,
        RequestedChanges,
        Status,
        RejectionReason,
        RequestedAt,
        ReviewedAt
      FROM profile_change_request
      WHERE UserID = ?
      ORDER BY RequestedAt DESC
      LIMIT 10`,
            [userId]
        );

        res.json({
            requests: requests.map(r => ({
                ...r,
                RequestedChanges: JSON.parse(r.RequestedChanges)
            }))
        });
    } catch (error) {
        console.error('Error fetching user requests:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Cancel own pending request
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const requestId = req.params.id;
        const userId = req.user.UserID;

        const [request] = await db.query(
            'SELECT UserID, Status FROM profile_change_request WHERE RequestID = ?',
            [requestId]
        );

        if (request.length === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (request[0].UserID !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        if (request[0].Status !== 'pending') {
            return res.status(400).json({ error: 'Cannot cancel non-pending request' });
        }

        await db.query('DELETE FROM profile_change_request WHERE RequestID = ?', [requestId]);

        res.json({ message: 'Change request cancelled' });
    } catch (error) {
        console.error('Error cancelling request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ADMIN ROUTES

// Get all profile change requests (admin only)
router.get('/admin/all', authenticate, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.Role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const status = req.query.status || 'pending';

        const [requests] = await db.query(
            `SELECT 
        pcr.*,
        u.Name as UserName,
        u.Email as UserEmail,
        reviewer.Name as ReviewerName
      FROM profile_change_request pcr
      JOIN user u ON pcr.UserID = u.UserID
      LEFT JOIN user reviewer ON pcr.ReviewedBy = reviewer.UserID
      WHERE pcr.Status = ?
      ORDER BY pcr.RequestedAt DESC`,
            [status]
        );

        res.json({
            requests: requests.map(r => ({
                ...r,
                CurrentData: JSON.parse(r.CurrentData),
                RequestedChanges: JSON.parse(r.RequestedChanges)
            }))
        });
    } catch (error) {
        console.error('Error fetching profile change requests:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Approve profile change request (admin only)
router.put('/admin/:id/approve', authenticate, async (req, res) => {
    const connection = await db.getConnection();

    try {
        // Check if user is admin
        if (req.user.Role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        await connection.beginTransaction();

        const requestId = req.params.id;
        const adminId = req.user.UserID;

        // Get request details
        const [requests] = await connection.query(
            'SELECT * FROM profile_change_request WHERE RequestID = ? AND Status = "pending"',
            [requestId]
        );

        if (requests.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Request not found or already processed' });
        }

        const request = requests[0];
        const userId = request.UserID;
        const requestedChanges = JSON.parse(request.RequestedChanges);
        const requestType = request.RequestType;

        // Update user table
        const userUpdates = [];
        const userValues = [];

        if (requestedChanges.name) {
            userUpdates.push('Name = ?');
            userValues.push(requestedChanges.name);
        }
        if (requestedChanges.email) {
            userUpdates.push('Email = ?');
            userValues.push(requestedChanges.email);
        }
        if (requestedChanges.phone) {
            userUpdates.push('Phone = ?');
            userValues.push(requestedChanges.phone);
        }

        if (userUpdates.length > 0) {
            await connection.query(
                `UPDATE user SET ${userUpdates.join(', ')} WHERE UserID = ?`,
                [...userValues, userId]
            );
        }

        // Update role-specific table
        if (requestType === 'provider' && requestedChanges.specialization) {
            await connection.query(
                'UPDATE provider SET Specialization = ? WHERE UserID = ?',
                [requestedChanges.specialization, userId]
            );
        }

        // Mark request as approved
        await connection.query(
            `UPDATE profile_change_request 
      SET Status = 'approved', ReviewedBy = ?, ReviewedAt = NOW() 
      WHERE RequestID = ?`,
            [adminId, requestId]
        );

        await connection.commit();

        res.json({ message: 'Profile change request approved and changes applied' });
    } catch (error) {
        await connection.rollback();
        console.error('Error approving profile change request:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        connection.release();
    }
});

// Reject profile change request (admin only)
router.put('/admin/:id/reject', authenticate, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.Role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const requestId = req.params.id;
        const adminId = req.user.UserID;
        const { reason } = req.body;

        const [result] = await db.query(
            `UPDATE profile_change_request 
      SET Status = 'rejected', RejectionReason = ?, ReviewedBy = ?, ReviewedAt = NOW() 
      WHERE RequestID = ? AND Status = 'pending'`,
            [reason || 'No reason provided', adminId, requestId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Request not found or already processed' });
        }

        res.json({ message: 'Profile change request rejected' });
    } catch (error) {
        console.error('Error rejecting profile change request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
