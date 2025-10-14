import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  Table,
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
import { PushpinOutlined, PushpinFilled } from '@ant-design/icons';
import NoteEditor from './NoteEditor';
import CategoryTagManager from './CategoryTagManager';
import AIAssistant from './AIAssistant';
import AdvancedSearch from './AdvancedSearch';
import ImportExport from './ImportExport';
import NoteCreateModal from './NoteCreateModal';
import NoteEditPage from './NoteEditPage';
import ThemeShareModal from './ThemeShareModal';
import CalendarCenter from './CalendarCenter';
import NotesSidebar from './NotesSidebar';
import NotesToolbar from './NotesToolbar';
import NotesList from './NotesList';

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

// 初始化默认AI工具
const initializeDefaultAITools = () => {
  const defaultTools = [
    {
      id: 'text-annotation',
      name: '文本标注',
      description: '智能标注文本内容',
      icon: '🏷️',
      category: 'annotation',
      enabled: true
    },
    {
      id: 'scenario-generation',
      name: '场景生成',
      description: 'AI生成学习场景',
      icon: '🎭',
      category: 'generation',
      enabled: true
    },
    {
      id: 'note-assistant',
      name: '笔记助手',
      description: '智能笔记整理',
      icon: '📝',
      category: 'assistant',
      enabled: true
    },
    {
      id: 'webcode-generator',
      name: '网页代码生成',
      description: '基于资料生成网页代码',
      icon: '💻',
      category: 'generation',
      enabled: true
    }
  ];

  const existingTools = localStorage.getItem('ai_tools');
  if (!existingTools) {
    localStorage.setItem('ai_tools', JSON.stringify(defaultTools));
  }
  
  return defaultTools;
};

