import React, { useState, useEffect } from 'react';
import {
  Layout,
  Input,
  Button,
  Typography,
  Space,
  message,
  Upload,
  List,
  Card,
  Divider,
  Tag,
  Avatar,
  Tooltip,
  Select,
  Row,
  Col,
  Modal,
  Checkbox,
  Popconfirm,
  Dropdown,
  Progress
} from 'antd';
import MaterialAddPage from './MaterialAddPage';
import ExploreModal from './ExploreModal';
import VideoPlayer from './VideoPlayer';
import courseSelectionService from '../services/courseSelectionService';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  FileTextOutlined,
  LinkOutlined,
  SendOutlined,
  PlusOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CopyOutlined,
  ShareAltOutlined,
  RobotOutlined,
  UserOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  GlobalOutlined,
  MoreOutlined,
  EditOutlined
} from '@ant-design/icons';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const NoteEditPage = ({ onBack, onViewChange, note = null, mode = 'create' }) => {
  // 资料收集相关状态
  const [uploadedFiles, setUploadedFiles] = useState(
    mode === 'create' ? [
      { id: 1, name: '成都火锅制作工艺.pdf', type: 'application/pdf', uploadTime: '刚刚' }
    ] : note?.materials?.files || []
  );
  
  // 组织培训课程来源状态
  const [organizationalCourses, setOrganizationalCourses] = useState(
    note?.organizationalCourses || []
  );
  
  // 多选功能状态
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showMaterialDetail, setShowMaterialDetail] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [links, setLinks] = useState(
    mode === 'create' ? [
      { id: 2, url: 'https://chengdu-food.com', title: '成都美食攻略网站', addTime: '刚刚' }
    ] : note?.materials?.links || []
  );
  const [newLink, setNewLink] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMaterialAddModal, setShowMaterialAddModal] = useState(false);
  const [websiteType, setWebsiteType] = useState('normal'); // 'normal' 或 'video'
  const [websiteUrl, setWebsiteUrl] = useState('');// 文字内容相关状态
  const [textContent, setTextContent] = useState('');
  const [addedTexts, setAddedTexts] = useState(
    mode === 'create' ? [
      { id: 3, title: '成都小吃介绍', content: '成都是著名的美食之都，拥有麻婆豆腐、回锅肉、担担面、龙抄手等众多特色小吃...', addTime: '刚刚' }
    ] : note?.materials?.texts || []
  );
  
  // 课程视频相关状态
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [courseVideos, setCourseVideos] = useState(() => {
    if (mode === 'create') {
      return [
        { id: 4, title: '成都火锅制作教程', url: 'https://video.com/chengdu-hotpot', addTime: '刚刚', progress: 0 }
      ];
    } else {
      // 编辑模式下，如果有实际数据且不为空，使用实际数据；否则使用默认测试数据
      const actualVideos = note?.materials?.videos;
      if (actualVideos && actualVideos.length > 0) {
        return actualVideos;
      } else {
        // 提供默认测试数据
        return [
          { id: 101, title: '数据结构与算法基础', url: 'https://edu.example.com/course/data-structure', addTime: '2024-01-15 10:30', duration: '45分钟', instructor: '张教授', progress: 75 },
          { id: 102, title: 'React前端开发实战', url: 'https://edu.example.com/course/react-dev', addTime: '2024-01-16 14:20', duration: '60分钟', instructor: '李老师', progress: 45 },
          { id: 103, title: 'Python机器学习入门', url: 'https://edu.example.com/course/python-ml', addTime: '2024-01-17 09:15', duration: '75分钟', instructor: '王博士', progress: 90 },
          { id: 104, title: '数据库设计与优化', url: 'https://edu.example.com/course/database-design', addTime: '2024-01-18 16:45', duration: '50分钟', instructor: '陈工程师', progress: 20 },
          { id: 105, title: '云计算架构设计', url: 'https://edu.example.com/course/cloud-architecture', addTime: '2024-01-19 11:00', duration: '90分钟', instructor: '刘架构师', progress: 100 }
        ];
      }
    }
  });
  
  // 我的选课相关状态
  const [selectedCourses, setSelectedCourses] = useState(
    note?.materials?.courses || []
  );
  
  // 合并所有资料为materials数组
  const materials = [...uploadedFiles, ...addedTexts, ...courseVideos, ...links, ...selectedCourses];
  
  // 问答区域相关状态
  const [messages, setMessages] = useState(note?.messages || []);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 快捷操作相关状态
  const [quickActions] = useState([
    { key: 'summarize', label: '内容总结', icon: <FileTextOutlined /> },
    { key: 'extract', label: '关键信息提取', icon: <CopyOutlined /> },
    { key: 'translate', label: '翻译', icon: <ShareAltOutlined /> },
    { key: 'analyze', label: '深度分析', icon: <RobotOutlined /> }
  ]);
  
  // 操作结果相关状态
  const [operationResults, setOperationResults] = useState(note?.operationResults || []);
  
  // 操作面板相关状态
  const [selectedOperation, setSelectedOperation] = useState('audio'); // 当前选中的操作类型
  
  // 探索弹窗相关状态
  const [showExploreModal, setShowExploreModal] = useState(false);
  
  // 操作记录状态
  const [operationRecords, setOperationRecords] = useState(note?.operationRecords || {
    audio: [],
    video: [],
    mindmap: [],
    report: [],
    ppt: [],
    webcode: [],
    file: [],
    text: [],
    link: [],
    note: [], // 笔记类型
    'study-result': [] // 研修成果类型
  });

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

  // 嵌入式视频播放相关状态
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [currentView, setCurrentView] = useState('materials'); // 'materials' 或 'video'
  const [videoStartTime, setVideoStartTime] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [videoProgress, setVideoProgress] = useState(0);

  // 悬停状态管理
  const [hoveredItems, setHoveredItems] = useState({});

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

  // 场景模拟相关状态
  const [scenarioModalVisible, setScenarioModalVisible] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState([]);

  // 富文本编辑器相关状态
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteEditorContent, setNoteEditorContent] = useState('');

  // 处理视频时间更新和字幕显示
  const handleVideoTimeUpdate = (currentTime, duration) => {
    setVideoProgress(duration > 0 ? (currentTime / duration) * 100 : 0);
    
    // 查找当前时间对应的字幕
    const subtitle = subtitleData.find(sub => 
      currentTime >= sub.start && currentTime <= sub.end
    );
    
    if (subtitle) {
      setCurrentSubtitle(subtitle.text);
    } else {
      setCurrentSubtitle('');
    }
  };

  // 处理视频播放
  const handlePlayVideo = (material) => {
    setSelectedMaterial(material);
    setCurrentView('video');
    setVideoStartTime(0);
    message.success(`正在播放视频：${material.title}`);
  };

  // 返回资料列表
  const handleBackToMaterials = () => {
    setCurrentView('materials');
    setSelectedMaterial(null);
    setCurrentSubtitle('');
    setVideoProgress(0);
  };

  // 时间格式正则表达式 (MM:SS 或 HH:MM:SS)
  const timeRegex = /\b(\d{1,2}):(\d{2})(?::(\d{2}))?\b/g;

  // 将时间文本转换为超链接
  const convertTimeToLinks = (content) => {
    return content.replace(timeRegex, (match, minutes, seconds, hours) => {
      const totalSeconds = hours ? 
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) :
        parseInt(minutes) * 60 + parseInt(seconds);
      
      return `<a href="#" onclick="handleTimeClick(${totalSeconds})" style="color: #1890ff; text-decoration: underline; cursor: pointer;">${match}</a>`;
    });
  };

  // 处理时间超链接点击事件
  const handleTimeClick = (timeInSeconds) => {
    // 查找当前笔记关联的视频
    const currentNote = editingNote;
    if (!currentNote || !currentNote.videoId) {
      message.warning('当前笔记未关联视频，无法跳转');
      return;
    }

    console.log('调试信息 - 当前笔记:', currentNote);
    console.log('调试信息 - 查找videoId:', currentNote.videoId);
    console.log('调试信息 - materials数组:', materials);
    console.log('调试信息 - courseVideos数组:', courseVideos);

    // 查找视频资料 - 扩展查找逻辑
    let videoMaterial = materials.find(material => 
      material.type === 'video' && material.id === currentNote.videoId
    );

    // 如果在materials中没找到，尝试在courseVideos中查找
    if (!videoMaterial) {
      videoMaterial = courseVideos.find(video => 
        video.id === currentNote.videoId
      );
    }

    // 如果还是没找到，尝试更宽泛的匹配
    if (!videoMaterial) {
      videoMaterial = [...courseVideos, ...materials].find(item => 
        item.id === currentNote.videoId || 
        (item.title && currentNote.title && item.title.includes(currentNote.title.replace('【视频标注】', '')))
      );
    }

    console.log('调试信息 - 找到的视频资料:', videoMaterial);

    if (!videoMaterial) {
      message.warning('未找到关联的视频资料');
      return;
    }

    // 关闭编辑器并跳转到视频播放
    setShowNoteEditor(false);
    setEditingNote(null);
    setNoteEditorContent('');
    
    // 设置视频播放参数
    setSelectedMaterial(videoMaterial);
    setVideoStartTime(timeInSeconds);
    setCurrentView('video');
    
    message.success(`正在跳转到视频 ${Math.floor(timeInSeconds / 60)}:${(timeInSeconds % 60).toString().padStart(2, '0')}`);
  };

  // 全局暴露handleTimeClick函数
  React.useEffect(() => {
    window.handleTimeClick = handleTimeClick;
    return () => {
      delete window.handleTimeClick;
    };
  }, [editingNote, materials]);

  // 根据资源推荐场景模拟
  const getRecommendedScenarios = () => {
    // 分析当前资料内容，生成推荐场景
    const scenarios = [];
    
    // 基于文档资料推荐
    if (uploadedFiles.some(file => file.name.includes('火锅') || file.name.includes('美食'))) {
      scenarios.push({
        id: 'cooking-scenario',
        title: '餐饮服务场景模拟',
        description: '模拟餐厅服务流程，包括点餐、制作、上菜等环节的实际操作',
        icon: '🍽️',
        tags: ['餐饮服务', '客户接待', '流程管理'],
        applicableScenes: ['餐厅培训', '服务标准化', '客户体验优化']
      });
      
      scenarios.push({
        id: 'cooking-training',
        title: '烹饪技能培训',
        description: '通过实际操作演练，掌握火锅制作的关键技巧和标准流程',
        icon: '👨‍🍳',
        tags: ['技能培训', '标准化操作', '质量控制'],
        applicableScenes: ['厨师培训', '新员工入职', '技能考核']
      });
    }
    
    // 基于网站链接推荐
    if (links.some(link => link.title.includes('美食') || link.url.includes('food'))) {
      scenarios.push({
        id: 'marketing-scenario',
        title: '美食营销推广模拟',
        description: '模拟美食产品的线上线下营销推广活动，包括社交媒体运营、活动策划等',
        icon: '📱',
        tags: ['营销推广', '社交媒体', '品牌建设'],
        applicableScenes: ['市场推广', '品牌宣传', '客户获取']
      });
    }
    
    // 基于文本内容推荐
    if (addedTexts.some(text => text.content.includes('小吃') || text.content.includes('美食'))) {
      scenarios.push({
        id: 'cultural-experience',
        title: '文化体验场景',
        description: '设计沉浸式的地方美食文化体验活动，让参与者深入了解美食背后的文化内涵',
        icon: '🏮',
        tags: ['文化传承', '体验设计', '教育培训'],
        applicableScenes: ['文化教育', '旅游体验', '团队建设']
      });
    }
    
    // 基于视频资源推荐
    if (courseVideos.some(video => video.title.includes('教程') || video.title.includes('制作'))) {
      scenarios.push({
        id: 'skill-assessment',
        title: '技能评估与认证',
        description: '建立标准化的技能评估体系，通过实际操作考核员工的专业技能水平',
        icon: '🏆',
        tags: ['技能评估', '认证体系', '标准化'],
        applicableScenes: ['员工考核', '技能认证', '培训效果评估']
      });
    }
    
    // 通用场景推荐
    scenarios.push({
      id: 'team-collaboration',
      title: '团队协作训练',
      description: '通过模拟真实工作场景，提升团队成员之间的协作能力和沟通效率',
      icon: '🤝',
      tags: ['团队协作', '沟通技巧', '效率提升'],
      applicableScenes: ['团队建设', '新员工融入', '跨部门协作']
    });
    
    scenarios.push({
      id: 'customer-service',
      title: '客户服务场景',
      description: '模拟各种客户服务情况，训练员工的应变能力和服务技巧',
      icon: '💬',
      tags: ['客户服务', '应变能力', '服务质量'],
      applicableScenes: ['客服培训', '投诉处理', '服务标准化']
    });
    
    scenarios.push({
      id: 'crisis-management',
      title: '应急处理演练',
      description: '模拟突发情况和紧急事件，训练员工的应急处理能力和危机管理技巧',
      icon: '🚨',
      tags: ['应急处理', '危机管理', '安全培训'],
      applicableScenes: ['安全培训', '应急演练', '风险管控']
    });
    
    return scenarios;
  };

  // AI自动创建场景模拟
  const createNewScenario = () => {
    // 基于当前资料内容智能生成场景
    const scenarioTemplates = [
      {
        title: '实战操作演练',
        description: '基于您的资料内容，设计实际操作场景，让学员在模拟环境中练习关键技能',
        icon: '⚡',
        tags: ['实战演练', '技能训练', '操作规范'],
        applicableScenes: ['技能培训', '标准化操作', '质量控制']
      },
      {
        title: '问题解决训练',
        description: '模拟常见问题和挑战情况，训练学员的分析判断和解决问题的能力',
        icon: '🧩',
        tags: ['问题解决', '逻辑思维', '应变能力'],
        applicableScenes: ['能力提升', '思维训练', '实际应用']
      },
      {
        title: '团队协作场景',
        description: '设计需要多人配合的工作场景，提升团队协作和沟通协调能力',
        icon: '👥',
        tags: ['团队协作', '沟通技巧', '协调配合'],
        applicableScenes: ['团队建设', '协作训练', '沟通提升']
      },
      {
        title: '客户互动模拟',
        description: '模拟与客户的各种互动场景，提升服务意识和客户满意度',
        icon: '🤝',
        tags: ['客户服务', '沟通技巧', '服务质量'],
        applicableScenes: ['服务培训', '客户关系', '满意度提升']
      },
      {
        title: '创新思维训练',
        description: '通过开放性场景设计，激发学员的创新思维和创造力',
        icon: '💡',
        tags: ['创新思维', '创造力', '思维拓展'],
        applicableScenes: ['创新培训', '思维开发', '能力拓展']
      }
    ];

    // 随机选择一个模板并个性化
    const randomTemplate = scenarioTemplates[Math.floor(Math.random() * scenarioTemplates.length)];
    
    // 基于当前资料内容进行个性化调整
    let personalizedTitle = randomTemplate.title;
    let personalizedDescription = randomTemplate.description;
    
    // 根据上传的文件内容调整
    if (uploadedFiles.length > 0) {
      const fileKeywords = uploadedFiles.map(file => file.name).join('');
      if (fileKeywords.includes('火锅') || fileKeywords.includes('美食')) {
        personalizedTitle = `餐饮${randomTemplate.title}`;
        personalizedDescription = personalizedDescription.replace('您的资料内容', '餐饮行业相关内容');
      } else if (fileKeywords.includes('培训') || fileKeywords.includes('教学')) {
        personalizedTitle = `培训${randomTemplate.title}`;
        personalizedDescription = personalizedDescription.replace('您的资料内容', '培训教学相关内容');
      }
    }
    
    // 根据文本内容调整
    if (addedTexts.length > 0) {
      const textKeywords = addedTexts.map(text => text.content).join('');
      if (textKeywords.includes('管理') || textKeywords.includes('运营')) {
        personalizedTitle = `管理${randomTemplate.title}`;
        personalizedDescription = personalizedDescription.replace('学员', '管理人员');
      }
    }

    return {
      id: `ai-created-${Date.now()}`,
      title: personalizedTitle,
      description: personalizedDescription,
      icon: randomTemplate.icon,
      tags: [...randomTemplate.tags, 'AI生成'],
      applicableScenes: randomTemplate.applicableScenes
    };
  };

  // 新建笔记功能
  const handleCreateNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: '新建组织学习笔记',
      source: '组织培训',
      time: '刚刚',
      type: 'note',
      content: '<p>请在此处编写您的学习笔记内容...</p>',
      tags: ['组织培训'],
      // 模拟的学习时间信息
      learningSchedule: {
        startTime: '12/25 14:00',
        endTime: '12/25 17:00',
        duration: '3小时'
      }
    };
    
    setOperationRecords(prev => ({
      ...prev,
      note: [newNote, ...prev.note]
    }));
    
    message.success('新建组织学习笔记已添加到操作记录');
  };

  // 生成基于实际来源的摘要内容
  const generateSummaryContent = () => {
    const allSources = [];
    
    // 收集所有资料来源
    if (uploadedFiles.length > 0) {
      allSources.push(`文档资料：${uploadedFiles.map(file => file.name).join('、')}`);
    }
    
    if (links.length > 0) {
      allSources.push(`网站链接：${links.map(link => link.title || link.url).join('、')}`);
    }
    
    if (addedTexts.length > 0) {
      allSources.push(`文本内容：${addedTexts.map(text => text.title).join('、')}`);
    }
    
    if (courseVideos.length > 0) {
      allSources.push(`视频资源：${courseVideos.map(video => video.title).join('、')}`);
    }
    
    if (organizationalCourses.length > 0) {
      allSources.push(`组织培训：${organizationalCourses.map(course => course.title).join('、')}`);
    }
    
    // 如果没有任何资料，返回默认提示
    if (allSources.length === 0) {
      return '暂无资料来源，请先添加文档、链接、文本或视频资源，系统将基于这些内容自动生成智能摘要。';
    }
    
    // 基于实际来源生成摘要
    const sourceTypes = [];
    if (uploadedFiles.length > 0) sourceTypes.push('文档资料');
    if (links.length > 0) sourceTypes.push('网站资源');
    if (addedTexts.length > 0) sourceTypes.push('文本内容');
    if (courseVideos.length > 0) sourceTypes.push('视频教程');
    if (organizationalCourses.length > 0) sourceTypes.push('组织培训');
    
    return `已收集的资料包含${sourceTypes.join('、')}等多种类型的信息源。${allSources.join('；')}。这些资料为您提供了全面的信息基础，涵盖了相关主题的多个维度和视角，有助于深入理解和学习相关内容。`;
  };

  // 处理探索功能
  const handleExplore = (exploreData) => {
    const { query, source } = exploreData;
    
    // 模拟探索结果
    const mockResults = {
      web: [
        {
          id: Date.now() + 1,
          title: `关于"${query}"的网络资源`,
          url: `https://search.example.com/q=${encodeURIComponent(query)}`,
          content: `通过网络搜索找到的关于"${query}"的相关内容...`,
          addTime: '刚刚',
          source: 'Web搜索'
        }
      ],
      'google-drive': [
        {
          id: Date.now() + 2,
          title: `Google云端硬盘中的"${query}"相关文档`,
          url: `https://drive.google.com/search?q=${encodeURIComponent(query)}`,
          content: `从Google云端硬盘中找到的关于"${query}"的文档...`,
          addTime: '刚刚',
          source: 'Google云端硬盘'
        }
      ]
    };
    
    // 根据选择的来源添加结果到对应的资料列表
    const results = mockResults[source] || [];
    
    if (results.length > 0) {
      // 添加到链接列表
      setLinks(prev => [...results.map(r => ({
        id: r.id,
        url: r.url,
        title: r.title,
        addTime: r.addTime
      })), ...prev]);
      
      // 添加到文本内容列表
      setAddedTexts(prev => [...results.map(r => ({
        id: r.id + 1000,
        title: r.title,
        content: r.content,
        addTime: r.addTime,
        source: r.source
      })), ...prev]);
      
      message.success(`成功从${source === 'web' ? 'Web' : 'Google云端硬盘'}探索到${results.length}条相关资源`);
    } else {
      message.info('未找到相关资源，请尝试其他关键词');
    }
  };

  // 操作按钮点击处理函数
  const handleOperationClick = (operationType) => {
    const operationTitles = {
      audio: '音频概览',
      video: '视频概览', 
      mindmap: '思维导图',
      report: '分析报告',
      ppt: 'PPT演示',
      webcode: '网页代码',
      scenario: '场景模拟',
      'training-plan': '培训方案',
      schedule: '课表',
      participants: '参训人员清单',
      note: '笔记'
    };

    // 如果是场景模拟，显示弹窗
    if (operationType === 'scenario') {
      setScenarioModalVisible(true);
      return;
    }

    // 如果是笔记类型，创建可编辑的笔记
    if (operationType === 'note') {
      const newRecord = {
        id: Date.now(),
        title: '新建笔记',
        source: '手动创建',
        time: '刚刚',
        type: 'note',
        content: '<p>请在此处编写您的笔记内容...</p>'
      };

      setOperationRecords(prev => ({
        ...prev,
        note: [newRecord, ...prev.note]
      }));

      message.success('新建笔记已添加到操作记录');
      return;
    }

    // 计算所有资料的总数
    const totalMaterials = uploadedFiles.length + addedTexts.length + courseVideos.length + links.length;

    const newRecord = {
      id: Date.now(),
      title: `基于${totalMaterials}个资料生成${operationTitles[operationType]}`,
      source: `${totalMaterials}个来源`,
      time: '刚刚',
      type: operationType
    };

    setOperationRecords(prev => ({
      ...prev,
      [operationType]: [newRecord, ...prev[operationType]]
    }));

    message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
  };

  // 保存AI回复到笔记
  const handleSaveToNote = (content) => {
    const newRecord = {
      id: Date.now(),
      title: `AI问答笔记 - ${new Date().toLocaleString()}`,
      source: 'AI智能问答',
      time: '刚刚',
      type: 'report',
      content: content
    };

    setOperationRecords(prev => ({
      ...prev,
      report: [newRecord, ...prev.report]
    }));

    message.success('AI回复已保存到笔记');
  };

  // 处理更多操作菜单点击
  const handleMoreAction = (action, record) => {
    switch (action) {
      case 'markStudyResult':
        // 标记研修成果 - 直接标记，不弹对话框
        setOperationRecords(prev => ({
          ...prev,
          note: prev.note.map(note => 
            note.id === record.id 
              ? { 
                  ...note, 
                  isStudyResult: true,
                  studyResultInfo: {
                    markTime: new Date().toISOString(),
                    resultType: '学习成果',
                    importance: 'high'
                  },
                  tags: [...(note.tags || []), '研修成果']
                }
              : note
          )
        }));
        
        message.success(`笔记"${record.title}"已标记为研修成果！`);
        break;
      case 'unmarkStudyResult':
        // 取消研修成果标记
        setOperationRecords(prev => ({
          ...prev,
          note: prev.note.map(note => 
            note.id === record.id 
              ? { 
                  ...note, 
                  isStudyResult: false,
                  studyResultInfo: undefined,
                  tags: (note.tags || []).filter(tag => tag !== '研修成果')
                }
              : note
          )
        }));
        
        message.success(`已取消笔记"${record.title}"的研修成果标记`);
        break;
      case 'convertToSource':
        // 将操作记录转换为资料来源
        const newMaterial = {
          id: Date.now(),
          title: record.title,
          content: record.content || `来源于操作记录：${record.title}`,
          addTime: '刚刚',
          source: record.source || '操作记录转换'
        };
        
        // 根据记录类型添加到对应的资料数组
        if (record.type === 'report' || record.type === 'mindmap') {
          setAddedTexts(prev => [newMaterial, ...prev]);
        } else if (record.type === 'video' || record.type === 'audio') {
          setCourseVideos(prev => [{
            ...newMaterial,
            url: record.url || 'https://converted-from-record.com'
          }, ...prev]);
        } else {
          setAddedTexts(prev => [newMaterial, ...prev]);
        }
        
        message.success(`已将“${record.title}”转换为来源并保存到资料`);
        break;
      case 'delete':
        // 从操作记录中删除该记录
        setOperationRecords(prev => {
          const newRecords = { ...prev };
          Object.keys(newRecords).forEach(type => {
            newRecords[type] = newRecords[type].filter(r => r.id !== record.id);
          });
          return newRecords;
        });
        message.success(`已删除“${record.title}”`);
        break;
      default:
        break;
    }
  };

  // 获取更多操作菜单项
  const getMoreMenuItems = (record) => {
    const commonItems = [
      {
        key: 'delete',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🗑️</span>
            <span>删除</span>
          </div>
        ),
        onClick: ({ domEvent }) => {
          domEvent?.stopPropagation();
          handleMoreAction('delete', record);
        }
      }
    ];

    // 笔记类型添加标记研修成果选项
    if (record.type === 'note') {
      return [
        {
          key: record.isStudyResult ? 'unmarkStudyResult' : 'markStudyResult',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>
                {record.isStudyResult ? '❌' : '🏆'}
              </span>
              <span>
                {record.isStudyResult ? '取消研修成果' : '标记研修成果'}
              </span>
            </div>
          ),
          onClick: ({ domEvent }) => {
            domEvent?.stopPropagation();
            handleMoreAction(
              record.isStudyResult ? 'unmarkStudyResult' : 'markStudyResult', 
              record
            );
          }
        },
        ...commonItems
      ];
    }

    // 报告类型添加额外选项
    if (record.type === 'report') {
      return [
        {
          key: 'convertToSource',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📋</span>
              <span>转换为来源</span>
            </div>
          ),
          onClick: ({ domEvent }) => {
            domEvent?.stopPropagation();
            handleMoreAction('convertToSource', record);
          }
        },
        ...commonItems
      ];
    }

    return commonItems;
  };

  // 处理时间超链接点击，跳转到视频对应时间点
  const handleRecordTimeClick = (record) => {
    if (record.videoId && record.annotationTime !== undefined) {
      // 查找对应的视频资料
      const videoMaterial = [...courseVideos, ...materials].find(
        material => material.id === record.videoId || 
        (material.type === 'video' && material.title === record.title?.replace('【视频标注】', ''))
      );
      
      if (videoMaterial) {
        // 设置视频数据并打开播放器
        setCurrentVideo({
          ...videoMaterial,
          startTime: record.annotationTime // 设置起始播放时间
        });
        setShowVideoPlayer(true);
        message.success(`正在跳转到视频 ${Math.floor(record.annotationTime / 60)}:${String(Math.floor(record.annotationTime % 60)).padStart(2, '0')} 时刻`);
      } else {
        message.warning('未找到对应的视频文件');
      }
    }
  };

  // 处理记录点击打开
  const handleRecordClick = (record) => {
    setCurrentRecord(record);
    
    // 如果是笔记类型，打开富文本编辑器
    if (record.type === 'note') {
      setEditingNote(record);
      const initialContent = record.content || '<p>请在此处编写您的笔记内容...</p>';
      // 立即应用时间超链接转换
      const contentWithLinks = convertTimeToLinks(initialContent);
      setNoteEditorContent(contentWithLinks);
      setShowNoteEditor(true);
      return;
    }
    
    // 根据记录类型生成不同的内容
    switch (record.type) {
      case 'report':
        setModalContent(`
          <div style="padding: 20px; line-height: 1.6;">
            <h2 style="color: #1890ff; margin-bottom: 20px;">${record.title}</h2>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <strong>📊 数据来源：</strong>${record.source}<br>
              <strong>⏰ 生成时间：</strong>${record.time}
            </div>
            <h3 style="color: #333; margin: 20px 0 10px 0;">📈 分析概述</h3>
            <p>基于收集的资料，本报告对相关内容进行了深入分析。通过数据挖掘和模式识别，我们发现了以下关键洞察...</p>
            <h3 style="color: #333; margin: 20px 0 10px 0;">🔍 主要发现</h3>
            <ul>
              <li>关键趋势分析显示出明显的增长模式</li>
              <li>数据相关性分析揭示了重要的关联因素</li>
              <li>预测模型表明未来发展的潜在方向</li>
            </ul>
            <h3 style="color: #333; margin: 20px 0 10px 0;">💡 建议与结论</h3>
            <p>综合分析结果，建议采取以下措施以优化效果和提升价值...</p>
          </div>
        `);
        break;
      case 'audio':
        setModalContent(`
          <div style="padding: 20px; text-align: center;">
            <h2 style="color: #1890ff; margin-bottom: 30px;">${record.title}</h2>
            <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); padding: 30px; border-radius: 16px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);">
              <div style="font-size: 64px; margin-bottom: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">🎵</div>
              <p style="font-size: 18px; color: #1890ff; margin: 0; font-weight: 500;">音频播放器</p>
            </div>
            <div style="background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; box-shadow: 0 6px 20px rgba(0,0,0,0.3);">
              <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 15px;">
                <button style="background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%); color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; font-size: 18px; box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3); transition: all 0.2s ease;">▶</button>
                <div style="flex: 1; height: 6px; background: #444; border-radius: 3px; position: relative; overflow: hidden;">
                  <div style="width: 30%; height: 100%; background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%); border-radius: 3px; box-shadow: 0 0 8px rgba(24, 144, 255, 0.5);"></div>
                </div>
                <span style="color: #fff; font-size: 14px; font-family: monospace;">02:30 / 05:00</span>
              </div>
              <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 15px;">
                <button style="background: transparent; color: #ccc; border: none; cursor: pointer; font-size: 20px; padding: 5px;">⏮</button>
                <button style="background: transparent; color: #ccc; border: none; cursor: pointer; font-size: 20px; padding: 5px;">⏸</button>
                <button style="background: transparent; color: #ccc; border: none; cursor: pointer; font-size: 20px; padding: 5px;">⏭</button>
                <button style="background: transparent; color: #ccc; border: none; cursor: pointer; font-size: 16px; padding: 5px;">🔊</button>
              </div>
              <div style="text-align: center;">
                <span style="color: #999; font-size: 14px;">${record.source}</span>
              </div>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #1890ff;">
              <div style="text-align: left;">
                <p style="margin: 0 0 10px 0; color: #333;"><strong>📝 内容摘要：</strong>基于${record.source}生成的音频概览</p>
                <p style="margin: 0 0 10px 0; color: #333;"><strong>⏱️ 时长：</strong>约 5 分钟</p>
                <p style="margin: 0; color: #333;"><strong>🎯 重点内容：</strong>核心要点提炼和关键信息总结，建议使用耳机获得更好的收听体验</p>
              </div>
            </div>
          </div>
        `);
        break;
      case 'video':
        setModalContent(`
          <div style="padding: 20px;">
            <h2 style="color: #1890ff; margin-bottom: 30px; text-align: center;">${record.title}</h2>
            <div style="background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); border-radius: 12px; margin-bottom: 25px; position: relative; aspect-ratio: 16/9; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; text-align: center;">
                <div style="font-size: 72px; margin-bottom: 15px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">🎬</div>
                <button style="background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%); color: white; border: 3px solid rgba(255,255,255,0.8); border-radius: 50%; width: 80px; height: 80px; cursor: pointer; font-size: 28px; backdrop-filter: blur(10px); transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(255,255,255,0.2);">▶</button>
              </div>
              <div style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 20px; backdrop-filter: blur(10px);">
                <span style="color: white; font-size: 12px; font-weight: 500;">HD 1080p</span>
              </div>
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 20px 15px 15px; backdrop-filter: blur(5px);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                  <button style="background: transparent; color: white; border: none; cursor: pointer; font-size: 16px; padding: 4px;">⏮</button>
                  <button style="background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; padding: 6px 8px;">⏸</button>
                  <button style="background: transparent; color: white; border: none; cursor: pointer; font-size: 16px; padding: 4px;">⏭</button>
                  <span style="color: white; font-size: 13px; font-family: monospace; margin-left: 8px;">00:00 / 08:00</span>
                  <div style="flex: 1; height: 5px; background: rgba(255,255,255,0.2); border-radius: 3px; margin: 0 10px; overflow: hidden;">
                    <div style="width: 0%; height: 100%; background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%); border-radius: 3px; box-shadow: 0 0 8px rgba(24, 144, 255, 0.6);"></div>
                  </div>
                  <button style="background: transparent; color: white; border: none; cursor: pointer; font-size: 16px; padding: 4px;">🔊</button>
                  <button style="background: transparent; color: white; border: none; cursor: pointer; font-size: 16px; padding: 4px;">⛶</button>
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 20px;">
              <div style="flex: 1; background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #1890ff;">
                <h4 style="color: #333; margin: 0 0 10px 0; font-size: 14px;">📹 视频信息</h4>
                <p style="color: #666; line-height: 1.6; margin: 0; font-size: 13px;">分辨率: 1920×1080<br>时长: 8分钟<br>来源: ${record.source}</p>
              </div>
              <div style="flex: 2; background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #52c41a;">
                <h4 style="color: #333; margin: 0 0 10px 0; font-size: 14px;">📝 内容概述</h4>
                <p style="color: #666; line-height: 1.6; margin: 0; font-size: 13px;">这是基于您上传资料生成的视频概览内容，包含了可视化的数据展示、详细解说和互动演示。视频采用高清画质，支持全屏播放和字幕显示。</p>
              </div>
            </div>
          </div>
        `);
        break;
      case 'mindmap':
        setModalContent(`
          <div style="padding: 20px; text-align: center;">
            <h2 style="color: #1890ff; margin-bottom: 20px;">${record.title}</h2>
            <div style="background: #f0f8ff; padding: 20px; border-radius: 12px;">
              <div style="font-size: 48px; margin-bottom: 15px;">🧠</div>
              <p style="color: #666; margin-bottom: 20px;">思维导图内容</p>
              <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-height: 400px;">
                <svg width="100%" height="400" style="border: 1px solid #e8e8e8; border-radius: 4px;">
                  <!-- 中心节点 -->
                  <circle cx="300" cy="200" r="40" fill="#1890ff" />
                  <text x="300" y="205" text-anchor="middle" fill="white" font-size="12">核心主题</text>
                  
                  <!-- 分支节点 -->
                  <circle cx="150" cy="100" r="25" fill="#52c41a" />
                  <text x="150" y="105" text-anchor="middle" fill="white" font-size="10">要点1</text>
                  <line x1="275" y1="175" x2="175" y2="125" stroke="#1890ff" stroke-width="2" />
                  
                  <circle cx="450" cy="100" r="25" fill="#52c41a" />
                  <text x="450" y="105" text-anchor="middle" fill="white" font-size="10">要点2</text>
                  <line x1="325" y1="175" x2="425" y2="125" stroke="#1890ff" stroke-width="2" />
                  
                  <circle cx="150" cy="300" r="25" fill="#52c41a" />
                  <text x="150" y="305" text-anchor="middle" fill="white" font-size="10">要点3</text>
                  <line x1="275" y1="225" x2="175" y2="275" stroke="#1890ff" stroke-width="2" />
                  
                  <circle cx="450" cy="300" r="25" fill="#52c41a" />
                  <text x="450" y="305" text-anchor="middle" fill="white" font-size="10">要点4</text>
                  <line x1="325" y1="225" x2="425" y2="275" stroke="#1890ff" stroke-width="2" />
                  
                  <!-- 子节点 -->
                  <circle cx="80" cy="50" r="15" fill="#faad14" />
                  <text x="80" y="55" text-anchor="middle" fill="white" font-size="8">细节</text>
                  <line x1="135" y1="85" x2="95" y2="65" stroke="#52c41a" stroke-width="1" />
                  
                  <circle cx="520" cy="50" r="15" fill="#faad14" />
                  <text x="520" y="55" text-anchor="middle" fill="white" font-size="8">细节</text>
                  <line x1="465" y1="85" x2="505" y2="65" stroke="#52c41a" stroke-width="1" />
                </svg>
                <div style="margin-top: 15px; text-align: left; color: #333;">
                  <p><strong>🎯 思维导图说明：</strong>基于${record.source}构建的知识结构图</p>
                  <p><strong>📊 节点数量：</strong>主要节点 4 个，子节点 8 个</p>
                  <p><strong>🔗 关联关系：</strong>展示了核心概念间的逻辑关系</p>
                </div>
              </div>
            </div>
          </div>
        `);
        break;
      default:
        setModalContent(`
          <div style="padding: 20px; text-align: center;">
            <h2 style="color: #1890ff; margin-bottom: 20px;">${record.title}</h2>
            <p>暂无预览内容</p>
          </div>
        `);
    }
    
    setShowContentModal(true);
  };

  // 文件上传处理
  const handleFileUpload = (info) => {
    const { status, originFileObj, response } = info.file;
    
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
      const isBilibili = websiteUrl.includes('bilibili.com') || websiteUrl.includes('b23.tv');
      const isXiaohongshu = websiteUrl.includes('xiaohongshu.com') || websiteUrl.includes('xhslink.com');
      
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

     // 简单的URL验证
     const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/.*)?$/;
     if (!urlPattern.test(videoUrl)) {
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
     // 检查是否已经添加过该课程
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
     
     // 同时添加到操作记录中
     const newRecord = {
       id: Date.now(),
       title: course.title,
       type: 'course',
       source: `选课 - ${course.instructor}`,
       time: new Date().toLocaleString(),
       content: course.description || `课程：${course.title}，讲师：${course.instructor}，时长：${course.duration}`
     };

     setOperationRecords(prev => ({
       ...prev,
       course: [...(prev.course || []), newRecord]
     }));

     message.success(`已添加课程：${course.title}`);
   };

   // 删除课程视频
   const handleDeleteVideo = (videoId) => {
     setCourseVideos(prev => prev.filter(video => video.id !== videoId));
     message.success('课程视频删除成功');
   };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `基于您上传的资料，我理解您的问题是："${inputMessage}"。根据现有资料分析，我建议...`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  // 执行快捷操作
  const handleQuickAction = (actionKey) => {
    const action = quickActions.find(a => a.key === actionKey);
    const result = {
      id: Date.now(),
      action: action.label,
      content: `${action.label}的结果内容...`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    setOperationResults(prev => [result, ...prev]);
    message.success(`${action.label}操作完成`);
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
        ...uploadedFiles.map(file => `file-${file.id}`),
        ...addedTexts.map(text => `text-${text.id}`),
        ...courseVideos.map(video => `video-${video.id}`),
        ...links.map(link => `link-${link.id}`),
        ...organizationalCourses.map(course => `course-${course.id}`)
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
      }
    });
    setSelectedMaterials([]);
    message.success(`已删除 ${selectedMaterials.length} 个资料`);
  };

  const handleViewMaterial = (material, type) => {
    // 如果是视频类型，打开嵌入式视频播放器
    if (type === 'video') {
      handlePlayVideo(material);
      return;
    }
    
    // 其他类型生成单个资料的智能笔记
    const smartNote = generateSmartNote(material, type);
    setSmartNotes([smartNote]);
    setShowSmartNotesModal(true);
  };

  // 预览资料功能
  const handlePreviewMaterial = (material, type) => {
    setPreviewData(material);
    setPreviewType(type);
    setShowPreviewModal(true);
  };

  // 智能笔记生成功能
  const generateSmartNote = (material, type) => {
    let smartNote = {
      id: Date.now(),
      type: type,
      title: material.title || material.name,
      originalData: material,
      summary: '',
      keyPoints: [],
      tags: [],
      createdAt: new Date().toLocaleString()
    };

    // 根据不同类型生成智能摘要
    switch (type) {
      case 'file':
        smartNote.summary = `文件资料：${material.name}，类型：${material.type || '未知'}。建议进一步分析文件内容以提取关键信息。`;
        smartNote.keyPoints = ['文件已上传', '待内容分析', '可用于AI问答'];
        smartNote.tags = ['文件', material.type || '未知类型'];
        break;
      
      case 'video':
        smartNote.summary = `视频资料：${material.title}。视频内容可能包含重要的学习材料，建议观看并记录要点。`;
        smartNote.keyPoints = ['视频已添加', '包含音视频内容', '适合深度学习'];
        smartNote.tags = ['视频', '学习资料'];
        if (material.url.includes('bilibili.com')) {
          smartNote.tags.push('B站');
        } else if (material.url.includes('youtube.com')) {
          smartNote.tags.push('YouTube');
        }
        break;
      
      case 'link':
        smartNote.summary = `网站链接：${material.title}。网页内容可能包含有价值的信息，建议浏览并提取关键内容。`;
        smartNote.keyPoints = ['网站已添加', '可在线访问', '内容待分析'];
        smartNote.tags = ['网站', '在线资源'];
        break;
      
      case 'text':
        const wordCount = material.content.length;
        const hasMarkdown = /[*_`#\[\]]/g.test(material.content);
        smartNote.summary = `文字内容：${material.title}，共${wordCount}字。${hasMarkdown ? '包含格式化内容，' : ''}可直接用于AI分析和问答。`;
        smartNote.keyPoints = [
          `文字长度：${wordCount}字`,
          hasMarkdown ? '包含Markdown格式' : '纯文本内容',
          '可直接分析'
        ];
        smartNote.tags = ['文字', hasMarkdown ? 'Markdown' : '纯文本'];
        break;
      
      case 'course':
        smartNote.summary = `组织培训课程：${material.title}。${material.description || ''}培训类型：${material.trainingType}，学习时长：${material.duration}。`;
        smartNote.keyPoints = [
          `培训类型：${material.trainingType}`,
          `学习时长：${material.duration}`,
          `课程状态：${material.status}`,
          '来源：组织培训'
        ];
        smartNote.tags = ['组织培训', material.trainingType, '课程'];
        break;
    }

    return smartNote;
  };

  // 批量生成智能笔记
  const handleGenerateSmartNotes = () => {
    const notes = [];
    
    // 为所有资料生成智能笔记
    uploadedFiles.forEach(file => {
      notes.push(generateSmartNote(file, 'file'));
    });
    
    addedTexts.forEach(text => {
      notes.push(generateSmartNote(text, 'text'));
    });
    
    courseVideos.forEach(video => {
      notes.push(generateSmartNote(video, 'video'));
    });
    
    links.forEach(link => {
      notes.push(generateSmartNote(link, 'link'));
    });

    organizationalCourses.forEach(course => {
      notes.push(generateSmartNote(course, 'course'));
    });

    if (notes.length > 0) {
      setSmartNotes(notes);
      setShowSmartNotesModal(true);
      message.success(`已生成 ${notes.length} 条智能笔记`);
    } else {
      message.info('暂无资料可生成智能笔记');
    }
  };

  // 渲染文件预览内容
  const renderFilePreview = (file) => {
    const fileType = file.type || file.name.split('.').pop().toLowerCase();
    
    if (fileType.includes('pdf') || fileType === 'pdf') {
      return (
        <div style={{ height: '500px', width: '100%' }}>
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(file.url || '#')}&embedded=true`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title={file.name}
          />
          <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
            PDF预览 - {file.name}
          </div>
        </div>
      );
    }
    
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <FileTextOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
        <div>
          <h3>{file.name}</h3>
          <p>文件类型: {fileType}</p>
          <p>暂不支持此文件类型的在线预览</p>
        </div>
      </div>
    );
  };

  // 渲染视频预览内容
  const renderVideoPreview = (video) => {
    const getVideoEmbedUrl = (url) => {
      if (url.includes('bilibili.com')) {
        const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
        if (bvMatch) {
          return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&autoplay=0`;
        }
      }
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId[1]}`;
        }
      }
      return url;
    };

    const embedUrl = getVideoEmbedUrl(video.url);
    
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>{video.title}</h3>
          <p style={{ color: '#666' }}>视频链接: <a href={video.url} target="_blank" rel="noopener noreferrer">{video.url}</a></p>
        </div>
        <div style={{ height: '400px', width: '100%' }}>
          <iframe
            src={embedUrl}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
            title={video.title}
            allowFullScreen
          />
        </div>
      </div>
    );
  };

  // 渲染链接预览内容
  const renderLinkPreview = (link) => {
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>{link.title}</h3>
          <p style={{ color: '#666' }}>网站地址: <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></p>
        </div>
        <div style={{ height: '500px', width: '100%' }}>
          <iframe
            src={link.url}
            style={{ width: '100%', height: '100%', border: '1px solid #d9d9d9', borderRadius: '8px' }}
            title={link.title}
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
          网站预览 - 如无法显示，请点击上方链接直接访问
        </div>
      </div>
    );
  };

  // 渲染文字预览内容
  const renderTextPreview = (text) => {
    // 简单的 Markdown 渲染
    const renderMarkdown = (content) => {
      let html = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
        .replace(/`(.*?)`/g, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px;">$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #1890ff;">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 4px;" />')
        .replace(/\n/g, '<br />');
      
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    };

    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>{text.title}</h3>
          <p style={{ color: '#666' }}>添加时间: {text.addTime}</p>
        </div>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fafafa', 
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          maxHeight: '400px',
          overflow: 'auto',
          lineHeight: '1.6'
        }}>
          {renderMarkdown(text.content)}
        </div>
      </div>
    );
  };

  // 计算选中状态
  const allMaterials = [
    ...uploadedFiles.map(file => `file-${file.id}`),
    ...addedTexts.map(text => `text-${text.id}`),
    ...courseVideos.map(video => `video-${video.id}`),
    ...links.map(link => `link-${link.id}`)
  ];
  const isAllSelected = allMaterials.length > 0 && selectedMaterials.length === allMaterials.length;
  const isIndeterminate = selectedMaterials.length > 0 && selectedMaterials.length < allMaterials.length;



  // 返回
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.close();
    }
  };

  return (
    <>
      <div style={{ display: 'flex', height: 'calc(100vh - 64px)', background: '#f5f5f5' }}>
      {/* 左侧区域：根据当前视图显示资料收集或视频播放 */}
      <div style={{ 
        flex: currentView === 'video' ? 5 : 2.5, 
        background: '#fff', 
        margin: '16px 0 16px 16px', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'flex 0.3s ease'
      }}>
        {currentView === 'materials' ? (
          // 资料收集模式
          <div style={{ padding: '20px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
                  {mode === 'create' ? '📚 资料收集' : mode === 'edit' ? '📝 编辑笔记' : '👁️ 查看笔记'}
                </Title>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {selectedMaterials.length > 0 && (
                  <Popconfirm
                    title="确认删除"
                    description={`确定要删除选中的 ${selectedMaterials.length} 个资料吗？`}
                    onConfirm={handleBatchDelete}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button 
                      type="text" 
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                    >
                      删除选中
                    </Button>
                  </Popconfirm>
                )}
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
                onClick={() => {
                  setShowMaterialAddModal(true);
                }}
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
                <span style={{ color: '#495057', fontSize: '14px' }}>选择所有来源</span>
                <Tooltip title="重新加载示例数据">
                  <Button 
                    type="text" 
                    size="small"
                    icon={<RobotOutlined />}
                    onClick={() => {
                      // 初始化视频课程数据
                      setCourseVideos([
                        { id: 101, title: '数据结构与算法基础', url: 'https://edu.example.com/course/data-structure', addTime: '2024-01-15 10:30', duration: '45分钟', instructor: '张教授', progress: 75 },
                        { id: 102, title: 'React前端开发实战', url: 'https://edu.example.com/course/react-dev', addTime: '2024-01-16 14:20', duration: '60分钟', instructor: '李老师', progress: 45 },
                        { id: 103, title: 'Python机器学习入门', url: 'https://edu.example.com/course/python-ml', addTime: '2024-01-17 09:15', duration: '75分钟', instructor: '王博士', progress: 90 },
                        { id: 104, title: '数据库设计与优化', url: 'https://edu.example.com/course/database-design', addTime: '2024-01-18 16:45', duration: '50分钟', instructor: '陈工程师', progress: 20 },
                        { id: 105, title: '云计算架构设计', url: 'https://edu.example.com/course/cloud-architecture', addTime: '2024-01-19 11:00', duration: '90分钟', instructor: '刘架构师', progress: 100 }
                      ]);
                      message.success('已重新加载5条视频课程记录');
                    }}
                    style={{ color: '#666' }}
                  >
                    初始化
                  </Button>
                </Tooltip>
              </div>
              <Checkbox 
                style={{ marginLeft: 'auto' }}
                checked={selectedMaterials.length > 0 && selectedMaterials.length === (
                  uploadedFiles.length + addedTexts.length + courseVideos.length + links.length + organizationalCourses.length
                )}
                indeterminate={selectedMaterials.length > 0 && selectedMaterials.length < (
                  uploadedFiles.length + addedTexts.length + courseVideos.length + links.length + organizationalCourses.length
                )}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </div>
            
            {/* 统一的资料列表 */}
            <div style={{ height: 'calc(100vh - 280px)', overflowY: 'auto' }}>
              {/* 已上传文件 */}
              {uploadedFiles.map(file => (
                <Card 
                  key={`file-${file.id}`} 
                  size="small" 
                  style={{ 
                    marginBottom: 8,
                    border: selectedMaterials.includes(`file-${file.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                    backgroundColor: selectedMaterials.includes(`file-${file.id}`) ? '#f6ffed' : 'white'
                  }}
                  onMouseEnter={() => setHoveredItems(prev => ({...prev, [`file-${file.id}`]: true}))}
                  onMouseLeave={() => setHoveredItems(prev => ({...prev, [`file-${file.id}`]: false}))}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div 
                      style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                      onClick={() => handleViewMaterial(file, 'file')}
                    >
                      {hoveredItems[`file-${file.id}`] ? (
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: 'rename',
                                label: '重命名',
                                icon: <EditOutlined />,
                                onClick: () => {
                                  const newName = prompt('请输入新的文件名:', file.name);
                                  if (newName && newName.trim()) {
                                    setUploadedFiles(prev => 
                                      prev.map(f => 
                                        f.id === file.id ? { ...f, name: newName.trim() } : f
                                      )
                                    );
                                    message.success('文件重命名成功');
                                  }
                                }
                              },
                              {
                                key: 'delete',
                                label: '删除',
                                icon: <DeleteOutlined />,
                                onClick: () => {
                                  Modal.confirm({
                                    title: '确认删除',
                                    content: `确定要删除文件"${file.name}"吗？`,
                                    okText: '确定',
                                    cancelText: '取消',
                                    onOk: () => handleDeleteFile(file.id)
                                  });
                                },
                                danger: true
                              }
                            ]
                          }}
                          trigger={['click']}
                        >
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<MoreOutlined />}
                            onClick={(e) => e.stopPropagation()}
                            style={{ marginRight: 8 }}
                          />
                        </Dropdown>
                      ) : (
                        <FileTextOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8 }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{file.name}</Text>
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
              
              {/* 添加的文字 */}
              {addedTexts.map(text => (
                <Card 
                  key={`text-${text.id}`} 
                  size="small" 
                  style={{ 
                    marginBottom: 8,
                    border: selectedMaterials.includes(`text-${text.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                    backgroundColor: selectedMaterials.includes(`text-${text.id}`) ? '#f6ffed' : 'white'
                  }}
                  onMouseEnter={() => setHoveredItems(prev => ({...prev, [`text-${text.id}`]: true}))}
                  onMouseLeave={() => setHoveredItems(prev => ({...prev, [`text-${text.id}`]: false}))}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div 
                      style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                      onClick={() => handleViewMaterial(text, 'text')}
                    >
                      {hoveredItems[`text-${text.id}`] ? (
                         <Dropdown
                           menu={{
                             items: [
                               {
                                 key: 'rename',
                                 label: '重命名',
                                 icon: <EditOutlined />,
                                 onClick: () => {
                                    const newTitle = prompt('请输入新的标题:', text.title);
                                    if (newTitle && newTitle.trim()) {
                                      setAddedTexts(prev => 
                                        prev.map(t => 
                                          t.id === text.id ? { ...t, title: newTitle.trim() } : t
                                        )
                                      );
                                      message.success('文字重命名成功');
                                    }
                                  }
                               },
                               {
                                  key: 'delete',
                                  label: '删除',
                                  icon: <DeleteOutlined />,
                                  onClick: () => {
                                    Modal.confirm({
                                      title: '确认删除',
                                      content: `确定要删除文字"${text.title}"吗？`,
                                      okText: '确定',
                                      cancelText: '取消',
                                      onOk: () => handleDeleteText(text.id)
                                    });
                                  },
                                  danger: true
                                }
                             ]
                           }}
                           trigger={['click']}
                         >
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<MoreOutlined />}
                            onClick={(e) => e.stopPropagation()}
                            style={{ marginRight: 8 }}
                          />
                        </Dropdown>
                      ) : (
                        <FileTextOutlined style={{ fontSize: 16, color: '#52c41a', marginRight: 8 }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{text.title}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                          {text.content.length > 50 ? text.content.substring(0, 50) + '...' : text.content}
                        </Text>
                      </div>
                    </div>
                    <Checkbox
                      checked={selectedMaterials.includes(`text-${text.id}`)}
                      onChange={(e) => handleSelectMaterial(`text-${text.id}`, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </Card>
              ))}
              
              {/* 课程视频 */}
              {courseVideos.map(video => (
                <Card 
                  key={`video-${video.id}`} 
                  size="small" 
                  style={{ 
                    marginBottom: 8,
                    border: selectedMaterials.includes(`video-${video.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                    backgroundColor: selectedMaterials.includes(`video-${video.id}`) ? '#f6ffed' : 'white'
                  }}
                  onMouseEnter={() => setHoveredItems(prev => ({...prev, [`video-${video.id}`]: true}))}
                  onMouseLeave={() => setHoveredItems(prev => ({...prev, [`video-${video.id}`]: false}))}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div 
                      style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                      onClick={() => handleViewMaterial(video, 'video')}
                    >
                      {hoveredItems[`video-${video.id}`] ? (
                         <Dropdown
                           menu={{
                             items: [
                               {
                                 key: 'rename',
                                 label: '重命名',
                                 icon: <EditOutlined />,
                                 onClick: () => {
                                    const newTitle = prompt('请输入新的视频标题:', video.title);
                                    if (newTitle && newTitle.trim()) {
                                      setCourseVideos(prev => 
                                        prev.map(v => 
                                          v.id === video.id ? { ...v, title: newTitle.trim() } : v
                                        )
                                      );
                                      message.success('视频重命名成功');
                                    }
                                  }
                               },
                               {
                                  key: 'delete',
                                  label: '删除',
                                  icon: <DeleteOutlined />,
                                  onClick: () => {
                                    Modal.confirm({
                                      title: '确认删除',
                                      content: `确定要删除视频"${video.title}"吗？`,
                                      okText: '确定',
                                      cancelText: '取消',
                                      onOk: () => handleDeleteVideo(video.id)
                                    });
                                  },
                                  danger: true
                                }
                             ]
                           }}
                           trigger={['click']}
                         >
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<MoreOutlined />}
                            onClick={(e) => e.stopPropagation()}
                            style={{ marginRight: 8 }}
                          />
                        </Dropdown>
                      ) : (
                        <div style={{ fontSize: 16, marginRight: 8 }}>🎥</div>
                      )}
                      <div style={{ flex: 1 }}>
                        <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{video.title}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                          {video.instructor && `讲师：${video.instructor} | `}
                          {video.duration && `时长：${video.duration} | `}
                          {video.addTime}
                        </Text>
                        {/* 观看进度条 */}
                        {video.progress !== undefined && (
                          <div style={{ marginTop: 4 }}>
                            <Progress 
                              percent={video.progress} 
                              size="small" 
                              strokeColor={
                                video.progress === 100 ? '#52c41a' : 
                                video.progress >= 50 ? '#1890ff' : '#faad14'
                              }
                              showInfo={false}
                              style={{ fontSize: 10 }}
                            />
                            <Text type="secondary" style={{ fontSize: 9 }}>
                              观看进度 {video.progress}%
                            </Text>
                          </div>
                        )}
                      </div>
                    </div>
                    <Checkbox
                      checked={selectedMaterials.includes(`video-${video.id}`)}
                      onChange={(e) => handleSelectMaterial(`video-${video.id}`, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </Card>
              ))}
              
              {/* 保存的链接 */}
              {links.map(link => {
                const [isHovered, setIsHovered] = React.useState(false);
                return (
                  <Card 
                    key={`link-${link.id}`} 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: selectedMaterials.includes(`link-${link.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedMaterials.includes(`link-${link.id}`) ? '#f6ffed' : 'white'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                        onClick={() => handleViewMaterial(link, 'link')}
                      >
                        {isHovered ? (
                           <Dropdown
                             menu={{
                               items: [
                                 {
                                   key: 'rename',
                                   label: '重命名',
                                   icon: <EditOutlined />,
                                   onClick: () => {
                                      const newTitle = prompt('请输入新的链接标题:', link.title);
                                      if (newTitle && newTitle.trim()) {
                                        setLinks(prev => 
                                          prev.map(l => 
                                            l.id === link.id ? { ...l, title: newTitle.trim() } : l
                                          )
                                        );
                                        message.success('链接重命名成功');
                                      }
                                    }
                                 },
                                 {
                                    key: 'delete',
                                    label: '删除',
                                    icon: <DeleteOutlined />,
                                    onClick: () => {
                                      Modal.confirm({
                                        title: '确认删除',
                                        content: `确定要删除链接"${link.title}"吗？`,
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: () => handleDeleteLink(link.id)
                                      });
                                    },
                                    danger: true
                                  }
                               ]
                             }}
                             trigger={['click']}
                           >
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: 8 }}
                            />
                          </Dropdown>
                        ) : (
                          <LinkOutlined style={{ fontSize: 16, color: '#fa8c16', marginRight: 8 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{link.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                            {link.url}
                          </Text>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMaterials.includes(`link-${link.id}`)}
                        onChange={(e) => handleSelectMaterial(`link-${link.id}`, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Card>
                );
              })}
              
              {/* 组织培训课程 */}
              {organizationalCourses.map(course => {
                const [isHovered, setIsHovered] = React.useState(false);
                return (
                  <Card 
                    key={`course-${course.id}`} 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: selectedMaterials.includes(`course-${course.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedMaterials.includes(`course-${course.id}`) ? '#f6ffed' : 'white'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                        onClick={() => handleViewMaterial(course, 'course')}
                      >
                        {isHovered ? (
                           <Dropdown
                             menu={{
                               items: [
                                 {
                                   key: 'view',
                                   label: '查看详情',
                                   icon: <EyeOutlined />,
                                   onClick: () => {
                                     Modal.info({
                                       title: course.title,
                                       content: (
                                         <div>
                                           <p><strong>课程描述：</strong>{course.description}</p>
                                           <p><strong>培训类型：</strong>{course.trainingType}</p>
                                           <p><strong>学习时长：</strong>{course.duration}</p>
                                           <p><strong>课程状态：</strong>{course.status}</p>
                                         </div>
                                       ),
                                       width: 600
                                     });
                                   }
                                 },
                                 {
                                    key: 'delete',
                                    label: '移除',
                                    icon: <DeleteOutlined />,
                                    onClick: () => {
                                      Modal.confirm({
                                        title: '确认移除',
                                        content: `确定要从资料来源中移除课程"${course.title}"吗？`,
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: () => {
                                          setOrganizationalCourses(prev => 
                                            prev.filter(c => c.id !== course.id)
                                          );
                                          message.success('课程已从资料来源中移除');
                                        }
                                      });
                                    },
                                    danger: true
                                  }
                               ]
                             }}
                             trigger={['click']}
                           >
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: 8 }}
                            />
                          </Dropdown>
                        ) : (
                          <PlayCircleOutlined style={{ fontSize: 16, color: '#52c41a', marginRight: 8 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{course.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                            {course.trainingType} · {course.duration}
                          </Text>
                          {/* 观看进度条 */}
                          {course.progress !== undefined && (
                            <div style={{ marginTop: 4 }}>
                              <Progress 
                                percent={course.progress} 
                                size="small" 
                                strokeColor={
                                  course.progress === 100 ? '#52c41a' : 
                                  course.progress >= 50 ? '#1890ff' : '#faad14'
                                }
                                showInfo={false}
                                style={{ fontSize: 10 }}
                              />
                              <Text type="secondary" style={{ fontSize: 9 }}>
                                观看进度 {course.progress}%
                              </Text>
                            </div>
                          )}
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMaterials.includes(`course-${course.id}`)}
                        onChange={(e) => handleSelectMaterial(`course-${course.id}`, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          // 视频播放模式：四层结构布局
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 标题栏 */}
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #f0f0f0',
              background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={handleBackToMaterials}
                    style={{ color: 'white', padding: '4px 8px' }}
                    size="small"
                  />
                  <div>
                    <Text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                      {selectedMaterial?.title || '视频标题'}
                    </Text>
                    {selectedMaterial?.instructor && (
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>
                        📚 讲师：{selectedMaterial.instructor}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                  {selectedMaterial?.duration && `时长：${selectedMaterial.duration}`}
                </div>
              </div>
            </div>

            {/* 摘要区域 */}
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #f0f0f0',
              background: '#f8f9fa'
            }}>
              <Text style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                📝 视频摘要：本视频主要介绍了{selectedMaterial?.title || '相关内容'}，包含了重要的学习要点和实际示例。适合初学者和进阶学习者观看。
              </Text>
            </div>

            {/* 视频播放器区域 */}
            <div style={{ 
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent'
            }}>
              {selectedMaterial && (
                <VideoPlayer
                  visible={false}
                  videoData={{
                    ...selectedMaterial,
                    startTime: videoStartTime
                  }}
                  embedded={true}
                  style={{
                    width: '100%'
                  }}
                  onTimeUpdate={handleVideoTimeUpdate}
                  onNoteCreated={(operationRecord) => {
                    setOperationRecords(prev => ({
                      ...prev,
                      note: [operationRecord, ...prev.note]
                    }));
                  }}
                />
              )}
            </div>

            {/* 跟随字幕区域 */}
            <div style={{ 
              padding: '16px 20px', 
              borderTop: '1px solid #f0f0f0',
              background: '#fff',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>📄</span>
                  <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#1890ff' }}>
                    原文
                  </Text>
                </div>
                <div style={{ 
                  marginLeft: 'auto', 
                  fontSize: '12px', 
                  color: '#999',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>进度: {Math.round(videoProgress)}%</span>
                  <div style={{
                    width: '60px',
                    height: '4px',
                    background: '#f0f0f0',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${videoProgress}%`,
                      height: '100%',
                      background: '#1890ff',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              </div>
              
              {/* 字幕时间轴列表 */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                flex: 1,
                overflowY: 'auto',
                paddingRight: '4px'
              }}>
                {subtitleData.map((subtitle, index) => {
                  const isActive = currentSubtitle === subtitle.text;
                  const formatTime = (seconds) => {
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                  };
                  
                  return (
                    <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      {/* 时间轴标记 */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: isActive ? '#1890ff' : '#d9d9d9',
                          marginBottom: '4px'
                        }} />
                        <Text style={{ 
                          fontSize: '12px', 
                          color: isActive ? '#1890ff' : '#999',
                          fontWeight: isActive ? 'bold' : 'normal'
                        }}>
                          {formatTime(subtitle.start)}
                        </Text>
                      </div>
                      
                      {/* 字幕内容 */}
                      <div style={{ 
                        flex: 1,
                        padding: '12px 16px',
                        background: isActive ? '#e6f3ff' : '#f8f9fa',
                        borderRadius: '8px',
                        border: isActive ? '1px solid #1890ff' : '1px solid #e8e8e8',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        // 点击跳转到对应时间点
                        if (selectedMaterial) {
                          setVideoStartTime(subtitle.start);
                          // 这里可以添加实际的视频跳转逻辑
                        }
                      }}
                      >
                        <Text style={{ 
                          fontSize: '13px', 
                          lineHeight: '1.5',
                          color: isActive ? '#1890ff' : '#333',
                          fontWeight: isActive ? '500' : 'normal'
                        }}>
                          {subtitle.text}
                        </Text>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* 当前播放状态提示 */}
              {!currentSubtitle && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: '#999',
                  fontSize: '13px',
                  fontStyle: 'italic'
                }}>
                  字幕将在视频播放时自动跟随显示...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 中间问答区域 */}
      <div style={{ 
        flex: currentView === 'video' ? 2.5 : 5, 
        margin: '16px', 
        background: '#fff', 
        borderRadius: '8px', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'flex 0.3s ease'
      }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
            <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
              💬 智能问答
            </Title>
          </div>
          
          {/* 摘要区域 */}
          <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
            <div style={{ marginBottom: '12px' }}>
              <Text strong style={{ color: '#1890ff' }}>📋 针对所有来源的摘要</Text>
            </div>
            <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#fff' }}>
               <Paragraph style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                 {generateSummaryContent()}
               </Paragraph>
             </Card>
            
            {/* 快捷操作按钮 */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button 
                size="small" 
                icon={<FileTextOutlined />}
                onClick={() => {
                  const newNote = {
                    id: Date.now(),
                    title: '摘要笔记',
                    source: '智能摘要',
                    time: '刚刚',
                    type: 'report'
                  };
                  setOperationRecords(prev => ({
                    ...prev,
                    report: [newNote, ...prev.report]
                  }));
                  message.success('摘要已保存为笔记');
                }}
                style={{ borderRadius: '16px' }}
              >
                保存笔记
              </Button>
              <Button 
                size="small" 
                icon={<span>🎵</span>}
                onClick={() => handleOperationClick('audio')}
                style={{ borderRadius: '16px' }}
              >
                音频概览
              </Button>
              <Button 
                size="small" 
                icon={<span>🧠</span>}
                onClick={() => handleOperationClick('mindmap')}
                style={{ borderRadius: '16px' }}
              >
                思维导图
              </Button>
            </div>
          </div>
          
          {/* 消息列表 */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', maxHeight: 'calc(100vh - 500px)' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: 16 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 8
                }}>
                  {msg.type === 'assistant' && (
                    <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                  )}
                  <div style={{
                    maxWidth: '70%'
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: msg.type === 'user' ? '#1890ff' : '#f6f6f6',
                      color: msg.type === 'user' ? '#fff' : '#333'
                    }}>
                      <Text style={{ color: 'inherit' }}>{msg.content}</Text>
                    </div>
                    {msg.type === 'assistant' && (
                      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-start' }}>
                        <Button
                          size="small"
                          type="text"
                          icon={<SaveOutlined />}
                          onClick={() => handleSaveToNote(msg.content)}
                          style={{
                            fontSize: '12px',
                            color: '#666',
                            padding: '4px 8px',
                            height: 'auto'
                          }}
                        >
                          保存到笔记
                        </Button>
                      </div>
                    )}
                  </div>
                  {msg.type === 'user' && (
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <div style={{ padding: '12px 16px', backgroundColor: '#f6f6f6', borderRadius: '12px' }}>
                  <Text>正在思考中...</Text>
                </div>
              </div>
            )}
          </div>
          
          {/* 常见问题按钮 */}
          <div style={{ padding: '16px 20px 0 20px', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflow: 'hidden' }}>
              <Button 
                size="small" 
                style={{ 
                  borderRadius: '16px', 
                  fontSize: '11px',
                  flex: '1 1 0',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => setInputMessage('川菜特色？')}
                title="川菜特色？"
              >
                川菜特色？
              </Button>
              <Button 
                size="small" 
                style={{ 
                  borderRadius: '16px', 
                  fontSize: '11px',
                  flex: '1 1 0',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => setInputMessage('火锅做法？')}
                title="火锅做法？"
              >
                火锅做法？
              </Button>
              <Button 
                size="small" 
                style={{ 
                  borderRadius: '16px', 
                  fontSize: '11px',
                  flex: '1 1 0',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => setInputMessage('小吃推荐？')}
                title="小吃推荐？"
              >
                小吃推荐？
              </Button>
            </div>
          </div>
          
          {/* 输入区域 */}
          <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0' }}>
            <Space.Compact style={{ width: '100%', position: 'relative' }}>
              {/* 选中资料数量提示 - 浮动显示 */}
              {selectedMaterials.length > 0 && (
                <div style={{ 
                  position: 'absolute',
                  top: '-24px',
                  left: '0',
                  padding: '2px 8px', 
                  backgroundColor: '#f6ffed', 
                  border: '1px solid #b7eb8f', 
                  borderRadius: '12px',
                  fontSize: '10px',
                  color: '#52c41a',
                  zIndex: 10,
                  whiteSpace: 'nowrap'
                }}>
                  📋 {selectedMaterials.length}个资料
                </div>
              )}
              <TextArea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={selectedMaterials.length > 0 ? `基于已选择的 ${selectedMaterials.length} 个资料，请输入您的问题...` : "请先选择资料后再输入问题..."}
                autoSize={{ minRows: 1, maxRows: 3 }}
                disabled={selectedMaterials.length === 0}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                loading={isLoading}
                disabled={!inputMessage.trim() || selectedMaterials.length === 0}
              >
                发送
              </Button>
            </Space.Compact>

          </div>
        </div>

        {/* 右侧操作区域 */}
        <div style={{ 
          flex: currentView === 'video' ? 2.5 : 2.5, 
          background: '#fff', 
          margin: '16px 16px 16px 0', 
          borderRadius: '8px', 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'flex 0.3s ease'
        }}>
          {/* 上半部分 - 功能概览 */}
          <div style={{ padding: '20px', flex: 1 }}>
            <Title level={5} style={{ marginBottom: 16, color: '#1f1f1f' }}>
              🛠️ 操作面板
            </Title>
            
            {/* 功能卡片网格 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: 16 }}>
              {/* 音频概览 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('audio')}
                style={{ 
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>🎵</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#1565c0' 
                  }}>音频概览</Text>
                </div>
              </Card>
              
              {/* 视频概览 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('video')}
                style={{ 
                  background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>📹</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#2e7d32' 
                  }}>视频概览</Text>
                </div>
              </Card>
              
              {/* 思维导图 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('mindmap')}
                style={{ 
                  background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>🧠</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#c2185b' 
                  }}>思维导图</Text>
                </div>
              </Card>
              
              {/* 报告 */}
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'brief',
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>📄</span>
                          <span>简报文档</span>
                        </div>
                      ),
                      onClick: () => message.info('简报文档功能开发中')
                    },
                    {
                      key: 'guide',
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>📖</span>
                          <span>学习指南</span>
                        </div>
                      ),
                      onClick: () => message.info('学习指南功能开发中')
                    },
                    {
                      key: 'faq',
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>❓</span>
                          <span>常见问题解答</span>
                        </div>
                      ),
                      onClick: () => message.info('常见问题解答功能开发中')
                    },
                    {
                      key: 'timeline',
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>⏰</span>
                          <span>时间轴</span>
                        </div>
                      ),
                      onClick: () => message.info('时间轴功能开发中')
                    }
                  ]
                }}
                trigger={['hover']}
                placement="bottomLeft"
                overlayClassName="report-dropdown"
              >
                <Card 
                  size="small" 
                  hoverable
                  onClick={() => handleOperationClick('report')}
                  style={{ 
                    background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ padding: '6px 0' }}>
                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>📊</div>
                    <Text style={{ 
                      fontSize: '11px', 
                      fontWeight: 500, 
                      color: '#ef6c00' 
                    }}>报告</Text>
                  </div>
                </Card>
              </Dropdown>
              
              {/* PPT概览 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('ppt')}
                style={{ 
                  background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                   <div style={{ fontSize: '20px', marginBottom: '6px' }}>📽️</div>
                   <Text style={{ 
                     fontSize: '11px', 
                     fontWeight: 500, 
                     color: '#d32f2f' 
                   }}>PPT概览</Text>
                 </div>
              </Card>
              
              {/* 场景模拟 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('scenario')}
                style={{ 
                  background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                   <div style={{ fontSize: '20px', marginBottom: '6px' }}>🎭</div>
                   <Text style={{ 
                     fontSize: '11px', 
                     fontWeight: 500, 
                     color: '#7b1fa2' 
                   }}>场景模拟</Text>
                 </div>
              </Card>
              

            </div>
          </div>
          
          {/* 下半部分 - 操作记录 */}
          <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '300px' }}>
              {Object.values(operationRecords).flat().map(record => {
                const getIcon = (type) => {
                    switch(type) {
                      case 'audio': return '🎵';
                      case 'video': return '📹';
                      case 'mindmap': return '🧠';
                      case 'report': return '📊';
                      case 'ppt': return '📽️';
                      case 'webcode': return '💻';
                      case 'scenario': return '🎭';
                      case 'note': return '📝';
                      case 'file': return '📄';
                      case 'text': return '📝';
                      case 'link': return '🔗';
                      case 'course': return '📚';
                      case 'study-result': return '🏆'; // 研修成果类型
                      default: return '📄';
                    }
                  };
                
                return (
                  <Card 
                    key={record.id}
                    size="small" 
                    hoverable
                    style={{ 
                      marginBottom: '8px',
                      borderRadius: '8px',
                      border: record.isStudyResult 
                        ? '2px solid #f59e0b' 
                        : '1px solid #f0f0f0',
                      cursor: 'pointer',
                      background: record.isStudyResult 
                        ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' 
                        : '#fff',
                      boxShadow: record.isStudyResult 
                        ? '0 4px 12px rgba(245, 158, 11, 0.15)' 
                        : '0 1px 3px rgba(0, 0, 0, 0.1)',
                      position: 'relative'
                    }}
                    onClick={() => handleRecordClick(record)}
                  >
                    {/* 研修成果标记 */}
                    {record.isStudyResult && (
                      <div style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '0 6px 0 8px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        zIndex: 1
                      }}>
                        🏆 研修成果
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ fontSize: '16px', marginTop: '2px' }}>
                        {getIcon(record.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text 
                          style={{ 
                            fontSize: '12px', 
                            fontWeight: 500, 
                            color: '#1f1f1f',
                            display: 'block',
                            marginBottom: '4px',
                            lineHeight: '1.4'
                          }}
                          ellipsis={{ tooltip: record.title }}
                        >
                          {record.title}
                        </Text>
                        <div>
                          <Text style={{ fontSize: '10px', color: '#999' }}>
                            {record.source}
                          </Text>
                        </div>
                      </div>
                      {(record.type === 'audio' || record.type === 'video') && (
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<div style={{ fontSize: '12px' }}>▶</div>}
                          style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRecordClick(record);
                          }}
                        />
                      )}
                      {record.type === 'note' && (
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<EditOutlined style={{ fontSize: '12px' }} />}
                          style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRecordClick(record);
                          }}
                        />
                      )}
                      <Dropdown
                        menu={{ items: getMoreMenuItems(record) }}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<div style={{ fontSize: '12px' }}>⋯</div>}
                          style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Dropdown>
                    </div>
                  </Card>
                );
              })}
              
              {Object.values(operationRecords).flat().length === 0 && (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
                  暂无操作记录
                </div>
              )}
            </div>
            
            {/* 新建笔记按钮 */}
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreateNewNote}
                style={{
                  borderRadius: '6px',
                  fontSize: '12px',
                  height: '32px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
              >
                新建笔记
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 上传弹窗 */}
      <Modal
      title="添加来源"
      open={showUploadModal}
      onCancel={() => setShowUploadModal(false)}
      footer={null}
      width={600}
    >
      <div style={{ padding: '20px 0' }}>
        {/* 文档上传区域 */}
        <div style={{ marginBottom: 32 }}>
          <Title level={5} style={{ marginBottom: 16 }}>文档上传</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            请选择要上传的文档，NotebookLM 智能笔记支持以下格式的资料来源：
          </Text>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
            (示例：教育方案、课程设计材料、研究报告、会议文档内容、辅导文档等)
          </Text>
          <Upload.Dragger
            multiple
            onChange={handleFileUpload}
            showUploadList={false}
            accept=".pdf,.doc,.docx,.txt,.md"
            style={{ marginBottom: 16 }}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">上传文档</p>
            <p className="ant-upload-hint">
              拖放文档文件到此处，或点击上传
            </p>
          </Upload.Dragger>
          <Text type="secondary" style={{ fontSize: 12 }}>
            支持的文档类型：PDF, txt, Markdown 等格式（例如 .md）
          </Text>
        </div>

        <Divider />

        {/* 网站地址添加区域 */}
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>添加网站地址</Title>
          
          {/* 网站类型选择 */}
          <div style={{ marginBottom: 16 }}>
            <Text style={{ marginRight: 8 }}>网站类型：</Text>
            <Select
              value={websiteType}
              onChange={setWebsiteType}
              style={{ width: 120, marginRight: 16 }}
            >
              <Option value="normal">普通网站</Option>
              <Option value="video">视频网站</Option>
            </Select>
            {websiteType === 'video' && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                支持B站、小红书视频
              </Text>
            )}
          </div>
          
          {/* 网站地址输入 */}
          <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
            <Input
              placeholder={websiteType === 'video' ? '输入B站或小红书视频链接' : '输入网站地址'}
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              onPressEnter={handleAddWebsite}
              prefix={<LinkOutlined />}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddWebsite}>
              添加
            </Button>
          </Space.Compact>
          
          {/* 示例说明 */}
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            {websiteType === 'video' ? 
              '示例：https://www.bilibili.com/video/BV1xx411c7mu 或 https://www.xiaohongshu.com/explore/xxx' :
              '示例：https://www.example.com'
            }
          </Text>
         </div>

         <Divider />

         {/* 文字内容添加区域 */}
         <div>
           <Title level={5} style={{ marginBottom: 16 }}>添加文字</Title>
           
           {/* 文字内容输入 */}
           <div style={{ marginBottom: 16 }}>
             <TextArea
               placeholder="输入文字内容..."
               value={textContent}
               onChange={(e) => setTextContent(e.target.value)}
               rows={4}
               maxLength={1000}
               showCount
               style={{ marginBottom: 12 }}
             />
             <Button 
               type="primary" 
               icon={<PlusOutlined />} 
               onClick={handleAddText}
               block
             >
               添加文字
             </Button>
           </div>
           
           {/* 说明文字 */}
           <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
             添加的文字内容将作为资料来源，可用于AI问答和分析
           </Text>
         </div>

         <Divider />

         {/* 课程视频添加区域 */}
         <div>
           <Title level={5} style={{ marginBottom: 16 }}>添加课程视频</Title>
           
           {/* 视频标题输入 */}
           <div style={{ marginBottom: 12 }}>
             <Input
               placeholder="输入视频标题..."
               value={videoTitle}
               onChange={(e) => setVideoTitle(e.target.value)}
               maxLength={100}
               showCount
             />
           </div>
           
           {/* 视频链接输入 */}
           <div style={{ marginBottom: 16 }}>
             <Input
               placeholder="输入视频链接..."
               value={videoUrl}
               onChange={(e) => setVideoUrl(e.target.value)}
               addonBefore="🎥"
             />
             <Button 
               type="primary" 
               icon={<PlusOutlined />} 
               onClick={handleAddVideo}
               block
               style={{ marginTop: 12 }}
             >
               添加视频
             </Button>
           </div>
           
           {/* 说明文字 */}
           <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
             支持各类视频平台链接，如B站、YouTube、腾讯视频等
           </Text>
           <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
             示例：https://www.bilibili.com/video/BV1xx411c7mu
           </Text>
         </div>

         <Divider />

         {/* 我的选课添加区域 */}
         <div>
           <Title level={5} style={{ marginBottom: 16 }}>我的选课</Title>
           
           {/* 选课列表 */}
           <div style={{ marginBottom: 16 }}>
             {courseSelectionService.getAllCourses().length > 0 ? (
               <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                 {courseSelectionService.getAllCourses().map((course, index) => (
                   <Card 
                     key={index}
                     size="small" 
                     hoverable
                     style={{ 
                       marginBottom: 8,
                       borderRadius: 8,
                       border: '1px solid #f0f0f0',
                       cursor: 'pointer'
                     }}
                     onClick={() => handleAddCourse(course)}
                   >
                     <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                       <div style={{ fontSize: 20 }}>📚</div>
                       <div style={{ flex: 1 }}>
                         <Text 
                           style={{ 
                             fontSize: 14, 
                             fontWeight: 500, 
                             color: '#1f1f1f',
                             display: 'block',
                             marginBottom: 4
                           }}
                         >
                           {course.title}
                         </Text>
                         <Text style={{ fontSize: 12, color: '#999' }}>
                           {course.instructor} • {course.duration}
                         </Text>
                       </div>
                       <Button 
                         type="primary" 
                         size="small"
                         icon={<PlusOutlined />}
                         onClick={(e) => {
                           e.stopPropagation();
                           handleAddCourse(course);
                         }}
                       >
                         添加
                       </Button>
                     </div>
                   </Card>
                 ))}
               </div>
             ) : (
               <div style={{ 
                 textAlign: 'center', 
                 color: '#999', 
                 padding: '40px 20px',
                 border: '1px dashed #d9d9d9',
                 borderRadius: 8,
                 background: '#fafafa'
               }}>
                 <div style={{ fontSize: 24, marginBottom: 8 }}>📚</div>
                 <Text style={{ color: '#999' }}>暂无选课数据</Text>
                 <br />
                 <Text style={{ fontSize: 12, color: '#bfbfbf' }}>
                   请先在选课管理中添加课程
                 </Text>
               </div>
             )}
           </div>
           
           {/* 说明文字 */}
           <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
             从您的选课中选择相关课程作为笔记来源
           </Text>
         </div>

      </div>
       </Modal>
       


      {/* 资料预览弹窗 */}
      <Modal
        title={`预览 - ${previewData?.title || '资料'}`}
        open={showPreviewModal}
        onCancel={() => setShowPreviewModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowPreviewModal(false)}>
            关闭
          </Button>
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {previewData && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {previewType === 'file' && renderFilePreview(previewData)}
            {previewType === 'video' && renderVideoPreview(previewData)}
            {previewType === 'link' && renderLinkPreview(previewData)}
            {previewType === 'text' && renderTextPreview(previewData)}
          </div>
        )}
      </Modal>

      {/* 内容查看弹窗 */}
      <Modal
        title={currentRecord?.title || '内容查看'}
        open={showContentModal}
        onCancel={() => setShowContentModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowContentModal(false)}>
            关闭
          </Button>
        ]}
        width={800}
        style={{ top: 20 }}
      >
        <div 
          dangerouslySetInnerHTML={{ __html: modalContent }}
          style={{ maxHeight: '70vh', overflowY: 'auto' }}
        />
      </Modal>
      
      {/* 资料添加弹窗 */}
      <MaterialAddPage 
        visible={showMaterialAddModal}
        onClose={() => setShowMaterialAddModal(false)}
      />
      
      {/* 智能笔记弹窗 */}
      <Modal
        title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RobotOutlined style={{ color: '#1890ff' }} />
          {smartNotes.length === 1 ? '资料智能预览' : '智能笔记预览'}
        </div>}
        open={showSmartNotesModal}
        onCancel={() => {
          setShowSmartNotesModal(false);
          setSelectedNote(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setShowSmartNotesModal(false);
            setSelectedNote(null);
          }}>
            关闭
          </Button>
        ]}
        width={900}
        style={{ top: 20 }}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {smartNotes.length > 0 ? (
            <div>
              <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae7ff' }}>
                 <Text type="secondary">
                   {smartNotes.length === 1 ? 
                     '🤖 AI智能分析该资料，为您提供摘要、关键要点和标签分类' : 
                     `📝 已为您生成 ${smartNotes.length} 条智能笔记，包含资料摘要、关键要点和标签分类`
                   }
                 </Text>
               </div>
              
              <List
                itemLayout="vertical"
                dataSource={smartNotes}
                renderItem={(note, index) => (
                  <List.Item
                    key={note.id}
                    style={{
                      padding: '16px',
                      marginBottom: '12px',
                      backgroundColor: selectedNote?.id === note.id ? '#f6ffed' : '#fafafa',
                      borderRadius: '8px',
                      border: selectedNote?.id === note.id ? '1px solid #b7eb8f' : '1px solid #f0f0f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedNote(selectedNote?.id === note.id ? null : note)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                          {note.type === 'file' && '📄'}
                          {note.type === 'video' && '🎥'}
                          {note.type === 'link' && '🔗'}
                          {note.type === 'text' && '📝'}
                          {' '}{note.title}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {note.createdAt}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {note.tags.map((tag, tagIndex) => (
                          <Tag key={tagIndex} size="small" color={note.type === 'file' ? 'blue' : note.type === 'video' ? 'red' : note.type === 'link' ? 'green' : 'orange'}>
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </div>
                    
                    <Paragraph style={{ margin: 0, marginBottom: 12, color: '#666' }}>
                      {note.summary}
                    </Paragraph>
                    
                    {selectedNote?.id === note.id && (
                      <div style={{ marginTop: 12, padding: '12px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e8f4fd' }}>
                        <Title level={5} style={{ margin: 0, marginBottom: 8, color: '#1890ff' }}>关键要点：</Title>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {note.keyPoints.map((point, pointIndex) => (
                            <li key={pointIndex} style={{ marginBottom: 4, color: '#666' }}>{point}</li>
                          ))}
                        </ul>
                        
                        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                          <Button 
                            size="small" 
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewMaterial(note.originalData, note.type);
                            }}
                          >
                            预览原资料
                          </Button>
                          <Button 
                            size="small" 
                            type="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              message.success('笔记已保存到操作记录');
                              // 这里可以添加保存到操作记录的逻辑
                            }}
                          >
                            保存笔记
                          </Button>
                        </div>
                      </div>
                    )}
                  </List.Item>
                )}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
              <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div>暂无智能笔记</div>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>请先添加资料，然后点击"智能笔记"按钮生成</div>
            </div>
          )}
        </div>
      </Modal>
      
      {/* 探索弹窗 */}
      <ExploreModal
        visible={showExploreModal}
        onClose={() => setShowExploreModal(false)}
        onExplore={handleExplore}
      />

      {/* 视频播放器 */}
      <VideoPlayer
        visible={showVideoPlayer}
        onClose={() => {
          setShowVideoPlayer(false);
          setCurrentVideo(null);
        }}
        videoData={currentVideo}
        onNoteCreated={(operationRecord) => {
          // 添加操作记录到操作记录区
          setOperationRecords(prev => ({
            ...prev,
            note: [operationRecord, ...prev.note]
          }));
        }}
        onProgressUpdate={(videoId, progress) => {
          // 更新视频观看进度
          setCourseVideos(prev => 
            prev.map(video => 
              video.id === videoId 
                ? { ...video, progress } 
                : video
            )
          );
        }}
      />

      {/* 场景模拟弹窗 */}
      <Modal
        title="场景模拟推荐"
        open={scenarioModalVisible}
        onCancel={() => setScenarioModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setScenarioModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={() => {
              if (selectedScenarios.length === 0) {
                message.warning('请至少选择一个场景模拟');
                return;
              }
              
              // 将选中的场景模拟添加到操作记录
              const newRecords = selectedScenarios.map(scenario => ({
                id: Date.now() + Math.random(),
                title: `场景模拟：${scenario.title}`,
                source: '智能推荐',
                time: '刚刚',
                type: 'scenario',
                content: scenario.description
              }));

              setOperationRecords(prev => ({
                ...prev,
                scenario: [...newRecords, ...(prev.scenario || [])]
              }));

              message.success(`已添加${selectedScenarios.length}个场景模拟到操作记录`);
              setScenarioModalVisible(false);
              setSelectedScenarios([]);
            }}
          >
            确认添加 ({selectedScenarios.length})
          </Button>
        ]}
      >
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#666', fontSize: '14px' }}>
              基于您的资料内容，为您推荐以下场景模拟：
            </div>
            <Button 
               type="primary" 
               icon={<PlusOutlined />}
               size="small"
               style={{ 
                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                 border: 'none',
                 borderRadius: '6px',
                 boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
               }}
               onClick={() => {
                 // 添加加载状态
                 const loadingMessage = message.loading('AI正在为您创建场景...', 0);
                 
                 // 模拟AI思考时间
                 setTimeout(() => {
                   loadingMessage();
                   
                   // AI自动创建场景的逻辑
                   const newScenario = createNewScenario();
                   
                   // 将新创建的场景添加到操作记录
                   const newRecord = {
                     id: Date.now() + Math.random(),
                     title: `场景模拟：${newScenario.title}`,
                     source: 'AI自动创建',
                     time: '刚刚',
                     type: 'scenario',
                     content: newScenario.description
                   };

                   setOperationRecords(prev => ({
                     ...prev,
                     scenario: [newRecord, ...(prev.scenario || [])]
                   }));

                   message.success({
                     content: (
                       <div>
                         <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                           🎉 AI已为您创建场景模拟
                         </div>
                         <div style={{ fontSize: '12px', color: '#666' }}>
                           {newScenario.title}
                         </div>
                       </div>
                     ),
                     duration: 3
                   });
                 }, 1500);
               }}
             >
              新建场景
            </Button>
          </div>
          
          {getRecommendedScenarios().map(scenario => (
            <Card
              key={scenario.id}
              size="small"
              style={{ 
                marginBottom: '12px',
                border: selectedScenarios.find(s => s.id === scenario.id) ? '2px solid #1890ff' : '1px solid #d9d9d9',
                cursor: 'pointer'
              }}
              onClick={() => {
                const isSelected = selectedScenarios.find(s => s.id === scenario.id);
                if (isSelected) {
                  setSelectedScenarios(prev => prev.filter(s => s.id !== scenario.id));
                } else {
                  setSelectedScenarios(prev => [...prev, scenario]);
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '24px', marginRight: '12px' }}>{scenario.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{scenario.title}</div>
                  <div style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>
                    {scenario.description}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {scenario.tags.map(tag => (
                      <Tag key={tag} size="small" color="blue">{tag}</Tag>
                    ))}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
                    适用场景：{scenario.applicableScenes.join('、')}
                  </div>
                </div>
                <Checkbox 
                  checked={!!selectedScenarios.find(s => s.id === scenario.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </Card>
          ))}
        </div>
      </Modal>

      {/* 富文本编辑器模态框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📝</span>
            <span>编辑笔记</span>
          </div>
        }
        open={showNoteEditor}
        onCancel={() => {
          setShowNoteEditor(false);
          setEditingNote(null);
          setNoteEditorContent('');
        }}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => {
            setShowNoteEditor(false);
            setEditingNote(null);
            setNoteEditorContent('');
          }}>
            取消
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            onClick={() => {
              if (!noteEditorContent.trim() || noteEditorContent === '<p></p>') {
                message.warning('请输入笔记内容');
                return;
              }

              // 更新操作记录中的笔记内容
              setOperationRecords(prev => ({
                ...prev,
                note: prev.note.map(note => 
                  note.id === editingNote.id 
                    ? { ...note, content: noteEditorContent }
                    : note
                )
              }));

              message.success('笔记已保存');
              setShowNoteEditor(false);
              setEditingNote(null);
              setNoteEditorContent('');
            }}
          >
            保存
          </Button>
        ]}
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            border: '1px solid #d9d9d9', 
            borderRadius: '6px',
            minHeight: '300px',
            padding: '12px'
          }}>
            <div 
              contentEditable
              style={{
                minHeight: '280px',
                outline: 'none',
                lineHeight: '1.6',
                fontSize: '14px'
              }}
              dangerouslySetInnerHTML={{ __html: noteEditorContent }}
              onInput={(e) => {
                const rawContent = e.target.innerHTML;
                const contentWithLinks = convertTimeToLinks(rawContent);
                setNoteEditorContent(contentWithLinks);
                // 如果内容发生了变化（添加了超链接），更新显示
                if (rawContent !== contentWithLinks) {
                  e.target.innerHTML = contentWithLinks;
                  // 保持光标位置
                  const selection = window.getSelection();
                  const range = document.createRange();
                  range.selectNodeContents(e.target);
                  range.collapse(false);
                  selection.removeAllRanges();
                  selection.addRange(range);
                }
              }}
              onBlur={(e) => {
                const rawContent = e.target.innerHTML;
                const contentWithLinks = convertTimeToLinks(rawContent);
                setNoteEditorContent(contentWithLinks);
              }}
            />
          </div>
          <div style={{ 
            marginTop: '8px', 
            fontSize: '12px', 
            color: '#999',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>支持富文本编辑，可以设置文字样式、添加链接等</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                size="small" 
                onClick={() => {
                  document.execCommand('bold');
                }}
              >
                <strong>B</strong>
              </Button>
              <Button 
                size="small" 
                onClick={() => {
                  document.execCommand('italic');
                }}
              >
                <em>I</em>
              </Button>
              <Button 
                size="small" 
                onClick={() => {
                  document.execCommand('underline');
                }}
              >
                <u>U</u>
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NoteEditPage;