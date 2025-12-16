const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

// Send email function
const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'Khadamati <noreply@khadamati.com>',
            to,
            subject,
            html,
            text: text || '', // Fallback text version
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        logger.error(`Email sending failed: ${error.message}`);
        // Don't throw error - email failures shouldn't break the app
        return { success: false, error: error.message };
    }
};

// Welcome email template
const sendWelcomeEmail = async (user) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0BA5EC 0%, #0891D1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #0BA5EC; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Khadamati! 🎉</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name}!</h2>
          <p>Thank you for joining Khadamati, your trusted home services platform.</p>
          <p>Your account has been successfully created as a <strong>${user.role}</strong>.</p>
          ${user.role === 'provider' ?
            '<p>You can now start adding your services and connecting with customers!</p>' :
            '<p>You can now browse services and book trusted providers in your area!</p>'
        }
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">Get Started</a>
          <p>If you have any questions, feel free to contact our support team.</p>
        </div>
        <div class="footer">
          <p>© 2025 Khadamati. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    return await sendEmail({
        to: user.email,
        subject: 'Welcome to Khadamati!',
        html,
    });
};

// New service request notification
const sendRequestNotification = async (provider, service, customer) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0BA5EC; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background: #0BA5EC; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Service Request 📋</h2>
        </div>
        <div class="content">
          <h3>Hello ${provider.name}!</h3>
          <p>You have received a new service request:</p>
          <ul>
            <li><strong>Service:</strong> ${service.title}</li>
            <li><strong>Customer:</strong> ${customer.name}</li>
            <li><strong>Phone:</strong> ${customer.phone}</li>
          </ul>
          <a href="${process.env.FRONTEND_URL}/provider/requests" class="button">View Request</a>
        </div>
      </div>
    </body>
    </html>
  `;

    return await sendEmail({
        to: provider.email,
        subject: 'New Service Request - Khadamati',
        html,
    });
};

// Status update notification
const sendStatusUpdateEmail = async (customer, service, status) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0BA5EC; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .status { padding: 10px; background: #e3f2fd; border-left: 4px solid #0BA5EC; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Service Request Update 🔔</h2>
        </div>
        <div class="content">
          <h3>Hello ${customer.name}!</h3>
          <p>Your service request has been updated:</p>
          <div class="status">
            <strong>Service:</strong> ${service.title}<br>
            <strong>New Status:</strong> ${status}
          </div>
          <a href="${process.env.FRONTEND_URL}/customer/requests" class="button">View Details</a>
        </div>
      </div>
    </body>
    </html>
  `;

    return await sendEmail({
        to: customer.email,
        subject: `Service Request Update - ${status}`,
        html,
    });
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendRequestNotification,
    sendStatusUpdateEmail,
};
