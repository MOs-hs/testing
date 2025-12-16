const db = require('./config/database');

async function createContactTable() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS contact_message (
                MessageID int(11) NOT NULL AUTO_INCREMENT,
                Name varchar(255) NOT NULL,
                Email varchar(255) NOT NULL,
                Message text NOT NULL,
                Status enum('new', 'read', 'replied') DEFAULT 'new',
                CreatedAt datetime DEFAULT current_timestamp(),
                PRIMARY KEY (MessageID)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('Contact message table created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
}

createContactTable();
