# 🔐 EmailJS Authentication Template Setup

## 📧 New Authentication Email Template

You need to create a **new email template** in EmailJS for authentication emails (OTP verification and forgot password).

---

## 🚀 Step-by-Step Setup

### **Step 1: Login to EmailJS**

1. Go to: https://www.emailjs.com/
2. Login with your account
3. Go to **"Email Templates"** tab

### **Step 2: Create Authentication Template**

1. Click **"Create New Template"**
2. **Template Name:** `Authentication Template`
3. **Template ID:** Copy this ID (you'll need it for .env)

### **Step 3: Template Content**

**Subject:**
```
{{subject}}
```

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
        .code-box { background: #f3f4f6; border: 2px dashed #d1d5db; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .code { font-size: 32px; font-weight: bold; color: #f59e0b; letter-spacing: 8px; font-family: monospace; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏢 {{company_name}}</h1>
            <h2>{{auth_type}}</h2>
        </div>
        
        <div class="content">
            <h2>Hello {{to_name}}!</h2>
            
            <p>{{message_title}}</p>
            
            <div class="code-box">
                <p><strong>Your Code:</strong></p>
                <div class="code">{{verification_code}}</div>
            </div>
            
            <div class="warning">
                <p><strong>⚠️ Important:</strong></p>
                <ul>
                    <li>This code expires in <strong>{{expiry_time}}</strong></li>
                    <li>Never share this code with anyone</li>
                    <li>If you didn't request this, ignore this email</li>
                </ul>
            </div>
            
            <p>{{message_body}}</p>
            
            <p>If you need help, contact us at: <a href="mailto:{{support_email}}">{{support_email}}</a></p>
            
            <p>Best regards,<br>
            <strong>{{company_name}} Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This email was sent on {{current_date}}</p>
            <p>{{company_name}} - Premium Quality Trading</p>
            <p>Visit us: <a href="{{website_url}}">{{website_url}}</a></p>
        </div>
    </div>
</body>
</html>
```

### **Step 4: Template Variables**

Make sure these variables are available in your template:

**Required Variables:**
- `{{to_email}}` - Recipient email
- `{{to_name}}` - Recipient name
- `{{subject}}` - Email subject
- `{{auth_type}}` - Type (Email Verification / Password Reset)
- `{{verification_code}}` - 6-digit code
- `{{message_title}}` - Main message title
- `{{message_body}}` - Detailed message
- `{{company_name}}` - BALAJI & CO
- `{{expiry_time}}` - Code expiry (10 minutes)
- `{{support_email}}` - Support email
- `{{website_url}}` - Website URL
- `{{current_date}}` - Current date/time

### **Step 5: Save Template**

1. Click **"Save"**
2. **Copy the Template ID** (looks like: `template_auth123`)
3. Test the template with sample data

### **Step 6: Update .env File**

Replace the template ID in your `.env` file:

```env
VITE_EMAILJS_TEMPLATE_ID_AUTH=template_auth123
```

**Replace `template_auth123` with your actual template ID!**

### **Step 7: Restart Application**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 📧 Email Examples

### **OTP Verification Email:**
- **Subject:** Verify Your Email - BALAJI & CO
- **Type:** Email Verification
- **Title:** Welcome to BALAJI & CO!
- **Code:** 123456

### **Forgot Password Email:**
- **Subject:** Reset Your Password - BALAJI & CO
- **Type:** Password Reset
- **Title:** Password Reset Request
- **Code:** 654321

---

## ✅ Testing

1. **Go to signup page:** http://localhost:8081/signup
2. **Enter real email address**
3. **Check your email inbox**
4. **Verify the template looks good**

1. **Go to forgot password:** http://localhost:8081/forgot-password
2. **Enter email address**
3. **Check email for reset code**

---

## 🎨 Template Features

- ✅ **Professional Design** - Clean, modern layout
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Security Warnings** - Clear expiry and security info
- ✅ **Branded** - BALAJI & CO colors and styling
- ✅ **Clear Code Display** - Large, easy-to-read code
- ✅ **Support Contact** - Help information included

---

## 🔧 Troubleshooting

### Template not found?
- Check the template ID in .env matches EmailJS
- Make sure template is saved and published

### Variables not showing?
- Verify all variable names match exactly
- Check for typos in variable names (case sensitive)

### Emails look broken?
- Test the HTML in EmailJS template editor
- Check for missing closing tags

### Code not displaying?
- Make sure `{{verification_code}}` variable is in template
- Check the code-box styling is correct

---

## 💡 Customization

You can customize:
- **Colors** - Change the orange theme
- **Logo** - Add your company logo
- **Layout** - Modify the structure
- **Content** - Update messaging

---

## 📞 Need Help?

- EmailJS Docs: https://www.emailjs.com/docs/
- Template Editor: https://www.emailjs.com/templates/

---

**🎯 Summary:**

1. ✅ Create new authentication template in EmailJS
2. ✅ Copy the HTML template above
3. ✅ Update .env with new template ID
4. ✅ Restart your application
5. ✅ Test signup and forgot password

**Your authentication emails will now look professional and secure!** 🔐
