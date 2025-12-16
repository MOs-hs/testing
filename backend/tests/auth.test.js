const test = require('node:test');
const assert = require('node:assert/strict');

// Note: These tests require the server to be running on port 5000
// Run with: node --test backend/tests/auth.test.js

const BASE_URL = 'http://localhost:5000/api';

// Helper to make requests
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

test('Health check endpoint returns OK', async () => {
    const { status, data } = await makeRequest('/health');
    assert.equal(status, 200);
    assert.equal(data.status, 'OK');
});

test('Login with invalid credentials returns 401', async () => {
    const { status } = await makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: 'nonexistent@test.com',
            password: 'wrongpassword'
        })
    });
    assert.equal(status, 401); // API returns 401 Unauthorized for invalid credentials
});

test('Register with valid data returns 201', async () => {
    const testEmail = `test${Date.now()}@example.com`;
    const { status, data } = await makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            name: 'Test User',
            email: testEmail,
            password: 'TestPass123!',
            phone: '1234567890',
            role: 'customer'
        })
    });
    assert.equal(status, 201);
    assert.ok(data.token, 'Should return JWT token');
});

test('Register with missing fields returns 400', async () => {
    const { status } = await makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            email: 'incomplete@test.com'
        })
    });
    assert.equal(status, 400);
});

test('Login with valid credentials returns token', async () => {
    // First register a user
    const testEmail = `login${Date.now()}@example.com`;
    await makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            name: 'Login Test',
            email: testEmail,
            password: 'TestPass123!',
            phone: '1234567890',
            role: 'customer'
        })
    });

    // Then login
    const { status, data } = await makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: testEmail,
            password: 'TestPass123!'
        })
    });
    assert.equal(status, 200);
    assert.ok(data.token, 'Should return JWT token');
});
