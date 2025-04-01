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

module.exports = {
  reviewRulesCN,
  reviewRulesEN
}; 