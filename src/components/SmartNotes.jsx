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
  DownOutlined,
  SyncOutlined
} from '@ant-design/icons';
import NoteEditor from './NoteEditor';
import CategoryTagManager from './CategoryTagManager';
import AIAssistant from './AIAssistant';
import AdvancedSearch from './AdvancedSearch';
import ImportExport from './ImportExport';
import NoteCreateModal from './NoteCreateModal';
import NoteEditPage from './NoteEditPage';
import notesService from '../services/notesService';
import courseSelectionService from '../services/courseSelectionService';
import mockDataGenerator from '../utils/mockDataGenerator';
import './SmartNotes.css';

const { Content, Sider } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const SmartNotes = ({ onViewChange }) => {
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
  const [showNoteEditPage, setShowNoteEditPage] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editMode, setEditMode] = useState('create');
  const [form] = Form.useForm();

  // 笔记分类
  const categories = [
    { value: 'all', label: '全部笔记', icon: '📝' },
    { value: 'work', label: '工作笔记', icon: '💼' },
    { value: 'study', label: '学习笔记', icon: '📚' },
    { value: 'research', label: '研究笔记', icon: '🔬' },
    { value: 'personal', label: '个人笔记', icon: '👤' },
    { value: 'ideas', label: '想法灵感', icon: '💡' },
    { value: 'meeting', label: '会议记录', icon: '🤝' }
  ];

  // 常用标签
  const commonTags = [
    '重要', '紧急', '待办', '已完成', '草稿',
    '教学', '研究', '项目', '会议', '想法'
  ];

  // 加载数据
  // 检查localStorage数据的调试函数
  const checkLocalStorageData = () => {
    console.log('=== localStorage 数据检查 ===');
    const notesData = localStorage.getItem('smart_notes_data');
    const categoriesData = localStorage.getItem('smart_notes_categories');
    const tagsData = localStorage.getItem('smart_notes_tags');
    
    console.log('原始笔记数据:', notesData);
    console.log('原始分类数据:', categoriesData);
    console.log('原始标签数据:', tagsData);
    
    if (notesData) {
      try {
        const parsedNotes = JSON.parse(notesData);
        console.log('解析后的笔记数据:', parsedNotes.length, parsedNotes);
      } catch (e) {
        console.error('笔记数据解析失败:', e);
      }
    } else {
      console.log('localStorage中没有笔记数据');
    }
    console.log('========================');
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 检查localStorage数据
      checkLocalStorageData();
      
      const [notesData, categoriesData, tagsData, statsData] = await Promise.all([
        Promise.resolve(notesService.getAllNotes()),
        Promise.resolve(notesService.getCategories()),
        Promise.resolve(notesService.getTags()),
        Promise.resolve(notesService.getNotesStats())
      ]);
      
      // 调试信息
      console.log('=== 数据加载调试信息 ===');
      console.log('笔记数据:', notesData.length, notesData);
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
  }, []);

  // 搜索和过滤
  useEffect(() => {
    let filtered = notes;

    // 按分类筛选
    if (selectedCategory && selectedCategory !== 'all') {
      if (selectedCategory === 'organizational_training') {
        // 筛选组织培训相关的笔记
        filtered = filtered.filter(note => 
          note.courseType === 'organizational_training' || 
          note.tags?.includes('组织培训') ||
          note.category === 'organizational_training'
        );
      } else {
        filtered = filtered.filter(note => note.category === selectedCategory);
      }
    }

    // 按标签筛选
    if (selectedTags && selectedTags.length > 0) {
      filtered = filtered.filter(note => 
        selectedTags.some(tag => note.tags?.includes(tag))
      );
    }

    // 按搜索词筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term) ||
        note.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    setFilteredNotes(filtered);
  }, [notes, selectedCategory, selectedTags, searchTerm]);

  // 创建新笔记
  const handleCreateNote = () => {
    // 在主区域显示笔记编辑页面
    setEditingNote(null);
    setEditMode('create');
    setShowNoteEditPage(true);
  };

  // 关闭编辑页面
  const handleCloseEditPage = () => {
    setShowNoteEditPage(false);
    setEditingNote(null);
    setEditMode('create');
  };

  // 编辑笔记
  const handleEditNote = (note) => {
    setSelectedNote(note);
    setEditingNote(note);
    setEditMode('edit');
    setShowNoteEditPage(true);
  };

  // 查看笔记
  const handleViewNote = (note) => {
    setSelectedNote(note);
    setEditingNote(note);
    setEditMode('view');
    setShowNoteEditPage(true);
  };

  // 保存笔记
  const handleSaveNote = async (noteData) => {
    try {
      let savedNote;
      if (noteData.id) {
        // 更新现有笔记
        savedNote = notesService.updateNote(noteData.id, noteData);
      } else if (editorMode === 'create') {
        // 从原编辑器创建新笔记
        savedNote = notesService.createNote(noteData);
      } else {
        // 从新弹窗创建新笔记
        savedNote = notesService.createNote(noteData);
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

  // 删除笔记
  const handleDeleteNote = async (noteId) => {
    try {
      notesService.deleteNote(noteId);
      await loadData();
      message.success('笔记删除成功');
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 切换收藏状态
  const handleToggleStar = async (noteId) => {
    try {
      notesService.toggleStar(noteId);
      await loadData();
    } catch (error) {
      console.error('切换收藏失败:', error);
      message.error('操作失败');
    }
  };

  // 导出笔记
  const handleExportNotes = () => {
    try {
      const exportData = notesService.exportNotes();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-notes-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('笔记导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    }
  };

  // 导入笔记
  const handleImportNotes = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const result = notesService.importNotes(text, { merge: true });
        await loadData();
        message.success(`导入成功：新增 ${result.imported} 条笔记，跳过 ${result.skipped} 条重复笔记`);
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
      notesService.updateTagsList(data.tags);
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

  // 同步选课功能
  const handleSyncCourseSelection = async () => {
    try {
      setLoading(true);
      
      // 获取所有选课记录
      const courses = courseSelectionService.getAllCourses();
      
      if (courses.length === 0) {
        message.warning('暂无选课记录可同步');
        return;
      }

      // 将选课记录转换为智能笔记
      const syncedNotes = courses.map(course => ({
        id: `course_${course.id}`,
        title: `【选课同步】${course.title}`,
        content: `## 课程信息
**课程名称：** ${course.title}
**课程类型：** ${course.type === 'organizational_training' ? '组织培训' : '自主学习'}
**课程状态：** ${course.status}
**创建时间：** ${course.createdAt}

## 课程描述
${course.description || '暂无描述'}

## 课程内容
${course.content || '暂无详细内容'}

${course.instructor ? `**主讲教师：** ${course.instructor}` : ''}
${course.schedule ? `**课程安排：** ${JSON.stringify(course.schedule)}` : ''}

---
*此笔记由选课系统自动同步生成*`,
        category: 'study',
        tags: [
          '选课同步',
          course.type === 'organizational_training' ? '组织培训' : '自主学习',
          ...(course.tags || [])
        ],
        source: '选课系统',
        courseId: course.id,
        courseType: course.type,
        starred: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      // 检查重复并保存笔记
      let addedCount = 0;
      for (const note of syncedNotes) {
        const existingNote = notes.find(n => n.courseId === note.courseId);
        if (!existingNote) {
          await notesService.createNote(note);
          addedCount++;
        }
      }

      // 重新加载数据
      await loadData();
      
      if (addedCount > 0) {
        message.success(`成功同步 ${addedCount} 条选课记录`);
      } else {
        message.info('所有选课记录已同步，无新增内容');
      }
    } catch (error) {
      console.error('同步选课失败:', error);
      message.error('同步选课失败');
    } finally {
      setLoading(false);
    }
  };

  // 组织培训快速筛选功能
  const handleOrgTrainingFilter = () => {
    if (selectedCategory === 'organizational_training') {
      // 如果已经是组织培训筛选，则切换回全部
      setSelectedCategory('all');
    } else {
      // 切换到组织培训筛选
      setSelectedCategory('organizational_training');
    }
  };

  // 高级搜索功能
  const handleAdvancedSearch = () => {
    setAdvancedSearchVisible(true);
  };

  const handleAdvancedSearchApply = (searchCriteria) => {
    try {
      // 保存搜索历史
      if (searchCriteria.keyword) {
        notesService.saveSearchHistory(searchCriteria.keyword);
      }
      
      // 执行高级搜索
      const searchResults = notesService.advancedSearch(searchCriteria);
      
      // 更新笔记列表为搜索结果
      setNotes(searchResults);
      
      // 清空基础搜索
      setSearchTerm('');
      setSelectedCategory('all');
      setShowFavorites(false);
      
      message.success(`找到 ${searchResults.length} 条匹配的笔记`);
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
    loadNotes(); // 重新加载笔记列表
    message.success('导入完成，笔记列表已更新');
  };

  // 报告生成功能
  const handleGenerateReport = (reportType) => {
    try {
      let reportTitle = '';
      let reportContent = '';
      
      switch (reportType) {
        case 'brief':
          reportTitle = '简报文档';
          reportContent = generateBriefReport();
          break;
        case 'study-guide':
          reportTitle = '学习指南';
          reportContent = generateStudyGuideReport();
          break;
        case 'faq':
          reportTitle = '常见问题解答';
          reportContent = generateFAQReport();
          break;
        case 'timeline':
          reportTitle = '时间轴';
          reportContent = generateTimelineReport();
          break;
        default:
          message.error('未知的报告类型');
          return;
      }
      
      // 创建报告笔记
      const reportNote = {
        title: `${reportTitle} - ${new Date().toLocaleDateString()}`,
        content: reportContent,
        category: 'work',
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
  
  // 生成简报文档
  const generateBriefReport = () => {
    const totalNotes = notes.length;
    const categories = {};
    const recentNotes = notes.slice(0, 5);
    
    notes.forEach(note => {
      categories[note.category] = (categories[note.category] || 0) + 1;
    });
    
    return `# 笔记简报文档

## 概览
- 总笔记数：${totalNotes}
- 生成时间：${new Date().toLocaleString()}

## 分类统计
${Object.entries(categories).map(([cat, count]) => `- ${getCategoryInfo(cat).label}：${count}条`).join('\n')}

## 最近笔记
${recentNotes.map((note, index) => `${index + 1}. ${note.title}`).join('\n')}

---
*此报告由智能笔记系统自动生成*`;
  };
  
  // 生成学习指南
  const generateStudyGuideReport = () => {
    const studyNotes = notes.filter(note => note.category === 'study');
    const workNotes = notes.filter(note => note.category === 'work');
    
    return `# 学习指南

## 学习笔记总结
共有${studyNotes.length}条学习笔记

### 主要学习内容
${studyNotes.slice(0, 10).map((note, index) => `${index + 1}. ${note.title}`).join('\n')}

## 工作相关笔记
共有${workNotes.length}条工作笔记

### 重要工作记录
${workNotes.slice(0, 5).map((note, index) => `${index + 1}. ${note.title}`).join('\n')}

## 学习建议
1. 定期回顾和整理笔记
2. 建立知识体系和关联
3. 实践应用所学知识
4. 持续更新和完善笔记内容

---
*此指南基于您的笔记内容自动生成*`;
  };
  
  // 生成常见问题解答
  const generateFAQReport = () => {
    const allTags = [...new Set(notes.flatMap(note => note.tags || []))];
    const popularTags = allTags.slice(0, 10);
    
    return `# 常见问题解答

## Q: 如何更好地组织笔记？
A: 建议使用分类和标签功能，将相关笔记归类整理。目前您使用的标签有：${popularTags.join('、')}

## Q: 如何快速找到需要的笔记？
A: 可以使用搜索功能，支持按标题、内容、标签等多种方式搜索。

## Q: 如何提高笔记质量？
A: 建议：
1. 使用清晰的标题和结构
2. 添加相关标签便于分类
3. 定期回顾和更新内容
4. 使用AI助手功能获得改进建议

## Q: 如何备份笔记数据？
A: 可以使用导入导出功能，定期备份您的笔记数据。

## Q: 如何利用AI助手？
A: AI助手可以帮助您：
- 生成笔记摘要
- 推荐相关标签
- 提供内容建议
- 优化笔记结构

---
*基于您的使用情况生成的常见问题*`;
  };
  
  // 生成时间轴报告
  const generateTimelineReport = () => {
    const sortedNotes = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const timelineData = sortedNotes.slice(0, 20);
    
    return `# 笔记时间轴

## 最近创建的笔记

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
- 总笔记数：${notes.length}
- 最早笔记：${sortedNotes.length > 0 ? new Date(sortedNotes[sortedNotes.length - 1].createdAt).toLocaleDateString() : '无'}
- 最新笔记：${sortedNotes.length > 0 ? new Date(sortedNotes[0].createdAt).toLocaleDateString() : '无'}

---
*按时间顺序展示的笔记创建记录*`;
  };

  const handleAIApplySuggestion = (type, data) => {
    if (!aiSelectedNote) return;
    
    switch (type) {
      case 'summary':
        // 将摘要添加到笔记开头
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
        // 将建议作为注释添加到笔记末尾
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

  // 笔记卡片操作菜单
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
  if (showNoteEditPage) {
    return <NoteEditPage 
      onBack={handleCloseEditPage} 
      onViewChange={onViewChange} 
      note={editingNote}
      mode={editMode}
    />;
  }

  return (
    <div className="smart-notes">
      <Layout>
        {/* 侧边栏 */}
        <Sider width={280} className="notes-sidebar">


          <div className="sidebar-content">
            {/* 搜索框 */}
            <Search
              placeholder="搜索笔记..."
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            {/* 分类列表 */}
            <div className="category-section">
              <div className="category-list">
                {/* 固定显示组织培训分类 */}
                <div
                  className={`category-item organizational-training-category ${
                    selectedCategory === 'organizational_training' ? 'active' : ''
                  }`}
                  onClick={() => setSelectedCategory('organizational_training')}
                >
                  <BookOutlined className="category-icon" />
                  <span className="category-label">🏢 组织培训</span>
                  <span className="category-count">{stats.categories?.organizational_training || 0}</span>
                </div>
                
                {/* 其他分类 */}
                {categories.map(category => {
                  // 跳过组织培训分类，因为已经固定显示在上面
                  if (category.value === 'organizational_training') {
                    return null;
                  }
                  
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
        <Content className="notes-content">
          <div className="content-header">
            <div className="header-left">
              <Title level={3}>我的笔记</Title>
              <Text type="secondary">
                共 {filteredNotes.length} 条笔记
                {selectedCategory !== 'all' && (
                  <span> · {getCategoryInfo(selectedCategory).label}</span>
                )}
              </Text>
            </div>
            
            <div className="header-actions">
              <Space>
                <Button 
                  icon={<DatabaseOutlined />}
                  onClick={async () => {
                    try {
                      console.log('=== 点击生成模拟数据按钮 ===');
                      console.log('生成前检查localStorage:');
                      checkLocalStorageData();
                      
                      console.log('开始调用 mockDataGenerator.generateAllMockData()');
                      const result = await mockDataGenerator.generateAllMockData();
                      console.log('生成结果:', result);
                      
                      console.log('生成后检查localStorage:');
                      checkLocalStorageData();
                      
                      if (result.success) {
                        console.log('开始重新加载数据...');
                        await loadData();
                        console.log('数据重新加载完成');
                        message.success(`成功生成 ${result.count} 条模拟数据`);
                      } else {
                        console.error('生成失败:', result.error);
                        message.error('生成模拟数据失败');
                      }
                    } catch (error) {
                      console.error('生成模拟数据失败:', error);
                      message.error('生成模拟数据失败');
                    }
                  }}
                >
                  生成模拟数据
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleCreateNote}
                >
                  新建笔记
                </Button>
                <Button 
                  icon={<SearchOutlined />}
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
                <Button 
                  className="sync-course-btn"
                  icon={<SyncOutlined />}
                  onClick={handleSyncCourseSelection}
                  size="large"
                >
                  同步选课
                </Button>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'brief',
                        label: '简报文档',
                        icon: <FileTextOutlined />,
                        onClick: () => handleGenerateReport('brief')
                      },
                      {
                        key: 'study-guide',
                        label: '学习指南',
                        icon: <BookOutlined />,
                        onClick: () => handleGenerateReport('study-guide')
                      },
                      {
                        key: 'faq',
                        label: '常见问题解答',
                        icon: <BulbOutlined />,
                        onClick: () => handleGenerateReport('faq')
                      },
                      {
                        key: 'timeline',
                        label: '时间轴',
                        icon: <ClockCircleOutlined />,
                        onClick: () => handleGenerateReport('timeline')
                      }
                    ]
                  }}
                  trigger={['contextMenu']}
                  placement="bottomLeft"
                  overlayClassName="report-dropdown"
                >
                  <Button>
                    <FileTextOutlined />
                    报告
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </Space>
            </div>

          </div>

          {/* 笔记列表 */}
          <div className="notes-grid">
            {loading ? (
              <div className="loading-container">
                <Spin size="large">
                  <div style={{ marginTop: 8 }}>加载中...</div>
                </Spin>
              </div>
            ) : filteredNotes.length === 0 ? (
              <Empty
                description="暂无笔记"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={handleCreateNote}>
                  创建第一条笔记
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
                          <Tooltip title="查看详情">
                            <EyeOutlined onClick={() => handleViewNote(note)} />
                          </Tooltip>,
                          <Tooltip title="编辑">
                            <EditOutlined onClick={() => handleEditNote(note)} />
                          </Tooltip>,
                          <Tooltip title="AI助手">
                            <RobotOutlined onClick={() => handleOpenAIAssistant(note)} />
                          </Tooltip>,
                          <Tooltip title={note.starred ? '取消收藏' : '收藏'}>
                            {note.starred ? (
                              <StarFilled 
                                className="star-filled"
                                onClick={() => handleToggleStar(note.id)} 
                              />
                            ) : (
                              <StarOutlined 
                                onClick={() => handleToggleStar(note.id)} 
                              />
                            )}
                          </Tooltip>,
                          <Popconfirm
                            title="确定要删除这篇笔记吗？"
                            onConfirm={() => handleDeleteNote(note.id)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Tooltip title="删除">
                              <DeleteOutlined />
                            </Tooltip>
                          </Popconfirm>
                        ]}
                      >
                        <div className="note-header">
                          <div className="note-category">
                            <span className="category-icon">{categoryInfo.icon}</span>
                            <Text type="secondary" className="category-text">
                              {categoryInfo.label}
                            </Text>
                          </div>
                          {note.starred && (
                            <StarFilled className="star-badge" />
                          )}
                        </div>
                        
                        <Title level={5} className="note-title" ellipsis={{ rows: 2 }}>
                          {note.title}
                        </Title>
                        
                        <Paragraph 
                          className="note-content" 
                          ellipsis={{ rows: 3 }}
                          type="secondary"
                        >
                          {note.content}
                        </Paragraph>
                        
                        <div className="note-tags">
                          {note.tags?.map(tag => (
                            <Tag key={tag} size="small">{tag}</Tag>
                          ))}
                        </div>
                        
                        <div className="note-meta">
                          <Space split={<Divider type="vertical" />}>
                            <Text type="secondary" className="meta-item">
                              <ClockCircleOutlined /> {note.updatedAt}
                            </Text>
                            <Text type="secondary" className="meta-item">
                              {note.wordCount} 字
                            </Text>
                          </Space>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </div>
        </Content>
      </Layout>

      {/* 笔记编辑器 */}
      <NoteEditor
        visible={isEditorVisible}
        note={selectedNote}
        categories={noteCategories}
        tags={tags}
        mode={editorMode}
        onSave={handleSaveNote}
        onCancel={() => setIsEditorVisible(false)}
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

      {/* 新建笔记弹窗 */}
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

export default SmartNotes;