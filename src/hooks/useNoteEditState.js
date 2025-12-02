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
  { start: 235, end: 250, text: '下节课我们将学习栈和队列，请大家做好预习准备。谢谢大家！' },
  // 追加后半段模拟字幕，用于覆盖到约 7:25（445s）
  { start: 250, end: 270, text: '现在我们继续学习栈（Stack）。栈遵循先进后出（LIFO）的原则，常用于函数调用管理。' },
  { start: 270, end: 290, text: '栈的基本操作包括入栈（push）、出栈（pop）和取栈顶（top），它的典型应用是括号匹配。' },
  { start: 290, end: 310, text: '队列（Queue）遵循先进先出（FIFO）的原则，常用于任务调度和缓冲区管理。' },
  { start: 310, end: 330, text: '队列的基本操作包括入队（enqueue）和出队（dequeue），循环队列可以更高效地利用空间。' },
  { start: 330, end: 350, text: '接下来是复杂度分析。时间复杂度用于衡量算法随输入规模增长的运行时间。' },
  { start: 350, end: 370, text: '常见复杂度包括O(1)、O(log n)、O(n)、O(n log n)、O(n^2)等，要结合实际场景选择算法。' },
  { start: 370, end: 390, text: '我们引入树结构（Tree），它是具有层级关系的非线性结构，二叉树是最常见的形式。' },
  { start: 390, end: 410, text: '二叉搜索树（BST）支持高效的查找、插入与删除，在平均情况下操作复杂度为O(log n)。' },
  { start: 410, end: 430, text: '图（Graph）由顶点和边组成，广度优先搜索（BFS）与深度优先搜索（DFS）是两种基本遍历方法。' },
  { start: 430, end: 445, text: '最后我们简要回顾哈希表与排序算法。哈希通过散列函数实现近似O(1)访问，排序以快速排序为代表。' }
];

