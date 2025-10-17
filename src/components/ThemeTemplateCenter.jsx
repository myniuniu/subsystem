import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
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
  Badge,
  Empty,
  Spin
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
          name: '基础教学智能体',
          description: '适用于基础教学场景的通用智能体',
          sourceTypes: ['course-videos', 'uploaded-files', 'added-texts'],
          smartTools: ['knowledge-graph-tool', 'ppt-overview', 'smart-writer'],
          createTime: '2024-01-15 10:00:00',
          updateTime: '2024-01-15 10:00:00',
          creator: '系统管理员',
          usageCount: 15
        },
        {
          id: 'template-2',
          name: '研究分析智能体',
          description: '专为学术研究和数据分析设计的智能体',
          sourceTypes: ['knowledge-graph', 'links', 'uploaded-files'],
          smartTools: ['data-analyst', 'research-helper', 'smart-writer'],
          createTime: '2024-01-14 15:30:00',
          updateTime: '2024-01-16 09:20:00',
          creator: '张教授',
          usageCount: 8
        },
        {
          id: 'template-3',
          name: '培训需求与培训管理',
          description: '专为培训需求分析和培训项目管理设计的综合智能体',
          sourceTypes: ['organizational-courses', 'uploaded-files', 'added-texts', 'links'],
          smartTools: ['data-analyst', 'teaching-assistant', 'efficiency-master', 'smart-writer'],
          createTime: '2024-01-20 14:20:00',
          updateTime: '2024-01-20 14:20:00',
          creator: '培训部主管',
          usageCount: 12
        },
        {
          id: 'template-4',
          name: '个人组织培训',
          description: '适用于个人参与组织培训活动的学习和管理智能体',
          sourceTypes: ['organizational-courses', 'course-videos', 'live-courses', 'uploaded-files'],
          smartTools: ['knowledge-graph-tool', 'teaching-assistant', 'efficiency-master'],
          createTime: '2024-01-18 09:15:00',
          updateTime: '2024-01-18 09:15:00',
          creator: '李老师',
          usageCount: 6
        },
        {
          id: 'template-5',
          name: '个人工作管理',
          description: '教师个人工作任务管理和效率提升的专用智能体',
          sourceTypes: ['added-texts', 'uploaded-files', 'links'],
          smartTools: ['efficiency-master', 'data-analyst', 'smart-writer'],
          createTime: '2024-01-17 16:45:00',
          updateTime: '2024-01-17 16:45:00',
          creator: '王老师',
          usageCount: 9
        },
        {
          id: 'template-6',
          name: '个人学习提升',
          description: '教师个人专业发展和持续学习的综合智能体',
          sourceTypes: ['course-videos', 'knowledge-graph', 'links', 'uploaded-files'],
          smartTools: ['knowledge-graph-tool', 'research-helper', 'smart-writer', 'teaching-assistant'],
          createTime: '2024-01-16 11:30:00',
          updateTime: '2024-01-16 11:30:00',
          creator: '陈教授',
          usageCount: 14
        },
        {
          id: 'template-7',
          name: '教师综合能力发展',
          description: '涵盖教学、科研、管理等多方面的教师综合能力提升智能体',
          sourceTypes: ['knowledge-graph', 'capability-model', 'course-videos', 'organizational-courses', 'uploaded-files', 'links'],
          smartTools: ['knowledge-graph-tool', 'data-analyst', 'research-helper', 'teaching-assistant', 'efficiency-master', 'smart-writer'],
          createTime: '2024-01-19 13:10:00',
          updateTime: '2024-01-19 13:10:00',
          creator: '教务处',
          usageCount: 18
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
    message.success('智能体删除成功');
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
    message.success('智能体复制成功');
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
        message.success('智能体更新成功');
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
        message.success('智能体创建成功');
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

  // 渲染模版卡片
  const renderTemplateCard = (template) => (
    <Col xs={24} sm={12} lg={8} xl={6} key={template.id}>
      <Card
        className="template-card"
        hoverable
        style={{ 
          height: '100%',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
        actions={[
          <Tooltip title="查看详情">
            <EyeOutlined />
          </Tooltip>,
          <Tooltip title="编辑智能体">
            <EditOutlined onClick={(e) => { e.stopPropagation(); handleEdit(template); }} />
          </Tooltip>,
          <Tooltip title="复制智能体">
            <CopyOutlined onClick={(e) => { e.stopPropagation(); handleCopy(template); }} />
          </Tooltip>,
          <Popconfirm
            title="确定要删除这个智能体吗？"
            onConfirm={() => handleDelete(template.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除智能体">
              <DeleteOutlined onClick={(e) => e.stopPropagation()} />
            </Tooltip>
          </Popconfirm>
        ]}
      >
        <div className="template-card-header">
          <div className="template-icon">
            <BulbOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          </div>
          <div className="template-info">
            <Title level={5} style={{ margin: 0, fontSize: '16px' }}>
              {template.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {template.description}
            </Text>
          </div>
          <div className="template-usage">
            <Badge count={template.usageCount} showZero color="#52c41a" />
          </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div className="template-content">
          <div className="template-section">
            <Text strong style={{ fontSize: '12px', color: '#666' }}>来源类型</Text>
            <div className="template-tags" style={{ marginTop: '6px' }}>
              {template.sourceTypes.slice(0, 3).map(type => getSourceTypeTag(type))}
              {template.sourceTypes.length > 3 && (
                <Tag style={{ fontSize: '10px' }}>+{template.sourceTypes.length - 3}</Tag>
              )}
            </div>
          </div>

          <div className="template-section" style={{ marginTop: '12px' }}>
            <Text strong style={{ fontSize: '12px', color: '#666' }}>智能工具</Text>
            <div className="template-tags" style={{ marginTop: '6px' }}>
              {template.smartTools.slice(0, 3).map(tool => getSmartToolTag(tool))}
              {template.smartTools.length > 3 && (
                <Tag style={{ fontSize: '10px' }}>+{template.smartTools.length - 3}</Tag>
              )}
            </div>
          </div>
        </div>

        <div className="template-footer">
          <Text type="secondary" style={{ fontSize: '11px' }}>
            创建于 {template.createTime}
          </Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            创建者: {template.creator}
          </Text>
        </div>
      </Card>
    </Col>
  );

  return (
    <Layout style={{ height: '100%', background: '#f5f7fa' }}>
      <div style={{ padding: '24px', height: '100%', overflow: 'auto' }}>
        {/* 页面头部 */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <SettingOutlined style={{ color: '#1890ff' }} />
              智能体管理
            </Title>
            <Text type="secondary" style={{ marginTop: '8px', display: 'block' }}>
              管理和配置果仁的智能体，组合不同的来源类型和智能工具
            </Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={handleCreate}
          >
            创建智能体
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
                  <Text type="secondary">总智能体数</Text>
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
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>智能体列表</Title>
            <Text type="secondary">共 {templates.length} 个智能体</Text>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large">
                <div style={{ marginTop: 8 }}>加载中...</div>
              </Spin>
            </div>
          ) : templates.length === 0 ? (
            <Empty
              description="暂无智能体"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={handleCreate}>
                创建第一个智能体
              </Button>
            </Empty>
          ) : (
            <Row gutter={[16, 16]}>
              {templates.map(template => renderTemplateCard(template))}
            </Row>
          )}
        </Card>

        {/* 创建/编辑模版弹窗 */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BulbOutlined style={{ color: '#1890ff' }} />
              {editingTemplate ? '编辑智能体' : '创建智能体'}
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
                  label="智能体名称"
                  rules={[{ required: true, message: '请输入智能体名称' }]}
                >
                  <Input placeholder="请输入智能体名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="description"
                  label="智能体描述"
                  rules={[{ required: true, message: '请输入智能体描述' }]}
                >
                  <Input placeholder="请输入智能体描述" />
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