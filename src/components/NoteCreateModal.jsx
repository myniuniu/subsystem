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
  Col
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
  PictureOutlined
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './NoteCreateModal.css';

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const NoteCreateModal = ({ visible, onCancel, onSave, notes = [], categories = [], tags = [] }) => {
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
    { value: 'all', label: '全部笔记', icon: '📝' },
    { value: 'work', label: '工作笔记', icon: '💼' },
    { value: 'study', label: '学习笔记', icon: '📚' },
    { value: 'research', label: '研究笔记', icon: '🔬' },
    { value: 'personal', label: '个人笔记', icon: '👤' },
    { value: 'ideas', label: '想法灵感', icon: '💡' },
    { value: 'meeting', label: '会议记录', icon: '🤝' },
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
      setSelectedCategory('all');
    }
  }, [visible, notes]);

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

  // 选择笔记
  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setEditorContent(note.content);
    setSelectedTags(note.tags || []);
    setIsEditing(false);
  };

  // 新建笔记
  const handleCreateNew = () => {
    setSelectedNote(null);
    setNoteTitle('');
    setEditorContent('');
    setSelectedTags([]);
    setIsEditing(true);
  };

  // 编辑笔记
  const handleEditNote = () => {
    setIsEditing(true);
  };

  // 保存笔记
  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      message.error('请输入笔记标题');
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
      message.success(selectedNote ? '笔记更新成功' : '笔记创建成功');
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
      title="智能笔记编辑器"
      open={visible}
      onCancel={onCancel}
      width={1200}
      height={800}
      footer={null}
      className="note-create-modal"
      destroyOnHidden
    >
      <Layout className="modal-layout">
        {/* 左侧笔记列表 */}
        <Sider width={350} className="notes-sidebar">
          <div className="sidebar-header">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreateNew}
              block
            >
              新建笔记
            </Button>
          </div>

          <div className="sidebar-content">
            {/* 搜索框 */}
            <Search
              placeholder="搜索笔记..."
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

            {/* 笔记列表 */}
            <div className="notes-list">
              {filteredNotes.length === 0 ? (
                <div className="empty-notes">
                  <Text type="secondary">暂无笔记</Text>
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
                      placeholder="请输入笔记标题"
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

              {/* 编辑器内容 */}
              <div className="editor-body">
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
              </div>
            </div>
          ) : (
            <div className="empty-editor">
              <div className="empty-content">
                <FolderOpenOutlined className="empty-icon" />
                <Title level={4} type="secondary">选择一个笔记开始编辑</Title>
                <Text type="secondary">或者创建一个新的笔记</Text>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleCreateNew}
                  style={{ marginTop: 16 }}
                >
                  新建笔记
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