const db = require('./config/database');

async function updateSchema() {
    try {
        await db.query(`
            ALTER TABLE user 
            ADD COLUMN IF NOT EXISTS ResetPasswordToken VARCHAR(255) NULL,
            ADD COLUMN IF NOT EXISTS ResetPasswordExpires DATETIME NULL;
        `);
        console.log('User table updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
}

updateSchema();
