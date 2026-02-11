# Email Notification Troubleshooting Guide

## Current Status
Email notifications are **optional** - orders will work even if emails fail.

## Common Issues & Solutions

### Issue 1: Status 412 (Precondition Failed)
**Cause**: EmailJS rate limit or authentication issue

**Solutions**:
1. Check your EmailJS dashboard: https://dashboard.emailjs.com/
2. Verify you haven't exceeded the free tier limit (200 emails/month)
3. Check if your account needs verification
4. Wait 24 hours if rate limited

### Issue 2: Status 406 (Not Acceptable)
**Cause**: Template or configuration mismatch

**Solutions**:
1. Verify templates exist in EmailJS dashboard
2. Check template IDs match in `.env` file:
   - `VITE_EMAILJS_TEMPLATE_ID_ORDER=template_oz0m9nu`
   - `VITE_EMAILJS_TEMPLATE_ID_INQUIRY=template_zk6axl6`
3. Ensure template variables match what's being sent

### Issue 3: Email Not Configured
**Cause**: Missing or invalid credentials

**Solutions**:
1. Check `.env` file has all required values:
   ```
   VITE_EMAILJS_SERVICE_ID=service_s7p65xi
   VITE_EMAILJS_TEMPLATE_ID_ORDER=template_oz0m9nu
   VITE_EMAILJS_TEMPLATE_ID_INQUIRY=template_zk6axl6
   VITE_EMAILJS_PUBLIC_KEY=c5QV4qNgGOIvvd_u-
   ```
2. Restart dev server after changing `.env`

## Testing Email Service

### Option 1: Check EmailJS Dashboard
1. Go to https://dashboard.emailjs.com/
2. Login with your account
3. Check "History" tab to see sent emails
4. Check "Quota" to see remaining emails

### Option 2: Test with Node Script
```bash
node test-email.js
```

### Option 3: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for email-related logs:
   - ✅ Success: "Order email sent successfully"
   - ⚠️ Warning: "Email notification failed (non-critical)"

## Important Notes

1. **Orders Still Work**: Even if emails fail, orders are created successfully in the database
2. **Non-Blocking**: Email failures don't stop the order process
3. **Admin Email**: All notifications go to `gauthamg476@gmail.com`
4. **Free Tier Limits**: 
   - 200 emails/month
   - 2 email services
   - Rate limiting may apply

## Recommended Actions

### For Development
- Emails are optional during testing
- Focus on order functionality first
- Check console for email status

### For Production
1. Upgrade to EmailJS paid plan if needed
2. Consider alternative email service (SendGrid, AWS SES)
3. Add email queue for reliability
4. Monitor email delivery rates

## Alternative: Disable Emails Temporarily

If you want to disable email notifications completely:

1. Remove or comment out email credentials in `.env`:
   ```
   # VITE_EMAILJS_SERVICE_ID=
   # VITE_EMAILJS_TEMPLATE_ID_ORDER=
   # VITE_EMAILJS_TEMPLATE_ID_INQUIRY=
   # VITE_EMAILJS_PUBLIC_KEY=
   ```

2. Restart dev server

The app will continue working without sending emails.
