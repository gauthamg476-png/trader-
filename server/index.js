/**
 * Simple Express Server for Email Notifications
 * This server handles sending email notifications when orders or inquiries are created
 */

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Check required environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Environment Check:');
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Service Key:', supabaseServiceKey ? 'Set' : 'Missing');

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is missing from .env file');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing from .env file');
  console.error('Please get the Service Role Key from Supabase Dashboard → Settings → API');
  process.exit(1);
}

// Initialize Supabase Admin Client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Initialize Razorpay
console.log('🔧 Razorpay Configuration:');
console.log('Key ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Missing');
console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Missing');

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ Razorpay credentials missing from .env file');
  console.error('Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret',
});

console.log('✅ Razorpay initialized');

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
 * API Route: Clear All User Data (Debug endpoint)
 * POST /api/clear-users
 */
app.post('/api/clear-users', async (req, res) => {
  try {
    console.log('🧹 Starting user data cleanup...');

    // Get all users from Supabase Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to list users',
        error: listError.message 
      });
    }

    console.log(`Found ${users.length} auth users to delete`);

    // Clear orders table first (to avoid foreign key constraints)
    const { error: ordersError } = await supabase
      .from('orders')
      .delete()
      .gt('id', ''); // Delete all orders

    if (ordersError) {
      console.error('Error clearing orders:', ordersError);
    } else {
      console.log('✅ Cleared orders table');
    }

    // Clear profiles table (after orders are deleted)
    const { error: profilesError } = await supabase
      .from('profiles')
      .delete()
      .neq('role', 'admin'); // Keep admin profile

    if (profilesError) {
      console.error('Error clearing profiles:', profilesError);
    } else {
      console.log('✅ Cleared profiles table');
    }

    // Delete all auth users (except admin)
    let deletedCount = 0;
    for (const user of users) {
      // Skip admin user
      if (user.email && user.email.includes('admin')) {
        console.log('Skipping admin user:', user.email);
        continue;
      }

      try {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
        if (deleteError) {
          console.error('Error deleting user:', user.email, deleteError);
        } else {
          console.log('✅ Deleted auth user:', user.email);
          deletedCount++;
        }
      } catch (error) {
        console.error('Failed to delete user:', user.email, error.message);
      }
    }

    console.log(`🎉 Cleanup complete! Deleted ${deletedCount} users`);

    res.json({ 
      success: true,
      message: `Successfully deleted ${deletedCount} users and cleared data`,
      deletedUsers: deletedCount
    });

  } catch (error) {
    console.error('❌ Error clearing user data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

/**
 * API Route: Sync Auth Users to Profiles
 * POST /api/sync-profiles
 */
app.post('/api/sync-profiles', async (req, res) => {
  try {
    // Get users from Supabase Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to list users',
        error: listError.message 
      });
    }

    console.log(`Found ${users.length} auth users to sync`);

    // Create profiles for each auth user
    const profilesToInsert = users.map(user => {
      // Extract username from email
      let username = user.email.split('@')[0];
      
      // Handle specific cases
      if (user.email.includes('gauthamshanmugaanandham')) {
        username = 'shanmugam'; // Use the known username
      }
      
      return {
        id: user.id,
        username: username,
        email: user.email,
        role: user.email.includes('admin') ? 'admin' : 'customer',
        created_at: user.created_at
      };
    });

    console.log('Profiles to insert:', profilesToInsert);

    // Insert profiles (use upsert to avoid conflicts)
    const { data: insertedProfiles, error: insertError } = await supabase
      .from('profiles')
      .upsert(profilesToInsert, { onConflict: 'id' })
      .select();

    if (insertError) {
      console.error('Error inserting profiles:', insertError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create profiles',
        error: insertError.message 
      });
    }

    console.log(`✅ Successfully synced ${insertedProfiles.length} profiles`);

    res.json({ 
      success: true,
      message: `Successfully synced ${insertedProfiles.length} profiles`,
      profiles: insertedProfiles
    });

  } catch (error) {
    console.error('❌ Error syncing profiles:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

/**
 * API Route: Check Auth Users (Debug endpoint)
 * GET /api/debug-users
 */
app.get('/api/debug-users', async (req, res) => {
  try {
    // Get users from Supabase Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to list users',
        error: listError.message 
      });
    }

    // Get profiles from profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error('Error getting profiles:', profilesError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get profiles',
        error: profilesError.message 
      });
    }

    res.json({ 
      success: true,
      authUsers: users.map(u => ({ id: u.id, email: u.email, created_at: u.created_at })),
      profiles: profiles,
      message: `Found ${users.length} auth users and ${profiles.length} profiles`
    });

  } catch (error) {
    console.error('❌ Error debugging users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

/**
 * API Route: Reset User Password
 * POST /api/reset-password
 * 
 * Request body should include:
 * - email: string (user's real email)
 * - newPassword: string (new password)
 */
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate required fields
    if (!email || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    console.log('🔄 Processing password reset for:', email);

    // Find the user's profile to get their username
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('username, email');

    if (profileError) {
      console.error('Profile lookup error:', profileError);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }

    const emailUsername = email.split('@')[0];
    const matchingProfile = profiles?.find(p => 
      p.email === email || 
      p.username.toLowerCase() === emailUsername.toLowerCase()
    );

    if (!matchingProfile) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const username = matchingProfile.username;
    const internalAuthEmail = `${username.toLowerCase()}@thanvitrader.local`;

    console.log('🔍 Found user:', username, 'Auth email:', internalAuthEmail);

    // Get the user from Supabase Auth by the real email (not the internal format)
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return res.status(500).json({ 
        success: false, 
        message: 'Authentication service error' 
      });
    }

    // Find user by the internal auth email format (username@thanvitrader.local)
    const authEmail = `${username.toLowerCase()}@thanvitrader.local`;
    const authUser = users.find(user => user.email.toLowerCase() === authEmail.toLowerCase());
    
    if (!authUser) {
      // Fallback: try to find by the real email they provided
      const realEmailUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (realEmailUser) {
        console.log('🔄 Found user by real email, updating password for:', realEmailUser.email);
        
        const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
          realEmailUser.id,
          { password: newPassword }
        );

        if (updateError) {
          console.error('Password update error:', updateError);
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to update password' 
          });
        }

        console.log('✅ Password updated successfully for user:', username);
        return res.json({ 
          success: true, 
          message: 'Password updated successfully' 
        });
      }
      
      console.error('Auth user not found for email:', email, 'or auth email:', authEmail);
      console.log('Available auth users:', users.map(u => u.email));
      return res.status(404).json({ 
        success: false, 
        message: 'Authentication user not found' 
      });
    }

    console.log('👤 Found auth user:', authUser.id);

    // Update the user's password using Admin API
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      authUser.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update password' 
      });
    }

    console.log('✅ Password updated successfully for user:', username);

    res.json({ 
      success: true, 
      message: 'Password updated successfully' 
    });

  } catch (error) {
    console.error('❌ Error resetting password:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

/**
 * API Route: Create Razorpay Order
 * POST /api/create-razorpay-order
 */
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    console.log('📝 Creating Razorpay order with data:', req.body);
    
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || !receipt) {
      console.error('❌ Missing required fields:', { amount, receipt });
      return res.status(400).json({
        success: false,
        message: 'Amount and receipt are required'
      });
    }

    const options = {
      amount: Math.round(amount), // Amount in paise
      currency,
      receipt,
      notes,
    };

    console.log('🔧 Razorpay order options:', options);

    const order = await razorpay.orders.create(options);

    console.log('✅ Razorpay order created successfully:', order.id);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      description: error.description,
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
      details: error.description || 'Unknown error'
    });
  }
});

/**
 * API Route: Verify Razorpay Payment
 * POST /api/verify-razorpay-payment
 */
app.post('/api/verify-razorpay-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data'
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      console.log('✅ Payment verified successfully:', razorpay_payment_id);
      
      // Here you can update the order status in your database
      // For now, we'll just return success
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id
      });
    } else {
      console.error('❌ Payment verification failed');
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification error',
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
