const { reviewRulesCN, reviewRulesEN } = require('../models/reviewRules');
const path = require('path');

/**
 * 获取审核规则
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getRules = (req, res) => {
  console.log('收到获取审核规则的请求');
  // 获取客户端请求的语言，默认为中文
  const lang = req.query.lang || 'zh';
  
  // 根据语言返回相应的规则
  const rules = lang === 'en' ? reviewRulesEN : reviewRulesCN;
  
  console.log(`发送 ${lang} 语言的审核规则数据:`, rules);
  res.json(rules);
};

/**
 * 检查应用
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.checkApp = (req, res) => {
  // 这里应该是真正的IPA文件分析逻辑
  // 此处我们模拟一个简化的分析过程
  
  const appInfo = req.body;
  const issues = [];
  const recommendations = [];
  
  // 获取上传的文件信息
  const uploadedFile = req.file;
  console.log('上传的文件信息:', uploadedFile ? {
    filename: uploadedFile.filename,
    originalName: uploadedFile.originalname,
    size: uploadedFile.size,
    mimetype: uploadedFile.mimetype,
    path: uploadedFile.path
  } : 'No file uploaded');
  
  // 获取语言
  const lang = req.query.lang || 'zh';
  
  // 使用相应语言的审核规则
  const reviewRules = lang === 'en' ? reviewRulesEN : reviewRulesCN;
  
  console.log('收到的表单数据:', appInfo);
  
  // 模拟审核结果
  if (!appInfo.privacyPolicy || appInfo.privacyPolicy === 'false') {
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
  
  // 解析权限信息
  let permissions = [];
  if (appInfo.permissions) {
    try {
      permissions = JSON.parse(appInfo.permissions);
      console.log('解析权限数据:', permissions);
    } catch (error) {
      console.error('解析权限数据出错:', error);
      console.error('原始权限数据:', appInfo.permissions);
    }
  }
  
  // 检查权限
  if (permissions && Array.isArray(permissions) && permissions.length > 0) {
    permissions.forEach(permission => {
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
    
    if (permissions.find(p => p.name === 'location')) {
      recommendations.push(
        lang === 'en'
          ? 'Location permissions should be requested only when needed, not at app launch.'
          : '位置权限需要在实际需要时才请求，不建议在应用启动时立即请求。'
      );
    }
  }
  
  if (!appInfo.usesHttps || appInfo.usesHttps === 'false') {
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
  
  // 检查文件类型
  if (uploadedFile) {
    const fileExt = path.extname(uploadedFile.originalname).toLowerCase();
    if (fileExt !== '.ipa') {
      issues.push({
        ruleId: 4,
        severity: 'high',
        message: lang === 'en'
          ? 'Invalid file type uploaded'
          : '上传了无效的文件类型',
        details: lang === 'en'
          ? 'The uploaded file is not a valid IPA file. Please upload an iOS application package.'
          : '上传的文件不是有效的IPA文件。请上传iOS应用程序包。'
      });
    }
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
}; 