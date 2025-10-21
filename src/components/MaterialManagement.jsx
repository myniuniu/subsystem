import React, { useState, useEffect, useMemo } from 'react';
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
    EyeOutlined,
    PlayCircleOutlined,
    ClockCircleOutlined,
    RobotOutlined,
    NodeIndexOutlined,
    DownOutlined,
    RightOutlined,
    FolderOutlined,
    AppstoreOutlined
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

  // 计算视频的层次路径（课程/章/节），用于鼠标悬停提示
  const getVideoHierarchyPath = (courseId, video) => {
    const course = courseHierarchyMap.get(courseId);
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
  // 分组折叠状态 & 汇总计算（需在组件函数体内）
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [hierarchyOpenCourses, setHierarchyOpenCourses] = useState(new Set());
  const [highlightVideoId, setHighlightVideoId] = useState(null);
  // 课程视频视图模式：平铺视图 或 层级视图
  const [videoViewMode, setVideoViewMode] = useState('flat');
  // 各来源类型分区折叠状态（课程视频、直播课、考试文件、普通文件、链接、文本）
  const [collapsedSections, setCollapsedSections] = useState({
    videos: false,
    live: false,
    examFiles: false,
    files: false,
    links: false,
    texts: false
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


  // 全部展开/全部折叠
  const expandAllSections = () => {
    setCollapsedSections({ videos: false, live: false, examFiles: false, files: false, links: false, texts: false });
    setCollapsedGroups(new Set());
  };
  const collapseAllSections = () => {
    setCollapsedSections({ videos: true, live: true, examFiles: true, files: true, links: true, texts: true });
    setCollapsedGroups(new Set(allCourseIds));
  };

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
      flex: currentView === 'video' ? 4 : (viewMode === 'map' ? 4 : 2.5), 
      background: '#fff', 
      margin: '16px 0 16px 16px', 
      borderRadius: '8px', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'flex 0.3s ease'
    }}>
      <div style={{ padding: '20px', flex: 1 }}>
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
            {/* 原“初始化”按钮已移除 */}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* 全局折叠/展开单一图标按钮 */}
            <Tooltip title={collapsedSections.videos && collapsedSections.live && collapsedSections.examFiles && collapsedSections.files && collapsedSections.links && collapsedSections.texts && collapsedGroups.size === allCourseIds.length ? '全部展开' : '全部折叠'}>
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
                  collapsedGroups.size === allCourseIds.length
                ) ? '全部展开' : '全部折叠'}
              </Button>
            </Tooltip>
            <Checkbox 
              checked={selectedMaterials.length > 0 && selectedMaterials.length === (
                uploadedFiles.length + addedTexts.length + displayCourseVideos.length + links.length + organizationalCourses.length + liveStreams.length
              )}
              indeterminate={selectedMaterials.length > 0 && selectedMaterials.length < (
                uploadedFiles.length + addedTexts.length + displayCourseVideos.length + links.length + organizationalCourses.length + liveStreams.length
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

        {/* 资料列表内容区域 */}
        <div style={{ 
          height: liveStreams.some(stream => getLiveStreamStatus(stream) === 'live')
            ? 'calc(100vh - 332px)' 
            : 'calc(100vh - 280px)',
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
              {/* 课程视频列表（按课程分组，支持一课多视频） */}
              {displayCourseVideos.length > 0 && (
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
                                  const struct = courseStructureIndex.get(group.courseId);
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
                                  <Progress percent={summary.overallProgress} size="small" showInfo={false} />
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
                      const course = courseHierarchyMap.get(group.courseId);
                      if (!course) return null;

                      const treeData = (course.chapters || []).map(ch => ({
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
                      }));

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
                        <Tooltip title={getVideoHierarchyPath(group.courseId, video)} placement="top">
                        <Card 
                          key={`video-${video.id}`}
                          id={`video-card-${video.id}`}
                          size="small" 
                          style={{ 
                            marginBottom: 8,
                            cursor: 'pointer',
                            border: '1px solid #e8e8e8',
                            ...(highlightVideoId === video.id ? { boxShadow: '0 0 0 2px #1890ff', borderColor: '#1890ff' } : {})
                          }}
                          bodyStyle={{ padding: '8px 12px' }}
                          onClick={() => onPlayVideo(video)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                              {video.type === 'live_replay' ? (
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
              {Array.isArray(liveStreams) && liveStreams.length > 0 && (
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
                        style={{ marginBottom: 8, border: '1px solid #e8e8e8' }}
                        bodyStyle={{ padding: '8px 12px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                            {status === 'live' ? (
                              <PlayCircleOutlined style={{ color: '#ff4d4f', marginRight: 8, fontSize: 16 }} />
                            ) : (
                              <ClockCircleOutlined style={{ color: '#faad14', marginRight: 8, fontSize: 16 }} />
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
              {examFiles.length > 0 && (
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
                                  { key: 'convertToOperationRecord', label: '转为操作记录', icon: <FileTextOutlined /> },
                                  { key: 'delete', label: '删除', icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />, danger: true }
                                ],
                                onClick: ({ key }) => {
                                  if (key === 'rename') {
                                    openRename('file', file.id, getFileDisplayName(file.name));
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

              {/* 文件列表（不包含试卷） */}
              {nonExamFiles.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {collapsedSections.files ? (
                        <RightOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('files')} />
                      ) : (
                        <DownOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('files')} />
                      )}
                      <Text strong style={{ fontSize: '12px', color: '#666' }}>
                        📄 文件 ({nonExamFiles.length})
                      </Text>
                    </div>
                  </div>
                  {!collapsedSections.files && nonExamFiles.map(file => (
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
                      {/* 悬停操作图标 - More 菜单（普通文件） */}
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
                                  { key: 'convertToOperationRecord', label: '转为操作记录', icon: <FileTextOutlined /> },
                                  { key: 'delete', label: '删除', icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />, danger: true }
                                ],
                                onClick: ({ key }) => {
                                  if (key === 'rename') {
                                    openRename('file', file.id, getFileDisplayName(file.name));
                                  }
                                  if (key === 'convertToOperationRecord') {
                                    const displayName = getFileDisplayName(file.name);
                                    const newRecord = {
                                      id: Date.now(),
                                      title: `转化自文件：${displayName}`,
                                      source: '资料：文件',
                                      time: '刚刚',
                                      type: 'note',
                                      subType: 'material',
                                      content: `<div style="padding:12px;">\n          <h3>📄 ${displayName}</h3>\n          <p style="color:#666;">已由文件转为操作记录</p>\n          <p style=\"color:#999;font-size:12px;\">类型：${file.type || '未知'} • 大小：${Math.round((file.size || 0)/1024)}KB</p>\n        </div>`,
                                      materialRef: { type: 'file', id: file.id, isPaper: false }
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
                            <FileTextOutlined style={{ color: '#52c41a', marginRight: 8, fontSize: 16 }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>
                              {getFileDisplayName(file.name)}
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

              {/* 链接列表 */}
              {links.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {collapsedSections.links ? (
                        <RightOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('links')} />
                      ) : (
                        <DownOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('links')} />
                      )}
                      <Text strong style={{ fontSize: '12px', color: '#666' }}>
                        🔗 链接 ({links.length})
                      </Text>
                    </div>
                  </div>
                  {!collapsedSections.links && links.map(link => (
                    <Card 
                      key={`link-${link.id}`}
                      size="small" 
                      style={{ 
                        marginBottom: 8,
                        border: '1px solid #e8e8e8',
                        position: 'relative'
                      }}
                      bodyStyle={{ padding: '8px 12px' }}
                      onMouseEnter={() => setHoveredItems(prev => ({ ...(prev || {}), [`link-${link.id}`]: true }))}
                      onMouseLeave={() => setHoveredItems(prev => ({ ...(prev || {}), [`link-${link.id}`]: false }))}
                    >
                      {/* 悬停操作图标 - More 菜单（链接） */}
                      <div style={{ position: 'absolute', top: 6, right: 8, display: 'flex', gap: 8, background: 'rgba(255,255,255,0.85)', borderRadius: 4, padding: '2px 6px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', opacity: hoveredItems?.[`link-${link.id}`] ? 1 : 0, transition: 'opacity 0.2s' }}>

                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                          {hoveredItems?.[`link-${link.id}`] ? (
                            <Dropdown
                              trigger={['click']}
                              placement="bottomLeft"
                              menu={{
                                items: [
                                  { key: 'rename', label: '重命名', icon: <EditOutlined /> },
                                  { key: 'convertToOperationRecord', label: '转为操作记录', icon: <LinkOutlined /> },
                                  { key: 'delete', label: '删除', icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />, danger: true }
                                ],
                                onClick: ({ key }) => {
                                  if (key === 'rename') {
                                    openRename('link', link.id, link.title || link.url);
                                  }
                                  if (key === 'convertToOperationRecord') {
                                    const displayTitle = link.title || link.url;
                                    const newRecord = {
                                      id: Date.now(),
                                      title: `转化自链接：${displayTitle}`,
                                      source: '资料：链接',
                                      time: '刚刚',
                                      type: 'note',
                                      subType: 'material',
                                      content: `<div style="padding:12px;">\n          <h3>🔗 ${displayTitle}</h3>\n          <p style="color:#666;">已由链接转为操作记录</p>\n          <p style=\"font-size:12px;\"><a href=\"${link.url}\" target=\"_blank\" rel=\"noopener noreferrer\">${link.url}</a></p>\n        </div>`,
                                      materialRef: { type: 'link', id: link.id, url: link.url }
                                    };
                                    state.setOperationRecords(prev => ({
                                      ...prev,
                                      note: [newRecord, ...((prev && prev.note) ? prev.note : [])]
                                    }));
                                    message.success('已转为操作记录');
                                  }
                                  if (key === 'delete') {
                                    Modal.confirm({
                                      title: '确认删除该链接？',
                                      okText: '删除',
                                      okType: 'danger',
                                      cancelText: '取消',
                                      onOk: () => handleDeleteLink(link.id)
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
                            <LinkOutlined style={{ color: '#1890ff', marginRight: 8, fontSize: 16 }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>
                              {link.title}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 10 }}>
                              {link.addTime}
                            </Text>
                          </div>
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

              {/* 文本内容列表 */}
              {addedTexts.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {collapsedSections.texts ? (
                        <RightOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('texts')} />
                      ) : (
                        <DownOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => toggleSection('texts')} />
                      )}
                      <Text strong style={{ fontSize: '12px', color: '#666' }}>
                        📝 文本 ({addedTexts.length})
                      </Text>
                    </div>
                  </div>
                  {!collapsedSections.texts && addedTexts.map(text => (
                    <Card 
                      key={`text-${text.id}`}
                      size="small" 
                      style={{ 
                        marginBottom: 8,
                        border: '1px solid #e8e8e8',
                        position: 'relative'
                      }}
                      bodyStyle={{ padding: '8px 12px' }}
                      onMouseEnter={() => setHoveredItems(prev => ({ ...(prev || {}), [`text-${text.id}`]: true }))}
                      onMouseLeave={() => setHoveredItems(prev => ({ ...(prev || {}), [`text-${text.id}`]: false }))}
                    >
                      {/* 悬停操作图标 - More 菜单（文本） */}
                      <div style={{ position: 'absolute', top: 6, right: 8, display: 'flex', gap: 8, background: 'rgba(255,255,255,0.85)', borderRadius: 4, padding: '2px 6px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', opacity: hoveredItems?.[`text-${text.id}`] ? 1 : 0, transition: 'opacity 0.2s' }}>

                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                          {hoveredItems?.[`text-${text.id}`] ? (
                            <Dropdown
                              trigger={['click']}
                              placement="bottomLeft"
                              menu={{
                                items: [
                                  { key: 'rename', label: '重命名', icon: <EditOutlined /> },
                                  { key: 'convertToOperationRecord', label: '转为操作记录', icon: <FileTextOutlined /> },
                                  { key: 'delete', label: '删除', icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />, danger: true }
                                ],
                                onClick: ({ key }) => {
                                  if (key === 'rename') {
                                    openRename('text', text.id, text.title || '文本');
                                  }
                                  if (key === 'convertToOperationRecord') {
                                    const displayTitle = text.title || '文本';
                                    const newRecord = {
                                      id: Date.now(),
                                      title: `转化自文本：${displayTitle}`,
                                      source: '资料：文本',
                                      time: '刚刚',
                                      type: 'note',
                                      subType: 'material',
                                      content: `<div style="padding:12px;">\n          <h3>📝 ${displayTitle}</h3>\n          <p style=\"color:#666;\">已由文本转为操作记录</p>\n          <div style=\"color:#333;font-size:13px;white-space:pre-wrap;\">${(text.content || '').slice(0,200)}</div>\n        </div>`,
                                      materialRef: { type: 'text', id: text.id }
                                    };
                                    state.setOperationRecords(prev => ({
                                      ...prev,
                                      note: [newRecord, ...((prev && prev.note) ? prev.note : [])]
                                    }));
                                    message.success('已转为操作记录');
                                  }
                                  if (key === 'delete') {
                                    Modal.confirm({
                                      title: '确认删除该文本？',
                                      okText: '删除',
                                      okType: 'danger',
                                      cancelText: '取消',
                                      onOk: () => handleDeleteText(text.id)
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
                            <FileTextOutlined style={{ color: '#faad14', marginRight: 8, fontSize: 16 }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>
                              {text.title}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 10 }}>
                              {text.addTime}
                            </Text>
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

              {/* 空状态显示 */}
              {courseVideos.length === 0 && examFiles.length === 0 && nonExamFiles.length === 0 && links.length === 0 && addedTexts.length === 0 && (
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