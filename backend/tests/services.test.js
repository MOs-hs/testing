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

test('GET /services returns list of services', async () => {
    const { status, data } = await makeRequest('/services');
    assert.equal(status, 200);
    assert.ok(Array.isArray(data.services), 'Should return array of services');
});

test('GET /services/:id returns service details', async () => {
    // First get list to find a valid ID
    const { data: listData } = await makeRequest('/services');
    if (listData.services && listData.services.length > 0) {
        const serviceId = listData.services[0].ServiceID;
        const { status, data } = await makeRequest(`/services/${serviceId}`);
        assert.equal(status, 200);
        assert.ok(data.service, 'Should return service object');
    }
});

test('GET /services with invalid ID returns 404', async () => {
    const { status } = await makeRequest('/services/999999');
    assert.equal(status, 404);
});

test('GET /categories returns list of categories', async () => {
    const { status, data } = await makeRequest('/categories');
    assert.equal(status, 200);
    assert.ok(Array.isArray(data.categories), 'Should return array of categories');
});

test('POST /services without auth returns 401', async () => {
    const { status } = await makeRequest('/services', {
        method: 'POST',
        body: JSON.stringify({
            title: 'Test Service',
            description: 'Test',
            price: 100,
            categoryId: 1
        })
    });
    assert.equal(status, 401);
});
