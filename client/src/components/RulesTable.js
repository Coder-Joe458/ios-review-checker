import React, { useState, useEffect } from 'react';
import { Table, Input, Tag, Spin, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { API_BASE_URL } from '../config';

const { Search } = Input;

const RulesTable = () => {
  const { t, language } = useLanguage();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  
  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      console.log('开始获取审核规则...');
      try {
        console.log('发送请求到:', `${API_BASE_URL}/api/rules?lang=${language}`);
        const response = await axios.get(`${API_BASE_URL}/api/rules?lang=${language}`);
        console.log('收到审核规则响应:', response.data);
        setRules(response.data);
        setError(null);
      } catch (err) {
        console.error('获取审核规则时出错:', err);
        console.error('错误详情:', err.response ? err.response.data : '无响应数据');
        console.error('错误状态:', err.response ? err.response.status : '无状态码');
        setError(t('errorLoadingRules'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchRules();
  }, [language, t]);
  
  const handleSearch = value => {
    setSearchText(value);
  };
  
  const filteredRules = rules.filter(rule => 
    rule.rule.toLowerCase().includes(searchText.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchText.toLowerCase()) ||
    rule.category.toLowerCase().includes(searchText.toLowerCase())
  );
  
  const columns = [
    {
      title: t('columnCategory'),
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={
          category === '隐私' ? 'blue' : 
          category === '用户界面' ? 'cyan' : 
          category === '功能' ? 'green' : 
          category === '内容' ? 'purple' : 
          category === '安全' ? 'red' : 'default'
        }>
          {category}
        </Tag>
      ),
    },
    {
      title: t('columnRule'),
      dataIndex: 'rule',
      key: 'rule',
    },
    {
      title: t('columnDescription'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('columnCheckMethod'),
      dataIndex: 'checkMethod',
      key: 'checkMethod',
    },
  ];
  
  if (loading) {
    return <Spin tip={t('loadingRules')} />;
  }
  
  if (error) {
    return <Alert message="错误" description={error} type="error" showIcon />;
  }
  
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder={t('searchPlaceholder')}
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ maxWidth: 400 }}
        />
      </div>
      <Table 
        columns={columns} 
        dataSource={filteredRules} 
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default RulesTable; 