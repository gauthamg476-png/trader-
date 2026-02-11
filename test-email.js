/**
 * Simple Email Test Script
 * Run this to test if your email configuration is working
 * 
 * Usage: node test-email.js
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Email Configuration...\n');

// Check if environment variables are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ Error: EMAIL_USER and EMAIL_PASS must be set in .env file');
  console.log('\n📝 Create a .env file with:');
  console.log('EMAIL_USER=your-email@gmail.com');
  console.log('EMAIL_PASS=your-app-password');
  process.exit(1);
}

console.log(`📧 Email User: ${process.env.EMAIL_USER}`);
console.log(`📬 Admin Email: ${process.env.ADMIN_EMAIL || process.env.EMAIL_USER}`);
console.log(`🔑 Password: ${'*'.repeat(16)} (hidden)\n`);

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test connection
console.log('🔌 Testing connection to Gmail SMTP...');

transporter.verify((error, success) => {
  if (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.log('\n💡 Common issues:');
    console.log('1. Make sure you\'re using an App Password, not your regular Gmail password');
    console.log('2. Enable 2-Step Verification in your Google Account');
    console.log('3. Generate App Password at: https://myaccount.google.com/apppasswords');
    console.log('4. Remove any spaces from the App Password in .env file');
    process.exit(1);
  }

  console.log('✅ Connection successful!\n');
  console.log('📨 Sending test email...');

  // Send test email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: '✅ Test Email - Balaji & Co Email System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #f59e0b;">✅ Email System Test Successful!</h2>
        <p>Congratulations! Your email notification system is working correctly.</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Configuration Details:</h3>
          <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
          <p><strong>To:</strong> ${process.env.ADMIN_EMAIL || process.env.EMAIL_USER}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p>You can now:</p>
        <ul>
          <li>✅ Receive order notifications</li>
          <li>✅ Receive inquiry notifications</li>
          <li>✅ Monitor customer activities</li>
        </ul>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          This is a test email from Balaji & Co Email Notification System
        </p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('\n❌ Failed to send test email!');
      console.error('Error:', error.message);
      process.exit(1);
    }

    console.log('\n✅ Test email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`\n🎉 Email system is ready to use!`);
    console.log(`\n📥 Check your inbox at: ${process.env.ADMIN_EMAIL || process.env.EMAIL_USER}`);
    console.log('\n🚀 You can now run: npm run dev:all');
  });
});
