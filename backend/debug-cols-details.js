const db = require('./config/database');
const fs = require('fs');

async function debug() {
    try {
        const [pCols] = await db.query('SHOW COLUMNS FROM provider');
        const details = pCols.map(c => `${c.Field} ${c.Type} ${c.Null}`).join('\n');
        fs.writeFileSync('cols_details.txt', details);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
debug();
