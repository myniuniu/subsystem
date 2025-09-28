import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Tag,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  message,
  Popconfirm,
  Tooltip,
  Badge
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
  SettingOutlined,
  FileTextOutlined,
  BulbOutlined
} from '@ant-design/icons';
import './ThemeTemplateCenter.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// 来源类型配置
const SOURCE_TYPES = [
  { value: 'knowledge-graph', label: '知识图谱', icon: '🧠', color: '#722ed1' },
  { value: 'course-videos', label: '课程视频', icon: '📹', color: '#1890ff' },
  { value: 'capability-model', label: '能力模型', icon: '🎯', color: '#52c41a' },
  { value: 'live-courses', label: '直播课', icon: '📺', color: '#fa8c16' },
  { value: 'uploaded-files', label: '上传文件', icon: '📄', color: '#13c2c2' },
  { value: 'links', label: '链接资源', icon: '🔗', color: '#eb2f96' },
  { value: 'added-texts', label: '添加文本', icon: '📝', color: '#f759ab' },
  { value: 'organizational-courses', label: '组织课程', icon: '🏢', color: '#722ed1' }
];

// 智能工具配置
const SMART_TOOLS = [
  { value: 'knowledge-graph-tool', label: '知识图谱', icon: '🧠', color: '#722ed1' },
  { value: 'grading-assistant', label: '阅卷工具', icon: '📝', color: '#c41d7f' },
  { value: 'ppt-overview', label: 'PPT概览', icon: '📊', color: '#fa8c16' },
  { value: 'smart-writer', label: '智能写作', icon: '✍️', color: '#52c41a' },
  { value: 'data-analyst', label: '数据分析', icon: '📈', color: '#722ed1' },
  { value: 'teaching-assistant', label: '教学助手', icon: '🎓', color: '#fa8c16' },
  { value: 'research-helper', label: '研究助手', icon: '🔬', color: '#f5222d' },
  { value: 'efficiency-master', label: '效率大师', icon: '⚡', color: '#13c2c2' }
];

