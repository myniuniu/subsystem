import { useState, useEffect } from 'react';
import { generateCapabilityMap } from '../data/capabilityMapData.js';
import { generateKnowledgeGraph } from '../data/knowledgeGraphData.js';
import { CAPABILITY_CATEGORIES } from '../types/capabilityModel.js';
import { KNOWLEDGE_GRAPH_CATEGORIES } from '../types/knowledgeGraph.js';
import { DEFAULT_COURSE_VIDEOS, VIEW_MODES } from '../constants/noteEditConstants.js';

// 模拟字幕数据
const subtitleData = [
  { start: 0, end: 15, text: '欢迎来到数据结构与算法基础课程，今天我们将学习数组和链表的基本概念。' },
  { start: 15, end: 35, text: '首先，让我们回顾一下数据结构的定义。数据结构是计算机存储、组织数据的方式。' },
  { start: 35, end: 55, text: '数组是最简单的数据结构之一，它由相同类型的元素组成，并且这些元素在内存中是连续存储的。' },
  { start: 55, end: 75, text: '数组的主要优点是随机访问，可以通过索引在O(1)时间复杂度内访问任意元素。' },
  { start: 75, end: 95, text: '但是数组也有缺点，比如在中间插入或删除元素需要移动其他元素，时间复杂度为O(n)。' },
  { start: 95, end: 115, text: '接下来我们来看链表。链表是一种线性数据结构，元素通过指针连接。' },
  { start: 115, end: 135, text: '链表的优点是插入和删除操作非常高效，只需要O(1)时间复杂度。' },
  { start: 135, end: 155, text: '但链表不支持随机访问，访问第n个元素需要从Head开始遍历，时间复杂度为O(n)。' },
  { start: 155, end: 175, text: '现在让我们通过一个实际例子来加深理解。假设我们要存储一个学生成绩列表。' },
  { start: 175, end: 195, text: '如果使用数组，我们可以快速查找任意学生的成绩，但添加或删除学生会比较慢。' },
  { start: 195, end: 215, text: '如果使用链表，添加或删除学生非常快，但查找特定学生成绩需要遍历。' },
  { start: 215, end: 235, text: '总结一下，数组适合需要频繁随机访问的场景，而链表适合需要频繁插入删除的场景。' },
  { start: 235, end: 250, text: '下节课我们将学习栈和队列，请大家做好预习准备。谢谢大家！' }
];

