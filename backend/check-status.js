const db = require('./config/database');

async function checkStatus() {
    try {
        const [statuses] = await db.query('SELECT * FROM status');
        console.log('Statuses:', statuses);
        process.exit(0);
    } catch (error) {
        console.error('Error checking statuses:', error);
        process.exit(1);
    }
}

checkStatus();
