const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'khadamati'
};

async function verifyDb() {
    let connection;
    try {
        console.log('Testing Database Connection...');
        console.log('Config:', { ...dbConfig, password: '****' });

        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL!');

        const [rows] = await connection.execute('SELECT count(*) as count FROM user');
        console.log(`✅ Table 'user' exists. User count: ${rows[0].count}`);

        const [admin] = await connection.execute("SELECT * FROM user WHERE Role = 'admin'");
        if (admin.length > 0) {
            console.log('✅ Admin user found:', admin[0].Email);
        } else {
            console.log('⚠️ No admin user found.');
        }

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('Hint: The database name might be wrong or database does not exist.');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('Hint: MySQL is not running or port is wrong.');
        }
    } finally {
        if (connection) await connection.end();
    }
}

verifyDb();
