// Test Razorpay Server Endpoint
// Run this to test if the server is working: node test-razorpay-server.js

const testRazorpayServer = async () => {
  try {
    console.log('🧪 Testing Razorpay server endpoint...');
    
    // Test 1: Health check
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Test 2: Create Razorpay order
    console.log('\n2. Testing Razorpay order creation...');
    const orderResponse = await fetch('http://localhost:3001/api/create-razorpay-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 10000, // ₹100 in paise
        currency: 'INR',
        receipt: 'test-order-123',
        notes: {
          order_id: 'test-order-123',
          customer_name: 'Test Customer',
        },
      }),
    });
    
    console.log('Response status:', orderResponse.status);
    
    if (orderResponse.ok) {
      const orderData = await orderResponse.json();
      console.log('✅ Razorpay order created successfully:', orderData);
    } else {
      const errorText = await orderResponse.text();
      console.log('❌ Razorpay order creation failed:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Server is not running. Start it with: node server/index.js');
    }
  }
};

testRazorpayServer();