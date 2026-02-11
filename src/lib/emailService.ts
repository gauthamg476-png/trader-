/**
 * Email Service
 * Helper functions to send email notifications to the backend
 */

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Send order notification email to admin
 * @param orderData - Order details
 * @returns Promise with success status
 */
export async function sendOrderNotification(orderData: {
  customerName: string;
  productName: string;
  quantity: number;
  orderType: string;
  totalPrice: number;
}): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/send-order-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Log error but don't break the order process
    console.error('Failed to send order notification email:', error);
    return {
      success: false,
      message: 'Email notification failed, but order was created successfully',
    };
  }
}

/**
 * Send inquiry notification email to admin
 * @param inquiryData - Inquiry details
 * @returns Promise with success status
 */
export async function sendInquiryNotification(inquiryData: {
  customerName: string;
  subject: string;
  message: string;
  customerEmail?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/send-inquiry-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiryData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Log error but don't break the inquiry process
    console.error('Failed to send inquiry notification email:', error);
    return {
      success: false,
      message: 'Email notification failed, but inquiry was submitted successfully',
    };
  }
}
