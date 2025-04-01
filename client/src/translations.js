// 翻译文件
const translations = {
  en: {
    // 网站标题和描述
    siteTitle: 'iOS App Pre-Review System',
    siteDescription: 'Check your app before submitting to the App Store. Discover potential issues and get recommendations in just 1 minute.',
    copyright: 'iOS App Pre-Review System ©{year} All Rights Reserved',
    
    // 页面标题
    headerTitle: 'iOS App Pre-Review',
    rulesTitle: 'App Store Review Guidelines',
    
    // 表单标签
    basicInfo: 'Basic Information',
    appName: 'App Name',
    appNamePlaceholder: 'Enter app name',
    appNameRequired: 'Please enter app name',
    uploadIPA: 'Upload IPA File (Optional)',
    uploadDragText: 'Click or drag IPA file to this area to upload',
    uploadHint: 'Supports single file upload. Actual analysis will extract information from the IPA file.',
    privacySecurity: 'Privacy & Security',
    hasPrivacyPolicy: 'App includes a privacy policy link',
    usesHttps: 'App only uses HTTPS for network communications',
    permissions: 'Permission Usage',
    
    // 权限相关
    usesCamera: 'Uses Camera',
    cameraDescription: 'Camera Usage Description',
    cameraPlaceholder: 'E.g.: For scanning QR codes',
    cameraMissing: 'Please provide camera usage description',
    
    usesLocation: 'Uses Location',
    locationDescription: 'Location Usage Description',
    locationPlaceholder: 'E.g.: To provide nearby services',
    locationMissing: 'Please provide location usage description',
    
    usesMicrophone: 'Uses Microphone',
    microphoneDescription: 'Microphone Usage Description',
    microphonePlaceholder: 'E.g.: For voice recognition',
    microphoneMissing: 'Please provide microphone usage description',
    
    // 按钮
    submitButton: 'Start Review',
    newReviewButton: 'Start New Review',
    
    // 步骤
    step1: 'Enter Information',
    step1Description: 'Provide basic app information',
    step2: 'Reviewing',
    step2Description: 'Analyzing your app',
    step3: 'Review Results',
    step3Description: 'View results and recommendations',
    
    // 加载提示
    loadingTip: 'Reviewing your app, please wait...',
    loadingRules: 'Loading guidelines...',
    
    // 结果页面
    resultTitle: 'Review Result',
    passRate: 'Pass Rate',
    passedRules: 'Passed {passed} rules out of {total}',
    issuesFound: 'Issues Found',
    recommendations: 'Recommendations',
    recommendation: 'Recommendation {index}',
    
    // IPA文件信息
    ipaFileInfo: 'IPA File Information',
    bundleId: 'Bundle ID',
    version: 'Version',
    minOSVersion: 'Minimum iOS Version',
    
    // 问题严重程度
    highSeverity: 'Serious Issue',
    mediumSeverity: 'Medium Issue',
    lowSeverity: 'Minor Issue',
    
    // 搜索
    searchPlaceholder: 'Search guidelines',
    
    // 审核规则表格
    columnCategory: 'Category',
    columnRule: 'Guideline',
    columnDescription: 'Description',
    columnCheckMethod: 'Check Method',
    
    // 错误信息
    errorLoadingRules: 'Unable to load review guidelines, please try again later',
    errorTitle: 'Error',
    genericErrorMessage: 'An error occurred during the review process. Please try again.',
    connectionError: 'Could not connect to the server. Please check your connection and try again.',
    fileUploadError: 'There was a problem uploading your IPA file. Please try a different file or contact support.',
    serverError: 'Server error occurred. Our team has been notified. Please try again later.',
    
    // 语言切换
    languageSwitch: 'Switch to 中文',
  },
  zh: {
    // 网站标题和描述
    siteTitle: 'iOS应用预审核系统',
    siteDescription: '在提交到App Store之前，让我们帮助您检查您的应用。只需1分钟，快速发现潜在问题并获取修改建议。',
    copyright: 'iOS应用预审核系统 ©{year} 版权所有',
    
    // 页面标题
    headerTitle: 'iOS应用预审核',
    rulesTitle: 'App Store 审核规则',
    
    // 表单标签
    basicInfo: '应用基本信息',
    appName: '应用名称',
    appNamePlaceholder: '输入应用名称',
    appNameRequired: '请输入应用名称',
    uploadIPA: 'IPA文件（可选）',
    uploadDragText: '点击或拖拽IPA文件到此区域上传',
    uploadHint: '支持单个文件上传。实际分析将从IPA文件中提取信息。',
    privacySecurity: '隐私与安全',
    hasPrivacyPolicy: '应用包含隐私政策链接',
    usesHttps: '应用只使用HTTPS进行网络通信',
    permissions: '权限使用',
    
    // 权限相关
    usesCamera: '使用摄像头',
    cameraDescription: '摄像头使用说明',
    cameraPlaceholder: '例如：用于扫描二维码',
    cameraMissing: '请提供摄像头使用说明',
    
    usesLocation: '使用位置信息',
    locationDescription: '位置信息使用说明',
    locationPlaceholder: '例如：用于提供附近的服务',
    locationMissing: '请提供位置信息使用说明',
    
    usesMicrophone: '使用麦克风',
    microphoneDescription: '麦克风使用说明',
    microphonePlaceholder: '例如：用于语音识别',
    microphoneMissing: '请提供麦克风使用说明',
    
    // 按钮
    submitButton: '开始审核',
    newReviewButton: '开始新的审核',
    
    // 步骤
    step1: '填写信息',
    step1Description: '提供应用基本信息',
    step2: '审核中',
    step2Description: '正在分析您的应用',
    step3: '审核结果',
    step3Description: '查看审核结果和建议',
    
    // 加载提示
    loadingTip: '正在审核应用，请稍候...',
    loadingRules: '加载规则中...',
    
    // 结果页面
    resultTitle: '审核结果',
    passRate: '通过率',
    passedRules: '通过了 {passed} 个规则，共 {total} 个规则',
    issuesFound: '发现的问题',
    recommendations: '建议',
    recommendation: '建议 {index}',
    
    // IPA文件信息
    ipaFileInfo: 'IPA文件信息',
    bundleId: '应用包ID',
    version: '版本号',
    minOSVersion: '最低iOS版本要求',
    
    // 问题严重程度
    highSeverity: '严重问题',
    mediumSeverity: '中等问题',
    lowSeverity: '轻微问题',
    
    // 搜索
    searchPlaceholder: '搜索规则',
    
    // 审核规则表格
    columnCategory: '类别',
    columnRule: '规则',
    columnDescription: '说明',
    columnCheckMethod: '检查方法',
    
    // 错误信息
    errorLoadingRules: '无法获取审核规则，请稍后再试',
    errorTitle: '错误',
    genericErrorMessage: '审核过程中发生错误，请重试。',
    connectionError: '无法连接到服务器，请检查您的网络连接并重试。',
    fileUploadError: '上传IPA文件时出现问题，请尝试使用其他文件或联系支持人员。',
    serverError: '服务器错误，我们的团队已经收到通知，请稍后再试。',
    
    // 语言切换
    languageSwitch: 'Switch to English',
  }
};

export default translations; 