export const useNoteEditState = (note, mode) => {
  // 资料收集相关状态
  const [uploadedFiles, setUploadedFiles] = useState(() => {
    // 默认的试卷文件，在任何模式下都显示
    const defaultFiles = [
      { id: 1, name: '成都火锅制作工艺.pdf', type: 'application/pdf', uploadTime: '刚刚' },
      { id: 4, name: '数学综合试卷-期末考试.pdf', type: 'application/pdf', uploadTime: '2分钟前', isPaper: true, paperType: '期末考试', subject: '数学' },
      { id: 5, name: '语文阅读理解试卷.pdf', type: 'application/pdf', uploadTime: '5分钟前', isPaper: true, paperType: '专项练习', subject: '语文' }
    ];
    
    if (mode === 'create') {
      return defaultFiles;
    } else {
      // 编辑模式下，如果有传入的文件则使用，否则使用默认文件
      const existingFiles = note?.materials?.files;
      if (existingFiles && existingFiles.length > 0) {
        return existingFiles;
      } else {
        return defaultFiles;
      }
    }
  });

  // 组织培训课程来源状态
  const [organizationalCourses, setOrganizationalCourses] = useState(
    note?.organizationalCourses || []
  );

  // 多选功能状态
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showMaterialDetail, setShowMaterialDetail] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [links, setLinks] = useState(() => {
    const defaultLinks = [
      { id: 2, url: 'https://chengdu-food.com', title: '成都美食攻略网站', addTime: '刚刚' }
    ];
    
    if (mode === 'create') {
      return defaultLinks;
    } else {
      const existingLinks = note?.materials?.links;
      if (existingLinks && existingLinks.length > 0) {
        return existingLinks;
      } else {
        return defaultLinks;
      }
    }
  });
  const [newLink, setNewLink] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMaterialAddModal, setShowMaterialAddModal] = useState(false);
  const [websiteType, setWebsiteType] = useState('normal');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // 文字内容相关状态
  const [textContent, setTextContent] = useState('');
  const [addedTexts, setAddedTexts] = useState(() => {
    const defaultTexts = [
      { id: 3, title: '成都小吃介绍', content: '成都是著名的美食之都，拥有麻婆豆腐、回锅肉、担担面、龙抄手等众多特色小吃...', addTime: '刚刚' }
    ];
    
    if (mode === 'create') {
      return defaultTexts;
    } else {
      const existingTexts = note?.materials?.texts;
      if (existingTexts && existingTexts.length > 0) {
        return existingTexts;
      } else {
        return defaultTexts;
      }
    }
  });

  // 课程视频相关状态
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [courseVideos, setCourseVideos] = useState(() => {
    if (mode === 'create') {
      return DEFAULT_COURSE_VIDEOS;
    } else {
      const actualVideos = note?.materials?.videos;
      if (actualVideos && actualVideos.length > 0) {
        return actualVideos;
      } else {
        return DEFAULT_COURSE_VIDEOS;
      }
    }
  });

  // 我的选课相关状态
  const [selectedCourses, setSelectedCourses] = useState(
    note?.materials?.courses || []
  );

  // 问答区域相关状态
  const [messages, setMessages] = useState(note?.messages || []);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 快捷操作相关状态
  const [quickActions] = useState([
    { key: 'summarize', label: '内容总结', icon: '📄' },
    { key: 'extract', label: '关键信息提取', icon: '📝' },
    { key: 'translate', label: '翻译', icon: '🔄' },
    { key: 'analyze', label: '深度分析', icon: '🤖' }
  ]);

  // 操作结果相关状态
  const [operationResults, setOperationResults] = useState(note?.operationResults || []);

  // 操作面板相关状态
  const [selectedOperation, setSelectedOperation] = useState('audio');

  // 探索弹窗相关状态
  const [showExploreModal, setShowExploreModal] = useState(false);

  // 操作记录状态
  const getDefaultOperationRecords = () => {
    const defaultRecords = {
      audio: [],
      video: [],
      mindmap: [],
      report: [],
      ppt: [],
      webcode: [],
      scenario: [], // 不再在这里放置模拟数据，使用真实的场景数据
      file: [],
      text: [],
      link: [],
      note: [
        {
          id: 1,
          title: '学习笔记示例',
          source: '示例笔记',
          time: '刚刚',
          type: 'note',
          content: '<p>这是一个示例笔记，您可以点击编辑来修改内容。</p>'
        }
      ],
      'study-result': [],
      question: [], // 添加试题操作类型
      'exam-paper': [], // 添加试卷操作类型
      'learning-plan': [], // 添加学习计划操作类型
      grading: [] // 添加阅卷工具操作类型
    };
    
    // 如果有传入的operationRecords，合并并确保每个字段都是数组
    if (note?.operationRecords) {
      const merged = { ...defaultRecords };
      Object.keys(note.operationRecords).forEach(key => {
        if (Array.isArray(note.operationRecords[key])) {
          merged[key] = note.operationRecords[key];
        }
      });
      return merged;
    }
    
    return defaultRecords;
  };
  
  const [operationRecords, setOperationRecords] = useState(getDefaultOperationRecords());

  // 内容查看弹窗状态
  const [showContentModal, setShowContentModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalContent, setModalContent] = useState('');

  // 预览功能状态
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewType, setPreviewType] = useState('');
  const [previewData, setPreviewData] = useState(null);

  // 智能笔记相关状态
  const [smartNotes, setSmartNotes] = useState(note?.smartNotes || []);
  const [showSmartNotesModal, setShowSmartNotesModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // 视频播放器相关状态
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  // 字幕选择菜单相关状态
  const [subtitleMenuVisible, setSubtitleMenuVisible] = useState(false);
  const [subtitleMenuPosition, setSubtitleMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedSubtitleText, setSelectedSubtitleText] = useState('');
  const [selectedSubtitleTime, setSelectedSubtitleTime] = useState(0);

  // 嵌入式视频播放相关状态
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [currentView, setCurrentView] = useState(VIEW_MODES.MATERIALS); // 使用常量而不是字符串
  const [videoStartTime, setVideoStartTime] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [videoProgress, setVideoProgress] = useState(0);

  // 直播流状态管理
  const [liveStreams, setLiveStreams] = useState([
    {
      id: 'live_001',
      title: '《课程思政融入专业课教学》研讨会',
      instructor: '张教授',
      startTime: '2025-01-25 14:00',
      endTime: '2025-01-25 16:00',
      url: 'https://dingtalk.com/live/123456',
      platform: '钉钉直播',
      participants: 156,
      status: 'live'
    }
  ]);

  // 悬停状态管理
  const [hoveredItems, setHoveredItems] = useState({});

  // 场景模拟相关状态
  const [scenarioModalVisible, setScenarioModalVisible] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState([]);

  // 添加工具相关状态
  const [addToolModalVisible, setAddToolModalVisible] = useState(false);
  const [availableTools, setAvailableTools] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [toolCategories, setToolCategories] = useState([]);
  const [selectedToolCategory, setSelectedToolCategory] = useState('all');

  // 富文本编辑器相关状态
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteEditorContent, setNoteEditorContent] = useState('');

  // 右侧栏显示状态
  const [rightPanelView, setRightPanelView] = useState('operations');
  const [rightPanelEditingNote, setRightPanelEditingNote] = useState(null);
  const [rightPanelNoteContent, setRightPanelNoteContent] = useState('');
  
  // 试题查看状态
  const [rightPanelQuestionRecord, setRightPanelQuestionRecord] = useState(null);
  const [rightPanelQuestionContent, setRightPanelQuestionContent] = useState('');
  
  // 学习计划查看状态
  const [rightPanelLearningPlanRecord, setRightPanelLearningPlanRecord] = useState(null);
  const [rightPanelLearningPlanContent, setRightPanelLearningPlanContent] = useState('');
  
  // 阅卷报告查看状态
  const [rightPanelGradingRecord, setRightPanelGradingRecord] = useState(null);
  const [rightPanelGradingContent, setRightPanelGradingContent] = useState('');

  // 能力模型相关状态
  const [capabilityMap, setCapabilityMap] = useState(null);
  const [capabilityVideos, setCapabilityVideos] = useState([]);
  const [viewMode, setViewMode] = useState('card');
  const [selectedCapabilityCategory, setSelectedCapabilityCategory] = useState('all');
  const [showCapabilityMapModal, setShowCapabilityMapModal] = useState(false);

  // 知识图谱相关状态
  const [knowledgeGraph, setKnowledgeGraph] = useState(null);
  const [knowledgeResources, setKnowledgeResources] = useState([]);
  const [selectedKnowledgeCategory, setSelectedKnowledgeCategory] = useState('all');
  const [showKnowledgeGraphModal, setShowKnowledgeGraphModal] = useState(false);

  // 播放器宽屏模式状态
  const [isWidescreenMode, setIsWidescreenMode] = useState(false);

  // 能力分类选项
  const capabilityCategories = [
    { id: 'all', name: '全部能力' },
    ...Object.keys(CAPABILITY_CATEGORIES).map(key => ({
      id: key,
      name: CAPABILITY_CATEGORIES[key].name
    }))
  ];

  // 知识图谱分类选项
  const knowledgeCategories = [
    { id: 'all', name: '全部领域' },
    ...Object.keys(KNOWLEDGE_GRAPH_CATEGORIES).map(key => ({
      id: key,
      name: KNOWLEDGE_GRAPH_CATEGORIES[key].name
    }))
  ];

  // 初始化能力地图和知识图谱数据
  useEffect(() => {
    const { map, videos } = generateCapabilityMap();
    setCapabilityMap(map);
    setCapabilityVideos(videos);

    const { graph, resources } = generateKnowledgeGraph();
    setKnowledgeGraph(graph);
    setKnowledgeResources(resources);

    // 如果是编辑模式且有note数据，根据note的类型设置地图模式
    if (mode === 'edit' && note) {
      if (note.category === 'capability_model' || note.type === 'capability_model') {
        setShowCapabilityMapModal(true);
        setViewMode('map'); // 自动切换到地图模式
      } else if (note.category === 'knowledge_graph' || note.type === 'knowledge_graph') {
        setShowKnowledgeGraphModal(true);
        setViewMode('map'); // 自动切换到地图模式
      }
    }
  }, [note, mode]);

  // 合并所有资料为materials数组
  const materials = [...uploadedFiles, ...addedTexts, ...courseVideos, ...links, ...selectedCourses];

  return {
    // 资料相关状态
    uploadedFiles,
    setUploadedFiles,
    organizationalCourses,
    setOrganizationalCourses,
    selectedMaterials,
    setSelectedMaterials,
    showMaterialDetail,
    setShowMaterialDetail,
    currentMaterial,
    setCurrentMaterial,
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
    materials,

    // 问答相关状态
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isLoading,
    setIsLoading,
    quickActions,
    operationResults,
    setOperationResults,
    selectedOperation,
    setSelectedOperation,
    showExploreModal,
    setShowExploreModal,

    // 操作记录相关状态
    operationRecords,
    setOperationRecords,
    showContentModal,
    setShowContentModal,
    currentRecord,
    setCurrentRecord,
    modalContent,
    setModalContent,
    showPreviewModal,
    setShowPreviewModal,
    previewType,
    setPreviewType,
    previewData,
    setPreviewData,

    // 智能笔记相关状态
    smartNotes,
    setSmartNotes,
    showSmartNotesModal,
    setShowSmartNotesModal,
    selectedNote,
    setSelectedNote,

    // 视频播放相关状态
    showVideoPlayer,
    setShowVideoPlayer,
    currentVideo,
    setCurrentVideo,
    subtitleMenuVisible,
    setSubtitleMenuVisible,
    subtitleMenuPosition,
    setSubtitleMenuPosition,
    selectedSubtitleText,
    setSelectedSubtitleText,
    selectedSubtitleTime,
    setSelectedSubtitleTime,
    selectedMaterial,
    setSelectedMaterial,
    currentView,
    setCurrentView,
    videoStartTime,
    setVideoStartTime,
    currentSubtitle,
    setCurrentSubtitle,
    videoProgress,
    setVideoProgress,

    // 直播和悬停状态
    liveStreams,
    setLiveStreams,
    hoveredItems,
    setHoveredItems,

    // 场景模拟状态
    scenarioModalVisible,
    setScenarioModalVisible,
    selectedScenarios,
    setSelectedScenarios,

    // 添加工具状态
    addToolModalVisible,
    setAddToolModalVisible,
    availableTools,
    setAvailableTools,
    selectedTools,
    setSelectedTools,
    toolCategories,
    setToolCategories,
    selectedToolCategory,
    setSelectedToolCategory,

    // 编辑器状态
    showNoteEditor,
    setShowNoteEditor,
    editingNote,
    setEditingNote,
    noteEditorContent,
    setNoteEditorContent,
    rightPanelView,
    setRightPanelView,
    rightPanelEditingNote,
    setRightPanelEditingNote,
    rightPanelNoteContent,
    setRightPanelNoteContent,
    
    // 试题查看状态
    rightPanelQuestionRecord,
    setRightPanelQuestionRecord,
    rightPanelQuestionContent,
    setRightPanelQuestionContent,
    
    // 学习计划查看状态
    rightPanelLearningPlanRecord,
    setRightPanelLearningPlanRecord,
    rightPanelLearningPlanContent,
    setRightPanelLearningPlanContent,
    
    // 阅卷报告查看状态
    rightPanelGradingRecord,
    setRightPanelGradingRecord,
    rightPanelGradingContent,
    setRightPanelGradingContent,

    // 能力模型和知识图谱状态
    capabilityMap,
    setCapabilityMap,
    capabilityVideos,
    setCapabilityVideos,
    viewMode,
    setViewMode,
    selectedCapabilityCategory,
    setSelectedCapabilityCategory,
    showCapabilityMapModal,
    setShowCapabilityMapModal,
    knowledgeGraph,
    setKnowledgeGraph,
    knowledgeResources,
    setKnowledgeResources,
    selectedKnowledgeCategory,
    setSelectedKnowledgeCategory,
    showKnowledgeGraphModal,
    setShowKnowledgeGraphModal,
    capabilityCategories,
    knowledgeCategories,

    // 播放器宽屏模式状态
    isWidescreenMode,
    setIsWidescreenMode,

    // 常量数据
    subtitleData
  };
};