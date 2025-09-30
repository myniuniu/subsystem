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
  Popconfirm,
  Progress
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
  SyncOutlined,
  NodeIndexOutlined,
  RadarChartOutlined,
  ExperimentOutlined,
  ShareAltOutlined,
  PlayCircleOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import NoteEditor from './NoteEditor';
import CategoryTagManager from './CategoryTagManager';
import AIAssistant from './AIAssistant';
import AdvancedSearch from './AdvancedSearch';
import ImportExport from './ImportExport';
import NoteCreateModal from './NoteCreateModal';
import NoteEditPage from './NoteEditPage';
import ThemeShareModal from './ThemeShareModal';
import CalendarCenter from './CalendarCenter';

import notesService from '../services/notesService';
import themeShareService from '../services/themeShareService';
import mockDataGenerator from '../utils/mockDataGenerator';
import { TRAINING_STATUS, getTrainingStatusInfo } from '../utils/trainingStatusUtils';
import { generateTrainingProductDevelopmentData } from '../data/trainingProductDevelopmentData';
import './SmartNotes.css';

const { Content, Sider } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// 初始化默认AI工具到localStorage（用于演示）
const initializeDefaultAITools = () => {
  const existingTools = JSON.parse(localStorage.getItem('added-ai-tools-to-panel') || '[]');
  const existingConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}');
  
  console.log('=== 初始化AI工具检查 ===');
  console.log('现有工具:', existingTools);
  console.log('现有配置:', existingConfig);
  
  // 如果没有AI工具，添加一些默认的
  if (existingTools.length === 0) {
    const defaultTools = ['grading-assistant', 'smart-writer', 'video-slicing'];
    const defaultConfig = {
      'grading-assistant': {
        key: 'grading-assistant',
        title: '阅卷助手',
        icon: '阅',
        gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
        color: '#c41d7f'
      },
      'smart-writer': {
        key: 'smart-writer',
        title: '智能写作',
        icon: '✍',
        gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        color: '#52c41a'
      },
      'video-slicing': {
        key: 'video-slicing',
        title: '视频切片',
        icon: '🎬',
        gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
        color: '#1890ff'
      }
    };
    
    localStorage.setItem('added-ai-tools-to-panel', JSON.stringify(defaultTools));
    localStorage.setItem('ai-tools-config', JSON.stringify(defaultConfig));
    
    console.log('已初始化默认AI工具:', defaultTools);
    console.log('已初始化默认配置:', defaultConfig);
    
    // 触发事件通知其他组件更新
    window.dispatchEvent(new Event('aiToolsChanged'));
  } else {
    console.log('AI工具已存在，无需初始化');
  }
};

