const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'backend/.env' });

async function fix() {
    console.log('Connecting...');
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'khadamati'
        });
        console.log('Connected.');

        // Check Statuses
        const [rows] = await conn.execute('SELECT * FROM status');
        console.log('Statuses count:', rows.length);
        if (rows.length === 0) {
            console.log('Seeding statuses...');
            await conn.execute(`INSERT INTO status (StatusID, StatusName, Description) VALUES 
                (1, 'Pending', 'Request is pending approval'),
                (2, 'Accepted', 'Request accepted by provider'),
                (3, 'Completed', 'Service completed'),
                (4, 'Rejected', 'Request rejected by provider'),
                (5, 'Cancelled', 'Request cancelled by customer')`);
            console.log('Seeded statuses.');
        }

        // Check ServiceRequest Schema
        console.log('Checking ServiceRequest columns...');
        const [cols] = await conn.execute('DESCRIBE servicerequest');
        const colNames = cols.map(c => c.Field);
        console.log('Columns:', colNames.join(', '));

        // Close
        await conn.end();
        console.log('Done.');
    } catch (e) {
        console.error('Error:', e.message);
    }
}
fix();
