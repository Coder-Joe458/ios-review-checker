# iOS 应用预审核系统 - 测试指南

本文档提供了关于如何测试应用预审核系统的详细说明，包括单元测试、集成测试和端到端测试。

## 测试环境准备

在运行测试之前，需要安装必要的依赖：

```bash
# 安装主项目依赖
npm install

# 安装客户端依赖
cd client && npm install && cd ..
```

## 测试类型概述

系统包含以下几种测试类型：

1. **服务器端单元测试**：测试服务器端独立组件
2. **服务器端集成测试**：测试API接口
3. **客户端单元测试**：测试React组件
4. **端到端测试**：测试整个应用流程

## 运行测试

### 服务器端测试

测试服务器端API和组件：

```bash
# 运行所有服务器测试
npm run test:server

# 运行特定测试文件
npx jest server/tests/unit/reviewRules.test.js
```

### 客户端测试

测试React组件和功能：

```bash
# 运行所有客户端测试
npm run test:client

# 以交互模式运行
cd client && npm test -- --watch
```

### 端到端测试

使用Cypress测试完整流程：

```bash
# 命令行运行所有端到端测试
npm run test:e2e

# 打开Cypress测试界面
npm run test:e2e:open
```

## 测试用例说明

### 服务器端测试

#### 规则模型测试 (reviewRules.test.js)

* 验证中文规则配置正确
* 验证英文规则配置正确
* 测试中英文规则对应关系

#### API集成测试 (api.test.js)

* 测试获取规则API
* 测试应用检查API（不同场景）
* 测试文件上传处理

### 客户端测试

#### 表单组件测试 (AppReviewForm.test.js)

* 测试表单渲染和字段验证
* 测试表单提交和结果显示
* 测试错误处理
* 测试中英文切换

### 端到端测试

#### 完整流程测试 (uploadFlow.test.js)

* 测试完整表单提交和审核流程
* 测试表单验证错误处理
* 测试文件上传
* 测试语言切换
* 测试错误状态处理

## 自定义测试

### 创建自定义测试用例

您可以通过以下方式创建新的测试：

1. **服务器端测试**：在`server/tests/`目录下创建新的测试文件
2. **客户端测试**：在`client/src/tests/`目录下创建新的测试文件
3. **端到端测试**：在`tests/e2e/`目录下创建新的测试文件

### 模拟IPA文件

为了测试文件上传功能，您可以：

1. 创建一个zip文件并重命名为`.ipa`后缀
2. 或者使用任何文件并重命名为`.ipa`后缀

例如：
```bash
# 创建一个测试IPA文件
zip -r test.zip README.md
mv test.zip tests/fixtures/test-app.ipa
```

## 故障排除

常见问题及解决方案：

### 测试超时
如果集成测试或端到端测试超时，可以调整测试文件中的超时设置，例如：
```javascript
// 增加超时时间到20秒
cy.contains('Review Results', { timeout: 20000 }).should('be.visible');
```

### 找不到元素
可能是页面结构或CSS选择器发生变化，需要更新测试用例中的选择器：
```javascript
// 更新选择器
// 旧: cy.get('.submit-button')
// 新: cy.contains('Start Review')
```

## 持续集成

本项目支持通过CI/CD系统自动运行测试，配置文件位于项目根目录。

---

如有任何问题，请联系项目维护者。 