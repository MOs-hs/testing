const User = require('./models/User');
const Customer = require('./models/Customer'); // Assuming customer role
const logger = require('./config/logger');

async function addUser() {
    try {
        const userData = {
            name: 'Hajj Sleiman Mohamad',
            email: 'hajjsleimanmohamad@gmai.com', // Keeping the gmai.com as requested
            phone: '+96100000000',
            password: 'password123', // Default password
            role: 'customer'
        };

        console.log('Attempting to create user:', userData.email);

        const existingUser = await User.findByEmail(userData.email);
        if (existingUser) {
            console.log('User already exists!');
            process.exit(0);
        }

        const userId = await User.create(userData);
        await Customer.create(userId);

        console.log('User created successfully with ID:', userId);
        console.log('Password: password123');
        process.exit(0);
    } catch (error) {
        console.error('Error creating user:', error);
        process.exit(1);
    }
}

addUser();
