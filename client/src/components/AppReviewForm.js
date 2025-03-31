import React, { useState } from 'react';
import { Form, Input, Button, Upload, Checkbox, Card, Row, Col, Alert, Spin, Steps, Collapse, Tag, List, Typography, Progress, Divider } from 'antd';
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { API_BASE_URL } from '../config';

const { Panel } = Collapse;
const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;

const AppReviewForm = () => {
  const { t, language } = useLanguage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const onFinish = async (values) => {
    setLoading(true);
    setCurrentStep(1);
    
    try {
      // 在实际项目中，此处应上传IPA文件并从中读取信息
      // 此处我们模拟这个过程，直接发送表单信息
      
      const formData = new FormData();
      if (values.ipaFile && values.ipaFile.fileList && values.ipaFile.fileList.length > 0) {
        formData.append('ipaFile', values.ipaFile.fileList[0].originFileObj);
      }
      
      // 添加表单中的其他信息
      formData.append('name', values.appName);
      formData.append('privacyPolicy', values.hasPrivacyPolicy);
      formData.append('usesHttps', values.usesHttps);
      
      // 添加权限信息
      const permissions = [];
      if (values.usesCamera) permissions.push({ name: 'camera', description: values.cameraDescription });
      if (values.usesLocation) permissions.push({ name: 'location', description: values.locationDescription });
      if (values.usesMicrophone) permissions.push({ name: 'microphone', description: values.microphoneDescription });
      
      formData.append('permissions', JSON.stringify(permissions));
      
      console.log('发送请求到:', `${API_BASE_URL}/api/check?lang=${language}`);
      const response = await axios.post(`${API_BASE_URL}/api/check?lang=${language}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('收到审核结果响应:', response.data);
      setReviewResult(response.data);
      setCurrentStep(2);
    } catch (error) {
      console.error('应用审核过程中出错:', error);
      console.error('错误详情:', error.response ? error.response.data : '无响应数据');
      console.error('错误状态:', error.response ? error.response.status : '无状态码');
      // 在UI中显示错误
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'medium':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'low':
        return <InfoCircleOutlined style={{ color: '#52c41a' }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'high':
        return t('highSeverity');
      case 'medium':
        return t('mediumSeverity');
      case 'low':
        return t('lowSeverity');
      default:
        return '';
    }
  };

  const renderReviewResult = () => {
    if (!reviewResult) return null;
    
    const { appName, issues, recommendations, passedRules, totalRules } = reviewResult;
    const passRate = Math.round((passedRules / totalRules) * 100);
    
    return (
      <Card className="result-card">
        <Title level={4}>{t('resultTitle')}: {appName}</Title>
        
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Progress 
              percent={passRate} 
              status={passRate < 70 ? "exception" : "success"} 
              strokeWidth={15}
              format={percent => (
                <span style={{ fontSize: 16 }}>
                  {t('passRate')}: {percent}%
                </span>
              )}
            />
            <div style={{ marginTop: 8, textAlign: 'center' }}>
              <Text>{t('passedRules', { passed: passedRules, total: totalRules })}</Text>
            </div>
          </Col>
        </Row>
        
        {issues.length > 0 && (
          <>
            <Divider orientation="left">{t('issuesFound')}</Divider>
            <Collapse defaultActiveKey={issues.map((_, index) => index.toString())}>
              {issues.map((issue, index) => (
                <Panel 
                  key={index.toString()} 
                  header={
                    <span>
                      {getSeverityIcon(issue.severity)} {issue.message} 
                      <Tag color={issue.severity === 'high' ? 'red' : issue.severity === 'medium' ? 'orange' : 'green'} style={{ marginLeft: 8 }}>
                        {getSeverityText(issue.severity)}
                      </Tag>
                    </span>
                  }
                  className={`issue-card issue-${issue.severity}`}
                >
                  <Paragraph>{issue.details}</Paragraph>
                </Panel>
              ))}
            </Collapse>
          </>
        )}
        
        {recommendations.length > 0 && (
          <>
            <Divider orientation="left">{t('recommendations')}</Divider>
            <List
              bordered
              dataSource={recommendations}
              renderItem={(item, index) => (
                <List.Item className="recommendation-item">
                  <List.Item.Meta
                    avatar={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
                    title={t('recommendation', { index: index + 1 })}
                    description={item}
                  />
                </List.Item>
              )}
            />
          </>
        )}
        
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button type="primary" onClick={() => { setReviewResult(null); setCurrentStep(0); form.resetFields(); }}>
            {t('newReviewButton')}
          </Button>
        </div>
      </Card>
    );
  };

  const renderFormFields = () => (
    <Card>
      <Form
        form={form}
        layout="vertical"
        name="appReviewForm"
        onFinish={onFinish}
        initialValues={{
          hasPrivacyPolicy: false,
          usesHttps: false,
          usesCamera: false,
          usesLocation: false,
          usesMicrophone: false,
        }}
      >
        <Title level={4}>{t('basicInfo')}</Title>
        <Form.Item
          name="appName"
          label={t('appName')}
          rules={[{ required: true, message: t('appNameRequired') }]}
        >
          <Input placeholder={t('appNamePlaceholder')} />
        </Form.Item>
        
        <Form.Item
          name="ipaFile"
          label={t('uploadIPA')}
        >
          <Upload.Dragger name="ipaFile" multiple={false} beforeUpload={() => false} className="upload-area">
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">{t('uploadDragText')}</p>
            <p className="ant-upload-hint">{t('uploadHint')}</p>
          </Upload.Dragger>
        </Form.Item>
        
        <Title level={4} style={{ marginTop: 24 }}>{t('privacySecurity')}</Title>
        <Form.Item name="hasPrivacyPolicy" valuePropName="checked">
          <Checkbox>{t('hasPrivacyPolicy')}</Checkbox>
        </Form.Item>
        
        <Form.Item name="usesHttps" valuePropName="checked">
          <Checkbox>{t('usesHttps')}</Checkbox>
        </Form.Item>
        
        <Title level={4} style={{ marginTop: 24 }}>{t('permissions')}</Title>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="usesCamera" valuePropName="checked">
              <Checkbox>{t('usesCamera')}</Checkbox>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="cameraDescription"
              label={t('cameraDescription')}
              dependencies={['usesCamera']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue('usesCamera') || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('cameraMissing')));
                  },
                }),
              ]}
            >
              <Input placeholder={t('cameraPlaceholder')} />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="usesLocation" valuePropName="checked">
              <Checkbox>{t('usesLocation')}</Checkbox>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="locationDescription"
              label={t('locationDescription')}
              dependencies={['usesLocation']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue('usesLocation') || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('locationMissing')));
                  },
                }),
              ]}
            >
              <Input placeholder={t('locationPlaceholder')} />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="usesMicrophone" valuePropName="checked">
              <Checkbox>{t('usesMicrophone')}</Checkbox>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="microphoneDescription"
              label={t('microphoneDescription')}
              dependencies={['usesMicrophone']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue('usesMicrophone') || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('microphoneMissing')));
                  },
                }),
              ]}
            >
              <Input placeholder={t('microphonePlaceholder')} />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" loading={loading} size="large" block>
            {t('submitButton')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  return (
    <div>
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title={t('step1')} description={t('step1Description')} />
        <Step title={t('step2')} description={t('step2Description')} />
        <Step title={t('step3')} description={t('step3Description')} />
      </Steps>
      
      <Spin spinning={loading} tip={t('loadingTip')}>
        {currentStep === 0 && renderFormFields()}
        {currentStep === 2 && renderReviewResult()}
      </Spin>
    </div>
  );
};

export default AppReviewForm; 