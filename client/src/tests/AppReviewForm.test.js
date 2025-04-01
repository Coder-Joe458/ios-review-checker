import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppReviewForm from '../components/AppReviewForm';
import { LanguageProvider } from '../contexts/LanguageContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock response for successful check
const mockSuccessResponse = {
  data: {
    success: true,
    appName: 'Test App',
    issues: [
      {
        ruleId: 1,
        severity: 'medium',
        message: 'App does not use HTTPS',
        details: 'Your app should use HTTPS for all network communications'
      }
    ],
    recommendations: [
      'Enable App Transport Security in Info.plist'
    ],
    passedRules: 4,
    totalRules: 5
  }
};

// Mock response for error
const mockErrorResponse = {
  response: {
    status: 500,
    data: { message: 'Server error' }
  }
};

describe('AppReviewForm组件测试', () => {
  beforeEach(() => {
    // 重置mock
    axios.post.mockReset();
  });

  test('应该正确渲染表单', () => {
    render(
      <LanguageProvider>
        <AppReviewForm />
      </LanguageProvider>
    );
    
    expect(screen.getByLabelText(/App Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload IPA File/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/privacy policy/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/uses HTTPS/i)).toBeInTheDocument();
  });
  
  test('应该验证必填字段', async () => {
    render(
      <LanguageProvider>
        <AppReviewForm />
      </LanguageProvider>
    );
    
    // 点击提交按钮但不填写表单
    fireEvent.click(screen.getByRole('button', { name: /start review/i }));
    
    // 等待验证消息出现
    await waitFor(() => {
      expect(screen.getByText(/please enter app name/i)).toBeInTheDocument();
    });
  });
  
  test('应该提交表单并显示结果', async () => {
    // 设置mock返回值
    axios.post.mockResolvedValueOnce(mockSuccessResponse);
    
    render(
      <LanguageProvider>
        <AppReviewForm />
      </LanguageProvider>
    );
    
    // 填写表单
    fireEvent.change(screen.getByLabelText(/App Name/i), {
      target: { value: 'Test App' }
    });
    
    // 勾选选项
    fireEvent.click(screen.getByLabelText(/privacy policy/i));
    
    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /start review/i }));
    
    // 应该显示加载状态
    expect(screen.getByText(/reviewing your app/i)).toBeInTheDocument();
    
    // 等待结果显示
    await waitFor(() => {
      expect(screen.getByText(/review results/i)).toBeInTheDocument();
      expect(screen.getByText(/Test App/i)).toBeInTheDocument();
      expect(screen.getByText(/App does not use HTTPS/i)).toBeInTheDocument();
      expect(screen.getByText(/Enable App Transport Security/i)).toBeInTheDocument();
    });
    
    // 验证API调用参数
    expect(axios.post).toHaveBeenCalledTimes(1);
    const formData = axios.post.mock.calls[0][1];
    expect(formData.get('name')).toBe('Test App');
    expect(formData.get('privacyPolicy')).toBe('true');
  });
  
  test('应该处理API错误', async () => {
    // 设置mock返回错误
    axios.post.mockRejectedValueOnce(mockErrorResponse);
    
    render(
      <LanguageProvider>
        <AppReviewForm />
      </LanguageProvider>
    );
    
    // 填写表单
    fireEvent.change(screen.getByLabelText(/App Name/i), {
      target: { value: 'Error Test App' }
    });
    
    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /start review/i }));
    
    // 等待错误消息显示
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });
  
  test('应该处理相机权限字段验证', async () => {
    render(
      <LanguageProvider>
        <AppReviewForm />
      </LanguageProvider>
    );
    
    // 填写App名称
    fireEvent.change(screen.getByLabelText(/App Name/i), {
      target: { value: 'Camera Test App' }
    });
    
    // 勾选使用相机但不填写描述
    fireEvent.click(screen.getByLabelText(/uses camera/i));
    
    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /start review/i }));
    
    // 等待验证消息出现
    await waitFor(() => {
      expect(screen.getByText(/please provide camera usage description/i)).toBeInTheDocument();
    });
    
    // 填写相机描述
    fireEvent.change(screen.getByLabelText(/camera description/i), {
      target: { value: 'Taking photos for profile' }
    });
    
    // 再次提交
    axios.post.mockResolvedValueOnce(mockSuccessResponse);
    fireEvent.click(screen.getByRole('button', { name: /start review/i }));
    
    // 应该不再显示验证错误
    await waitFor(() => {
      expect(screen.queryByText(/please provide camera usage description/i)).not.toBeInTheDocument();
    });
  });
  
  test('应该支持语言切换', async () => {
    render(
      <LanguageProvider>
        <AppReviewForm />
      </LanguageProvider>
    );
    
    // 初始应该显示英文
    expect(screen.getByLabelText(/App Name/i)).toBeInTheDocument();
    
    // 点击语言切换按钮
    fireEvent.click(screen.getByText(/Switch to/i));
    
    // 应该切换到中文
    await waitFor(() => {
      expect(screen.getByLabelText(/应用名称/i)).toBeInTheDocument();
      expect(screen.getByText(/上传IPA文件/i)).toBeInTheDocument();
    });
  });
}); 