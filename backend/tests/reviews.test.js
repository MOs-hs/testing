const test = require('node:test');
const assert = require('node:assert/strict');

const BASE_URL = 'http://localhost:5000/api';

async function makeRequest(url, options = {}) {
    const response = await fetch(`${BASE_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });
    const data = await response.json().catch(() => null);
    return { status: response.status, data };
}

async function getAuthToken() {
    const testEmail = `review${Date.now()}@example.com`;
    const { data } = await makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            name: 'Review Test',
            email: testEmail,
            password: 'TestPass123!',
            phone: '1234567890',
            role: 'customer'
        })
    });
    return data.token;
}

test('GET /reviews returns list of reviews', async () => {
    const { status, data } = await makeRequest('/reviews');
    assert.equal(status, 200);
    assert.ok(Array.isArray(data.reviews), 'Should return array of reviews');
});

test('GET /reviews/service/:id returns reviews for service', async () => {
    // Get a service ID first
    const { data: servicesData } = await makeRequest('/services');
    if (servicesData.services && servicesData.services.length > 0) {
        const serviceId = servicesData.services[0].ServiceID;
        const { status, data } = await makeRequest(`/reviews/service/${serviceId}`);
        assert.equal(status, 200);
        assert.ok(Array.isArray(data.reviews), 'Should return array');
    }
});

test('POST /reviews without auth returns 401', async () => {
    const { status } = await makeRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify({
            requestId: 1,
            rating: 5,
            comment: 'Great service!'
        })
    });
    assert.equal(status, 401);
});

test('POST /reviews with invalid requestId returns error', async () => {
    const token = await getAuthToken();
    const { status } = await makeRequest('/reviews', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            requestId: 999999,
            rating: 5,
            comment: 'Test review'
        })
    });
    // API may return 400 or 404 depending on validation
    assert.ok(status >= 400, 'Should return error status');
});
