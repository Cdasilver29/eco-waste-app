const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000/api';

async function testImageScan() {
  try {
    console.log('🧪 Testing Image Recognition...\n');

    // 1. Login
    console.log('1. Logging in...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john@example.com',
      password: 'password123'
    });
    const token = loginRes.data.data.accessToken;
    console.log('✅ Logged in\n');

    // 2. Test classify (you need to have a test image)
    if (fs.existsSync('test-bottle.jpg')) {
      console.log('2. Classifying image...');
      
      const formData = new FormData();
      formData.append('image', fs.createReadStream('test-bottle.jpg'));

      const classifyRes = await axios.post(
        `${BASE_URL}/image/classify`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('✅ Classification result:');
      console.log(JSON.stringify(classifyRes.data.data, null, 2), '\n');

      // 3. Test scan and log
      console.log('3. Scanning and logging...');
      
      const scanFormData = new FormData();
      scanFormData.append('image', fs.createReadStream('test-bottle.jpg'));
      scanFormData.append('weight', '0.5');
      scanFormData.append('notes', 'Test scan');

      const scanRes = await axios.post(
        `${BASE_URL}/image/scan-and-log`,
        scanFormData,
        {
          headers: {
            ...scanFormData.getHeaders(),
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('✅ Scan result:', scanRes.data.message);
      console.log(`   Points earned: ${scanRes.data.data.points}`);
      console.log(`   Total points: ${scanRes.data.data.totalPoints}\n`);

      // 4. Get stats
      console.log('4. Getting scan stats...');
      const statsRes = await axios.get(
        `${BASE_URL}/image/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Stats:', statsRes.data.data, '\n');

      console.log('🎉 All tests passed!');
    } else {
      console.log('⚠️  No test image found. Place an image named "test-bottle.jpg" in the backend folder.');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testImageScan();
