const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'backend/.env' });

async function check() {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'khadamati'
        });

        console.log('Connected to DB.');
        const [cols] = await conn.execute('DESCRIBE servicerequest');
        console.log('Columns:', cols.map(c => c.Field).join(', '));
        await conn.end();
    } catch (e) {
        console.error(e);
    }
}
check();
