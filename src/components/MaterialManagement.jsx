import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Layout,
  Input,
  Button,
  Typography,
  Space,
  message,
  Upload,
  Card,
  Divider,
  Tag,
  Tooltip,
  Radio,
  Select,
  Modal,
  Checkbox,
  Popconfirm,
  Dropdown,
  Progress,
  Table
} from 'antd';
import MaterialAddPage from './MaterialAddPage';
import ExploreModal from './ExploreModal';
import CapabilityMindMap from './CapabilityMindMap.jsx';
import KnowledgeGraphMindMap from './KnowledgeGraphMindMap.jsx';
// import courseSelectionService from '../services/courseSelectionService';
  import {
    ArrowLeftOutlined,
    UploadOutlined,
    FileTextOutlined,
    LinkOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    MoreOutlined,
    PaperClipOutlined,
    EyeOutlined,
    PlayCircleOutlined,
    ClockCircleOutlined,
    RobotOutlined,
    NodeIndexOutlined,
    DownOutlined,
    RightOutlined,
    FolderOutlined,
    AppstoreOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined
  } from '@ant-design/icons';
import { Grid, Map as MapIcon } from 'lucide-react';
import { VIEW_MODES } from '../constants/noteEditConstants';
import { getMockCourseContentHierarchy, flattenCourseContentToVideos } from '../utils/mockCourseData';
import { 
  generateSmartNote, 
  getLiveStreamStatus, 
  getVideoEmbedUrl,
  validateUrl,
  checkVideoWebsiteType
} from '../utils/noteEditUtils';

