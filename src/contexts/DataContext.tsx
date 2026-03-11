/**
 * Data Context
 * Manages products, orders, inquiries, and notifications using Supabase
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Order, Inquiry, Notification, SalesData, User, OrderStatus, CateringOrder } from '@/types';
import { sendOrderEmailJS, sendCateringEmailJS } from '@/lib/emailjsService';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

// Import product images
import toorDalImg from '@/assets/toor-dal.jpg';
import moongDalImg from '@/assets/moong-dal.jpg';
import chanaDalImg from '@/assets/chana-dal.jpg';
import uradDalImg from '@/assets/urad-dal.jpg';

interface DataContextType {
  products: Product[];
  orders: Order[];
  cateringOrders: CateringOrder[];
  inquiries: Inquiry[];
  notifications: Notification[];
  salesData: SalesData[];
  customers: User[];
  
  // Product operations
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  
  // Order operations
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'estimatedDelivery'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string, reason: string) => Promise<void>;
  
  // Catering order operations
  createCateringOrder: (order: Omit<CateringOrder, 'id' | 'createdAt'>) => Promise<CateringOrder>;
  updateCateringOrderStatus: (orderId: string, status: string) => Promise<void>;
  cancelCateringOrder: (orderId: string, reason: string) => Promise<void>;
  
  // Inquiry operations
  createInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'isRead' | 'reply' | 'repliedAt'>) => Promise<void>;
  replyToInquiry: (inquiryId: string, reply: string) => Promise<void>;
  
  // Notification operations
  markNotificationRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  unreadNotificationsCount: number;
  
  // Data refresh
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Product image mapping
const PRODUCT_IMAGES: Record<string, string> = {
  'prod-001': toorDalImg,
  'prod-002': moongDalImg,
  'prod-003': chanaDalImg,
  'prod-004': uradDalImg,
};

// Generate professional order IDs in format: TT-YYMMDD-XXXXX
const generateOrderId = async (type: 'OR' | 'CT' | 'IN'): Promise<string> => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const dateKey = `${year}${month}${day}`;
  const counterKey = `${type}-${dateKey}`;

  try {
    // Get or create counter
    const { data: counter, error: fetchError } = await supabase
      .from('id_counters')
      .select('*')
      .eq('counter_key', counterKey)
      .single();

    let count = 1;

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (counter) {
      // Check if date matches, reset if new day
      if (counter.date === dateKey) {
        count = counter.count + 1;
      }
      
      // Update counter
      await supabase
        .from('id_counters')
        .update({ count, date: dateKey })
        .eq('counter_key', counterKey);
    } else {
      // Create new counter
      await supabase
        .from('id_counters')
        .insert({ counter_key: counterKey, date: dateKey, count });
    }

    const sequentialNumber = count.toString().padStart(5, '0');
    return `${type}-${dateKey}-${sequentialNumber}`;
  } catch (error) {
    console.error('Error generating order ID:', error);
    // Fallback to timestamp-based ID
    return `${type}-${dateKey}-${Date.now().toString().slice(-5)}`;
  }
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cateringOrders, setCateringOrders] = useState<CateringOrder[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);

  const loadData = async () => {
    try {
      // Load products (always available, even without login)
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('id');

      if (productsError) {
        console.error('Error loading products:', productsError);
      } else if (productsData) {
        const productsWithImages = productsData.map(p => ({
          ...p,
          image: PRODUCT_IMAGES[p.id] || p.image,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }));
        setProducts(productsWithImages);
      }

      // Don't load user-specific data if not logged in
      if (!user) return;

      // Load orders (user's own or all if admin)
      const ordersQuery = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (user.role !== 'admin') {
        ordersQuery.eq('customer_id', user.id);
      }

      const { data: ordersData, error: ordersError } = await ordersQuery;
      if (ordersError) {
        console.error('Error loading orders:', ordersError);
      } else if (ordersData) {
        const formattedOrders = ordersData.map(o => ({
          id: o.id,
          customerId: o.customer_id,
          customerName: o.customer_name,
          productId: o.product_id,
          productName: o.product_name,
          quantity: o.quantity,
          pricePerUnit: o.price_per_unit,
          totalPrice: o.total_price,
          subtotal: o.subtotal,
          shippingCost: o.shipping_cost,
          shippingPercentage: o.shipping_percentage,
          paymentInfo: o.payment_method ? {
            method: o.payment_method,
            status: o.payment_status || 'pending',
            advanceAmount: o.advance_amount || 0,
            remainingAmount: o.remaining_amount || 0,
            razorpayOrderId: o.razorpay_order_id,
            razorpayPaymentId: o.razorpay_payment_id,
            advancePaidAt: o.advance_paid_at,
            fullPaymentAt: o.full_payment_at,
          } : undefined,
          status: o.status as OrderStatus,
          estimatedDelivery: o.estimated_delivery,
          createdAt: o.created_at,
          cancelledAt: o.cancelled_at,
          cancellationReason: o.cancellation_reason,
          contactPhone: o.contact_phone,
          deliveryAddress: o.delivery_address,
        }));
        setOrders(formattedOrders);

        // Generate sales data from orders
        const sales: SalesData[] = formattedOrders.map(o => ({
          date: o.createdAt.split('T')[0],
          productId: o.productId,
          productName: o.productName,
          quantity: o.quantity,
          revenue: o.totalPrice,
          priceAtSale: o.pricePerUnit,
        }));
        setSalesData(sales);
      }

      // Load catering orders
      const cateringQuery = supabase
        .from('catering_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (user.role !== 'admin') {
        cateringQuery.eq('customer_id', user.id);
      }

      const { data: cateringData, error: cateringError } = await cateringQuery;
      if (cateringError) {
        console.error('Error loading catering orders:', cateringError);
      } else if (cateringData) {
        const formattedCatering = cateringData.map(c => ({
          id: c.id,
          customerId: c.customer_id,
          customerName: c.customer_name,
          eventName: c.event_name,
          eventDate: c.event_date,
          guestCount: c.guest_count,
          items: c.items,
          totalPrice: c.total_price,
          status: c.status,
          specialRequests: c.special_requests,
          contactPhone: c.contact_phone,
          deliveryAddress: c.delivery_address,
          orderDeadline: c.order_deadline,
          createdAt: c.created_at,
          cancelledAt: c.cancelled_at,
          cancellationReason: c.cancellation_reason,
        }));
        setCateringOrders(formattedCatering);
      }

      // Load inquiries
      const inquiriesQuery = supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (user.role !== 'admin') {
        inquiriesQuery.eq('customer_id', user.id);
      }

      const { data: inquiriesData, error: inquiriesError } = await inquiriesQuery;
      if (inquiriesError) {
        console.error('Error loading inquiries:', inquiriesError);
      } else if (inquiriesData) {
        const formattedInquiries = inquiriesData.map(i => ({
          id: i.id,
          customerId: i.customer_id,
          customerName: i.customer_name,
          subject: i.subject,
          message: i.message,
          reply: i.reply,
          repliedAt: i.replied_at,
          isRead: i.is_read,
          createdAt: i.created_at,
        }));
        setInquiries(formattedInquiries);
      }

      // Load notifications (admin only)
      if (user.role === 'admin') {
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (notificationsError) {
          console.error('Error loading notifications:', notificationsError);
        } else if (notificationsData) {
          const formattedNotifications = notificationsData.map(n => ({
            id: n.id,
            type: n.type as 'order' | 'inquiry',
            message: n.message,
            referenceId: n.reference_id,
            isRead: n.is_read,
            createdAt: n.created_at,
          }));
          setNotifications(formattedNotifications);
        }
      }

      // Load customers (admin only)
      if (user.role === 'admin') {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'customer');

        if (profilesError) {
          console.error('Error loading customers:', profilesError);
        } else if (profilesData) {
          const formattedCustomers = profilesData.map(p => ({
            id: p.id,
            username: p.username,
            email: p.email,
            role: p.role as 'customer',
            businessType: p.business_type,
            createdAt: p.created_at,
            password: '',
          }));
          setCustomers(formattedCustomers);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          stock: updates.stock,
          unit: updates.unit,
        })
        .eq('id', productId);

      if (error) throw error;

      await loadData();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'estimatedDelivery'>): Promise<Order> => {
    try {
      const product = products.find(p => p.id === orderData.productId);
      const hasStock = product && product.stock >= orderData.quantity;
      
      const orderId = await generateOrderId('OR');
      // All orders start as pending - admin must confirm them
      const status: OrderStatus = 'pending';
      const estimatedDelivery = hasStock
        ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          customer_id: orderData.customerId,
          customer_name: orderData.customerName,
          product_id: orderData.productId,
          product_name: orderData.productName,
          quantity: orderData.quantity,
          price_per_unit: orderData.pricePerUnit,
          total_price: orderData.totalPrice,
          subtotal: orderData.subtotal,
          shipping_cost: orderData.shippingCost,
          shipping_percentage: orderData.shippingPercentage,
          // Only include payment fields if they exist in the database
          ...(orderData.paymentInfo && {
            payment_method: orderData.paymentInfo.method,
            payment_status: orderData.paymentInfo.status,
            advance_amount: orderData.paymentInfo.advanceAmount,
            remaining_amount: orderData.paymentInfo.remainingAmount,
          }),
          status,
          estimated_delivery: estimatedDelivery,
          contact_phone: orderData.contactPhone,
          delivery_address: orderData.deliveryAddress,
        })
        .select()
        .single();

      if (error) throw error;

      // Don't update stock yet - wait for admin confirmation
      // Stock will be updated when admin changes status to 'confirmed'

      // Create notification
      await supabase.from('notifications').insert({
        id: `notif-${Date.now()}`,
        type: 'order',
        message: `New pending order from ${orderData.customerName}`,
        reference_id: orderId,
        is_read: false,
      });

      await loadData();

      // Send email notification (non-blocking)
      sendOrderEmailJS({
        customerName: orderData.customerName,
        productName: orderData.productName,
        quantity: orderData.quantity,
        orderType: status,
        totalPrice: orderData.totalPrice,
        orderId,
      }).catch(error => console.error('Email notification failed:', error));

      return {
        ...orderData,
        id: orderId,
        status,
        estimatedDelivery,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      // If changing to confirmed, deduct stock
      if (status === 'confirmed') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          const product = products.find(p => p.id === order.productId);
          if (product && product.stock >= order.quantity) {
            await updateProduct(product.id, { stock: product.stock - order.quantity });
          }
        }
      }

      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      await loadData();
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const createCateringOrder = async (orderData: Omit<CateringOrder, 'id' | 'createdAt'>): Promise<CateringOrder> => {
    try {
      const orderId = await generateOrderId('CT');

      const { data, error } = await supabase
        .from('catering_orders')
        .insert({
          id: orderId,
          customer_id: orderData.customerId,
          customer_name: orderData.customerName,
          event_name: orderData.eventName,
          event_date: orderData.eventDate,
          guest_count: orderData.guestCount,
          items: orderData.items,
          total_price: orderData.totalPrice,
          status: orderData.status,
          special_requests: orderData.specialRequests,
          contact_phone: orderData.contactPhone,
          delivery_address: orderData.deliveryAddress,
          order_deadline: orderData.orderDeadline,
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification
      await supabase.from('notifications').insert({
        id: `notif-${Date.now()}`,
        type: 'order',
        message: `New catering order from ${orderData.customerName} for ${orderData.eventName}`,
        reference_id: orderId,
        is_read: false,
      });

      await loadData();

      // Send email notification (non-blocking)
      sendCateringEmailJS({
        customerName: orderData.customerName,
        eventName: orderData.eventName,
        eventDate: orderData.eventDate,
        guestCount: orderData.guestCount,
        totalPrice: orderData.totalPrice,
        orderId,
      }).catch(error => console.error('Email notification failed:', error));

      return {
        ...orderData,
        id: orderId,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error creating catering order:', error);
      throw error;
    }
  };

  const updateCateringOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('catering_orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      await loadData();
    } catch (error) {
      console.error('Error updating catering order status:', error);
      throw error;
    }
  };

  const createInquiry = async (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'isRead' | 'reply' | 'repliedAt'>) => {
    try {
      const inquiryId = await generateOrderId('IN');

      const { error } = await supabase
        .from('inquiries')
        .insert({
          id: inquiryId,
          customer_id: inquiryData.customerId,
          customer_name: inquiryData.customerName,
          subject: inquiryData.subject,
          message: inquiryData.message,
          is_read: false,
        });

      if (error) throw error;

      // Create notification
      await supabase.from('notifications').insert({
        id: `notif-${Date.now()}`,
        type: 'inquiry',
        message: `New inquiry from ${inquiryData.customerName}: ${inquiryData.subject}`,
        reference_id: inquiryId,
        is_read: false,
      });

      await loadData();

      // Inquiry submitted successfully (email notifications removed)
    } catch (error) {
      console.error('Error creating inquiry:', error);
      throw error;
    }
  };

  const replyToInquiry = async (inquiryId: string, reply: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({
          reply,
          replied_at: new Date().toISOString(),
          is_read: true,
        })
        .eq('id', inquiryId);

      if (error) throw error;

      await loadData();
    } catch (error) {
      console.error('Error replying to inquiry:', error);
      throw error;
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      await loadData();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) throw error;

      await loadData();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const refreshData = async () => {
    await loadData();
  };

  const cancelOrder = async (orderId: string, reason: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) throw new Error('Order not found');

      // Restore stock
      const product = products.find(p => p.id === order.productId);
      if (product && order.status === 'confirmed') {
        await updateProduct(product.id, { stock: product.stock + order.quantity });
      }

      // Update order with cancellation
      const { error } = await supabase
        .from('orders')
        .update({
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason,
        })
        .eq('id', orderId);

      if (error) throw error;

      await loadData();
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  };

  const cancelCateringOrder = async (orderId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('catering_orders')
        .update({
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason,
        })
        .eq('id', orderId);

      if (error) throw error;

      await loadData();
    } catch (error) {
      console.error('Error cancelling catering order:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider
      value={{
        products,
        orders,
        cateringOrders,
        inquiries,
        notifications,
        salesData,
        customers,
        updateProduct,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        createCateringOrder,
        updateCateringOrderStatus,
        cancelCateringOrder,
        createInquiry,
        replyToInquiry,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
