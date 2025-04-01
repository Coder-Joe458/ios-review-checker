import React from 'react';
import { Layout, Typography, Button } from 'antd';
import './App.css';
import AppReviewForm from './components/AppReviewForm';
import RulesTable from './components/RulesTable';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

// 主应用组件
function MainApp() {
  const { t, toggleLanguage, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <Layout className="layout">
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', background: '#1890ff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="logo" />
            <Title level={3} style={{ margin: '0 16px', color: 'white' }}>{t('siteTitle')}</Title>
          </div>
          <Button 
            type="primary" 
            ghost 
            onClick={toggleLanguage}
            style={{ border: '1px solid white', color: 'white' }}
            icon={language === 'zh' ? <span>EN</span> : <span>中</span>}
          >
            {t('languageSwitch')}
          </Button>
        </div>
      </Header>
      <Content style={{ padding: '0 50px', background: '#f5f5f5' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '30px 0' }}>
          <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 380, borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>{t('headerTitle')}</Typography.Title>
            <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 30, color: '#666' }}>
              {t('siteDescription')}
            </Paragraph>
            
            <AppReviewForm />
            
            <div style={{ marginTop: 40 }}>
              <Typography.Title level={3} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>{t('rulesTitle')}</Typography.Title>
              <RulesTable />
            </div>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#001529', color: 'rgba(255,255,255,0.65)', padding: '24px 50px' }}>{t('copyright', { year: currentYear })}</Footer>
    </Layout>
  );
}

// 包装应用于语言提供者
function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

export default App;
