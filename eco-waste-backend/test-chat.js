const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let token = '';
let sessionId = '';

async function testChat() {
  try {
    console.log('🧪 Testing AI Chatbot...\n');

    // 1. Login
    console.log('1. Logging in...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john@example.com',
      password: 'password123'
    });
    token = loginRes.data.data.accessToken;
    console.log('✅ Logged in\n');

    // 2. Create chat session
    console.log('2. Creating chat session...');
    const sessionRes = await axios.post(
      `${BASE_URL}/chat/session`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    sessionId = sessionRes.data.data.sessionId;
    console.log('✅ Session created:', sessionId, '\n');

    // 3. Send a test message
    console.log('3. Sending message...');
    const messageRes = await axios.post(
      `${BASE_URL}/chat/message`,
      { sessionId, message: 'Hello AI, how are you?' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('✅ AI Response:', messageRes.data.data.reply);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testChat();

