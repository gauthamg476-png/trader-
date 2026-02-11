# 🚀 Quick Start - Email Notifications

## Step 1: Create .env file

Create a file named `.env` in the root directory with:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-char-app-password
ADMIN_EMAIL=admin@thanvitrader.com
PORT=3001
```

## Step 2: Get Gmail App Password

1. Visit: https://myaccount.google.com/apppasswords
2. Generate password for "Mail"
3. Copy the 16-character code
4. Paste it in `.env` as `EMAIL_PASS` (remove spaces)

## Step 3: Run the application

```bash
npm run dev:all
```

This starts both:
- Frontend: http://localhost:8081
- Backend: http://localhost:3001

## Step 4: Test it!

1. Login to the app
2. Place an order
3. Check your admin email inbox

✅ Done! You should receive email notifications.

---

**Need help?** Read the full guide in `EMAIL_SETUP.md`
