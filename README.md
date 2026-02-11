# Balaji&Co Trader - Trading Business Management System

A comprehensive trading platform for premium quality pulses and lentils with email notification system.

## ✨ Features

- 🛒 Product catalog with Tamil names
- 📦 Order management (Confirmed & Bulk orders)
- 🍽️ Catering pre-order system (10-15 days advance)
- 💬 Customer inquiry system
- 📧 **Email notifications for orders and inquiries**
- 👥 Customer and admin dashboards
- 📊 Sales analytics
- 🔐 Authentication system

## 📧 Email Notification System

This project includes automatic email notifications:
- ✅ Admin receives email when customer places order
- ✅ Admin receives email when customer submits inquiry
- ✅ Professional HTML email templates
- ✅ Non-blocking (doesn't slow down the app)

**Quick Setup:**
1. Create `.env` file with Gmail credentials
2. Run `npm run test:email` to test
3. Run `npm run dev:all` to start

📖 **Full Guide:** See [README_EMAIL.md](README_EMAIL.md) for complete setup instructions.

## 🚀 Quick Start

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Gmail account (for email notifications)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm install

# Step 4: Set up email notifications (optional but recommended)
# Copy .env.example to .env and fill in your Gmail credentials
# See README_EMAIL.md for detailed instructions

# Step 5: Start the application
npm run dev:all
# This starts both frontend (port 8081) and backend (port 3001)
```

### Alternative: Run frontend only
```sh
npm run dev
```

## 📁 Project Structure

```
tradewise-dashboard-main/
├── src/                      # Frontend React application
│   ├── pages/               # Page components
│   ├── components/          # Reusable components
│   ├── contexts/            # React contexts
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript types
├── server/                   # Backend Express server
│   └── index.js             # Email notification API
├── public/                   # Static assets
└── .env                     # Environment variables (create this)
```

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start frontend only (port 8081)
npm run dev:server       # Start backend only (port 3001)
npm run dev:all          # Start both frontend and backend

# Email Testing
npm run test:email       # Test email configuration

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode

# Linting
npm run lint             # Run ESLint
```

## 🌐 Access Points

- **Frontend:** http://localhost:8081
- **Backend API:** http://localhost:3001
- **API Health Check:** http://localhost:3001/api/health

## 📧 Email Setup

For email notifications to work:

1. Create `.env` file in project root:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@thanvitrader.com
PORT=3001
```

2. Get Gmail App Password:
   - Visit: https://myaccount.google.com/apppasswords
   - Generate password for "Mail"
   - Use the 16-character code in `.env`

3. Test configuration:
```bash
npm run test:email
```

📖 **Detailed Guide:** [README_EMAIL.md](README_EMAIL.md)

## 🎯 Key Features Explained

### Products
- Toor Dal (Thuvaramparuppu)
- Moong Dal (Pachaipayaru)
- Chana Dal (Kadalaiparuppu)
- Urad Dal (Uluthamparuppu)

### Order Types
- **Confirmed Orders:** In-stock items, 3-day delivery
- **Bulk Orders:** Large quantities, 15-day delivery

### Catering Service
- Pre-order system for events
- Minimum 10-15 days advance notice
- Bulk quantities for weddings, corporate events

### Email Notifications
- Automatic notifications to admin
- Order details with customer info
- Inquiry messages with full content
- Professional HTML templates

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
