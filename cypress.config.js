const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // 实现节点事件监听器和任务在此处
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'tests/e2e/**/*.test.js',
    supportFile: 'tests/e2e/support/e2e.js',
    fixturesFolder: 'tests/fixtures',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 8000,
    videoUploadOnPasses: false,
  },
  env: {
    API_URL: 'http://localhost:5001',
  },
}); 