const SmartNotes = ({ onViewChange }) => {
  // 按分类持久化视图模式的存储键与默认映射
  const VIEW_BY_CATEGORY_KEY = 'smartnotes:viewByCategory';
  const DEFAULT_VIEW_BY_CATEGORY = {
    all: 'grid',
    organizational_training: 'grid',
    work: 'grid',
    study: 'list',
    research: 'list',
    personal: 'grid',
    ideas: 'list',
    meeting: 'list',
    learning_square: 'grid'
  };
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('organizational_training');
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNoteEditPage, setShowNoteEditPage] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editMode, setEditMode] = useState('create');
  const [viewMode, setViewMode] = useState('grid');
  const [viewByCategory, setViewByCategory] = useState(DEFAULT_VIEW_BY_CATEGORY);

  // 初始化时读取按分类的视图映射并应用当前分类的视图
  useEffect(() => {
    try {
      const raw = localStorage.getItem(VIEW_BY_CATEGORY_KEY);
      const savedMap = raw ? JSON.parse(raw) : {};
      const merged = { ...DEFAULT_VIEW_BY_CATEGORY, ...savedMap };
      setViewByCategory(merged);
      const initialMode = merged[selectedCategory] || 'grid';
      if (initialMode === 'grid' || initialMode === 'list' || initialMode === 'favorites') {
        setViewMode(initialMode);
      }
    } catch (e) {
      console.warn('读取分类视图映射失败:', e);
    }
  }, []);

  // 视图模式变更：按当前分类写入本地映射
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    try {
      const nextMap = { ...viewByCategory, [selectedCategory]: mode };
      setViewByCategory(nextMap);
      localStorage.setItem(VIEW_BY_CATEGORY_KEY, JSON.stringify(nextMap));
    } catch (e) {}
  };

  // 分类切换：应用该分类对应的视图模式（优先本地映射，否则用默认映射）
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const mode = (viewByCategory && viewByCategory[category]) || DEFAULT_VIEW_BY_CATEGORY[category] || 'grid';
    if (mode === 'grid' || mode === 'list' || mode === 'favorites') {
      setViewMode(mode);
    }
  };
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [shareSelectedNote, setShareSelectedNote] = useState(null);
  const [showCalendarCenter, setShowCalendarCenter] = useState(false);

  // 笔记分类
  const categories = [
    { value: 'all', label: '全部主题', icon: '📝', type: 'system' },
    { value: 'work', label: '工作主题', icon: '💼', type: 'system' },
    { value: 'study', label: '学习主题', icon: '📚', type: 'system' },
    { value: 'research', label: '研究主题', icon: '🔬', type: 'system' },
    { value: 'personal', label: '个人主题', icon: '👤', type: 'system' },
    { value: 'ideas', label: '想法灵感', icon: '💡', type: 'system' },
    { value: 'meeting', label: '会议记录', icon: '🤝', type: 'system' },
    { value: 'learning_analytics', label: '学情分析', icon: '📈', type: 'system' },
    { value: 'educational_topics', label: '教育课题', icon: '📑', type: 'system' },
    { value: 'classroom_integration', label: '课堂融合', icon: '🧩', type: 'system' },
    { value: 'learning_square', label: '学习广场', icon: '🎓', type: 'system' },
    { value: 'teaching_design', label: '教学设计', icon: '🎯', type: 'system' },
    { value: 'homework_system', label: '课后作业', icon: '📘', type: 'system' },
    { value: 'teaching_research_office', label: '教研室', icon: '🏫', type: 'system' },
    { value: 'training_needs_management', label: '培训需求管理', icon: '📋', type: 'system' },
    { value: 'training_product_development', label: '培训产品研发', icon: '🚀', type: 'system' },
    { value: 'knowledge_graph', label: '知识图谱', icon: 'NodeIndexOutlined', type: 'fixed' },
    { value: 'capability_model', label: '能力模型', icon: 'RadarChartOutlined', type: 'fixed' },
    { value: 'micro_specialization', label: '微专业', icon: 'ExperimentOutlined', type: 'fixed' }
  ];

  // 检查localStorage数据的辅助函数
  const checkLocalStorageData = () => {
    const keys = ['smart_notes', 'note_categories', 'ai_tools'];
    keys.forEach(key => {
      const data = localStorage.getItem(key);
      console.log(`${key}:`, data ? JSON.parse(data) : null);
    });
  };

  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true);
      
      // 初始化默认AI工具
      initializeDefaultAITools();
      
      // 首次加载强制生成模拟数据（一次性）
      const FIRST_INIT_KEY = 'smart_notes_first_init_v1';
      const isFirstInit = localStorage.getItem(FIRST_INIT_KEY) !== 'true';
      if (isFirstInit) {
        console.log('首次加载：强制生成模拟数据');
        const resultInit = await mockDataGenerator.generateAllMockData();
        console.log('首次生成结果:', resultInit);
        localStorage.setItem(FIRST_INIT_KEY, 'true');
        if (resultInit && resultInit.success) {
          message.success('首次加载已初始化模拟数据');
        } else {
          message.error('首次加载模拟数据生成失败');
        }
      }

      // 加载笔记
      let notesData = await notesService.getAllNotes();
      // 统一更新组织培训“进行中”主题的结束日期为12月31日
      try {
        const updatedCount = notesService.updateOrgTrainingInProgressEndDateToDecember31();
        if (updatedCount > 0) {
          notesData = await notesService.getAllNotes();
          console.log(`已批量更新组织培训进行中主题结束日期，数量: ${updatedCount}`);
        }
      } catch (e) {
        console.warn('更新组织培训结束日期过程出现问题:', e);
      }
      console.log('=== 数据加载调试信息 ===');
      console.log('加载的笔记数据:', notesData);
      console.log('总笔记数量:', notesData.length);
      
      // 检查教研室数据
      const teachingResearchNotes = notesData.filter(note => note.category === 'teaching_research_office');
      console.log('教研室笔记数量:', teachingResearchNotes.length);
      console.log('教研室笔记标题:', teachingResearchNotes.map(note => note.title));
      
      // 检查localStorage原始数据
      const rawData = localStorage.getItem('smart_notes_data');
      console.log('localStorage原始数据长度:', rawData ? rawData.length : 0);

      // 无数据时自动生成（避免与首次强制生成重复提示）
      try {
        const parsed = JSON.parse(rawData || '[]');
        const needGenerateDueToEmpty = (!rawData || !Array.isArray(parsed) || parsed.length === 0 || notesData.length === 0);
        if (!isFirstInit && needGenerateDueToEmpty) {
          console.log('未检测到笔记数据，自动生成模拟数据...');
          const result = await mockDataGenerator.generateAllMockData();
          console.log('自动生成结果:', result);
          if (result && result.success) {
            notesData = await notesService.getAllNotes();
            message.success('已自动生成模拟数据');
          } else {
            message.error('自动生成模拟数据失败');
          }
        }
      } catch (e) {
        console.warn('解析初始数据失败，尝试生成模拟数据:', e);
        if (!isFirstInit) {
          const result = await mockDataGenerator.generateAllMockData();
          if (result && result.success) {
            notesData = await notesService.getAllNotes();
            message.success('已自动生成模拟数据');
          }
        }
      }
      
      setNotes(notesData);
      
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 生成模拟数据的处理函数
  const handleGenerateMockData = async () => {
    try {
      console.log('=== 开始生成模拟数据 ===');
      const result = await mockDataGenerator.generateAllMockData();
      console.log('生成结果:', result);
      
      // 重新加载数据
      await loadData();
      
      // 检查生成后的数据
      const notes = JSON.parse(localStorage.getItem('smart_notes_data') || '[]');
      console.log('总笔记数量:', notes.length);
      
      const teachingResearchNotes = notes.filter(note => note.category === 'teaching_research_office');
      console.log('教研室笔记数量:', teachingResearchNotes.length);
      console.log('教研室笔记标题:', teachingResearchNotes.map(note => note.title));
      
      message.success('模拟数据生成成功！');
    } catch (error) {
      console.error('生成模拟数据失败:', error);
      message.error('生成模拟数据失败');
    }
  };

  // 过滤笔记
  useEffect(() => {
    let filtered = notes;
    
    // 按分类过滤
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'starred') {
        filtered = filtered.filter(note => note.starred);
      } else if (selectedCategory === 'organizational_training') {
        filtered = filtered.filter(note => 
          note.courseType === 'organizational_training' || 
          note.tags?.includes('组织培训') ||
          note.category === 'organizational_training' ||
          note.source === '组织培训'
        );
      } else if (selectedCategory === 'learning_square') {
        filtered = filtered.filter(note => 
          note.category === 'learning_square' ||
          note.tags?.includes('学习广场') ||
          note.source === '学习广场'
        );
      } else if (selectedCategory === 'homework_system') {
        filtered = filtered.filter(note => 
          note.category === 'homework_system' ||
          note.tags?.includes('课后作业') ||
          note.tags?.includes('作业') ||
          note.source === '课后作业'
        );
      } else if (selectedCategory === 'teaching_design') {
        filtered = filtered.filter(note => 
          note.category === 'teaching_design' ||
          note.tags?.includes('教学设计') ||
          note.source === '教学设计'
        );
      } else if (selectedCategory === 'teaching_research_office') {
        filtered = filtered.filter(note => 
          note.category === 'teaching_research_office' ||
          note.tags?.includes('教研室') ||
          note.source === '教研室'
        );
      } else {
        filtered = filtered.filter(note => note.category === selectedCategory);
        // 非组织培训分类下，排除组织培训数据，避免分类互相覆盖
        filtered = filtered.filter(note => note.category !== 'organizational_training' && note.courseType !== 'organizational_training');
      }
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredNotes(filtered);
  }, [notes, selectedCategory, searchTerm]);

  // 获取分类信息
  const getCategoryInfo = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category || { label: '未知分类', icon: 'FileTextOutlined' };
  };

  // 处理创建笔记
  const handleCreateNote = () => {
    setEditingNote(null);
    setEditMode('create');
    setShowNoteEditPage(true);
  };

  // 处理编辑笔记
  const handleEditNote = (note) => {
    setEditingNote(note);
    setEditMode('edit');
    setShowNoteEditPage(true);
  };

  // 处理查看笔记
  const handleViewNote = (note) => {
    setEditingNote(note);
    setEditMode('view');
    setShowNoteEditPage(true);
  };

  // 处理删除笔记
  const handleDeleteNote = async (noteId) => {
    try {
      await notesService.deleteNote(noteId);
      message.success('删除成功');
      loadData();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 处理置顶切换（每个分类仅允许一个置顶）
  const handleTogglePin = async (noteId) => {
    try {
      const note = notes.find(n => n.id === noteId);
      if (!note) return;

      const now = new Date().toISOString();
      const category = note.category || selectedCategory;
      const isCurrentlyPinned = !!note.pinned;

      // 若要置顶该主题，先取消同分类下其他主题的置顶
      if (!isCurrentlyPinned) {
        const othersPinned = notes.filter(n => n.id !== noteId && (n.category || selectedCategory) === category && n.pinned);
        await Promise.all(
          othersPinned.map(n => notesService.updateNote(n.id, { ...n, pinned: false, pinnedAt: null }))
        );
      }

      // 更新当前主题的置顶状态
      const updatedNote = {
        ...note,
        pinned: !isCurrentlyPinned,
        pinnedAt: !isCurrentlyPinned ? now : null
      };
      await notesService.updateNote(noteId, updatedNote);
      message.success(updatedNote.pinned ? '已置顶' : '已取消置顶');
      loadData();
    } catch (error) {
      console.error('置顶操作失败:', error);
      message.error('操作失败');
    }
  };

  // 处理主题分享
  const handleShareTheme = (note) => {
    setShareSelectedNote(note);
    setIsShareModalVisible(true);
  };

  // 关闭编辑页面
  const handleCloseEditPage = () => {
    setShowNoteEditPage(false);
    setEditingNote(null);
    loadData(); // 重新加载数据以反映更改
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadData();
  }, []);

  // 如果显示笔记编辑页面，则渲染编辑页面
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

  // 计算当前分类下最近收藏的主题（基于当前分类过滤后的列表）
  const pinnedInCategory = filteredNotes.filter(n => n.pinned);
  const recentFavoriteNote = pinnedInCategory
    .slice()
    .sort((a, b) => {
      const ta = new Date(a.pinnedAt || a.updatedAt || a.createdAt || 0).getTime();
      const tb = new Date(b.pinnedAt || b.updatedAt || b.createdAt || 0).getTime();
      return tb - ta;
    })[0];

  const listColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, note) => (
        <Button type="link" onClick={() => handleEditNote(note)}>{text}</Button>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const info = getCategoryInfo ? getCategoryInfo(category) : { label: category };
        return info?.label || category || '-';
      }
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (tags && tags.length ? tags.map(t => (<Tag key={t}>{t}</Tag>)) : '-')
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      render: (source) => source || '-'
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (val, note) => {
        const d = val || note.createdAt;
        try { return d ? new Date(d).toLocaleString() : '-'; } catch { return '-'; }
      }
    },
    {
      title: '置顶',
      dataIndex: 'pinned',
      key: 'pinned',
      render: (pinned, note) => (
        pinned ? (
          <PushpinFilled onClick={() => handleTogglePin && handleTogglePin(note.id)} style={{ color: '#fa8c16', cursor: 'pointer' }} />
        ) : (
          <PushpinOutlined onClick={() => handleTogglePin && handleTogglePin(note.id)} style={{ cursor: 'pointer' }} />
        )
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, note) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewNote(note)} />
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEditNote(note)} />
          <Popconfirm title="确定删除该主题？" onConfirm={() => handleDeleteNote(note.id)}>
            <Button icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="smart-notes">
      <Layout>
        {/* 侧边栏：在收藏视图下隐藏以便编辑页全宽展示 */}
        {viewMode !== 'favorites' && (
          <NotesSidebar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            notes={notes}
            categories={categories}
          />
        )}

        {/* 主内容区：收藏视图采用无内边距白底模式；列表视图减少内边距以充分利用空间 */}
        <Content className={`notes-content ${viewMode === 'favorites' ? 'favorites-mode' : (viewMode === 'list' ? 'list-mode' : '')}`}>
          <NotesToolbar
            filteredNotes={filteredNotes}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onCreateNote={handleCreateNote}
            onGenerateMockData={handleGenerateMockData}
            selectedCategory={selectedCategory}
          />

          {viewMode === 'favorites' ? (
            recentFavoriteNote ? (
              <NoteEditPage
                onBack={() => setViewMode('grid')}
                onViewChange={onViewChange}
                note={recentFavoriteNote}
                mode="view"
                selectedTemplate={null}
                selectedCategory={selectedCategory}
              />
              
            ) : (
              <Empty description="当前分类下暂无置顶主题" />
            )
          ) : viewMode === 'list' ? (
            <Table
              columns={listColumns}
              dataSource={filteredNotes}
              rowKey={note => note.id || note.title}
              pagination={false}
              size="middle"
              style={{ width: '100%' }}
            />
          ) : (
            <NotesList
              loading={loading}
              filteredNotes={filteredNotes}
              viewMode={viewMode}
              selectedCategory={selectedCategory}
              getCategoryInfo={getCategoryInfo}
              handleCreateNote={handleCreateNote}
              handleEditNote={handleEditNote}
              handleViewNote={handleViewNote}
              handleUpdateTags={async (noteId, newTags) => {
                try {
                  const note = notes.find(n => n.id === noteId);
                  if (note) {
                    const updatedNote = { ...note, tags: newTags };
                    await notesService.updateNote(noteId, updatedNote);
                    message.success('标签已更新');
                    loadData();
                  }
                } catch (error) {
                  console.error('更新标签失败:', error);
                  message.error('更新标签失败');
                }
              }}
              handleShareTheme={handleShareTheme}
              handleToggleStar={handleTogglePin}
              handleDeleteNote={handleDeleteNote}
              getTrainingStatusInfo={getTrainingStatusInfo}
            />
          )}
        </Content>
      </Layout>

      {/* 笔记编辑器模态框 */}
      <Modal
        title="编辑笔记"
        open={showNoteEditor}
        onCancel={() => setShowNoteEditor(false)}
        width="80%"
        footer={null}
        destroyOnHidden
      >
        <NoteEditor
          note={editingNote}
          onSave={async (noteData) => {
            try {
              if (editingNote) {
                await notesService.updateNote(editingNote.id, noteData);
                message.success('更新成功');
              } else {
                await notesService.createNote(noteData);
                message.success('创建成功');
              }
              setShowNoteEditor(false);
              loadData();
            } catch (error) {
              console.error('保存失败:', error);
              message.error('保存失败');
            }
          }}
          onCancel={() => setShowNoteEditor(false)}
        />
      </Modal>

      {/* 分类标签管理模态框 */}
      <Modal
        title="分类标签管理"
        open={showCategoryManager}
        onCancel={() => setShowCategoryManager(false)}
        width="60%"
        footer={null}
        destroyOnHidden
      >
        <CategoryTagManager
          onClose={() => {
            setShowCategoryManager(false);
            loadData(); // 重新加载数据以反映分类更改
          }}
        />
      </Modal>

      {/* AI助手模态框 */}
      <Modal
        title="AI智能助手"
        open={showAIAssistant}
        onCancel={() => setShowAIAssistant(false)}
        width="80%"
        footer={null}
        destroyOnHidden
      >
        <AIAssistant
          onClose={() => setShowAIAssistant(false)}
        />
      </Modal>

      {/* 高级搜索模态框 */}
      <Modal
        title="高级搜索"
        open={showAdvancedSearch}
        onCancel={() => setShowAdvancedSearch(false)}
        width="70%"
        footer={null}
        destroyOnHidden
      >
        <AdvancedSearch
          notes={notes}
          onClose={() => setShowAdvancedSearch(false)}
          onSelectNote={(note) => {
            setShowAdvancedSearch(false);
            handleViewNote(note);
          }}
        />
      </Modal>

      {/* 导入导出模态框 */}
      <Modal
        title="导入导出"
        open={showImportExport}
        onCancel={() => setShowImportExport(false)}
        width="60%"
        footer={null}
        destroyOnHidden
      >
        <ImportExport
          onClose={() => {
            setShowImportExport(false);
            loadData(); // 重新加载数据以反映导入的更改
          }}
        />
      </Modal>

      {/* 创建笔记模态框 */}
      <Modal
        title="创建新笔记"
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        width="50%"
        footer={null}
        destroyOnHidden
      >
        <NoteCreateModal
          noteCategory={selectedCategory}
          onClose={() => setShowCreateModal(false)}
          onCreate={(noteData) => {
            setShowCreateModal(false);
            handleEditNote({ ...noteData, id: Date.now() });
          }}
        />
      </Modal>

      {/* 主题分享模态框 */}
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
          uploadedFiles: [
            { id: 1, name: '教师专业发展指导手册.pdf', type: 'application/pdf', uploadTime: '刚刚' },
            { id: 2, name: '现代教育技术应用培训资料.pdf', type: 'application/pdf', uploadTime: '2分钟前' }
          ],
          links: [
            { id: 1, url: 'https://teacher-training.edu.cn', title: '教师培训资源平台', addTime: '刚刚' },
            { id: 2, url: 'https://education-tech.org', title: '教育技术发展研究网', addTime: '3分钟前' }
          ],
          addedTexts: [
            { id: 21, title: '学习笔记示例', source: '示例笔记', time: '刚刚', type: 'text' },
            { id: 22, title: '课程反思笔记', source: '个人笔记', time: '10分钟前', type: 'text' }
          ],
          courseVideos: [],
          organizationalCourses: []
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
        destroyOnHidden
      >
        <CalendarCenter />
      </Modal>
    </div>
  );
};

export default SmartNotes;