import React, { useState, useEffect } from 'react';
import {
  Modal,
  Card,
  Row,
  Col,
  Button,
  Typography,
  Tag,
  Empty,
  Spin,
  message
} from 'antd';
import {
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  BulbOutlined,
  SettingOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { getAvailableTemplates, updateTemplateUsage } from '../services/templateService';
import './ThemeTemplateSelector.css';

const { Title, Text } = Typography;

// 默认主题模版数据（与ThemeTemplateCenter保持一致）
const defaultTemplates = [
  {
    id: 'teaching-research',
    name: '教研智能体',
    description: '面向教学与教研场景的通用智能体',
    category: 'teaching_research',
    sourceTypes: ['文档', '视频', '链接'],
    smartTools: ['教学方案', '知识图谱', '智能写作'],
    usageCount: 156,
    createdAt: '2024-01-15',
    icon: <BookOutlined />,
    color: '#1890ff'
  },
  {
    id: 'class-teacher',
    name: '班主任智能体',
    description: '面向班级管理与家校沟通的班主任辅助智能体',
    category: 'class_management',
    sourceTypes: ['文档', '表格', '链接'],
    smartTools: ['班级管理', '阅卷工具', '教学助手'],
    usageCount: 120,
    createdAt: '2024-01-20',
    icon: <TeamOutlined />,
    color: '#52c41a'
  },
  {
    id: 'counselor',
    name: '辅导员智能体',
    description: '面向学生思想政治与事务管理的辅导员智能体',
    category: 'student_affairs',
    sourceTypes: ['文档', '链接', '音频'],
    smartTools: ['学生关怀', '智能写作', '效率提升'],
    usageCount: 234,
    createdAt: '2024-01-10',
    icon: <UserOutlined />,
    color: '#722ed1'
  },
  {
    id: 'supervisor',
    name: '督学智能体',
    description: '面向督导评估与质量监测的督学智能体',
    category: 'supervision',
    sourceTypes: ['文档', '链接', '表格'],
    smartTools: ['督导评估', '数据分析', '效率提升'],
    usageCount: 178,
    createdAt: '2024-01-25',
    icon: <SettingOutlined />,
    color: '#fa8c16'
  },
  {
    id: 'principal',
    name: '校长智能体',
    description: '面向学校治理与决策支持的校长智能体',
    category: 'governance',
    sourceTypes: ['文档', '视频', '链接'],
    smartTools: ['决策支持', '数据分析', '智能写作'],
    usageCount: 145,
    createdAt: '2024-01-30',
    icon: <BulbOutlined />,
    color: '#eb2f96'
  },
  {
    id: 'scientific-research',
    name: '科研智能体',
    description: '面向课题研究与成果管理的科研智能体',
    category: 'scientific_research',
    sourceTypes: ['文档', '链接', '图片'],
    smartTools: ['科研助手', '数据分析', '知识图谱'],
    usageCount: 198,
    createdAt: '2024-02-05',
    icon: <BookOutlined />,
    color: '#eb2f96'
  }
];

const ThemeTemplateSelector = ({ visible, onCancel, onSelect }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // 加载模版数据
  useEffect(() => {
    if (visible) {
      loadTemplates();
    }
  }, [visible]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const result = await getAvailableTemplates();
      if (result.success) {
        setTemplates(result.data);
      } else {
        message.error(result.message || '获取智能体列表失败');
        setTemplates([]);
      }
    } catch (error) {
      console.error('加载智能体失败:', error);
      message.error('加载智能体失败');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadTemplates();
    }
  }, [visible]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleConfirm = async () => {
    if (!selectedTemplate) {
      message.warning('请选择一个智能体');
      return;
    }
    
    try {
      // 更新智能体使用次数
      await updateTemplateUsage(selectedTemplate.id);
      onSelect(selectedTemplate);
    } catch (error) {
      console.error('更新智能体使用次数失败:', error);
      // 即使更新失败，也继续选择
      onSelect(selectedTemplate);
    }
    setSelectedTemplate(null);
  };

  const handleCancel = () => {
    setSelectedTemplate(null);
    onCancel();
  };

  const renderTemplateCard = (template) => (
    <Col xs={24} sm={12} md={8} key={template.id}>
      <Card
        hoverable
        className={`template-selector-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
        onClick={() => handleTemplateSelect(template)}
        style={{
          marginBottom: '16px',
          border: selectedTemplate?.id === template.id ? `2px solid ${template.color}` : '1px solid #d9d9d9',
          position: 'relative'
        }}
      >
        {selectedTemplate?.id === template.id && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: template.color,
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}>
            <CheckOutlined style={{ color: 'white', fontSize: '12px' }} />
          </div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ 
            color: template.color, 
            fontSize: '24px', 
            marginRight: '12px',
            display: 'flex',
            alignItems: 'center'
          }}>
            {template.icon}
          </div>
          <div>
            <Title level={5} style={{ margin: 0, fontSize: '16px' }}>
              {template.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              使用次数: {template.usageCount}
            </Text>
          </div>
        </div>

        <Text style={{ 
          fontSize: '13px', 
          color: '#666',
          display: 'block',
          marginBottom: '12px',
          lineHeight: '1.4'
        }}>
          {template.description}
        </Text>

        <div style={{ marginBottom: '8px' }}>
          <Text strong style={{ fontSize: '12px', color: '#333' }}>来源类型：</Text>
          <div style={{ marginTop: '4px' }}>
            {template.sourceTypes.map(type => (
              <Tag key={type} size="small" style={{ fontSize: '11px' }}>
                {type}
              </Tag>
            ))}
          </div>
        </div>

        <div>
          <Text strong style={{ fontSize: '12px', color: '#333' }}>智能工具：</Text>
          <div style={{ marginTop: '4px' }}>
            {template.smartTools.map(tool => (
              <Tag key={tool} color="blue" size="small" style={{ fontSize: '11px' }}>
                {tool}
              </Tag>
            ))}
          </div>
        </div>
      </Card>
    </Col>
  );

  return (
    <Modal
      title="选择智能体"
      open={visible}
      onCancel={handleCancel}
      onOk={handleConfirm}
      width={900}
      okText="确认选择"
      cancelText="取消"
      okButtonProps={{ disabled: !selectedTemplate }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Text type="secondary">
          选择一个智能体来快速初始化对应的来源类型和智能工具，提高您的工作效率。
        </Text>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large">
            <div style={{ marginTop: 8 }}>加载智能体中...</div>
          </Spin>
        </div>
      ) : templates.length === 0 ? (
        <Empty
          description="暂无可用智能体"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {templates.map(renderTemplateCard)}
        </Row>
      )}
    </Modal>
  );
};

export default ThemeTemplateSelector;