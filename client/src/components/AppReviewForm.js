import React, { useState } from 'react';
import { Form, Input, Button, Upload, Checkbox, Card, Row, Col, Alert, Spin, Steps, Collapse, Tag, List, Typography, Progress, Divider, Descriptions, Table } from 'antd';
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, InfoCircleOutlined, AppleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { API_BASE_URL, USE_MOCK_API } from '../config';
import mockReviewApi from '../mocks/serverMock';

const { Panel } = Collapse;
const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;

const AppReviewForm = () => {
  const { t, language } = useLanguage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    setCurrentStep(1);
    setError(null);
    
    try {
      console.log('Form values:', values);
      
      const formData = new FormData();
      // 处理文件上传
      if (values.ipaFile && values.ipaFile.length > 0 && values.ipaFile[0].originFileObj) {
        const file = values.ipaFile[0].originFileObj;
        console.log('IPA File found in form values:', file);
        console.log('File name:', file.name);
        console.log('File size:', file.size);
        console.log('File type:', file.type);
        formData.append('ipaFile', file);
        console.log('IPA File appended to FormData');
      } else {
        console.log('No IPA file provided in the form submission');
      }
      
      // 添加表单中的其他信息
      formData.append('name', values.appName || '');
      formData.append('hasPrivacyPolicy', values.hasPrivacyPolicy || false);
      formData.append('usesHttps', values.usesHttps || false);
      
      // 添加权限信息
      const permissions = [];
      if (values.usesCamera) permissions.push({ name: 'camera', description: values.cameraDescription });
      if (values.usesLocation) permissions.push({ name: 'location', description: values.locationDescription });
      if (values.usesMicrophone) permissions.push({ name: 'microphone', description: values.microphoneDescription });
      
      formData.append('permissions', JSON.stringify(permissions));
      console.log('Form data prepared:', {
        appName: values.appName,
        hasPrivacyPolicy: values.hasPrivacyPolicy,
        usesHttps: values.usesHttps,
        permissions: permissions
      });
      
      let response;
      if (USE_MOCK_API) {
        console.log('Using mock API for review');
        // Use mock API for testing
        const mockResult = await mockReviewApi(formData, language);
        response = { data: mockResult };
        console.log('Received mock review response:', response.data);
      } else {
        // Use real API
        console.log('发送请求到:', `${API_BASE_URL}/api/check?lang=${language}`);
        response = await axios.post(`${API_BASE_URL}/api/check?lang=${language}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('收到审核结果响应:', response.data);
      }
      
      setReviewResult(response.data);
      setCurrentStep(2);
    } catch (error) {
      console.error('应用审核过程中出错:', error);
      console.error('错误详情:', error.response ? error.response.data : '无响应数据');
      console.error('错误状态:', error.response ? error.response.status : '无状态码');
      
      // Set error state to display to the user
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : t('genericErrorMessage') || 'An error occurred during the review process. Please try again.';
      
      setError(errorMessage);
      setCurrentStep(0); // Go back to form step
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
    
    const { appName, issues, recommendations, passedRules, totalRules, bundleId, version, ipaInfo } = reviewResult;
    const passRate = Math.round((passedRules / totalRules) * 100);
    
    return (
      <Card className="result-card">
        <Title level={4}>{t('resultTitle')}: {appName}</Title>
        
        {ipaInfo && (
          <>
            <Divider orientation="left">
              <AppleOutlined /> {t('ipaFileInfo') || 'IPA File Information'}
            </Divider>
            <Descriptions bordered size="small" column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
              <Descriptions.Item label={t('appName') || 'App Name'}>
                {ipaInfo.name || appName}
              </Descriptions.Item>
              <Descriptions.Item label={t('bundleId') || 'Bundle ID'}>
                {ipaInfo.bundleId || bundleId}
              </Descriptions.Item>
              <Descriptions.Item label={t('version') || 'Version'}>
                {ipaInfo.version || version}
              </Descriptions.Item>
              <Descriptions.Item label={t('minOSVersion') || 'Minimum OS Version'}>
                {ipaInfo.minimumOSVersion || '-'}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
        
        <Row gutter={16} style={{ marginTop: 24, marginBottom: 24 }}>
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
    <Card className="form-container">
      {error && (
        <Alert
          message={t('errorTitle') || "Error"}
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 24 }}
        />
      )}
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
        <div className="form-section">
          <Title level={4} className="form-title">{t('basicInfo')}</Title>
          <Form.Item
            name="appName"
            label={t('appName')}
            rules={[{ required: true, message: t('appNameRequired') }]}
          >
            <Input placeholder={t('appNamePlaceholder')} size="large" />
          </Form.Item>
          
          <Form.Item
            name="ipaFile"
            label={t('uploadIPA')}
            className="upload-container"
            valuePropName="fileList"
            getValueFromEvent={e => {
              console.log('Upload getValueFromEvent:', e?.fileList);
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <div className="upload-area">
              <Upload.Dragger 
                name="ipaFile" 
                multiple={false} 
                accept=".ipa"
                listType="picture"
                beforeUpload={(file) => {
                  console.log('File selected for upload:', file.name);
                  console.log('File type:', file.type);
                  console.log('File size:', file.size);
                  return false; // 阻止自动上传
                }}
                onChange={(info) => {
                  console.log('Upload onChange event triggered');
                  console.log('File list length:', info.fileList.length);
                  
                  // 更新文件状态以显示在UI上
                  const fileList = [...info.fileList];
                  fileList.forEach(file => {
                    if (file.status === undefined) {
                      file.status = 'done';
                    }
                  });
                  
                  // 只保留最后一个文件
                  const latestFileList = fileList.slice(-1);
                  form.setFieldsValue({ ipaFile: latestFileList });
                  
                  if (latestFileList.length > 0) {
                    console.log('File status:', latestFileList[0].status);
                    if (latestFileList[0].originFileObj) {
                      console.log('originFileObj exists');
                    }
                  }
                }}
                style={{ background: 'transparent', border: 'none' }}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: 40, color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text">{t('uploadDragText')}</p>
                <p className="ant-upload-hint">{t('uploadHint')}</p>
              </Upload.Dragger>
            </div>
          </Form.Item>
        </div>
        
        <div className="form-section">
          <Title level={4} className="form-title">{t('privacySecurity')}</Title>
          <Form.Item name="hasPrivacyPolicy" valuePropName="checked" className="checkbox-item">
            <Checkbox>{t('hasPrivacyPolicy')}</Checkbox>
          </Form.Item>
          
          <Form.Item name="usesHttps" valuePropName="checked" className="checkbox-item">
            <Checkbox>{t('usesHttps')}</Checkbox>
          </Form.Item>
        </div>
        
        <div className="form-section">
          <Title level={4} className="form-title">{t('permissions')}</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="usesCamera" valuePropName="checked" className="checkbox-item">
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
              <Form.Item name="usesLocation" valuePropName="checked" className="checkbox-item">
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
              <Form.Item name="usesMicrophone" valuePropName="checked" className="checkbox-item">
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
        </div>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large" className="submit-button">
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