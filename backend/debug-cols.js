const db = require('./config/database');
const fs = require('fs');

async function debug() {
    try {
        const [pCols] = await db.query('SHOW COLUMNS FROM provider');
        const colNames = pCols.map(c => c.Field).join('\n');
        fs.writeFileSync('cols.txt', colNames);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
debug();
