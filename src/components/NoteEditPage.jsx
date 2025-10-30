import React, { useState, useEffect, useRef } from 'react';
import {
  Layout,
  Button,
  Typography,
  message,
  Modal,
  Card,
  Checkbox,
  Row,
  Col,
  Select,
  List,
  Input,
  Badge,
  Avatar,
  Space
} from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, MessageOutlined, VideoCameraOutlined, AudioOutlined, AudioMutedOutlined, StopOutlined, ShareAltOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getNewTeacherTrainingMessages } from '../data/trainingDiscussionMessages';

// 导入重构后的组件
import MaterialManagement from './MaterialManagement';
import AIChat from './AIChat';
import OperationPanel from './OperationPanel';
import VideoView from './VideoView';
import ChatWindow from './ChatWindow';
import AchievementDetailPanel from './AchievementDetailPanel';
import AchievementDetailThreeColumn from './AchievementDetailThreeColumn';
import ExamReviewFullPage from './ExamReviewFullPage';

// 导入原有组件
import MaterialAddPage from './MaterialAddPage';
import ExploreModal from './ExploreModal';
import VideoPlayer from './VideoPlayer';
import CapabilityMindMap from './CapabilityMindMap.jsx';
import KnowledgeGraphMindMap from './KnowledgeGraphMindMap.jsx';

// 导入场景仿真组件
import ScenarioSimulation from './ScenarioSimulation';
import ScenarioView from './ScenarioView';
import LearningPlanCalendarFullscreen from './LearningPlanCalendarFullscreen';
import LearningPlanCalendar from './LearningPlanCalendar';
import CalendarCenter from './CalendarCenter';
import ClassroomEvaluationFullscreen from './ClassroomEvaluationFullscreen';
import ThemeSelectModal from './ThemeSelectModal';
import TrainingPlanViewer from './OperationPanel/TrainingPlanViewer';
import SimpleTrainingPlanDetailView from './SimpleTrainingPlanDetailView';
import notesService from '../services/notesService';

// 导入hooks和工具
import { useNoteEditState } from '../hooks/useNoteEditState';
import {
  VIEW_MODES,
  RIGHT_PANEL_VIEWS,
  MORE_MENU_ACTIONS,
  OPERATION_TYPES,
  TOOL_CATEGORIES,
  EXAM_VIEW_MODES
} from '../constants/noteEditConstants';
import {
  getLiveStreamStatus,
  createNewScenario,
  getRecommendedScenarios,
  initializeAvailableTools,
  createMarkContent,
  createNewNoteRecord,
  convertTimeToLinks
} from '../utils/noteEditUtils';
import { getCategoryKey, getAiTitleForCategory } from '../constants/categoryMeta';

const { Title, Text } = Typography;
const { Option } = Select;

// 指定本地视频资源（用于“智能工具生成的视频概览”的播放”）
// “视频概览”固定播放地址（仅用于“视频概览”记录，不影响其他视频）
// 使用公开路径，确保地址为 '/assets/2.mp4'
const VIDEO_OVERVIEW_URL = '/assets/2.mp4';

