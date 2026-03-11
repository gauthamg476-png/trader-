/**
 * EmailJS Service
 * Simple email notifications without backend server
 * 
 * Setup Instructions:
 * 1. Go to https://www.emailjs.com/
 * 2. Sign up for free account
 * 3. Add email service (Gmail)
 * 4. Create email template
 * 5. Get your credentials and add to .env
 */

import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID_ORDER = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ORDER || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

/**
 * Initialize EmailJS with your public key
 */
export function initEmailJS() {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('✅ EmailJS initialized');
  } else {
    console.warn('⚠️ EmailJS not configured. Add credentials to .env file');
  }
}

/**
 * Send order notification email
 */
export async function sendOrderEmailJS(orderData: {
  customerName: string;
  productName: string;
  quantity: number;
  orderType: string;
  totalPrice: number;
  orderId: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID_ORDER || !EMAILJS_PUBLIC_KEY) {
      console.warn('⚠️ EmailJS not configured - skipping email notification');
      return {
        success: false,
        message: 'Email service not configured',
      };
    }

    const templateParams = {
      to_email: 'gauthamg476@gmail.com', // Admin email
      customer_name: orderData.customerName,
      product_name: orderData.productName,
      quantity: orderData.quantity,
      order_type: orderData.orderType.toUpperCase(),
      total_price: `₹${orderData.totalPrice.toLocaleString()}`,
      order_id: orderData.orderId,
      order_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
      }),
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ORDER,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('✅ Order email sent successfully:', response.status);
    return {
      success: true,
      message: 'Order notification sent',
    };
  } catch (error: any) {
    // Log detailed error but don't fail the order
    console.warn('⚠️ Email notification failed (non-critical):', {
      status: error?.status,
      text: error?.text,
      message: error?.message,
    });
    
    // Return success=false but with a friendly message
    return {
      success: false,
      message: 'Order created successfully (email notification skipped)',
    };
  }
}

/**
 * Send catering order notification email
 */
export async function sendCateringEmailJS(cateringData: {
  customerName: string;
  eventName: string;
  eventDate: string;
  guestCount: number;
  totalPrice: number;
  orderId: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID_ORDER || !EMAILJS_PUBLIC_KEY) {
      console.warn('⚠️ EmailJS not configured - skipping email notification');
      return {
        success: false,
        message: 'Email service not configured',
      };
    }

    const templateParams = {
      to_email: 'gauthamg476@gmail.com',
      customer_name: cateringData.customerName,
      event_name: cateringData.eventName,
      event_date: new Date(cateringData.eventDate).toLocaleDateString('en-IN', {
        dateStyle: 'full',
      }),
      guest_count: cateringData.guestCount,
      total_price: `₹${cateringData.totalPrice.toLocaleString()}`,
      order_id: cateringData.orderId,
      order_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
      }),
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ORDER,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('✅ Catering email sent successfully:', response.status);
    return {
      success: true,
      message: 'Catering notification sent',
    };
  } catch (error: any) {
    console.warn('⚠️ Email notification failed (non-critical):', {
      status: error?.status,
      text: error?.text,
      message: error?.message,
    });
    
    return {
      success: false,
      message: 'Catering order created successfully (email notification skipped)',
    };
  }
}
