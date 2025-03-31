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
  const { t, toggleLanguage } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <Layout className="layout">
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', background: '#1890ff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="logo" />
            <Title level={3} style={{ margin: '0 16px', color: 'white' }}>{t('siteTitle')}</Title>
          </div>
          <Button type="primary" ghost onClick={toggleLanguage}>
            {t('languageSwitch')}
          </Button>
        </div>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 380 }}>
          <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>{t('headerTitle')}</Typography.Title>
          <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 30 }}>
            {t('siteDescription')}
          </Paragraph>
          
          <AppReviewForm />
          
          <div style={{ marginTop: 50 }}>
            <Typography.Title level={3}>{t('rulesTitle')}</Typography.Title>
            <RulesTable />
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>{t('copyright', { year: currentYear })}</Footer>
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
