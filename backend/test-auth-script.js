const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
    try {
        console.log('1. Attempting Login...');
        // Use a known user or create one? 
        // I'll try to login with the user from the screenshot if I knew the creds, but I don't.
        // I'll try to register a new user for testing.
        const email = `test${Date.now()}@example.com`;
        const password = 'password123';

        console.log(`   Registering ${email}...`);
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email,
            password,
            role: 'customer',
            phone: '1234567890'
        });

        const token = regRes.data.token;
        console.log('   Registration successful. Token received:', token ? 'YES' : 'NO');

        if (!token) throw new Error('No token received');

        console.log('2. Testing Protected Route (POST /reviews)...');
        // We need a valid requestId. Since we don't have one easily, we expect 404 (Request not found) or 400 (Validation), 
        // BUT NOT 401 (Unauthorized).
        try {
            await axios.post(`${API_URL}/reviews`, {
                requestId: 99999, // Non-existent ID
                rating: 5,
                comment: 'Test review'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.log(`   Response Status: ${err.response?.status}`);
            console.log(`   Response Data:`, err.response?.data);

            if (err.response?.status === 401) {
                console.error('   FAIL: Got 401 Unauthorized!');
            } else {
                console.log('   SUCCESS: Auth passed (got expected error for invalid data).');
            }
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
        }
    }
}

testAuth();