const ThemeTemplateCenter = ({ onBack }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [form] = Form.useForm();

  // 初始化模版数据
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    setLoading(true);
    // 从localStorage加载模版数据
    const savedTemplates = JSON.parse(localStorage.getItem('theme-templates') || '[]');
    
    // 如果没有数据，创建一些示例模版
    if (savedTemplates.length === 0) {
      const defaultTemplates = [
        {
          id: 'template-1',
          name: '基础教学模版',
          description: '适用于基础教学场景的通用模版',
          sourceTypes: ['course-videos', 'uploaded-files', 'added-texts'],
          smartTools: ['knowledge-graph-tool', 'ppt-overview', 'smart-writer'],
          createTime: '2024-01-15 10:00:00',
          updateTime: '2024-01-15 10:00:00',
          creator: '系统管理员',
          usageCount: 15
        },
        {
          id: 'template-2',
          name: '研究分析模版',
          description: '专为学术研究和数据分析设计的模版',
          sourceTypes: ['knowledge-graph', 'links', 'uploaded-files'],
          smartTools: ['data-analyst', 'research-helper', 'smart-writer'],
          createTime: '2024-01-14 15:30:00',
          updateTime: '2024-01-16 09:20:00',
          creator: '张教授',
          usageCount: 8
        }
      ];
      localStorage.setItem('theme-templates', JSON.stringify(defaultTemplates));
      setTemplates(defaultTemplates);
    } else {
      setTemplates(savedTemplates);
    }
    setLoading(false);
  };

  const saveTemplates = (newTemplates) => {
    localStorage.setItem('theme-templates', JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    form.setFieldsValue({
      name: template.name,
      description: template.description,
      sourceTypes: template.sourceTypes,
      smartTools: template.smartTools
    });
    setModalVisible(true);
  };

  const handleDelete = (templateId) => {
    const newTemplates = templates.filter(t => t.id !== templateId);
    saveTemplates(newTemplates);
    message.success('模版删除成功');
  };

  const handleCopy = (template) => {
    const newTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} - 副本`,
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString(),
      usageCount: 0
    };
    const newTemplates = [...templates, newTemplate];
    saveTemplates(newTemplates);
    message.success('模版复制成功');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const now = new Date().toLocaleString();
      
      if (editingTemplate) {
        // 编辑模式
        const newTemplates = templates.map(t => 
          t.id === editingTemplate.id 
            ? { ...t, ...values, updateTime: now }
            : t
        );
        saveTemplates(newTemplates);
        message.success('模版更新成功');
      } else {
        // 创建模式
        const newTemplate = {
          id: `template-${Date.now()}`,
          ...values,
          createTime: now,
          updateTime: now,
          creator: '当前用户',
          usageCount: 0
        };
        const newTemplates = [...templates, newTemplate];
        saveTemplates(newTemplates);
        message.success('模版创建成功');
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const getSourceTypeTag = (type) => {
    const config = SOURCE_TYPES.find(s => s.value === type);
    return config ? (
      <Tag color={config.color} key={type}>
        {config.icon} {config.label}
      </Tag>
    ) : <Tag key={type}>{type}</Tag>;
  };

  const getSmartToolTag = (tool) => {
    const config = SMART_TOOLS.find(t => t.value === tool);
    return config ? (
      <Tag color={config.color} key={tool}>
        {config.icon} {config.label}
      </Tag>
    ) : <Tag key={tool}>{tool}</Tag>;
  };

  const columns = [
    {
      title: '模版名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </div>
      )
    },
    {
      title: '来源类型',
      dataIndex: 'sourceTypes',
      key: 'sourceTypes',
      width: 300,
      render: (types) => (
        <div style={{ maxWidth: '280px' }}>
          {types.map(type => getSourceTypeTag(type))}
        </div>
      )
    },
    {
      title: '智能工具',
      dataIndex: 'smartTools',
      key: 'smartTools',
      width: 300,
      render: (tools) => (
        <div style={{ maxWidth: '280px' }}>
          {tools.map(tool => getSmartToolTag(tool))}
        </div>
      )
    },
    {
      title: '使用次数',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 100,
      render: (count) => <Badge count={count} showZero color="#52c41a" />
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      render: (time) => <Text type="secondary">{time}</Text>
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="复制">
            <Button 
              type="text" 
              icon={<CopyOutlined />} 
              size="small"
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个模版吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                size="small"
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ height: '100%', background: '#f5f7fa' }}>
      <div style={{ padding: '24px', height: '100%', overflow: 'auto' }}>
        {/* 页面头部 */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <SettingOutlined style={{ color: '#1890ff' }} />
              主题模版管理
            </Title>
            <Text type="secondary" style={{ marginTop: '8px', display: 'block' }}>
              管理和配置小黑屋的主题模版，组合不同的来源类型和智能工具
            </Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={handleCreate}
          >
            创建模版
          </Button>
        </div>

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  📋
                </div>
                <div>
                  <Text type="secondary">总模版数</Text>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {templates.length}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  📊
                </div>
                <div>
                  <Text type="secondary">来源类型</Text>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {SOURCE_TYPES.length}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🛠️
                </div>
                <div>
                  <Text type="secondary">智能工具</Text>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                    {SMART_TOOLS.length}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  📈
                </div>
                <div>
                  <Text type="secondary">总使用次数</Text>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                    {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 模版列表 */}
        <Card>
          <Table
            columns={columns}
            dataSource={templates}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 个模版`
            }}
          />
        </Card>

        {/* 创建/编辑模版弹窗 */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BulbOutlined style={{ color: '#1890ff' }} />
              {editingTemplate ? '编辑模版' : '创建模版'}
            </div>
          }
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSubmit}
          width={800}
          okText="保存"
          cancelText="取消"
        >
          <Form
            form={form}
            layout="vertical"
            style={{ marginTop: '20px' }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="模版名称"
                  rules={[{ required: true, message: '请输入模版名称' }]}
                >
                  <Input placeholder="请输入模版名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="description"
                  label="模版描述"
                  rules={[{ required: true, message: '请输入模版描述' }]}
                >
                  <Input placeholder="请输入模版描述" />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">来源类型配置</Divider>
            <Form.Item
              name="sourceTypes"
              label="选择来源类型（多选）"
              rules={[{ required: true, message: '请至少选择一个来源类型' }]}
            >
              <Checkbox.Group style={{ width: '100%' }}>
                <Row gutter={[16, 16]}>
                  {SOURCE_TYPES.map(source => (
                    <Col span={8} key={source.value}>
                      <Checkbox value={source.value}>
                        <Tag color={source.color} style={{ margin: 0 }}>
                          {source.icon} {source.label}
                        </Tag>
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>

            <Divider orientation="left">智能工具配置</Divider>
            <Form.Item
              name="smartTools"
              label="选择智能工具（多选）"
              rules={[{ required: true, message: '请至少选择一个智能工具' }]}
            >
              <Checkbox.Group style={{ width: '100%' }}>
                <Row gutter={[16, 16]}>
                  {SMART_TOOLS.map(tool => (
                    <Col span={8} key={tool.value}>
                      <Checkbox value={tool.value}>
                        <Tag color={tool.color} style={{ margin: 0 }}>
                          {tool.icon} {tool.label}
                        </Tag>
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default ThemeTemplateCenter;