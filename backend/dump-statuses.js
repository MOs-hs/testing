const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'backend/.env' });

async function dump() {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'khadamati'
        });

        const [rows] = await conn.execute('SELECT * FROM status');
        console.log(JSON.stringify(rows, null, 2));
        await conn.end();
    } catch (e) {
        console.error(e);
    }
}
dump();
