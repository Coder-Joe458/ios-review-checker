const axios = require('axios');

console.log('开始测试前端API连接...');

const API_BASE_URL = 'http://localhost:5001';

async function testAPI() {
  try {
    console.log(`测试连接到: ${API_BASE_URL}/api/rules`);
    const response = await axios.get(`${API_BASE_URL}/api/rules`);
    
    if (response.status === 200) {
      console.log('✅ API连接成功!');
      console.log(`获取到 ${response.data.length} 条规则`);
      
      // 测试审核API
      console.log(`\n测试连接到: ${API_BASE_URL}/api/check`);
      const checkResponse = await axios.post(`${API_BASE_URL}/api/check`, {
        name: '测试应用',
        privacyPolicy: false,
        usesHttps: true,
        permissions: [
          { name: 'camera', description: '用于扫描二维码' }
        ]
      });
      
      if (checkResponse.status === 200) {
        console.log('✅ 审核API连接成功!');
        console.log('返回的审核结果:', checkResponse.data);
      }
    }
  } catch (error) {
    console.error('❌ API连接失败:', error.message);
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    console.error('请确保后端服务器运行在端口5001上');
  }
}

testAPI(); 