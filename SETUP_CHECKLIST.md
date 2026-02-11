# ✅ Email Notification Setup Checklist

Follow this checklist to set up email notifications for Thanvi Trader.

## 📋 Pre-Setup

- [ ] Node.js and npm installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Gmail account available
- [ ] Text editor ready

## 🔐 Gmail Configuration

- [ ] **Enable 2-Step Verification**
  - Visit: https://myaccount.google.com/security
  - Click "2-Step Verification"
  - Follow setup process

- [ ] **Generate App Password**
  - Visit: https://myaccount.google.com/apppasswords
  - Select "Mail" as app
  - Select "Other" as device, name it "Thanvi Trader"
  - Click "Generate"
  - Copy the 16-character password

## 📝 Environment Configuration

- [ ] **Create .env file**
  - Copy `.env.example` to `.env`
  - Or create new file named `.env` in project root

- [ ] **Fill in EMAIL_USER**
  ```env
  EMAIL_USER=your-email@gmail.com
  ```

- [ ] **Fill in EMAIL_PASS**
  ```env
  EMAIL_PASS=your-16-char-app-password
  ```
  ⚠️ Remove any spaces from the App Password!

- [ ] **Fill in ADMIN_EMAIL**
  ```env
  ADMIN_EMAIL=admin@thanvitrader.com
  ```

- [ ] **Set PORT (optional)**
  ```env
  PORT=3001
  ```

## 🧪 Testing

- [ ] **Test email configuration**
  ```bash
  npm run test:email
  ```
  Expected output:
  - ✅ Connection successful
  - ✅ Test email sent
  - ✅ Check your inbox

- [ ] **Verify test email received**
  - Check inbox at ADMIN_EMAIL
  - Check spam/junk folder if not in inbox
  - Email subject: "✅ Test Email - Thanvi Trader Email System"

## 🚀 Running the Application

- [ ] **Start both frontend and backend**
  ```bash
  npm run dev:all
  ```
  Expected output:
  - ✅ Frontend running on http://localhost:8081
  - ✅ Backend running on http://localhost:3001
  - ✅ Email server ready

- [ ] **Verify backend health**
  - Visit: http://localhost:3001/api/health
  - Should see: `{"status":"OK","message":"Email server is running"}`

- [ ] **Verify frontend**
  - Visit: http://localhost:8081
  - Should see Thanvi Trader landing page

## 📧 Testing Order Notifications

- [ ] **Login to application**
  - Create account or use existing credentials

- [ ] **Place a test order**
  - Go to "Products" page
  - Select any dal product
  - Enter quantity
  - Click "Place Order"

- [ ] **Verify order email received**
  - Check admin email inbox
  - Subject: "🔔 New Order Received - Thanvi Trader"
  - Contains: Customer name, product, quantity, price, order type

- [ ] **Check backend console**
  - Should see: "✅ Order notification email sent successfully"

## 💬 Testing Inquiry Notifications

- [ ] **Submit a test inquiry**
  - Go to "Inquiries" page
  - Fill in subject and message
  - Click "Submit Inquiry"

- [ ] **Verify inquiry email received**
  - Check admin email inbox
  - Subject: "💬 New Inquiry Received - Thanvi Trader"
  - Contains: Customer name, subject, message

- [ ] **Check backend console**
  - Should see: "✅ Inquiry notification email sent successfully"

## 🔍 Verification

- [ ] **Orders work without email**
  - Stop backend server
  - Try placing order
  - Order should still be created
  - Check console for email error (expected)

- [ ] **Inquiries work without email**
  - Stop backend server
  - Try submitting inquiry
  - Inquiry should still be created
  - Check console for email error (expected)

- [ ] **Email formatting is correct**
  - Emails have proper HTML formatting
  - Colors and styling look professional
  - All information is displayed correctly

## 🎯 Final Checks

- [ ] **Both servers running**
  ```bash
  npm run dev:all
  ```

- [ ] **No errors in console**
  - Frontend console (browser)
  - Backend console (terminal)

- [ ] **Emails being received**
  - Order emails working
  - Inquiry emails working

- [ ] **.env file is secure**
  - Not committed to git
  - Contains correct credentials
  - No spaces in App Password

## ✅ Success!

If all items are checked, your email notification system is fully operational!

## 🐛 Troubleshooting

If any step fails, refer to:
- `EMAIL_SETUP.md` - Detailed setup guide
- `README_EMAIL.md` - Complete documentation
- Backend console logs for error messages

## 📞 Common Issues

### ❌ "Invalid login"
- **Problem:** Using regular Gmail password
- **Solution:** Use App Password from https://myaccount.google.com/apppasswords

### ❌ "Connection timeout"
- **Problem:** Backend not running
- **Solution:** Run `npm run dev:server`

### ❌ "CORS error"
- **Problem:** Frontend can't reach backend
- **Solution:** Run `npm run dev:all` to start both

### ❌ Email not received
- **Check:** Spam folder
- **Check:** ADMIN_EMAIL is correct
- **Check:** Backend console for errors

---

**Congratulations!** 🎉

Your Thanvi Trader email notification system is ready to use!
