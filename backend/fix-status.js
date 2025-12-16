const db = require('./config/database');

async function fixStatus() {
    try {
        console.log('Checking statuses...');
        const [statuses] = await db.query('SELECT * FROM status');
        console.log('Current statuses:', statuses);

        if (statuses.length === 0) {
            console.log('Seeding statuses...');
            await db.query(`INSERT INTO status (StatusID, StatusName, Description) VALUES 
                (1, 'Pending', 'Request is pending approval'),
                (2, 'Accepted', 'Request accepted by provider'),
                (3, 'Completed', 'Service completed'),
                (4, 'Rejected', 'Request rejected by provider'),
                (5, 'Cancelled', 'Request cancelled by customer')
            `);
            console.log('Seeded statuses.');
        } else {
            console.log('Statuses already exist.');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        // Force exit to prevent hanging
        process.exit(0);
    }
}

fixStatus();
