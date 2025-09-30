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
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNoteEditPage, setShowNoteEditPage] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editMode, setEditMode] = useState('create');
  const [viewMode, setViewMode] = useState('card');
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
    { value: 'learning_square', label: '学习广场', icon: '🎓', type: 'system' },
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
      
      // 加载笔记
      const notesData = await notesService.getAllNotes();
      console.log('加载的笔记数据:', notesData);
      setNotes(notesData);
      
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
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
      } else {
        filtered = filtered.filter(note => note.category === selectedCategory);
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

  // 处理收藏切换
  const handleToggleStar = async (noteId) => {
    try {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        const updatedNote = { ...note, starred: !note.starred };
        await notesService.updateNote(noteId, updatedNote);
        message.success(updatedNote.starred ? '已收藏' : '已取消收藏');
        loadData();
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
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

  return (
    <div className="smart-notes">
      <Layout>
        {/* 侧边栏 */}
        <NotesSidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          notes={notes}
          categories={categories}
        />

        {/* 主内容区 */}
        <Content className="notes-content">
          <NotesToolbar
            filteredNotes={filteredNotes}
            selectedCategory={selectedCategory}
            getCategoryInfo={getCategoryInfo}
            viewMode={viewMode}
            setViewMode={setViewMode}
            setShowCalendarCenter={setShowCalendarCenter}
            loadData={loadData}
            onCreateNote={handleCreateNote}
            checkLocalStorageData={checkLocalStorageData}
          />

          <NotesList
            loading={loading}
            filteredNotes={filteredNotes}
            viewMode={viewMode}
            selectedCategory={selectedCategory}
            getCategoryInfo={getCategoryInfo}
            handleCreateNote={handleCreateNote}
            handleEditNote={handleEditNote}
            handleViewNote={handleViewNote}
            handleShareTheme={handleShareTheme}
            handleToggleStar={handleToggleStar}
            handleDeleteNote={handleDeleteNote}
            getTrainingStatusInfo={getTrainingStatusInfo}
          />
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
        selectedNote={shareSelectedNote}
        recentData={{
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