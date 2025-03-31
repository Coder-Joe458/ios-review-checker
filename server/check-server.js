/**
 * 这个脚本用于检查服务器状态并测试API是否正常工作
 */
console.log('开始检查服务器状态...');

const http = require('http');
const port = process.env.PORT || 5001;

// 测试服务器连接
const testServerConnection = () => {
  console.log(`尝试连接到服务器: http://localhost:${port}/api/rules`);
  
  http.get(`http://localhost:${port}/api/rules`, (res) => {
    console.log(`服务器状态码: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
      console.log('✅ 服务器正常运行，API可以访问');
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const rules = JSON.parse(data);
          console.log(`✅ 成功获取 ${rules.length} 条审核规则`);
          console.log('审核规则示例:', rules[0]);
        } catch (error) {
          console.error('❌ JSON解析失败:', error.message);
        }
      });
    } else {
      console.error(`❌ API访问失败，状态码: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error('❌ 服务器连接失败:', err.message);
    console.log('请确保服务器已启动，运行: node server/index.js');
  });
};

// 等待2秒后测试连接（给服务器启动时间）
console.log('等待2秒...');
setTimeout(testServerConnection, 2000);

console.log('\n使用说明:');
console.log('1. 先启动后端服务器: node server/index.js');
console.log('2. 再启动前端服务: cd client && npm start');
console.log('3. 如果还有问题，请检查浏览器控制台和服务器日志\n'); 