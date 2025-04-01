/**
 * Application Configuration
 */

// API configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Feature flags
export const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true' || false;

// Application settings
export const APP_CONFIG = {
  maxUploadSize: 100 * 1024 * 1024, // 100MB
  supportedFileTypes: ['.ipa'],
  defaultLanguage: 'en',
  availableLanguages: ['en', 'zh'],
};

export default {
  API_BASE_URL,
  USE_MOCK_API,
  APP_CONFIG,
}; 