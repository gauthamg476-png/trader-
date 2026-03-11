// Quick server status check
// Run: node check-server-status.js

const checkServer = async () => {
  try {
    console.log('🔍 Checking if server is running...');
    
    const response = await fetch('http://localhost:3001/api/health');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Server is running:', data);
      
      // Test Razorpay endpoint
      console.log('\n🧪 Testing Razorpay endpoint...');
      const razorpayResponse = await fetch('http://localhost:3001/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 10000,
          currency: 'INR',
          receipt: 'test-123',
          notes: { test: 'true' }
        })
      });
      
      console.log('Razorpay endpoint status:', razorpayResponse.status);
      
      if (!razorpayResponse.ok) {
        const errorText = await razorpayResponse.text();
        console.log('❌ Razorpay error response:', errorText);
      } else {
        const data = await razorpayResponse.json();
        console.log('✅ Razorpay response:', data);
      }
      
    } else {
      console.log('❌ Server responded with status:', response.status);
    }
    
  } catch (error) {
    if (error.message.includes('ECONNREFUSED')) {
      console.log('❌ Server is not running on port 3001');
      console.log('💡 Start server with: node server/index.js');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
};

checkServer();