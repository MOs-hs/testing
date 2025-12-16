const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'backend/.env' });

const API_URL = 'http://localhost:3000/api';

async function testReview() {
    let conn;
    try {
        const timestamp = Date.now();
        const email = `test_${timestamp}@example.com`;
        const password = 'password123';
        const name = `Test User ${timestamp}`;

        console.log(`1. Registering ${email}...`);
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role: 'customer' })
        });
        const regData = await regRes.json();
        if (!regRes.ok) throw new Error(`Register failed: ${JSON.stringify(regData)}`);

        console.log('2. Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);

        const token = loginData.token;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Get a service ID. Assuming ServiceID 1 exists.
        const serviceId = 1;

        console.log('3. Creating Request...');
        const reqRes = await fetch(`${API_URL}/requests`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                serviceId: serviceId,
                scheduledDate: new Date().toISOString(),
                details: 'Test details',
                addressLine: 'Test Address',
                city: 'Test City'
            })
        });
        const reqData = await reqRes.json();
        if (!reqRes.ok) throw new Error(`Create Request failed: ${JSON.stringify(reqData)}`);

        const requestId = reqData.request.RequestID;
        console.log(`Request Created: ${requestId}`);

        console.log('4. Mark as Completed (DB Direct)...');
        conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'khadamati'
        });

        await conn.execute('UPDATE servicerequest SET StatusID = 4 WHERE RequestID = ?', [requestId]);
        console.log('Request Marked as Completed.');

        // Debug: Fetch request to see what backend sees
        const verifyRes = await fetch(`${API_URL}/requests/${requestId}`, { headers });
        const verifyData = await verifyRes.json();
        console.log('Debug Request Data:', JSON.stringify(verifyData.request, null, 2));

        // Dump Status Table
        console.log('Dumping Statuses...');
        const [statuses] = await conn.execute('SELECT * FROM status');
        console.table(statuses);

        console.log('5. Submitting Review...');
        const reviewRes = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                requestId: requestId, // Verify case matching backend expectation
                rating: 5,
                comment: 'Great service! (Test)'
            })
        });

        const reviewData = await reviewRes.json();

        if (reviewRes.ok) {
            console.log('Review Success:', reviewData);
        } else {
            console.log('Review Failed Status:', reviewRes.status);
            console.log('Error Data:', JSON.stringify(reviewData, null, 2));
        }

    } catch (e) {
        console.error('Test Error:', e.message);
    } finally {
        if (conn) await conn.end();
    }
}

testReview();
