# Email Configuration Setup Guide

## Gmail Credentials Provided
- Email: khadamati.services@gmail.com
- Password: H123456789m

## ⚠️ IMPORTANT SECURITY NOTE

The password you provided appears to be a regular Gmail password. For security reasons, you should use a **Gmail App Password** instead.

### How to Generate Gmail App Password:

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Step Verification** (if not already enabled)
   - Click "2-Step Verification"
   - Follow the setup process

3. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it: "Khadamati Backend"
   - Click "Generate"
   - Copy the 16-character password

4. **Update .env file**
   - Use the generated app password instead of your regular password

---

## Quick Setup (Using Current Credentials)

If you want to use the current password for testing, update your `backend/.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=khadamati.services@gmail.com
EMAIL_PASSWORD=H123456789m
EMAIL_FROM=Khadamati <khadamati.services@gmail.com>
```

---

## Testing Email

After updating .env, restart your backend server and test:

1. Register a new user
2. Check the email inbox: khadamati.services@gmail.com
3. You should receive a welcome email

---

## Troubleshooting

If emails don't send:

1. **Check Gmail Security Settings**
   - Gmail might block "less secure apps"
   - Enable 2FA and use App Password (recommended)

2. **Check Logs**
   ```bash
   # View email sending logs
   cat backend/logs/combined.log | grep -i email
   ```

3. **Test SMTP Connection**
   - The backend will log email sending status
   - Check for errors in logs/error.log

---

## Production Recommendation

For production, use:
- Gmail App Password (not regular password)
- Or use a dedicated email service (SendGrid, Mailgun, AWS SES)
- Store credentials in environment variables (never commit to git)
