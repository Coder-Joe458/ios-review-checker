const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// iOS应用审核规则 - 中文
const reviewRulesCN = [
  {
    id: 1,
    category: '隐私',
    rule: '应用必须包含隐私政策',
    description: '应用必须包含明确的隐私政策，说明应用如何收集和使用用户数据。',
    checkMethod: '检查Info.plist是否包含隐私政策URL'
  },
  {
    id: 2, 
    category: '用户界面',
    rule: '应用必须适配不同尺寸的设备',
    description: '应用应该能够在不同尺寸的iOS设备上正常显示，包括iPhone和iPad。',
    checkMethod: '检查应用是否使用了自动布局(Auto Layout)和适配不同屏幕尺寸'
  },
  {
    id: 3,
    category: '功能',
    rule: '应用不应在没有用户同意的情况下访问敏感数据',
    description: '应用必须请求用户许可才能访问相机、麦克风、位置、联系人等敏感数据。',
    checkMethod: '检查Info.plist中的权限描述字符串'
  },
  {
    id: 4,
    category: '内容',
    rule: '应用不应包含令人反感或不适当的内容',
    description: '应用中不应包含暴力、色情或其他令人反感的内容。',
    checkMethod: '审核应用中的图像和文本内容'
  },
  {
    id: 5,
    category: '安全',
    rule: '应用应使用HTTPS进行网络通信',
    description: '应用应使用安全的网络连接方式，避免使用不安全的HTTP连接。',
    checkMethod: '检查Info.plist中的ATS配置'
  }
];

// iOS应用审核规则 - 英文
const reviewRulesEN = [
  {
    id: 1,
    category: 'Privacy',
    rule: 'App must include a privacy policy',
    description: 'Apps must include a clear privacy policy explaining how the app collects and uses user data.',
    checkMethod: 'Check if Info.plist contains a privacy policy URL'
  },
  {
    id: 2, 
    category: 'User Interface',
    rule: 'App must adapt to different device sizes',
    description: 'Apps should display properly on different iOS device sizes, including iPhone and iPad.',
    checkMethod: 'Check if the app uses Auto Layout and adapts to different screen sizes'
  },
  {
    id: 3,
    category: 'Functionality',
    rule: 'App should not access sensitive data without user consent',
    description: 'Apps must request user permission to access camera, microphone, location, contacts, and other sensitive data.',
    checkMethod: 'Check for permission descriptions in Info.plist'
  },
  {
    id: 4,
    category: 'Content',
    rule: 'App should not contain offensive or inappropriate content',
    description: 'Apps should not contain violence, pornography, or other offensive content.',
    checkMethod: 'Review images and text content in the app'
  },
  {
    id: 5,
    category: 'Security',
    rule: 'App should use HTTPS for network communications',
    description: 'Apps should use secure network connections and avoid using insecure HTTP connections.',
    checkMethod: 'Check ATS configuration in Info.plist'
  }
];

// 路由
app.get('/api/rules', (req, res) => {
  console.log('收到获取审核规则的请求');
  // 获取客户端请求的语言，默认为中文
  const lang = req.query.lang || 'zh';
  
  // 根据语言返回相应的规则
  const rules = lang === 'en' ? reviewRulesEN : reviewRulesCN;
  
  console.log(`发送 ${lang} 语言的审核规则数据:`, rules);
  res.json(rules);
});

app.post('/api/check', upload.single('ipaFile'), (req, res) => {
  // 这里应该是真正的IPA文件分析逻辑
  // 此处我们模拟一个简化的分析过程
  
  const appInfo = req.body;
  const issues = [];
  const recommendations = [];
  
  // 获取语言
  const lang = req.query.lang || 'zh';
  
  // 使用相应语言的审核规则
  const reviewRules = lang === 'en' ? reviewRulesEN : reviewRulesCN;
  
  // 模拟审核结果
  if (!appInfo.privacyPolicy) {
    issues.push({
      ruleId: 1,
      severity: 'high',
      message: lang === 'en' ? 'Missing privacy policy' : '缺少隐私政策',
      details: lang === 'en' 
        ? 'The app needs to include a privacy policy URL in Info.plist.' 
        : '应用需要包含隐私政策URL，请在Info.plist中添加。'
    });
    recommendations.push(
      lang === 'en'
        ? 'Add NSPrivacyPolicyURLString key in Info.plist pointing to your privacy policy page.'
        : '在Info.plist中添加NSPrivacyPolicyURLString键，指向您的隐私政策页面。'
    );
  }
  
  if (appInfo.permissions && appInfo.permissions.length > 0) {
    appInfo.permissions.forEach(permission => {
      if (!permission.description) {
        issues.push({
          ruleId: 3,
          severity: 'high',
          message: lang === 'en'
            ? `Missing ${permission.name} permission description`
            : `缺少${permission.name}权限的使用说明`,
          details: lang === 'en'
            ? `Please add a description for ${permission.name} permission in Info.plist explaining why the app needs this permission.`
            : `请在Info.plist中为${permission.name}权限添加描述字符串，说明为什么应用需要此权限。`
        });
      }
    });
    
    if (appInfo.permissions.find(p => p.name === 'location')) {
      recommendations.push(
        lang === 'en'
          ? 'Location permissions should be requested only when needed, not at app launch.'
          : '位置权限需要在实际需要时才请求，不建议在应用启动时立即请求。'
      );
    }
  }
  
  if (!appInfo.usesHttps) {
    issues.push({
      ruleId: 5,
      severity: 'medium',
      message: lang === 'en'
        ? 'App does not use HTTPS for network communications'
        : '应用没有使用HTTPS进行网络通信',
      details: lang === 'en'
        ? 'The app should use HTTPS for network communications to ensure data security.'
        : '应用应使用HTTPS进行网络通信，以保护用户数据的安全。'
    });
    recommendations.push(
      lang === 'en'
        ? 'Enable App Transport Security (ATS) in Info.plist to ensure the app only uses secure HTTPS connections.'
        : '在Info.plist中启用App Transport Security (ATS)，确保应用仅使用安全的HTTPS连接。'
    );
  }
  
  // 返回分析结果
  setTimeout(() => {
    res.json({
      success: true,
      appName: appInfo.name || (lang === 'en' ? 'Unknown App' : '未知应用'),
      issues,
      recommendations,
      passedRules: reviewRules.length - issues.length,
      totalRules: reviewRules.length
    });
  }, 1500); // 延迟1.5秒，模拟处理时间
});

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