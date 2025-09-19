import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  message,
  Tooltip,
  Dropdown,
  Empty,
  Spin,
  Row,
  Col,
  Typography,
  Divider,
  Avatar,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  TagOutlined,
  FolderOutlined,
  BulbOutlined,
  ExportOutlined,
  ImportOutlined,
  MoreOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  BookOutlined,
  UserOutlined,
  SettingOutlined,
  RobotOutlined,
  DownloadOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  DownOutlined
} from '@ant-design/icons';
import NoteEditor from './NoteEditor';
import CategoryTagManager from './CategoryTagManager';
import AIAssistant from './AIAssistant';
import AdvancedSearch from './AdvancedSearch';
import ImportExport from './ImportExport';
import NoteCreateModal from './NoteCreateModal';
import needsService from '../services/needsService';
import mockDataGenerator from '../utils/mockDataGenerator';
import './TrainingNeeds.css';
import NoteEditPage from './NoteEditPage';

const { Content, Sider } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const TrainingNeeds = ({ onViewChange, pageState }) => {
  // 状态管理
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [noteCategories, setNoteCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isCategoryManagerVisible, setIsCategoryManagerVisible] = useState(false);
  const [isAIAssistantVisible, setIsAIAssistantVisible] = useState(false);
  const [aiSelectedNote, setAISelectedNote] = useState(null);
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState(false);
  const [importExportVisible, setImportExportVisible] = useState(false);
  const [noteCreateModalVisible, setNoteCreateModalVisible] = useState(false);
  const [editorMode, setEditorMode] = useState('create');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [showTrainingNeedsEditPage, setShowTrainingNeedsEditPage] = useState(false);
  const [form] = Form.useForm();

  // 培训需求分类 - 基于新的培训类型体系
  const categories = [
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

  // 常用标签
  const commonTags = [
    '紧急', '重要', '计划中', '已完成', '待审批',
    '新员工', '在职', '管理层', '技术', '销售'
  ];

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      // 清除旧的分类数据，强制重新初始化
      localStorage.removeItem('training_needs_categories');
      
      const notesData = await needsService.getAllNotes();
      const categoriesData = await needsService.getCategories();
      const tagsData = await needsService.getTags();
      const statsData = await needsService.getStats();
      
      // 调试信息
      console.log('=== 数据加载调试信息 ===');
      console.log('培训需求数据:', notesData.length, notesData);
      console.log('分类数据:', categoriesData.length, categoriesData);
      console.log('标签数据:', tagsData.length, tagsData);
      console.log('统计数据:', statsData);
      console.log('========================');
      
      setNotes(notesData);
      setNoteCategories(categoriesData);
      setTags(tagsData);
      setStats(statsData);
      setFilteredNotes(notesData);
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // 初始化培训来源数据
    initializeTrainingSources();
  }, []);

  // 初始化培训来源数据
  const initializeTrainingSources = async () => {
    try {
      await needsService.initializeTrainingSources();
      console.log('培训来源数据初始化完成');
    } catch (error) {
      console.error('培训来源数据初始化失败:', error);
    }
  };

  // 搜索和过滤
  useEffect(() => {
    const filtered = needsService.searchNeeds(searchTerm, {
      category: selectedCategory,
      tags: selectedTags
    });
    setFilteredNotes(filtered);
  }, [notes, selectedCategory, selectedTags, searchTerm]);

  // 创建新培训需求
  const handleCreateNote = () => {
    // 跳转到培训需求编辑页面，传递创建模式
    onViewChange('need-edit-page', {
      selectedNeed: null,
      editorMode: 'create'
    });
  };

  // 打开编辑页面
  const handleOpenEditPage = () => {
    setShowTrainingNeedsEditPage(true);
  };

  // 关闭编辑页面
  const handleCloseEditPage = () => {
    setShowTrainingNeedsEditPage(false);
  };

  // 编辑培训需求
  const handleEditNote = (note) => {
    // 跳转到培训需求编辑页面，传递选中的需求和编辑模式
    onViewChange('need-edit-page', {
      selectedNeed: note,
      editorMode: 'edit'
    });
  };

  // 查看培训需求
  const handleViewNote = (note) => {
    // 跳转到培训需求编辑页面（查看模式），传递选中的需求和查看模式
    onViewChange('need-edit-page', {
      selectedNeed: note,
      editorMode: 'view'
    });
  };

  // 保存培训需求
  const handleSaveNote = async (noteData) => {
    try {
      let savedNote;
      if (noteData.id) {
        // 更新现有培训需求
        savedNote = needsService.updateNote(noteData.id, noteData);
      } else if (editorMode === 'create') {
        // 从原编辑器创建新培训需求
        savedNote = needsService.createNote(noteData);
      } else {
        // 从新弹窗创建新培训需求
        savedNote = needsService.createNote(noteData);
      }
      
      await loadData(); // 重新加载数据
      setIsEditorVisible(false);
      setNoteCreateModalVisible(false);
      return savedNote;
    } catch (error) {
      console.error('保存失败:', error);
      throw error;
    }
  };

  // 删除培训需求
  const handleDeleteNote = async (noteId) => {
    try {
      needsService.deleteNote(noteId);
      await loadData();
      message.success('培训需求删除成功');
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 切换收藏状态
  const handleToggleStar = async (noteId) => {
    try {
      needsService.toggleStar(noteId);
      await loadData();
    } catch (error) {
      console.error('切换收藏失败:', error);
      message.error('操作失败');
    }
  };

  // 导出培训需求
  const handleExportNotes = () => {
    try {
      const exportData = needsService.exportNotes();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `training-needs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('培训需求导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    }
  };

  // 导入培训需求
  const handleImportNotes = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const result = needsService.importNotes(text, { merge: true });
        await loadData();
        message.success(`导入成功：新增 ${result.imported} 条培训需求，跳过 ${result.skipped} 条重复记录`);
      } catch (error) {
        console.error('导入失败:', error);
        message.error('导入失败：' + error.message);
      }
    };
    input.click();
  };

  // 分类和标签管理
  const handleCategoryTagSave = (data) => {
    // 更新分类
    if (data.categories) {
      // 这里可以添加更新分类的逻辑
      // 目前使用默认分类，后续可以扩展为可自定义
    }
    
    // 更新标签列表
    if (data.tags) {
      needsService.updateTagsList(data.tags);
      setTags(data.tags);
    }
    
    setIsCategoryManagerVisible(false);
    message.success('分类和标签更新成功');
  };

  // AI助手功能
  const handleOpenAIAssistant = (note = null) => {
    setAISelectedNote(note || selectedNote);
    setIsAIAssistantVisible(true);
  };

  // 高级搜索功能
  const handleAdvancedSearch = () => {
    setAdvancedSearchVisible(true);
  };

  const handleAdvancedSearchApply = (searchCriteria) => {
    try {
      // 保存搜索历史
      if (searchCriteria.keyword) {
        needsService.saveSearchHistory(searchCriteria.keyword);
      }
      
      // 执行高级搜索
      const searchResults = needsService.advancedSearch(searchCriteria);
      
      // 更新培训需求列表为搜索结果
      setNotes(searchResults);
      
      // 清空基础搜索
      setSearchTerm('');
      setSelectedCategory('all');
      setShowFavorites(false);
      
      message.success(`找到 ${searchResults.length} 条匹配的培训需求`);
      setAdvancedSearchVisible(false);
    } catch (error) {
      console.error('搜索失败:', error);
      message.error('搜索失败，请重试');
    }
  };

  // 重置搜索结果
  const handleResetSearch = () => {
    loadNotes();
    setSearchTerm('');
    setSelectedCategory('all');
    setShowFavorites(false);
  };

  // 导入导出功能
  const handleImportExport = () => {
    setImportExportVisible(true);
  };

  const handleImportComplete = () => {
    loadNotes(); // 重新加载培训需求列表
    message.success('导入完成，培训需求列表已更新');
  };

  // 报告生成功能
  const handleGenerateReport = (reportType) => {
    try {
      let reportTitle = '';
      let reportContent = '';
      
      switch (reportType) {
        case 'brief':
          reportTitle = '培训需求简报';
          reportContent = generateBriefReport();
          break;
        case 'study-guide':
          reportTitle = '培训计划指南';
          reportContent = generateStudyGuideReport();
          break;
        case 'faq':
          reportTitle = '培训常见问题';
          reportContent = generateFAQReport();
          break;
        case 'timeline':
          reportTitle = '培训时间轴';
          reportContent = generateTimelineReport();
          break;
        default:
          message.error('未知的报告类型');
          return;
      }
      
      // 创建报告记录
      const reportNote = {
        title: `${reportTitle} - ${new Date().toLocaleDateString()}`,
        content: reportContent,
        category: 'management',
        tags: ['报告', reportType],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 保存报告
      handleSaveNote(reportNote);
      message.success(`${reportTitle}生成成功`);
      
    } catch (error) {
      console.error('生成报告失败:', error);
      message.error('生成报告失败，请重试');
    }
  };
  
  // 生成培训需求简报
  const generateBriefReport = () => {
    const totalNotes = notes.length;
    const categories = {};
    const recentNotes = notes.slice(0, 5);
    
    notes.forEach(note => {
      categories[note.category] = (categories[note.category] || 0) + 1;
    });
    
    return `# 培训需求简报文档

## 概览
- 总培训需求数：${totalNotes}
- 生成时间：${new Date().toLocaleString()}

## 分类统计
${Object.entries(categories).map(([cat, count]) => `- ${getCategoryInfo(cat).label}：${count}条`).join('\n')}

## 最近培训需求
${recentNotes.map((note, index) => `${index + 1}. ${note.title}`).join('\n')}

---
*此报告由培训需求管理系统自动生成*`;
  };
  
  // 生成培训计划指南
  const generateStudyGuideReport = () => {
    const technicalNotes = notes.filter(note => note.category === 'technical');
    const managementNotes = notes.filter(note => note.category === 'management');
    
    return `# 培训计划指南

## 技术培训需求总结
共有${technicalNotes.length}条技术培训需求

### 主要技术培训内容
${technicalNotes.slice(0, 10).map((note, index) => `${index + 1}. ${note.title}`).join('\n')}

## 管理培训需求
共有${managementNotes.length}条管理培训需求

### 重要管理培训记录
${managementNotes.slice(0, 5).map((note, index) => `${index + 1}. ${note.title}`).join('\n')}

## 培训建议
1. 定期评估和更新培训需求
2. 建立系统化的培训体系
3. 注重培训效果评估
4. 持续改进培训内容和方法

---
*此指南基于您的培训需求内容自动生成*`;
  };
  
  // 生成培训常见问题
  const generateFAQReport = () => {
    const allTags = [...new Set(notes.flatMap(note => note.tags || []))];
    const popularTags = allTags.slice(0, 10);
    
    return `# 培训常见问题解答

## Q: 如何更好地管理培训需求？
A: 建议使用分类和标签功能，将相关培训需求归类整理。目前您使用的标签有：${popularTags.join('、')}

## Q: 如何快速找到需要的培训需求？
A: 可以使用搜索功能，支持按标题、内容、标签等多种方式搜索。

## Q: 如何提高培训需求管理质量？
A: 建议：
1. 使用清晰的标题和结构
2. 添加相关标签便于分类
3. 定期回顾和更新内容
4. 使用AI助手功能获得改进建议

## Q: 如何备份培训需求数据？
A: 可以使用导入导出功能，定期备份您的培训需求数据。

## Q: 如何利用AI助手？
A: AI助手可以帮助您：
- 生成培训需求摘要
- 推荐相关标签
- 提供内容建议
- 优化培训需求结构

---
*基于您的使用情况生成的常见问题*`;
  };
  
  // 生成培训时间轴报告
  const generateTimelineReport = () => {
    const sortedNotes = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const timelineData = sortedNotes.slice(0, 20);
    
    return `# 培训需求时间轴

## 最近创建的培训需求

${timelineData.map(note => {
      const date = new Date(note.createdAt).toLocaleDateString();
      const category = getCategoryInfo(note.category).label;
      return `### ${date}
**${note.title}**
- 分类：${category}
- 标签：${(note.tags || []).join('、') || '无'}
`;
    }).join('\n')}

## 创建统计
- 总培训需求数：${notes.length}
- 最早需求：${sortedNotes.length > 0 ? new Date(sortedNotes[sortedNotes.length - 1].createdAt).toLocaleDateString() : '无'}
- 最新需求：${sortedNotes.length > 0 ? new Date(sortedNotes[0].createdAt).toLocaleDateString() : '无'}

---
*按时间顺序展示的培训需求创建记录*`;
  };

  const handleAIApplySuggestion = (type, data) => {
    if (!aiSelectedNote) return;
    
    switch (type) {
      case 'summary':
        // 将摘要添加到培训需求开头
        const updatedContent = `## 智能摘要\n\n${data}\n\n---\n\n${aiSelectedNote.content}`;
        const summaryNote = { ...aiSelectedNote, content: updatedContent };
        handleSaveNote(summaryNote);
        break;
        
      case 'tag':
        // 添加单个标签
        const currentTags = aiSelectedNote.tags || [];
        if (!currentTags.includes(data)) {
          const tagNote = { ...aiSelectedNote, tags: [...currentTags, data] };
          handleSaveNote(tagNote);
        }
        break;
        
      case 'tags':
        // 添加多个标签
        const existingTags = aiSelectedNote.tags || [];
        const newTags = [...new Set([...existingTags, ...data])];
        const tagsNote = { ...aiSelectedNote, tags: newTags };
        handleSaveNote(tagsNote);
        break;
        
      case 'suggestion':
        // 将建议作为注释添加到培训需求末尾
        const suggestionContent = `${aiSelectedNote.content}\n\n> 💡 AI建议: ${data}`;
        const suggestionNote = { ...aiSelectedNote, content: suggestionContent };
        handleSaveNote(suggestionNote);
        break;
        
      default:
        break;
    }
  };

  // 获取分类信息
  const getCategoryInfo = (categoryValue) => {
    return categories.find(cat => cat.value === categoryValue) || categories[0];
  };

  // 培训需求卡片操作菜单
  const getCardActions = (note) => [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: () => handleEditNote(note)
    },
    {
      key: 'star',
      label: note.starred ? '取消收藏' : '收藏',
      icon: note.starred ? <StarFilled /> : <StarOutlined />,
      onClick: () => handleToggleStar(note.id)
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeleteNote(note.id)
    }
  ];

  // 如果显示编辑页面，则渲染NoteEditPage
  if (showTrainingNeedsEditPage) {
    return <NoteEditPage onBack={handleCloseEditPage} onViewChange={onViewChange} />;
  }

  return (
    <div className="training-needs">
      <Layout>
        {/* 侧边栏 */}
        <Sider width={280} className="needs-sidebar">
          <div className="sidebar-content">
            {/* 搜索框 */}
            <Search
              placeholder="搜索培训需求..."
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            {/* 分类列表 */}
            <div className="category-section">
              <Text strong>分类</Text>
              <div className="category-list">
                {categories.map(category => {
                  const iconMap = {
                    FileTextOutlined,
                    FolderOpenOutlined,
                    BookOutlined,
                    UserOutlined,
                    BulbOutlined,
                    StarOutlined
                  };
                  const IconComponent = iconMap[category.icon] || FileTextOutlined;
                  const count = stats.categories?.[category.value] || 0;
                  
                  return (
                    <div
                      key={category.value}
                      className={`category-item ${
                        selectedCategory === category.value ? 'active' : ''
                      }`}
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      <IconComponent className="category-icon" />
                      <span className="category-label">{category.label}</span>
                      <span className="category-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Sider>

        {/* 主内容区 */}
        <Content className="needs-content">
          <div className="content-header">
            <div className="header-left">
              <Title level={3}>培训需求管理</Title>
              <Text type="secondary">
                共 {filteredNotes.length} 条培训需求
              </Text>
            </div>
            <div className="header-right">
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateNote}
                >
                  新建培训需求
                </Button>
                <Button
                  icon={<FilterOutlined />}
                  onClick={handleAdvancedSearch}
                >
                  高级搜索
                </Button>
                <Button
                  icon={<ImportOutlined />}
                  onClick={handleImportExport}
                >
                  导入导出
                </Button>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'generate-mock',
                        label: '生成模拟数据',
                        icon: <DatabaseOutlined />,
                        onClick: () => {
                          const mockNotes = mockDataGenerator.generateTrainingNeeds(10);
                          mockNotes.forEach(note => needsService.createNote(note));
                          loadData();
                          message.success('已生成10条模拟培训需求');
                        }
                      },
                      {
                        key: 'init-sources',
                        label: '初始化培训来源',
                        icon: <SettingOutlined />,
                        onClick: async () => {
                          try {
                            await needsService.initializeTrainingSources();
                            message.success('培训来源数据初始化完成');
                          } catch (error) {
                            console.error('初始化培训来源失败:', error);
                            message.error('初始化失败，请重试');
                          }
                        }
                      },
                      {
                        key: 'brief-report',
                        label: '生成简报',
                        icon: <BarChartOutlined />,
                        onClick: () => handleGenerateReport('brief')
                      },
                      {
                        key: 'training-guide',
                        label: '培训计划指南',
                        icon: <PieChartOutlined />,
                        onClick: () => handleGenerateReport('study-guide')
                      },
                      {
                        key: 'faq-report',
                        label: '常见问题',
                        icon: <LineChartOutlined />,
                        onClick: () => handleGenerateReport('faq')
                      },
                      {
                        key: 'timeline-report',
                        label: '时间轴报告',
                        icon: <ClockCircleOutlined />,
                        onClick: () => handleGenerateReport('timeline')
                      }
                    ]
                  }}
                >
                  <Button icon={<MoreOutlined />}>
                    更多 <DownOutlined />
                  </Button>
                </Dropdown>
              </Space>
            </div>
          </div>

          {/* 培训需求列表 */}
          <div className="notes-list">
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
                <Text>加载中...</Text>
              </div>
            ) : filteredNotes.length === 0 ? (
              <Empty
                description="暂无培训需求"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={handleCreateNote}>
                  创建第一个培训需求
                </Button>
              </Empty>
            ) : (
              <Row gutter={[16, 16]}>
                {filteredNotes.map(note => {
                  const categoryInfo = getCategoryInfo(note.category);
                  return (
                    <Col xs={24} sm={12} lg={8} xl={6} key={note.id}>
                      <Card
                        className="note-card"
                        hoverable
                        actions={[
                          <Tooltip title="查看">
                            <EyeOutlined onClick={() => handleViewNote(note)} />
                          </Tooltip>,
                          <Tooltip title="编辑">
                            <EditOutlined onClick={() => handleEditNote(note)} />
                          </Tooltip>,
                          <Tooltip title={note.starred ? '取消收藏' : '收藏'}>
                            {note.starred ? (
                              <StarFilled 
                                style={{ color: '#faad14' }}
                                onClick={() => handleToggleStar(note.id)} 
                              />
                            ) : (
                              <StarOutlined onClick={() => handleToggleStar(note.id)} />
                            )}
                          </Tooltip>,
                          <Dropdown
                            menu={{
                              items: getCardActions(note)
                            }}
                          >
                            <MoreOutlined />
                          </Dropdown>
                        ]}
                      >
                        <Card.Meta
                          avatar={
                            <Avatar 
                              style={{ 
                                backgroundColor: '#f56a00',
                                verticalAlign: 'middle' 
                              }}
                            >
                              {categoryInfo.icon}
                            </Avatar>
                          }
                          title={
                            <div className="note-title">
                              {note.title}
                              {note.starred && (
                                <StarFilled 
                                  style={{ 
                                    color: '#faad14', 
                                    marginLeft: 8,
                                    fontSize: 12
                                  }} 
                                />
                              )}
                            </div>
                          }
                          description={
                            <div className="note-description">
                              <Paragraph 
                                ellipsis={{ rows: 2 }}
                                style={{ marginBottom: 8 }}
                              >
                                {note.content}
                              </Paragraph>
                              <div className="note-meta">
                                <Tag color="blue">{categoryInfo.label}</Tag>
                                {note.tags?.slice(0, 2).map(tag => (
                                  <Tag key={tag} size="small">{tag}</Tag>
                                ))}
                                {note.tags?.length > 2 && (
                                  <Tag size="small">+{note.tags.length - 2}</Tag>
                                )}
                              </div>
                              <div className="note-time">
                                <ClockCircleOutlined />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {new Date(note.updatedAt).toLocaleDateString()}
                                </Text>
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </div>
        </Content>
      </Layout>

      {/* 培训需求编辑器 */}
      <NoteEditor
        visible={isEditorVisible}
        note={selectedNote}
        categories={noteCategories}
        tags={tags}
        onSave={handleSaveNote}
        onCancel={() => setIsEditorVisible(false)}
        mode={editorMode}
      />

      {/* 分类和标签管理器 */}
      <CategoryTagManager
        visible={isCategoryManagerVisible}
        onCancel={() => setIsCategoryManagerVisible(false)}
        onSave={handleCategoryTagSave}
        categories={noteCategories}
        tags={tags}
        stats={stats}
      />

      {/* AI智能助手 */}
      <AIAssistant
        visible={isAIAssistantVisible}
        note={aiSelectedNote}
        onClose={() => {
          setIsAIAssistantVisible(false);
          setAISelectedNote(null);
        }}
        onApplySuggestion={handleAIApplySuggestion}
      />

      {/* 高级搜索 */}
      <AdvancedSearch
        visible={advancedSearchVisible}
        onClose={() => setAdvancedSearchVisible(false)}
        onApply={handleAdvancedSearchApply}
        notes={notes}
        categories={noteCategories}
        tags={tags}
      />

      {/* 导入导出 */}
      <ImportExport
        visible={importExportVisible}
        onClose={() => setImportExportVisible(false)}
        notes={notes}
        onImportComplete={handleImportComplete}
      />

      {/* 新建培训需求弹窗 */}
      <NoteCreateModal
        visible={noteCreateModalVisible}
        onCancel={() => setNoteCreateModalVisible(false)}
        onSave={handleSaveNote}
        notes={notes}
        categories={noteCategories}
        tags={tags}
      />
    </div>
  );
};

export default TrainingNeeds;