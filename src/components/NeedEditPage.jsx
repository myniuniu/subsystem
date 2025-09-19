import React, { useState, useEffect } from 'react';
import {
  Layout,
  Input,
  Button,
  Typography,
  Space,
  message,
  List,
  Card,
  Divider,
  Tag,
  Select,
  Form,
  Row,
  Col,
  Modal,
  Tooltip,
  Empty,
  Spin
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EditOutlined,
  EyeOutlined,
  StarOutlined,
  StarFilled,
  ClockCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  CopyOutlined
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import needsService from '../services/needsService';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const NeedEditPage = ({ onBack, onViewChange, selectedNeed, mode = 'create' }) => {
  // 基础状态
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  
  // 数据状态
  const [needs, setNeeds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredNeeds, setFilteredNeeds] = useState([]);
  
  // 选择和编辑状态
  const [currentNeed, setCurrentNeed] = useState(selectedNeed);
  const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'create');
  const [isCreating, setIsCreating] = useState(mode === 'create');
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // 表单数据状态
  const [needTitle, setNeedTitle] = useState('');
  const [needContent, setNeedContent] = useState('');
  const [needCategory, setNeedCategory] = useState('');
  const [needTags, setNeedTags] = useState([]);
  const [needPriority, setNeedPriority] = useState('medium');
  const [needStatus, setNeedStatus] = useState('draft');

  // 培训需求分类
  const needCategories = [
    { value: 'all', label: '全部需求', icon: '📝' },
    { value: 'teaching_methods', label: '教学方法', icon: '📚' },
    { value: 'student_management', label: '学生管理', icon: '👥' },
    { value: 'educational_tech', label: '教育技术', icon: '💻' },
    { value: 'curriculum_design', label: '课程设计', icon: '📋' },
    { value: 'research_innovation', label: '科研创新', icon: '🔬' },
    { value: 'mental_health', label: '心理健康', icon: '💚' },
    { value: 'professional_dev', label: '专业发展', icon: '📈' },
    { value: 'policy_compliance', label: '政策合规', icon: '⚖️' }
  ];

  // 优先级选项
  const priorityOptions = [
    { value: 'high', label: '高优先级', color: 'red' },
    { value: 'medium', label: '中优先级', color: 'orange' },
    { value: 'low', label: '低优先级', color: 'green' }
  ];

  // 状态选项
  const statusOptions = [
    { value: 'draft', label: '草稿', color: 'default' },
    { value: 'pending', label: '待审核', color: 'processing' },
    { value: 'approved', label: '已批准', color: 'success' },
    { value: 'rejected', label: '已拒绝', color: 'error' },
    { value: 'completed', label: '已完成', color: 'success' }
  ];

  // 富文本编辑器配置
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'color', 'background', 'link', 'image'
  ];

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const [needsData, categoriesData, tagsData] = await Promise.all([
        needsService.getAllNotes(),
        needsService.getCategories(),
        needsService.getTags()
      ]);
      
      setNeeds(needsData);
      setCategories(categoriesData);
      setTags(tagsData);
      setFilteredNeeds(needsData);
      
      // 如果有指定的需求ID，选中它
      if (selectedNeedId) {
        const targetNeed = needsData.find(need => need.id === selectedNeedId);
        if (targetNeed) {
          handleSelectNeed(targetNeed);
        }
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    if (selectedNeed && mode !== 'create') {
      // 编辑或查看模式：加载选中的需求数据
      setFormData({
        title: selectedNeed.title || '',
        category: selectedNeed.category || '',
        educationLevel: selectedNeed.educationLevel || '',
        role: selectedNeed.role || '',
        priority: selectedNeed.priority || 'medium',
        content: selectedNeed.content || '',
        tags: selectedNeed.tags || []
      });
      setSelectedTags(selectedNeed.tags || []);
    } else {
      // 创建模式：重置表单
      setFormData({
        title: '',
        category: '',
        educationLevel: '',
        role: '',
        priority: 'medium',
        content: '',
        tags: []
      });
      setSelectedTags([]);
    }
  }, [selectedNeed, mode]);

  // 加载数据
  useEffect(() => {
    loadData();
  }, [selectedNeedId]);

  // 搜索和筛选
  useEffect(() => {
    let filtered = needs;
    
    // 分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(need => need.category === selectedCategory);
    }
    
    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(need => 
        need.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        need.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredNeeds(filtered);
  }, [needs, selectedCategory, searchTerm]);

  // 获取分类信息
  const getCategoryInfo = (categoryValue) => {
    return needCategories.find(cat => cat.value === categoryValue) || needCategories[0];
  };

  // 选择需求
  const handleSelectNeed = (need) => {
    setCurrentNeed(need);
    setNeedTitle(need.title);
    setNeedContent(need.content);
    setNeedCategory(need.category);
    setNeedTags(need.tags || []);
    setNeedPriority(need.priority || 'medium');
    setNeedStatus(need.status || 'draft');
    setIsCreating(false);
    
    // 根据模式设置编辑状态
    setIsEditing(mode === 'edit');
  };

  // 新建需求
  const handleCreateNew = () => {
    setCurrentNeed(null);
    setNeedTitle('');
    setNeedContent('');
    setNeedCategory('teaching_methods');
    setNeedTags([]);
    setNeedPriority('medium');
    setNeedStatus('draft');
    setIsCreating(true);
    setIsEditing(true);
  };

  // 切换编辑模式
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // 保存需求
  const handleSave = async () => {
    if (!needTitle.trim()) {
      message.error('请输入培训需求标题');
      return;
    }
    
    if (!needContent.trim()) {
      message.error('请输入培训需求内容');
      return;
    }

    setSaving(true);
    try {
      const needData = {
        title: needTitle,
        content: needContent,
        category: needCategory,
        tags: needTags,
        priority: needPriority,
        status: needStatus,
        id: currentNeed?.id || Date.now(),
        createTime: currentNeed?.createTime || new Date().toISOString(),
        updateTime: new Date().toISOString()
      };

      let savedNeed;
      if (mode === 'create' || isCreating) {
        savedNeed = await needsService.createNote(needData);
        setNeeds(prev => [savedNeed, ...prev]);
        message.success('培训需求创建成功');
      } else if (mode === 'edit') {
        savedNeed = await needsService.updateNote(selectedNeed.id, needData);
        setNeeds(prev => prev.map(need => 
          need.id === selectedNeed.id ? savedNeed : need
        ));
        message.success('培训需求更新成功');
      }
      
      setCurrentNeed(savedNeed);
      setIsCreating(false);
      setIsEditing(false);
      
      // 返回列表页面
      onBack();
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 删除需求
  const handleDelete = async (needId) => {
    try {
      await needsService.deleteNote(needId);
      setNeeds(prev => prev.filter(need => need.id !== needId));
      if (currentNeed?.id === needId) {
        setCurrentNeed(null);
        setIsCreating(false);
        setIsEditing(false);
      }
      message.success('培训需求删除成功');
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败，请重试');
    }
  };

  // 复制需求
  const handleCopy = async (need) => {
    try {
      const copiedNeed = await needsService.createNote({
        ...need,
        title: `${need.title} (副本)`,
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined
      });
      setNeeds(prev => [copiedNeed, ...prev]);
      message.success('培训需求复制成功');
    } catch (error) {
      console.error('复制失败:', error);
      message.error('复制失败，请重试');
    }
  };

  // 格式化时间
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return '今天';
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // 操作面板点击处理
  const handleOperationClick = (operationType) => {
    const operationTitles = {
      'training-plan': '培训方案',
      'schedule': '课表',
      'participants': '参训人员清单'
    };

    const title = operationTitles[operationType] || operationType;
    
    // 在当前内容后添加操作记录
    const timestamp = new Date().toLocaleString();
    const operationRecord = `\n\n---\n**${title}操作记录** (${timestamp})\n\n点击了"${title}"按钮，可在此处添加相关内容。\n\n`;
    
    setNeedContent(prev => prev + operationRecord);
    
    message.success(`已添加${title}操作记录`);
  };

  return (
    <div className="need-edit-page">
      <Layout style={{ height: '100vh' }}>
        {/* 左侧需求列表 */}
        <Sider width={350} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '16px' }}>
            {/* 头部操作 */}
            <div style={{ marginBottom: '16px' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button 
                  icon={<ArrowLeftOutlined />}
                  onClick={onBack}
                >
                  返回
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleCreateNew}
                >
                  新建
                </Button>
              </Space>
            </div>

            {/* 搜索框 */}
            <Search
              placeholder="搜索培训需求..."
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '12px' }}
            />

            {/* 分类筛选 */}
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: '100%', marginBottom: '16px' }}
            >
              {needCategories.map(category => (
                <Option key={category.value} value={category.value}>
                  <Space>
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </Space>
                </Option>
              ))}
            </Select>

            <Divider style={{ margin: '12px 0' }} />

            {/* 需求列表 */}
            <div style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Spin size="large" />
                </div>
              ) : filteredNeeds.length === 0 ? (
                <Empty
                  description="暂无培训需求"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" onClick={handleCreateNew}>
                    创建第一个需求
                  </Button>
                </Empty>
              ) : (
                <List
                  dataSource={filteredNeeds}
                  renderItem={(need) => {
                    const categoryInfo = getCategoryInfo(need.category);
                    const isSelected = currentNeed?.id === need.id;
                    const priorityInfo = priorityOptions.find(p => p.value === need.priority);
                    
                    return (
                      <List.Item
                        style={{ 
                          padding: '8px 0',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          marginBottom: '8px',
                          backgroundColor: isSelected ? '#e6f7ff' : 'transparent'
                        }}
                        onClick={() => handleSelectNeed(need)}
                      >
                        <Card 
                          size="small" 
                          style={{ width: '100%' }}
                          hoverable
                          actions={[
                            <Tooltip title="复制">
                              <CopyOutlined onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(need);
                              }} />
                            </Tooltip>,
                            <Tooltip title="删除">
                              <DeleteOutlined onClick={(e) => {
                                e.stopPropagation();
                                Modal.confirm({
                                  title: '确认删除',
                                  content: '确定要删除这个培训需求吗？',
                                  onOk: () => handleDelete(need.id)
                                });
                              }} />
                            </Tooltip>
                          ]}
                        >
                          <div style={{ marginBottom: '8px' }}>
                            <Space>
                              <span>{categoryInfo.icon}</span>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {categoryInfo.label}
                              </Text>
                              {priorityInfo && (
                                <Tag color={priorityInfo.color} size="small">
                                  {priorityInfo.label}
                                </Tag>
                              )}
                            </Space>
                            {need.starred && <StarFilled style={{ color: '#faad14', float: 'right' }} />}
                          </div>
                          
                          <Title level={5} style={{ margin: '0 0 8px 0' }} ellipsis>
                            {need.title}
                          </Title>
                          
                          <Paragraph 
                            style={{ margin: '0 0 8px 0', fontSize: '12px' }}
                            ellipsis={{ rows: 2 }}
                            type="secondary"
                          >
                            {need.content.replace(/<[^>]*>/g, '')}
                          </Paragraph>
                          
                          <div style={{ marginBottom: '8px' }}>
                            {need.tags?.slice(0, 2).map(tag => (
                              <Tag key={tag} size="small">{tag}</Tag>
                            ))}
                            {need.tags?.length > 2 && (
                              <Tag size="small">+{need.tags.length - 2}</Tag>
                            )}
                          </div>
                          
                          <div>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              <ClockCircleOutlined /> {formatTime(need.updatedAt)}
                            </Text>
                          </div>
                        </Card>
                      </List.Item>
                    );
                  }}
                />
              )}
            </div>
          </div>
        </Sider>

        {/* 右侧编辑区域 */}
        <Content style={{ padding: '16px', background: '#fff' }}>
          {(currentNeed || isCreating || mode === 'create') ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* 编辑器头部 */}
              <div style={{ marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    {isEditing || mode === 'create' ? (
                      <Input
                        value={needTitle}
                        onChange={(e) => setNeedTitle(e.target.value)}
                        placeholder="请输入培训需求标题"
                        size="large"
                        style={{ fontSize: '20px', fontWeight: 'bold' }}
                      />
                    ) : (
                      <Title level={2} style={{ margin: 0 }}>
                        {needTitle || (mode === 'create' ? '新建培训需求' : '培训需求详情')}
                      </Title>
                    )}
                  </div>
                  
                  <Space>
                    {mode !== 'create' && !isCreating && (
                      <Button
                        icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                        onClick={handleToggleEdit}
                      >
                        {isEditing ? '预览' : '编辑'}
                      </Button>
                    )}
                    {(isEditing || mode === 'create') && (
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={saving}
                        onClick={handleSave}
                      >
                        {mode === 'create' ? '创建' : '保存'}
                      </Button>
                    )}
                  </Space>
                </div>
                
                {/* 元数据 */}
                {(isEditing || mode === 'create') ? (
                  <Row gutter={16} style={{ marginTop: '16px' }}>
                    <Col span={8}>
                      <Select
                        value={needCategory}
                        onChange={setNeedCategory}
                        style={{ width: '100%' }}
                        placeholder="选择分类"
                      >
                        {needCategories.filter(cat => cat.value !== 'all').map(category => (
                          <Option key={category.value} value={category.value}>
                            <Space>
                              <span>{category.icon}</span>
                              <span>{category.label}</span>
                            </Space>
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={8}>
                      <Select
                        value={needPriority}
                        onChange={setNeedPriority}
                        style={{ width: '100%' }}
                        placeholder="选择优先级"
                      >
                        {priorityOptions.map(priority => (
                          <Option key={priority.value} value={priority.value}>
                            <Tag color={priority.color}>{priority.label}</Tag>
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={8}>
                      <Select
                        value={needStatus}
                        onChange={setNeedStatus}
                        style={{ width: '100%' }}
                        placeholder="选择状态"
                      >
                        {statusOptions.map(status => (
                          <Option key={status.value} value={status.value}>
                            <Tag color={status.color}>{status.label}</Tag>
                          </Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>
                ) : (
                  <div style={{ marginTop: '16px' }}>
                    <Space wrap>
                      <Tag color="blue">{getCategoryInfo(needCategory).label}</Tag>
                      <Tag color={priorityOptions.find(p => p.value === needPriority)?.color}>
                        {priorityOptions.find(p => p.value === needPriority)?.label}
                      </Tag>
                      <Tag color={statusOptions.find(s => s.value === needStatus)?.color}>
                        {statusOptions.find(s => s.value === needStatus)?.label}
                      </Tag>
                      {needTags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  </div>
                )}
              </div>

              {/* 主要内容区域 */}
              <div style={{ flex: 1, display: 'flex', gap: '16px' }}>
                {/* 左侧内容编辑区 */}
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  {(isEditing || mode === 'create') ? (
                    <ReactQuill
                      value={needContent}
                      onChange={setNeedContent}
                      modules={quillModules}
                      formats={quillFormats}
                      style={{ height: 'calc(100% - 42px)' }}
                      placeholder="请输入培训需求的详细内容..."
                    />
                  ) : (
                    <div 
                      style={{ 
                        height: '100%', 
                        overflowY: 'auto',
                        padding: '16px',
                        border: '1px solid #f0f0f0',
                        borderRadius: '6px',
                        backgroundColor: '#fafafa'
                      }}
                      dangerouslySetInnerHTML={{ __html: needContent }}
                    />
                  )}
                </div>

                {/* 右侧应用工具区 */}
                {(isEditing || mode === 'create') && (
                  <div style={{ width: '280px', display: 'flex', flexDirection: 'column' }}>
                    {/* 应用图标网格 */}
                    <div style={{ 
                      background: '#f8f9fa', 
                      borderRadius: '8px', 
                      padding: '16px',
                      marginBottom: '16px'
                    }}>
                      <Title level={5} style={{ margin: '0 0 12px 0', color: '#666' }}>
                        内容制作工具
                      </Title>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: '12px' 
                      }}>
                        {[
                          { name: '音频制作', icon: '🎵', color: '#52c41a' },
                          { name: '视频制作', icon: '🎬', color: '#1890ff' },
                          { name: '思维导图', icon: '🧠', color: '#f5222d' },
                          { name: '数据分析', icon: '📊', color: '#faad14' },
                          { name: '内容管理', icon: '📝', color: '#722ed1' },
                          { name: '项目管理', icon: '📋', color: '#13c2c2' }
                        ].map((tool, index) => (
                          <div
                            key={index}
                            style={{
                              background: 'white',
                              borderRadius: '8px',
                              padding: '12px 8px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              border: '1px solid #f0f0f0',
                              ':hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                              }
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            <div style={{ 
                              fontSize: '24px', 
                              marginBottom: '4px',
                              background: tool.color,
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 8px auto'
                            }}>
                              {tool.icon}
                            </div>
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#666',
                              fontWeight: '500'
                            }}>
                              {tool.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 操作面板 */}
                    <div style={{ 
                      background: '#f8f9fa', 
                      borderRadius: '8px', 
                      padding: '16px',
                      marginBottom: '16px'
                    }}>
                      <Title level={5} style={{ margin: '0 0 12px 0', color: '#666' }}>
                        🛠️ 操作面板
                      </Title>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: '12px' 
                      }}>
                        {/* 培训方案 */}
                        <div
                          style={{
                            background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                            borderRadius: '12px',
                            padding: '16px 12px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: 'none',
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(82, 196, 26, 0.2)'
                          }}
                          onClick={() => handleOperationClick('training-plan')}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 16px rgba(82, 196, 26, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(82, 196, 26, 0.2)';
                          }}
                        >
                          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
                          <Text style={{ 
                            fontSize: '13px', 
                            fontWeight: '600',
                            color: 'white'
                          }}>培训方案</Text>
                        </div>

                        {/* 课表 */}
                        <div
                          style={{
                            background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
                            borderRadius: '12px',
                            padding: '16px 12px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: 'none',
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(250, 173, 20, 0.2)'
                          }}
                          onClick={() => handleOperationClick('schedule')}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 16px rgba(250, 173, 20, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(250, 173, 20, 0.2)';
                          }}
                        >
                          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📅</div>
                          <Text style={{ 
                            fontSize: '13px', 
                            fontWeight: '600',
                            color: 'white'
                          }}>课表</Text>
                        </div>

                        {/* 参训人员清单 */}
                        <div
                          style={{
                            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                            borderRadius: '12px',
                            padding: '16px 12px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: 'none',
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)'
                          }}
                          onClick={() => handleOperationClick('participants')}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 16px rgba(24, 144, 255, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.2)';
                          }}
                        >
                          <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
                          <Text style={{ 
                            fontSize: '13px', 
                            fontWeight: '600',
                            color: 'white'
                          }}>参训人员</Text>
                        </div>
                      </div>
                    </div>

                    {/* 操作提示 */}
                    <div style={{
                      background: '#e6f7ff',
                      border: '1px solid #91d5ff',
                      borderRadius: '6px',
                      padding: '12px',
                      fontSize: '12px',
                      color: '#0050b3'
                    }}>
                      💡 提示：点击上方工具可快速插入相关内容模板
                    </div>
                  </div>
                )}
              </div>

              {/* 底部工具栏 */}
              {(isEditing || mode === 'create') && (
                <div style={{ 
                  marginTop: '16px', 
                  borderTop: '1px solid #f0f0f0', 
                  paddingTop: '16px' 
                }}>
                  {/* 选项卡 */}
                  <div style={{ marginBottom: '12px' }}>
                    <Space>
                      {['内容制作', '人机对话', '小组协作'].map((tab, index) => (
                        <Button
                          key={tab}
                          type={index === 0 ? 'primary' : 'default'}
                          size="small"
                          style={{ 
                            borderRadius: '16px',
                            fontSize: '12px'
                          }}
                        >
                          {tab}
                        </Button>
                      ))}
                    </Space>
                  </div>

                  {/* 搜索框 */}
                  <Input
                    placeholder="搜索或输入您想要的内容"
                    prefix={<SearchOutlined />}
                    style={{ 
                      borderRadius: '20px',
                      background: '#f8f9fa'
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <Empty
                description="请选择一个培训需求进行编辑或查看"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={handleCreateNew}>
                  创建新的培训需求
                </Button>
              </Empty>
            </div>
          )}
        </Content>
      </Layout>
    </div>
  );
};

export default NeedEditPage;