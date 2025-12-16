const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Direct connection config to avoid dependency issues if config path differs
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'khadamati'
};

async function createAdmin() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected!');

        const adminUser = {
            name: 'Admin User',
            email: 'admin@khadamati.com',
            phone: '12345678', // Placeholder phone
            password: 'admin123', // Default password
            role: 'admin'
        };

        // Check if admin already exists
        const [rows] = await connection.execute('SELECT * FROM user WHERE Email = ?', [adminUser.email]);
        if (rows.length > 0) {
            console.log('Admin user already exists with email:', adminUser.email);
            process.exit(0);
        }

        // Hash password
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(adminUser.password, salt);

        // Insert admin
        console.log('Creating admin user...');
        await connection.execute(
            'INSERT INTO user (Name, Email, Phone, PasswordHash, Role) VALUES (?, ?, ?, ?, ?)',
            [adminUser.name, adminUser.email, adminUser.phone, passwordHash, adminUser.role]
        );

        console.log('✅ Admin user created successfully!');
        console.log('Email:', adminUser.email);
        console.log('Password:', adminUser.password);

    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

createAdmin();
