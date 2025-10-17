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
    id: 'training-management',
    name: '培训需求与培训管理',
    description: '专为教师培训需求分析和培训管理设计的智能体',
    category: 'training',
    sourceTypes: ['文档', '视频', '链接'],
    smartTools: ['AI总结', '知识图谱', '学习路径规划'],
    usageCount: 156,
    createdAt: '2024-01-15',
    icon: <TeamOutlined />,
    color: '#1890ff'
  },
  {
    id: 'personal-organization',
    name: '个人组织培训',
    description: '个人组织和参与培训活动的管理智能体',
    category: 'organization',
    sourceTypes: ['文档', '表格', '视频'],
    smartTools: ['进度跟踪', '效果评估', '反馈收集'],
    usageCount: 89,
    createdAt: '2024-01-20',
    icon: <UserOutlined />,
    color: '#52c41a'
  },
  {
    id: 'personal-work',
    name: '个人工作管理',
    description: '教师个人工作任务和项目管理智能体',
    category: 'work',
    sourceTypes: ['文档', '表格', '链接', '图片'],
    smartTools: ['任务规划', '时间管理', '工作总结'],
    usageCount: 234,
    createdAt: '2024-01-10',
    icon: <SettingOutlined />,
    color: '#722ed1'
  },
  {
    id: 'personal-study',
    name: '个人学习提升',
    description: '教师个人专业发展和学习提升智能体',
    category: 'study',
    sourceTypes: ['文档', '视频', '链接', '音频'],
    smartTools: ['学习笔记', '知识整理', '复习提醒'],
    usageCount: 178,
    createdAt: '2024-01-25',
    icon: <BookOutlined />,
    color: '#fa8c16'
  },
  {
    id: 'comprehensive-development',
    name: '教师综合能力发展',
    description: '教师综合素质和能力全面发展智能体',
    category: 'comprehensive',
    sourceTypes: ['文档', '视频', '链接', '表格', '图片'],
    smartTools: ['能力评估', '发展规划', '成长记录', '反思总结'],
    usageCount: 145,
    createdAt: '2024-01-30',
    icon: <BulbOutlined />,
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