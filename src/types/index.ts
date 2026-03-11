/**
 * Trading Business Management System - Type Definitions
 * Note: This can be upgraded to integrate with a real database (e.g., PostgreSQL, MongoDB)
 */

export type UserRole = 'admin' | 'customer';

export type BusinessType = 'Individual Consumer' | 'Business Owner' | 'Trader' | 'Retailer' | 'Broker / Agent';

export interface User {
  id: string;
  username: string;
  password: string; // In production, this should be hashed
  role: UserRole;
  businessType?: BusinessType;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  unit: string;
}

export type OrderStatus = 'confirmed' | 'packed' | 'pending' | 'delivered';

export type PaymentMethod = 'razorpay' | 'cash_on_delivery';
export type PaymentStatus = 'pending' | 'advance_paid' | 'fully_paid' | 'failed';

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  advanceAmount: number;
  remainingAmount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  advancePaidAt?: string;
  fullPaymentAt?: string;
}

export type CateringOrderStatus = 'pending' | 'confirmed' | 'in-preparation' | 'ready' | 'delivered';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  subtotal?: number;
  shippingCost?: number;
  shippingPercentage?: number;
  paymentInfo?: PaymentInfo;
  status: OrderStatus;
  estimatedDelivery?: string;
  createdAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
  contactPhone?: string;
  deliveryAddress?: string;
}

export interface CateringOrder {
  id: string;
  customerId: string;
  customerName: string;
  eventName: string;
  eventDate: string;
  guestCount: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    pricePerUnit: number;
  }[];
  totalPrice: number;
  status: CateringOrderStatus;
  specialRequests?: string;
  contactPhone: string;
  deliveryAddress: string;
  createdAt: string;
  orderDeadline: string; // 10-15 days before event
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface Inquiry {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  message: string;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  type: 'order' | 'inquiry';
  message: string;
  referenceId: string;
  createdAt: string;
  isRead: boolean;
}

export interface SalesData {
  date: string;
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
  priceAtSale: number;
}
