const request = require('supertest');
const app = require('../../index');
const path = require('path');
const fs = require('fs');

describe('API集成测试', () => {
  
  describe('GET /api/rules', () => {
    it('应该返回中文规则 (默认语言)', async () => {
      const response = await request(app)
        .get('/api/rules')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].category).toBe('隐私');
    });
    
    it('应该返回英文规则 (指定英文)', async () => {
      const response = await request(app)
        .get('/api/rules?lang=en')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].category).toBe('Privacy');
    });
  });
  
  describe('POST /api/check', () => {
    it('应该检查应用信息 (不带文件)', async () => {
      const response = await request(app)
        .post('/api/check')
        .field('name', 'Test App')
        .field('privacyPolicy', 'true')
        .field('usesHttps', 'true')
        .field('permissions', JSON.stringify([
          { name: 'camera', description: 'Taking photos' }
        ]))
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.appName).toBe('Test App');
      expect(response.body.issues).toBeInstanceOf(Array);
      expect(response.body.recommendations).toBeInstanceOf(Array);
    });
    
    it('应该正确处理缺少隐私政策的情况', async () => {
      const response = await request(app)
        .post('/api/check')
        .field('name', 'App Without Privacy')
        .field('privacyPolicy', 'false')
        .field('usesHttps', 'true')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.issues.some(issue => issue.ruleId === 1)).toBe(true);
    });
    
    it('应该正确处理非HTTPS应用', async () => {
      const response = await request(app)
        .post('/api/check')
        .field('name', 'Non-HTTPS App')
        .field('privacyPolicy', 'true')
        .field('usesHttps', 'false')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.issues.some(issue => issue.ruleId === 5)).toBe(true);
    });
    
    it('应该检测缺少权限描述', async () => {
      const response = await request(app)
        .post('/api/check')
        .field('name', 'Missing Permission Desc')
        .field('privacyPolicy', 'true')
        .field('usesHttps', 'true')
        .field('permissions', JSON.stringify([
          { name: 'camera', description: '' }
        ]))
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.issues.some(issue => issue.ruleId === 3)).toBe(true);
    });
    
    it('应该处理文件上传 (模拟IPA文件)', async () => {
      // 创建一个临时IPA文件用于测试
      const testFilePath = path.join(__dirname, 'test-app.ipa');
      fs.writeFileSync(testFilePath, 'Mock IPA file content');
      
      try {
        const response = await request(app)
          .post('/api/check')
          .field('name', 'App With File')
          .field('privacyPolicy', 'true')
          .field('usesHttps', 'true')
          .attach('ipaFile', testFilePath)
          .expect('Content-Type', /json/)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.appName).toBe('App With File');
      } finally {
        // 清理测试文件
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });
    
    it('应该检测非IPA文件', async () => {
      // 创建一个临时非IPA文件用于测试
      const testFilePath = path.join(__dirname, 'test-app.txt');
      fs.writeFileSync(testFilePath, 'This is not an IPA file');
      
      try {
        const response = await request(app)
          .post('/api/check')
          .field('name', 'App With Wrong File')
          .field('privacyPolicy', 'true')
          .field('usesHttps', 'true')
          .attach('ipaFile', testFilePath)
          .expect('Content-Type', /json/)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.issues.some(issue => 
          issue.message.includes('Invalid file type') || 
          issue.message.includes('无效的文件类型')
        )).toBe(true);
      } finally {
        // 清理测试文件
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });
  });
}); 