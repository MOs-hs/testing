const fs = require('fs');
const path = require('path');
const pool = require('./config/database');

const runUpdate = async () => {
    try {
        const sqlPath = path.join(__dirname, '../update-to-english.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon and remove empty statements
        const queries = sqlContent
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        console.log(`Found ${queries.length} queries to execute.`);

        for (const query of queries) {
            try {
                // Skip comments
                if (query.startsWith('--')) continue;

                console.log(`Executing: ${query.substring(0, 50)}...`);
                await pool.query(query);
                console.log('✅ Success');
            } catch (err) {
                console.error(`❌ Error executing query: ${err.message}`);
                // Continue with other queries even if one fails (e.g. if row doesn't exist)
            }
        }

        console.log('\nDatabase update completed!');
        process.exit(0);
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
};

runUpdate();
