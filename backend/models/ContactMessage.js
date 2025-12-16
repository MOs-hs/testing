const db = require('../config/database');

class ContactMessage {
    // Create new message
    static async create(messageData) {
        const { name, email, message } = messageData;
        const [result] = await db.query(
            'INSERT INTO contact_message (Name, Email, Message) VALUES (?, ?, ?)',
            [name, email, message]
        );
        return result.insertId;
    }

    // Get all messages
    static async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [messages] = await db.query(
            'SELECT * FROM contact_message ORDER BY CreatedAt DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        const [countResult] = await db.query('SELECT COUNT(*) as total FROM contact_message');
        return { messages, total: countResult[0].total };
    }

    // Get message by ID
    static async findById(id) {
        const [messages] = await db.query('SELECT * FROM contact_message WHERE MessageID = ?', [id]);
        return messages[0];
    }

    // Mark as read (optional, if we add Status column)
    static async markAsRead(id) {
        // Assuming we might add a Status column later or now. 
        // For now let's just implement it if the column exists, or skip it.
        // I will add Status column to the table creation script.
        const [result] = await db.query(
            "UPDATE contact_message SET Status = 'read' WHERE MessageID = ?",
            [id]
        );
        return result.affectedRows > 0;
    }

    // Delete message
    static async delete(id) {
        const [result] = await db.query('DELETE FROM contact_message WHERE MessageID = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = ContactMessage;
