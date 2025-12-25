import React, { useState, useEffect } from 'react';
import {
  Modal,
  Layout,
  Input,
  Button,
  List,
  Card,
  Typography,
  Space,
  Tag,
  Select,
  Divider,
  Avatar,
  Tooltip,
  message,
  Form,
  Row,
  Col,
  Tabs
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  ClockCircleOutlined,
  FolderOpenOutlined,
  TagOutlined,
  SaveOutlined,
  CloseOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  RobotOutlined
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AIToolHouse from './AIToolHouse';
import './NoteCreateModal.css';

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const NoteCreateModal = ({ visible, onCancel, onSave, notes = [], categories = [], tags = [], noteCategory = null }) => {
  console.log('=== NoteCreateModal 组件渲染 ===');
  console.log('接收到的 noteCategory:', noteCategory);
  console.log('noteCategory 类型:', typeof noteCategory);
  console.log('================================');
  const [form] = Form.useForm();
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // 默认分类
  const defaultCategories = [
    { value: 'all', label: '全部主题', icon: '📝' },
    { value: 'work', label: '工作主题', icon: '💼' },
    { value: 'study', label: '学习主题', icon: '📚' },
    { value: 'research', label: '研究主题', icon: '🔬' },
    { value: 'personal', label: '个人主题', icon: '👤' },
    { value: 'ideas', label: '想法灵感', icon: '💡' },
    { value: 'meeting', label: '会议记录', icon: '🤝' },
    { value: 'organizational_training', label: '组织培训', icon: '🏢' },
    { value: 'training_needs_management', label: '培训项目管理', icon: '📋' },
    { value: 'knowledge_graph', label: '知识图谱', icon: '🕸️' },
    { value: 'capability_model', label: '能力模型', icon: '🎯' },
    { value: 'micro_major', label: '微专业', icon: '🎓' }
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

  // 初始化和重置
  useEffect(() => {
    if (visible) {
      setFilteredNotes(notes);
      setSelectedNote(null);
      setEditorContent('');
      setNoteTitle('');
      setSelectedTags([]);
      setIsEditing(false);
      setSearchTerm('');
      // 如果传入了noteCategory且在defaultCategories中存在，则使用它，否则使用'all'
      const initialCategory = noteCategory && defaultCategories.some(cat => cat.value === noteCategory) 
        ? noteCategory 
        : 'all';
      setSelectedCategory(initialCategory);
    }
  }, [visible, notes, noteCategory]);

  // 搜索和过滤
  useEffect(() => {
    let filtered = notes;
    
    if (searchTerm) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }
    
    setFilteredNotes(filtered);
  }, [notes, searchTerm, selectedCategory]);

  // 选择主题
  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setEditorContent(note.content);
    setSelectedTags(note.tags || []);
    setIsEditing(false);
  };

  // 新建主题
  const handleCreateNew = () => {
    setSelectedNote(null);
    setNoteTitle('');
    setEditorContent('');
    setSelectedTags([]);
    setIsEditing(true);
  };

  // 编辑主题
  const handleEditNote = () => {
    setIsEditing(true);
  };

  // 保存主题
  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      message.error('请输入主题标题');
      return;
    }

    try {
      setLoading(true);
      const noteData = {
        title: noteTitle,
        content: editorContent,
        category: selectedCategory === 'all' ? 'personal' : selectedCategory,
        tags: selectedTags,
        createdAt: selectedNote ? selectedNote.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (selectedNote) {
        noteData.id = selectedNote.id;
      }

      await onSave(noteData);
      setIsEditing(false);
      message.success(selectedNote ? '主题更新成功' : '主题创建成功');
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    if (selectedNote) {
      setNoteTitle(selectedNote.title);
      setEditorContent(selectedNote.content);
      setSelectedTags(selectedNote.tags || []);
      setIsEditing(false);
    } else {
      setNoteTitle('');
      setEditorContent('');
      setSelectedTags([]);
      setIsEditing(false);
    }
  };

  // 获取分类信息
  const getCategoryInfo = (categoryValue) => {
    return defaultCategories.find(cat => cat.value === categoryValue) || defaultCategories[0];
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

  return (
    <Modal
      title="智能主题编辑器"
      open={visible}
      onCancel={onCancel}
      width="90%"
      style={{ maxWidth: '1200px', minWidth: '800px' }}
      footer={null}
      className="note-create-modal"
      destroyOnHidden
      centered
    >
      <Layout className="modal-layout">
        {/* 左侧主题列表 */}
        <Sider width={350} className="notes-sidebar">
          <div className="sidebar-header">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreateNew}
              block
            >
              新建主题
            </Button>
          </div>

          <div className="sidebar-content">
            {/* 搜索框 */}
            <Search
              placeholder="搜索主题..."
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            {/* 分类筛选 */}
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="category-select"
              style={{ width: '100%', marginTop: 8 }}
            >
              {defaultCategories.map(category => (
                <Option key={category.value} value={category.value}>
                  <Space>
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </Space>
                </Option>
              ))}
            </Select>

            <Divider style={{ margin: '12px 0' }} />

            {/* 主题列表 */}
            <div className="notes-list">
              {filteredNotes.length === 0 ? (
                <div className="empty-notes">
                  <Text type="secondary">暂无主题</Text>
                </div>
              ) : (
                <List
                  dataSource={filteredNotes}
                  renderItem={(note) => {
                    const categoryInfo = getCategoryInfo(note.category);
                    const isSelected = selectedNote?.id === note.id;
                    
                    return (
                      <List.Item
                        className={`note-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectNote(note)}
                      >
                        <Card size="small" className="note-card" hoverable>
                          <div className="note-header">
                            <Space>
                              <span className="category-icon">{categoryInfo.icon}</span>
                              <Text type="secondary" className="category-text">
                                {categoryInfo.label}
                              </Text>
                            </Space>
                            {note.starred && <StarFilled className="star-icon" />}
                          </div>
                          
                          <Title level={5} className="note-title" ellipsis>
                            {note.title}
                          </Title>
                          
                          <Paragraph 
                            className="note-preview" 
                            ellipsis={{ rows: 2 }}
                            type="secondary"
                          >
                            {note.content.replace(/<[^>]*>/g, '')}
                          </Paragraph>
                          
                          <div className="note-tags">
                            {note.tags?.slice(0, 2).map(tag => (
                              <Tag key={tag} size="small">{tag}</Tag>
                            ))}
                            {note.tags?.length > 2 && (
                              <Tag size="small">+{note.tags.length - 2}</Tag>
                            )}
                          </div>
                          
                          <div className="note-meta">
                            <Text type="secondary" className="time-text">
                              <ClockCircleOutlined /> {formatTime(note.updatedAt)}
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
        <Content className="editor-content">
          {selectedNote || isEditing ? (
            <div className="editor-container">
              {/* 编辑器头部 */}
              <div className="editor-header">
                <div className="editor-title">
                  {isEditing ? (
                    <Input
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="请输入主题标题"
                      className="title-input"
                      size="large"
                    />
                  ) : (
                    <Title level={3} className="title-display">
                      {selectedNote?.title}
                    </Title>
                  )}
                </div>
                
                <div className="editor-actions">
                  <Space>
                    {isEditing ? (
                      <>
                        <Button 
                          icon={<SaveOutlined />} 
                          type="primary"
                          onClick={handleSaveNote}
                          loading={loading}
                        >
                          保存
                        </Button>
                        <Button 
                          icon={<CloseOutlined />}
                          onClick={handleCancelEdit}
                        >
                          取消
                        </Button>
                      </>
                    ) : (
                      <Button 
                        icon={<EditOutlined />}
                        type="primary"
                        onClick={handleEditNote}
                      >
                        编辑
                      </Button>
                    )}
                  </Space>
                </div>
              </div>

              {/* 标签区域 */}
              <div className="tags-section">
                <Space wrap>
                  {selectedTags.map(tag => (
                    <Tag 
                      key={tag} 
                      closable={isEditing}
                      onClose={() => {
                        setSelectedTags(selectedTags.filter(t => t !== tag));
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                  {isEditing && (
                    <Select
                      mode="tags"
                      style={{ minWidth: 120 }}
                      placeholder="添加标签"
                      value={[]}
                      onChange={(newTags) => {
                        const uniqueTags = [...new Set([...selectedTags, ...newTags])];
                        setSelectedTags(uniqueTags);
                      }}
                      options={tags.map(tag => ({ label: tag, value: tag }))}
                    />
                  )}
                </Space>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              {/* 主要内容区域 - 使用Tabs */}
              <div className="editor-body">
                <Tabs defaultActiveKey="editor" type="card">
                  <TabPane 
                    tab={
                      <span>
                        <EditOutlined />
                        编辑器
                      </span>
                    } 
                    key="editor"
                  >
                    {isEditing ? (
                      <ReactQuill
                        value={editorContent}
                        onChange={setEditorContent}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="开始写下你的想法..."
                        className="quill-editor"
                      />
                    ) : (
                      <div 
                        className="content-display"
                        dangerouslySetInnerHTML={{ __html: selectedNote?.content || '' }}
                      />
                    )}
                  </TabPane>
                  
                  <TabPane 
                    tab={
                      <span>
                        <RobotOutlined />
                        智能工具
                      </span>
                    } 
                    key="tools"
                  >
                    <AIToolHouse 
                      noteCategory={noteCategory}
                      onAddToOperationPanel={(toolConfig) => {
                        // 处理工具添加到操作面板的逻辑
                        message.success(`${toolConfig.title} 已添加到操作面板`);
                      }}
                    />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="empty-editor">
              <div className="empty-content">
                <FolderOpenOutlined className="empty-icon" />
                <Title level={4} type="secondary">选择一个主题开始编辑</Title>
                <Text type="secondary">或者创建一个新的主题</Text>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleCreateNew}
                  style={{ marginTop: 16 }}
                >
                  新建主题
                </Button>
              </div>
            </div>
          )}
        </Content>
      </Layout>
    </Modal>
  );
};

export default NoteCreateModal;
