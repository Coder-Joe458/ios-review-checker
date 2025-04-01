// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'

// Cypress文件上传插件
import 'cypress-file-upload';

// 添加自定义命令
Cypress.Commands.add('loginIfRequired', () => {
  // 如果项目添加了登录功能，可在此处实现登录逻辑
});

// 在每个测试之前清理状态
beforeEach(() => {
  // 清理可能的缓存状态
  cy.window().then((win) => {
    win.sessionStorage.clear();
    win.localStorage.clear();
  });
}); 