const NoteEditPage = ({ onBack, onViewChange, note = null, mode = 'create', selectedTemplate = null, selectedCategory = null, initialView = null }) => {
  // 注册全局时间链接点击处理，使文本中的时间码点击可跳转视频
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.handleTimeClick = (seconds) => {
        try {
          const videoElement = document.querySelector('video');
          if (videoElement) {
            videoElement.currentTime = Number(seconds) || 0;
            if (videoElement.paused) {
              videoElement.play().catch(() => {});
            }
          } else {
            message.info('请先在右侧打开视频播放器');
          }
        } catch (err) {
          console.error('处理时间链接点击失败:', err);
          message.error('跳转失败，请稍后重试');
        }
      };
    }
  }, []);
  // 使用统一的状态管理hook
  const state = useNoteEditState(note, mode, selectedTemplate, selectedCategory);
  
  const {
    // 基本状态
    currentView,
    setCurrentView,
    selectedMaterial,
    setSelectedMaterial,
    videoStartTime,
    setVideoStartTime,
    currentSubtitle,
    setCurrentSubtitle,
    videoProgress,
    setVideoProgress,
    liveStreams,
    
    // 操作记录状态
    operationRecords,
    setOperationRecords,
    showContentModal,
    setShowContentModal,
    modalContent,
    setModalContent,
    
    // 场景模拟状态
    scenarioModalVisible,
    setScenarioModalVisible,
    selectedScenarios,
    setSelectedScenarios,
    
    // 工具相关状态
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
    
    // 能力模型和知识图谱状态
    showCapabilityMapModal,
    setShowCapabilityMapModal,
    showKnowledgeGraphModal,
    setShowKnowledgeGraphModal,
    
    // 视频播放器状态
    showVideoPlayer,
    setShowVideoPlayer,
    currentVideo,
    setCurrentVideo,
    
    // 主题选择模态框状态
    showThemeSelectModal,
    setShowThemeSelectModal,
    currentRecord,
    setCurrentRecord,
    currentActionType,
    setCurrentActionType
  } = state;

  // 消息中心相关状态
  const [showMessageCenter, setShowMessageCenter] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(3); // 模拟未读消息数量
  const [isGroupCreated, setIsGroupCreated] = useState(false); // 群组创建状态
  const [newChatMessage, setNewChatMessage] = useState('');
  
  // 对话框宽度随分栏动态调整
  const [isChatSplit, setIsChatSplit] = useState(false);
  const modalWidth = isChatSplit ? '75%' : '45%';
  
  // 会议相关状态
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  
  // 悬浮图标拖动相关状态
  const [floatIconPosition, setFloatIconPosition] = useState({ x: 24, y: 24 }); // 相对于右下角的位置
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });
  
  // 操作面板收起状态
  const [operationPanelCollapsed, setOperationPanelCollapsed] = useState(false);

  // 关联来源选择弹窗状态
  const [linkSourceModalVisible, setLinkSourceModalVisible] = useState(false);
  const [recordToLinkSource, setRecordToLinkSource] = useState(null);
  const [selectedSourceForLink, setSelectedSourceForLink] = useState(null);

  // 构建可选择来源列表（来自 MaterialManagement 的各类材料）
  const buildSourceOptions = () => {
    const options = [];
    try {
      (state.addedTexts || []).forEach(t => options.push({
        value: `text:${t.id}`,
        label: `📝 文本｜${t.title || t.name || t.id}`,
        raw: { ...t, type: 'text' }
      }));
      (state.uploadedFiles || []).forEach(f => options.push({
        value: `file:${f.id}`,
        label: `📄 文件｜${f.name || f.title || f.id}`,
        raw: { ...f, type: 'file' }
      }));
      (state.courseVideos || []).forEach(v => options.push({
        value: `video:${v.id}`,
        label: `🎥 视频｜${v.title || v.name || v.id}`,
        raw: { ...v, type: 'video' }
      }));
      (state.links || []).forEach(l => options.push({
        value: `link:${l.id}`,
        label: `🔗 链接｜${l.title || l.name || l.url || l.id}`,
        raw: { ...l, type: 'link' }
      }));
      (state.selectedCourses || []).forEach(c => options.push({
        value: `course:${c.id}`,
        label: `📚 课程｜${c.title || c.courseTitle || c.name || c.id}`,
        raw: { ...c, type: 'course' }
      }));
    } catch (e) {
      console.warn('buildSourceOptions error:', e);
    }
    return options;
  };

  const getAllOperationRecords = () => {
    try {
      return Object.values(operationRecords || {}).reduce((acc, arr) => {
        if (Array.isArray(arr)) acc.push(...arr);
        return acc;
      }, []);
    } catch (e) {
      return [];
    }
  };

  // 监听聊天工具打开/关闭以动态加宽/恢复
  useEffect(() => {
    const openSearch = () => setIsChatSplit(true);
    const openCalendar = () => setIsChatSplit(true);
    const closeSearch = () => setIsChatSplit(false);
    const closeCalendar = () => setIsChatSplit(false);
    window.addEventListener('conversationSearchOpen', openSearch);
    window.addEventListener('openMemberCalendar', openCalendar);
    window.addEventListener('conversationSearchClose', closeSearch);
    window.addEventListener('closeMemberCalendar', closeCalendar);
    return () => {
      window.removeEventListener('conversationSearchOpen', openSearch);
      window.removeEventListener('openMemberCalendar', openCalendar);
      window.removeEventListener('conversationSearchClose', closeSearch);
      window.removeEventListener('closeMemberCalendar', closeCalendar);
    };
  }, []);

  // 会议控制函数
  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        // 某些浏览器需要显式调用 play
        localVideoRef.current.play().catch(() => {});
      }
      setIsCalling(true);
      setIsMuted(false);
      setIsVideoOn(true);
      message.success('已开始视频通话');
    } catch (err) {
      console.error('startVideoCall error:', err);
      message.error('无法访问摄像头/麦克风，请检查浏览器权限');
    }
  };

  const endVideoCall = () => {
    try {
      if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
      }
    } catch (e) {
      console.warn('stop tracks error:', e);
    }
    setLocalStream(null);
    setIsCalling(false);
    setShowMeetingModal(false);
    message.info('已结束通话');
  };

  const toggleMute = () => {
    if (!localStream) return;
    const audioTracks = localStream.getAudioTracks();
    audioTracks.forEach(track => (track.enabled = !track.enabled));
    setIsMuted(prev => !prev);
  };

  const toggleVideo = () => {
    if (!localStream) return;
    const videoTracks = localStream.getVideoTracks();
    videoTracks.forEach(track => (track.enabled = !track.enabled));
    setIsVideoOn(prev => !prev);
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }
        setIsScreenSharing(true);
        message.success('开始屏幕共享');
      } catch (err) {
        console.error('screen share error:', err);
        message.error('无法开始屏幕共享');
      }
    } else {
      try {
        if (screenStream) {
          screenStream.getTracks().forEach(t => t.stop());
        }
      } catch (e) {}
      setScreenStream(null);
      if (localVideoRef.current) {
        if (localStream) {
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current.play().catch(() => {});
        } else {
          localVideoRef.current.srcObject = null;
        }
      }
      setIsScreenSharing(false);
      message.info('已停止屏幕共享');
    }
  };
  
  // 拖动事件处理函数
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsMouseDown(true);
    setMouseDownPos({ x: e.clientX, y: e.clientY });
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    const dragThreshold = 3; // 像素阈值，超过即认定为拖动
    const moveDist = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
    const willDrag = moveDist > dragThreshold;
    if (willDrag && !isDragging) {
      setIsDragging(true);
    }
    if (!willDrag) return;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const iconSize = 56;
    
    // 计算新位置（相对于右下角）
    const newX = windowWidth - e.clientX - dragOffset.x + iconSize;
    const newY = windowHeight - e.clientY - dragOffset.y + iconSize;
    
    // 边界限制
    const minX = iconSize;
    const maxX = windowWidth - iconSize;
    const minY = iconSize;
    const maxY = windowHeight - iconSize;
    
    setFloatIconPosition({
      x: Math.max(minX, Math.min(maxX, windowWidth - e.clientX + dragOffset.x)),
      y: Math.max(minY, Math.min(maxY, windowHeight - e.clientY + dragOffset.y))
    });
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsDragging(false);
  };

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isMouseDown) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isMouseDown, dragOffset, mouseDownPos]);
  
  const [discussionMessages, setDiscussionMessages] = useState(() => (
    selectedCategory === 'organizational_training'
      ? getNewTeacherTrainingMessages()
      : [
          {
            id: 1,
            senderId: 'user1',
            senderName: '张老师',
            content: '这个主题的内容很有深度，值得深入讨论',
            time: '2024-01-15 14:30',
            type: 'text'
          },
          {
            id: 2,
            senderId: 'user2',
            senderName: '李主任',
            content: '同意张老师的观点，建议增加实践案例',
            time: '2024-01-15 15:15',
            type: 'text'
          },
          {
            id: 3,
            senderId: 'user3',
            senderName: '王同事',
            content: '我这里有一些相关资料，可以分享给大家',
            time: '2024-01-15 16:20',
            type: 'text'
          }
        ]
  ));

  // 在组织培训分类变化时保持消息与培训群一致
  useEffect(() => {
    if (selectedCategory === 'organizational_training') {
      setDiscussionMessages(getNewTeacherTrainingMessages());
    }
  }, [selectedCategory]);

  // 初始化可用工具数据
  useEffect(() => {
    const { tools, categories } = initializeAvailableTools();
    setAvailableTools(tools);
    setToolCategories(categories);
  }, []);

  // 调试：监控 currentView 变化
  useEffect(() => {
    console.log('currentView 变化为:', currentView);
  }, [currentView]);

  // 通过 initialView 初始化到指定视图（用于调试）
  useEffect(() => {
    if (!initialView) return;
    if (initialView === 'training-plan-fullscreen') {
      const record = {
        id: Date.now(),
        title: '新教师入职线上培训具体方案',
        type: 'training-plan',
        source: '调试路径',
        time: '刚刚'
      };
      state.setRightPanelTrainingPlanRecord(record);
      const defaultContent = {
        title: record.title,
        overview: '本培训方案旨在提升参训人员的专业技能和综合素质。',
        schedule: [
          {
            id: 1,
            title: '基础理论学习',
            duration: '2小时',
            type: 'video',
            description: '学习相关理论知识和基础概念',
            videos: [
              { id: 'v1', title: '理论基础第一讲', duration: '30分钟' },
              { id: 'v2', title: '理论基础第二讲', duration: '30分钟' },
              { id: 'v3', title: '案例分析', duration: '60分钟' }
            ]
          },
          {
            id: 2,
            title: '实践操作训练',
            duration: '3小时',
            type: 'practice',
            description: '通过实际操作加深理解',
            videos: [
              { id: 'v4', title: '操作演示', duration: '90分钟' },
              { id: 'v5', title: '实践指导', duration: '90分钟' }
            ]
          },
          {
            id: 3,
            title: '综合评估',
            duration: '1小时',
            type: 'assessment',
            description: '对学习成果进行综合评估',
            videos: [
              { id: 'v6', title: '评估说明', duration: '60分钟' }
            ]
          }
        ],
        participants: [
          { id: 1, name: '张三', department: '技术部', position: '工程师', status: '已报名' },
          { id: 2, name: '李四', department: '产品部', position: '产品经理', status: '已报名' },
          { id: 3, name: '王五', department: '设计部', position: 'UI设计师', status: '待确认' },
          { id: 4, name: '赵六', department: '运营部', position: '运营专员', status: '已报名' }
        ],
        totalDuration: '6小时',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        location: '培训中心A座201室'
      };
      state.setRightPanelTrainingPlanContent(defaultContent);
      setCurrentView(VIEW_MODES.TRAINING_PLAN_FULLSCREEN);
    } else if (initialView === 'training-plan-three-column') {
      const record = {
        id: Date.now(),
        title: '新教师入职线上培训具体方案',
        type: 'training-plan',
        source: '调试路径',
        time: '刚刚'
      };
      state.setLeftPanelTrainingPlanRecord(record);
      state.setLeftPanelTrainingPlanContent({ title: record.title });
      setCurrentView(VIEW_MODES.TRAINING_PLAN_THREE_COLUMN);
    }
  }, []);

  // 调试：监控 selectedScenarios 变化
  useEffect(() => {
    console.log('selectedScenarios 变化为:', selectedScenarios);
  }, [selectedScenarios]);

  // 事件处理函数集合
  const materialHandlers = {
    onPlayVideo: (material) => {
      setSelectedMaterial(material);
      setCurrentView(VIEW_MODES.VIDEO);
      setVideoStartTime(0);
      
      // 自动选中当前播放的视频记录
      const videoId = `video-${material.id}`;
      if (!state.selectedMaterials.includes(videoId)) {
        state.setSelectedMaterials(prev => [...prev, videoId]);
      }
      
      message.success(`正在播放视频：${material.title}`);
    },
    onViewMaterial: (material, type) => {
      console.log('🎯 NoteEditPage onViewMaterial 被调用', { 
        material, 
        type, 
        preferredView: material?.preferredView,
        currentCategory: state?.note?.category || selectedCategory 
      });
      
      if (type === 'video') {
        materialHandlers.onPlayVideo(material);
        return;
      }
      // 考试评阅：进入全屏占位页，占据左中右区域
      if (type === 'exam_review') {
        try {
          setSelectedMaterial(material);
          setCurrentView(EXAM_VIEW_MODES.EXAM_REVIEW_FULLSCREEN);
          message.success(`正在查看考试评阅：${material.title || '评阅清单'}`);
        } catch (e) {
          console.warn('view exam review error:', e);
        }
        return;
      }
      // 研修成果：根据分类区分视图
      // - 我的评阅（my_evaluation）：打开研修成果评阅（三栏视图）
      // - 其他分类（如组织培训）：默认打开附件管理页（用于上传与来源关联）
      if (type === 'achievement') {
        try {
          state.setLeftPanelAchievementRecord(material);
          const currentCategory = state?.note?.category || selectedCategory || null;
          const preferView = material && material.preferredView;
          
          console.log('🔍 研修成果处理逻辑', {
            currentCategory,
            preferView,
            materialTitle: material?.title
          });
          
          if (preferView === 'attachments') {
            console.log('✅ 强制进入附件管理页');
            setCurrentView(VIEW_MODES.ACHIEVEMENT_DETAIL);
            message.success(`打开附件管理：${material.title}`);
          } else if (currentCategory === 'my_evaluation') {
            console.log('✅ 进入三栏评阅页');
            setCurrentView(VIEW_MODES.ACHIEVEMENT_DETAIL_THREE_COLUMN);
            message.success(`正在查看研修成果评阅：${material.title}`);
          } else {
            console.log('✅ 默认进入附件管理页');
            setCurrentView(VIEW_MODES.ACHIEVEMENT_DETAIL);
            message.success(`正在查看研修成果：${material.title}`);
          }
        } catch (e) {
          console.error('❌ 研修成果查看错误:', e);
        }
        return;
      }
      // 其他类型的查看逻辑
    },
    onCapabilityNodeClick: (node) => {
      console.log('点击能力节点:', node);
    },
    onCapabilityVideoClick: (video) => {
      console.log('点击能力视频:', video);
    },
    onViewTrainingProject: (project) => {
      try {
        // 显示原始 PDF，确保与“新教师入职线上培训具体方案”内容一模一样
        const pdfUrl = new URL('../../assets/新教师入职线上培训具体方案.pdf', import.meta.url).href;

        // 通过“组织培训 > 培训项目资料”入口：仅显示左栏
        state.setRightPanelTrainingPlanRecord({ ...project, preferredLayout: 'left_only' });
        state.setRightPanelTrainingPlanContent({ pdfUrl });
        setCurrentView(VIEW_MODES.TRAINING_PLAN_FULLSCREEN);
      } catch (err) {
        console.error('打开培训方案失败:', err);
      }
    },
    onKnowledgeNodeClick: (node) => {
      console.log('点击知识节点:', node);
    },
    onKnowledgeResourceClick: (resource) => {
      console.log('点击知识资源:', resource);
    },
    onExplore: (exploreData) => {
      console.log('探索数据:', exploreData);
      message.success('探索功能完成');
    }
  };

  const aiChatHandlers = {
    onSaveToNote: (content, userQuestion) => {
      const currentCategory = getCategoryKey(state?.note?.category, selectedCategory);
      const sourceLabel = getAiTitleForCategory(currentCategory);

      const newRecord = {
        id: Date.now(),
        title: userQuestion || `AI问答笔记 - ${new Date().toLocaleString()}`,
        source: sourceLabel,
        time: '刚刚',
        type: 'note',
        content: content
      };

      setOperationRecords(prev => ({
        ...prev,
        note: [newRecord, ...prev.note]
      }));

      message.success('AI回复已保存到笔记');
    }
  };

  // 数据源检查函数 - 检查是否有勾选的来源数据
  const checkSourceData = () => {
    // 检查用户是否勾选了任何资料
    return state.selectedMaterials && state.selectedMaterials.length > 0;
  };

  // 获取数据源信息
  const getSourceDataInfo = () => {
    const selectedCount = state.selectedMaterials?.length || 0;
    const totalAvailable = (
      (state.uploadedFiles?.length || 0) +
      (state.addedTexts?.length || 0) +
      (state.courseVideos?.length || 0) +
      (state.links?.length || 0)
    );

    if (selectedCount === 0) {
      if (totalAvailable === 0) {
        return {
          total: 0,
          details: '尚未添加任何数据源'
        };
      } else {
        return {
          total: 0,
          details: `有${totalAvailable}个可用资料，但尚未勾选`
        };
      }
    }

    return {
      total: selectedCount,
      details: `已勾选${selectedCount}个资料`
    };
  };

  const operationHandlers = {
    onOperationClick: (operationType) => {
      // 检查来源数据
      if (!checkSourceData()) {
        const sourceInfo = getSourceDataInfo();
        Modal.warning({
          title: '需要添加数据源',
          content: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                操作面板上的所有工具都需要基于来源数据作为依据。
              </p>
              <p style={{ marginBottom: '12px', color: '#666' }}>
                当前数据源状态：<span style={{ color: '#999' }}>{sourceInfo.details}</span>
              </p>
              <p style={{ color: '#1890ff', fontSize: '14px' }}>
                请先添加文件、文本、视频或链接资源，然后再使用工具。
              </p>
            </div>
          ),
          okText: '我知道了',
          width: 400
        });
        return;
      }

      const operationTitles = {
        [OPERATION_TYPES.KNOWLEDGE_GRAPH]: '知识图谱',
        [OPERATION_TYPES.AUDIO]: '音频概览',
        [OPERATION_TYPES.VIDEO]: '视频概览',
        [OPERATION_TYPES.MINDMAP]: '思维导图',
        [OPERATION_TYPES.REPORT]: '分析报告',
        [OPERATION_TYPES.PPT]: 'PPT演示',
        [OPERATION_TYPES.WEBCODE]: '网页代码',
        [OPERATION_TYPES.SCENARIO]: '场景模拟',
        [OPERATION_TYPES.NOTE]: '笔记',
        'training-plan': '培训方案',
        'schedule': '课表',
        'participants': '参训人员清单',
        'question': '试题',
        'exam-paper': '试卷'
      };

      const totalMaterials = state.selectedMaterials?.length || 0;
      const newRecord = {
        id: Date.now(),
        title: `基于${totalMaterials}个资料生成${operationTitles[operationType]}`,
        source: `${totalMaterials}个来源`,
        time: '刚刚',
        type: operationType
      };

      // 对于培训方案，使用专门的生成逻辑
      if (operationType === 'training-plan') {
        // 导入培训方案生成器
        import('../utils/trainingPlanGenerator').then(({ generateComprehensiveTrainingPlan }) => {
          try {
            // 构建培训数据
            const trainingData = {
              title: `基于${totalMaterials}个资料的培训方案`,
              category: 'teaching_methods', // 默认类别
              targetAudience: '全体教师',
              duration: '6周',
              description: `基于${totalMaterials}个资料生成的综合培训方案`
            };

            // 生成完整的培训方案
            const comprehensivePlan = generateComprehensiveTrainingPlan(trainingData);
            
            // 创建包含完整内容的记录，并添加生成中状态
            const trainingPlanRecord = {
              ...newRecord,
              content: comprehensivePlan,
              id: `training_plan_${Date.now()}`,
              timestamp: new Date().toISOString(),
              isGenerating: true  // 添加生成中状态
            };

            // 添加到记录中
            setOperationRecords(prev => ({
              ...prev,
              [operationType]: [trainingPlanRecord, ...(prev[operationType] || [])]
            }));
            
            // 3秒后取消生成中状态
            setTimeout(() => {
              setOperationRecords(prev => {
                const updated = { ...prev };
                if (updated[operationType]) {
                  updated[operationType] = updated[operationType].map(r => 
                    r.id === trainingPlanRecord.id ? { ...r, isGenerating: false } : r
                  );
                }
                return updated;
              });
              
              message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
            }, 3000);
          } catch (error) {
            console.error('生成培训方案失败:', error);
            message.error('生成培训方案失败，请重试');
          }
        });
      } else if (['schedule', 'participants', 'question', 'exam-paper'].includes(operationType)) {
        // 对于其他工具，保持原有逻辑
        setOperationRecords(prev => ({
          ...prev,
          [operationType]: [newRecord, ...(prev[operationType] || [])]
        }));
        message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
      } else {
        // 其他工具保持原有的进度效果
        message.loading(`正在生成${operationTitles[operationType]}...`, 3);
        setTimeout(() => {
          setOperationRecords(prev => ({
            ...prev,
            [operationType]: [newRecord, ...(prev[operationType] || [])]
          }));
          message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
        }, 3000);
      }
    },
    
    onAddTool: () => {
      setAddToolModalVisible(true);
    },
    
    onScenarioClick: () => {
      setScenarioModalVisible(true);
    },
    
    // 添加视图切换处理函数
    onViewChange: (viewMode) => {
      setCurrentView(viewMode);
    },
    
    onRecordClick: (record) => {
      // 白板类型：当为笔记且子类型为 whiteboard，点击打开 Excalidraw
      if (record.type === 'note' && record.subType === 'whiteboard') {
        try {
          if (typeof window !== 'undefined') {
            window.open('https://excalidraw.com/', '_blank', 'noopener,noreferrer');
            message.success('已在新窗口打开 Excalidraw 白板');
          } else {
            message.info('请在浏览器中打开 https://excalidraw.com/');
          }
        } catch (err) {
          console.error('打开 Excalidraw 失败:', err);
          message.error('打开 Excalidraw 失败，请稍后重试');
        }
        return;
      }
      
      if (record.type === 'note') {
        state.setRightPanelEditingNote(record);
        const initialContent = record.content || '<p>请在此处编写您的笔记内容...</p>';
        const contentWithLinks = convertTimeToLinks(initialContent);
        state.setRightPanelNoteContent(contentWithLinks);
        state.setRightPanelView(RIGHT_PANEL_VIEWS.NOTE_EDITOR);
        return;
      }

      // 智能评阅记录：切换到研修成果评阅三栏视图，复用 AchievementDetailThreeColumn
      if (record.type === 'smart-evaluation') {
        const syntheticAchievement = {
          id: `${record.id}-achievement`,
          title: record.title || '智能评阅清单',
          tags: ['AI评阅']
        };
        state.setLeftPanelAchievementRecord(syntheticAchievement);
        setCurrentView(VIEW_MODES.ACHIEVEMENT_DETAIL_THREE_COLUMN);
        message.success('已打开智能评阅：左侧为评阅与提交清单，右侧为预览');
        return;
      }
      
      if (record.type === 'scenario') {
        // 处理场景模拟记录点击 - 在三栏区域内显示场景主页
        console.log('选择场景模拟:', record);
        console.log('当前 currentView:', currentView);
        console.log('当前 VIEW_MODES:', VIEW_MODES);

        // 统一计算安全的 iframe 源地址：优先使用缩略图，其次 files.html、htmlPath，最后兜底到心理场景HTML
        const safeIframeSrc = (
          record?.thumbnail ||
          (record?.files && record.files.html) ||
          record?.htmlPath ||
          '/gen-html/ai-mental-health-scenario.html'
        );

        const effectiveRecord = { ...record, thumbnail: safeIframeSrc };

        // 先强制重置为 materials 视图，然后再切换到场景视图
        setCurrentView(VIEW_MODES.MATERIALS);

        // 使用 setTimeout 确保状态更新顺序：先选中场景后切视图
        setTimeout(() => {
          setSelectedScenarios([effectiveRecord]);
          console.log('设置 selectedScenarios:', [effectiveRecord]);
          console.log('场景路径 thumbnail (effective):', effectiveRecord.thumbnail);

          setCurrentView(VIEW_MODES.SCENARIO_VIEW);
          console.log('切换到 VIEW_MODES.SCENARIO_VIEW:', VIEW_MODES.SCENARIO_VIEW);

          message.success(`正在加载场景：${effectiveRecord.title}`);
        }, 100);

        return;
      }

      // 视频类型：在右侧面板嵌入播放视频
      if (record.type === 'video') {
        try {
          const { courseVideos } = state;

          // 尝试根据记录中的信息匹配课程视频
          let material = null;
          if (record.videoId && Array.isArray(courseVideos)) {
            material = courseVideos.find(v => v.id === record.videoId) || null;
          }
          if (!material && record.url && Array.isArray(courseVideos)) {
            material = courseVideos.find(v => v.url === record.url) || null;
          }
          if (!material && Array.isArray(courseVideos) && courseVideos.length > 0) {
            // 回退到第一个课程视频
            material = courseVideos[0];
          }

          // 仅当是“视频概览”记录时，使用固定地址 /assets/2.mp4
          const isVideoOverview = typeof record.title === 'string' && record.title.includes('视频概览');
          if (!isVideoOverview && !material) {
            message.warning('暂无可播放的视频资源，请先在资料区添加课程视频');
            return;
          }

          // 设置选中的视频与开始时间，切换右侧为视频播放器视图（关闭宽屏）
          if (isVideoOverview) {
            // 仅“视频概览”使用固定地址 '/assets/2.mp4'
            const fixedVideo = {
              id: 'video-overview',
              title: record?.title || '视频概览',
              url: VIDEO_OVERVIEW_URL,
              videoUrl: VIDEO_OVERVIEW_URL,
              duration: record?.duration || 0,
              progress: 0,
              courseId: 'local-assets',
              courseTitle: '本地视频',
              addTime: new Date().toLocaleString('zh-CN')
            };
            state.setSelectedMaterial(fixedVideo);
          } else {
            state.setSelectedMaterial(material);
          }
          state.setVideoStartTime(record?.startTime || 0);
          state.setIsWidescreenMode(false);
          state.setRightPanelView(RIGHT_PANEL_VIEWS.VIDEO_PLAYER);
          message.success(`在右侧播放视频：${isVideoOverview ? '视频概览' : (material?.title || '视频')}`);
        } catch (err) {
          console.error('打开视频失败:', err);
          message.error('打开视频失败，请稍后重试');
        }
        return;
      }

      // 其他记录类型的处理逻辑
      if (record.type === 'question') {
        console.log('试题记录点击，record.content存在:', !!record.content);
        console.log('record.content类型:', typeof record.content);
        console.log('record.content长度:', record.content ? record.content.length : 0);
        
        // 设置试题查看状态并在右侧面板显示
        state.setRightPanelQuestionRecord(record);
        
        if (record.content) {
          state.setRightPanelQuestionContent(record.content);
        } else {
          // 如果没有content，生成默认内容
          const defaultContent = `
            <div style="padding: 20px; text-align: center;">
              <h3>📝 ${record.title}</h3>
              <p style="color: #666;">暂无具体试题内容</p>
              <p style="color: #999; font-size: 14px;">${record.source} • ${record.time}</p>
            </div>
          `;
          state.setRightPanelQuestionContent(defaultContent);
        }
        
        // 切换到试题查看视图
        state.setRightPanelView(RIGHT_PANEL_VIEWS.QUESTION_VIEWER);
        console.log('在右侧面板显示试题内容:', record.title);
        return;
      }
      
      if (record.type === 'learning-plan') {
        console.log('学习计划记录点击，record.content存在:', !!record.content);
        console.log('record.metadata存在:', !!record.metadata);
        
        // 设置学习计划查看状态并在右侧面板显示
        state.setRightPanelLearningPlanRecord(record);
        
        if (record.content) {
          state.setRightPanelLearningPlanContent(record.content);
        } else {
          // 如果没有content，生成默认内容
          const defaultContent = `
            <div style="padding: 20px; text-align: center;">
              <h3>🎯 ${record.title}</h3>
              <p style="color: #666;">智能学习计划已生成</p>
              <p style="color: #999; font-size: 14px;">${record.source} • ${record.time}</p>
            </div>
          `;
          state.setRightPanelLearningPlanContent(defaultContent);
        }
        
        // 切换到学习计划查看视图
        state.setRightPanelView(RIGHT_PANEL_VIEWS.LEARNING_PLAN_VIEWER);
        console.log('在右侧面板显示学习计划内容:', record.title);
        return;
      }
      
      if (record.type === 'training-plan') {
        console.log('培训方案记录点击，切换到全屏模式');
        
        // 设置培训方案查看状态
        state.setRightPanelTrainingPlanRecord(record);
        
        // 使用记录中的content，如果没有则生成默认内容
        if (record.content) {
          state.setRightPanelTrainingPlanContent(record.content);
        } else {
          // 如果没有content，生成默认的培训方案内容
          const defaultContent = {
            title: record.title,
            overview: '本培训方案旨在提升参训人员的专业技能和综合素质。',
            schedule: [
              {
                id: 1,
                title: '基础理论学习',
                duration: '2小时',
                type: 'video',
                description: '学习相关理论知识和基础概念',
                videos: [
                  { id: 'v1', title: '理论基础第一讲', duration: '30分钟' },
                  { id: 'v2', title: '理论基础第二讲', duration: '30分钟' },
                  { id: 'v3', title: '案例分析', duration: '60分钟' }
                ]
              },
              {
                id: 2,
                title: '实践操作训练',
                duration: '3小时',
                type: 'practice',
                description: '通过实际操作加深理解',
                videos: [
                  { id: 'v4', title: '操作演示', duration: '90分钟' },
                  { id: 'v5', title: '实践指导', duration: '90分钟' }
                ]
              },
              {
                id: 3,
                title: '综合评估',
                duration: '1小时',
                type: 'assessment',
                description: '对学习成果进行综合评估',
                videos: [
                  { id: 'v6', title: '评估说明', duration: '60分钟' }
                ]
              }
            ],
            participants: [
              { id: 1, name: '张三', department: '技术部', position: '工程师', status: '已报名' },
              { id: 2, name: '李四', department: '产品部', position: '产品经理', status: '已报名' },
              { id: 3, name: '王五', department: '设计部', position: 'UI设计师', status: '待确认' },
              { id: 4, name: '赵六', department: '运营部', position: '运营专员', status: '已报名' }
            ],
            totalDuration: '6小时',
            startDate: '2024-01-15',
            endDate: '2024-01-17',
            location: '培训中心A座201室'
          };
          state.setRightPanelTrainingPlanContent(defaultContent);
        }
        
        // 切换到培训方案全屏模式
        setCurrentView(VIEW_MODES.TRAINING_PLAN_FULLSCREEN);
        console.log('切换到培训方案全屏模式:', record.title);
        return;
      }
      
      if (record.type === 'grading') {
        console.log('阅卷报告记录点击，record.content存在:', !!record.content);
        console.log('record.gradingData存在:', !!record.gradingData);
        
        // 设置阅卷报告查看状态并在右侧面板显示
        state.setRightPanelGradingRecord(record);
        
        if (record.content) {
          state.setRightPanelGradingContent(record.content);
        } else {
          // 如果没有content，生成默认内容
          const defaultContent = `
            <div style="padding: 20px; text-align: center;">
              <h3>📊 ${record.title}</h3>
              <p style="color: #666;">智能阅卷报告已生成</p>
              <p style="color: #999; font-size: 14px;">${record.source} • ${record.time}</p>
            </div>
          `;
          state.setRightPanelGradingContent(defaultContent);
        }
        
        // 切换到阅卷报告查看视图
        state.setRightPanelView(RIGHT_PANEL_VIEWS.GRADING_VIEWER);
        console.log('在右侧面板显示阅卷报告内容:', record.title);
        return;
      }
      
      // 新增：课堂行为分析记录点击，右侧打开行为分析查看器
      if (record.type === 'classroom-behavior-analysis') {
        console.log('课堂行为分析记录点击，record.content存在:', !!record.content);
        
        // 课堂行为分析基于来源信息展示，无需设置额外右侧状态
        state.setRightPanelView(RIGHT_PANEL_VIEWS.CLASSROOM_BEHAVIOR_ANALYSIS_VIEWER);
        message.success('在右侧显示课堂行为分析');
        return;
      }
      
      if (record.type === 'classroom-evaluation') {
        console.log('课堂评价记录点击，record.content存在:', !!record.content);
        console.log('record.evaluationConfig存在:', !!record.evaluationConfig);
        
        // 设置课堂评价记录数据
        state.setRightPanelEditingNote(record);
        
        if (record.content) {
          state.setRightPanelNoteContent(record.content);
        } else {
          // 如果没有content，生成默认内容
          const defaultContent = `
            <div style="padding: 20px; text-align: center;">
              <h3>📊 ${record.title}</h3>
              <p style="color: #666;">课堂评价报告已生成</p>
              <p style="color: #999; font-size: 14px;">${record.source} • ${record.time}</p>
            </div>
          `;
          state.setRightPanelNoteContent(defaultContent);
        }
        
        // 切换到课堂评价记录全屏模式
        setCurrentView(VIEW_MODES.CLASSROOM_EVALUATION_FULLSCREEN);
        console.log('切换到课堂评价记录全屏模式:', record.title);
        return;
      }
      
      // 其他有内容的记录类型
      if (record.content) {
        setCurrentRecord(record);
        setModalContent(record.content);
        setShowContentModal(true);
        console.log('显示记录内容:', record.title);
        return;
      }
      
      console.log('点击了其他类型记录:', record);
    },
    
    onMoreAction: (action, record) => {
      switch (action) {
        case 'rename': {
          // 重命名操作记录
          let newTitle = record.title;
          Modal.confirm({
            title: '重命名',
            content: (
              <Input
                defaultValue={record.title}
                placeholder="请输入新名称"
                onChange={(e) => { newTitle = e.target.value; }}
                onPressEnter={(e) => {
                  newTitle = e.target.value;
                  // 模拟点击确定按钮
                  document.querySelector('.ant-modal-confirm-btns .ant-btn-primary')?.click();
                }}
                autoFocus
              />
            ),
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              if (!newTitle || newTitle.trim() === '') {
                message.error('名称不能为空');
                return Promise.reject();
              }
              
              if (newTitle === record.title) {
                message.info('名称没有变化');
                return;
              }
              
              // 更新记录标题
              setOperationRecords(prev => {
                const newRecords = { ...prev };
                Object.keys(newRecords).forEach(type => {
                  if (Array.isArray(newRecords[type])) {
                    newRecords[type] = newRecords[type].map(r => 
                      r.id === record.id ? { ...r, title: newTitle.trim() } : r
                    );
                  }
                });
                return newRecords;
              });
              
              message.success(`已将“${record.title}”重命名为“${newTitle.trim()}”`);
            }
          });
          break;
        }
        case 'convertToSource': {
          // 将操作记录/笔记转换为资料来源
          const newMaterial = {
            id: Date.now(),
            title: record.title,
            content: record.content || `来源于记录：${record.title}`,
            addTime: '刚刚',
            source: record.source || '操作记录转换'
          };

          // 根据记录类型添加到对应的资料数组
          if (record.type === 'report' || record.type === 'mindmap' || record.type === 'training-plan' || (record.type === 'note' && record.subType === 'document')) {
            state.setAddedTexts(prev => [newMaterial, ...prev]);
          } else if (record.type === 'video' || record.type === 'audio') {
            state.setCourseVideos(prev => [{
              ...newMaterial,
              url: record.url || 'https://converted-from-record.com'
            }, ...prev]);
          } else {
            state.setAddedTexts(prev => [newMaterial, ...prev]);
          }

          message.success(`已将"${record.title}"转换为来源并保存到资料`);
          break;
        }
        case MORE_MENU_ACTIONS.OPEN_IN_NEW_WINDOW:
          try {
            // 文档类型记录：在新窗口打开 Lexical Playground
            if (record?.type === 'note' && record?.subType === 'document') {
              if (typeof window !== 'undefined') {
                window.open('https://playground.lexical.dev/', '_blank', 'noopener,noreferrer');
                message.success('已在新窗口打开 Lexical Playground');
              } else {
                message.info('请在浏览器中打开 https://playground.lexical.dev/');
              }
              break;
            }
            const htmlContent = record?.content || '<div style="color:#999">暂无内容</div>';
            const newWin = window.open('', '_blank');
            if (newWin) {
              newWin.document.write(`<!doctype html>
                <html>
                  <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>${record?.title || '笔记'}</title>
                    <style>
                      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif; padding: 24px; line-height: 1.7; color: #1f1f1f; }
                      h1 { margin: 0 0 12px; font-size: 20px; }
                      .meta { color:#8c8c8c; margin-bottom: 16px; font-size: 12px; }
                      .content img { max-width: 100%; height: auto; }
                      .content { font-size: 14px; }
                    </style>
                  </head>
                  <body>
                    <h1>${record?.title || '笔记'}</h1>
                    <div class="meta">来源：${record?.source || '笔记'}｜时间：${record?.time || ''}</div>
                    <div class="content">${htmlContent}</div>
                  </body>
                </html>`);
              newWin.document.close();
              message.success('已在新窗口打开笔记');
            } else {
              message.error('浏览器阻止了新窗口，请允许弹窗');
            }
          } catch (err) {
            console.error('新窗口打开失败:', err);
            message.error('新窗口打开失败');
          }
          break;
        case MORE_MENU_ACTIONS.OPEN_TRAINING_SETTINGS:
          state.setRightPanelTrainingPlanRecord && state.setRightPanelTrainingPlanRecord(record);
          state.setRightPanelView && state.setRightPanelView(RIGHT_PANEL_VIEWS.TRAINING_SETTINGS_VIEWER);
          break;
        case 'submit':
          // 提交培训方案
          message.loading('正在提交培训方案...', 1);
          setTimeout(() => {
            // 更新记录状态为已提交
            setOperationRecords(prev => {
              const newRecords = { ...prev };
              Object.keys(newRecords).forEach(type => {
                if (Array.isArray(newRecords[type])) {
                  newRecords[type] = newRecords[type].map(r => 
                    r.id === record.id ? { ...r, isSubmitted: true, submitTime: new Date().toLocaleString('zh-CN') } : r
                  );
                }
              });
              return newRecords;
            });
            message.success(`培训方案"${record.title}"已成功提交！`);
            // 这里可以添加实际的提交逻辑，比如调用API
            console.log('提交培训方案:', record);
          }, 1000);
          break;
        case MORE_MENU_ACTIONS.MARK_STUDY_RESULT:
          setOperationRecords(prev => ({
            ...prev,
            note: (prev.note || []).map(note => 
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
        case MORE_MENU_ACTIONS.LINK_SOURCE:
          // 打开关联来源选择弹窗
          setRecordToLinkSource(record);
          setSelectedSourceForLink(null);
          setLinkSourceModalVisible(true);
          break;
        case MORE_MENU_ACTIONS.UNMARK_STUDY_RESULT:
          setOperationRecords(prev => ({
            ...prev,
            note: (prev.note || []).map(note => 
              note.id === record.id 
                ? { 
                    ...note, 
                    isStudyResult: false,
                    studyResultInfo: null,
                    tags: (note.tags || []).filter(tag => tag !== '研修成果')
                  }
                : note
            )
          }));
          message.success(`笔记"${record.title}"已取消标记为研修成果！`);
          break;
        case MORE_MENU_ACTIONS.COPY_TO:
          // 显示主题选择弹窗进行复制操作
          setShowThemeSelectModal(true);
          setCurrentRecord(record);
          setCurrentActionType('copy');
          break;
        case MORE_MENU_ACTIONS.MOVE_TO:
          // 显示主题选择弹窗进行移动操作
          setShowThemeSelectModal(true);
          setCurrentRecord(record);
          setCurrentActionType('move');
          break;
        case MORE_MENU_ACTIONS.DELETE:
          setOperationRecords(prev => {
            const newRecords = { ...prev };
            Object.keys(newRecords).forEach(type => {
              if (Array.isArray(newRecords[type])) {
                newRecords[type] = newRecords[type].filter(r => r.id !== record.id);
              }
            });
            return newRecords;
          });
          message.success(`已删除"${record.title}"`);
          break;
        case 'mergeToSource': {
          const ref = Array.isArray(record.sourceRefs) ? record.sourceRefs[0] : null;
          if (!ref) {
            message.warning('该记录缺少来源，无法合并');
            break;
          }
          const type = ref.type;
          const id = ref.id;
          try {
            if (type === 'file') {
              state.setUploadedFiles(prev => prev.map(f => String(f.id) === String(id) ? { ...f, mergedEvaluations: [...(f.mergedEvaluations || []), record.id] } : f));
            } else if (type === 'text') {
              state.setAddedTexts(prev => prev.map(t => String(t.id) === String(id) ? { ...t, mergedEvaluations: [...(t.mergedEvaluations || []), record.id] } : t));
            } else if (type === 'video') {
              state.setCourseVideos(prev => prev.map(v => String(v.id) === String(id) ? { ...v, mergedEvaluations: [...(v.mergedEvaluations || []), record.id] } : v));
            } else if (type === 'link') {
              state.setLinks(prev => prev.map(l => String(l.id) === String(id) ? { ...l, mergedEvaluations: [...(l.mergedEvaluations || []), record.id] } : l));
            }
            // 给记录打标记：已合并到源
            state.setOperationRecords(prev => {
              const next = { ...prev };
              Object.keys(next).forEach(k => {
                if (Array.isArray(next[k])) {
                  next[k] = next[k].map(r => r.id === record.id ? { ...r, mergedToSource: true, mergedSourceRef: ref } : r);
                }
              });
              return next;
            });
            message.success(`已合并到源：${ref.title}`);
          } catch (e) {
            message.error('合并失败，请重试');
          }
          break;
        }
        default:
          break;
      }
    }
  };

  const videoHandlers = {
    onBackToMaterials: () => {
      setCurrentView(VIEW_MODES.MATERIALS);
      setCurrentSubtitle('');
      setVideoProgress(0);
    },
    
    onVideoTimeUpdate: (currentTime, duration) => {
      console.log('[onVideoTimeUpdate] currentTime:', currentTime, 'duration:', duration, 'subtitleData length:', (state.subtitleData || []).length);
      setVideoProgress(duration > 0 ? (currentTime / duration) * 100 : 0);
      
      const subtitle = state.subtitleData.find(sub => 
        currentTime >= sub.start && currentTime <= sub.end
      );
      
      if (subtitle) {
        setCurrentSubtitle(subtitle.text);
      } else {
        setCurrentSubtitle('');
      }
    },
    
    onNoteCreated: (operationRecord) => {
      setOperationRecords(prev => ({
        ...prev,
        note: [operationRecord, ...(prev.note || [])]
      }));
    },

    onVideoProgressUpdate: (videoId, newProgress) => {
      try {
        const safeProgress = Math.max(0, Math.min(100, Number(newProgress) || 0));

        // 更新课程视频列表中的该视频进度
        if (Array.isArray(state.courseVideos)) {
          state.setCourseVideos(prev => (Array.isArray(prev) ? prev.map(v => (
            v.id === videoId ? { ...v, progress: safeProgress } : v
          )) : prev));
        }

        // 如果当前选中的视频就是该视频，同步其进度以保持 UI 一致
        state.setSelectedMaterial(prev => {
          if (!prev) return prev;
          return prev.id === videoId ? { ...prev, progress: safeProgress } : prev;
        });

        // 解析需要更新的笔记ID（优先右侧编辑器，其次页面编辑态，最后传入的 note）
        const noteId = (
          (state.rightPanelView === RIGHT_PANEL_VIEWS.NOTE_EDITOR && state.rightPanelEditingNote?.id) ||
          (state.showNoteEditor && state.editingNote?.id) ||
          (state.note?.id)
        );

        if (noteId) {
          try {
            notesService.updateVideoProgress(noteId, videoId, safeProgress);
          } catch (e) {
            console.error('更新笔记视频进度失败:', e);
          }
        }

        if (safeProgress === 100) {
          message.success('已完成该视频的观看');
        }
      } catch (err) {
        console.error('onVideoProgressUpdate 处理异常:', err);
      }
    },
    
    onToggleWidescreen: () => {
      // 切换宽屏模式
      const newMode = !state.isWidescreenMode;
      state.setIsWidescreenMode(newMode);
      
      if (newMode) {
        // 进入宽屏模式
        setCurrentView(VIEW_MODES.WIDESCREEN_VIDEO);
        message.success('已开启宽屏模式');
      } else {
        // 退出宽屏模式
        setCurrentView(VIEW_MODES.VIDEO);
        message.success('已退出宽屏模式');
      }
    }
  };

  return (
    <>

      <style>
        {`
          .subtitle-menu-item:hover {
            background: #f8f9fa !important;
          }
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.8; }
            100% { opacity: 1; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}
      </style>
      
      <div style={{ 
        display: 'flex', 
        height: '100%', 
        background: '#f5f5f5',
        transition: 'height 0.3s ease',
        overflow: 'hidden'
      }}>
        {/* 孕屏模式：视频播放器占满整个宽度 */}
        {currentView === VIEW_MODES.WIDESCREEN_VIDEO ? (
          <div style={{ 
            flex: 1, 
            background: '#fff', 
            margin: '16px', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column'
          }}>
            <VideoView 
              state={state}
              handlers={videoHandlers}
            />
          </div>
        ) : currentView === VIEW_MODES.SCENARIO_VIEW ? (
          /* 场景视图模式：占据全部三栏区域 */
          <ScenarioView 
            selectedScenarios={selectedScenarios}
            setSelectedScenarios={setSelectedScenarios}
            setCurrentView={setCurrentView}
          />
        ) : currentView === VIEW_MODES.LEARNING_PLAN_CALENDAR ? (
          /* 日历演示全屏模式：占据全部三栏区域 */
          <div style={{ 
            flex: 1, 
            background: '#f0f2f5', 
            margin: '16px', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}>
            {/* 返回按钮 - 放置在右上角 */}
            <Button 
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                setCurrentView(VIEW_MODES.MATERIALS);
                message.info('已退出日历演示全屏模式');
              }}
              style={{ 
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 1000,
                color: '#666',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              返回三栏视图
            </Button>

            {/* 日历演示内容区域 */}
            <div style={{ 
              flex: 1, 
              background: '#fff',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <CalendarCenter />
            </div>
          </div>
        ) : currentView === VIEW_MODES.CLASSROOM_EVALUATION_FULLSCREEN ? (
          /* 课堂评价记录全屏模式：占据全部三栏区域 */
          <ClassroomEvaluationFullscreen 
            state={state}
            setCurrentView={setCurrentView}
          />
        ) : currentView === EXAM_VIEW_MODES.EXAM_REVIEW_FULLSCREEN ? (
          /* 考试评阅占位页：占据全部三栏区域 */
          <ExamReviewFullPage 
            state={state}
            setCurrentView={setCurrentView}
            VIEW_MODES={VIEW_MODES}
          />
        ) : currentView === VIEW_MODES.TRAINING_PLAN_FULLSCREEN ? (
          /* 培训方案全屏模式：占据全部三栏区域 */
          <div style={{ 
            flex: 1, 
            background: '#f0f2f5', 
            margin: '16px', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}>
            {/* 培训方案内容区域 */}
            <div style={{ 
              flex: 1, 
              background: '#fff',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <TrainingPlanViewer 
                rightPanelTrainingPlanRecord={state.rightPanelTrainingPlanRecord}
                rightPanelTrainingPlanContent={state.rightPanelTrainingPlanContent}
                setRightPanelView={state.setRightPanelView}
                setRightPanelTrainingPlanRecord={state.setRightPanelTrainingPlanRecord}
                setRightPanelTrainingPlanContent={state.setRightPanelTrainingPlanContent}
                isFullscreen={true}
                setCurrentView={state.setCurrentView}
                initialLayoutMode={state.rightPanelTrainingPlanRecord?.preferredLayout === 'left_only' ? 'left' : 'both'}
                hideButtons={state.rightPanelTrainingPlanRecord?.preferredLayout === 'left_only'}
                readOnly={state.rightPanelTrainingPlanRecord?.preferredLayout === 'left_only'}
              />
            </div>
          </div>
        ) : currentView === VIEW_MODES.ACHIEVEMENT_DETAIL_THREE_COLUMN ? (
          /* 研修成果评阅三栏模式：占据三栏区域 */
          <AchievementDetailThreeColumn state={state} />
        ) : (
          /* 普通三栏布局模式 */
          <>
            {/* 左侧区域：根据当前视图显示资料收集或视频播放 */}
            {currentView === VIEW_MODES.MATERIALS ? (
              <MaterialManagement 
                state={state}
                handlers={materialHandlers}
                onBack={onBack}
                mode={mode}
                note={note}
              />
            ) : currentView === VIEW_MODES.ACHIEVEMENT_DETAIL ? (
              /* 研修成果详情三栏模式：占据左侧区域，内联展示 */
              <AchievementDetailPanel state={state} />
            ) : currentView === VIEW_MODES.LEARNING_PLAN_THREE_COLUMN ? (
              /* 学习计划日历三栏模式：占据左侧区域 */
              <div style={{ 
                flex: 4, 
                background: '#fff', 
                margin: '16px 0 0 16px', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'flex 0.3s ease'
              }}>
                <LearningPlanCalendar 
                  planData={state.rightPanelLearningPlanRecord}
                  plan={state.rightPanelLearningPlanRecord?.metadata || {}}
                  habits={['morning', 'evening']}
                  selectedDate={dayjs()}
                  onDateChange={(date) => console.log('日期变更:', date)}
                />
              </div>
            ) : currentView === VIEW_MODES.TRAINING_PLAN_THREE_COLUMN ? (
              /* 培训方案三栏模式：占据左侧区域 */
              <div style={{ 
                flex: 4.6, 
                background: '#fff', 
                margin: '16px 0 0 16px', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'flex 0.3s ease'
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', background: '#fafafa' }}>
                  <Button 
                    size="small"
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => setCurrentView(VIEW_MODES.MATERIALS)}
                  >
                    返回
                  </Button>
                </div>
                <TrainingPlanViewer 
                  rightPanelTrainingPlanRecord={state.leftPanelTrainingPlanRecord}
                  rightPanelTrainingPlanContent={state.leftPanelTrainingPlanContent}
                  setRightPanelView={state.setRightPanelView}
                  setRightPanelTrainingPlanRecord={state.setLeftPanelTrainingPlanRecord}
                  setRightPanelTrainingPlanContent={state.setLeftPanelTrainingPlanContent}
                  isFullscreen={true}
                  setCurrentView={setCurrentView}
                  hideButtons={true}
                />
              </div>
            ) : (
              <div style={{ 
                flex: 4, 
                background: '#fff', 
                margin: '16px 0 0 16px', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'flex 0.3s ease'
              }}>
                <VideoView 
                  state={state}
                  handlers={videoHandlers}
                />
              </div>
            )}

            {/* 中间问答区域 */}
            <div style={{
              // 当右侧为视频播放器时，中间区域减少30%（从5降至3.5）
              flex: (state.rightPanelView === RIGHT_PANEL_VIEWS.VIDEO_PLAYER)
                ? 3.5
                : ((state.rightPanelView === RIGHT_PANEL_VIEWS.NOTE_EDITOR || state.rightPanelView === RIGHT_PANEL_VIEWS.QUESTION_VIEWER || state.rightPanelView === RIGHT_PANEL_VIEWS.GRADING_VIEWER)
                  ? 3.5
                  : 5),
              transition: 'flex 0.3s ease'
            }}>
              <AIChat 
                state={state}
                handlers={aiChatHandlers}
                selectedCategory={selectedCategory}
              />
            </div>

            {/* 右侧操作区域 */}
            <div style={{ 
              flex: (() => {
                // 收起状态下减小 flex 值
                if (operationPanelCollapsed) {
                  return 0.23; // 收起时占用很小的宽度（容器宽度52px）
                }
                const baseRatio = currentView === VIEW_MODES.VIDEO ? 3 : (state.viewMode === VIEW_MODES.MAP ? 3 : 2.5);
                // 当右侧为视频播放器时，仅将中间减少的30%（1.5）加给右侧，左侧保持不变
                if (state.rightPanelView === RIGHT_PANEL_VIEWS.VIDEO_PLAYER) {
                  return baseRatio + 1.5;
                }
                // 笔记编辑、试题查看或阅卷报告查看状态时，保持原有增加宽度的逻辑
                if (state.rightPanelView === RIGHT_PANEL_VIEWS.NOTE_EDITOR || state.rightPanelView === RIGHT_PANEL_VIEWS.QUESTION_VIEWER || state.rightPanelView === RIGHT_PANEL_VIEWS.GRADING_VIEWER) {
                  return baseRatio * 1.5;
                }
                return baseRatio;
              })(), 
              background: '#fff', 
              margin: '16px 16px 0 0', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'flex 0.3s ease'
            }}>
              <OperationPanel 
                state={{ ...state, setOperationPanelCollapsed }}
                handlers={operationHandlers}
                hideEmptySlots
                selectedCategory={selectedCategory}
              />
        </div>

        {/* 会议模态框 */}
        <Modal
          title="会议"
          open={showMeetingModal}
          onCancel={() => {
            if (isCalling) {
              endVideoCall();
            } else {
              setShowMeetingModal(false);
            }
          }}
          footer={null}
          width="90%"
          style={{ maxWidth: '1200px' }}
          bodyStyle={{ maxHeight: '75vh', overflowY: 'auto' }}
          centered
        >
          {/* 会议布局：左侧视频/共享，右侧成员与聊天 */}
          <div style={{ display: 'flex', gap: 12, height: '100%', minHeight: 0 }}>
            {/* 左侧视频/共享区域 */}
            <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                background: '#000',
                borderRadius: 8,
                height: 480,
                overflow: 'hidden',
                position: 'relative'
              }}>
                <video
                  ref={localVideoRef}
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {!isCalling && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Button type="primary" size="large" icon={<VideoCameraOutlined />} onClick={startVideoCall}>
                      开始会议
                    </Button>
                  </div>
                )}
              </div>
              {/* 控制栏 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />} onClick={toggleMute} disabled={!isCalling}>
                    {isMuted ? '取消静音' : '静音'}
                  </Button>
                  <Button icon={<VideoCameraOutlined />} onClick={toggleVideo} disabled={!isCalling}>
                    {isVideoOn ? '关闭摄像头' : '打开摄像头'}
                  </Button>
                  <Button icon={<ShareAltOutlined />} onClick={toggleScreenShare} disabled={!isCalling}>
                    {isScreenSharing ? '停止共享' : '屏幕共享'}
                  </Button>
                </div>
                <Button danger type="primary" icon={<StopOutlined />} onClick={endVideoCall} disabled={!isCalling}>
                  结束会议
                </Button>
              </div>
            </div>

            {/* 右侧成员与聊天 */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 12, height: '100%', minHeight: 0, alignItems: 'stretch' }}>
              {/* 成员列表 */}
              <Card size="small" title={<span>成员</span>}>
                <Space wrap>
                  {Array.from(new Set(['我', ...discussionMessages.map(m => m.senderName).filter(Boolean)]))
                    .slice(0, 12)
                    .map((name, idx) => (
                      <Space key={`${name}-${idx}`} direction="vertical" align="center" style={{ width: 64 }}>
                        <Avatar>{name?.[0] || '成'}</Avatar>
                        <Typography.Text style={{ fontSize: 12 }} ellipsis>{name}</Typography.Text>
                      </Space>
                  ))}
                </Space>
              </Card>

              {/* 会议聊天（复用讨论消息） */}
              <Card 
                size="small" 
                title={<span>会议聊天</span>} 
                style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}
                bodyStyle={{ padding: 12, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
              >
                <div style={{ flex: 1, minHeight: 0, height: '100%', overflowY: 'auto' }}>
                  <List
                    size="small"
                    dataSource={discussionMessages}
                    renderItem={(msg) => (
                      <List.Item style={{ padding: '6px 0' }}>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Typography.Text strong>{msg.senderName}</Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>{msg.time}</Typography.Text>
                          </div>
                          <Typography.Text style={{ display: 'block' }}>{msg.content}</Typography.Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
                {/* 输入与发送区固定在底部 */}
                <div style={{ marginTop: 12 }}>
                  <Input.Group compact>
                    <Input
                      style={{ width: 'calc(100% - 80px)' }}
                      placeholder="输入会议聊天内容..."
                      onPressEnter={(e) => {
                        if (e.target.value.trim()) {
                          const newMessage = {
                            id: Date.now(),
                            senderId: 'me',
                            senderName: '我',
                            content: e.target.value,
                            time: new Date().toLocaleString('zh-CN', {
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            }),
                            type: 'text'
                          };
                          setDiscussionMessages(prev => [...prev, newMessage]);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button 
                      type="primary" 
                      style={{ width: 80 }}
                      onClick={(e) => {
                        const input = e.target.parentElement.querySelector('input');
                        if (input && input.value.trim()) {
                          const newMessage = {
                            id: Date.now(),
                            senderId: 'me',
                            senderName: '我',
                            content: input.value,
                            time: new Date().toLocaleString('zh-CN', {
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            }),
                            type: 'text'
                          };
                          setDiscussionMessages(prev => [...prev, newMessage]);
                          input.value = '';
                        }
                      }}
                    >
                      发送
                    </Button>
                  </Input.Group>
                </div>
              </Card>
            </div>
          </div>
        </Modal>
      </>
        )}
      </div>
      
      {/* 添加工具弹窗 */}
      <Modal
        title="添加工具"
        open={addToolModalVisible}
        onCancel={() => setAddToolModalVisible(false)}
        footer={null}
        width={600}
        centered
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[
              { key: 'audio', icon: '🎵', title: '音频概览' },
              { key: 'video', icon: '📹', title: '视频概览' },
              { key: 'mindmap', icon: '🧠', title: '思维导图' },
              { key: 'report', icon: '📊', title: '报告' },
              { key: 'ppt', icon: '📽️', title: 'PPT概览' },
              { key: 'webcode', icon: '💻', title: '网页代码' }
            ].map(tool => (
              <Card
                key={tool.key}
                size="small"
                hoverable
                onClick={() => {
                  console.log('添加工具:', tool.title);
                  message.success(`已添加${tool.title}工具`);
                  setAddToolModalVisible(false);
                }}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  borderRadius: '8px',
                  border: '1px solid #e8e8e8',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '20px 16px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{tool.icon}</div>
                  <Text style={{ fontSize: '14px', fontWeight: 500 }}>{tool.title}</Text>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Modal>
      
      {/* 场景仿真组件 */}
      <ScenarioSimulation 
        scenarioModalVisible={scenarioModalVisible}
        setScenarioModalVisible={setScenarioModalVisible}
        selectedScenarios={selectedScenarios}
        setSelectedScenarios={setSelectedScenarios}
        operationRecords={operationRecords}
        setOperationRecords={setOperationRecords}
        state={state}
      />
      
      {/* 主题选择模态框 */}
      <ThemeSelectModal
        open={showThemeSelectModal}
        onCancel={() => setShowThemeSelectModal(false)}
        currentRecord={currentRecord}
        actionType={currentActionType}
        onConfirm={(selectedTheme) => {
          console.log(`${currentActionType === 'copy' ? '复制' : '移动'}到主题:`, selectedTheme);
          message.success(`已${currentActionType === 'copy' ? '复制' : '移动'}到主题: ${selectedTheme}`);
          setShowThemeSelectModal(false);
        }}
      />
      
      {/* 内容查看弹窗 */}
      <Modal
        title={currentRecord?.title || '查看内容'}
        open={showContentModal}
        onCancel={() => setShowContentModal(false)}
        footer={null}
        width={800}
        centered
      >
        <div 
          style={{ 
            padding: '20px 0',
            maxHeight: '60vh',
            overflowY: 'auto'
          }}
          dangerouslySetInnerHTML={{ __html: modalContent }}
        />
      </Modal>
      
      {/* 悬浮消息图标 */}
      <div
        style={{
          position: 'fixed',
          bottom: `${floatIconPosition.y}px`,
          right: `${floatIconPosition.x}px`,
          zIndex: 1000,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          // 如果正在拖动，不触发点击事件
          if (isDragging) {
            e.preventDefault();
            return;
          }
          
          // 如果是"组织培训"分类，直接打开消息中心，不需要判断群组创建状态
          if (selectedCategory === 'organizational_training') {
            setShowMessageCenter(true);
            return;
          }
          
          // 其他分类下的逻辑
          if (!isGroupCreated) {
            // 如果没有创建群组，显示创建群组的提示
            Modal.confirm({
              title: '创建主题讨论群组',
              content: '该主题还没有创建讨论群组，是否现在创建？',
              okText: '创建',
              cancelText: '取消',
              onOk: () => {
                setIsGroupCreated(true);
                message.success('主题讨论群组创建成功！');
                setShowMessageCenter(true);
              }
            });
          } else {
            setShowMessageCenter(true);
          }
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            backgroundColor: isDragging ? '#40a9ff' : '#1890ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isDragging 
              ? '0 8px 24px rgba(24, 144, 255, 0.8)' 
              : '0 4px 12px rgba(24, 144, 255, 0.4)',
            transition: isDragging ? 'none' : 'all 0.3s ease',
            transform: isDragging ? 'scale(1.1)' : 'scale(1)',
            position: 'relative',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => {
            if (!isDragging) {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 6px 16px rgba(24, 144, 255, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDragging) {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.4)';
            }
          }}
        >
          <MessageOutlined style={{ fontSize: '24px', color: 'white' }} />
          {unreadMessageCount > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#ff4d4f',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                border: '2px solid white'
              }}
            >
              {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
            </div>
          )}
        </div>
       </div>
       
       {/* 关联来源弹窗 */}
       <Modal
         open={linkSourceModalVisible}
         title={
           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <span style={{ fontSize: 18 }}>🔗</span>
             <span>关联来源</span>
           </div>
         }
         centered
         okText="关联"
         cancelText="取消"
         onCancel={() => { setLinkSourceModalVisible(false); setRecordToLinkSource(null); setSelectedSourceForLink(null); }}
         onOk={() => {
           try {
             const options = buildSourceOptions();
             if (!selectedSourceForLink) {
               message.warning('请先选择一个来源');
               return;
             }
             const [type, idStr] = String(selectedSourceForLink).split(':');
             const id = isNaN(Number(idStr)) ? idStr : Number(idStr);
             const selected = options.find(o => o.value === selectedSourceForLink);
             const payload = {
               type,
               id,
               title: selected?.raw?.title || selected?.raw?.name || selected?.raw?.courseTitle || selected?.raw?.url || String(id)
             };

             const allRecords = getAllOperationRecords();
             const existingRecord = allRecords.find(r => r?.linkedSource && r.linkedSource.type === type && String(r.linkedSource.id) === String(id));
             const targetRecord = recordToLinkSource;

             const applyLink = (oldLinkedRecord) => {
               setOperationRecords(prev => {
                 const newRecords = { ...prev };
                 Object.keys(newRecords).forEach(t => {
                   if (Array.isArray(newRecords[t])) {
                     newRecords[t] = newRecords[t].map(r => {
                       if (r.id === targetRecord.id) {
                         return { ...r, linkedSource: payload };
                       }
                       if (oldLinkedRecord && r.id === oldLinkedRecord.id) {
                         const clone = { ...r };
                         delete clone.linkedSource;
                         return clone;
                       }
                       return r;
                     });
                   }
                 });
                 return newRecords;
               });
               setLinkSourceModalVisible(false);
               setRecordToLinkSource(null);
               setSelectedSourceForLink(null);
               message.success('已建立一对一关联');
             };

             if (existingRecord && existingRecord.id !== targetRecord.id) {
               Modal.confirm({
                 title: '来源已有关联，是否转移？',
                 content: (
                   <div>
                     <div style={{ marginBottom: 8 }}>该来源当前关联到：<Text strong>{existingRecord.title}</Text></div>
                     <div>确认后将解除旧记录的关联，并与新记录建立关联。</div>
                   </div>
                 ),
                 okText: '转移关联',
                 cancelText: '取消',
                 onOk: () => applyLink(existingRecord)
               });
             } else {
               applyLink(null);
             }
           } catch (e) {
             console.error('link source error:', e);
             message.error('关联来源失败，请稍后重试');
           }
         }}
       >
         <div style={{ marginBottom: 8 }}>
           <Text>请选择要关联的来源（来自材料管理）：</Text>
         </div>
         <Select
           style={{ width: '100%' }}
           placeholder="选择一个来源"
           showSearch
           optionFilterProp="label"
           value={selectedSourceForLink}
           onChange={setSelectedSourceForLink}
           options={buildSourceOptions().map(o => ({ value: o.value, label: o.label }))}
         />
         <div style={{ marginTop: 8 }}>
           <Text type="secondary">一对一关联：同一来源仅能关联一个记录</Text>
         </div>
       </Modal>

       {/* 消息讨论弹窗 */}
       <Modal
         open={showMessageCenter}
         footer={null}
         onCancel={() => { setShowMessageCenter(false); setUnreadMessageCount(0); setIsChatSplit(false); }}
         width={modalWidth}
         centered
         destroyOnClose
         title={null}
         className="discussion-modal"
         bodyStyle={{ height: 'calc(70vh + 15px)', overflowY: 'hidden', padding: 0 }}
       >
         <ChatWindow
            activeContact={selectedCategory === 'organizational_training' ? 'new_teacher_methods_training' : 'topic_discussion'}
            contacts={selectedCategory === 'organizational_training' 
              ? [{ id: 'new_teacher_methods_training', name: '新教师教学方法培训', type: 'topic', avatar: '🧑‍🏫', online: true }]
              : [{ id: 'topic_discussion', name: '主题讨论', type: 'topic', avatar: '💬', online: true }]}
            messages={discussionMessages}
            newMessage={newChatMessage}
            onMessageChange={setNewChatMessage}
            onSendMessage={() => {
              if (!newChatMessage.trim()) return;
              const newMsg = {
                id: Date.now(),
                senderId: 'me',
                senderName: '我',
                content: newChatMessage,
                time: new Date().toLocaleString('zh-CN', {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                type: 'text'
              };
              setDiscussionMessages(prev => [...prev, newMsg]);
              setNewChatMessage('');
              message.success('消息发送成功');
            }}
          />
       </Modal>
     </>
   );
 };

 export default NoteEditPage;