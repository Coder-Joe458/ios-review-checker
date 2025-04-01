import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from '../translations';

// 创建语言上下文
const LanguageContext = createContext();

// 检测浏览器语言
const detectBrowserLanguage = () => {
  // 获取浏览器语言
  const browserLang = navigator.language || navigator.userLanguage;
  
  // 检查浏览器语言是否为中文
  const isChinese = /^zh\b/.test(browserLang);
  
  // 如果是中文返回'zh'，否则返回'en'
  return isChinese ? 'zh' : 'en';
};

// 语言提供者组件
export const LanguageProvider = ({ children }) => {
  // 获取保存的语言或检测浏览器语言
  const [language, setLanguage] = useState(() => {
    // 首先检查本地存储中是否有保存的语言偏好
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      return savedLanguage;
    }
    
    // 如果没有保存的偏好，则检测浏览器语言
    return detectBrowserLanguage();
  });

  // 当前使用的翻译
  const [currentTranslations, setCurrentTranslations] = useState(translations[language]);

  // 切换语言的函数
  const toggleLanguage = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLanguage);
  };

  // 当语言变化时，更新翻译和保存到localStorage
  useEffect(() => {
    setCurrentTranslations(translations[language]);
    localStorage.setItem('language', language);
  }, [language]);

  // 提供t函数用于翻译
  const t = (key, params = {}) => {
    let text = currentTranslations[key] || key;
    
    // 替换参数，例如 {year} 替换为实际年份
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 自定义Hook来使用语言上下文
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext; 