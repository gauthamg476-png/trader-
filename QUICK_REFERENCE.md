# Quick Reference Guide

## 🔗 Important Links

- **Your App**: http://localhost:8081/
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Supabase Project**: https://xsvbbuanokilkypsnrft.supabase.co

## 🔑 Default Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Email** (in Supabase): `admin@thanvitrader.local`

## 📦 NPM Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts and business types |
| `products` | Dal products (4 items) |
| `orders` | Regular customer orders |
| `catering_orders` | Catering/event orders |
| `inquiries` | Customer questions |
| `notifications` | Admin notifications |
| `id_counters` | Order ID generation |

## 🆔 Order ID Format

- **Regular Orders**: `OR-YYMMDD-XXXXX`
- **Catering Orders**: `CT-YYMMDD-XXXXX`
- **Inquiries**: `IN-YYMMDD-XXXXX`

Example: `OR-260210-00001` (Order on Feb 10, 2026, #1)

## 📊 Order Statuses

### Regular Orders
- `pending` - Awaiting stock
- `confirmed` - Order confirmed
- `packed` - Ready for delivery
- `delivered` - Completed

### Catering Orders
- `pending` - Awaiting confirmation
- `confirmed` - Order confirmed
- `in-preparation` - Being prepared
- `ready` - Ready for event
- `delivered` - Completed

## 👥 Business Types

1. Individual Consumer
2. Business Owner
3. Trader
4. Retailer
5. Broker / Agent

## 🛍️ Products

| Product | Tamil Name | Price | Stock |
|---------|-----------|-------|-------|
| Toor Dal | Thuvaramparuppu | ₹120/kg | 500kg |
| Moong Dal | Pachaipayaru | ₹135/kg | 350kg |
| Chana Dal | Kadalaiparuppu | ₹95/kg | 600kg |
| Urad Dal | Uluthamparuppu | ₹145/kg | 250kg |

## 📧 Email Notifications (EmailJS)

Automatic emails sent for:
- ✅ New orders
- ✅ Catering orders
- ✅ Customer inquiries

**Admin Email**: gauthamg476@gmail.com

## 🔒 Security Features

- ✅ Supabase Auth (password hashing)
- ✅ Row Level Security (RLS)
- ✅ Customers see only their data
- ✅ Admins see all data
- ✅ Secure API endpoints

## 🐛 Troubleshooting

### Can't login
- Check username (not email)
- Check password
- Verify user exists in Supabase Auth
- Verify profile exists in profiles table

### No data showing
- Check if logged in
- Check browser console for errors
- Verify Supabase credentials in `.env`
- Check RLS policies in Supabase

### Dev server won't start
```bash
# Kill any process on port 8080/8081
npx kill-port 8080 8081

# Restart
npm run dev
```

### Database errors
- Check Supabase Dashboard → Logs
- Verify tables exist in Table Editor
- Check RLS policies are enabled

## 📁 Key Files

### Configuration
- `.env` - Environment variables
- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - Tailwind CSS config

### Database
- `supabase-schema.sql` - Database schema
- `src/lib/supabase.ts` - Supabase client

### Contexts
- `src/contexts/AuthContext.tsx` - Authentication
- `src/contexts/DataContext.tsx` - Data management

### Pages
- `src/pages/Login.tsx` - Login page
- `src/pages/Signup.tsx` - Signup page
- `src/pages/Products.tsx` - Products page
- `src/pages/Catering.tsx` - Catering orders
- `src/pages/MyOrders.tsx` - Customer orders
- `src/pages/admin/*` - Admin pages

## 🎯 Common Tasks

### Add New Product
1. Go to Supabase → Table Editor → products
2. Click "Insert row"
3. Fill in details
4. Add image to `src/assets/`
5. Update `PRODUCT_IMAGES` in DataContext

### Change Admin Password
1. Go to Supabase → Authentication → Users
2. Find admin user
3. Click on it
4. Click "Reset Password"
5. Enter new password

### View All Orders
1. Login as admin
2. Go to "Orders" in sidebar
3. Filter by status if needed

### Update Order Status
1. Login as admin
2. Go to "Orders"
3. Find order
4. Select new status from dropdown
5. Automatically saved

## 📞 Support

For issues, check:
1. Browser console (F12)
2. Supabase Dashboard → Logs
3. Network tab in DevTools
4. Documentation files in project

## 🚀 Deployment

When ready to deploy:
1. Build: `npm run build`
2. Deploy `dist` folder to hosting
3. Update Supabase URL in production
4. Set environment variables on host
5. Test all features

---

**Quick Start**: See `NEXT_STEPS.md`
**Full Guide**: See `SUPABASE_MIGRATION_COMPLETE.md`
