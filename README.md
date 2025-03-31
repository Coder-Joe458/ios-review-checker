# iOS应用预审核系统

这是一个帮助iOS应用开发者进行App Store审核前预检查的Web应用。开发者可以在提交应用到Apple审核之前，使用本系统快速检查应用是否符合App Store的审核规则，发现潜在问题并获取修复建议。

## 功能特点

- 快速审核：在一分钟内完成iOS应用的预审核
- 详细报告：提供详细的问题列表和修复建议
- 规则库：包含最新的App Store审核规则和最佳实践
- 用户友好：简单直观的界面，易于使用

## 技术栈

- 前端：React, Ant Design
- 后端：Node.js, Express
- 部署：支持Heroku等平台的一键部署

## 快速开始

### 安装依赖

```bash
# 安装所有依赖（前端和后端）
npm install
npm run install-client
```

### 启动开发服务器

```bash
# 同时启动前端和后端
npm run dev

# 只启动后端
npm run server

# 只启动前端
npm run client
```

### 构建生产版本

```bash
npm run build
```

### 部署

该应用可以轻松部署到Heroku或其他支持Node.js的平台。

```bash
# Heroku部署示例
heroku create
git push heroku master
```

## 项目结构

```
ios-review-checker/
├── client/               # 前端React应用
│   ├── public/           # 静态文件
│   └── src/              # React源代码
│       ├── components/   # React组件
│       └── ...
├── server/               # 后端代码
│   └── index.js          # Express服务器
└── ...
```

## 待开发功能

- [ ] IPA文件解析：直接从IPA文件提取应用信息
- [ ] Info.plist检查：自动检查Info.plist配置问题
- [ ] 屏幕截图分析：检查UI是否符合Apple设计指南
- [ ] 自定义检查规则：允许用户添加自定义规则

## 贡献

欢迎提交Pull Request或Issue来改进这个项目。

## 许可证

[MIT](LICENSE) 