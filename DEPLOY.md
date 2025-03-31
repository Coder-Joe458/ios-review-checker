# iOS应用预审核系统部署指南

本文档提供将iOS应用预审核系统部署到云服务的步骤。我们将使用Render.com部署后端API，使用Vercel部署前端应用。

## 第一步：部署后端API到Render.com

1. 注册并登录[Render.com](https://render.com)
2. 点击"New +"按钮，选择"Web Service"
3. 连接你的GitHub仓库或上传代码
4. 配置以下设置:
   - **名称**: `ios-review-checker-api`（或你喜欢的名称）
   - **根目录**: `/`
   - **环境**: `Node`
   - **构建命令**: `npm install`
   - **启动命令**: `node server/index.js`
   - **实例类型**: 选择免费计划
5. 添加环境变量:
   - `FRONTEND_URL`: 你的前端URL (如 `https://ios-review-checker.vercel.app`)
6. 点击"Create Web Service"
7. 等待部署完成，记下生成的API URL (如 `https://ios-review-checker-api.onrender.com`)

## 第二步：部署前端到Vercel

1. 注册并登录[Vercel](https://vercel.com)
2. 点击"New Project"
3. 导入你的GitHub仓库或上传代码
4. 配置以下设置:
   - **框架预设**: `Create React App`
   - **根目录**: `/client`
5. 配置环境变量:
   - `REACT_APP_API_URL`: 你的后端API URL (从Render.com获取)
6. 点击"Deploy"
7. 等待部署完成，你的应用将可以在生成的URL访问

## 第三步：更新CORS设置

确保后端API的CORS设置允许你的前端URL访问:

1. 在Render.com的项目中，添加/更新环境变量:
   - `FRONTEND_URL`: 你的前端应用的确切URL（如果不同）

## 部署后测试

1. 访问你的前端应用URL
2. 尝试切换语言，确认中英文两种界面正常显示
3. 填写一个测试应用表单，并提交进行审核
4. 验证审核结果正确显示

## 故障排除

如果遇到问题:

1. **API连接错误**: 检查前端环境变量`REACT_APP_API_URL`是否正确
2. **CORS错误**: 确保后端的`ALLOWED_ORIGINS`包含你的前端URL
3. **部署失败**: 检查构建日志查找错误信息

## 自动部署设置

为了在代码更新时自动部署:

1. 将你的代码推送到GitHub仓库
2. 在Vercel和Render中配置自动部署（通常是默认启用的）
3. 每次push到main/master分支时，应用将自动重新部署 