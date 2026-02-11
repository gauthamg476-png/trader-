# 📧 EmailJS Setup Guide - Easy Email Notifications!

EmailJS is **much easier** than Nodemailer - no backend server needed! Everything runs in the browser.

## ✨ Why EmailJS?

- ✅ **No backend server required**
- ✅ **No Gmail App Password needed**
- ✅ **Works directly from browser**
- ✅ **Free tier: 200 emails/month**
- ✅ **Setup in 5 minutes**

---

## 🚀 Step-by-Step Setup (5 Minutes)

### **Step 1: Create EmailJS Account**

1. Go to: https://www.emailjs.com/
2. Click **"Sign Up"** (top right)
3. Create account with your email
4. Verify your email address

### **Step 2: Add Email Service**

1. After login, go to **"Email Services"** tab
2. Click **"Add New Service"**
3. Select **"Gmail"**
4. Click **"Connect Account"**
5. Sign in with your Gmail (gauthamg476@gmail.com)
6. Allow EmailJS to send emails
7. **Copy the Service ID** (looks like: `service_abc123`)

### **Step 3: Create Email Templates**

#### **Template 1: Order Notification**

1. Go to **"Email Templates"** tab
2. Click **"Create New Template"**
3. **Template Name:** `Order Notification`
4. **Template Content:**

```
Subject: New Order Received - Thanvi Trader

Hello Admin,

You have received a new order!

Order Details:
- Order ID: {{order_id}}
- Customer: {{customer_name}}
- Product: {{product_name}}
- Quantity: {{quantity}} kg
- Order Type: {{order_type}}
- Total Price: {{total_price}}
- Date: {{order_date}}

Please log in to your admin dashboard to manage this order.

Best regards,
Thanvi Trader System
```

5. Click **"Save"**
6. **Copy the Template ID** (looks like: `template_xyz789`)

#### **Template 2: Inquiry Notification**

1. Click **"Create New Template"** again
2. **Template Name:** `Inquiry Notification`
3. **Template Content:**

```
Subject: New Inquiry Received - Thanvi Trader

Hello Admin,

You have received a new inquiry!

Inquiry Details:
- Inquiry ID: {{inquiry_id}}
- Customer: {{customer_name}}
- Subject: {{subject}}
- Message: {{message}}
- Date: {{inquiry_date}}

Please respond to this inquiry as soon as possible.

Best regards,
Thanvi Trader System
```

4. Click **"Save"**
5. **Copy the Template ID**

### **Step 4: Get Public Key**

1. Go to **"Account"** tab
2. Find **"Public Key"** section
3. **Copy your Public Key** (looks like: `AbCdEfGhIjKlMnOp`)

### **Step 5: Update .env File**

Open your `.env` file and update these lines:

```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID_ORDER=template_xyz789
VITE_EMAILJS_TEMPLATE_ID_INQUIRY=template_inquiry123
VITE_EMAILJS_PUBLIC_KEY=AbCdEfGhIjKlMnOp
```

**Replace with your actual values!**

### **Step 6: Restart Application**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Testing

1. **Login to your application**
2. **Place an order**
3. **Check your Gmail inbox** (gauthamg476@gmail.com)
4. You should receive an email notification!

---

## 📧 Email Template Variables

### Order Template Variables:
- `{{order_id}}` - Order ID
- `{{customer_name}}` - Customer name
- `{{product_name}}` - Product name
- `{{quantity}}` - Quantity ordered
- `{{order_type}}` - CONFIRMED or BULK
- `{{total_price}}` - Total price
- `{{order_date}}` - Order date and time

### Inquiry Template Variables:
- `{{inquiry_id}}` - Inquiry ID
- `{{customer_name}}` - Customer name
- `{{subject}}` - Inquiry subject
- `{{message}}` - Inquiry message
- `{{inquiry_date}}` - Inquiry date and time

---

## 🎨 Customize Email Templates

You can make your emails look better:

1. Go to **Email Templates** in EmailJS
2. Click on your template
3. Use the **HTML editor** to add:
   - Colors
   - Images
   - Logos
   - Styling

**Example HTML Template:**

```html
<div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #f59e0b;">📦 New Order Received</h2>
  
  <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
    <p><strong>Order ID:</strong> {{order_id}}</p>
    <p><strong>Customer:</strong> {{customer_name}}</p>
    <p><strong>Product:</strong> {{product_name}}</p>
    <p><strong>Quantity:</strong> {{quantity}} kg</p>
    <p><strong>Total:</strong> {{total_price}}</p>
  </div>
  
  <p style="color: #666; font-size: 12px;">
    This is an automated notification from Thanvi Trader
  </p>
</div>
```

---

## 🔧 Troubleshooting

### Emails not sending?

1. **Check console** for errors (F12 in browser)
2. **Verify .env values** are correct
3. **Check EmailJS dashboard** for usage limits
4. **Make sure you restarted** the dev server after updating .env

### "Service not found" error?

- Double-check your `VITE_EMAILJS_SERVICE_ID`
- Make sure it matches the Service ID in EmailJS dashboard

### "Template not found" error?

- Double-check your template IDs
- Make sure templates are saved in EmailJS

### Emails going to spam?

- Add your email to contacts
- Check spam folder
- Mark as "Not Spam"

---

## 💰 Pricing

**Free Tier:**
- 200 emails/month
- Perfect for testing and small projects

**Paid Plans:**
- Start at $7/month for 1,000 emails
- More features and higher limits

---

## 🎯 Summary

**What you need:**
1. ✅ EmailJS account (free)
2. ✅ Gmail connected
3. ✅ 2 email templates created
4. ✅ Credentials in .env file
5. ✅ Dev server restarted

**That's it!** Much easier than Nodemailer! 🎉

---

## 📞 Need Help?

- EmailJS Docs: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/

---

**Made with ❤️ for Thanvi Trader**
