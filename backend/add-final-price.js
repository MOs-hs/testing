const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'backend/.env' });

async function addCol() {
    console.log('Connecting...');
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'khadamati'
        });
        console.log('Connected.');

        try {
            await conn.execute('ALTER TABLE servicerequest ADD COLUMN FinalPrice DECIMAL(10, 2) NULL DEFAULT NULL');
            console.log('Added FinalPrice column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('Column already exists.');
            } else {
                throw e;
            }
        }

        await conn.end();
    } catch (e) {
        console.error('Error:', e.message);
    }
}
addCol();
