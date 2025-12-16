const User = require('./models/User');
const db = require('./config/database');

async function verifyLogin() {
    try {
        const email = 'hajjsleimanmohamad@gmai.com';
        const password = 'password123';

        console.log(`Checking login for: ${email}`);

        const user = await User.findByEmail(email, true);
        if (!user) {
            console.log('❌ User not found in database');
            process.exit(1);
        }

        console.log('✅ User found:', user.Email);
        console.log('Stored Hash:', user.PasswordHash);

        const isMatch = await User.comparePassword(password, user.PasswordHash);
        if (isMatch) {
            console.log('✅ Password matches!');
        } else {
            console.log('❌ Password does NOT match.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

verifyLogin();
