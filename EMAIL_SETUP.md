# Email Notification Setup Guide

This guide will help you set up email notifications for Thanvi Trader using Nodemailer and Gmail.

## 📋 Prerequisites

- Gmail account
- Node.js installed
- Project dependencies installed

## 🚀 Setup Steps

### Step 1: Install Dependencies

Run the following command in your project directory:

```bash
npm install
```

This will install:
- `nodemailer` - Email sending library
- `express` - Backend server
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `concurrently` - Run multiple commands simultaneously

### Step 2: Generate Gmail App Password

**Important:** You cannot use your regular Gmail password. You need to generate an App Password.

1. Go to your Google Account: https://myaccount.google.com/security

2. **Enable 2-Step Verification** (if not already enabled):
   - Click on "2-Step Verification"
   - Follow the setup process

3. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other" as the device and name it "Thanvi Trader"
   - Click "Generate"
   - Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Create .env File

1. Copy the `.env.example` file and rename it to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Open the `.env` file and fill in your details:

```env
# Your Gmail address
EMAIL_USER=your-email@gmail.com

# The 16-character App Password you generated (remove spaces)
EMAIL_PASS=abcdefghijklmnop

# Admin email (where notifications will be sent)
ADMIN_EMAIL=admin@thanvitrader.com

# Server port (optional)
PORT=3001
```

**Example:**
```env
EMAIL_USER=thanvitrader@gmail.com
EMAIL_PASS=xyzw abcd efgh ijkl
ADMIN_EMAIL=admin@thanvitrader.com
PORT=3001
```

### Step 4: Run the Application

You have two options:

**Option A: Run both frontend and backend together (Recommended)**
```bash
npm run dev:all
```

This will start:
- Frontend (Vite): http://localhost:8081
- Backend (Express): http://localhost:3001

**Option B: Run separately in two terminals**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run dev:server
```

## ✅ Testing Email Notifications

### Test Order Notification

1. Open the application: http://localhost:8081
2. Login or create an account
3. Go to "Products"
4. Place an order for any dal product
5. Check the admin email inbox - you should receive an order notification

### Test Inquiry Notification

1. Go to "Inquiries" page
2. Submit a new inquiry
3. Check the admin email inbox - you should receive an inquiry notification

## 📧 Email Templates

### Order Notification Email Includes:
- Customer name
- Product name
- Quantity ordered
- Total price
- Order type (Confirmed/Bulk)
- Date and time

### Inquiry Notification Email Includes:
- Customer name
- Subject
- Message content
- Date and time

## 🔧 Troubleshooting

### Email not sending?

1. **Check console logs**: Look for error messages in the terminal running the backend server

2. **Verify Gmail App Password**:
   - Make sure you're using the App Password, not your regular password
   - Remove any spaces from the App Password in .env file

3. **Check 2-Step Verification**: Must be enabled for App Passwords to work

4. **Verify .env file**:
   - Make sure the file is named exactly `.env` (not `.env.txt`)
   - Check that EMAIL_USER and EMAIL_PASS are correctly filled

5. **Check backend server**: Make sure it's running on port 3001
   - Visit: http://localhost:3001/api/health
   - Should return: `{"status":"OK","message":"Email server is running"}`

6. **CORS issues**: If you get CORS errors, make sure both frontend and backend are running

### Common Errors:

**"Invalid login"**
- You're using your regular Gmail password instead of App Password
- Solution: Generate and use an App Password

**"Connection timeout"**
- Backend server is not running
- Solution: Run `npm run dev:server` or `npm run dev:all`

**"Network error"**
- Frontend can't reach backend
- Solution: Make sure backend is running on port 3001

## 🔒 Security Notes

- **Never commit your .env file** to version control
- The `.env` file is already in `.gitignore`
- App Passwords are safer than using your main Gmail password
- Each App Password is unique and can be revoked anytime

## 📝 How It Works

1. **Customer places order** → Frontend calls `createOrder()`
2. **Order saved to localStorage** → Order is created successfully
3. **Email sent in background** → `sendOrderNotification()` is called
4. **Backend receives request** → Express server at `/api/send-order-email`
5. **Nodemailer sends email** → Gmail SMTP sends email to admin
6. **Admin receives notification** → Email arrives in admin inbox

**Important:** Email sending is non-blocking. If email fails, the order/inquiry is still created successfully.

## 🎯 Production Deployment

For production:

1. Use environment variables on your hosting platform
2. Consider using a dedicated email service (SendGrid, AWS SES, etc.)
3. Add rate limiting to prevent spam
4. Implement email queuing for better reliability
5. Add email templates with your branding

## 📞 Support

If you encounter issues:
1. Check the console logs in both terminals
2. Verify all environment variables are set correctly
3. Test with a simple email first
4. Check Gmail's "Less secure app access" settings (though App Passwords should work)

---

**Note:** This is a demo implementation. For production use, consider using professional email services and implementing proper error handling, logging, and monitoring.