const SmartNotes = ({ onViewChange }) => {
  // 状态管理
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [noteCategories, setNoteCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('organizational_training');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showInProgressOnly, setShowInProgressOnly] = useState(true); // 默认只显示进行中的项目
  const [viewMode, setViewMode] = useState('card'); // 'card' 或 'learning-center'
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isCategoryManagerVisible, setIsCategoryManagerVisible] = useState(false);
  const [isAIAssistantVisible, setIsAIAssistantVisible] = useState(false);
  const [aiSelectedNote, setAISelectedNote] = useState(null);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [shareSelectedNote, setShareSelectedNote] = useState(null);
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState(false);
  const [importExportVisible, setImportExportVisible] = useState(false);
  const [noteCreateModalVisible, setNoteCreateModalVisible] = useState(false);
  const [editorMode, setEditorMode] = useState('create');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [showNoteEditPage, setShowNoteEditPage] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editMode, setEditMode] = useState('create');
  const [showCalendarCenter, setShowCalendarCenter] = useState(false);
  const [form] = Form.useForm();

  // 笔记分类
  const categories = [
    { value: 'all', label: '全部主题', icon: '📝', type: 'system' },
    { value: 'work', label: '工作主题', icon: '💼', type: 'system' },
    { value: 'study', label: '学习主题', icon: '📚', type: 'system' },
    { value: 'research', label: '研究主题', icon: '🔬', type: 'system' },
    { value: 'personal', label: '个人主题', icon: '👤', type: 'system' },
    { value: 'ideas', label: '想法灵感', icon: '💡', type: 'system' },
    { value: 'meeting', label: '会议记录', icon: '🤝', type: 'system' },
    { value: 'learning_square', label: '学习广场', icon: '🎓', type: 'system' },
    { value: 'knowledge_graph', label: '知识图谱', icon: 'NodeIndexOutlined', type: 'fixed' },
    { value: 'capability_model', label: '能力模型', icon: 'RadarChartOutlined', type: 'fixed' },
    { value: 'micro_specialization', label: '微专业', icon: 'ExperimentOutlined', type: 'fixed' },
    { value: 'training_needs_management', label: '培训需求与管理', icon: '📋', type: 'system' },
    { value: 'training_product_development', label: '培训产品研发', icon: '🚀', type: 'system' }
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
      
      // 调试信息：检查localStorage数据
      checkLocalStorageData();
      
      // 初始化存储
      notesService.initializeStorage();
      
      // 获取笔记数据
      let notesData = notesService.getAllNotes();
      console.log('=== 加载的笔记数据 ===');
      console.log('笔记总数:', notesData.length);
      console.log('笔记详情:', notesData);
      
      // 检查是否有组织培训笔记，如果没有则自动生成
      const orgTrainingNotes = notesData.filter(note => 
        note.courseType === 'organizational_training' || 
        note.tags?.includes('组织培训') ||
        note.category === 'organizational_training' ||
        note.source === '组织培训'
      );
      
      console.log('组织培训笔记数量:', orgTrainingNotes.length);
      

      
      // 检查是否有培训产品研发笔记，如果没有则自动生成
      const trainingProductNotes = notesData.filter(note => 
        note.courseType === 'training_product_development' || 
        note.tags?.includes('培训产品研发') ||
        note.category === 'training_product_development' ||
        note.source === '培训产品研发'
      );
      
      console.log('培训产品研发笔记数量:', trainingProductNotes.length);
      
      if (orgTrainingNotes.length === 0) {
        console.log('没有组织培训笔记，自动生成模拟数据...');
        try {
          const result = await mockDataGenerator.generateAllMockData();
          if (result.success) {
            // 重新获取数据
            notesData = notesService.getAllNotes();
            console.log('生成数据后重新加载，笔记总数:', notesData.length);
            message.success(`已自动生成 ${result.count} 条组织培训模拟数据`);
          }
        } catch (error) {
          console.error('自动生成数据失败:', error);
        }
      }
      
      if (trainingProductNotes.length === 0) {
        console.log('没有培训产品研发笔记，自动生成模拟数据...');
        try {
          const trainingProductData = generateTrainingProductDevelopmentData();
          // 将数据添加到笔记服务中
          trainingProductData.forEach(note => {
            notesService.createNote(note);
          });
          // 重新获取数据
          notesData = notesService.getAllNotes();
          console.log('生成培训产品研发数据后重新加载，笔记总数:', notesData.length);
          message.success(`已自动生成 ${trainingProductData.length} 条培训产品研发模拟数据`);
        } catch (error) {
          console.error('自动生成培训产品研发数据失败:', error);
        }
      }
      

      
      // 按分类统计
      const categoryStats = {};
      notesData.forEach(note => {
        categoryStats[note.category] = (categoryStats[note.category] || 0) + 1;
      });
      console.log('分类统计:', categoryStats);
      
      setNotes(notesData);
      
      // 获取分类和标签
      const categoriesData = notesService.getCategories();
      const tagsData = notesService.getTags();
      
      setNoteCategories(categoriesData);
      setTags(tagsData);
      
      // 获取统计信息
      const statsData = notesService.getNotesStats();
      console.log('=== 统计数据 ===');
      console.log('统计信息:', statsData);
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
    
    // 初始化默认AI工具
    initializeDefaultAITools();
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
          note.category === 'organizational_training' ||
          note.source === '组织培训'
        );
        
        // 在组织培训分类下，默认只显示进行中的项目
        if (showInProgressOnly) {
          filtered = filtered.filter(note => {
            const statusInfo = getTrainingStatusInfo(note);
            return statusInfo && statusInfo.status === TRAINING_STATUS.IN_PROGRESS;
          });
        }
      } else if (selectedCategory === 'learning_square') {
        // 筛选学习广场相关的笔记
        filtered = filtered.filter(note => 
          note.category === 'learning_square' ||
          note.tags?.includes('学习广场') ||
          note.source === '学习广场'
        );
      } else if (selectedCategory === 'training_product_development') {
        // 筛选培训产品研发相关的笔记
        filtered = filtered.filter(note => 
          note.category === 'training_product_development' ||
          note.tags?.includes('培训产品研发') ||
          note.source === '培训产品研发' ||
          note.courseType === 'training_product_development'
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
  }, [notes, selectedCategory, selectedTags, searchTerm, showInProgressOnly]);

  // 创建新笔记
  const handleCreateNote = () => {
    console.log('=== handleCreateNote 被调用 ===');
    console.log('当前 selectedCategory:', selectedCategory);
    console.log('当前 showNoteEditPage:', showNoteEditPage);
    console.log('当前 noteCreateModalVisible:', noteCreateModalVisible);
    
    // 直接创建新主题，不需要选择模版
    setEditingNote(null);
    setEditMode('create');
    setShowNoteEditPage(true);
    
    console.log('设置 showNoteEditPage 为 true');
    console.log('================================');
  };



  // 关闭编辑页面
  const handleCloseEditPage = () => {
    setShowNoteEditPage(false);
    setEditingNote(null);
    setEditMode('create');
  };

  // 编辑主题
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

  // 分享主题功能
  const handleShareTheme = (note = null) => {
    setShareSelectedNote(note || selectedNote);
    setIsShareModalVisible(true);
  };

  // 同步组织培训课程功能
  const handleSyncOrganizationalTraining = async () => {
    try {
      setLoading(true);
      
      // 直接使用智能笔记服务的同步功能，不依赖外部课程服务
      const result = notesService.syncOrganizationalCourses([]);
      
      if (result.success) {
        // 重新加载数据
        await loadData();
        
        if (result.syncedCount > 0) {
          message.success(`成功同步 ${result.syncedCount} 条组织培训课程`);
        } else {
          message.info('所有组织培训课程已同步，无新增内容');
        }
      } else {
        message.error(`同步失败：${result.error}`);
      }
    } catch (error) {
      console.error('同步组织培训课程失败:', error);
      message.error('同步组织培训课程失败');
    } finally {
      setLoading(false);
    }
  };

  // 同步选课功能（保留原有功能，但使用新的服务方法）
  const handleSyncCourseSelection = async () => {
    try {
      setLoading(true);
      
      // 直接使用智能笔记服务的同步功能，不依赖外部课程服务
      const result = notesService.syncOrganizationalCourses([]);
      
      if (result.success) {
        // 重新加载数据
        await loadData();
        
        if (result.syncedCount > 0) {
          message.success(`成功同步 ${result.syncedCount} 条选课记录`);
        } else {
          message.info('所有选课记录已同步，无新增内容');
        }
      } else {
        message.error(`同步失败：${result.error}`);
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
        const updatedContent = `## 智能摘要

${data}

---

${aiSelectedNote.content}`;
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
    console.log('=== 渲染 NoteEditPage ===');
    console.log('showNoteEditPage:', showNoteEditPage);
    console.log('selectedCategory:', selectedCategory);
    console.log('editingNote:', editingNote);
    console.log('editMode:', editMode);
    console.log('========================');
    
    return <NoteEditPage 
      onBack={handleCloseEditPage} 
      onViewChange={onViewChange} 
      note={editingNote}
      mode={editMode}
      selectedTemplate={null}
      selectedCategory={selectedCategory}
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
                  <span className="category-count">{(() => {
                    const orgTrainingNotes = notes.filter(note => 
                      note.courseType === 'organizational_training' || 
                      note.tags?.includes('组织培训') ||
                      note.category === 'organizational_training' ||
                      note.source === '组织培训'
                    );
                    // 只显示进行中的数量
                    const inProgressCount = orgTrainingNotes.filter(note => {
                      const statusInfo = getTrainingStatusInfo(note);
                      return statusInfo && statusInfo.status === TRAINING_STATUS.IN_PROGRESS;
                    }).length;
                    return inProgressCount;
                  })()}</span>
                </div>
                
                {/* 系统分类 */}
                <div className="category-group">
                  <div className="category-group-title">系统分类</div>
                  {categories.filter(category => 
                    category.value !== 'organizational_training' && 
                    (!category.type || category.type === 'system')
                  ).map(category => {
                    const iconMap = {
                      FileTextOutlined,
                      FolderOpenOutlined,
                      BookOutlined,
                      UserOutlined,
                      BulbOutlined,
                      StarOutlined,
                      NodeIndexOutlined,
                      RadarChartOutlined,
                      ExperimentOutlined
                    };
                    
                    // 对于新分类，直接使用emoji图标
                    const isEmojiIcon = category.icon && category.icon.length <= 2;
                    const IconComponent = isEmojiIcon ? null : (iconMap[category.icon] || FileTextOutlined);
                    
                    // 实时计算分类计数
                    let count = 0;
                    if (category.value === 'all') {
                      count = notes.length;
                    } else if (category.value === 'starred') {
                      count = notes.filter(note => note.starred).length;
                    } else if (category.value === 'learning_square') {
                      count = notes.filter(note => 
                        note.category === 'learning_square' ||
                        note.tags?.includes('学习广场') ||
                        note.source === '学习广场'
                      ).length;
                    } else {
                      count = notes.filter(note => note.category === category.value).length;
                    }
                    
                    return (
                      <div
                        key={category.value}
                        className={`category-item ${
                          selectedCategory === category.value ? 'active' : ''
                        }`}
                        onClick={() => setSelectedCategory(category.value)}
                      >
                        {isEmojiIcon ? (
                          <span className="category-icon">{category.icon}</span>
                        ) : (
                          <IconComponent className="category-icon" />
                        )}
                        <span className="category-label">{category.label}</span>
                        <span className="category-count">{count}</span>
                      </div>
                    );
                  })}
                </div>

                {/* 专业分类 */}
                <div className="category-group">
                  <div className="category-group-title">专业分类</div>
                  {categories.filter(category => category.type === 'fixed').map(category => {
                    const iconMap = {
                      FileTextOutlined,
                      FolderOpenOutlined,
                      BookOutlined,
                      UserOutlined,
                      BulbOutlined,
                      StarOutlined,
                      NodeIndexOutlined,
                      RadarChartOutlined,
                      ExperimentOutlined
                    };
                    
                    const IconComponent = iconMap[category.icon] || FileTextOutlined;
                    // 实时计算专业分类计数
                    const count = notes.filter(note => note.category === category.value).length;
                    
                    return (
                      <div
                        key={category.value}
                        className={`category-item fixed-category ${
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

                {/* 自定义分类 */}
                {categories.filter(category => category.type === 'custom').length > 0 && (
                  <div className="category-group">
                    <div className="category-group-title">自定义分类</div>
                    {categories.filter(category => category.type === 'custom').map(category => {
                      const iconMap = {
                        FileTextOutlined,
                        FolderOpenOutlined,
                        BookOutlined,
                        UserOutlined,
                        BulbOutlined,
                        StarOutlined,
                        NodeIndexOutlined,
                        RadarChartOutlined,
                        ExperimentOutlined
                      };
                      
                      const IconComponent = iconMap[category.icon] || FileTextOutlined;
                      // 实时计算自定义分类计数
                      const count = notes.filter(note => note.category === category.value).length;
                      
                      return (
                        <div
                          key={category.value}
                          className={`category-item custom-category ${
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
                )}
              </div>
            </div>


          </div>
        </Sider>

        {/* 主内容区 */}
        <Content className="notes-content">
          <div className="content-header">
            <div className="header-left">
              <Title level={3}>果仁-沉浸式AI学习空间</Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Text type="secondary">
                  共 {filteredNotes.length} 个主题
                  {selectedCategory !== 'all' && (
                    <span> · {getCategoryInfo(selectedCategory).label}</span>
                  )}
                </Text>
                
                {/* 布局切换控件 - 当组织培训数量较少时显示 */}
                {selectedCategory === 'organizational_training' && filteredNotes.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Text style={{ fontSize: '12px', color: '#666' }}>布局:</Text>
                    <Button.Group size="small">
                      <Button 
                        size="small"
                        type={viewMode === 'card' ? 'primary' : 'default'}
                        icon={<AppstoreOutlined />}
                        onClick={() => setViewMode('card')}
                        title="卡片布局"
                      />
                      <Button 
                        size="small"
                        type={viewMode === 'learning-center' ? 'primary' : 'default'}
                        icon={<UnorderedListOutlined />}
                        onClick={() => setViewMode('learning-center')}
                        title="学习中心布局"
                      />
                    </Button.Group>
                  </div>
                )}
              </div>
            </div>
            
            <div className="header-actions">
              <Space>
                <Button 
                  icon={<CalendarOutlined />}
                  onClick={() => setShowCalendarCenter(true)}
                >
                  我的日历
                </Button>
                <Button 
                  icon={<DatabaseOutlined />}
                  onClick={async () => {
                    try {
                      console.log('=== 点击生成模拟数据按钮 ===');
                      console.log('生成前检查localStorage:');
                      checkLocalStorageData();
                      
                      // 1. 生成模拟数据
                      console.log('开始调用 mockDataGenerator.generateAllMockData()');
                      const result = await mockDataGenerator.generateAllMockData();
                      console.log('生成结果:', result);
                      
                      console.log('生成后检查localStorage:');
                      checkLocalStorageData();
                      
                      if (result.success) {
                        console.log('开始重新加载数据...');
                        await loadData();
                        console.log('数据重新加载完成');
                        
                        // 2. 同步组织培训课程
                        console.log('开始同步组织培训课程...');
                        try {
                          // 直接使用智能笔记服务的同步功能，不依赖外部课程服务
                          const syncResult = notesService.syncOrganizationalCourses([]);
                          
                          if (syncResult.success) {
                              // 重新加载数据
                              await loadData();
                              
                              if (syncResult.syncedCount > 0) {
                                message.success(`已生成 ${result.stats.count} 条模拟数据并同步 ${syncResult.syncedCount} 条组织培训课程`);
                              } else {
                                message.success(`已生成 ${result.stats.count} 条模拟数据，所有组织培训课程已同步`);
                              }
                            } else {
                              message.success(`已生成 ${result.stats.count} 条模拟数据，同步组织培训失败：${syncResult.error}`);
                            }
                        } catch (syncError) {
                          console.error('同步组织培训课程失败:', syncError);
                          message.success(`已生成 ${result.stats.count} 条模拟数据，同步组织培训课程失败`);
                        }
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
                  新建主题
                </Button>
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
                description="暂无主题"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={handleCreateNote}>
                  创建第一个主题
                </Button>
              </Empty>
            ) : viewMode === 'learning-center' && selectedCategory === 'organizational_training' ? (
              // 学习中心布局 - 当组织培训数量较少时显示
              <div className="learning-center-layout">
                {filteredNotes.map(note => {
                  const trainingStatus = getTrainingStatusInfo(note);
                  
                  return (
                    <div key={note.id} className="learning-center-card" style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '20px',
                      color: 'white',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                      cursor: 'pointer'
                    }} onClick={() => handleEditNote(note)}>
                      
                      {/* 头部区域 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                            {note.title}
                          </h3>
                          
                          {trainingStatus && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                              <div style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                <span style={{ fontSize: '12px' }}>{trainingStatus.statusConfig.icon}</span>
                                <Text style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                                  {trainingStatus.statusConfig.label}
                                </Text>
                              </div>
                              
                              {trainingStatus.isInProgress && trainingStatus.remainingDays > 0 && (
                                <div style={{
                                  background: 'rgba(245, 34, 45, 0.9)',
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <span style={{ fontSize: '10px' }}>⏰</span>
                                  <Text style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>
                                    剩余{trainingStatus.remainingDays}天
                                  </Text>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          type="primary" 
                          ghost 
                          size="small"
                          icon={<PlayCircleOutlined />}
                          onClick={(e) => { e.stopPropagation(); handleViewNote(note); }}
                          style={{ borderColor: 'rgba(255,255,255,0.8)', color: 'white' }}
                        >
                          继续学习
                        </Button>
                      </div>
                      
                      {/* 进度区域 */}
                      {trainingStatus && trainingStatus.isInProgress && (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          borderRadius: '12px',
                          padding: '16px',
                          marginBottom: '16px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <Text style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>学习进度</Text>
                            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
                              {trainingStatus.currentProgress}% 完成
                            </Text>
                          </div>
                          
                          <Progress 
                            percent={trainingStatus.currentProgress} 
                            strokeColor={{
                              '0%': '#ffd700',
                              '50%': '#87ceeb',
                              '100%': '#98fb98'
                            }}
                            trailColor="rgba(255,255,255,0.2)"
                            showInfo={false}
                            style={{ marginBottom: '12px' }}
                          />
                          
                          {trainingStatus.dailyLearningTime.dailyMinutes > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '12px' }}>📖</span>
                              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
                                建议每日学习: {trainingStatus.dailyLearningTime.formattedTime}
                              </Text>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* 快捷操作区域 */}
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Button 
                          size="small" 
                          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}
                          onClick={(e) => { e.stopPropagation(); handleEditNote(note); }}
                        >
                          📝 编辑笔记
                        </Button>
                        
                        <Button 
                          size="small" 
                          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}
                          onClick={(e) => { e.stopPropagation(); handleShareTheme(note); }}
                        >
                          🔗 分享主题
                        </Button>
                        
                        <Button 
                          size="small" 
                          style={{ 
                            background: note.starred ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.2)', 
                            border: 'none', 
                            color: 'white'
                          }}
                          onClick={(e) => { e.stopPropagation(); handleToggleStar(note.id); }}
                        >
                          {note.starred ? '⭐ 已收藏' : '☆ 收藏'}
                        </Button>
                      </div>
                      
                      {/* 学习建议卡片 */}
                      {trainingStatus && trainingStatus.isInProgress && (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '12px',
                          marginTop: '16px',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px' }}>💡</span>
                            <Text style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>学习建议</Text>
                          </div>
                          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', lineHeight: '1.5' }}>
                            {trainingStatus.remainingDays <= 7 
                              ? '培训即将结束，建议加快学习进度，确保按时完成所有课程内容。'
                              : trainingStatus.currentProgress < 50
                              ? '当前进度较慢，建议每天增加学习时间，保持学习节奏。'
                              : '学习进度良好，继续保持当前的学习节奏，注意巩固已学知识。'
                            }
                          </Text>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {filteredNotes.map(note => {
                  const categoryInfo = getCategoryInfo(note.category);
                  return (
                    <Col xs={24} sm={12} lg={8} xl={6} key={note.id}>
                      <Card
                        className="note-card"
                        data-source={note.source}
                        hoverable
                        onClick={() => handleEditNote(note)}
                        style={{ cursor: 'pointer' }}
                        actions={[
                          <Tooltip title="查看详情">
                            <EyeOutlined onClick={(e) => { e.stopPropagation(); handleViewNote(note); }} />
                          </Tooltip>,
                          <Tooltip title="编辑">
                            <EditOutlined onClick={(e) => { e.stopPropagation(); handleEditNote(note); }} />
                          </Tooltip>,
                          <Tooltip title="分享主题">
                            <ShareAltOutlined onClick={(e) => { e.stopPropagation(); handleShareTheme(note); }} />
                          </Tooltip>,
                          <Tooltip title={note.starred ? '取消收藏' : '收藏'}>
                            {note.starred ? (
                              <StarFilled 
                                className="star-filled"
                                onClick={(e) => { e.stopPropagation(); handleToggleStar(note.id); }} 
                              />
                            ) : (
                              <StarOutlined 
                                onClick={(e) => { e.stopPropagation(); handleToggleStar(note.id); }} 
                              />
                            )}
                          </Tooltip>,
                          <Popconfirm
                            title="确定要删除这个主题吗？"
                            onConfirm={() => handleDeleteNote(note.id)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Tooltip title="删除">
                              <DeleteOutlined onClick={(e) => e.stopPropagation()} />
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
                            
                            {/* 组织培训状态显示 */}
                            {(() => {
                              const isOrgTraining = (
                                selectedCategory === 'organizational_training' ||
                                note.source === '组织培训' ||
                                note.tags?.includes('组织培训') ||
                                note.category === 'organizational_training' ||
                                note.courseType === 'organizational_training' ||
                                note.title?.includes('【组织培训】')
                              );
                              
                              if (isOrgTraining) {
                                try {
                                  const trainingStatus = getTrainingStatusInfo(note);
                                  
                                  if (trainingStatus) {
                                    const { statusConfig, isInProgress, remainingDays } = trainingStatus;
                                    return (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
                                        <span style={{ fontSize: '10px' }}>{statusConfig.icon}</span>
                                        <Text style={{ fontSize: '10px', color: statusConfig.color, fontWeight: 'bold' }}>
                                          {statusConfig.label}
                                        </Text>
                                        {isInProgress && remainingDays > 0 && (
                                          <Text style={{ fontSize: '9px', color: '#f5222d', fontWeight: 'bold' }}>
                                            剩余{remainingDays}天
                                          </Text>
                                        )}
                                      </div>
                                    );
                                  }
                                } catch (error) {
                                  console.error('获取培训状态失败:', error);
                                }
                              }
                              return null;
                            })()} 
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
                        
                        {/* 视频进度条 - 仅在组织培训分类下显示 */}
                        {(() => {
                          const shouldShow = (selectedCategory === 'organizational_training' || note.source === '组织培训');
                          const hasVideoInfo = !!note.videoInfo;
                          
                          // 调试信息
                          if (selectedCategory === 'organizational_training') {
                            console.log('笔记调试信息:', {
                              title: note.title,
                              selectedCategory,
                              noteSource: note.source,
                              shouldShow,
                              hasVideoInfo,
                              videoInfo: note.videoInfo
                            });
                          }
                          
                          if (shouldShow && hasVideoInfo) {
                            return (
                              <div className="video-progress-section" style={{ marginTop: 12, marginBottom: 8 }}>
                                {note.videoInfo.type === 'single_video' ? (
                                  <div className="single-video-progress">
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                      <Text style={{ fontSize: 12, color: '#666', marginRight: 8 }}>
                                        🎥 视频学习进度
                                      </Text>
                                      <Text style={{ fontSize: 11, color: '#999' }}>
                                        {note.videoInfo.progress}%
                                      </Text>
                                    </div>
                                    <Progress 
                                      percent={note.videoInfo.progress} 
                                      size="small" 
                                      strokeColor={
                                        note.videoInfo.progress === 100 ? '#52c41a' : 
                                        note.videoInfo.progress >= 50 ? '#1890ff' : '#faad14'
                                      }
                                      showInfo={false}
                                      style={{ marginBottom: 2 }}
                                    />
                                  </div>
                                ) : note.videoInfo.type === 'multi_video' ? (
                                  <div className="multi-video-progress">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                      <Text style={{ fontSize: 12, color: '#666' }}>
                                        🎥 视频课程 ({note.videoInfo.totalVideos}个视频)
                                      </Text>
                                      <Text style={{ fontSize: 11, color: '#999' }}>
                                        {note.videoInfo.overallProgress}%
                                      </Text>
                                    </div>
                                    <Progress 
                                      percent={note.videoInfo.overallProgress} 
                                      size="small" 
                                      strokeColor={
                                        note.videoInfo.overallProgress === 100 ? '#52c41a' : 
                                        note.videoInfo.overallProgress >= 50 ? '#1890ff' : '#faad14'
                                      }
                                      showInfo={false}
                                      style={{ marginBottom: 2 }}
                                    />
                                    <Text style={{ fontSize: 10, color: '#aaa' }}>
                                      已学习 {Math.round(note.videoInfo.watchedDuration / 60)}分钟 / 共 {Math.round(note.videoInfo.totalDuration / 60)}分钟
                                    </Text>
                                  </div>
                                ) : null}
                              </div>
                            );
                          }
                          
                          return null;
                        })()}
                        
                        {/* 组织学习时间显示 */}
                        {(() => {
                          // 更宽松的筛选条件，只要符合任意一个条件即可
                          const isOrgTraining = (
                            selectedCategory === 'organizational_training' ||
                            note.source === '组织培训' ||
                            note.tags?.includes('组织培训') ||
                            note.category === 'organizational_training' ||
                            note.courseType === 'organizational_training' ||
                            note.title?.includes('【组织培训】')
                          );
                          
                          const hasLearningSchedule = !!note.learningSchedule;
                          
                          // 调试信息
                          console.log('学习时间显示调试:', {
                            title: note.title,
                            selectedCategory,
                            isOrgTraining,
                            hasLearningSchedule,
                            learningSchedule: note.learningSchedule,
                            noteSource: note.source,
                            noteTags: note.tags,
                            noteCategory: note.category,
                            courseType: note.courseType
                          });
                          
                          if (isOrgTraining && hasLearningSchedule) {
                            return (
                              <div style={{
                                marginTop: 8,
                                marginBottom: 8,
                                padding: '6px 10px',
                                background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                                borderRadius: '6px',
                                border: '1px solid #91d5ff'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '12px' }}>🕒</span>
                                  <Text style={{ fontSize: '11px', color: '#1890ff', fontWeight: 'bold' }}>学习时间</Text>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '10px' }}>
                                  <div>
                                    <Text style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '10px' }}>开始：</Text>
                                    <Text style={{ color: '#52c41a', fontSize: '10px' }}>{note.learningSchedule.startTime}</Text>
                                  </div>
                                  <div>
                                    <Text style={{ color: '#f5222d', fontWeight: 'bold', fontSize: '10px' }}>结束：</Text>
                                    <Text style={{ color: '#f5222d', fontSize: '10px' }}>{note.learningSchedule.endTime}</Text>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          
                          return null;
                        })()}
                        
                        {/* 移除note-meta部分（时间和字数信息） */}
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

      {/* 新建主题弹窗 */}
      <NoteCreateModal
        visible={noteCreateModalVisible}
        onCancel={() => setNoteCreateModalVisible(false)}
        onSave={handleSaveNote}
        notes={notes}
        categories={noteCategories}
        tags={tags}
        noteCategory={selectedCategory}
      />

      {/* 主题分享弹窗 */}
      <ThemeShareModal
        visible={isShareModalVisible}
        onCancel={() => {
          setIsShareModalVisible(false);
          setShareSelectedNote(null);
        }}
        theme={shareSelectedNote ? {
          id: shareSelectedNote.id,
          name: shareSelectedNote.title,
          colors: {
            primary: '#1890ff',
            textPrimary: '#262626',
            background: '#ffffff'
          }
        } : null}
        sourceData={{
          files: [
            { id: 1, name: '教师专业发展指导手册.pdf', type: 'application/pdf', uploadTime: '刚刚' },
            { id: 2, name: '现代教育技术应用培训资料.pdf', type: 'application/pdf', uploadTime: '2分钟前' },
            { id: 3, name: '核心素养导向的课程设计指南.pdf', type: 'application/pdf', uploadTime: '5分钟前' }
          ],
          links: [
            { id: 1, url: 'https://teacher-training.edu.cn', title: '教师培训资源平台', addTime: '刚刚' },
            { id: 2, url: 'https://education-tech.org', title: '教育技术发展研究网', addTime: '3分钟前' },
            { id: 3, url: 'https://core-competency.edu', title: '核心素养教育资源库', addTime: '8分钟前' }
          ],
          texts: (() => {
            // 根据当前选择的分类返回相应的智能工具数据
            if (selectedCategory === 'training_product_development') {
              // 初始化培训产品研发记录数据
              if (!localStorage.getItem('training_product_development_records')) {
                const trainingProductDevelopmentRecords = mockDataGenerator.generateTrainingProductDevelopmentRecords();
                localStorage.setItem('training_product_development_records', JSON.stringify(trainingProductDevelopmentRecords));
                return trainingProductDevelopmentRecords;
              } else {
                const savedTrainingProductDevelopmentRecords = JSON.parse(localStorage.getItem('training_product_development_records'));
                return savedTrainingProductDevelopmentRecords;
              }
            } else {
              // 初始化培训方案记录数据
              if (!localStorage.getItem('training_plan_records')) {
                const trainingPlanRecords = mockDataGenerator.generateTrainingPlanRecords();
                return trainingPlanRecords;
              } else {
                const savedTrainingPlanRecords = JSON.parse(localStorage.getItem('training_plan_records'));
                return savedTrainingPlanRecords;
              }
            }
          })(),
          scenario: [
            { 
              id: 18, 
              title: '[AI生成] 智能场景：基于7个资料的个性化', 
              source: 'AI智能助手', 
              time: '刚刚', 
              type: 'scenario',
              isAIGenerated: true,
              status: 'completed',
              description: 'AI场景生成完成'
            },
            { 
              id: 19, 
              title: '[AI生成] 智能场景：课堂互动设计', 
              source: 'AI智能助手', 
              time: '6分钟前', 
              type: 'scenario',
              isAIGenerated: true,
              status: 'completed',
              description: 'AI场景生成完成'
            }
          ],
          text: [
            { id: 7, title: '手动标注记录 - 核心素养', source: '手动标注', time: '刚刚', type: 'text' },
            { id: 8, title: '规则标注执行 - 教学方法分类', source: '规则标注系统', time: '5分钟前', type: 'text' },
            { id: 20, title: '手动标注记录 - 学习目标', source: '手动标注', time: '18分钟前', type: 'text' }
          ],
          note: [
            { 
              id: 21, 
              title: '学习笔记示例', 
              source: '示例笔记', 
              time: '刚刚', 
              type: 'note',
              content: '<p>这是一个关于教学设计的学习笔记，包含了重要的理论知识和实践经验。</p>'
            },
            { 
              id: 22, 
              title: '课程反思笔记', 
              source: '个人笔记', 
              time: '10分钟前', 
              type: 'note',
              content: '<p>本次课程的教学反思和改进建议。</p>'
            }
          ],
          webcode: [
            { id: 23, title: '基于5个资料生成网页代码', source: '5个来源', time: '22分钟前', type: 'webcode' }
          ]
        }}
        operationRecords={{
          texts: [
            { id: 7, title: '手动标注记录 - 核心素养', source: '手动标注', time: '刚刚', type: 'text' },
            { id: 8, title: '规则标注执行 - 教学方法分类', source: '规则标注系统', time: '5分钟前', type: 'text' },
            { id: 20, title: '手动标注记录 - 学习目标', source: '手动标注', time: '18分钟前', type: 'text' }
          ],
          scenarios: [
            { 
              id: 18, 
              title: '[AI生成] 智能场景：基于7个资料的个性化', 
              source: 'AI智能助手', 
              time: '刚刚', 
              type: 'scenario',
              isAIGenerated: true,
              status: 'completed',
              description: 'AI场景生成完成'
            },
            { 
              id: 19, 
              title: '[AI生成] 智能场景：课堂互动设计', 
              source: 'AI智能助手', 
              time: '6分钟前', 
              type: 'scenario',
              isAIGenerated: true,
              status: 'completed',
              description: 'AI场景生成完成'
            }
          ],
          notes: [
            { 
              id: 21, 
              title: '学习笔记示例', 
              source: '示例笔记', 
              time: '刚刚', 
              type: 'note',
              content: '<p>这是一个关于教学设计的学习笔记，包含了重要的理论知识和实践经验。</p>'
            },
            { 
              id: 22, 
              title: '课程反思笔记', 
              source: '个人笔记', 
              time: '10分钟前', 
              type: 'note',
              content: '<p>本次课程的教学反思和改进建议。</p>'
            }
          ],
          webcodes: [
            { id: 23, title: '基于5个资料生成网页代码', source: '5个来源', time: '22分钟前', type: 'webcode' }
          ],
          'video-slicing': [
            { id: 24, title: '教学视频智能切片 - 核心知识点', source: '视频切片工具', time: '刚刚', type: 'video-slicing' },
            { id: 25, title: '培训课程视频分段处理', source: '视频切片工具', time: '5分钟前', type: 'video-slicing' },
            { id: 26, title: '微课视频自动切片', source: '视频切片工具', time: '10分钟前', type: 'video-slicing' }
          ]
        }}
        onShareSuccess={(type, result) => {
          setIsShareModalVisible(false);
          setShareSelectedNote(null);
          message.success('主题分享成功！');
        }}
      />

      {/* 日历中心模态框 */}
      <Modal
        title="我的日历"
        open={showCalendarCenter}
        onCancel={() => setShowCalendarCenter(false)}
        width="90%"
        style={{ top: 20 }}
        footer={null}
        destroyOnClose
      >
        <CalendarCenter />
      </Modal>
    </div>
  );
};

export default SmartNotes;