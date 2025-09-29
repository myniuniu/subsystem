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
  Spin,
  Checkbox
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
  CopyOutlined,
  SendOutlined,
  UploadOutlined,
  LinkOutlined,
  FileTextOutlined,
  PlayCircleOutlined
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
      
      // 如果有选中的需求，选中它
      if (selectedNeed) {
        const targetNeed = needsData.find(need => need.id === selectedNeed.id);
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
      setNeedTitle(selectedNeed.title || '');
      setNeedCategory(selectedNeed.category || '');
      setNeedPriority(selectedNeed.priority || 'medium');
      setNeedContent(selectedNeed.content || '');
      setNeedTags(selectedNeed.tags || []);
      setNeedStatus(selectedNeed.status || 'draft');
    } else {
      // 创建模式：重置表单
      setNeedTitle('');
      setNeedCategory('');
      setNeedPriority('medium');
      setNeedContent('');
      setNeedTags([]);
      setNeedStatus('draft');
    }
  }, [selectedNeed, mode]);

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

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
    const operationRecord = `

---
**${title}操作记录** (${timestamp})

点击了"${title}"按钮，可在此处添加相关内容。

`;
    
    // 对于培训方案和课表工具，不显示文字生成效果，直接添加记录
    if (operationType === 'training-plan' || operationType === 'schedule') {
      setNeedContent(prev => prev + operationRecord);
      message.success(`已添加${title}操作记录`);
    } else {
      // 其他工具保持原有的进度效果
      message.loading(`正在生成${title}...`, 3);
      setTimeout(() => {
        setNeedContent(prev => prev + operationRecord);
        message.success(`已添加${title}操作记录`);
      }, 3000);
    }
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
                  {/* AI智能问答区域 */}
                  <div style={{ 
                    background: 'white', 
                    borderRadius: '8px', 
                    border: '1px solid #f0f0f0',
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      padding: '16px 20px 12px',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Text style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}>
                        AI智能问答
                      </Text>
                    </div>
                    <div style={{ padding: '16px 20px' }}>
                      <div style={{ 
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'flex-end'
                      }}>
                        <Input.TextArea
                          value={needContent}
                          onChange={(e) => setNeedContent(e.target.value)}
                          placeholder="请输入培训需求的详细内容，或向AI提问..."
                          autoSize={{ minRows: 3, maxRows: 6 }}
                          style={{ flex: 1 }}
                        />
                        <Button 
                          type="primary" 
                          icon={<SendOutlined />}
                          style={{ height: '32px' }}
                        >
                          发送
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 资料收集区域 */}
                  <div style={{ 
                    background: 'white', 
                    borderRadius: '8px', 
                    border: '1px solid #f0f0f0',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      padding: '16px 20px 12px',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Text style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}>
                          资料收集
                        </Text>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button size="small" type="text" icon={<UploadOutlined />}>
                            文档上传
                          </Button>
                          <Button size="small" type="text" icon={<LinkOutlined />}>
                            网站地址
                          </Button>
                          <Button size="small" type="text" icon={<FileTextOutlined />}>
                            文字内容
                          </Button>
                          <Button size="small" type="text" icon={<PlayCircleOutlined />}>
                            课程视频
                          </Button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Checkbox>
                          选择所有来源
                        </Checkbox>
                        <Button size="small" type="text" danger>
                          批量删除
                        </Button>
                      </div>
                    </div>
                    
                    {/* 空状态 */}
                    <div style={{ 
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      color: '#8c8c8c',
                      padding: '40px 20px'
                    }}>
                      <div style={{ 
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 16px',
                        background: '#f5f5f5',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="14,2 14,8 20,8" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="16" y1="13" x2="8" y2="13" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="16" y1="17" x2="8" y2="17" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="10,9 9,9 8,9" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div style={{ fontSize: '14px', color: '#bfbfbf', marginBottom: '8px' }}>
                        暂无资料
                      </div>
                      <div style={{ fontSize: '12px', color: '#d9d9d9', textAlign: 'center' }}>
                        上传文档、添加链接或输入文字内容<br />
                        开始收集培训相关资料
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右侧工具区 */}
                {(isEditing || mode === 'create') && (
                  <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* 资料记录 */}
                    <div style={{ 
                      background: 'white', 
                      borderRadius: '8px', 
                      border: '1px solid #f0f0f0',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        padding: '16px 20px 12px',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <Text style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}>
                          资料记录
                        </Text>
                        <Button 
                          type="primary" 
                          size="small"
                          style={{ 
                            fontSize: '12px',
                            height: '24px',
                            borderRadius: '4px'
                          }}
                        >
                          新建资料
                        </Button>
                      </div>
                      <div style={{ 
                        padding: '20px',
                        textAlign: 'center',
                        color: '#8c8c8c'
                      }}>
                        <div style={{ 
                          width: '48px',
                          height: '48px',
                          margin: '0 auto 12px',
                          background: '#f5f5f5',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="14,2 14,8 20,8" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div style={{ fontSize: '12px', color: '#bfbfbf', marginBottom: '4px' }}>
                          暂无资料记录
                        </div>
                        <div style={{ fontSize: '11px', color: '#d9d9d9' }}>
                          点击新建资料开始记录培训相关资料
                        </div>
                      </div>
                    </div>

                    {/* 智能笔记 */}
                    <div style={{ 
                      background: 'white', 
                      borderRadius: '8px', 
                      border: '1px solid #f0f0f0',
                      overflow: 'hidden',
                      flex: 1
                    }}>
                      <div style={{ 
                        padding: '16px 20px 12px',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <Text style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}>
                          智能笔记
                        </Text>
                        <Button 
                          type="link" 
                          size="small"
                          style={{ 
                            fontSize: '12px',
                            height: '24px',
                            padding: '0 8px',
                            color: '#1890ff'
                          }}
                        >
                          更多笔记
                        </Button>
                      </div>
                      <div style={{ 
                        padding: '20px',
                        textAlign: 'center',
                        color: '#8c8c8c'
                      }}>
                        <div style={{ 
                          width: '48px',
                          height: '48px',
                          margin: '0 auto 12px',
                          background: '#f5f5f5',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="14,2 14,8 20,8" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="16" y1="13" x2="8" y2="13" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="16" y1="17" x2="8" y2="17" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="10,9 9,9 8,9" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div style={{ fontSize: '12px', color: '#bfbfbf', marginBottom: '4px' }}>
                          暂无智能笔记
                        </div>
                        <div style={{ fontSize: '11px', color: '#d9d9d9' }}>
                          基于培训内容自动生成智能笔记摘要
                        </div>
                      </div>
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