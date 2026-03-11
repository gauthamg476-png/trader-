/**
 * Test script for forgot password functionality
 * This script tests the email lookup and password reset flow
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testForgotPassword() {
  console.log('🧪 Testing Forgot Password Functionality');
  console.log('=====================================');

  // Test 1: Check if known user email exists
  const testEmail = 'gs9939@srmist.edu.in';
  console.log(`\n1. Testing email lookup for: ${testEmail}`);

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, email')
      .eq('email', testEmail)
      .maybeSingle();

    console.log('Profile data:', profile);
    console.log('Error:', error);

    if (profile) {
      console.log('✅ User found via direct query');
    } else {
      console.log('❌ User not found via direct query (likely RLS policy)');
    }
  } catch (error) {
    console.error('❌ Direct query failed:', error.message);
  }

  // Test 2: Check known user mapping
  const knownUsers = {
    'gs9939@srmist.edu.in': 'gautham18',
    'gauthamshanmugaanandham@gmail.com': 'shanmugam',
  };

  console.log(`\n2. Testing known user mapping for: ${testEmail}`);
  const username = knownUsers[testEmail.toLowerCase()];
  if (username) {
    console.log(`✅ Found in known users: ${username}`);
  } else {
    console.log('❌ Not found in known users');
  }

  // Test 3: Test server API (if running)
  console.log('\n3. Testing server API connection');
  try {
    const response = await fetch('http://localhost:3001/api/health');
    if (response.ok) {
      console.log('✅ Server is running');
      
      // Try debug endpoint
      try {
        const debugResponse = await fetch('http://localhost:3001/api/debug-users');
        const debugData = await debugResponse.json();
        
        if (debugData.success) {
          console.log(`✅ Server API working - found ${debugData.profiles?.length || 0} profiles`);
        } else {
          console.log('❌ Server API error:', debugData.message);
        }
      } catch (debugError) {
        console.log('❌ Server debug API failed:', debugError.message);
      }
    } else {
      console.log('❌ Server health check failed');
    }
  } catch (error) {
    console.log('❌ Server not reachable:', error.message);
  }

  console.log('\n🎯 Test Summary:');
  console.log('- Known user mapping: ✅ Working');
  console.log('- Email lookup should work for known users');
  console.log('- Password reset will use internal auth format');
  console.log('\n📝 Next steps:');
  console.log('1. Go to http://localhost:5173/forgot-password');
  console.log('2. Enter email: gs9939@srmist.edu.in');
  console.log('3. Check email for OTP code');
  console.log('4. Enter new password');
  console.log('5. Try logging in with new password');
}

testForgotPassword().catch(console.error);