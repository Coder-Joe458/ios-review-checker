const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const reviewController = require('./controllers/reviewController');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 5001;

// 支持前端域名的CORS配置
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://ios-review-checker.vercel.app',
  process.env.FRONTEND_URL // 从环境变量获取前端URL
].filter(Boolean); // 过滤掉undefined值

// 中间件
app.use(cors({
  origin: (origin, callback) => {
    // 允许没有origin的请求（如API工具的请求）
    if (!origin) return callback(null, true);
    
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || ALLOWED_ORIGINS.indexOf('*') !== -1) {
      callback(null, true);
    } else {
      console.log('CORS阻止了来自此origin的请求:', origin);
      callback(new Error('CORS policy不允许来自此origin的访问'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// 路由
app.get('/api/rules', reviewController.getRules);
app.post('/api/check', upload.single('ipaFile'), reviewController.checkApp);
app.post('/api/analyze-ipa', upload.single('ipaFile'), reviewController.analyzeIPA);

// 在生产环境中提供静态文件
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 为测试导出app实例
module.exports = app; 