export const useNoteEditState = (note, mode, selectedTemplate = null, selectedCategory = null) => {
  // 主题判定：E-PBL 且为“为什么有些人喝了咖啡反而更困?”
  const isEPBLCategory = (selectedCategory === 'e_pbl' || note?.category === 'e_pbl' || selectedCategory === 'E-PBL' || note?.category === 'E-PBL');
  const isCoffeeTopic = /咖啡/.test(String(note?.title || '')) && /更困/.test(String(note?.title || '')) || (String(note?.title || '') === '为什么有些人喝了咖啡反而更困?');
  const isCoffeeEPBL = isEPBLCategory && isCoffeeTopic;
  // 咖啡主题模拟资料（用于默认模块）
  const COFFEE_SIM_FILES = [
    { id: 'cf_paper_001', name: '咖啡因代谢与个体差异综述.pdf', type: 'application/pdf', uploadTime: '刚刚' },
    { id: 'cf_paper_002', name: '睡眠压力与腺苷机制研究.pdf', type: 'application/pdf', uploadTime: '1分钟前' }
  ];
  const COFFEE_SIM_LINKS = [
    { id: 'cf_link_01', url: 'https://www.sleepfoundation.org/nutrition/caffeine-and-sleep', title: '科普：咖啡因与睡眠', addTime: '刚刚' },
    { id: 'cf_link_02', url: 'https://www.ncbi.nlm.nih.gov/books/NBK519065/', title: '文献：咖啡因的药理机制（腺苷受体）', addTime: '1分钟前' }
  ];
  const COFFEE_SIM_TEXTS = [
    { id: 'cf_text_01', title: '研究假设', content: '假设一：少数人喝咖啡更困可能与腺苷受体敏感性、清除速度及睡眠债相关。', addTime: '刚刚' },
    { id: 'cf_text_02', title: '实验设计草案', content: '采集受试者基线睡眠时长、摄入剂量、代谢时间窗，控制变量并记录主观困倦量表。', addTime: '1分钟前' }
  ];
  const COFFEE_SIM_VIDEOS = [
    { id: 'cf_vid_01', title: '咖啡因与睡眠-科普讲解', courseId: 'cf_course', courseTitle: '咖啡与生理', url: '/assets/2.mp4', addTime: '刚刚', duration: '7分22秒', instructor: '生理学讲师', progress: 0, videoInfo: { type: 'single_video', progress: 0, duration: 442, instructor: '讲师' } }
  ];
  // 特判：我的评阅分类下默认提供固定评阅来源数据（首项已改名）
  const isMyEvaluation = (
    selectedCategory === 'my_evaluation' ||
    note?.category === 'my_evaluation'
  );
  // 资料收集相关状态
  const [uploadedFiles, setUploadedFiles] = useState(() => {
    // 咖啡主题：覆盖使用模拟文件
    if (isCoffeeEPBL) {
      return COFFEE_SIM_FILES;
    }
    // 我的评阅：不注入默认试卷/文件
    if (isMyEvaluation) {
      return [];
    }
    // 培训需求管理或组织培训主题下不显示默认文件（优先级最高）
    const keywords = ['新教师教学方法培训', '新教师教学方法', '教学方法培训'];
    const matchesTitle = keywords.some(k => (note?.title || '').includes(k));
    const isOrgTraining =
      selectedCategory === 'organizational_training' ||
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训')) ||
      matchesTitle;

    if (selectedCategory === 'training_needs_management' || note?.category === 'training_needs_management' || isOrgTraining) {
      return [];
    }
    const isTeachingResearch = (selectedCategory === 'teaching_research_office' || note?.category === 'teaching_research_office');
    // 默认的试卷文件，在任何模式下都显示
    const examDefaults = [
      { id: 4, name: '数学综合试卷-期末考试.pdf', type: 'application/pdf', uploadTime: '2分钟前', isPaper: true, paperType: '期末考试', subject: '数学' },
      { id: 5, name: '语文阅读理解试卷.pdf', type: 'application/pdf', uploadTime: '5分钟前', isPaper: true, paperType: '专项练习', subject: '语文' }
    ];
    const defaultFiles = isTeachingResearch ? [
      { id: 111, name: '教研室会议纪要-2025-01-10.pdf', type: 'application/pdf', uploadTime: '刚刚' },
      { id: 112, name: '小学体育游戏化教学研究方案.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uploadTime: '1分钟前' },
      { id: 113, name: '游戏化教学研究综述.pdf', type: 'application/pdf', uploadTime: '2分钟前' },
      ...examDefaults
    ] : [
      { id: 1, name: '成都火锅制作工艺.pdf', type: 'application/pdf', uploadTime: '刚刚' },
      ...examDefaults
    ];
    if (mode === 'create') {
      return defaultFiles;
    } else {
      // 编辑模式下，如果有传入的文件则使用，否则使用默认文件
      const existingFiles = note?.materials?.files;
      if (Array.isArray(existingFiles) && existingFiles.length > 0) {
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

  // 模块归属映射（由资料管理模块维护并同步到此处）
  // 结构示例：{ live: { [id]: moduleId }, videos: {}, exam: {}, links: {}, texts: {}, projects: {} }
  const [moduleAssignments, setModuleAssignments] = useState({
    live: {},
    videos: {},
    exam: {},
    links: {},
    texts: {},
    projects: {}
  });
  const [links, setLinks] = useState(() => {
    // 咖啡主题：覆盖使用模拟链接
    if (isCoffeeEPBL) {
      return COFFEE_SIM_LINKS;
    }
    // 我的评阅：不注入默认链接
    if (isMyEvaluation) {
      return [];
    }
    // 培训需求管理分类下只显示“新教师培训通知”；组织培训主题不注入无关默认链接
    const keywords = ['新教师教学方法培训', '新教师教学方法', '教学方法培训'];
    const matchesTitle = keywords.some(k => (note?.title || '').includes(k));
    const isOrgTraining =
      selectedCategory === 'organizational_training' ||
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训')) ||
      matchesTitle;

    if (selectedCategory === 'training_needs_management' || note?.category === 'training_needs_management') {
      return [
        { id: 'training_notice_001', url: '/assets/新教师入职培训安排及要求的通知.pdf', title: '新教师入职培训安排及要求的通知', addTime: '刚刚' }
      ];
    }
    if (isOrgTraining) {
      return [];
    }
    const isTeachingResearch = (selectedCategory === 'teaching_research_office' || note?.category === 'teaching_research_office');
    const defaultLinks = isTeachingResearch ? [
      { id: 'tre_001', url: 'https://example.com/小学体育游戏化教学模式-课题介绍', title: '课题介绍：小学体育游戏化教学模式研究', addTime: '刚刚' },
      { id: 'tre_002', url: 'https://example.com/教研室-体育组-活动通知', title: '教研室活动通知：体育组研讨会安排', addTime: '1分钟前' },
      { id: 'tre_003', url: 'https://example.com/学科教学研究资源库-体育', title: '资源库：体育学科教学研究资料', addTime: '3分钟前' }
    ] : [
      { id: 2, url: 'https://chengdu-food.com', title: '成都美食攻略网站', addTime: '刚刚' }
    ];
    if (mode === 'create') {
      return defaultLinks;
    } else {
      const existingLinks = note?.materials?.links;
      if (Array.isArray(existingLinks) && existingLinks.length > 0) {
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
    // 咖啡主题：覆盖使用模拟文本
    if (isCoffeeEPBL) {
      return COFFEE_SIM_TEXTS;
    }
    // 我的评阅：固定展示四条评阅来源数据（首项改为“学生管理基础 | 情景模拟”）
    if (isMyEvaluation) {
      return [
        {
          id: 'ev_text_001',
          title: '学生管理基础 | 情景模拟',
          content: '示例：课堂纪律与学生行为管理的情景模拟要点与反思。',
          addTime: '刚刚'
        },
        {
          id: 'ev_text_002',
          title: '教学设计进阶 | 完整教学设计',
          content: '示例：基于目标-活动-评价的完整教学设计评阅记录与优化建议。',
          addTime: '1分钟前'
        },
        {
          id: 'ev_text_003',
          title: '教育科研入门 | 研究计划书',
          content: '示例：研究问题、方法与进度安排的计划书评阅与改进意见。',
          addTime: '2分钟前'
        },
        {
          id: 'ev_text_004',
          title: '教师职业规划 | 个人发展规划',
          content: '示例：教学、教研与职业发展目标的阶段性规划与评估要点。',
          addTime: '3分钟前'
        }
      ];
    }
    // 培训需求管理或组织培训主题下不显示默认文本（优先级最高）
    const keywords = ['新教师教学方法培训', '新教师教学方法', '教学方法培训'];
    const matchesTitle = keywords.some(k => (note?.title || '').includes(k));
    const isOrgTraining =
      selectedCategory === 'organizational_training' ||
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训')) ||
      matchesTitle;

    if (selectedCategory === 'training_needs_management' || note?.category === 'training_needs_management' || isOrgTraining) {
      return [];
    }
    const isTeachingResearch = (selectedCategory === 'teaching_research_office' || note?.category === 'teaching_research_office');
    const defaultTexts = isTeachingResearch ? [
      { id: 21, title: '研究方案摘要', content: '本研究聚焦小学体育游戏化教学模式，通过设计与实施教学游戏，期待提升学生参与度与学习效果。', addTime: '刚刚' },
      { id: 22, title: '教研活动安排', content: '教研室计划于每周三开展主题研讨，安排课题分工与阶段评审。', addTime: '2分钟前' },
      { id: 23, title: '问卷设计要点', content: '围绕学习兴趣、课堂参与、体能提升等维度设计问卷，建议采用李克特量表。', addTime: '5分钟前' }
    ] : [
      { id: 3, title: '成都小吃介绍', content: '成都是著名的美食之都，拥有麻婆豆腐、回锅肉、担担面、龙抄手等众多特色小吃...', addTime: '刚刚' }
    ];
    if (mode === 'create') {
      return defaultTexts;
    } else {
      const existingTexts = note?.materials?.texts;
      if (Array.isArray(existingTexts) && existingTexts.length > 0) {
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
    // 咖啡主题：覆盖使用模拟视频
    if (isCoffeeEPBL) {
      return COFFEE_SIM_VIDEOS;
    }
    // 我的评阅：不注入默认课程视频
    if (isMyEvaluation) {
      return [];
    }
    // 培训需求管理分类下不显示任何课程视频（优先级最高）
    if (selectedCategory === 'training_needs_management' || note?.category === 'training_needs_management') {
      return [];
    }
    const isTeachingResearch = (selectedCategory === 'teaching_research_office' || note?.category === 'teaching_research_office');
    const teachingResearchVideos = [
      { id: 301, title: '小学体育：游戏化教学示范课', courseId: 401, courseTitle: '小学体育游戏化教学', url: 'https://www.bilibili.com/video/BV1PEgame001', addTime: '2025-01-12 09:30', duration: '40分钟', instructor: '体育组王老师', progress: 50, videoInfo: { type: 'single_video', progress: 50, duration: 2400, instructor: '王老师' } },
      { id: 302, title: '体育课堂游戏设计与实施', courseId: 401, courseTitle: '小学体育游戏化教学', url: 'https://www.bilibili.com/video/BV1PEgame002', addTime: '2025-01-12 10:20', duration: '55分钟', instructor: '体育组李老师', progress: 20, videoInfo: { type: 'multi_video', totalVideos: 3, totalDuration: 3300, watchedDuration: 660, overallProgress: 20 } }
    ];
    if (mode === 'create') {
      return isTeachingResearch ? teachingResearchVideos : DEFAULT_COURSE_VIDEOS;
    } else {
      const actualVideos = note?.materials?.videos;
      if (Array.isArray(actualVideos) && actualVideos.length > 0) {
        return actualVideos;
      } else {
        return isTeachingResearch ? teachingResearchVideos : DEFAULT_COURSE_VIDEOS;
      }
    }
  });

  // 我的选课相关状态
  const [selectedCourses, setSelectedCourses] = useState(
    note?.materials?.courses || []
  );

  // 问答区域相关状态
  const getChatStoreKey = () => {
    const idPart = note?.id ? `note_${note.id}` : null;
    const cat = (selectedCategory || note?.category || 'default');
    return `ai_chat_messages_${idPart ? idPart : `cat_${cat}`}`;
  };
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(getChatStoreKey());
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr;
      }
    } catch (e) { void e; }
    return note?.messages || [];
  });
  useEffect(() => {
    try {
      localStorage.setItem(getChatStoreKey(), JSON.stringify(messages));
    } catch (e) { void e; }
  }, [messages, note?.id, selectedCategory, note?.category]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 督学分类：初始化课程推荐对话（仅在无历史消息时注入一次）
  useEffect(() => {
    const isSupervision = (selectedCategory === 'supervision' || note?.category === 'supervision');
    if (!isSupervision) return;
    setMessages(prev => {
      if (Array.isArray(prev) && prev.length > 0) return prev;
      const content = '需要的话我可以在“选择课程内容集合”中为你预选候选资源，或生成督学任务清单与检查记录模板。';
      const initQuestion = {
        id: Date.now() - 1,
        type: 'user',
        content: '针对本次督学专题，请提供一下学习的素材（课程/文档/视频等）。',
        timestamp: new Date().toISOString()
      };
        const initMsg = {
          id: Date.now(),
          type: 'assistant',
          content,
          recommendations: [
            {
              thumbSrc: '/assets/课程缩略图/生成课程缩略图.png',
              thumbAlt: '校园安全制度课程缩略图',
              videoSrc: '/assets/demo1.mp4',
              title: '校园安全制度与日常巡查（30分钟）',
              bullets: ['巡查清单、记录要点、常见问题归类', '可作为现场督导与整改闭环的基础课程']
            },
            {
              thumbSrc: '/assets/课程缩略图/生成课程缩略图 (2).png',
              thumbAlt: '消防安全与演练课程缩略图',
              videoSrc: '/assets/2.mp4',
              title: '消防安全基础与演练流程（40分钟）',
              bullets: ['火灾隐患识别、疏散路径设计、演练组织', '适配“应急演练与安全教育”专项督导']
            },
            {
              thumbSrc: '/assets/课程缩略图/生成课程缩略图 (3).png',
              thumbAlt: '食品安全与卫生课程缩略图',
              videoSrc: '/assets/demo1.mp4',
              title: '食品安全与卫生规范（35分钟）',
              bullets: ['留样制度、台账规范、操作间卫生要点', '适配“食堂与供餐”专项检查与整改']
            }
          ],
          timestamp: new Date().toISOString()
        };
      return [initQuestion, initMsg];
    });
  }, [selectedCategory, note?.category]);

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
      // 将白板分组置于最前，确保白板记录在列表首位
      whiteboard: [],
      document: [],
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
      // 默认不初始化示例笔记记录，保持为空
      note: [],
      'study-result': [],
      question: [], // 添加试题操作类型
      'exam-paper': [], // 添加试卷操作类型
      'learning-plan': [], // 添加学习计划操作类型
      grading: [] // 添加阅卷工具操作类型
    };
    // 新增：现场分析工具记录
    defaultRecords['site-analysis'] = Array.isArray(defaultRecords['site-analysis']) ? defaultRecords['site-analysis'] : [];
    // 督学任务操作类型
    defaultRecords['supervision-task'] = Array.isArray(defaultRecords['supervision-task']) ? defaultRecords['supervision-task'] : [];
    
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

  // E-PBL 分类：默认生成一条白板操作记录
  useEffect(() => {
    const isEPBL = (selectedCategory === 'e_pbl' || note?.category === 'e_pbl' || selectedCategory === 'E-PBL' || note?.category === 'E-PBL');
    if (!isEPBL) return;
    setOperationRecords(prev => {
      const next = { ...prev };
      const arr = Array.isArray(prev.whiteboard) ? [...prev.whiteboard] : [];
      const hasWhiteboard = arr.some(r => r?.type === 'whiteboard' || (r?.type === 'note' && r?.subType === 'whiteboard'));
      if (!hasWhiteboard) {
        arr.unshift({
          id: `wb_${Date.now()}`,
          type: 'whiteboard',
          subType: 'whiteboard',
          title: '为什么有些人喝了咖啡反而更困?',
          // 标记为手工生成（初始化模拟为用户自建白板）
          isAIGenerated: false,
          time: new Date().toISOString()
        });
      }
      next.whiteboard = arr;
      return next;
    });
  }, [selectedCategory, note?.category]);

  // E-PBL 分类：初始化插入“EPBL教学设计”文档型操作记录（不含来源）
  useEffect(() => {
    const isEPBL = (selectedCategory === 'e_pbl' || note?.category === 'e_pbl' || selectedCategory === 'E-PBL' || note?.category === 'E-PBL');
    if (!isEPBL) return;
    setOperationRecords(prev => {
      const next = { ...prev };
      const notesArr = Array.isArray(prev.note) ? [...prev.note] : [];
      const hasEpblDesign = notesArr.some(r => (r?.subType === 'document') && String(r.title || '').includes('EPBL教学设计'));
      if (!hasEpblDesign) {
        notesArr.unshift({
          id: `epbl_design_${Date.now()}`,
          type: 'note',
          subType: 'document',
          title: 'EPBL教学设计',
          // 标记为AI生成（来自智能工具的教学设计）
          isAIGenerated: true,
          time: new Date().toISOString()
          // 不设置 source / sourceRefs，以确保卡片不显示“来源”
        });
      }
      next.note = notesArr;
      return next;
    });
  }, [selectedCategory, note?.category]);

  // 组织培训分类：默认生成一条“场景模拟”操作记录（首次进入时注入）
  useEffect(() => {
    const isOrgTraining = (
      selectedCategory === 'organizational_training' ||
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训'))
    );
    if (!isOrgTraining) return;
    setOperationRecords(prev => {
      const next = { ...prev };
      const arr = Array.isArray(prev.scenario) ? [...prev.scenario] : [];
      const hasDefault = arr.some(r => String(r.title || '').includes('默认场景') || String(r.id || '').includes('scenario_default_'));
      if (arr.length === 0 || !hasDefault) {
        arr.unshift({
          id: `scenario_default_${Date.now()}`,
          type: 'scenario',
          title: '默认场景：新教师入职培训互动演练',
          description: '示例场景，点击卡片即可在中间区域进入场景主页进行查看与运行。',
          source: '系统默认',
          time: '刚刚',
          status: 'ready',
          // 统一使用内置场景 HTML 作为缩略图/入口路径
          thumbnail: '/gen-html/ai-mental-health-scenario.html',
          isAIGenerated: true
        });
      }
      next.scenario = arr;
      return next;
    });
  }, [selectedCategory, note?.category]);

  // 组织培训分类：新增一条音频播客生成记录（首次进入时注入）
  useEffect(() => {
    const isOrgTraining = (
      selectedCategory === 'organizational_training' ||
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训'))
    );
    if (!isOrgTraining) return;
    setOperationRecords(prev => {
      const next = { ...prev };
      const audios = Array.isArray(prev.audio) ? [...prev.audio] : [];
      const title = '新教师如何突围新手村人工智能成为第三导师';
      const hasPodcast = audios.some(r => String(r.title || '') === title);
      if (!hasPodcast) {
        audios.unshift({
          id: `audio_podcast_${Date.now()}`,
          type: 'audio',
          title,
          source: 'AI生成音频播客',
          time: new Date().toLocaleString('zh-CN'),
          url: '/assets/新教师如何突围新手村_AI成第三导师.m4a',
          isAIGenerated: true
        });
      }
      next.audio = audios;
      return next;
    });
  }, [selectedCategory, note?.category]);

  useEffect(() => {
    const isOrgTraining = (
      selectedCategory === 'organizational_training' ||
      note?.category === 'organizational_training' ||
      note?.courseType === 'organizational_training' ||
      note?.source === '组织培训' ||
      (Array.isArray(note?.tags) && note.tags.includes('组织培训'))
    );
    if (!isOrgTraining) return;
    setOperationRecords(prev => {
      const next = { ...prev };
      // 初始化：记忆卡片
      const memArr = Array.isArray(prev['memory-cards']) ? [...prev['memory-cards']] : [];
      const hasMemDefault = memArr.some(r => String(r.title || '') === '记忆卡片');
      if (!hasMemDefault) {
        memArr.unshift({
          id: `memory_cards_${Date.now()}`,
          type: 'memory-cards',
          title: '记忆卡片',
          source: '基于当前数据源',
          time: new Date().toLocaleString('zh-CN'),
          isAIGenerated: true
        });
      }
      next['memory-cards'] = memArr;

      // 初始化：测验
      const quizArr = Array.isArray(prev['quiz']) ? [...prev['quiz']] : [];
      const hasQuizDefault = quizArr.some(r => String(r.title || '') === '测验');
      if (!hasQuizDefault) {
        quizArr.unshift({
          id: `quiz_${Date.now()}`,
          type: 'quiz',
          title: '测验',
          source: '基于当前数据源',
          time: new Date().toLocaleString('zh-CN'),
          isAIGenerated: true
        });
      }
      next['quiz'] = quizArr;
      const videos = Array.isArray(prev.video) ? [...prev.video] : [];
      const title = '支持下一代教育者';
      const hasVideo = videos.some(r => String(r.title || '') === title);
      if (!hasVideo) {
        videos.unshift({
          id: `video_overview_${Date.now()}`,
          type: 'video',
          title,
          source: '视频概览',
          time: new Date().toLocaleString('zh-CN'),
          url: '/assets/支持下一代教育者.mp4',
          isAIGenerated: true
        });
      }
      next.video = videos;
      return next;
    });
  }, [selectedCategory, note?.category]);

  // 培训需求管理：规范培训方案操作记录的标题与来源，并补充“学段2”
  useEffect(() => {
    const isNeedsMgmt = (selectedCategory === 'training_needs_management' || note?.category === 'training_needs_management');
    if (!isNeedsMgmt) return;
    setOperationRecords(prev => {
      const next = { ...prev };
      const arr = Array.isArray(prev['training-plan']) ? [...prev['training-plan']] : [];
      // 1) 将标题为“培训方案”的记录改名为“新教师入职培训-学段1”，并移除来源标签
      for (let i = 0; i < arr.length; i++) {
        const r = arr[i] || {};
        if (String(r.title || '') === '培训方案') {
          const { source, ...rest } = r;
          arr[i] = { ...rest, title: '新教师入职培训-学段1', isSubmitted: true, submitTime: new Date().toLocaleString('zh-CN'), isAIGenerated: true };
        }
      }
      // 若不存在任何培训方案记录，默认插入“学段1”
      if (arr.length === 0) {
        arr.push({ id: `tp-${Date.now()}`, title: '新教师入职培训-学段1', type: 'training-plan', time: new Date().toISOString(), isSubmitted: true, submitTime: new Date().toLocaleString('zh-CN'), isAIGenerated: true });
      }
      // 若仅一条，补充“学段2”
      if (arr.length < 2) {
        arr.unshift({ id: `tp-${Date.now() + 1}`, title: '新教师入职培训-学段2', type: 'training-plan', time: new Date().toISOString(), isAIGenerated: true });
      }
      // 统一为培训方案记录设置AI标记（确保旧数据也显示为AI）
      for (let i = 0; i < arr.length; i++) {
        arr[i] = { ...arr[i], isAIGenerated: true };
      }
      next['training-plan'] = arr;
      // 确保存在一条“新教师入职培训-学段1”的培训报表记录
      const dashboards = Array.isArray(prev['training-dashboard']) ? [...prev['training-dashboard']] : [];
      const hasStage1Dashboard = dashboards.some(r => String(r.title || '') === '新教师入职培训-学段1');
      if (!hasStage1Dashboard) {
        dashboards.unshift({ id: `td_${Date.now()}`, type: 'training-dashboard', title: '新教师入职培训-学段1', time: new Date().toISOString(), isAIGenerated: true, content: `<div style="padding:12px;color:#666;">默认培训报表：新教师入职培训-学段1</div>` });
      }
      next['training-dashboard'] = dashboards;
      return next;
    });
  }, [note?.id, selectedCategory]);

  // 督学分类：默认生成一条“安全专项督导（开学季）”文档记录
  useEffect(() => {
    const isSupervision = (selectedCategory === 'supervision' || note?.category === 'supervision');
    if (!isSupervision) return;
    setOperationRecords(prev => {
      const next = { ...prev };
      // 1) 删除默认文档型记录“安全专项督导（开学季）”
      const notesArr = Array.isArray(prev.note) ? prev.note.filter(r => !(r?.subType === 'document' && String(r.title || '') === '安全专项督导（开学季）')) : [];
      next.note = notesArr;
      // 2) 默认生成一条“督学任务”操作记录（避免重复）
      const tasksArr = Array.isArray(prev['supervision-task']) ? [...prev['supervision-task']] : [];
      const hasTask = tasksArr.some(r => String(r.title || '').includes('督学任务'));
      if (!hasTask) {
        tasksArr.unshift({
          id: `supervision_task_${Date.now()}`,
          type: 'supervision-task',
          title: '督学任务',
          isAIGenerated: true,
          time: new Date().toISOString(),
          content: '<div style="padding:12px;color:#666;">默认督学任务，点击进入编辑页面。</div>'
        });
      }
      next['supervision-task'] = tasksArr;
      return next;
    });
  }, [selectedCategory, note?.category]);

  // 内容查看弹窗状态
  const [showContentModal, setShowContentModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalContent, setModalContent] = useState('');

  // 主题选择弹窗状态
  const [showThemeSelectModal, setShowThemeSelectModal] = useState(false);
  const [currentActionType, setCurrentActionType] = useState(null);

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
  const [liveStreams, setLiveStreams] = useState(() => {
    // 咖啡主题：不显示直播课程，置空
    if (isCoffeeEPBL) {
      return [];
    }
    // 我的评阅：移除默认直播课程来源
    if (isMyEvaluation) {
      return [];
    }
    return [
      {
        id: 'live_001',
        title: '《课程思政融入专业课教学》研讨会',
        instructor: '张教授',
        startTime: '2025-01-25 14:00',
        endTime: '2025-01-25 16:00',
        url: 'https://live.example.com/live/123456',
        platform: '',
        participants: 156,
        status: 'live'
      }
    ];
  });

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
  const [rightPanelMemoryCardsRecord, setRightPanelMemoryCardsRecord] = useState(null);
  const [rightPanelMemoryCardsContent, setRightPanelMemoryCardsContent] = useState('');
  const [rightPanelQuizRecord, setRightPanelQuizRecord] = useState(null);
  const [rightPanelQuizContent, setRightPanelQuizContent] = useState('');
  
  // 学习计划查看状态
  const [rightPanelLearningPlanRecord, setRightPanelLearningPlanRecord] = useState(null);
  const [rightPanelLearningPlanContent, setRightPanelLearningPlanContent] = useState('');
  
  // 阅卷报告查看状态
  const [rightPanelGradingRecord, setRightPanelGradingRecord] = useState(null);
  const [rightPanelGradingContent, setRightPanelGradingContent] = useState('');
  
  // 培训方案查看状态
  const [rightPanelTrainingPlanRecord, setRightPanelTrainingPlanRecord] = useState(null);
  const [rightPanelTrainingPlanContent, setRightPanelTrainingPlanContent] = useState('');

  // 左侧培训方案查看状态（内联）
  const [leftPanelTrainingPlanRecord, setLeftPanelTrainingPlanRecord] = useState(null);
  const [leftPanelTrainingPlanContent, setLeftPanelTrainingPlanContent] = useState(null);

  // 研修成果左侧查看状态与关联数据
  const [leftPanelAchievementRecord, setLeftPanelAchievementRecord] = useState(null);
  // achievementAssociations: { [achievementId]: { linkedOperationIds: string[]|number[], attachments: any[] } }
  const [achievementAssociations, setAchievementAssociations] = useState({});
  // 研修成果评阅清单：{ [achievementId]: Array<{ id, name, attachments: Array<{id,name,url}>, score, comment }> }
  const [evaluationSubmissions, setEvaluationSubmissions] = useState({});

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

  // 课程选择联动状态（中+右联动视图）
  const [courseSelectionPhaseId, setCourseSelectionPhaseId] = useState(null);
  const [courseSelectionSelectedIds, setCourseSelectionSelectedIds] = useState([]);

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

  // 根据选择的模版初始化工具和来源
  useEffect(() => {
    if (selectedTemplate && mode === 'create') {
      // 根据模版的smartTools初始化选中的工具
      if (selectedTemplate.smartTools && selectedTemplate.smartTools.length > 0) {
        // 映射模版中的智能工具到实际的工具ID
        const templateToolMapping = {
          'AI总结': 'content_generator',
          '知识图谱': 'note_organizer',
          '学习路径规划': 'progress_tracker',
          '进度跟踪': 'progress_tracker',
          '效果评估': 'statistical_analysis',
          '反馈收集': 'survey_tool',
          '任务规划': 'task_manager',
          '时间管理': 'calendar_scheduler',
          '工作总结': 'content_generator',
          '学习笔记': 'note_organizer',
          '知识整理': 'note_organizer',
          '复习提醒': 'calendar_scheduler',
          '能力评估': 'statistical_analysis',
          '发展规划': 'progress_tracker',
          '成长记录': 'progress_tracker',
          '反思总结': 'content_generator'
        };

        const mappedTools = selectedTemplate.smartTools
          .map(toolName => templateToolMapping[toolName])
          .filter(toolId => toolId); // 过滤掉未映射的工具

        setSelectedTools(mappedTools);
      }

      // 根据模版的sourceTypes初始化默认的资料类型提示
      if (selectedTemplate.sourceTypes && selectedTemplate.sourceTypes.length > 0) {
        // 可以在这里添加一些默认的资料或者提示用户添加相应类型的资料
        console.log('模版建议的资料类型:', selectedTemplate.sourceTypes);
      }
    }
  }, [selectedTemplate, mode]);

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
    showThemeSelectModal,
    setShowThemeSelectModal,
    currentActionType,
    setCurrentActionType,
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
    rightPanelMemoryCardsRecord,
    setRightPanelMemoryCardsRecord,
    rightPanelMemoryCardsContent,
    setRightPanelMemoryCardsContent,
    rightPanelQuizRecord,
    setRightPanelQuizRecord,
    rightPanelQuizContent,
    setRightPanelQuizContent,
    
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
    
    // 培训方案查看状态
    rightPanelTrainingPlanRecord,
    setRightPanelTrainingPlanRecord,
    rightPanelTrainingPlanContent,
    setRightPanelTrainingPlanContent,

    // 左侧培训方案状态
    leftPanelTrainingPlanRecord,
    setLeftPanelTrainingPlanRecord,
    leftPanelTrainingPlanContent,
    setLeftPanelTrainingPlanContent,

    // 研修成果左侧查看与关联状态
    leftPanelAchievementRecord,
    setLeftPanelAchievementRecord,
    achievementAssociations,
    setAchievementAssociations,
    evaluationSubmissions,
    setEvaluationSubmissions,

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

    // 课程选择联动状态
    courseSelectionPhaseId,
    setCourseSelectionPhaseId,
    courseSelectionSelectedIds,
    setCourseSelectionSelectedIds,

    // 常量数据
    subtitleData,

    // 模块归属共享状态
    moduleAssignments,
    setModuleAssignments,
    
    // 笔记对象 - 为新建主题构建包含category信息的note对象
    note: mode === 'create' && !note ? {
      id: null,
      title: '',
      content: '',
      category: selectedCategory || 'personal',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } : note
  };
};
