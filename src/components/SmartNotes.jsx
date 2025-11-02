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
  import SystemCategoryManager from './SystemCategoryManager';
import NotesToolbar from './NotesToolbar';
import NotesList from './NotesList';

import notesService from '../services/notesService';
import themeShareService from '../services/themeShareService';
import mockDataGenerator from '../utils/mockDataGenerator';
import { TRAINING_STATUS, getTrainingStatusInfo } from '../utils/trainingStatusUtils';
import { generateTrainingProductDevelopmentData } from '../data/trainingProductDevelopmentData';
import './SmartNotes.css';
import certificateService from '../services/certificateService';

import { DEFAULT_SYSTEM_CATEGORY_CONFIG, saveSystemCategoryConfig } from '../services/categoryConfigService';

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
  const [systemCategoryConfigVersion, setSystemCategoryConfigVersion] = useState(0);
  const [isSystemCategoryManagerVisible, setIsSystemCategoryManagerVisible] = useState(false);
  const [systemCategoryManagerContext, setSystemCategoryManagerContext] = useState(null);

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

  // 新增：一次性按图示重置“我的分类”分组到默认配置
  useEffect(() => {
    try {
      const RESET_FLAG = 'reset_my_categories_to_image_v1';
      if (localStorage.getItem(RESET_FLAG) !== 'true') {
        const ok = saveSystemCategoryConfig(DEFAULT_SYSTEM_CATEGORY_CONFIG);
        if (ok) {
          localStorage.setItem(RESET_FLAG, 'true');
          setSystemCategoryConfigVersion(v => v + 1);
          message.success('已按图示重新整理“我的分类”');
        }
      }
    } catch (e) {
      console.warn('重置系统分类失败:', e);
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
    { value: 'work', label: '工作主题', icon: 'FolderOpenOutlined', type: 'system' },
    { value: 'study', label: '学习主题', icon: 'BookOutlined', type: 'system' },
    { value: 'research', label: '研究主题', icon: 'ExperimentOutlined', type: 'system' },
    { value: 'personal', label: '个人主题', icon: 'UserOutlined', type: 'system' },
    { value: 'ideas', label: '想法灵感', icon: 'BulbOutlined', type: 'system' },
    { value: 'meeting', label: '会议记录', icon: 'TeamOutlined', type: 'system' },
    { value: 'learning_analytics', label: '学情分析', icon: 'RadarChartOutlined', type: 'system' },
    { value: 'educational_topics', label: '教育课题', icon: 'FileTextOutlined', type: 'system' },
    { value: 'classroom_integration', label: '课堂融合', icon: 'NodeIndexOutlined', type: 'system' },
    { value: 'learning_square', label: '学习广场', icon: 'BookOutlined', type: 'system' },
    { value: 'teaching_design', label: '教学设计', icon: 'BulbOutlined', type: 'system' },
    { value: 'my_evaluation', label: '我的评阅', icon: 'FileTextOutlined', type: 'system' },
    { value: 'e_pbl', label: 'E-PBL', icon: 'BookOutlined', type: 'system' },
    { value: 'homework_system', label: '课后作业', icon: 'FileTextOutlined', type: 'system' },
    { value: 'teaching_research_office', label: '教研室', icon: 'BookOutlined', type: 'system' },
    { value: 'training_needs_management', label: '培训需求管理', icon: 'FileTextOutlined', type: 'system' },
    { value: 'training_product_development', label: '培训产品研发', icon: 'ExperimentOutlined', type: 'system' },
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
        // 确保未开始的组织培训主题存在（避免模拟数据覆盖）
        try {
          const notesAfterInit = await notesService.getAllNotes();
          const hasDefault = Array.isArray(notesAfterInit) && notesAfterInit.some(n => (
            n?.courseId === 'org_default_not_started' ||
            (typeof n?.title === 'string' && n.title.trim() === '【组织培训】未开始主题')
          ));
          if (!hasDefault) {
            const today = new Date();
            const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
            const dateStr = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}`;
            const baseTags = ['组织培训', '教师培训', '未开始', '待开班', '培训安排', '教学策略', '班级管理', '教学评估', '教育技术'];
            const content = `# 教师培训 · 未开始主题\n\n## 主题简介\n- 面向教师的组织化培训，作为预备入口，当前未开始。\n- 聚焦教学能力提升、班级管理与教学评估，包含教育技术应用。\n\n## 培训目标\n- 明确教学目标与评价标准\n- 完成资料准备与设备测试\n- 制定时间计划与提醒机制\n\n## 模块目录\n- 新教师入职导引\n- 班级管理实务\n- 教学设计与策略\n- 教学评估与反馈\n- 教育技术与信息化\n\n## 标签\n${baseTags.map(t => `- ${t}`).join('\n')}\n\n## 说明\n- 当前进度为 0%\n- 状态：未开始\n- 开班后自动转入“进行中”\n\n——\n来源：组织培训系统\n课程ID：org_default_not_started`;
            await notesService.createNote({
              title: '【组织培训】未开始主题',
              content,
              category: 'organizational_training',
              tags: baseTags,
              source: '组织培训',
              courseId: 'org_default_not_started',
              courseType: 'organizational_training',
              learningSchedule: {
                startTime: `${dateStr} 09:00`,
                endTime: `${dateStr} 17:00`
              }
            });
          }
        } catch (e) {
          console.warn('确保未开始主题卡片存在失败:', e);
        }
      }

      // 加载笔记
      let notesData = await notesService.getAllNotes();

      // 初始化 E-PBL 分类说明主题（一次性）
      try {
        const EPBL_KEY = 'migration_epbl_intro_created';
        const already = localStorage.getItem(EPBL_KEY) === 'true';
        const hasEpblIntro = Array.isArray(notesData) && notesData.some(n => n.category === 'e_pbl' && (n.title || '').includes('分类说明'));
        if (!already && !hasEpblIntro) {
          const intro = await notesService.createNote({
            title: '【E-PBL】分类说明',
            content: `# E-PBL 分类说明\n\n- E-PBL（教育项目式学习）相关主题入口。\n- 介绍参见：[E-PBL 项目式学习](https://aic-fe.bnu.edu.cn/gnhz/gnhzepbl/index.html)\n\n可在此记录项目式学习的教学设计、实施过程、评估与反思等内容。`,
            category: 'e_pbl',
            tags: ['教学', 'E-PBL', '项目式学习']
          });
          await notesService.updateNote(intro.id, { pinned: true, pinnedAt: new Date().toISOString() });
          localStorage.setItem(EPBL_KEY, 'true');
          // 重新获取最新数据，确保置顶状态生效
          notesData = await notesService.getAllNotes();
        }
      } catch (e) {
        console.warn('初始化 E-PBL 分类说明主题失败:', e);
      }

      // 同步 E-PBL 分类仅保留指定四个主题
      try {
        const desiredEpblTitles = [
          '“神奇动物在哪里” 项目式学习',
          '“少年派的奇幻漂流”项目式学习',
          '为什么有些人喝了咖啡反而更困?',
          '社区智能灭火垃圾桶'
        ];
        const isDesired = (title) => desiredEpblTitles.includes(String(title || '').trim());
        const epblNotes = Array.isArray(notesData) ? notesData.filter(n => n.category === 'e_pbl') : [];

        // 删除 E-PBL 分类下非指定主题
        for (const note of epblNotes) {
          if (!isDesired(note.title)) {
            try { notesService.deleteNote(note.id); } catch (e) { console.warn('删除非指定 E-PBL 主题失败:', e); }
          }
        }

        // 创建缺失的四个主题（若不存在则创建）
        const existingTitles = new Set((Array.isArray(notesData) ? notesData : []).filter(n => n.category === 'e_pbl').map(n => String(n.title || '').trim()));
        const createIfMissing = async (title, content) => {
          if (!existingTitles.has(title)) {
            try {
              await notesService.createNote({
                title,
                content,
                category: 'e_pbl',
                tags: ['E-PBL', '项目式学习']
              });
            } catch (e) { console.warn('创建指定 E-PBL 主题失败:', title, e); }
          }
        };
        await createIfMissing('“神奇动物在哪里” 项目式学习', '# 项目式学习：神奇动物在哪里\n\n围绕电影或文本素材开展跨学科探究，设计任务、分组协作、制作成果展示。');
        await createIfMissing('“少年派的奇幻漂流”项目式学习', '# 项目式学习：少年派的奇幻漂流\n\n结合文学与科学视角，开展主题探究与作品创作，强调合作与反思。');
        await createIfMissing('为什么有些人喝了咖啡反而更困?', '# 科学探究：咖啡因与困倦\n\n从生理机制、个体差异与习惯因素展开探究，提出假设并设计验证。');
        await createIfMissing('社区智能灭火垃圾桶', '# 工程项目：智能灭火垃圾桶\n\n围绕社区安全与工程设计，完成方案设计、原型制作与测试评估。');

        // 重新获取最新数据以反映删除/新增
        notesData = await notesService.getAllNotes();

        // 去重：每个指定标题仅保留最新一条（按updatedAt降序）
        const latestByTitle = new Map();
        const epblDesiredNotes = notesData.filter(n => n.category === 'e_pbl' && isDesired(n.title));
        epblDesiredNotes.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
        for (const note of epblDesiredNotes) {
          const key = String(note.title || '').trim();
          if (!latestByTitle.has(key)) {
            latestByTitle.set(key, note);
          } else {
            try { await notesService.deleteNote(note.id); } catch (e) { console.warn('删除重复 E-PBL 主题失败:', e); }
          }
        }

        // 重新获取数据以反映去重删除
        notesData = await notesService.getAllNotes();
      } catch (e) {
        console.warn('同步 E-PBL 指定主题失败:', e);
      }
      
      // 数据迁移：为培训需求管理笔记添加trainingStatus和implementationSchedule字段
      let needsMigration = false;
      notesData = notesData.map(note => {
        if (note.category === 'training_needs_management') {
          let needsUpdate = false;
          let updatedNote = { ...note };
          
          // 添加trainingStatus字段
          if (!note.trainingStatus) {
            needsUpdate = true;
            // 根据笔记标题或内容分配默认状态
            let defaultStatus = 'planning';
            if (note.title.includes('骨干') || note.title.includes('已结束')) {
              defaultStatus = 'completed';
            } else if (note.title.includes('入职') || note.title.includes('信息技术')) {
              defaultStatus = 'implementing';
            }
            updatedNote.trainingStatus = defaultStatus;
          }
          
          // 添加implementationSchedule字段（仅对实施中和已结束的记录）
          if (!note.implementationSchedule && (updatedNote.trainingStatus === 'implementing' || updatedNote.trainingStatus === 'completed')) {
            needsUpdate = true;
            // 根据状态分配默认时间
            if (updatedNote.trainingStatus === 'implementing') {
              if (note.title.includes('入职')) {
                updatedNote.implementationSchedule = {
                  startTime: '9/1 09:00',
                  endTime: '12/31 17:00'
                };
              } else if (note.title.includes('信息技术')) {
                updatedNote.implementationSchedule = {
                  startTime: '10/1 14:00',
                  endTime: '11/30 18:00'
                };
              } else {
                // 其他实施中的培训
                updatedNote.implementationSchedule = {
                  startTime: '9/15 09:00',
                  endTime: '11/15 17:00'
                };
              }
            } else if (updatedNote.trainingStatus === 'completed') {
              if (note.title.includes('骨干')) {
                updatedNote.implementationSchedule = {
                  startTime: '7/15 10:00',
                  endTime: '8/30 16:00'
                };
              } else {
                // 其他已结束的培训
                updatedNote.implementationSchedule = {
                  startTime: '6/1 09:00',
                  endTime: '7/31 17:00'
                };
              }
            }
          }
          
          if (needsUpdate) {
            needsMigration = true;
            return updatedNote;
          }
        }
        return note;
      });
      
      // 如果有数据迁移，保存回 localStorage
      if (needsMigration) {
        localStorage.setItem('smart_notes_data', JSON.stringify(notesData));
        console.log('已为培训需求管理笔记添加trainingStatus和implementationSchedule字段');
      }
      
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
      
      // 检查培训需求管理数据
      const trainingNeedsNotes = notesData.filter(note => note.category === 'training_needs_management');
      console.log('培训需求管理笔记数量:', trainingNeedsNotes.length);
      console.log('培训需求管理笔记详情:', trainingNeedsNotes.map(note => ({
        title: note.title,
        trainingStatus: note.trainingStatus
      })));
      
      // 检查教研室数据
      const teachingResearchNotes = notesData.filter(note => note.category === 'teaching_research_office');
      console.log('教研室笔记数量:', teachingResearchNotes.length);
      console.log('教研室笔记标题:', teachingResearchNotes.map(note => note.title));
      
      // 检查localStorage原始数据
      const rawData = localStorage.getItem('smart_notes_data');
      console.log('localStorage原始数据长度:', rawData ? rawData.length : 0);

      // 在初始化阶段，模拟“已结束主题”的两种证书场景
      try {
        const orgNotes = Array.isArray(notesData) ? notesData.filter(note => (
          note?.courseType === 'organizational_training' ||
          note?.source === '组织培训' ||
          (note?.tags && note.tags.includes('组织培训')) ||
          note?.category === 'organizational_training' ||
          (note?.title && note.title.includes('【组织培训】'))
        )) : [];

        orgNotes.forEach(note => {
          try {
            const ts = getTrainingStatusInfo(note);
            if (!ts || !ts.isCompleted) return; // 只针对已结束的主题
            // 使用稳定的规则为部分主题颁发证书（其余保持未颁证），用于演示
            const key = String(note.id || note.title || '');
            const sum = Array.from(key).reduce((a, ch) => a + ch.charCodeAt(0), 0);
            const shouldIssue = (sum % 2) === 0; // 偶数：颁证；奇数：不颁证
            if (shouldIssue) {
              certificateService.ensureCertificateForTopic({ topicId: note.id, topicTitle: note.title });
            }
          } catch (e) {}
        });
      } catch (e) {
        console.warn('初始化证书演示数据失败:', e);
      }

      // 一次性迁移：精确将“信息技术与教学创新”改为达标并取消证书
      try {
        const MIGRATION_KEY = 'migration_mark_it_tech_innov_achieved_and_cancel_cert_done';
        const alreadyDone = localStorage.getItem(MIGRATION_KEY) === 'true';
        if (!alreadyDone) {
          const orgNotes = Array.isArray(notesData) ? notesData.filter(note => (
            note?.courseType === 'organizational_training' ||
            note?.source === '组织培训' ||
            (note?.tags && note.tags.includes('组织培训')) ||
            note?.category === 'organizational_training' ||
            (note?.title && note.title.includes('【组织培训】'))
          )) : [];

          const target = orgNotes.find(note => (note?.title || '').includes('信息技术与教学创新'));

          if (target) {
            const vi = { ...(target.videoInfo || {}) };
            if (vi.type === 'single_video') {
              vi.progress = 100;
            } else if (vi.type === 'multi_video' && Array.isArray(vi.videos)) {
              vi.videos = vi.videos.map(v => ({ ...v, progress: 100 }));
              const totalDuration = vi.totalDuration || vi.videos.reduce((sum, v) => sum + (v.duration || 0), 0);
              vi.totalDuration = totalDuration;
              vi.watchedDuration = totalDuration;
              vi.overallProgress = 100;
            } else if (!vi.type) {
              vi.type = 'single_video';
              vi.progress = 100;
            }

            await notesService.updateNote(target.id, { videoInfo: vi });
            try { certificateService.removeCertificateByTopic(target.id); } catch (e) {}
            localStorage.setItem(MIGRATION_KEY, 'true');
            notesData = await notesService.getAllNotes();
            console.log('已将“信息技术与教学创新”设置为已达标并取消证书');
          }
        }
      } catch (e) {
        console.warn('设置“信息技术与教学创新”为达标并取消证书时出错:', e);
      }

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
            // 自动生成后再确保默认未开始主题存在
            try {
              const hasDefault = Array.isArray(notesData) && notesData.some(n => (
                n?.courseId === 'org_default_not_started' ||
                (typeof n?.title === 'string' && n.title.trim() === '【组织培训】未开始主题')
              ));
              if (!hasDefault) {
                const today = new Date();
                const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
                const dateStr = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}`;
                const baseTags = ['组织培训', '教师培训', '未开始', '待开班', '培训安排', '教学策略', '班级管理', '教学评估', '教育技术'];
                const content = `# 教师培训 · 未开始主题\n\n## 主题简介\n- 面向教师的组织化培训，作为预备入口，当前未开始。\n- 聚焦教学能力提升、班级管理与教学评估，包含教育技术应用。\n\n## 培训目标\n- 明确教学目标与评价标准\n- 完成资料准备与设备测试\n- 制定时间计划与提醒机制\n\n## 模块目录\n- 新教师入职导引\n- 班级管理实务\n- 教学设计与策略\n- 教学评估与反馈\n- 教育技术与信息化\n\n## 标签\n${baseTags.map(t => `- ${t}`).join('\n')}\n\n## 说明\n- 当前进度为 0%\n- 状态：未开始\n- 开班后自动转入“进行中”\n\n——\n来源：组织培训系统\n课程ID：org_default_not_started`;
                await notesService.createNote({
                  title: '【组织培训】未开始主题',
                  content,
                  category: 'organizational_training',
                  tags: baseTags,
                  source: '组织培训',
                  courseId: 'org_default_not_started',
                  courseType: 'organizational_training',
                  learningSchedule: {
                    startTime: `${dateStr} 09:00`,
                    endTime: `${dateStr} 17:00`
                  }
                });
                // 重新获取最新数据
                notesData = await notesService.getAllNotes();
              }
            } catch (e) {
              console.warn('确保默认未开始主题存在失败:', e);
            }
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
          note.category === 'teaching_design'
        );
      } else if (selectedCategory === 'teaching_research_office') {
        filtered = filtered.filter(note => 
          note.category === 'teaching_research_office' ||
          note.tags?.includes('教研室') ||
          note.source === '教研室'
        );
      } else {
        filtered = filtered.filter(note => note.category === selectedCategory);
        // 排除其他特殊分类的数据，避免分类互相覆盖
        filtered = filtered.filter(note => 
          note.category !== 'organizational_training' && 
          note.courseType !== 'organizational_training' &&
          note.category !== 'learning_square' &&
          note.category !== 'homework_system' &&
          note.category !== 'teaching_design' &&
          note.category !== 'teaching_research_office'
        );
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
            onOpenSystemCategoryManager={(context) => {
              setSystemCategoryManagerContext(context || null);
              setIsSystemCategoryManagerVisible(true);
            }}
            configVersion={systemCategoryConfigVersion}
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

      {/* 系统分类维护器 */}
      <SystemCategoryManager
        visible={isSystemCategoryManagerVisible}
        onCancel={() => {
          setIsSystemCategoryManagerVisible(false);
          setSystemCategoryManagerContext(null);
        }}
        onSave={() => {
          setIsSystemCategoryManagerVisible(false);
          setSystemCategoryManagerContext(null);
          setSystemCategoryConfigVersion(v => v + 1);
        }}
        categories={categories}
        managerContext={systemCategoryManagerContext}
      />

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
        shareTargetSquareSection={selectedCategory === 'training_needs_management' ? 'training-projects' : undefined}
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