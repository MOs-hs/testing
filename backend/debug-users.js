const db = require('./config/database');

async function debug() {
    try {
        const [rows] = await db.query('SELECT COUNT(*) as c FROM user WHERE CreatedAt > DATE_SUB(NOW(), INTERVAL 1 HOUR)');
        console.log('USERS_LAST_HOUR:', rows[0].c);

        const [pCols] = await db.query('SHOW COLUMNS FROM provider');
        const colNames = pCols.map(c => c.Field).join(',');
        console.log('PROVIDER_COLS:', colNames);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
debug();
