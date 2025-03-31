import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from '../translations';

// 创建语言上下文
const LanguageContext = createContext();

// 语言提供者组件
export const LanguageProvider = ({ children }) => {
  // 获取保存的语言或默认为中文
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'zh';
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