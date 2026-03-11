# OTP Email Verification Setup Guide

## 1. EmailJS Configuration

### Create OTP Email Template
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Create a new email template with ID: `template_otp_verify`
3. Use this template content:

```html
Subject: Verify Your Email - BALAJI & CO

Dear {{to_name}},

Welcome to BALAJI & CO! Please verify your email address to complete your registration.

Your verification code is: {{otp_code}}

This code will expire in {{validity_minutes}} minutes.

If you didn't request this verification, please ignore this email.

Best regards,
BALAJI & CO Team
Phone: +91 9940380881
Address: No. 65/3, Elaya Mudall Street, Tondiarpet, Chennai - 600 081
```

### Update Environment Variables
Add these to your `.env` file:

```env
# EmailJS Configuration for OTP
VITE_EMAILJS_SERVICE_ID=service_balaji_co
VITE_EMAILJS_TEMPLATE_OTP=template_otp_verify
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## 2. Update OTP Service

Update the EmailJS configuration in `src/lib/otpService.ts`:

```typescript
await emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_OTP,
  templateParams,
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
);
```

## 3. Database Setup

Run the SQL command in Supabase:
```sql
ALTER TABLE profiles ADD COLUMN email TEXT;
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
```

## 4. Test the System

1. Try signing up with a real email address
2. Check if OTP email is received
3. Verify the OTP works correctly
4. Confirm account creation

## 5. Production Considerations

For production, consider:
- Using a proper email service (SendGrid, AWS SES)
- Storing OTPs in database instead of memory
- Adding rate limiting for OTP requests
- Implementing email verification status in database