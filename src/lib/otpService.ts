import emailjs from '@emailjs/browser';

// OTP storage (in production, use Redis or database)
const otpStorage = new Map<string, { otp: string; expires: number; attempts: number }>();

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via EmailJS using existing configuration
export const sendOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    const EMAILJS_TEMPLATE_ID_ORDER = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ORDER || '';
    const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

    console.log('EmailJS Config:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID_ORDER,
      publicKey: EMAILJS_PUBLIC_KEY ? 'Set' : 'Missing'
    });

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID_ORDER || !EMAILJS_PUBLIC_KEY) {
      console.error('⚠️ EmailJS not configured - missing credentials');
      return false;
    }

    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Use your existing order template but adapt it for OTP
    const templateParams = {
      to_email: email,
      customer_name: email.split('@')[0],
      product_name: 'Email Verification Code',
      quantity: 1,
      order_type: 'EMAIL VERIFICATION',
      total_price: `Your verification code is: ${otp}`,
      order_id: `VERIFY-${Date.now()}`,
      order_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
      }),
    };

    console.log('Sending OTP email to:', email);
    console.log('Template params:', templateParams);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ORDER,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('✅ OTP email sent successfully:', response.status, response.text);
    return true;
  } catch (error: any) {
    console.error('❌ Failed to send OTP:', error);
    console.error('Error details:', {
      status: error?.status,
      text: error?.text,
      message: error?.message
    });
    return false;
  }
};

// Store OTP with expiration (10 minutes)
export const storeOTP = (email: string, otp: string): void => {
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStorage.set(email.toLowerCase(), { otp, expires, attempts: 0 });
};

// Verify OTP
export const verifyOTP = (email: string, inputOTP: string): { success: boolean; message: string } => {
  const stored = otpStorage.get(email.toLowerCase());
  
  if (!stored) {
    return { success: false, message: 'OTP not found. Please request a new one.' };
  }

  if (Date.now() > stored.expires) {
    otpStorage.delete(email.toLowerCase());
    return { success: false, message: 'OTP has expired. Please request a new one.' };
  }

  if (stored.attempts >= 3) {
    otpStorage.delete(email.toLowerCase());
    return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
  }

  if (stored.otp !== inputOTP) {
    stored.attempts++;
    return { success: false, message: 'Invalid OTP. Please try again.' };
  }

  // OTP verified successfully
  otpStorage.delete(email.toLowerCase());
  return { success: true, message: 'Email verified successfully!' };
};

// Clean expired OTPs (call periodically)
export const cleanExpiredOTPs = (): void => {
  const now = Date.now();
  for (const [email, data] of otpStorage.entries()) {
    if (now > data.expires) {
      otpStorage.delete(email);
    }
  }
};

// Check if email is valid format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};