/**
 * Simple Express Server for Email Notifications
 * This server handles sending email notifications when orders or inquiries are created
 */

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON request bodies

/**
 * Configure Nodemailer with Gmail SMTP
 * Uses environment variables for security
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password (not regular password)
  },
});

/**
 * Test email configuration on server start
 */
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

/**
 * API Route: Send Order Notification Email
 * POST /api/send-order-email
 * 
 * Request body should include:
 * - customerName: string
 * - productName: string
 * - quantity: number
 * - orderType: 'confirmed' | 'bulk'
 * - totalPrice: number
 */
app.post('/api/send-order-email', async (req, res) => {
  try {
    const { customerName, productName, quantity, orderType, totalPrice } = req.body;

    // Validate required fields
    if (!customerName || !productName || !quantity || !orderType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Get current date and time
    const orderDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Admin email
      subject: '🔔 New Order Received - Balaji & Co',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
            📦 New Order Notification
          </h2>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Order Details:</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Customer Name:</td>
                <td style="padding: 8px 0; color: #111827;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Product:</td>
                <td style="padding: 8px 0; color: #111827;">${productName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Quantity:</td>
                <td style="padding: 8px 0; color: #111827;">${quantity} kg</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Total Price:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: bold;">₹${totalPrice}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Order Type:</td>
                <td style="padding: 8px 0;">
                  <span style="background-color: ${orderType === 'confirmed' ? '#10b981' : '#f59e0b'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: uppercase;">
                    ${orderType}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Date & Time:</td>
                <td style="padding: 8px 0; color: #111827;">${orderDate}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            Please log in to your admin dashboard to view and manage this order.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            This is an automated notification from Balaji & Co
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('✅ Order notification email sent successfully');
    res.json({ 
      success: true, 
      message: 'Order notification email sent successfully' 
    });

  } catch (error) {
    // Log error but don't break the order process
    console.error('❌ Error sending order email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email notification',
      error: error.message 
    });
  }
});

/**
 * API Route: Send Inquiry Notification Email
 * POST /api/send-inquiry-email
 * 
 * Request body should include:
 * - customerName: string
 * - subject: string
 * - message: string
 * - customerEmail: string (optional)
 */
app.post('/api/send-inquiry-email', async (req, res) => {
  try {
    const { customerName, subject, message, customerEmail } = req.body;

    // Validate required fields
    if (!customerName || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Get current date and time
    const inquiryDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Admin email
      subject: '💬 New Inquiry Received - Balaji & Co',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
            💬 New Inquiry Notification
          </h2>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Inquiry Details:</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Customer Name:</td>
                <td style="padding: 8px 0; color: #111827;">${customerName}</td>
              </tr>
              ${customerEmail ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0; color: #111827;">${customerEmail}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Subject:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: bold;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Date & Time:</td>
                <td style="padding: 8px 0; color: #111827;">${inquiryDate}</td>
              </tr>
            </table>
            
            <div style="margin-top: 15px; padding: 15px; background-color: white; border-left: 4px solid #f59e0b; border-radius: 4px;">
              <p style="color: #6b7280; font-weight: bold; margin: 0 0 8px 0;">Message:</p>
              <p style="color: #111827; margin: 0; line-height: 1.6;">${message}</p>
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            Please log in to your admin dashboard to respond to this inquiry.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            This is an automated notification from Balaji & Co
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('✅ Inquiry notification email sent successfully');
    res.json({ 
      success: true, 
      message: 'Inquiry notification email sent successfully' 
    });

  } catch (error) {
    // Log error but don't break the inquiry process
    console.error('❌ Error sending inquiry email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email notification',
      error: error.message 
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Email server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email notification server running on http://localhost:${PORT}`);
  console.log(`📧 Email configured for: ${process.env.EMAIL_USER || 'Not configured'}`);
});
