# 📧 Thanvi Trader - Email Notification System

## 🎯 Overview

This project now includes a complete email notification system that sends automatic emails to the admin when:
- 📦 A customer places an order
- 💬 A customer submits an inquiry

## 🚀 Quick Setup (3 Steps)

### 1️⃣ Create `.env` file

Create a file named `.env` in the project root:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-char-app-password
ADMIN_EMAIL=admin@thanvitrader.com
PORT=3001
```

### 2️⃣ Get Gmail App Password

1. Visit: https://myaccount.google.com/apppasswords
2. Select "Mail" → "Other" → Name it "Thanvi Trader"
3. Click "Generate"
4. Copy the 16-character password
5. Paste in `.env` as `EMAIL_PASS` (remove spaces)

### 3️⃣ Test & Run

```bash
# Test email configuration
npm run test:email

# Run the application
npm run dev:all
```

✅ Done! Visit http://localhost:8081

## 📁 Project Structure

```
tradewise-dashboard-main/
├── server/
│   └── index.js              # Express backend for email API
├── src/
│   ├── lib/
│   │   └── emailService.ts   # Email helper functions
│   └── contexts/
│       └── DataContext.tsx   # Integrated email notifications
├── .env                      # Your email credentials (create this)
├── .env.example              # Template for .env
├── test-email.js             # Email configuration test script
├── EMAIL_SETUP.md            # Detailed setup guide
├── QUICK_START.md            # Quick reference
└── README_EMAIL.md           # This file
```

## 🎨 Email Templates

### Order Notification
```
Subject: 🔔 New Order Received - Thanvi Trader

Content:
- Customer Name
- Product Name (with Tamil name)
- Quantity
- Total Price
- Order Type (Confirmed/Bulk)
- Date & Time
```

### Inquiry Notification
```
Subject: 💬 New Inquiry Received - Thanvi Trader

Content:
- Customer Name
- Subject
- Message
- Date & Time
```

## 🔧 Available Commands

```bash
# Run frontend + backend together (recommended)
npm run dev:all

# Run frontend only
npm run dev

# Run backend only
npm run dev:server

# Test email configuration
npm run test:email

# Build for production
npm run build
```

## 🌐 Endpoints

### Frontend
- http://localhost:8081 - Main application

### Backend API
- http://localhost:3001/api/health - Health check
- http://localhost:3001/api/send-order-email - Send order notification
- http://localhost:3001/api/send-inquiry-email - Send inquiry notification

## ✅ Testing

### Test Email Setup
```bash
npm run test:email
```

This will:
- ✅ Verify your .env configuration
- ✅ Test Gmail SMTP connection
- ✅ Send a test email to admin
- ✅ Confirm everything is working

### Test in Application

1. **Test Order Email:**
   - Login to app
   - Go to "Products"
   - Place an order
   - Check admin email inbox

2. **Test Inquiry Email:**
   - Go to "Inquiries"
   - Submit an inquiry
   - Check admin email inbox

## 🔒 Security

- ✅ Uses Gmail App Passwords (not regular password)
- ✅ Environment variables for credentials
- ✅ `.env` excluded from git
- ✅ CORS protection
- ✅ Error handling doesn't expose sensitive data

## 🐛 Troubleshooting

### "Invalid login" error
**Problem:** Using regular Gmail password instead of App Password

**Solution:**
1. Enable 2-Step Verification
2. Generate App Password at https://myaccount.google.com/apppasswords
3. Use the 16-character code in `.env`

### "Connection timeout" error
**Problem:** Backend server not running

**Solution:**
```bash
npm run dev:server
```

### "CORS error"
**Problem:** Frontend can't reach backend

**Solution:** Make sure both frontend and backend are running:
```bash
npm run dev:all
```

### Email not received
**Check:**
1. ✅ Backend console for errors
2. ✅ Spam/Junk folder
3. ✅ ADMIN_EMAIL is correct in `.env`
4. ✅ Gmail App Password is correct

## 📚 Documentation

- **QUICK_START.md** - Quick setup guide
- **EMAIL_SETUP.md** - Detailed setup instructions
- **EMAIL_IMPLEMENTATION_SUMMARY.md** - Technical details

## 🎓 How It Works

```
Customer Action
    ↓
Frontend (React)
    ↓
DataContext (creates order/inquiry)
    ↓
emailService (calls backend API)
    ↓
Express Server (receives request)
    ↓
Nodemailer (sends via Gmail SMTP)
    ↓
Admin Email Inbox ✉️
```

**Important:** Email sending is non-blocking. If email fails, the order/inquiry is still created successfully.

## 🎯 Features

- ✅ Automatic email notifications
- ✅ Professional HTML email templates
- ✅ Non-blocking (doesn't slow down UI)
- ✅ Error resilient (failed emails don't break orders)
- ✅ Secure (uses environment variables)
- ✅ Easy to test
- ✅ Well documented
- ✅ Production-ready architecture

## 🚀 Production Deployment

For production, consider:

1. **Use dedicated email service:**
   - SendGrid
   - AWS SES
   - Mailgun

2. **Deploy backend separately:**
   - Heroku
   - AWS Lambda
   - Vercel Serverless Functions

3. **Add monitoring:**
   - Track email delivery
   - Log failures
   - Set up alerts

## 💡 Tips

1. **Test first:** Always run `npm run test:email` before using in production
2. **Check spam:** First emails might go to spam folder
3. **Use App Password:** Never use your regular Gmail password
4. **Keep .env secret:** Never commit .env to git
5. **Monitor logs:** Check backend console for email status

## 📞 Support

If you need help:

1. Read `EMAIL_SETUP.md` for detailed instructions
2. Run `npm run test:email` to diagnose issues
3. Check backend console logs for errors
4. Verify all environment variables are set correctly

## ✨ Summary

You now have a professional email notification system that:
- ✅ Sends beautiful HTML emails
- ✅ Works automatically on orders and inquiries
- ✅ Doesn't break if email fails
- ✅ Is secure and production-ready
- ✅ Is easy to configure and test

**Ready to go!** Just set up your `.env` file and run `npm run dev:all`.

---

**Made with ❤️ for Thanvi Trader**
