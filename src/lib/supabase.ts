/**
 * Supabase Client Configuration
 * Initializes and exports the Supabase client for database operations
 */

import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Log what we're getting
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables:', import.meta.env);
  throw new Error(
    'Missing Supabase credentials. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file'
  );
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database type definitions for better TypeScript support
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          business_type: string | null;
          role: 'admin' | 'customer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          business_type?: string | null;
          role?: 'admin' | 'customer';
        };
        Update: {
          username?: string;
          business_type?: string | null;
          role?: 'admin' | 'customer';
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image: string | null;
          price: number;
          stock: number;
          unit: string;
          created_at: string;
          updated_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          customer_name: string;
          product_id: string;
          product_name: string;
          quantity: number;
          price_per_unit: number;
          total_price: number;
          status: 'pending' | 'confirmed' | 'packed' | 'delivered';
          estimated_delivery: string | null;
          created_at: string;
        };
      };
      catering_orders: {
        Row: {
          id: string;
          customer_id: string;
          customer_name: string;
          event_name: string;
          event_date: string;
          guest_count: number;
          items: any[];
          total_price: number;
          status: 'pending' | 'confirmed' | 'in-preparation' | 'ready' | 'delivered';
          special_requests: string | null;
          contact_phone: string;
          delivery_address: string;
          order_deadline: string;
          created_at: string;
        };
      };
      inquiries: {
        Row: {
          id: string;
          customer_id: string;
          customer_name: string;
          subject: string;
          message: string;
          reply: string | null;
          replied_at: string | null;
          is_read: boolean;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          type: 'order' | 'inquiry';
          message: string;
          reference_id: string;
          is_read: boolean;
          created_at: string;
        };
      };
      id_counters: {
        Row: {
          counter_key: string;
          date: string;
          count: number;
          updated_at: string;
        };
      };
    };
  };
};
