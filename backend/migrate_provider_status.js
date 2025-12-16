const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'khadamati'
};

async function migrate() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);

        console.log('Checking if columns need to be added...');

        // Check if Status column exists
        const [statusColumns] = await connection.query("SHOW COLUMNS FROM provider LIKE 'Status'");
        if (statusColumns.length === 0) {
            console.log('Adding Status column...');
            await connection.query("ALTER TABLE provider ADD COLUMN Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending'");
            console.log('Status column added.');

            // Update existing providers to Approved
            await connection.query("UPDATE provider SET Status = 'Approved'");
            console.log('Existing providers set to Approved.');
        } else {
            console.log('Status column already exists.');
        }

        // Check if CVURL column exists
        const [cvColumns] = await connection.query("SHOW COLUMNS FROM provider LIKE 'CVURL'");
        if (cvColumns.length === 0) {
            console.log('Adding CVURL column...');
            await connection.query("ALTER TABLE provider ADD COLUMN CVURL VARCHAR(500) DEFAULT NULL");
            console.log('CVURL column added.');
        } else {
            console.log('CVURL column already exists.');
        }

        console.log('Migration completed successfully.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

migrate();
