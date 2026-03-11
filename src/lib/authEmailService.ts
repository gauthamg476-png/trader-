/**
 * Authentication Email Service
 * Handles OTP verification and forgot password emails
 */

import emailjs from '@emailjs/browser';

// Email types
export type AuthEmailType = 'otp_verification' | 'forgot_password';

interface AuthEmailParams {
  email: string;
  type: AuthEmailType;
  code: string;
  username?: string;
}

// Initialize EmailJS
const initEmailJS = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (publicKey) {
    emailjs.init(publicKey);
  }
};

// Send authentication email (OTP or Password Reset)
export const sendAuthEmail = async ({ 
  email, 
  type, 
  code, 
  username 
}: AuthEmailParams): Promise<boolean> => {
  try {
    const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_AUTH || 'template_a9l1gx7';
    const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('❌ EmailJS authentication template not configured');
      return false;
    }

    // Initialize EmailJS
    initEmailJS();

    // Prepare email content based on type
    const emailContent = getEmailContent(type, code, username || email.split('@')[0]);

    const templateParams = {
      to_email: email,
      to_name: username || email.split('@')[0],
      subject: emailContent.subject,
      auth_type: emailContent.authType,
      verification_code: code,
      message_title: emailContent.title,
      message_body: emailContent.body,
      company_name: 'BALAJI & CO',
      expiry_time: '10 minutes',
      support_email: 'info@balajicotrader.com',
      website_url: window.location.origin,
      current_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
      }),
    };

    console.log(`📧 Sending ${type} email to:`, email);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('✅ Authentication email sent successfully:', response.status);
    return response.status === 200;
  } catch (error: any) {
    console.error('❌ Failed to send authentication email:', error);
    return false;
  }
};

// Get email content based on type
const getEmailContent = (type: AuthEmailType, code: string, username: string) => {
  switch (type) {
    case 'otp_verification':
      return {
        subject: 'Verify Your Email - BALAJI & CO',
        authType: 'Email Verification',
        title: 'Welcome to BALAJI & CO!',
        body: `Thank you for signing up with BALAJI & CO. To complete your account registration, please verify your email address using the code below:

**Verification Code: ${code}**

This code will expire in 10 minutes for security reasons.

If you didn't create an account with us, please ignore this email.

Welcome to the BALAJI & CO family!`
      };

    case 'forgot_password':
      return {
        subject: 'Reset Your Password - BALAJI & CO',
        authType: 'Password Reset',
        title: 'Password Reset Request',
        body: `We received a request to reset your password for your BALAJI & CO account.

**Reset Code: ${code}**

Use this code to reset your password. This code will expire in 10 minutes for security reasons.

If you didn't request a password reset, please ignore this email and your password will remain unchanged.

For security, never share this code with anyone.`
      };

    default:
      return {
        subject: 'Authentication Code - BALAJI & CO',
        authType: 'Authentication',
        title: 'Authentication Required',
        body: `Your authentication code is: ${code}`
      };
  }
};

// Send OTP for signup verification
export const sendSignupOTP = async (email: string, otp: string, username?: string): Promise<boolean> => {
  return sendAuthEmail({
    email,
    type: 'otp_verification',
    code: otp,
    username
  });
};

// Send password reset code
export const sendPasswordResetCode = async (email: string, resetCode: string, username?: string): Promise<boolean> => {
  return sendAuthEmail({
    email,
    type: 'forgot_password',
    code: resetCode,
    username
  });
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate secure random code
export const generateAuthCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};