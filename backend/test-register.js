const API_URL = 'http://localhost:5000/api/auth/register';

const testProvider = {
    first_name: 'Test',
    last_name: 'Provider',
    name: 'Test Provider',
    email: `provider${Date.now()}@test.com`,
    phone: '1234567890',
    password: 'password123',
    confirmPassword: 'password123',
    role: 'provider',
    specialization: 'Plumbing',
    experience: '5 years'
};

const testCustomer = {
    first_name: 'Test',
    last_name: 'Customer',
    name: 'Test Customer',
    email: `customer${Date.now()}@test.com`,
    phone: '0987654321',
    password: 'password123',
    confirmPassword: 'password123',
    role: 'customer'
};

async function register(user) {
    try {
        console.log(`Registering ${user.role}...`);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Success:', response.status, data);
        } else {
            console.error('Failed:', response.status, data);
        }
    } catch (error) {
        console.error('Network/Script Error:', error.message);
    }
}

async function run() {
    await register(testProvider);
    await register(testCustomer);
}

run();