import notesService from '../services/notesService';
import './MaterialManagement.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const MaterialManagement = ({ state, handlers, onBack, mode, note }) => {
  const {
    uploadedFiles,
    setUploadedFiles,
    organizationalCourses,
    setOrganizationalCourses,
    selectedMaterials,
    setSelectedMaterials,
    links,
    setLinks,
    newLink,
    setNewLink,
    showUploadModal,
    setShowUploadModal,
    showMaterialAddModal,
    setShowMaterialAddModal,
    websiteType,
    setWebsiteType,
    websiteUrl,
    setWebsiteUrl,
    textContent,
    setTextContent,
    addedTexts,
    setAddedTexts,
    videoTitle,
    setVideoTitle,
    videoUrl,
    setVideoUrl,
    courseVideos,
    setCourseVideos,
    selectedCourses,
    setSelectedCourses,
    hoveredItems,
    setHoveredItems,
    viewMode,
    setViewMode,
    selectedCapabilityCategory,
    setSelectedCapabilityCategory,
    selectedKnowledgeCategory,
    setSelectedKnowledgeCategory,
    showCapabilityMapModal,
    setShowCapabilityMapModal,
    showKnowledgeGraphModal,
    setShowKnowledgeGraphModal,
    capabilityMap,
    capabilityVideos,
    knowledgeGraph,
    capabilityCategories,
    knowledgeCategories,
    currentView,
    liveStreams,
    setLiveStreams,
    showExploreModal,
    setShowExploreModal,
    materials
  } = state;

  // 本地标题编辑状态
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(note?.title || '');
  useEffect(() => {
    setLocalTitle(note?.title || '');
  }, [note?.id, note?.title]);

  // 重命名弹窗状态与处理
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameTarget, setRenameTarget] = useState({ type: '', id: null });
  const [renameValue, setRenameValue] = useState('');
  const openRename = (type, id, initialValue) => {
    setRenameTarget({ type, id });
    setRenameValue(initialValue || '');
    setRenameModalVisible(true);
  };
  const handleConfirmRename = () => {
    const value = (renameValue || '').trim();
    if (!value) {
      message.warning('请输入新名称');
      return;
    }
    switch (renameTarget.type) {
      case 'file':
        setUploadedFiles(prev => prev.map(f => f.id === renameTarget.id ? { ...f, name: value } : f));
        message.success('文件重命名成功');
        break;
      case 'link':
        setLinks(prev => prev.map(l => l.id === renameTarget.id ? { ...l, title: value } : l));
        message.success('链接重命名成功');
        break;
      case 'text':
        setAddedTexts(prev => prev.map(t => t.id === renameTarget.id ? { ...t, title: value } : t));
        message.success('文本重命名成功');
        break;
      default:
        break;
    }
    setRenameModalVisible(false);
  };

  // 模块状态：默认模块 + 未分类模块 + 新增模块
  const [modules, setModules] = useState([
    { id: 'default', title: '默认模块' },
    { id: 'uncategorized', title: '未分类模块' }
  ]);
  const [activeModuleId, setActiveModuleId] = useState('default');
  const [addModuleModalVisible, setAddModuleModalVisible] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  useEffect(() => {
    // 切换主题时重置模块到默认
    setModules([
      { id: 'default', title: '默认模块' },
      { id: 'uncategorized', title: '未分类模块' }
    ]);
    setActiveModuleId('default');
  }, [note?.id]);

  const handleAddModule = () => {
    const name = (newModuleName || '').trim();
    if (!name) {
      message.warning('模块名称不能为空');
      return;
    }
    const id = `mod_${Date.now()}`;
    setModules(prev => [...prev, { id, title: name }]);
    setActiveModuleId(id);
    setAddModuleModalVisible(false);
    setNewModuleName('');
    message.success('模块已创建');
  };

  // 资料模块归属映射：各类型项的 id -> moduleId
  const [moduleAssignments, setModuleAssignments] = useState({
    live: {},
    videos: {},
    exam: {},
    links: {},
    texts: {},
    projects: {}
  });

  // 同步本地模块归属映射到共享状态，供其他面板（如研修成果详情）读取
  useEffect(() => {
    try {
      if (state && typeof state.setModuleAssignments === 'function') {
        state.setModuleAssignments(moduleAssignments);
      }
    } catch (e) {
      // no-op
    }
  }, [moduleAssignments]);

  // 未分类模块的展开/折叠状态
  const [uncategorizedExpanded, setUncategorizedExpanded] = useState({
    live: true,
    videos: true,
    exam: true,
    links: true,
    texts: true,
    projects: true
  });
  // 初始化：把现有资料归入默认模块
  useEffect(() => {
    try {
      const next = {
        live: {},
        videos: {},
        exam: {},
        links: {},
        texts: {},
        projects: {}
      };
      (Array.isArray(liveStreams) ? liveStreams : []).forEach(s => { next.live[s.id] = 'default'; });
      (Array.isArray(courseVideos) ? courseVideos : []).forEach(v => { next.videos[v.id] = 'default'; });
      (Array.isArray(examFiles) ? examFiles : []).forEach(f => { next.exam[f.id] = 'default'; });
      (Array.isArray(links) ? links : []).forEach(l => { next.links[l.id] = 'default'; });
      (Array.isArray(addedTexts) ? addedTexts : []).forEach(t => { next.texts[t.id] = 'default'; });
      (Array.isArray(trainingProjects) ? trainingProjects : []).forEach(p => { next.projects[p.id] = 'default'; });
      setModuleAssignments(next);
    } catch (e) {
      // no-op
    }
  }, [note?.id]);

    // 自动注入“新教师教学方法培训”预设来源数据
  useEffect(() => {
    const keywords = ['新教师教学方法培训', '新教师教学方法', '教学方法培训'];
    const matchesTitle = keywords.some(k => (note?.title || '').includes(k));

    const isOrgTraining =
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训'));

    const isTarget =
      (note?.category === 'training_needs_management' || isOrgTraining) && matchesTitle;

    if (!isTarget) return;

    const nowISO = new Date().toISOString();

    // 注入链接（视频与网站）
    const seedLinks = [
      { id: Date.now() + 1, url: 'https://www.bilibili.com/video/BV1Nt411m7TM', type: 'video', platform: 'B站', title: '课堂组织与互动教学示范课（B站）', addTime: nowISO },
      { id: Date.now() + 2, url: 'https://www.xiaohongshu.com/explore/66abcdeef0123456789', type: 'video', platform: '小红书', title: '备课与教学设计案例（小红书）', addTime: nowISO },
      { id: Date.now() + 3, url: 'https://www.moe.gov.cn/jyb_xxgk/zcwj/', type: 'website', platform: '普通网站', title: '教育部教师培训与课堂教学指导文件', addTime: nowISO }
    ];
    const linksToAdd = seedLinks.filter(s => !(Array.isArray(links) ? links : []).some(l => l.url === s.url || l.title === s.title));
    if (linksToAdd.length) setLinks(prev => [...prev, ...linksToAdd]);

    // 注入文本内容
    const seedTexts = [
      { title: '教学三对齐（目标-活动-评价）', content: '明确学习目标，设计匹配的课堂活动，制定可测的评价方式。' },
      { title: '新教师课堂管理要点', content: '建立班级规则、关注学生差异、维护课堂节奏与秩序。' },
      { title: '互动教学技巧清单', content: '提问、同伴互评、小组合作、课堂反馈、即时纠错等策略。' }
    ];
    const textsToAdd = seedTexts
      .filter(s => !(Array.isArray(addedTexts) ? addedTexts : []).some(t => t.title === s.title))
      .map(s => ({ id: Date.now() + Math.floor(Math.random() * 100000), content: s.content, type: 'text', title: s.title, addTime: nowISO }));
    if (textsToAdd.length) setAddedTexts(prev => [...prev, ...textsToAdd]);

    // 注入文件（试卷与普通资料）
    const seedFiles = [
      { name: '新教师教学方法培训试卷（通用版）.pdf', type: 'application/pdf', size: 256 * 1024, isPaper: true },
      { name: '课堂管理案例库.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 512 * 1024, isPaper: true },
      { name: '教学设计模板.pdf', type: 'application/pdf', size: 768 * 1024, isPaper: false },
      { name: '互动教学技巧汇总.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 280 * 1024, isPaper: false }
    ];
    const filesToAdd = seedFiles
      .filter(s => !(Array.isArray(uploadedFiles) ? uploadedFiles : []).some(f => f.name === s.name))
      .map(s => ({ id: Date.now() + Math.floor(Math.random() * 100000), name: s.name, size: s.size, type: s.type, isPaper: s.isPaper, uploadTime: nowISO, content: '文件内容预览...' }));
    if (filesToAdd.length) setUploadedFiles(prev => [...prev, ...filesToAdd]);

    // 注入组织课程
    const seedCourses = [
      { title: '新教师教学方法培训（基础）', instructor: '教务处', duration: '6小时', description: '课堂组织、互动教学与规则建立' },
      { title: '教学设计与课堂管理提升', instructor: '市教研院专家', duration: '4小时', description: '教学三对齐、案例分析与作业设计' }
    ];
    const coursesToAdd = seedCourses
      .filter(s => !(Array.isArray(organizationalCourses) ? organizationalCourses : []).some(c => c.title === s.title))
      .map(s => ({ id: Date.now() + Math.floor(Math.random() * 100000), title: s.title, instructor: s.instructor, duration: s.duration, description: s.description, addedAt: new Date().toLocaleString(), type: 'course' }));
    if (coursesToAdd.length) setOrganizationalCourses(prev => [...prev, ...coursesToAdd]);

    // 注入“直播课”到直播课分类（仅在目标主题下）
    const seedLiveStream = {
      id: 'org_ntm_stream_001',
      title: '新教师教学方法培训第二期 · 直播',
      instructor: '教务处王老师',
      startTime: '2025-01-28 19:00',
      endTime: '2025-01-28 20:30',
      url: 'https://live.example.com/upcoming/org-ntm-session1',
      platform: '',
      participants: 256,
      status: 'scheduled'
    };
    // 追加一条“已结束-回放”示例，用于演示点击即可播放
    const seedLiveReplay = {
      id: 'org_ntm_stream_001_replay',
      title: '新教师教学方法培训第一期 · 回放',
      instructor: '教务处王老师',
      startTime: '2025-01-28 19:00',
      endTime: '2025-01-28 20:30',
      // 使用本地可播放 mp4 资源，确保点击后直接播放
      replayUrl: '/assets/2.mp4',
      url: '/assets/2.mp4',
      platform: '',
      participants: 256,
      status: 'ended'
    };
    const hasLiveStream = (Array.isArray(liveStreams) ? liveStreams : []).some(s => s.id === seedLiveStream.id || s.title === seedLiveStream.title);
    const hasLiveReplay = (Array.isArray(liveStreams) ? liveStreams : []).some(s => s.id === seedLiveReplay.id || s.title === seedLiveReplay.title);
    if (typeof setLiveStreams === 'function') {
      setLiveStreams(prev => {
        const base = Array.isArray(prev) ? prev : [];
        const next = [...base];
        if (!hasLiveStream) next.push(seedLiveStream);
        if (!hasLiveReplay) next.push(seedLiveReplay);
        // 删除最后两条直播数据（当长度≥5）
        if (next.length >= 5) {
          return next.slice(0, next.length - 2);
        }
        return next;
      });
    }
  }, [note?.id, note?.title, note?.category, note?.courseType, note?.source, note?.tags]);

  const {
    onPlayVideo,
    onViewMaterial,
    onCapabilityNodeClick,
    onCapabilityVideoClick,
    onKnowledgeNodeClick,
    onKnowledgeResourceClick,
    onExplore
  } = handlers;

  // 添加计划标识显示状态管理
  const [showPlannedLabels, setShowPlannedLabels] = useState(false);

  // 组织培训：置顶培训项目注入（来源于“培训需求管理”生成的培训方案）
  const [trainingProjects, setTrainingProjects] = useState([]);
  useEffect(() => {
    const isOrgTraining =
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训'));
    if (!isOrgTraining) return;

    const nowISO = new Date().toISOString();
    const seedProj = {
      id: 'tp_org_new_teacher_online_001',
      title: '新教师入职线上培训具体方案',
      category: 'training_project',
      originCategory: 'training_needs_management',
      sourceType: '培训方案',
      pinned: true,
      addTime: nowISO
    };
    setTrainingProjects(prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (list.some(p => p.title === seedProj.title)) return list;
      return [seedProj, ...list];
    });
  }, [note?.id, note?.category, note?.courseType, note?.source, note?.tags]);

  // 组织培训：按阶段注入考试类素材（试卷）
  useEffect(() => {
    const isOrgTraining =
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训'));

    const matchesTitle = /新教师教学方法培训|新教师教学方法|教学方法培训/.test(note?.title || '');
    if (!isOrgTraining || !matchesTitle) return;

    const nowISO = new Date().toISOString();
    const seeds = [
      { id: 'exam_phase_1_online_test', name: '学校文化与制度｜在线测试（100分）.pdf', type: 'application/pdf', size: 200 * 1024, isPaper: true, fullScore: 100, examType: '在线测试', phaseId: 1, uploadTime: nowISO },
      { id: 'exam_phase_2_lesson_plan', name: '教学基本规范｜教案设计作业（100分）.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 220 * 1024, isPaper: true, fullScore: 100, examType: '教案设计作业', phaseId: 2, uploadTime: nowISO },
      { id: 'exam_phase_3_case_report', name: '学生管理基础｜案例分析报告（100分）.pdf', type: 'application/pdf', size: 210 * 1024, isPaper: true, fullScore: 100, examType: '案例分析报告', phaseId: 3, uploadTime: nowISO },
      { id: 'exam_phase_4_practical_assessment', name: '教育技术应用｜实操考核（100分）.pdf', type: 'application/pdf', size: 230 * 1024, isPaper: true, fullScore: 100, examType: '实操考核', phaseId: 4, uploadTime: nowISO }
    ];

    setUploadedFiles(prev => {
      const list = Array.isArray(prev) ? prev : [];
      const nameSet = new Set(list.map(f => f.name));
      const idSet = new Set(list.map(f => f.id));
      const newOnes = seeds.filter(s => !nameSet.has(s.name) && !idSet.has(s.id));
      if (newOnes.length === 0) return list;
      return [...list, ...newOnes];
    });
  }, [note?.id, note?.title, note?.category, note?.courseType, note?.source, note?.tags]);

  // 组织培训：注入“情景模拟：班级突发事件处置”相关类型数据，并归入未分类模块
  useEffect(() => {
    const isOrgTraining =
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训'));
    if (!isOrgTraining) return;

    const nowISO = new Date().toISOString();

    // 直播课（情景模拟演练）归入第3阶段
    const sceneLive = {
      id: 'org_scene_phase3_live_001',
      title: '情景模拟：班级突发事件处置（直播演练）',
      instructor: '德育处王老师',
      startTime: '2025-03-05 19:00',
      endTime: '2025-03-05 20:00',
      url: 'https://live.example.com/org-scene-phase3',
      platform: '',
      participants: 160,
      status: 'scheduled',
      phaseId: 3
    };

    // 阅读材料（处置指引）
    const sceneLink = {
      id: 'org_scene_link_guide_001',
      url: 'https://example.com/scene-management-guide',
      type: 'website',
      platform: '普通网站',
      title: '班级突发事件处置指引',
      addTime: nowISO
    };

    // 文本（反思记录）
    const sceneText = {
      id: 'org_scene_text_reflect_001',
      title: '情景模拟反思：学生冲突管理',
      content: '通过角色扮演模拟学生冲突场景，评估管理与沟通能力。',
      type: 'text',
      addTime: nowISO
    };

    // 培训项目资料（活动方案）
    const sceneProject = {
      id: 'org_scene_project_plan_001',
      title: '情景模拟教学活动方案',
      category: 'training_project',
      originCategory: 'organizational_training',
      sourceType: '活动方案',
      pinned: false,
      addTime: nowISO
    };

    // 考试/试卷（处置方案设计）
    const sceneExam = {
      id: 'exam_phase_3_scene_design',
      name: '学生管理基础｜情景处置方案设计（100分）.pdf',
      type: 'application/pdf',
      size: 180 * 1024,
      isPaper: true,
      fullScore: 100,
      examType: '方案设计',
      phaseId: 3,
      uploadTime: nowISO
    };

    // 注入数据（避免重复）
    if (typeof setLiveStreams === 'function') {
      setLiveStreams(prev => {
        const list = Array.isArray(prev) ? prev : [];
        if (!list.some(s => s.id === sceneLive.id || s.title === sceneLive.title)) {
          return [...list, sceneLive];
        }
        return list;
      });
    }
    setLinks(prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (!list.some(l => l.id === sceneLink.id || l.title === sceneLink.title || l.url === sceneLink.url)) {
        return [...list, sceneLink];
      }
      return list;
    });
    setAddedTexts(prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (!list.some(t => t.id === sceneText.id || t.title === sceneText.title)) {
        return [...list, sceneText];
      }
      return list;
    });
    setTrainingProjects(prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (!list.some(p => p.id === sceneProject.id || p.title === sceneProject.title)) {
        return [...list, sceneProject];
      }
      return list;
    });
    setUploadedFiles(prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (!list.some(f => f.id === sceneExam.id || f.name === sceneExam.name)) {
        return [...list, sceneExam];
      }
      return list;
    });

    // 归属到未分类模块
    setModuleAssignments(prev => {
      const next = { ...prev };
      next.live = { ...(prev?.live || {}) };
      next.videos = { ...(prev?.videos || {}) };
      next.exam = { ...(prev?.exam || {}) };
      next.links = { ...(prev?.links || {}) };
      next.texts = { ...(prev?.texts || {}) };
      next.projects = { ...(prev?.projects || {}) };
      next.live[sceneLive.id] = 'uncategorized';
      next.links[sceneLink.id] = 'uncategorized';
      next.texts[sceneText.id] = 'uncategorized';
      next.projects[sceneProject.id] = 'uncategorized';
      next.exam[sceneExam.id] = 'uncategorized';
      return next;
    });
  }, [note?.id, note?.category, note?.courseType, note?.source, note?.tags]);

  // 组织培训：补充第一阶段直播讲座，并为第二阶段注入“教学基本规范”录播
  useEffect(() => {
    const isOrgTraining =
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训'));

    const matchesTitle = /新教师教学方法培训|新教师教学方法|教学方法培训/.test(note?.title || '');
    if (!isOrgTraining || !matchesTitle) return;

    // 第一阶段：直播讲座数据补充（显式指定 phaseId: 1）
    const phase1Lecture = {
      id: 'org_ntm_phase1_lecture_001',
      title: '学校文化与制度 · 直播讲座',
      instructor: '校长办公室刘老师',
      startTime: '2025-02-05 19:00',
      endTime: '2025-02-05 20:30',
      url: 'https://live.example.com/org-ntm-phase1-lecture',
      platform: '',
      participants: 300,
      status: 'scheduled',
      phaseId: 1
    };
    if (typeof setLiveStreams === 'function') {
      setLiveStreams(prev => {
        const list = Array.isArray(prev) ? prev : [];
        const exists = list.some(s => s.id === phase1Lecture.id || s.title === phase1Lecture.title);
        return exists ? list : [phase1Lecture, ...list];
      });
    }

    // 第二阶段：注入“教学基本规范”录播视频
    const normVideos = [
      { id: 'org_ntm_norms_001', title: '教学基本规范（课堂纪律与仪表）', url: 'https://video.example.com/norms-1', courseId: 'org_ntm_course_norms', courseTitle: '新教师教学方法培训', addTime: '第2章 · 第1节', instructor: '教务处', videoInfo: { type: 'single_video', duration: 1800, progress: 0 } },
      { id: 'org_ntm_norms_002', title: '教学基本规范（备课与作业设计）', url: 'https://video.example.com/norms-2', courseId: 'org_ntm_course_norms', courseTitle: '新教师教学方法培训', addTime: '第2章 · 第2节', instructor: '教务处', videoInfo: { type: 'single_video', duration: 2100, progress: 0 } },
      { id: 'org_ntm_norms_003', title: '教学基本规范（课堂提问与评价）', url: 'https://video.example.com/norms-3', courseId: 'org_ntm_course_norms', courseTitle: '新教师教学方法培训', addTime: '第2章 · 第3节', instructor: '教务处', videoInfo: { type: 'single_video', duration: 2400, progress: 0 } }
    ];
    if (typeof setCourseVideos === 'function') {
      setCourseVideos(prev => {
        const list = Array.isArray(prev) ? prev : [];
        const idSet = new Set(list.map(v => v.id));
        const titleSet = new Set(list.map(v => v.title));
        const newOnes = normVideos.filter(v => !idSet.has(v.id) && !titleSet.has(v.title));
        if (newOnes.length === 0) return list;
        return [...list, ...newOnes];
      });
    }
  }, [note?.id, note?.title, note?.category, note?.courseType, note?.source, note?.tags]);

  // 组织培训：初始化“教学基本规范”课程视频的学习进度
  useEffect(() => {
    const isOrgTraining =
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训'));

    const matchesTitle = /新教师教学方法培训|新教师教学方法|教学方法培训/.test(note?.title || '');
    if (!isOrgTraining || !matchesTitle) return;

    if (typeof setCourseVideos === 'function') {
      setCourseVideos(prev => {
        const list = Array.isArray(prev) ? prev : [];
        const updated = list.map(v => {
          const isNormCourse = (v.courseId === 'org_ntm_course_norms') || (v.title && v.title.startsWith('教学基本规范'));
          if (!isNormCourse) return v;
          const vi = v.videoInfo || {};
          const alreadyHasProgress = vi.progress != null && Number(vi.progress) > 0;
          if (alreadyHasProgress) return v;
          const defaultsById = {
            org_ntm_norms_001: { duration: vi.duration ?? 1800, progress: 30 },
            org_ntm_norms_002: { duration: vi.duration ?? 2100, progress: 55 },
            org_ntm_norms_003: { duration: vi.duration ?? 2400, progress: 20 }
          };
          const d = defaultsById[v.id] || { duration: vi.duration ?? 1800, progress: 25 };
          return { ...v, videoInfo: { 
            ...vi,
            type: vi.type || 'single_video',
            duration: vi.duration ?? d.duration,
            progress: (vi.progress != null ? vi.progress : d.progress)
          } };
        });
        return updated;
      });
    }
  }, [note?.id, note?.title, note?.category, note?.courseType, note?.source, note?.tags]);

  // 组织培训：为其他阶段补充模拟数据（直播、录播、链接、文本、项目）
  useEffect(() => {
    const isOrgTraining =
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训'));

    const matchesTitle = /新教师教学方法培训|新教师教学方法|教学方法培训/.test(note?.title || '');
    if (!isOrgTraining || !matchesTitle) return;

    const nowISO = new Date().toISOString();

    // 直播课：第3/4/5/11/12阶段
    const liveSeeds = [
      { id: 'org_ntm_phase3_live_001', title: '学生管理基础 · 班级纪律与规则', instructor: '德育处王老师', startTime: '2025-02-12 19:00', endTime: '2025-02-12 20:30', url: 'https://live.example.com/org-ntm-phase3-live', platform: '', participants: 200, status: 'scheduled', phaseId: 3 },
      { id: 'org_ntm_phase4_live_001', title: '教育技术应用 · 工具演示', instructor: '信息中心张老师', startTime: '2025-02-19 19:00', endTime: '2025-02-19 20:00', url: 'https://live.example.com/org-ntm-phase4-demo', platform: '', participants: 180, status: 'scheduled', phaseId: 4 },
      { id: 'org_ntm_phase5_lecture_001', title: '教学设计进阶 · 专题讲座', instructor: '教研室李老师', startTime: '2025-02-26 19:00', endTime: '2025-02-26 20:30', url: 'https://live.example.com/org-ntm-phase5-lecture', platform: '', participants: 220, status: 'scheduled', phaseId: 5 },
      { id: 'org_ntm_phase11_live_001', title: '家校沟通艺术 · 情景演练', instructor: '心理中心吴老师', startTime: '2025-03-26 19:00', endTime: '2025-03-26 20:00', url: 'https://live.example.com/org-ntm-phase11-live', platform: '', participants: 160, status: 'scheduled', phaseId: 11 },
      { id: 'org_ntm_phase12_live_001', title: '教师职业规划 · 导师指导', instructor: '人事处赵老师', startTime: '2025-04-02 19:00', endTime: '2025-04-02 20:00', url: 'https://live.example.com/org-ntm-phase12-live', platform: '', participants: 140, status: 'scheduled', phaseId: 12 }
    ];
    if (typeof setLiveStreams === 'function') {
      setLiveStreams(prev => {
        const list = Array.isArray(prev) ? prev : [];
        const idSet = new Set(list.map(s => s.id));
        const titleSet = new Set(list.map(s => s.title));
        const newOnes = liveSeeds.filter(s => !idSet.has(s.id) && !titleSet.has(s.title));
        return newOnes.length === 0 ? list : [...newOnes, ...list];
      });
    }

    // 录播视频：第6阶段示范课观摩
    const demoVideos = [
      { id: 'org_ntm_demo_001', title: '示范课观摩：课堂导入与活动组织', url: 'https://video.example.com/demo-1', courseId: 'org_ntm_course_demo', courseTitle: '示范课观摩', addTime: '第6章 · 第1节', instructor: '骨干教师', videoInfo: { type: 'single_video', duration: 1800, progress: 0 } },
      { id: 'org_ntm_demo_002', title: '示范课观摩：板书与节奏控制', url: 'https://video.example.com/demo-2', courseId: 'org_ntm_course_demo', courseTitle: '示范课观摩', addTime: '第6章 · 第2节', instructor: '骨干教师', videoInfo: { type: 'single_video', duration: 2100, progress: 0 } }
    ];
    if (typeof setCourseVideos === 'function') {
      setCourseVideos(prev => {
        const list = Array.isArray(prev) ? prev : [];
        const idSet = new Set(list.map(v => v.id));
        const titleSet = new Set(list.map(v => v.title));
        const newOnes = demoVideos.filter(v => !idSet.has(v.id) && !titleSet.has(v.title));
        return newOnes.length === 0 ? list : [...list, ...newOnes];
      });
    }

    // 链接：第9阶段理论学习
    const linkSeeds = [
      { id: Date.now() + 101, url: 'https://www.example.com/bruner-cognitive-discovery', type: 'website', platform: '普通网站', title: '教育理论精读：布鲁纳的认知发现学习', addTime: nowISO },
      { id: Date.now() + 102, url: 'https://www.example.com/educational-psychology-basics', type: 'website', platform: '普通网站', title: '教育心理学基础简读', addTime: nowISO }
    ];
    if (typeof setLinks === 'function') {
      const linksArr = Array.isArray(links) ? links : [];
      const toAdd = linkSeeds.filter(s => !linksArr.some(l => l.url === s.url || l.title === s.title));
      if (toAdd.length) setLinks(prev => [...prev, ...toAdd]);
    }

    // 文本：第7阶段案例研讨 & 第8阶段反思写作（分配逻辑在 useMemo 中按关键字）
    const textSeeds = [
      { title: '案例研讨：课堂管理冲突处理', content: '案例背景、冲突诱因、教师干预策略、效果评估与改进建议。' },
      { title: '反思写作：一次失败的提问活动', content: '回顾教学目标、提问设计、课堂反馈与自我改进计划。' }
    ];
    if (typeof setAddedTexts === 'function') {
      const textsArr = Array.isArray(addedTexts) ? addedTexts : [];
      const toAdd = textSeeds
        .filter(s => !textsArr.some(t => t.title === s.title))
        .map(s => ({ id: Date.now() + Math.floor(Math.random() * 100000), content: s.content, type: 'text', title: s.title, addTime: nowISO }));
      if (toAdd.length) setAddedTexts(prev => [...prev, ...toAdd]);
    }

    // 项目：移除指定的两条示例项目
    if (typeof setTrainingProjects === 'function') {
      setTrainingProjects(prev => {
        const list = Array.isArray(prev) ? prev : [];
        const removed = list.filter(
          p =>
            p.id !== 'tp_org_course_dev_001' &&
            p.id !== 'tp_org_course_dev_show_001' &&
            p.title !== '校本课程开发项目任务书' &&
            p.title !== '校本课程成果展示会'
        );
        return removed;
      });
    }
  }, [note?.id, note?.title, note?.category, note?.courseType, note?.source, note?.tags]);

  // 组织培训：补充第5/6阶段考试试卷
  useEffect(() => {
    const isOrgTraining =
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训'));

    const matchesTitle = /新教师教学方法培训|新教师教学方法|教学方法培训/.test(note?.title || '');
    if (!isOrgTraining || !matchesTitle) return;

    const nowISO = new Date().toISOString();
    const extraSeeds = [
      { id: 'exam_phase_5_topic_lecture_assessment', name: '教学设计进阶｜专题讲座研修作业（100分）.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 240 * 1024, isPaper: true, fullScore: 100, examType: '研修作业', phaseId: 5, uploadTime: nowISO },
      { id: 'exam_phase_6_demo_observation_sheet', name: '课堂教学技能｜示范课观摩记录表（100分）.pdf', type: 'application/pdf', size: 260 * 1024, isPaper: true, fullScore: 100, examType: '观摩记录表', phaseId: 6, uploadTime: nowISO }
    ];

    setUploadedFiles(prev => {
      const list = Array.isArray(prev) ? prev : [];
      const nameSet = new Set(list.map(f => f.name));
      const idSet = new Set(list.map(f => f.id));
      const newOnes = extraSeeds.filter(s => !nameSet.has(s.name) && !idSet.has(s.id));
      return newOnes.length === 0 ? list : [...list, ...newOnes];
    });
  }, [note?.id, note?.title, note?.category, note?.courseType, note?.source, note?.tags]);

  // 课程层级结构索引（章/节数量摘要）
  const courseStructureIndex = useMemo(() => {
    let index = new Map();
    try {
      const hierarchy = getMockCourseContentHierarchy();
      hierarchy.forEach(course => {
        const chapters = course.chapters || [];
        const chapterCount = chapters.length;
        let sectionCount = 0;
        chapters.forEach(ch => {
          sectionCount += (ch.sections?.length || 0);
        });
        index.set(course.id, { chapterCount, sectionCount });
      });
    } catch (e) {
      // 安静失败，避免影响现有UI
      index = new Map();
    }
    return index;
  }, []);
  const courseHierarchyMap = useMemo(() => {
    let map = new Map();
    try {
      const hierarchy = getMockCourseContentHierarchy();
      hierarchy.forEach(course => {
        map.set(course.id, course);
      });
    } catch (e) {
      map = new Map();
    }
    return map;
  }, []);

  // 课程层级ID/对象解析：兼容不同 courseId 命名（如 org_ntm_course_* -> org_ntm）
  const resolveHierarchyCourse = (courseId, courseTitle) => {
    const direct = courseHierarchyMap.get(courseId);
    if (direct) return direct;
    for (const [hid, course] of courseHierarchyMap.entries()) {
      if ((courseId && String(courseId).includes(hid)) || (courseTitle && String(courseTitle).includes(course.title))) {
        return course;
      }
    }
    return null;
  };
  const resolveHierarchyId = (courseId, courseTitle) => {
    if (courseStructureIndex.has(courseId)) return courseId;
    for (const [hid, course] of courseHierarchyMap.entries()) {
      if ((courseId && String(courseId).includes(hid)) || (courseTitle && String(courseTitle).includes(course.title))) {
        return hid;
      }
    }
    return courseId;
  };

  // 计算视频的层次路径（课程/章/节），用于鼠标悬停提示
  const getVideoHierarchyPath = (courseId, video) => {
    const course = resolveHierarchyCourse(courseId, video?.courseTitle);
    const courseTitle = video?.courseTitle || course?.title || '未知课程';

    // 如果能在课程层级中找到该视频，返回 课程 / 章 / 节
    if (course && Array.isArray(course.chapters)) {
      for (const ch of course.chapters) {
        if (!Array.isArray(ch.sections)) continue;
        for (const sec of ch.sections) {
          if (!Array.isArray(sec.videos)) continue;
          const found = sec.videos.find(v => v.id === video?.id);
          if (found) {
            return `${courseTitle} / ${ch.title} / ${sec.title}`;
          }
        }
      }
    }

    // 回退：若存在 addTime（常包含“章 · 节”），拼接显示
    if (video?.addTime) {
      return `${courseTitle} / ${video.addTime}`;
    }

    // 最后回退：仅显示课程名
    return courseTitle;
  };

  const buildTreeDataFromVideos = (videos) => {
    const chapterMap = new Map();
    (Array.isArray(videos) ? videos : []).forEach(v => {
      const at = String(v.addTime || '').trim();
      const chMatch = at.match(/第\d+章/);
      const secMatch = at.match(/第\d+节/);
      const chTitle = chMatch ? chMatch[0] : '未分章';
      const secTitle = secMatch ? secMatch[0] : '未分节';
      const chKey = `ch-${chTitle}`;
      const secKey = `sec-${chTitle}-${secTitle}`;
      if (!chapterMap.has(chKey)) {
        chapterMap.set(chKey, { key: chKey, type: 'chapter', title: chTitle, children: [] });
      }
      const chNode = chapterMap.get(chKey);
      let secNode = chNode.children.find(c => c.key === secKey);
      if (!secNode) {
        secNode = { key: secKey, type: 'section', title: secTitle, videoCount: 0, children: [] };
        chNode.children.push(secNode);
      }
      secNode.videoCount += 1;
      secNode.children.push({
        key: `v-${v.id}`,
        type: 'video',
        title: v.title,
        videoId: v.id,
        instructor: v.instructor,
        progress: v.progress || 0,
        duration: v.duration,
        score: v.score
      });
    });
    return Array.from(chapterMap.values());
  };

  // 分组折叠状态 & 汇总计算（需在组件函数体内）
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [hierarchyOpenCourses, setHierarchyOpenCourses] = useState(new Set());
  const [highlightVideoId, setHighlightVideoId] = useState(null);
  // 课程视频视图模式：平铺视图 或 层级视图
  const [videoViewMode, setVideoViewMode] = useState('flat');

  // 是否处于“组织培训”视图（用于阶段分组）
  const isOrgTrainingView = (
    note?.category === 'organizational_training' ||
    note?.courseType === 'organizational_training' ||
    note?.source === '组织培训' ||
    (Array.isArray(note?.tags) && note.tags.includes('组织培训'))
  );

  // 各来源类型分区折叠状态（课程视频、直播课、考试文件、普通文件、链接、文本、培训项目）
  const [collapsedSections, setCollapsedSections] = useState({
    videos: true,
    live: true,
    examFiles: true,
    files: true,
    links: true,
    texts: true,
    trainingProjects: false
  });
  const toggleSection = (key) => {
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const toggleGroup = (courseId) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId); else next.add(courseId);
      return next;
    });
  };
  const toggleHierarchy = (courseId) => {
    setHierarchyOpenCourses(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId); else next.add(courseId);
      return next;
    });
  };

  // 组织培训：阶段定义与折叠状态
  const trainingPhases = [
    { id: 1, week: '第1阶段', content: '学校文化与制度', type: '直播讲座', hours: 6 },
    { id: 2, week: '第2阶段', content: '教学基本规范', type: '录播视频', hours: 6 },
    { id: 3, week: '第3阶段', content: '学生管理基础', type: '直播课程', hours: 6 },
    { id: 4, week: '第4阶段', content: '教育技术应用', type: '操作演示', hours: 6 },
    { id: 5, week: '第5阶段', content: '教学设计进阶', type: '专题讲座', hours: 8 },
    { id: 6, week: '第6阶段', content: '课堂教学技能', type: '示范课观摩', hours: 8 },
    { id: 7, week: '第7阶段', content: '差异化教学', type: '案例研讨', hours: 8 },
    { id: 8, week: '第8阶段', content: '教学反思与改进', type: '反思写作', hours: 8 },
    { id: 9, week: '第9阶段', content: '教育科研入门', type: '理论学习', hours: 8 },
    { id: 10, week: '第10阶段', content: '校本课程开发', type: '项目学习', hours: 8 },
    { id: 11, week: '第11阶段', content: '家校沟通艺术', type: '情景演练', hours: 8 },
    { id: 12, week: '第12阶段', content: '教师职业规划', type: '导师指导', hours: 8 }
  ];

  // 阶段时间：根据笔记的开始日期（note.phaseStartDate 或 note.startDate），每阶段默认1周
  const formatDateShort = (d) => {
    try {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch (e) {
      return '';
    }
  };

  const enrichedTrainingPhases = useMemo(() => {
    const baseISO = note?.phaseStartDate || note?.startDate;
    let base;
    try {
      base = baseISO ? new Date(baseISO) : new Date();
      if (isNaN(base.getTime())) base = new Date();
    } catch (e) {
      base = new Date();
    }
    return trainingPhases.map((p, idx) => {
      const start = new Date(base.getTime());
      start.setDate(start.getDate() + idx * 7);
      const end = new Date(start.getTime());
      end.setDate(end.getDate() + 6);
      return { ...p, startTime: formatDateShort(start), endTime: formatDateShort(end) };
    });
  }, [note?.phaseStartDate, note?.startDate]);
  const [collapsedPhases, setCollapsedPhases] = useState(new Set());
  const togglePhase = (phaseId) => {
    // 若处于紧凑模式，首次点击应仅展开当前阶段、折叠其他阶段
    const wasCompact = phaseViewCompactMode;
    setPhaseViewCompactMode(false);
    setCollapsedPhases(prev => {
      if (wasCompact) {
        const allIds = enrichedTrainingPhases.map(p => p.id);
        return new Set(allIds.filter(id => id !== phaseId));
      }
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId); else next.add(phaseId);
      return next;
    });
  };

  // 阶段素材分配（在组织培训下生效）
  const phaseMaterials = useMemo(() => {
    if (!isOrgTrainingView) return [];

    // 录播/示范视频：来自课程视频中非 live 类别
    const recordedVideos = (Array.isArray(courseVideos) ? courseVideos : []).filter(v => !String(v.type || '').startsWith('live'));
    // 直播课：来自 liveStreams
    const lives = Array.isArray(liveStreams) ? liveStreams : [];

    // 初始化所有阶段（含考试/试卷）
    const phaseMap = new Map(enrichedTrainingPhases.map(p => [p.id, { ...p, materials: { videos: [], live: [], links: [], texts: [], trainingProjects: [], exam: [] } }]));

    // 录播视频：含“示范/观摩”归入第6阶段；含“规范”归入第2阶段；其余默认归入第3阶段
    recordedVideos.forEach(v => {
      const isDemo = /示范|观摩/.test(v.title || '') || /示范|观摩/.test(v.courseTitle || '');
      const isNorms = /规范/.test(v.title || '') || /规范/.test(v.courseTitle || '');
      const targetId = isDemo ? 6 : (isNorms ? 2 : 3);
      const bucket = phaseMap.get(targetId);
      if (bucket) bucket.materials.videos.push(v);
    });

    // 学生管理基础模块：移除课程视频类型
    {
      const p3 = phaseMap.get(3);
      if (p3) p3.materials.videos = [];
    }

    // 直播课：优先按 phaseId 分配；无则标题含“讲座”归入第1阶段，否则归入第3阶段
    lives.forEach(s => {
      const isLecture = /讲座/.test(s.title || '') || /讲座/.test(s.topic || '');
      const targetId = (typeof s.phaseId !== 'undefined') ? s.phaseId : (isLecture ? 1 : 3);
      const bucket = phaseMap.get(targetId);
      if (bucket) bucket.materials.live.push(s);
    });

    // 考试/试卷：按 phaseId 归入对应阶段
    const phaseExamFiles = (Array.isArray(uploadedFiles) ? uploadedFiles : []).filter(f => f.isPaper && (typeof f.phaseId !== 'undefined'));
    phaseExamFiles.forEach(file => {
      const bucket = phaseMap.get(file.phaseId);
      if (bucket) bucket.materials.exam.push(file);
    });

    // 在学生管理基础模块（第3阶段）添加“研修成果”中的“情景模拟”记录
    {
      const p3 = phaseMap.get(3);
      if (p3) {
        const scenarioAchievement = {
          id: 'achv-scene-1',
          title: '情景模拟：班级突发事件处置',
          type: 'scenario_simulation',
          description: '通过角色扮演模拟学生冲突场景，评估管理与沟通能力',
          time: '本周',
          phaseId: 3,
          score: null
        };
        p3.materials.achievements = [scenarioAchievement];
      }
    }

    // 理论学习：把链接作为阅读材料归入第9周
    if (Array.isArray(links) && links.length > 0) {
      const p9 = phaseMap.get(9);
      if (p9) p9.materials.links = links;
    }

    // 反思写作/案例研讨：根据内容关键字分配到第7/第8周
    if (Array.isArray(addedTexts) && addedTexts.length > 0) {
      const p7 = phaseMap.get(7);
      const p8 = phaseMap.get(8);
      const caseTexts = addedTexts.filter(t => /案例|研讨/.test(((t.title || '') + (t.content || ''))));
      const otherTexts = addedTexts.filter(t => !caseTexts.includes(t));
      if (p7 && caseTexts.length > 0) p7.materials.texts = caseTexts;
      if (p8 && otherTexts.length > 0) p8.materials.texts = otherTexts;
    }

    // 项目学习：置顶的培训项目归入第10周（仍保留置顶区）
    if (Array.isArray(trainingProjects) && trainingProjects.length > 0) {
      const p10 = phaseMap.get(10);
      if (p10) p10.materials.trainingProjects = trainingProjects;
    }

    return Array.from(phaseMap.values());
  }, [isOrgTrainingView, courseVideos, liveStreams, trainingProjects, links, addedTexts, enrichedTrainingPhases, uploadedFiles]);

  // 全部展开/全部折叠
  const expandAllSections = () => {
    setCollapsedSections({ videos: false, live: false, examFiles: false, files: false, links: false, texts: false, trainingProjects: false });
    setCollapsedGroups(new Set());
    if (isOrgTrainingView) setCollapsedPhases(new Set());
  };
  const collapseAllSections = () => {
    setCollapsedSections({ videos: true, live: true, examFiles: true, files: true, links: true, texts: true, trainingProjects: true });
    setCollapsedGroups(new Set(allCourseIds));
    if (isOrgTrainingView) setCollapsedPhases(new Set(enrichedTrainingPhases.map(p => p.id)));
  };

  // 阶段视图专用控制：仅影响阶段折叠
  const expandAllPhases = () => setCollapsedPhases(new Set());
  const collapseAllPhases = () => setCollapsedPhases(new Set(enrichedTrainingPhases.map(p => p.id)));
  const [phaseViewCompactMode, setPhaseViewCompactMode] = useState(true);

  const scrollToVideoCard = (videoId) => {
    try {
      const el = document.getElementById(`video-card-${videoId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightVideoId(videoId);
        setTimeout(() => setHighlightVideoId(null), 1600);
      }
    } catch (e) {
      // ignore
    }
  };

  const computeGroupSummary = (videos) => {
    let totalSeconds = 0;
    let watchedSeconds = 0;
    let scoreSum = 0;
    let scoreCount = 0;
    videos.forEach(v => {
      const info = v.videoInfo || {};
      if (info.type === 'multi_video') {
        const td = Number(info.totalDuration || 0);
        const wd = Number(info.watchedDuration || 0);
        totalSeconds += td;
        watchedSeconds += wd;
      } else {
        const d = Number(info.duration || 0);
        const p = Number(info.progress || 0) / 100;
        totalSeconds += d;
        watchedSeconds += d * p;
      }
      const s = v.score != null ? Number(v.score) : (info && info.score != null ? Number(info.score) : null);
      if (!isNaN(s)) {
        scoreSum += s;
        scoreCount += 1;
      }
    });
    const overallProgress = totalSeconds > 0 ? Math.round((watchedSeconds / totalSeconds) * 100) : 0;
    const avgScore = scoreCount > 0 ? Math.round(scoreSum / scoreCount) : null;
    return {
      totalMinutes: Math.round(totalSeconds / 60),
      totalHours: Math.round((totalSeconds / 3600) * 10) / 10,
      overallProgress,
      avgScore
    };
  };

  // 阶段分类汇总（学时与成绩）
  const computePhaseCategorySummary = (phase) => {
    const m = phase?.materials || {};
    const videos = Array.isArray(m.videos) ? m.videos : [];
    const lives = Array.isArray(m.live) ? m.live : [];
    const exams = Array.isArray(m.exam) ? m.exam : [];
    const achievementsArr = Array.isArray(m.achievements) ? m.achievements : [];
    const linksArr = Array.isArray(m.links) ? m.links : [];
    const textsArr = Array.isArray(m.texts) ? m.texts : [];
    const projectsArr = Array.isArray(m.trainingProjects) ? m.trainingProjects : [];

    const videoSummary = computeGroupSummary(videos);
    // 视频成绩总和（如果有）
    let videoScoreSum = 0;
    videos.forEach(v => {
      const info = v.videoInfo || {};
      const s = v.score != null ? Number(v.score) : (info && info.score != null ? Number(info.score) : null);
      if (!isNaN(s)) videoScoreSum += s;
    });

    // 直播学时：按 startTime/endTime 估算时长
    const parseDate = (str) => {
      try {
        const t = Date.parse(String(str).replace(/-/g, '/'));
        return isNaN(t) ? null : new Date(t);
      } catch (e) { return null; }
    };
    let liveMinutes = 0;
    lives.forEach(s => {
      const st = parseDate(s.startTime);
      const et = parseDate(s.endTime);
      if (st && et) {
        const diff = Math.max(0, (et.getTime() - st.getTime()) / 60000);
        liveMinutes += Math.round(diff);
      } else {
        // 无法解析则按90分钟估算
        liveMinutes += 90;
      }
    });
    const liveHours = Math.round((liveMinutes / 60) * 10) / 10;

    // 考试成绩：如果文件有 score 字段则累加，否则为0
    let examScoreSum = 0;
    exams.forEach(f => {
      const s = f.score != null ? Number(f.score) : 0;
      if (!isNaN(s)) examScoreSum += s;
    });

    // 研修成果成绩：若条目带 score 则累加
    let achievementsScoreSum = 0;
    achievementsArr.forEach(a => {
      const s = a.score != null ? Number(a.score) : 0;
      if (!isNaN(s)) achievementsScoreSum += s;
    });

    // 其它分类默认不计学时与成绩，仅展示存在与否（保持为0）
    const categories = [];
    if (videos.length > 0) categories.push({ key: 'videos', label: '课程视频', hours: videoSummary.totalHours || 0, score: (videoScoreSum > 0 ? videoScoreSum : (videoSummary.avgScore ?? null)) });
    if (lives.length > 0) categories.push({ key: 'live', label: '直播课程', hours: liveHours || 0, score: null });
    if (achievementsArr.length > 0) categories.push({ key: 'achievements', label: '研修成果', hours: 0, score: achievementsScoreSum || null });
    if (exams.length > 0) categories.push({ key: 'exam', label: '考试/试卷', hours: 0, score: examScoreSum });
    if (linksArr.length > 0) categories.push({ key: 'links', label: '阅读材料', hours: 0, score: null });
    if (textsArr.length > 0) categories.push({ key: 'texts', label: '反思文本', hours: 0, score: null });
    if (projectsArr.length > 0) categories.push({ key: 'projects', label: '培训项目资料', hours: 0, score: null });

    const totalHours = categories.reduce((sum, c) => sum + (Number(c.hours) || 0), 0);
    const totalScore = categories.reduce((sum, c) => {
      const s = (c.score == null ? 0 : Number(c.score));
      return isNaN(s) ? sum : sum + s;
    }, 0);

    return { categories, totalHours: Math.round(totalHours * 10) / 10, totalScore };
  };

  // 阶段达标评估：结合视频进度与考试成绩
  const assessPhasePass = (phase) => {
    const videos = phase?.materials?.videos || [];
    const summary = computeGroupSummary(videos);
    const ps = computePhaseCategorySummary(phase);
    const examCat = ps?.categories?.find(c => c.key === 'exam');
    const examScore = examCat?.score;
    const totalHours = ps?.totalHours ?? (phase?.hours ?? 0);

    const progress = Number(summary?.overallProgress || 0);
    const PASS_PROGRESS = 60; // 进度达标阈值（%）
    const PASS_SCORE = 60;    // 成绩达标阈值（分）

    const passProgress = progress >= PASS_PROGRESS;
    const passScore = (examScore == null) ? true : Number(examScore) >= PASS_SCORE;
    const pass = passProgress && passScore;

    const completedMinutes = Math.round((summary?.totalMinutes || 0) * progress / 100);
    const tooltip = `考试：${summary?.totalMinutes || 0}分钟；已完成：${completedMinutes}分钟；进度：${progress}%；学时：${totalHours}；成绩：${examScore == null ? '未评分' : examScore + '分'}`;

    return { pass, tooltip, progress, examScore, totalHours, completedMinutes };
  };

  // 将层级数据扁平化为额外的视频条目，并与现有courseVideos合并用于显示
  const displayCourseVideos = useMemo(() => {
    // 允许在“培训需求管理”下显示层级课程视频

    // 若是“教研室”，阻止将多视频合并为层级，直接平铺显示，不引入层级扩展
    if (note?.category === 'teaching_research_office') {
      return (Array.isArray(courseVideos) ? courseVideos : []).map(v => {
        if (v?.videoInfo?.type === 'multi_video') {
          const total = v?.videoInfo?.totalVideos || 0;
          return Array.from({ length: Math.max(total, 1) }).map((_, idx) => ({
            id: `${v.id}-${idx + 1}`,
            title: `${v.title} - 片段${idx + 1}`,
            courseId: v.courseId,
            courseTitle: v.courseTitle,
            url: v.url,
            addTime: v.addTime,
            duration: Math.round((v?.videoInfo?.totalDuration || 0) / Math.max(total, 1)) + '秒',
            instructor: v.instructor,
            progress: Math.round((v?.videoInfo?.overallProgress || 0) / Math.max(total, 1)),
            videoInfo: { type: 'single_video' }
          }));
        }
        return v;
      }).flat();
    }

    // 所有分类：基础视频 + 层级扁平化扩展；在“组织培训/新教师教学方法培训”场景下仅保留对应主题视频
    const base = Array.isArray(courseVideos) ? courseVideos : [];
    let filteredBase = base;

    const isOrgMethodTheme = (
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (note?.tags && note.tags.includes('组织培训')) ||
      (note?.title && (note.title.includes('新教师教学方法培训') || note.title.includes('新教师教学方法')))
    );

    if (isOrgMethodTheme) {
      const keywords = ['新教师教学方法培训', '新教师教学方法', '教学方法培训'];
      filteredBase = base.filter(v => {
        const text = `${v.courseTitle || ''} ${v.title || ''}`.toLowerCase();
        const idText = `${v.courseId || ''}`.toLowerCase();
        return keywords.some(k => text.includes(k.toLowerCase())) || idText.includes('org_ntm');
      });
    }

    try {
      const hierarchy = getMockCourseContentHierarchy();
      const extra = flattenCourseContentToVideos(hierarchy);
      const existingIds = new Set(filteredBase.map(v => v.id));
      return filteredBase.concat(extra.filter(v => !existingIds.has(v.id)));
    } catch (e) {
      return filteredBase;
    }
  }, [courseVideos, note?.category, note?.title, note?.source, note?.courseType, note?.tags]);

  // 所有课程ID用于全局折叠/展开控制（基于 displayCourseVideos）
  const allCourseIds = useMemo(() => {
    const ids = new Set();
    (Array.isArray(displayCourseVideos) ? displayCourseVideos : []).forEach(v => {
      ids.add(v.courseId || v.id);
    });
    return Array.from(ids);
  }, [displayCourseVideos]);

  // 首次初始化：默认全部折叠（课程分组与阶段）并保证按钮显示“全部展开”
  const initializedCollapseRef = useRef({ groups: false, phases: false });
  useEffect(() => {
    if (!initializedCollapseRef.current.groups && Array.isArray(allCourseIds) && allCourseIds.length > 0) {
      setCollapsedGroups(new Set(allCourseIds));
      initializedCollapseRef.current.groups = true;
    }
  }, [allCourseIds]);

  useEffect(() => {
    if (isOrgTrainingView && !initializedCollapseRef.current.phases && Array.isArray(enrichedTrainingPhases) && enrichedTrainingPhases.length > 0) {
      setCollapsedPhases(new Set(enrichedTrainingPhases.map(p => p.id)));
      initializedCollapseRef.current.phases = true;
    }
  }, [isOrgTrainingView, enrichedTrainingPhases]);

  // 将上传文件按是否为试卷分组
  const examFiles = useMemo(() => {
    return Array.isArray(uploadedFiles) ? uploadedFiles.filter(f => f.isPaper) : [];
  }, [uploadedFiles]);

  const nonExamFiles = useMemo(() => {
    return Array.isArray(uploadedFiles) ? uploadedFiles.filter(f => !f.isPaper) : [];
  }, [uploadedFiles]);

  // 展示用：去掉文件名扩展名
  const getFileDisplayName = (name) => {
    if (typeof name !== 'string') return name;
    const idx = name.lastIndexOf('.');
    if (idx > 0) return name.slice(0, idx);
    return name;
  };

  // 添加渲染调试日志
  console.log('MaterialManagement: 组件渲染，showPlannedLabels =', showPlannedLabels);

  // 监听学习计划同步事件
  useEffect(() => {
    const handleSyncEvent = (event) => {
      console.log('MaterialManagement: 收到同步事件', event.type, event.detail);
      // 检查是否有同步的学习计划
      const syncedPlans = JSON.parse(localStorage.getItem('synced-learning-plans') || '[]');
      console.log('MaterialManagement: 当前同步计划', syncedPlans);
      const shouldShow = syncedPlans.length > 0;
      console.log('MaterialManagement: 设置showPlannedLabels为', shouldShow);
      setShowPlannedLabels(shouldShow);
      console.log('MaterialManagement: setShowPlannedLabels调用完成，当前showPlannedLabels =', showPlannedLabels);
    };

    // 监听同步事件（包括取消同步）
    window.addEventListener('calendarCategoriesChanged', handleSyncEvent);
    
    // 监听localStorage变化（跨窗口）
    window.addEventListener('storage', handleSyncEvent);

    // 添加自定义事件监听，用于同页面内的同步状态变化
    window.addEventListener('syncedPlansChanged', handleSyncEvent);

    // 不执行初始检查，确保页面初始化时不显示计划标识

    return () => {
      window.removeEventListener('calendarCategoriesChanged', handleSyncEvent);
      window.removeEventListener('storage', handleSyncEvent);
      window.removeEventListener('syncedPlansChanged', handleSyncEvent);
    };
  }, []);

  // 文件上传处理
  const handleFileUpload = (info) => {
    const { status, originFileObj } = info.file;
    
    if (status === 'done') {
      const newFile = {
        id: Date.now(),
        name: originFileObj.name,
        size: originFileObj.size,
        type: originFileObj.type,
        uploadTime: new Date().toISOString(),
        content: '文件内容预览...'
      };
      setUploadedFiles(prev => [...prev, newFile]);
      message.success(`${originFileObj.name} 上传成功`);
    } else if (status === 'error') {
      message.error(`${originFileObj.name} 上传失败`);
    }
  };

  // 添加链接
  const handleAddLink = () => {
    if (!newLink.trim()) {
      message.warning('请输入有效的链接地址');
      return;
    }
    
    const linkObj = {
      id: Date.now(),
      url: newLink,
      title: '链接标题',
      addTime: new Date().toISOString()
    };
    
    setLinks(prev => [...prev, linkObj]);
    setNewLink('');
    message.success('链接添加成功');
  };

  // 添加网站地址处理函数
  const handleAddWebsite = () => {
    if (!websiteUrl.trim()) {
      message.warning('请输入有效的网站地址');
      return;
    }

    // 验证视频网站地址
    if (websiteType === 'video') {
      const { isBilibili, isXiaohongshu } = checkVideoWebsiteType(websiteUrl);
      
      if (!isBilibili && !isXiaohongshu) {
        message.warning('视频地址仅支持B站和小红书链接');
        return;
      }
    }
    
    const websiteObj = {
      id: Date.now(),
      url: websiteUrl,
      type: websiteType,
      title: websiteType === 'video' ? '视频链接' : '网站链接',
      platform: websiteType === 'video' ? 
        (websiteUrl.includes('bilibili.com') || websiteUrl.includes('b23.tv') ? 'B站' : '小红书') : 
        '普通网站',
      addTime: new Date().toISOString()
    };
    
    setLinks(prev => [...prev, websiteObj]);
    setWebsiteUrl('');
    message.success(`${websiteType === 'video' ? '视频' : '网站'}地址添加成功`);
  };

  // 添加文字内容处理函数
  const handleAddText = () => {
    if (!textContent.trim()) {
      message.warning('请输入文字内容');
      return;
    }

    const textObj = {
      id: Date.now(),
      content: textContent.trim(),
      type: 'text',
      title: textContent.trim().length > 20 ? textContent.trim().substring(0, 20) + '...' : textContent.trim(),
      addTime: new Date().toISOString()
    };

    setAddedTexts(prev => [...prev, textObj]);
    setTextContent('');
    message.success('文字内容添加成功');
  };

  // 删除文字内容
  const handleDeleteText = (textId) => {
    setAddedTexts(prev => prev.filter(text => text.id !== textId));
    message.success('文字内容删除成功');
  };

  // 添加课程视频
  const handleAddVideo = () => {
    if (!videoTitle.trim()) {
      message.error('请输入视频标题');
      return;
    }
    if (!videoUrl.trim()) {
      message.error('请输入视频链接');
      return;
    }

    if (!validateUrl(videoUrl)) {
      message.error('请输入有效的视频链接');
      return;
    }

    const videoObj = {
      id: Date.now(),
      title: videoTitle.trim(),
      url: videoUrl.trim(),
      addedAt: new Date().toLocaleString()
    };

    setCourseVideos(prev => [...prev, videoObj]);
    setVideoTitle('');
    setVideoUrl('');
    message.success('课程视频添加成功');
  };

  // 添加选课
  const handleAddCourse = (course) => {
    const isAlreadyAdded = selectedCourses.some(c => c.id === course.id);
    if (isAlreadyAdded) {
      message.warning('该课程已经添加过了');
      return;
    }

    const courseObj = {
      id: course.id || Date.now(),
      title: course.title,
      instructor: course.instructor,
      duration: course.duration,
      description: course.description || '',
      addedAt: new Date().toLocaleString(),
      type: 'course'
    };

    setSelectedCourses(prev => [...prev, courseObj]);
    message.success(`已添加课程：${course.title}`);
  };

  // 删除课程视频
  const handleDeleteVideo = (videoId) => {
    setCourseVideos(prev => prev.filter(video => video.id !== videoId));
    message.success('课程视频删除成功');
  };

  // 删除文件
  const handleDeleteFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    message.success('文件删除成功');
  };

  // 删除链接
  const handleDeleteLink = (linkId) => {
    setLinks(links.filter(link => link.id !== linkId));
    message.success('链接删除成功');
  };

  // 多选功能处理函数
  const handleSelectMaterial = (materialId, checked) => {
    if (checked) {
      setSelectedMaterials([...selectedMaterials, materialId]);
    } else {
      setSelectedMaterials(selectedMaterials.filter(id => id !== materialId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allMaterialIds = [
        ...examFiles.map(file => `file-${file.id}`),
        ...nonExamFiles.map(file => `file-${file.id}`),
        ...addedTexts.map(text => `text-${text.id}`),
        ...displayCourseVideos.map(video => `video-${video.id}`),
        ...links.map(link => `link-${link.id}`),
        ...organizationalCourses.map(course => `course-${course.id}`),
        ...(Array.isArray(liveStreams) ? liveStreams.map(stream => `live-${stream.id}`) : [])
      ];
      setSelectedMaterials(allMaterialIds);
    } else {
      setSelectedMaterials([]);
    }
  };

  const handleSelectPhaseAll = (checked) => {
    const phaseIds = Array.from(new Set(
      (Array.isArray(phaseMaterials) ? phaseMaterials : []).flatMap(phase => [
        ...(Array.isArray(phase.materials?.videos) ? phase.materials.videos.map(v => `video-${v.id}`) : []),
        ...(Array.isArray(phase.materials?.live) ? phase.materials.live.map(s => `live-${s.id}`) : []),
        ...(Array.isArray(phase.materials?.links) ? phase.materials.links.map(l => `link-${l.id}`) : []),
        ...(Array.isArray(phase.materials?.texts) ? phase.materials.texts.map(t => `text-${t.id}`) : []),
        ...(Array.isArray(phase.materials?.achievements) ? phase.materials.achievements.map(a => `achievement-${a.id}`) : []),
        ...(Array.isArray(phase.materials?.exam) ? phase.materials.exam.map(f => `file-${f.id}`) : []),
      ])
    ));
    if (checked) {
      setSelectedMaterials(prev => Array.from(new Set([...(Array.isArray(prev) ? prev : []), ...phaseIds])));
    } else {
      setSelectedMaterials(prev => (Array.isArray(prev) ? prev.filter(id => !phaseIds.includes(id)) : []));
    }
  };

  // 未分类模块的全选功能
  const handleUncategorizedSelectAll = (checked) => {
    const uncLive = (Array.isArray(liveStreams) ? liveStreams : []).filter(s => moduleAssignments.live[s.id] === 'uncategorized');
    const uncVideos = (Array.isArray(courseVideos) ? courseVideos : []).filter(v => moduleAssignments.videos[v.id] === 'uncategorized');
    const uncExams = (Array.isArray(examFiles) ? examFiles : []).filter(f => moduleAssignments.exam[f.id] === 'uncategorized');
    const uncLinks = (Array.isArray(links) ? links : []).filter(l => moduleAssignments.links[l.id] === 'uncategorized');
    const uncTexts = (Array.isArray(addedTexts) ? addedTexts : []).filter(t => moduleAssignments.texts[t.id] === 'uncategorized');
    const uncProjects = (Array.isArray(trainingProjects) ? trainingProjects : []).filter(p => moduleAssignments.projects[p.id] === 'uncategorized');
    
    const uncategorizedIds = [
      ...uncLive.map(s => `live-${s.id}`),
      ...uncVideos.map(v => `video-${v.id}`),
      ...uncExams.map(f => `file-${f.id}`),
      ...uncLinks.map(l => `link-${l.id}`),
      ...uncTexts.map(t => `text-${t.id}`),
      ...uncProjects.map(p => `project-${p.id}`)
    ];
    
    if (checked) {
      setSelectedMaterials(prev => Array.from(new Set([...(Array.isArray(prev) ? prev : []), ...uncategorizedIds])));
    } else {
      setSelectedMaterials(prev => (Array.isArray(prev) ? prev.filter(id => !uncategorizedIds.includes(id)) : []));
    }
  };

  // 未分类模块的全部展开/折叠功能
  const handleUncategorizedExpandAll = (expanded) => {
    setUncategorizedExpanded({
      live: expanded,
      videos: expanded,
      exam: expanded,
      links: expanded,
      texts: expanded,
      projects: expanded
    });
  };

  const handleBatchDelete = () => {
    selectedMaterials.forEach(materialId => {
      const [type, id] = materialId.split('-');
      const numId = parseInt(id);
      
      switch (type) {
        case 'file':
          setUploadedFiles(prev => prev.filter(file => file.id !== numId));
          break;
        case 'text':
          setAddedTexts(prev => prev.filter(text => text.id !== numId));
          break;
        case 'video':
          setCourseVideos(prev => prev.filter(video => video.id !== numId));
          break;
        case 'link':
          setLinks(prev => prev.filter(link => link.id !== numId));
          break;
        case 'course':
          setOrganizationalCourses(prev => prev.filter(course => course.id !== numId));
          break;
        case 'project':
          setTrainingProjects(prev => prev.filter(p => p.id !== id));
          break;
        case 'live':
          setLiveStreams(prev => {
            const matchId = isNaN(numId) ? id : numId;
            return (Array.isArray(prev) ? prev.filter(stream => stream.id !== matchId) : []);
          });
          break;
      }
    });
    setSelectedMaterials([]);
    message.success(`已删除 ${selectedMaterials.length} 个资料`);
  };

  // 保存标题
  const handleSaveTitle = async () => {
    const trimmed = (localTitle || '').trim();
    if (!trimmed) {
      message.warning('标题不能为空');
      setLocalTitle(note?.title || '');
      setIsEditingTitle(false);
      return;
    }
    if (trimmed === (note?.title || '')) {
      setIsEditingTitle(false);
      return;
    }
    try {
      if (note?.id) {
        const updated = await notesService.updateNote(note.id, { title: trimmed });
        setLocalTitle(updated.title);
      } else {
        setLocalTitle(trimmed);
      }
      if (state?.setEditingNote) {
        state.setEditingNote(prev => {
          if (!prev) return prev;
          if (note?.id && prev.id !== note.id) return prev;
          return { ...prev, title: trimmed };
        });
      }
      message.success('主题标题已更新');
    } catch (e) {
      message.error(`更新失败: ${e.message || e}`);
    } finally {
      setIsEditingTitle(false);
    }
  };

  return (
    <div style={{ 
      flex: (currentView === 'video' || currentView === VIEW_MODES.TRAINING_PLAN_THREE_COLUMN) ? 4 : (viewMode === 'map' ? 4 : 2.5), 
      background: '#fff', 
      margin: '16px 0 16px 16px', 
      borderRadius: '8px', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'flex 0.3s ease'
    }}>
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isEditingTitle ? (
              <Input
                size="small"
                value={localTitle}
                autoFocus
                onChange={(e) => setLocalTitle(e.target.value)}
                onPressEnter={() => handleSaveTitle()}
                onBlur={() => handleSaveTitle()}
                placeholder="请输入主题标题"
                style={{ width: 260 }}
              />
            ) : (
              <Title
                level={5}
                style={{ margin: 0, color: '#1f1f1f', cursor: 'pointer' }}
                onClick={() => setIsEditingTitle(true)}
                title="点击编辑标题"
              >
                {localTitle || '未命名主题'}
              </Title>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {onBack && (
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={onBack}
                style={{ color: '#666' }}
              >
                返回
              </Button>
            )}
          </div>
        </div>
        
        {/* 操作按钮区域 */}
        <div style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            style={{ flex: 1 }}
            onClick={() => setShowMaterialAddModal(true)}
          >
            添加
          </Button>
          <Button 
            type="default" 
            style={{ flex: 1 }}
            onClick={() => setShowExploreModal(true)}
          >
            探索
          </Button>
        </div>
        
        {/* 视图模式切换 - 仅在有知识图谱或能力模型相关资料时显示 */}
        {((capabilityMap && showCapabilityMapModal) || (knowledgeGraph && showKnowledgeGraphModal)) && (
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <Button.Group>
              <Button 
                type={viewMode === 'card' ? 'primary' : 'default'}
                icon={<Grid size={16} />}
                onClick={() => setViewMode('card')}
                size="small"
              >
                卡片模式
              </Button>
              <Button 
                type={viewMode === 'map' ? 'primary' : 'default'}
                icon={<MapIcon size={16} />}
                onClick={() => setViewMode('map')}
                size="small"
              >
                地图模式
              </Button>
            </Button.Group>
          </div>
        )}
        
        <Divider style={{ margin: '16px 0' }} />
        
        {/* 选择所有来源 */}
        {!isOrgTrainingView && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          marginBottom: 12,
          border: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* 新增模块按钮位于折叠按钮同一行的左侧 */}
            <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={() => setAddModuleModalVisible(true)}>
              新增模块
            </Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* 全局折叠/展开单一图标按钮 */}
            <Tooltip title={collapsedSections.videos && collapsedSections.live && collapsedSections.examFiles && collapsedSections.files && collapsedSections.links && collapsedSections.texts && collapsedSections.trainingProjects && collapsedGroups.size === allCourseIds.length ? '全部展开' : '全部折叠'}>
              <Button 
                size="small"
                type="default"
                onClick={() => {
                  const allCollapsed = (
                    collapsedSections.videos &&
                    collapsedSections.live &&
                    collapsedSections.examFiles &&
                    collapsedSections.files &&
                    collapsedSections.links &&
                    collapsedSections.texts &&
                    collapsedSections.trainingProjects &&
                    collapsedGroups.size === allCourseIds.length
                  );
                  if (allCollapsed) {
                    expandAllSections();
                  } else {
                    collapseAllSections();
                  }
                }}
                icon={(
                  collapsedSections.videos &&
                  collapsedSections.live &&
                  collapsedSections.examFiles &&
                  collapsedSections.files &&
                  collapsedSections.links &&
                  collapsedSections.texts &&
                  collapsedSections.trainingProjects &&
                  collapsedGroups.size === allCourseIds.length
                  ? <DownOutlined />
                  : <RightOutlined />
                )}
                style={{ fontSize: '12px', height: 'auto', padding: '2px 8px' }}
              >
                {(
                  collapsedSections.videos &&
                  collapsedSections.live &&
                  collapsedSections.examFiles &&
                  collapsedSections.files &&
                  collapsedSections.links &&
                  collapsedSections.texts &&
                  collapsedSections.trainingProjects &&
                  collapsedGroups.size === allCourseIds.length
                ) ? '全部展开' : '全部折叠'}
              </Button>
            </Tooltip>
            <Checkbox 
              checked={selectedMaterials.length > 0 && selectedMaterials.length === (
                uploadedFiles.length + addedTexts.length + displayCourseVideos.length + links.length + organizationalCourses.length + liveStreams.length + (trainingProjects?.length || 0)
              )}
              indeterminate={selectedMaterials.length > 0 && selectedMaterials.length < (
                uploadedFiles.length + addedTexts.length + displayCourseVideos.length + links.length + organizationalCourses.length + liveStreams.length + (trainingProjects?.length || 0)
              )}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            {selectedMaterials.length > 0 && (
              <Popconfirm
                title="确认删除"
                description={`确定要删除选中的 ${selectedMaterials.length} 个资料吗？`}
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="link"
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                  style={{ 
                    fontSize: '12px',
                    height: 'auto',
                    padding: '2px 4px',
                    opacity: 0.7
                  }}
                >
                  删除选中 ({selectedMaterials.length})
              </Button>
              </Popconfirm>
            )}
          </div>
        </div>
        )}

        {/* 资料列表内容区域 */}
        <div className="mm-scroll" style={{ 
          flex: 1,
          minHeight: 0,
          overflowY: 'auto'
        }}>
          {/* 根据视图模式显示不同内容 */}
          {viewMode === 'map' ? (
            /* 地图模式 - 根据资料类型显示对应地图 */
            <div style={{ height: '100%' }}>
              {/* 能力模型地图 - 当有能力模型资料时显示 */}
              {capabilityMap && showCapabilityMapModal && (
                <div style={{ height: '100%' }}>
                  <div style={{ 
                    height: 'calc(100% - 12px)', 
                    border: '1px solid #e8e8e8', 
                    borderRadius: '8px',
                    background: '#fafafa',
                    position: 'relative'
                  }}>
                    <CapabilityMindMap 
                      capabilityMap={capabilityMap}
                      selectedCategory={'all'}
                      onNodeClick={onCapabilityNodeClick}
                      onVideoClick={onCapabilityVideoClick}
                    />
                  </div>
                </div>
              )}
              
              {/* 知识图谱地图 - 当有知识图谱资料时显示 */}
              {knowledgeGraph && showKnowledgeGraphModal && (
                <div style={{ height: '100%' }}>
                  <div style={{ 
                    height: 'calc(100% - 12px)', 
                    border: '1px solid #e8e8e8', 
                    borderRadius: '8px',
                    background: '#fafafa',
                    position: 'relative'
                  }}>
                    <KnowledgeGraphMindMap 
                      knowledgeGraph={knowledgeGraph}
                      selectedCategory={'all'}
                      onNodeClick={onKnowledgeNodeClick}
                      onResourceClick={onKnowledgeResourceClick}
                    />
                  </div>
                </div>
              )}
              
              {/* 地图模式下的空状态 */}
              {(!capabilityMap || !showCapabilityMapModal) && (!knowledgeGraph || !showKnowledgeGraphModal) && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                  <NodeIndexOutlined style={{ fontSize: 48, marginBottom: 16, color: '#ccc' }} />
                  <div style={{ fontSize: 16, marginBottom: 8 }}>暂无地图数据</div>
                  <div style={{ fontSize: 12 }}>请先添加能力模型或知识图谱相关资料</div>
                </div>
              )}
            </div>
          ) : (
            /* 卡片模式 - 原有的资料列表显示 */
            <div>
              {/* 培训项目（置顶） */}
              {trainingProjects.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {collapsedSections.trainingProjects ? (
                        <RightOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('trainingProjects')} />
                      ) : (
                        <DownOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('trainingProjects')} />
                      )}
                      <Text strong style={{ fontSize: '12px', color: '#666' }}>
                        📌 培训项目资料 ({trainingProjects.length})
                      </Text>
                    </div>
                  </div>
                  {!collapsedSections.trainingProjects && trainingProjects.map(p => (
                    <Card
                      key={`project-${p.id}`}
                      size="small"
                      style={{ marginBottom: 8, border: '1px solid #e8e8e8', position: 'relative' }}
                      bodyStyle={{ padding: '8px 12px' }}
                      onClick={() => handlers?.onViewTrainingProject && handlers.onViewTrainingProject(p)}
                      onMouseEnter={() => setHoveredItems(prev => ({ ...(prev || {}), [`project-${p.id}`]: true }))}
                      onMouseLeave={() => setHoveredItems(prev => ({ ...(prev || {}), [`project-${p.id}`]: false }))}
                    >
                      <div style={{ position: 'absolute', top: 6, right: 8, display: 'flex', gap: 8, background: 'rgba(255,255,255,0.85)', borderRadius: 4, padding: '2px 6px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', opacity: hoveredItems?.[`project-${p.id}`] ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: hoveredItems?.[`project-${p.id}`] ? 'auto' : 'none' }}>
                        {hoveredItems?.[`project-${p.id}`] ? (
                          <Dropdown
                            trigger={['click']}
                            placement="bottomLeft"
                          menu={{
                            items: [
                              {
                                key: 'attachments',
                                icon: <PaperClipOutlined />,
                                label: '附件',
                                onClick: () => {
                                  try {
                                    const pseudoAchievement = { id: `project-${p.id}`, title: p.title, description: p.sourceType || '培训项目资料' };
                                    handlers?.onViewMaterial && handlers.onViewMaterial(pseudoAchievement, 'achievement');
                                  } catch (e) { /* no-op */ }
                                }
                              },
                              {
                                key: 'delete',
                                icon: <DeleteOutlined />,
                                label: '删除',
                                onClick: () => setTrainingProjects(prev => prev.filter(x => x.id !== p.id))
                              }
                            ]
                          }}
                          >
                            <Button type="link" size="small" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
                          </Dropdown>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, gap: 8, cursor: 'pointer' }} onClick={() => handlers?.onViewTrainingProject && handlers.onViewTrainingProject(p)}>
                          <Text strong style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.title}
                          </Text>
                          <Tag color="blue">{p.sourceType || '培训方案'}</Tag>
                          <Text type="secondary" style={{ fontSize: 10 }}>
                            {p.addTime}
                          </Text>
                        </div>
                        <Checkbox
                          checked={selectedMaterials.includes(`project-${p.id}`)}
                          onChange={(e) => handleSelectMaterial(`project-${p.id}`, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              {/* 模块切换栏已移除，模块呈现为下方卡片；新增模块按钮已移动到顶部折叠行左侧 */}

              {/* 非组织视图：模块作为卡片，卡片内按类型分组展示 */}
              {!isOrgTrainingView && (
                <div style={{ marginBottom: 16 }}>
                  {modules.map(mod => {
                    const modLive = (Array.isArray(liveStreams) ? liveStreams : []).filter(s => moduleAssignments.live[s.id] === mod.id);
                    const modVideos = (Array.isArray(courseVideos) ? courseVideos : []).filter(v => moduleAssignments.videos[v.id] === mod.id);
                    const modExams = (Array.isArray(examFiles) ? examFiles : []).filter(f => moduleAssignments.exam[f.id] === mod.id);
                    const modLinks = (Array.isArray(links) ? links : []).filter(l => moduleAssignments.links[l.id] === mod.id);
                    const modTexts = (Array.isArray(addedTexts) ? addedTexts : []).filter(t => moduleAssignments.texts[t.id] === mod.id);
                    const modProjects = (Array.isArray(trainingProjects) ? trainingProjects : []).filter(p => moduleAssignments.projects[p.id] === mod.id);
                    const tagSpecs = [
                      { key: 'live', present: modLive.length > 0, label: '直播课程', color: 'cyan' },
                      { key: 'videos', present: modVideos.length > 0, label: '课程视频', color: 'geekblue' },
                      { key: 'exam', present: modExams.length > 0, label: '考试/试卷', color: 'purple' },
                      { key: 'links', present: modLinks.length > 0, label: '阅读材料', color: 'blue' },
                      { key: 'texts', present: modTexts.length > 0, label: '文本', color: 'gold' },
                      { key: 'projects', present: modProjects.length > 0, label: '培训项目资料', color: 'green' }
                    ];
                    return (
                      <div key={`module-card-${mod.id}`} style={{ marginBottom: 14, border: '1px solid #e8e8e8', borderLeft: '2px solid #91d5ff', borderRadius: 8, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 8px 6px 8px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, flex: 1 }}>
                            <Text strong style={{ fontSize: 13 }}>{mod.title}</Text>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              {tagSpecs.filter(t => t.present).map(t => (
                                <Tag color={t.color} key={`mod-${mod.id}-tag-${t.key}`}>{t.label}</Tag>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div style={{ padding: '4px 8px 8px 8px' }}>
                          {/* 模块内 - 直播课程 */}
                          {modLive.length > 0 && (
                            <div style={{ marginBottom: 10 }}>
                              <Text strong style={{ fontSize: 12, color: '#666' }}>📺 直播课程 ({modLive.length})</Text>
                              <div style={{ marginTop: 6 }}>
                                {modLive.map(stream => {
                                  const status = getLiveStreamStatus(stream);
                                  return (
                                    <Card key={`mod-${mod.id}-live-${stream.id}`} size="small" style={{ marginBottom: 8, border: '1px solid #e8e8e8' }} bodyStyle={{ padding: '8px 12px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                                          <PlayCircleOutlined style={{ color: '#1890ff' }} />
                                          <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>{stream.title}</Text>
                                          <Tag color={status === 'live' ? 'red' : status === 'upcoming' ? 'gold' : 'green'} style={{ marginLeft: 6 }}>
                                            {status === 'live' ? '直播中' : status === 'upcoming' ? '即将开始' : '已结束'}
                                          </Tag>
                                        </div>
                                        <Checkbox
                                          checked={selectedMaterials.includes(`live-${stream.id}`)}
                                          onChange={(e) => handleSelectMaterial(`live-${stream.id}`, e.target.checked)}
                                        />
                                      </div>
                                    </Card>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* 模块内 - 考试/试卷 */}
                          {modExams.length > 0 && (
                            <div style={{ marginBottom: 10 }}>
                              <Text strong style={{ fontSize: 12, color: '#666' }}>🎓 考试/试卷 ({modExams.length})</Text>
                              <div style={{ marginTop: 6 }}>
                                {modExams.map(file => (
                                  <Card key={`mod-${mod.id}-file-${file.id}`} size="small" style={{ marginBottom: 8, border: '1px solid #e8e8e8', position: 'relative' }} bodyStyle={{ padding: '8px 12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                        <FileTextOutlined style={{ color: '#722ed1', marginRight: 8, fontSize: 16 }} />
                                        <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>{file.name} <Tag color="purple" style={{ marginLeft: 6 }}>试卷</Tag></Text>
                                        <Text type="secondary" style={{ fontSize: 10, marginLeft: 8 }}>{file.uploadTime}</Text>
                                      </div>
                                      <Checkbox
                                        checked={selectedMaterials.includes(`file-${file.id}`)}
                                        onChange={(e) => handleSelectMaterial(`file-${file.id}`, e.target.checked)}
                                      />
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 其他类型可按需补充：课程视频/阅读材料/文本/培训项目资料 */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* 组织培训下：阶段分组视图 */}
              {isOrgTrainingView && phaseMaterials.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Text strong style={{ fontSize: '12px', color: '#666' }}>📦 模块</Text>
                      {(() => {
                        const overallProgress = (Array.isArray(phaseMaterials) && phaseMaterials.length > 0)
                          ? Math.round(phaseMaterials.reduce((sum, p) => sum + (assessPhasePass(p)?.progress ?? 0), 0) / phaseMaterials.length)
                          : 0;
                        const progressBg = 'var(--theme-primary, #1890ff)';
                        return (
                          <div style={{ width: 160, height: 6, background: '#edf2f7', borderRadius: 999, overflow: 'hidden', marginLeft: 10 }}>
                            <div style={{ width: `${overallProgress}%`, height: '100%', background: progressBg }} />
                          </div>
                        );
                      })()}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Button
                        size="small"
                        type="default"
                        icon={(phaseViewCompactMode || collapsedPhases.size === enrichedTrainingPhases.length) ? <RightOutlined /> : <DownOutlined />}
                        style={{ fontSize: '12px', height: 'auto', padding: '2px 10px', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                        onClick={() => {
                          const allCollapsed = phaseViewCompactMode || collapsedPhases.size === enrichedTrainingPhases.length;
                          if (allCollapsed) {
                            setPhaseViewCompactMode(false);
                            expandAllPhases();
                          } else {
                            setPhaseViewCompactMode(true);
                            collapseAllPhases();
                          }
                        }}
                      >
                        {(phaseViewCompactMode || collapsedPhases.size === enrichedTrainingPhases.length) ? '全部展开' : '全部折叠'}
                      </Button>
                      <Checkbox
                        checked={(() => {
                          const phaseIds = Array.from(new Set(
                            (Array.isArray(phaseMaterials) ? phaseMaterials : []).flatMap(phase => [
                              ...(Array.isArray(phase.materials?.videos) ? phase.materials.videos.map(v => `video-${v.id}`) : []),
                              ...(Array.isArray(phase.materials?.live) ? phase.materials.live.map(s => `live-${s.id}`) : []),
                              ...(Array.isArray(phase.materials?.links) ? phase.materials.links.map(l => `link-${l.id}`) : []),
                              ...(Array.isArray(phase.materials?.texts) ? phase.materials.texts.map(t => `text-${t.id}`) : []),
                              ...(Array.isArray(phase.materials?.achievements) ? phase.materials.achievements.map(a => `achievement-${a.id}`) : []),
                              ...(Array.isArray(phase.materials?.exam) ? phase.materials.exam.map(f => `file-${f.id}`) : []),
                            ])
                          ));
                          return phaseIds.length > 0 && phaseIds.every(id => selectedMaterials.includes(id));
                        })()}
                        indeterminate={(() => {
                          const phaseIds = Array.from(new Set(
                            (Array.isArray(phaseMaterials) ? phaseMaterials : []).flatMap(phase => [
                              ...(Array.isArray(phase.materials?.videos) ? phase.materials.videos.map(v => `video-${v.id}`) : []),
                              ...(Array.isArray(phase.materials?.live) ? phase.materials.live.map(s => `live-${s.id}`) : []),
                              ...(Array.isArray(phase.materials?.links) ? phase.materials.links.map(l => `link-${l.id}`) : []),
                              ...(Array.isArray(phase.materials?.texts) ? phase.materials.texts.map(t => `text-${t.id}`) : []),
                              ...(Array.isArray(phase.materials?.achievements) ? phase.materials.achievements.map(a => `achievement-${a.id}`) : []),
                              ...(Array.isArray(phase.materials?.exam) ? phase.materials.exam.map(f => `file-${f.id}`) : []),
                            ])
                          ));
                          const count = phaseIds.filter(id => selectedMaterials.includes(id)).length;
                          return count > 0 && count < phaseIds.length;
                        })()}
                        onChange={(e) => handleSelectPhaseAll(e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {phaseMaterials.map(phase => (
                    <div key={`phase-${phase.id}`} style={{ marginBottom: 14, border: '1px solid #e8e8e8', borderLeft: '2px solid #91d5ff', borderRadius: 8, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 8px 6px 8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {(phaseViewCompactMode || collapsedPhases.has(phase.id)) ? (
                              <RightOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => togglePhase(phase.id)} />
                            ) : (
                              <DownOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => togglePhase(phase.id)} />
                            )}
                            <Text strong style={{ fontSize: 13 }}>
                              {phase.id}｜{phase.content}
                            </Text>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            {(() => {
                              const m = phase.materials || {};
                              const tagSpecs = [
                                { key: 'live', present: Array.isArray(m.live) && m.live.length > 0, label: '直播课程', color: 'cyan' },
                                { key: 'videos', present: Array.isArray(m.videos) && m.videos.length > 0, label: '课程视频', color: 'geekblue' },
                                { key: 'achievements', present: Array.isArray(m.achievements) && m.achievements.length > 0, label: '研修成果', color: 'magenta' },
                                { key: 'exam', present: Array.isArray(m.exam) && m.exam.length > 0, label: '考试/试卷', color: 'purple' },
                                { key: 'links', present: Array.isArray(m.links) && m.links.length > 0, label: '阅读材料', color: 'blue' },
                                { key: 'texts', present: Array.isArray(m.texts) && m.texts.length > 0, label: '文本', color: 'gold' },
                                { key: 'projects', present: Array.isArray(m.trainingProjects) && m.trainingProjects.length > 0, label: '培训项目资料', color: 'green' }
                              ];
                              return tagSpecs
                                .filter(t => t.present)
                                .map(t => (<Tag color={t.color} key={`phase-${phase.id}-tag-${t.key}`}>{t.label}</Tag>))
                                .concat([<Tag color="geekblue" key={`phase-${phase.id}-hours`}>{phase.hours}学时</Tag>]);
                            })()}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12, color: '#666' }}>
                            {phase.startTime || '未定'} • {phase.endTime || '未定'}
                          </Text>
                          {(phaseViewCompactMode || collapsedPhases.has(phase.id)) && (() => {
                            const status = assessPhasePass(phase);
                            const barColor = '#1890ff';
                            return (
                              <Tooltip title={status.tooltip}>
                                <div style={{ width: 120 }}>
                                  <Progress
                                    percent={Math.round(status.progress ?? 0)}
                                    showInfo={false}
                                    size="small"
                                    strokeColor={barColor}
                                  />
                                </div>
                              </Tooltip>
                            );
                          })()}
                        </div>
                      </div>

                      {!(phaseViewCompactMode || collapsedPhases.has(phase.id)) && (() => {
                        const ps = computePhaseCategorySummary(phase);
                        if (!ps || !Array.isArray(ps.categories) || ps.categories.length === 0) return null;
                        const categories = ps.categories;
                        return (
                          <div style={{ padding: '8px 10px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 6, margin: '6px 0' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                              {categories.map((c) => (
                                <div key={`phase-${phase.id}-cat-${c.key}`} style={{ background: '#ffffff', border: '1px solid #f0e1a0', borderRadius: 6, padding: '6px 8px' }}>
                                  <Text style={{ fontSize: 12, color: '#614700', fontWeight: 600 }}>{c.label}</Text>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                    <Text style={{ fontSize: 12, color: '#333' }}>学时：{(c.hours ?? 0)}</Text>
                                    <Text style={{ fontSize: 12, color: '#333' }}>成绩：{(c.score == null ? '未评分' : `${c.score}分`)}</Text>
                                  </div>
                                </div>
                              ))}
                              <div style={{ background: '#ffffff', border: '1px dashed #ffe58f', borderRadius: 6, padding: '6px 8px' }}>
                                <Text style={{ fontSize: 12, color: '#614700', fontWeight: 600 }}>总计</Text>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                  <Text style={{ fontSize: 12, color: '#333' }}>总学时：{ps.totalHours}</Text>
                                  <Text style={{ fontSize: 12, color: '#333' }}>总成绩：{ps.totalScore}分</Text>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {!(phaseViewCompactMode || collapsedPhases.has(phase.id)) && (
                        <div style={{ padding: '8px', background: '#fafafa', borderTop: '1px dashed #f0f0f0', borderRadius: '0 0 8px 8px' }}>
                          {/* 分类汇总已移动到标题下方显示，避免标题右侧拥挤 */}
                          {/* 阶段内 - 课程视频 */}
                          {Array.isArray(phase.materials?.videos) && phase.materials.videos.length > 0 && (
                            <div style={{ marginTop: 8, background: '#ffffff', border: '1px solid #f0f0f0', borderLeft: '2px solid #91d5ff', borderRadius: 6, padding: 8 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text strong style={{ fontSize: 12, color: '#666' }}>📹 课程视频 ({phase.materials.videos.length})</Text>
                                <Button.Group>
                                  <Tooltip title="平铺视图">
                                    <Button 
                                      size="small"
                                      type={videoViewMode === 'flat' ? 'primary' : 'default'}
                                      icon={<AppstoreOutlined />}
                                      onClick={() => setVideoViewMode('flat')}
                                    />
                                  </Tooltip>
                                  <Tooltip title="层级视图">
                                    <Button 
                                      size="small"
                                      type={videoViewMode === 'hierarchy' ? 'primary' : 'default'}
                                      icon={<NodeIndexOutlined />}
                                      onClick={() => setVideoViewMode('hierarchy')}
                                    />
                                  </Tooltip>
                                </Button.Group>
                              </div>

                              {isOrgTrainingView && (() => {
                                const summaryAll = computeGroupSummary(phase.materials.videos);
                                const completedMinutes = Math.round(summaryAll.totalMinutes * (summaryAll.overallProgress || 0) / 100);
                                return (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 10px', background: '#f7f9fc', border: '1px solid #e6f4ff', borderRadius: 6, marginBottom: 8 }}>
                                    <Text style={{ fontSize: 12, color: '#333' }}>考试：{summaryAll.totalMinutes}分钟</Text>
                                    <Text style={{ fontSize: 12, color: '#333' }}>已完成：{completedMinutes}分钟</Text>
                                    <div style={{ width: 140 }}>
                                      <Progress percent={summaryAll.overallProgress} size="small" showInfo={false} strokeColor="#1890ff" />
                                    </div>
                                    <Tooltip title={`整体进度：${summaryAll.overallProgress}%`}>
                                      <Text style={{ fontSize: 11, color: '#1890ff' }}>{summaryAll.overallProgress}%</Text>
                                    </Tooltip>
                                    <Divider type="vertical" />
                                    <Text style={{ fontSize: 12, color: '#333' }}>学时：{phase.hours ?? summaryAll.totalHours}</Text>
                                    <Divider type="vertical" />
                                    <Text style={{ fontSize: 12, color: '#333' }}>成绩：{summaryAll.avgScore != null ? `${summaryAll.avgScore}分` : '未评分'}</Text>
                                  </div>
                                );
                              })()}

                              {Object.values(phase.materials.videos.reduce((groups, v) => {
                                const cid = v.courseId || v.id;
                                if (!groups[cid]) {
                                  groups[cid] = {
                                    courseId: cid,
                                    courseTitle: v.courseTitle || v.title,
                                    instructor: v.instructor,
                                    videos: []
                                  };
                                }
                                groups[cid].videos.push(v);
                                return groups;
                              }, {})).map(group => (
                                <div key={`phase-${phase.id}-course-${group.courseId}`} style={{ marginBottom: 8, border: '1px solid #e8e8e8', borderRadius: 8, padding: 8, background: '#fff' }}>
                                  {(() => {
                                    const summary = computeGroupSummary(group.videos);
                                    const collapsed = collapsedGroups.has(group.courseId);
                                    return (
                                      <div style={{ margin: '4px 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {collapsed ? (
                                              <RightOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleGroup(group.courseId)} />
                                            ) : (
                                              <DownOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleGroup(group.courseId)} />
                                            )}
                                            <Text strong style={{ fontSize: 13, cursor: 'pointer' }} onClick={() => toggleGroup(group.courseId)}>
                                              {group.courseTitle}
                                            </Text>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {videoViewMode === 'flat' && (
                                              <Tooltip title={hierarchyOpenCourses.has(group.courseId) ? '隐藏层级' : '显示层级'}>
                                                <NodeIndexOutlined style={{ fontSize: 14, color: '#1890ff', cursor: 'pointer' }} onClick={() => toggleHierarchy(group.courseId)} />
                                              </Tooltip>
                                            )}
                                            <Tooltip title="选择本课程">
                                              <Checkbox
                                                checked={group.videos.every(v => selectedMaterials.includes(`video-${v.id}`))}
                                                indeterminate={group.videos.some(v => selectedMaterials.includes(`video-${v.id}`)) && !group.videos.every(v => selectedMaterials.includes(`video-${v.id}`))}
                                                onChange={(e) => {
                                                  const checked = e.target.checked;
                                                  group.videos.forEach(v => handleSelectMaterial(`video-${v.id}`, checked));
                                                }}
                                              />
                                            </Tooltip>
                                          </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                            <Text type="secondary" style={{ fontSize: 11 }}>
                                              {(group.instructor || '未知讲师')} • {group.videos.length}个视频 • 总学时{summary.totalHours}小时
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: 11 }}>
                                              • 成绩 {summary.avgScore != null ? `${summary.avgScore}分` : '未评分'}
                                            </Text>
                                            {(() => {
                                              const struct = courseStructureIndex.get(group.courseId) || courseStructureIndex.get(resolveHierarchyId(group.courseId, group.courseTitle));
                                              if (!struct) return null;
                                              return (
                                                <Text type="secondary" style={{ fontSize: 11 }}>
                                                  • 章{struct.chapterCount} • 节{struct.sectionCount}
                                                </Text>
                                              );
                                            })()}
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 140 }}>
                                              <Progress percent={summary.overallProgress} size="small" showInfo={false} strokeColor="#1890ff" />
                                            </div>
                                            <Tooltip title={`整体进度：${summary.overallProgress}%`}>
                                              <Text style={{ fontSize: 10, color: '#1890ff' }}>{summary.overallProgress}%</Text>
                                            </Tooltip>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                  {(videoViewMode === 'hierarchy' || hierarchyOpenCourses.has(group.courseId)) && (() => {
                                    const course = resolveHierarchyCourse(group.courseId, group.courseTitle);
                                    const treeData = course ? (course.chapters || []).map(ch => ({
                                      key: `ch-${ch.id}`,
                                      type: 'chapter',
                                      title: ch.title,
                                      children: (ch.sections || []).map(sec => ({
                                        key: `sec-${sec.id}`,
                                        type: 'section',
                                        title: sec.title,
                                        videoCount: (sec.videos || []).length,
                                        children: (sec.videos || []).map(v => ({
                                          key: `v-${v.id}`,
                                          type: 'video',
                                          title: v.title,
                                          videoId: v.id,
                                          instructor: v.instructor,
                                          progress: v.progress || 0,
                                          duration: v.duration,
                                          score: v.score
                                        }))
                                      }))
                                    })) : buildTreeDataFromVideos(group.videos);
                                    const expanderState = new Map();
                                    const expanderFn = new Map();
                                    const columns = [
                                      {
                                        title: '名称',
                                        dataIndex: 'title',
                                        key: 'title',
                                        render: (text, record) => {
                                          const iconStyle = { fontSize: 14, color: '#8c8c8c' };
                                          const icon = record.type === 'video'
                                            ? <PlayCircleOutlined style={{ ...iconStyle, color: '#1890ff' }} />
                                            : record.type === 'chapter'
                                            ? <FolderOutlined style={iconStyle} />
                                            : <NodeIndexOutlined style={iconStyle} />;
                                          const name = record.type === 'video'
                                            ? <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>{text}</Text>
                                            : <Text strong style={{ fontSize: 12 }}>{text}</Text>;
                                          const isExpandable = Array.isArray(record.children) && record.children.length > 0;
                                          const isExpanded = expanderState.get(record.key);
                                          const switcher = isExpandable ? (
                                            <span
                                              className="mm-switcher"
                                              onClick={(e) => {
                                                const fn = expanderFn.get(record.key);
                                                if (fn) fn(record, e);
                                                e.stopPropagation();
                                              }}
                                            >
                                              {isExpanded ? <DownOutlined /> : <RightOutlined />}
                                            </span>
                                          ) : null;
                                          const depth = record.type === 'chapter' ? 0 : (record.type === 'section' ? 1 : 2);
                                          let left = null;
                                          if (record.type === 'video') {
                                            const percent = Math.round(record.progress || 0);
                                            const durationMin = Math.floor((record.duration || 0) / 60);
                                            const subtitle = `讲师：${record.instructor || '未知讲师'} • 进度 ${percent}%${Number.isFinite(durationMin) && durationMin > 0 ? ` • 时长 ${durationMin}分钟` : ''}`;
                                            left = (
                                              <div className="mm-title" style={{ marginLeft: `${depth * 16}px`, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                                {switcher}
                                                <span className="mm-icon">{icon}</span>
                                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                                                  {name}
                                                  <Text type="secondary" style={{ fontSize: 10 }}>
                                                    {subtitle}
                                                  </Text>
                                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                                    <div className="mm-inline-progress" aria-label="学习进度" style={{ flex: '0 0 120px' }}>
                                                      <div className="mm-inline-progress__bar" style={{ width: `${percent}%` }} />
                                                    </div>
                                                    <Text type="secondary" style={{ fontSize: 10 }}>{percent}%</Text>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          } else {
                                            left = (
                                              <div className="mm-title" style={{ marginLeft: `${depth * 16}px` }}>
                                                {switcher}
                                                <span className="mm-icon">{icon}</span>
                                                <span className="mm-name">{name}</span>
                                              </div>
                                            );
                                          }
                                          let right = null;
                                          return (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                              {left}
                                              {right}
                                            </div>
                                          );
                                        }
                                      }
                                    ];
                                    return (
                                      <div className="mm-shell" style={{ padding: 0, margin: '6px 0' }}>
                                        <Table
                                          columns={columns}
                                          dataSource={treeData}
                                          size="small"
                                          pagination={false}
                                          rowKey="key"
                                          showHeader={false}
                                          className="mm-table"
                                          style={{ width: '100%' }}
                                          tableLayout="fixed"
                                          defaultExpandAllRows
                                          rowClassName={(record) => `mm-row mm-${record.type} mm-level-${record.type === 'chapter' ? 0 : (record.type === 'section' ? 1 : 2)}`}
                                          expandable={{
                                            indentSize: 12,
                                            expandRowByClick: true,
                                            expandIcon: ({ expanded, onExpand, record }) => {
                                              expanderState.set(record.key, expanded);
                                              expanderFn.set(record.key, onExpand);
                                              return null;
                                            }
                                          }}
                                          onRow={(record) => ({
                                            onClick: () => {
                                              if (record.type === 'video' && record.videoId) {
                                                const videoObj = (group && Array.isArray(group.videos))
                                                  ? group.videos.find(v => v.id === record.videoId)
                                                  : null;
                                                if (videoObj) {
                                                  onPlayVideo(videoObj);
                                                } else {
                                                  scrollToVideoCard(record.videoId);
                                                }
                                              }
                                            }
                                          })}
                                        />
                                      </div>
                                    );
                                  })()}
                                  {!collapsedGroups.has(group.courseId) && videoViewMode === 'flat' && group.videos.map(video => (
                                    <Tooltip title={getVideoHierarchyPath(group.courseId, video)} placement="top" key={`phase-${phase.id}-video-${video.id}`}>
                                      <Card 
                                        id={`video-card-${video.id}`}
                                        size="small" 
                                        style={{ 
                                          marginBottom: 8,
                                          cursor: 'pointer',
                                          border: '1px solid #e8e8e8',
                                          position: 'relative',
                                          ...(highlightVideoId === video.id ? { boxShadow: '0 0 0 2px #1890ff', borderColor: '#1890ff' } : {})
                                        }}
                                        bodyStyle={{ padding: '8px 12px' }}
                                        onClick={() => onPlayVideo(video)}
                                        onMouseEnter={() => setHoveredItems(prev => ({ ...(prev || {}), [`video-${video.id}`]: true }))}
                                        onMouseLeave={() => setHoveredItems(prev => ({ ...(prev || {}), [`video-${video.id}`]: false }))}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                            {hoveredItems?.[`video-${video.id}`] ? (
                                              <Dropdown
                                                trigger={['click']}
                                                placement="bottomLeft"
                                                menu={{
                                                  items: [
                                                    { key: 'attachments', label: '附件', icon: <PaperClipOutlined /> }
                                                  ],
                                                  onClick: ({ key }) => {
                                                    if (key === 'attachments') {
                                                      try {
                                                        if (handlers && typeof handlers.onViewMaterial === 'function') {
                                                          handlers.onViewMaterial(video, 'achievement');
                                                        }
                                                      } catch (e) { /* no-op */ }
                                                    }
                                                  }
                                                }}
                                              >
                                                <Tooltip title="更多">
                                                  <MoreOutlined style={{ color: '#8c8c8c', marginRight: 8, fontSize: 16 }} onClick={(e) => e.stopPropagation()} />
                                                </Tooltip>
                                              </Dropdown>
                                            ) : (
                                              video.type === 'live_replay' ? (
                                                <div style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
                                                  <PlayCircleOutlined style={{ color: '#ff4d4f', marginRight: 4, fontSize: 16 }} />
                                                  <span style={{ 
                                                    background: '#ff4d4f', 
                                                    color: 'white', 
                                                    fontSize: '8px', 
                                                    padding: '1px 4px', 
                                                    borderRadius: '2px',
                                                    marginRight: 4
                                                  }}>LIVE</span>
                                                </div>
                                              ) : video.type === 'live_scheduled' ? (
                                                <div style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
                                                  <ClockCircleOutlined style={{ color: '#faad14', marginRight: 4, fontSize: 16 }} />
                                                  <span style={{ 
                                                    background: '#faad14', 
                                                    color: 'white', 
                                                    fontSize: '8px', 
                                                    padding: '1px 4px', 
                                                    borderRadius: '2px',
                                                    marginRight: 4
                                                  }}>预约</span>
                                                </div>
                                              ) : (
                                                <PlayCircleOutlined style={{ color: '#1890ff', marginRight: 8, fontSize: 16 }} />
                                              )
                                            )}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                              <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>
                                                {video.title}
                                              </Text>
                                              <Text type="secondary" style={{ fontSize: 10 }}>
                                                {video.type === 'live_replay' ? (
                                                  `回放 • ${video.liveDate} • ${video.instructor || '未知讲师'} • ${video.audience || 0}人观看`
                                                ) : video.type === 'live_scheduled' ? (
                                                  `预约直播 • ${video.scheduleDate} • ${video.instructor || '未知讲师'} • ${video.registered || 0}/${video.maxAudience || 0}人`
                                                ) : (
                                                  `${video.addTime} • ${video.instructor || '未知讲师'}`
                                                )}
                                              </Text>
                                              {video.videoInfo && (
                                                <div style={{ marginTop: '4px' }}>
                                                  {video.videoInfo.type === 'single_video' ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                      <Text style={{ fontSize: '8px', color: '#666', minWidth: '50px' }}>
                                                        学习进度
                                                      </Text>
                                                      <div style={{ 
                                                        flex: 1, 
                                                        height: '4px', 
                                                        backgroundColor: '#f0f0f0', 
                                                        borderRadius: '2px',
                                                        overflow: 'hidden'
                                                      }}>
                                                        <div style={{
                                                          width: `${video.videoInfo.progress || 0}%`,
                                                          height: '100%',
                                                          backgroundColor: '#1890ff',
                                                          borderRadius: '2px',
                                                          transition: 'width 0.3s ease'
                                                        }} />
                                                      </div>
                                                      <Text style={{ fontSize: '8px', color: '#1890ff', fontWeight: 'bold', minWidth: '25px' }}>
                                                        {video.videoInfo.progress || 0}%
                                                      </Text>
                                                    </div>
                                                  ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                      <Text style={{ fontSize: '8px', color: '#666', minWidth: '50px' }}>
                                                        学习进度
                                                      </Text>
                                                      <div style={{ 
                                                        flex: 1, 
                                                        height: '4px', 
                                                        backgroundColor: '#f0f0f0', 
                                                        borderRadius: '2px',
                                                        overflow: 'hidden'
                                                      }}>
                                                        <div style={{
                                                          width: `${video.videoInfo.overallProgress || 0}%`,
                                                          height: '100%',
                                                          backgroundColor: '#1890ff',
                                                          borderRadius: '2px',
                                                          transition: 'width 0.3s ease'
                                                        }} />
                                                      </div>
                                                      <Text style={{ fontSize: '8px', color: '#1890ff', fontWeight: 'bold', minWidth: '25px' }}>
                                                        {video.videoInfo.overallProgress || 0}%
                                                      </Text>
                                                      <Text style={{ fontSize: '8px', color: '#999', marginLeft: '4px' }}>
                                                        ({video.videoInfo.totalVideos || 0}个视频)
                                                      </Text>
                                                    </div>
                                                  )}
                                                  {video.videoInfo.type === 'multi_video' && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                                      <Text style={{ fontSize: '8px', color: '#666', minWidth: '50px' }}>
                                                        时长信息
                                                      </Text>
                                                      <Text style={{ fontSize: '8px', color: '#999' }}>
                                                        已学习 {Math.floor((video.videoInfo.watchedDuration || 0) / 60)}分钟 / 
                                                        总计 {Math.floor((video.videoInfo.totalDuration || 0) / 60)}分钟
                                                      </Text>
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                              {showPlannedLabels && video.plannedStartTime && (
                                                <div 
                                                  key={`planned-label-${video.id}-${Date.now()}`}
                                                  style={{
                                                    background: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
                                                    color: '#1890ff',
                                                    fontSize: '8px',
                                                    padding: '1px 4px',
                                                    borderRadius: '8px',
                                                    fontWeight: 'bold',
                                                    border: '1px solid #40a9ff',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '2px',
                                                    marginTop: '2px'
                                                  }}>
                                                  <ClockCircleOutlined style={{ fontSize: '8px' }} />
                                                  <span>计划 {video.plannedStartTime}</span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Checkbox
                                              checked={selectedMaterials.includes(`video-${video.id}`)}
                                              onChange={(e) => {
                                                e.stopPropagation();
                                                handleSelectMaterial(`video-${video.id}`, e.target.checked);
                                              }}
                                              onClick={(e) => e.stopPropagation()}
                                            />
                                          </div>
                                        </div>
                                      </Card>
                                    </Tooltip>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 阶段内 - 直播课 */}
                          {Array.isArray(phase.materials?.live) && phase.materials.live.length > 0 && (
                            <div style={{ marginTop: 12, background: '#ffffff', border: '1px solid #f0f0f0', borderLeft: '2px solid #87e8de', borderRadius: 6, padding: 8 }}>
                              <Text strong style={{ fontSize: 12, color: '#666' }}>📺 直播课 ({phase.materials.live.length})</Text>
                              {phase.materials.live.map(stream => {
                                const status = getLiveStreamStatus(stream);
                                return (
                                  <Card 
                                    key={`phase-${phase.id}-live-${stream.id}`}
                                    size="small" 
                                    style={{ marginTop: 6, border: '1px solid #e8e8e8', position: 'relative' }}
                                    bodyStyle={{ padding: '8px 12px' }}
                                    onMouseEnter={() => setHoveredItems(prev => ({ ...(prev || {}), [`live-${stream.id}`]: true }))}
                                    onMouseLeave={() => setHoveredItems(prev => ({ ...(prev || {}), [`live-${stream.id}`]: false }))}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                        {hoveredItems?.[`live-${stream.id}`] ? (
                                          <Dropdown
                                            trigger={['click']}
                                            placement="bottomLeft"
                                            menu={{
                                              items: [
                                                { key: 'attachments', label: '附件', icon: <PaperClipOutlined /> }
                                              ],
                                              onClick: ({ key }) => {
                                                if (key === 'attachments') {
                                                  try {
                                                    if (handlers && typeof handlers.onViewMaterial === 'function') {
                                                      handlers.onViewMaterial(stream, 'achievement');
                                                    }
                                                  } catch (e) { /* no-op */ }
                                                }
                                              }
                                            }}
                                          >
                                            <Tooltip title="更多">
                                              <MoreOutlined style={{ color: '#8c8c8c', marginRight: 8, fontSize: 16 }} />
                                            </Tooltip>
                                          </Dropdown>
                                        ) : (
                                          status === 'live' ? (
                                            <PlayCircleOutlined style={{ color: '#ff4d4f', marginRight: 8, fontSize: 16 }} />
                                          ) : (
                                            <ClockCircleOutlined style={{ color: '#faad14', marginRight: 8, fontSize: 16 }} />
                                          )
                                        )}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>
                                            {stream.title}
                                          </Text>
                                          <Text type="secondary" style={{ fontSize: 10 }}>
                                            {(() => {
                                              const dateText = (stream.schedule?.date || stream.liveDate || '时间未定');
                                              const platformText = (stream.platform || '').trim();
                                              return platformText && platformText !== '钉钉直播' ? `${platformText} • ${dateText}` : dateText;
                                            })()}
                                          </Text>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                            <Tag color={status === 'live' ? 'red' : (status === 'scheduled' ? 'gold' : 'blue')}>
                                              {status === 'live' ? '直播中' : (status === 'scheduled' ? '已预约' : '已结束')}
                                            </Tag>
                                            {status === 'live' && stream.url && (
                                              <Button
                                                type="link"
                                                size="small"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  window.open(stream.url, '_blank');
                                                }}
                                              >
                                                进入直播间
                                              </Button>
                                            )}
                                            {status === 'ended' && (stream.replayUrl || stream.url) && (
                                              <Button
                                                type="link"
                                                size="small"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  const video = {
                                                    id: `replay-${stream.id}`,
                                                    title: stream.title + ' 回放',
                                                    type: 'live_replay',
                                                    liveDate: stream.liveDate,
                                                    url: stream.replayUrl || stream.url,
                                                    instructor: stream.instructor,
                                                    audience: stream.audience
                                                  };
                                                  onPlayVideo(video);
                                                }}
                                              >
                                                播放回放
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <Checkbox
                                        checked={selectedMaterials.includes(`live-${stream.id}`)}
                                        onChange={(e) => handleSelectMaterial(`live-${stream.id}`, e.target.checked)}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                  </Card>
                                );
                              })}
                            </div>
                          )}

                          {/* 阶段内 - 研修成果 */}
                          {Array.isArray(phase.materials?.achievements) && phase.materials.achievements.length > 0 && (
                            <div style={{ marginTop: 12, background: '#ffffff', border: '1px solid #f0f0f0', borderLeft: '2px solid #eb2f96', borderRadius: 6, padding: 8 }}>
                              <Text strong style={{ fontSize: 12, color: '#666' }}>📄 研修成果 ({phase.materials.achievements.length})</Text>
                              {phase.materials.achievements.map(item => (
                                <Card
                                  key={`phase-${phase.id}-achievement-${item.id}`}
                                  size="small"
                                  style={{ marginTop: 6, border: '1px solid #e8e8e8', position: 'relative' }}
                                  bodyStyle={{ padding: '8px 12px' }}
                                  onMouseEnter={() => setHoveredItems(prev => ({ ...(prev || {}), [`achievement-${item.id}`]: true }))}
                                  onMouseLeave={() => setHoveredItems(prev => ({ ...(prev || {}), [`achievement-${item.id}`]: false }))}
                                  onClick={() => {
                                    try {
                                      if (handlers && typeof handlers.onViewMaterial === 'function') {
                                        handlers.onViewMaterial(item, 'achievement');
                                      }
                                    } catch (e) {
                                      // no-op
                                    }
                                  }}
                                >
                                  {/* 悬停操作图标 - More 菜单（研修成果） - 已迁移到左侧，隐藏右上角容器 */}
                                  <div style={{ display: 'none' }}>
                                    {hoveredItems?.[`achievement-${item.id}`] ? (
                                      <Dropdown
                                        trigger={['click']}
                                        placement="bottomLeft"
                                        menu={{
                                          items: [
                                            { key: 'attachments', label: '附件', icon: <PaperClipOutlined /> }
                                          ],
                                          onClick: ({ key }) => {
                                            if (key === 'attachments') {
                                              try {
                                                if (handlers && typeof handlers.onViewMaterial === 'function') {
                                                  handlers.onViewMaterial(item, 'achievement');
                                                }
                                              } catch (e) { /* no-op */ }
                                            }
                                          }
                                        }}
                                      >
                                        <Tooltip title="更多">
                                          <MoreOutlined style={{ color: '#8c8c8c', marginRight: 8, fontSize: 16 }} onClick={(e) => e.stopPropagation()} />
                                        </Tooltip>
                                      </Dropdown>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                      {hoveredItems?.[`achievement-${item.id}`] ? (
                                        <Dropdown
                                          trigger={['click']}
                                          placement="bottomLeft"
                                          menu={{
                                            items: [
                                              { key: 'attachments', label: '附件', icon: <PaperClipOutlined /> }
                                            ],
                                            onClick: ({ key }) => {
                                              if (key === 'attachments') {
                                                try {
                                                  if (handlers && typeof handlers.onViewMaterial === 'function') {
                                                    handlers.onViewMaterial(item, 'achievement');
                                                  }
                                                } catch (e) { /* no-op */ }
                                              }
                                            }
                                          }}
                                        >
                                          <Tooltip title="更多">
                                            <MoreOutlined style={{ color: '#8c8c8c', marginRight: 8, fontSize: 16 }} onClick={(e) => e.stopPropagation()} />
                                          </Tooltip>
                                        </Dropdown>
                                      ) : (
                                        <FileTextOutlined style={{ color: '#eb2f96', marginRight: 8, fontSize: 16 }} />
                                      )}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
                                        <Text style={{ fontSize: 12 }} ellipsis>
                                          {item.title}
                                        </Text>
                                        {item.description && (
                                          <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                                            {item.description}
                                          </Text>
                                        )}
                                      </div>
                                    </div>
                                    <Checkbox
                                      checked={selectedMaterials.includes(`achievement-${item.id}`)}
                                      onChange={(e) => handleSelectMaterial(`achievement-${item.id}`, e.target.checked)}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}

                          {/* 阶段内 - 考试/试卷 */}
                          {Array.isArray(phase.materials?.exam) && phase.materials.exam.length > 0 && (
                            <div style={{ marginTop: 12, background: '#ffffff', border: '1px solid #f0f0f0', borderLeft: '2px solid #d3adf7', borderRadius: 6, padding: 8 }}>
                              <Text strong style={{ fontSize: 12, color: '#666' }}>🎓 考试/试卷 ({phase.materials.exam.length})</Text>
                              {phase.materials.exam.map(file => (
                                <Card
                                  key={`phase-${phase.id}-exam-${file.id}`}
                                  size="small"
                                  style={{ marginTop: 6, border: '1px solid #e8e8e8', position: 'relative' }}
                                  bodyStyle={{ padding: '8px 12px' }}
                                  onMouseEnter={() => setHoveredItems(prev => ({ ...(prev || {}), [`file-${file.id}`]: true }))}
                                  onMouseLeave={() => setHoveredItems(prev => ({ ...(prev || {}), [`file-${file.id}`]: false }))}
                                >
                                  <div style={{ position: 'absolute', top: 6, right: 8, display: 'flex', gap: 8, background: 'rgba(255,255,255,0.85)', borderRadius: 4, padding: '2px 6px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', opacity: hoveredItems?.[`file-${file.id}`] ? 1 : 0, transition: 'opacity 0.2s' }}>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                      {hoveredItems?.[`file-${file.id}`] ? (
                                        <Dropdown
                                          trigger={['click']}
                                          placement="bottomLeft"
                                          menu={{
                                            items: [
                                              { key: 'rename', label: '重命名', icon: <EditOutlined /> },
                                              { key: 'attachments', label: '附件', icon: <PaperClipOutlined /> },
                                              { key: 'convertToOperationRecord', label: '转为操作记录', icon: <FileTextOutlined /> },
                                              { key: 'delete', label: '删除', icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />, danger: true }
                                            ],
                                            onClick: ({ key }) => {
                                              if (key === 'rename') {
                                                openRename('file', file.id, getFileDisplayName(file.name));
                                              }
                                              if (key === 'attachments') {
                                                try {
                                                  const displayName = getFileDisplayName(file.name);
                                                  const pseudoAchievement = { id: `file-${file.id}`, title: displayName, description: '试卷文件' };
                                                  if (handlers && typeof handlers.onViewMaterial === 'function') {
                                                    handlers.onViewMaterial(pseudoAchievement, 'achievement');
                                                  }
                                                } catch (e) { /* no-op */ }
                                              }
                                              if (key === 'convertToOperationRecord') {
                                                const displayName = getFileDisplayName(file.name);
                                                const newRecord = {
                                                  id: Date.now(),
                                                  title: `转化自试卷文件：${displayName}`,
                                                  source: '资料：试卷文件',
                                                  time: '刚刚',
                                                  type: 'note',
                                                  subType: 'material',
                                                  content: `<div style="padding:12px;">\n          <h3>📄 ${displayName}</h3>\n          <p style="color:#666;">已由试卷文件转为操作记录</p>\n          <p style=\"color:#999;font-size:12px;\">类型：${file.type || '未知'} • 大小：${Math.round((file.size || 0) / 1024)}KB</p>` ,
                                                  materialRef: { type: 'file', id: file.id, isPaper: true }
                                                };
                                                state.setOperationRecords(prev => ({
                                                  ...prev,
                                                  note: [newRecord, ...((prev && prev.note) ? prev.note : [])]
                                                }));
                                                message.success('已转为操作记录');
                                              }
                                              if (key === 'delete') {
                                                Modal.confirm({
                                                  title: '确认删除该文件？',
                                                  okText: '删除',
                                                  okType: 'danger',
                                                  cancelText: '取消',
                                                  onOk: () => handleDeleteFile(file.id)
                                                });
                                              }
                                            }
                                          }}
                                        >
                                          <Tooltip title="更多">
                                            <MoreOutlined style={{ color: '#8c8c8c', marginRight: 8, fontSize: 16 }} onClick={(e) => e.stopPropagation()} />
                                          </Tooltip>
                                        </Dropdown>
                                      ) : (
                                        <FileTextOutlined style={{ color: '#722ed1', marginRight: 8, fontSize: 16 }} />
                                      )}
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>
                                          {getFileDisplayName(file.name)} <Tag color="purple" style={{ marginLeft: 6 }}>试卷</Tag>
                                        </Text>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                          {file.examType && (
                                            <Tag color="blue">考核：{file.examType}</Tag>
                                          )}
                                          <Tag color="geekblue">满分 {file.fullScore || 100}分</Tag>
                                        </div>
                                        <Text type="secondary" style={{ fontSize: 10 }}>
                                          {file.uploadTime}
                                        </Text>
                                      </div>
                                    </div>
                                    <Checkbox
                                      checked={selectedMaterials.includes(`file-${file.id}`)}
                                      onChange={(e) => handleSelectMaterial(`file-${file.id}`, e.target.checked)}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 组织培训下：未分类模块（卡片按类型分组） */}
              {isOrgTrainingView && (() => {
                const uncLive = (Array.isArray(liveStreams) ? liveStreams : []).filter(s => moduleAssignments.live[s.id] === 'uncategorized');
                const uncVideos = (Array.isArray(courseVideos) ? courseVideos : []).filter(v => moduleAssignments.videos[v.id] === 'uncategorized');
                const uncExams = (Array.isArray(examFiles) ? examFiles : []).filter(f => moduleAssignments.exam[f.id] === 'uncategorized');
                const uncLinks = (Array.isArray(links) ? links : []).filter(l => moduleAssignments.links[l.id] === 'uncategorized');
                const uncTexts = (Array.isArray(addedTexts) ? addedTexts : []).filter(t => moduleAssignments.texts[t.id] === 'uncategorized');
                const uncProjects = (Array.isArray(trainingProjects) ? trainingProjects : []).filter(p => moduleAssignments.projects[p.id] === 'uncategorized');
                const hasAny = [uncLive, uncVideos, uncExams, uncLinks, uncTexts, uncProjects].some(arr => Array.isArray(arr) && arr.length > 0);
                if (!hasAny) return null;
                const allExpanded = Object.values(uncategorizedExpanded).every(v => v);
                const uncategorizedIds = [
                  ...uncLive.map(s => `live-${s.id}`),
                  ...uncVideos.map(v => `video-${v.id}`),
                  ...uncExams.map(f => `file-${f.id}`),
                  ...uncLinks.map(l => `link-${l.id}`),
                  ...uncTexts.map(t => `text-${t.id}`),
                  ...uncProjects.map(p => `project-${p.id}`)
                ];
                const allSelected = uncategorizedIds.length > 0 && uncategorizedIds.every(id => selectedMaterials.includes(id));
                const someSelected = uncategorizedIds.some(id => selectedMaterials.includes(id));
                
                return (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Text strong style={{ fontSize: '12px', color: '#666' }}>📦 未分类模块</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Checkbox
                          checked={allSelected}
                          indeterminate={someSelected && !allSelected}
                          onChange={(e) => handleUncategorizedSelectAll(e.target.checked)}
                          style={{ fontSize: '11px' }}
                        >
                          <Text style={{ fontSize: '11px', color: '#666' }}>全选</Text>
                        </Checkbox>
                        <Button
                          type="text"
                          size="small"
                          icon={allExpanded ? <DownOutlined /> : <RightOutlined />}
                          onClick={() => handleUncategorizedExpandAll(!allExpanded)}
                          style={{ fontSize: '11px', padding: '2px 6px', height: 'auto' }}
                        >
                          <Text style={{ fontSize: '11px', color: '#666' }}>
                            {allExpanded ? '全部折叠' : '全部展开'}
                          </Text>
                        </Button>
                      </div>
                    </div>
                    <div style={{ padding: '4px 8px 8px 8px', background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 8 }}>
                      {/* 未分类 - 直播课程 */}
                      {uncLive.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div 
                            style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginBottom: 6 }}
                            onClick={() => setUncategorizedExpanded(prev => ({ ...prev, live: !prev.live }))}
                          >
                            {uncategorizedExpanded.live ? <DownOutlined style={{ fontSize: 10 }} /> : <RightOutlined style={{ fontSize: 10 }} />}
                            <Text strong style={{ fontSize: 12, color: '#666' }}>📺 直播课程 ({uncLive.length})</Text>
                          </div>
                          {uncategorizedExpanded.live && (
                            <div style={{ marginTop: 6 }}>
                            {uncLive.map(stream => {
                              const status = getLiveStreamStatus(stream);
                              return (
                                <Card key={`unc-live-${stream.id}`} size="small" style={{ marginBottom: 8, border: '1px solid #e8e8e8' }} bodyStyle={{ padding: '8px 12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                                      {status === 'live' ? (
                                        <PlayCircleOutlined style={{ color: '#ff4d4f' }} />
                                      ) : (
                                        <ClockCircleOutlined style={{ color: '#faad14' }} />
                                      )}
                                      <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>{stream.title}</Text>
                                      <Text type="secondary" style={{ fontSize: 10 }}>
                                        {(stream.schedule?.date || stream.liveDate || stream.startTime || '时间未定')}
                                      </Text>
                                    </div>
                                    <Checkbox
                                      checked={selectedMaterials.includes(`live-${stream.id}`)}
                                      onChange={(e) => handleSelectMaterial(`live-${stream.id}`, e.target.checked)}
                                    />
                                  </div>
                                </Card>
                              );
                            })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 未分类 - 课程视频 */}
                      {uncVideos.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div 
                            style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginBottom: 6 }}
                            onClick={() => setUncategorizedExpanded(prev => ({ ...prev, videos: !prev.videos }))}
                          >
                            {uncategorizedExpanded.videos ? <DownOutlined style={{ fontSize: 10 }} /> : <RightOutlined style={{ fontSize: 10 }} />}
                            <Text strong style={{ fontSize: 12, color: '#666' }}>📹 课程视频 ({uncVideos.length})</Text>
                          </div>
                          {uncategorizedExpanded.videos && (
                            <div style={{ marginTop: 6 }}>
                            {uncVideos.map(video => (
                              <Card key={`unc-video-${video.id}`} size="small" style={{ marginBottom: 8, border: '1px solid #e8e8e8' }} bodyStyle={{ padding: '8px 12px' }}
                                onClick={() => onPlayVideo(video)}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                                    <PlayCircleOutlined style={{ color: '#1890ff' }} />
                                    <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>{video.title}</Text>
                                    <Text type="secondary" style={{ fontSize: 10 }}>{video.addTime || video.instructor || ''}</Text>
                                  </div>
                                  <Checkbox
                                    checked={selectedMaterials.includes(`video-${video.id}`)}
                                    onChange={(e) => handleSelectMaterial(`video-${video.id}`, e.target.checked)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </Card>
                            ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 未分类 - 考试/试卷 */}
                      {uncExams.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div 
                            style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginBottom: 6 }}
                            onClick={() => setUncategorizedExpanded(prev => ({ ...prev, exam: !prev.exam }))}
                          >
                            {uncategorizedExpanded.exam ? <DownOutlined style={{ fontSize: 10 }} /> : <RightOutlined style={{ fontSize: 10 }} />}
                            <Text strong style={{ fontSize: 12, color: '#666' }}>🎓 考试/试卷 ({uncExams.length})</Text>
                          </div>
                          {uncategorizedExpanded.exam && (
                            <div style={{ marginTop: 6 }}>
                            {uncExams.map(file => (
                              <Card key={`unc-exam-${file.id}`} size="small" style={{ marginBottom: 8, border: '1px solid #e8e8e8' }} bodyStyle={{ padding: '8px 12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                                    <FileTextOutlined style={{ color: '#722ed1' }} />
                                    <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>{file.name} <Tag color="purple" style={{ marginLeft: 6 }}>试卷</Tag></Text>
                                    <Text type="secondary" style={{ fontSize: 10 }}>{file.uploadTime}</Text>
                                  </div>
                                  <Checkbox
                                    checked={selectedMaterials.includes(`file-${file.id}`)}
                                    onChange={(e) => handleSelectMaterial(`file-${file.id}`, e.target.checked)}
                                  />
                                </div>
                              </Card>
                            ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 未分类 - 阅读材料（链接） */}
                      {uncLinks.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div 
                            style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginBottom: 6 }}
                            onClick={() => setUncategorizedExpanded(prev => ({ ...prev, links: !prev.links }))}
                          >
                            {uncategorizedExpanded.links ? <DownOutlined style={{ fontSize: 10 }} /> : <RightOutlined style={{ fontSize: 10 }} />}
                            <Text strong style={{ fontSize: 12, color: '#666' }}>📘 阅读材料 ({uncLinks.length})</Text>
                          </div>
                          {uncategorizedExpanded.links && (
                            <div style={{ marginTop: 6 }}>
                            {uncLinks.map(link => (
                              <Card key={`unc-link-${link.id}`} size="small" style={{ marginBottom: 8, border: '1px solid #e8e8e8' }} bodyStyle={{ padding: '8px 12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                                    <LinkOutlined style={{ color: '#1890ff' }} />
                                    <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>{link.title}</Text>
                                    {link.url && (
                                      <Button type="link" size="small" onClick={(e) => { e.stopPropagation(); window.open(link.url, '_blank'); }}>打开</Button>
                                    )}
                                  </div>
                                  <Checkbox
                                    checked={selectedMaterials.includes(`link-${link.id}`)}
                                    onChange={(e) => handleSelectMaterial(`link-${link.id}`, e.target.checked)}
                                  />
                                </div>
                              </Card>
                            ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 未分类 - 文本 */}
                      {uncTexts.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div 
                            style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginBottom: 6 }}
                            onClick={() => setUncategorizedExpanded(prev => ({ ...prev, texts: !prev.texts }))}
                          >
                            {uncategorizedExpanded.texts ? <DownOutlined style={{ fontSize: 10 }} /> : <RightOutlined style={{ fontSize: 10 }} />}
                            <Text strong style={{ fontSize: 12, color: '#666' }}>📝 文本 ({uncTexts.length})</Text>
                          </div>
                          {uncategorizedExpanded.texts && (
                            <div style={{ marginTop: 6 }}>
                            {uncTexts.map(text => (
                              <Card key={`unc-text-${text.id}`} size="small" style={{ marginBottom: 8, border: '1px solid #e8e8e8' }} bodyStyle={{ padding: '8px 12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                                    <FileTextOutlined style={{ color: '#faad14' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
                                      <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>{text.title}</Text>
                                      {text.content && (
                                        <Text type="secondary" ellipsis style={{ fontSize: 10 }}>{text.content}</Text>
                                      )}
                                    </div>
                                  </div>
                                  <Checkbox
                                    checked={selectedMaterials.includes(`text-${text.id}`)}
                                    onChange={(e) => handleSelectMaterial(`text-${text.id}`, e.target.checked)}
                                  />
                                </div>
                              </Card>
                            ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 未分类 - 培训项目资料 */}
                      {uncProjects.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div 
                            style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginBottom: 6 }}
                            onClick={() => setUncategorizedExpanded(prev => ({ ...prev, projects: !prev.projects }))}
                          >
                            {uncategorizedExpanded.projects ? <DownOutlined style={{ fontSize: 10 }} /> : <RightOutlined style={{ fontSize: 10 }} />}
                            <Text strong style={{ fontSize: 12, color: '#666' }}>📁 培训项目资料 ({uncProjects.length})</Text>
                          </div>
                          {uncategorizedExpanded.projects && (
                            <div style={{ marginTop: 6 }}>
                            {uncProjects.map(p => (
                              <Card key={`unc-project-${p.id}`} size="small" style={{ marginBottom: 8, border: '1px solid #e8e8e8' }} bodyStyle={{ padding: '8px 12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => handlers?.onViewTrainingProject && handlers.onViewTrainingProject(p)}>
                                    <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>{p.title}</Text>
                                    <Tag color="blue">{p.sourceType || '培训方案'}</Tag>
                                    <Text type="secondary" style={{ fontSize: 10 }}>{p.addTime}</Text>
                                  </div>
                                  <Checkbox
                                    checked={selectedMaterials.includes(`project-${p.id}`)}
                                    onChange={(e) => handleSelectMaterial(`project-${p.id}`, e.target.checked)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </Card>
                            ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 课程视频列表（按课程分组，支持一课多视频） */}
              {!isOrgTrainingView && modules.length === 0 && displayCourseVideos.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {collapsedSections.videos ? (
                        <RightOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('videos')} />
                      ) : (
                        <DownOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('videos')} />
                      )}
                      <Text strong style={{ fontSize: '12px', color: '#666' }}>
                        📹 课程视频 ({displayCourseVideos.length})
                      </Text>
                    </div>
                    <Button.Group>
                      <Tooltip title="平铺视图">
                        <Button 
                          size="small"
                          type={videoViewMode === 'flat' ? 'primary' : 'default'}
                          icon={<AppstoreOutlined />}
                          onClick={() => setVideoViewMode('flat')}
                        />
                      </Tooltip>
                      <Tooltip title="层级视图">
                        <Button 
                          size="small"
                          type={videoViewMode === 'hierarchy' ? 'primary' : 'default'}
                          icon={<NodeIndexOutlined />}
                          onClick={() => setVideoViewMode('hierarchy')}
                        />
                      </Tooltip>
                    </Button.Group>
                  </div>
                  {!collapsedSections.videos && Object.values(displayCourseVideos.reduce((groups, v) => {
                    const cid = v.courseId || v.id;
                    if (!groups[cid]) {
                      groups[cid] = {
                        courseId: cid,
                        courseTitle: v.courseTitle || v.title,
                        instructor: v.instructor,
                        videos: []
                      };
                    }
                    groups[cid].videos.push(v);
                    return groups;
                   }, {})).map(group => (
                    <div key={`course-${group.courseId}`} style={{ marginBottom: 8, border: '1px solid #e8e8e8', borderRadius: 8, padding: 8, background: '#fff' }}>
                      {(() => {
                        const summary = computeGroupSummary(group.videos);
                        const collapsed = collapsedGroups.has(group.courseId);
                        return (
                          <div style={{ margin: '4px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {collapsed ? (
                                  <RightOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleGroup(group.courseId)} />
                                ) : (
                                  <DownOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleGroup(group.courseId)} />
                                )}
                                <Text strong style={{ fontSize: 13, cursor: 'pointer' }} onClick={() => toggleGroup(group.courseId)}>
                                  {group.courseTitle}
                                </Text>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {videoViewMode === 'flat' && (
                                  <Tooltip title={hierarchyOpenCourses.has(group.courseId) ? '隐藏层级' : '显示层级'}>
                                    <NodeIndexOutlined style={{ fontSize: 14, color: '#1890ff', cursor: 'pointer' }} onClick={() => toggleHierarchy(group.courseId)} />
                                  </Tooltip>
                                )}
                                <Tooltip title="选择本课程">
                                  <Checkbox
                                    checked={group.videos.every(v => selectedMaterials.includes(`video-${v.id}`))}
                                    indeterminate={group.videos.some(v => selectedMaterials.includes(`video-${v.id}`)) && !group.videos.every(v => selectedMaterials.includes(`video-${v.id}`))}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      group.videos.forEach(v => handleSelectMaterial(`video-${v.id}`, checked));
                                    }}
                                  />
                                </Tooltip>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                  {(group.instructor || '未知讲师')} • {group.videos.length}个视频 • 总学时{summary.totalHours}小时
                                </Text>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                  • 成绩 {summary.avgScore != null ? `${summary.avgScore}分` : '未评分'}
                                </Text>
                                {(() => {
                                  const struct = courseStructureIndex.get(group.courseId) || courseStructureIndex.get(resolveHierarchyId(group.courseId, group.courseTitle));
                                  if (!struct) return null;
                                  return (
                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                      • 章{struct.chapterCount} • 节{struct.sectionCount}
                                    </Text>
                                  );
                                })()}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 140 }}>
                                  <Progress percent={summary.overallProgress} size="small" showInfo={false} strokeColor="#1890ff" />
                                </div>
                                <Tooltip title={`整体进度：${summary.overallProgress}%`}>
                                  <Text style={{ fontSize: 10, color: '#1890ff' }}>{summary.overallProgress}%</Text>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    {(videoViewMode === 'hierarchy' || hierarchyOpenCourses.has(group.courseId)) && (() => {
                      const course = resolveHierarchyCourse(group.courseId, group.courseTitle);
              const treeData = course ? (course.chapters || []).map(ch => ({
                key: `ch-${ch.id}`,
                type: 'chapter',
                title: ch.title,
                children: (ch.sections || []).map(sec => ({
                  key: `sec-${sec.id}`,
                  type: 'section',
                  title: sec.title,
                  videoCount: (sec.videos || []).length,
                  children: (sec.videos || []).map(v => ({
                    key: `v-${v.id}`,
                    type: 'video',
                    title: v.title,
                    videoId: v.id,
                    instructor: v.instructor,
                    progress: v.progress || 0,
                    duration: v.duration,
                    score: v.score
                  }))
                }))
              })) : buildTreeDataFromVideos(group.videos);

                      // 用于把展开/收缩控制内联到名称列
                      const expanderState = new Map();
                      const expanderFn = new Map();

                      const columns = [
                        {
                          title: '名称',
                          dataIndex: 'title',
                          key: 'title',
                          render: (text, record) => {
                            const iconStyle = { fontSize: 14, color: '#8c8c8c' };
                            const icon = record.type === 'video'
                              ? <PlayCircleOutlined style={{ ...iconStyle, color: '#1890ff' }} />
                              : record.type === 'chapter'
                              ? <FolderOutlined style={iconStyle} />
                              : <NodeIndexOutlined style={iconStyle} />;

                            const name = record.type === 'video'
                              ? <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>{text}</Text>
                              : <Text strong style={{ fontSize: 12 }}>{text}</Text>;

                            const isExpandable = Array.isArray(record.children) && record.children.length > 0;
                            const isExpanded = expanderState.get(record.key);
                            const switcher = isExpandable ? (
                              <span
                                className="mm-switcher"
                                onClick={(e) => {
                                  const fn = expanderFn.get(record.key);
                                  if (fn) fn(record, e);
                                  e.stopPropagation();
                                }}
                              >
                                {isExpanded ? <DownOutlined /> : <RightOutlined />}
                              </span>
                            ) : null;

                            const depth = record.type === 'chapter' ? 0 : (record.type === 'section' ? 1 : 2);
                            let left = null;
                            if (record.type === 'video') {
                              const percent = Math.round(record.progress || 0);
                              const durationMin = Math.floor((record.duration || 0) / 60);
                              const subtitle = `讲师：${record.instructor || '未知讲师'} • 进度 ${percent}%${Number.isFinite(durationMin) && durationMin > 0 ? ` • 时长 ${durationMin}分钟` : ''}`;
                              left = (
                                <div className="mm-title" style={{ marginLeft: `${depth * 16}px`, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                  {switcher}
                                  <span className="mm-icon">{icon}</span>
                                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                                    {name}
                                    <Text type="secondary" style={{ fontSize: 10 }}>
                                      {subtitle}
                                    </Text>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                      <div className="mm-inline-progress" aria-label="学习进度" style={{ flex: '0 0 120px' }}>
                                        <div className="mm-inline-progress__bar" style={{ width: `${percent}%` }} />
                                      </div>
                                      <Text type="secondary" style={{ fontSize: 10 }}>{percent}%</Text>
                                    </div>
                                  </div>
                                </div>
                              );
                            } else {
                              left = (
                                <div className="mm-title" style={{ marginLeft: `${depth * 16}px` }}>
                                  {switcher}
                                  <span className="mm-icon">{icon}</span>
                                  <span className="mm-name">{name}</span>
                                </div>
                              );
                            }
                            // 右侧：改为多行展示后，视频不再显示右侧元信息
                            let right = null;
                            return (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                {left}
                                {right}
                              </div>
                            );
                          }
                        }
                      ];

                      return (
                        <div className="mm-shell" style={{ padding: 0, margin: '6px 0' }}>
                          <Table
                            columns={columns}
                            dataSource={treeData}
                            size="small"
                            pagination={false}
                            rowKey="key"
                            showHeader={false}
                            className="mm-table"
                            style={{ width: '100%' }}
                            tableLayout="fixed"
                            defaultExpandAllRows
                            rowClassName={(record) => `mm-row mm-${record.type} mm-level-${record.type === 'chapter' ? 0 : (record.type === 'section' ? 1 : 2)}`}
                            expandable={{
                              indentSize: 12,
                              expandRowByClick: true,
                              expandIcon: ({ expanded, onExpand, record }) => {
                                expanderState.set(record.key, expanded);
                                expanderFn.set(record.key, onExpand);
                                return null; // 隐藏默认展开图标列
                              }
                            }}
                            onRow={(record) => ({
                              onClick: () => {
                                if (record.type === 'video' && record.videoId) {
                                  const videoObj = (group && Array.isArray(group.videos))
                                    ? group.videos.find(v => v.id === record.videoId)
                                    : null;
                                  if (videoObj) {
                                    onPlayVideo(videoObj);
                                  } else {
                                    // 回退：若无法找到视频对象，则滚动到对应卡片高亮
                                    scrollToVideoCard(record.videoId);
                                  }
                                }
                              }
                            })}
                          />
                        </div>
                      );
                    })()}
                    {!collapsedGroups.has(group.courseId) && videoViewMode === 'flat' && group.videos.map(video => (
                        <Tooltip title={getVideoHierarchyPath(group.courseId, video)} placement="top" key={`video-${video.id}`}>
                        <Card 
                          key={`video-${video.id}`}
                          id={`video-card-${video.id}`}
                          size="small" 
                          style={{ 
                            marginBottom: 8,
                            cursor: 'pointer',
                            border: '1px solid #e8e8e8',
                            position: 'relative',
                            ...(highlightVideoId === video.id ? { boxShadow: '0 0 0 2px #1890ff', borderColor: '#1890ff' } : {})
                          }}
                          bodyStyle={{ padding: '8px 12px' }}
                          onClick={() => onPlayVideo(video)}
                          onMouseEnter={() => setHoveredItems(prev => ({ ...(prev || {}), [`video-${video.id}`]: true }))}
                          onMouseLeave={() => setHoveredItems(prev => ({ ...(prev || {}), [`video-${video.id}`]: false }))}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                              {hoveredItems?.[`video-${video.id}`] ? (
                                <Dropdown
                                  trigger={['click']}
                                  placement="bottomLeft"
                                  menu={{
                                    items: [
                                      { key: 'attachments', label: '附件', icon: <PaperClipOutlined /> }
                                    ],
                                    onClick: ({ key }) => {
                                      if (key === 'attachments') {
                                        try {
                                          if (handlers && typeof handlers.onViewMaterial === 'function') {
                                            handlers.onViewMaterial(video, 'achievement');
                                          }
                                        } catch (e) { /* no-op */ }
                                      }
                                    }
                                  }}
                                >
                                  <Tooltip title="更多">
                                    <MoreOutlined style={{ color: '#8c8c8c', marginRight: 8, fontSize: 16 }} onClick={(e) => e.stopPropagation()} />
                                  </Tooltip>
                                </Dropdown>
                              ) : (
                                video.type === 'live_replay' ? (
                                  <div style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
                                    <PlayCircleOutlined style={{ color: '#ff4d4f', marginRight: 4, fontSize: 16 }} />
                                    <span style={{ 
                                      background: '#ff4d4f', 
                                      color: 'white', 
                                      fontSize: '8px', 
                                      padding: '1px 4px', 
                                      borderRadius: '2px',
                                      marginRight: 4
                                    }}>LIVE</span>
                                  </div>
                                ) : video.type === 'live_scheduled' ? (
                                  <div style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
                                    <ClockCircleOutlined style={{ color: '#faad14', marginRight: 4, fontSize: 16 }} />
                                    <span style={{ 
                                      background: '#faad14', 
                                      color: 'white', 
                                      fontSize: '8px', 
                                      padding: '1px 4px', 
                                      borderRadius: '2px',
                                      marginRight: 4
                                    }}>预约</span>
                                  </div>
                                ) : (
                                  <PlayCircleOutlined style={{ color: '#1890ff', marginRight: 8, fontSize: 16 }} />
                                )
                              )}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>
                                  {video.title}
                                </Text>

                                <Text type="secondary" style={{ fontSize: 10 }}>
                                  {video.type === 'live_replay' ? (
                                    `回放 • ${video.liveDate} • ${video.instructor || '未知讲师'} • ${video.audience || 0}人观看`
                                  ) : video.type === 'live_scheduled' ? (
                                    `预约直播 • ${video.scheduleDate} • ${video.instructor || '未知讲师'} • ${video.registered || 0}/${video.maxAudience || 0}人`
                                  ) : (
                                    `${video.addTime} • ${video.instructor || '未知讲师'}`
                                  )}
                                </Text>

                                {video.videoInfo && (
                                  <div style={{ marginTop: '4px' }}>
                                    {video.videoInfo.type === 'single_video' ? (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Text style={{ fontSize: '8px', color: '#666', minWidth: '50px' }}>
                                          学习进度
                                        </Text>
                                        <div style={{ 
                                          flex: 1, 
                                          height: '4px', 
                                          backgroundColor: '#f0f0f0', 
                                          borderRadius: '2px',
                                          overflow: 'hidden'
                                        }}>
                                          <div style={{
                                            width: `${video.videoInfo.progress || 0}%`,
                                            height: '100%',
                                            backgroundColor: '#1890ff',
                                            borderRadius: '2px',
                                            transition: 'width 0.3s ease'
                                          }} />
                                        </div>
                                        <Text style={{ fontSize: '8px', color: '#1890ff', fontWeight: 'bold', minWidth: '25px' }}>
                                          {video.videoInfo.progress || 0}%
                                        </Text>
                                      </div>
                                    ) : (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Text style={{ fontSize: '8px', color: '#666', minWidth: '50px' }}>
                                          学习进度
                                        </Text>
                                        <div style={{ 
                                          flex: 1, 
                                          height: '4px', 
                                          backgroundColor: '#f0f0f0', 
                                          borderRadius: '2px',
                                          overflow: 'hidden'
                                        }}>
                                          <div style={{
                                            width: `${video.videoInfo.overallProgress || 0}%`,
                                            height: '100%',
                                            backgroundColor: '#1890ff',
                                            borderRadius: '2px',
                                            transition: 'width 0.3s ease'
                                          }} />
                                        </div>
                                        <Text style={{ fontSize: '8px', color: '#1890ff', fontWeight: 'bold', minWidth: '25px' }}>
                                          {video.videoInfo.overallProgress || 0}%
                                        </Text>
                                        <Text style={{ fontSize: '8px', color: '#999', marginLeft: '4px' }}>
                                          ({video.videoInfo.totalVideos || 0}个视频)
                                        </Text>
                                      </div>
                                    )}

                                    {video.videoInfo.type === 'multi_video' && (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                        <Text style={{ fontSize: '8px', color: '#666', minWidth: '50px' }}>
                                          时长信息
                                        </Text>
                                        <Text style={{ fontSize: '8px', color: '#999' }}>
                                          已学习 {Math.floor((video.videoInfo.watchedDuration || 0) / 60)}分钟 / 
                                          总计 {Math.floor((video.videoInfo.totalDuration || 0) / 60)}分钟
                                        </Text>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {showPlannedLabels && video.plannedStartTime && (() => {
                                  console.log(`MaterialManagement: 视频 ${video.id} 计划标识显示检查:`, {
                                    showPlannedLabels,
                                    hasPlannedStartTime: !!video.plannedStartTime,
                                    plannedStartTime: video.plannedStartTime,
                                    shouldShowLabel: true
                                  });
                                  return (
                                    <div 
                                      key={`planned-label-${video.id}-${Date.now()}`}
                                      style={{
                                        background: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
                                        color: '#1890ff',
                                        fontSize: '8px',
                                        padding: '1px 4px',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        border: '1px solid #40a9ff',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '2px',
                                        marginTop: '2px'
                                      }}>
                                      <ClockCircleOutlined style={{ fontSize: '8px' }} />
                                      <span>计划 {video.plannedStartTime}</span>
                                    </div>
                                  );
                                })()}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Checkbox
                                checked={selectedMaterials.includes(`video-${video.id}`)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleSelectMaterial(`video-${video.id}`, e.target.checked);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                        </Card>
                        </Tooltip>
                      ))}
                    </div>
                   ))}
                </div>
              )}

              {/* 直播课列表 */}
              {!isOrgTrainingView && modules.length === 0 && Array.isArray(liveStreams) && liveStreams.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {collapsedSections.live ? (
                        <RightOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('live')} />
                      ) : (
                        <DownOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('live')} />
                      )}
                      <Text strong style={{ fontSize: '12px', color: '#666' }}>
                        📺 直播课 ({liveStreams.length})
                      </Text>
                    </div>
                  </div>
                  {!collapsedSections.live && liveStreams.map(stream => {
                    const status = getLiveStreamStatus(stream);
                    return (
                      <Card 
                        key={`live-${stream.id}`}
                        size="small" 
                        style={{ marginBottom: 8, border: '1px solid #e8e8e8', position: 'relative' }}
                        bodyStyle={{ padding: '8px 12px' }}
                        onMouseEnter={() => setHoveredItems(prev => ({ ...(prev || {}), [`live-${stream.id}`]: true }))}
                        onMouseLeave={() => setHoveredItems(prev => ({ ...(prev || {}), [`live-${stream.id}`]: false }))}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                            {hoveredItems?.[`live-${stream.id}`] ? (
                              <Dropdown
                                trigger={['click']}
                                placement="bottomLeft"
                                menu={{
                                  items: [
                                    { key: 'attachments', label: '附件', icon: <PaperClipOutlined /> }
                                  ],
                                  onClick: ({ key }) => {
                                    if (key === 'attachments') {
                                      try {
                                        if (handlers && typeof handlers.onViewMaterial === 'function') {
                                          handlers.onViewMaterial(stream, 'achievement');
                                        }
                                      } catch (e) { /* no-op */ }
                                    }
                                  }
                                }}
                              >
                                <Tooltip title="更多">
                                  <MoreOutlined style={{ color: '#8c8c8c', marginRight: 8, fontSize: 16 }} />
                                </Tooltip>
                              </Dropdown>
                            ) : (
                              status === 'live' ? (
                                <PlayCircleOutlined style={{ color: '#ff4d4f', marginRight: 8, fontSize: 16 }} />
                              ) : (
                                <ClockCircleOutlined style={{ color: '#faad14', marginRight: 8, fontSize: 16 }} />
                              )
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>
                                {stream.title}
                              </Text>
                              <Text type="secondary" style={{ fontSize: 10 }}>
                                {(() => {
                                  const dateText = (stream.schedule?.date || stream.liveDate || '时间未定');
                                  const platformText = (stream.platform || '').trim();
                                  return platformText && platformText !== '钉钉直播' ? `${platformText} • ${dateText}` : dateText;
                                })()}
                              </Text>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                <Tag color={status === 'live' ? 'red' : (status === 'scheduled' ? 'gold' : 'blue')}>
                                  {status === 'live' ? '直播中' : (status === 'scheduled' ? '已预约' : '已结束')}
                                </Tag>
                                {status === 'live' && stream.url && (
                                  <Button
                                    type="link"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(stream.url, '_blank');
                                    }}
                                  >
                                    进入直播间
                                  </Button>
                                )}
                                {status === 'ended' && (stream.replayUrl || stream.url) && (
                                  <Button
                                    type="link"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const video = {
                                        id: `replay-${stream.id}`,
                                        title: `${stream.title}`,
                                        url: stream.replayUrl || stream.url,
                                        videoUrl: stream.replayUrl || stream.url,
                                        instructor: stream.instructor
                                      };
                                      onViewMaterial(video, 'video');
                                    }}
                                  >
                                    观看回放
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <Checkbox
                            checked={selectedMaterials.includes(`live-${stream.id}`)}
                            onChange={(e) => handleSelectMaterial(`live-${stream.id}`, e.target.checked)}
                          />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* 文件列表 */}
              {/* 考试/试卷列表（从上传文件中筛选 isPaper:true） */}
              {!isOrgTrainingView && modules.length === 0 && examFiles.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {collapsedSections.examFiles ? (
                        <RightOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('examFiles')} />
                      ) : (
                        <DownOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('examFiles')} />
                      )}
                      <Text strong style={{ fontSize: '12px', color: '#666' }}>
                        🎓 考试/试卷 ({examFiles.length})
                      </Text>
                    </div>
                  </div>
                  {!collapsedSections.examFiles && examFiles.map(file => (
                    <Card 
                      key={`file-${file.id}`}
                      size="small" 
                      style={{ 
                        marginBottom: 8,
                        border: '1px solid #e8e8e8',
                        position: 'relative'
                      }}
                      bodyStyle={{ padding: '8px 12px' }}
                      onMouseEnter={() => setHoveredItems(prev => ({ ...(prev || {}), [`file-${file.id}`]: true }))}
                      onMouseLeave={() => setHoveredItems(prev => ({ ...(prev || {}), [`file-${file.id}`]: false }))}
                    >
                      {/* 悬停操作图标 - More 菜单（试卷文件） */}
                      <div style={{ position: 'absolute', top: 6, right: 8, display: 'flex', gap: 8, background: 'rgba(255,255,255,0.85)', borderRadius: 4, padding: '2px 6px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', opacity: hoveredItems?.[`file-${file.id}`] ? 1 : 0, transition: 'opacity 0.2s' }}>

                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                          {hoveredItems?.[`file-${file.id}`] ? (
                            <Dropdown
                              trigger={['click']}
                              placement="bottomLeft"
                              menu={{
                                items: [
                                  { key: 'rename', label: '重命名', icon: <EditOutlined /> },
                                  { key: 'attachments', label: '附件', icon: <PaperClipOutlined /> },
                                  { key: 'convertToOperationRecord', label: '转为操作记录', icon: <FileTextOutlined /> },
                                  { key: 'delete', label: '删除', icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />, danger: true }
                                ],
                                onClick: ({ key }) => {
                                  if (key === 'rename') {
                                    openRename('file', file.id, getFileDisplayName(file.name));
                                  }
                                  if (key === 'attachments') {
                                    try {
                                      const displayName = getFileDisplayName(file.name);
                                      const pseudoAchievement = { id: `file-${file.id}`, title: displayName, description: '试卷文件' };
                                      if (handlers && typeof handlers.onViewMaterial === 'function') {
                                        handlers.onViewMaterial(pseudoAchievement, 'achievement');
                                      }
                                    } catch (e) { /* no-op */ }
                                  }
                                  if (key === 'convertToOperationRecord') {
                                    const displayName = getFileDisplayName(file.name);
                                    const newRecord = {
                                      id: Date.now(),
                                      title: `转化自试卷文件：${displayName}`,
                                      source: '资料：试卷文件',
                                      time: '刚刚',
                                      type: 'note',
                                      subType: 'material',
                                      content: `<div style="padding:12px;">\n          <h3>📄 ${displayName}</h3>\n          <p style="color:#666;">已由试卷文件转为操作记录</p>\n          <p style=\"color:#999;font-size:12px;\">类型：${file.type || '未知'} • 大小：${Math.round((file.size || 0)/1024)}KB</p>\n        </div>`,
                                      materialRef: { type: 'file', id: file.id, isPaper: true }
                                    };
                                    state.setOperationRecords(prev => ({
                                      ...prev,
                                      note: [newRecord, ...((prev && prev.note) ? prev.note : [])]
                                    }));
                                    message.success('已转为操作记录');
                                  }
                                  if (key === 'delete') {
                                    Modal.confirm({
                                      title: '确认删除该文件？',
                                      okText: '删除',
                                      okType: 'danger',
                                      cancelText: '取消',
                                      onOk: () => handleDeleteFile(file.id)
                                    });
                                  }
                                }
                              }}
                            >
                              <Tooltip title="更多">
                                <MoreOutlined style={{ color: '#8c8c8c', marginRight: 8, fontSize: 16 }} onClick={(e) => e.stopPropagation()} />
                              </Tooltip>
                            </Dropdown>
                          ) : (
                            <FileTextOutlined style={{ color: '#722ed1', marginRight: 8, fontSize: 16 }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>
                              {getFileDisplayName(file.name)} <Tag color="purple" style={{ marginLeft: 6 }}>试卷</Tag>
                            </Text>
                            <Text type="secondary" style={{ fontSize: 10 }}>
                              {file.uploadTime}
                            </Text>
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedMaterials.includes(`file-${file.id}`)}
                          onChange={(e) => handleSelectMaterial(`file-${file.id}`, e.target.checked)}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              

              

              

              {/* 空状态显示 */}
              {courseVideos.length === 0 && examFiles.length === 0 && nonExamFiles.length === 0 && links.length === 0 && addedTexts.length === 0 && trainingProjects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                  <FileTextOutlined style={{ fontSize: 32, marginBottom: 16, color: '#ccc' }} />
                  <div style={{ fontSize: 14 }}>暂无资料</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>点击上方"添加"按钮添加资料，或使用导入功能加载示例数据</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 重命名弹窗 */}
      <Modal
        title="重命名"
        open={renameModalVisible}
        onOk={handleConfirmRename}
        onCancel={() => setRenameModalVisible(false)}
        okText="确定"
        cancelText="取消"
        destroyOnClose
      >
        <Input
          autoFocus
          placeholder="请输入新名称"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onPressEnter={handleConfirmRename}
        />
      </Modal>

      {/* 新增模块弹窗 */}
      <Modal
        title="新增模块"
        open={addModuleModalVisible}
        onOk={handleAddModule}
        onCancel={() => setAddModuleModalVisible(false)}
        okText="创建"
        cancelText="取消"
        destroyOnClose
      >
        <Input
          autoFocus
          placeholder="请输入模块名称"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          onPressEnter={handleAddModule}
        />
      </Modal>

      {/* 资料添加弹窗 */}
      <MaterialAddPage 
        visible={showMaterialAddModal}
        onClose={() => setShowMaterialAddModal(false)}
        onCapabilityModelAdded={() => setShowCapabilityMapModal(true)}
        onKnowledgeGraphAdded={() => setShowKnowledgeGraphModal(true)}
      />
      
      {/* 探索弹窗 */}
      <ExploreModal
        visible={showExploreModal}
        onClose={() => setShowExploreModal(false)}
        onExplore={onExplore}
      />
    </div>
  );
};

export default MaterialManagement;