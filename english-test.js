const axios = require('axios');

console.log('Starting API connection test in English...');

const API_BASE_URL = 'http://localhost:5001';

async function testAPI() {
  try {
    console.log(`Testing connection to: ${API_BASE_URL}/api/rules?lang=en`);
    const response = await axios.get(`${API_BASE_URL}/api/rules?lang=en`);
    
    if (response.status === 200) {
      console.log('✅ API connection successful!');
      console.log(`Retrieved ${response.data.length} rules`);
      
      // 测试审核API
      console.log(`\nTesting connection to: ${API_BASE_URL}/api/check?lang=en`);
      const checkResponse = await axios.post(`${API_BASE_URL}/api/check?lang=en`, {
        name: 'Test App',
        privacyPolicy: false,
        usesHttps: true,
        permissions: [
          { name: 'camera', description: 'For scanning QR codes' }
        ]
      });
      
      if (checkResponse.status === 200) {
        console.log('✅ Review API connection successful!');
        console.log('Review result:', checkResponse.data);
      }
    }
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    if (error.response) {
      console.error('Status code:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    console.error('Please make sure the backend server is running on port 5001');
  }
}

testAPI(); 