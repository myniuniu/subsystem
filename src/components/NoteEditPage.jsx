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
  Space,
  Tabs,
  Drawer,
  Tooltip
} from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, MessageOutlined, VideoCameraOutlined, AudioOutlined, AudioMutedOutlined, StopOutlined, ShareAltOutlined, TeamOutlined, BookOutlined, LinkOutlined, PlayCircleOutlined, MenuUnfoldOutlined, ColumnWidthOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getNewTeacherTrainingMessages } from '../data/trainingDiscussionMessages';

// 导入重构后的组件
import MaterialManagement from './MaterialManagement';
import AIChat from './AIChat';
import OperationPanel from './OperationPanel';
import VideoView from './VideoView';
import DocumentView from './DocumentView';
import ChatWindow from './ChatWindow';
import TopicDiscussion from './TopicDiscussion';
import ContactList from './ContactList';
import AchievementDetailPanel from './AchievementDetailPanel';
import AchievementDetailThreeColumn from './AchievementDetailThreeColumn';
import ExamReviewFullPage from './ExamReviewFullPage';

// 导入原有组件
import MaterialAddPage from './MaterialAddPage';
import ExploreModal from './ExploreModal';
import VideoPlayer from './VideoPlayer';
import LivePlayer from './LivePlayer';
import Supervision from './Supervision.jsx';
import CapabilityMindMap from './CapabilityMindMap.jsx';
import ClassroomBehaviorAnalysisViewer from './OperationPanel/ClassroomBehaviorAnalysisViewer';
import KnowledgeGraphMindMap from './KnowledgeGraphMindMap.jsx';

// 导入场景仿真组件
import ScenarioSimulation from './ScenarioSimulation';
import ScenarioView from './ScenarioView';
import MentalHealthCoaching from './MentalHealthCoaching';
import LearningPlanCalendarFullscreen from './LearningPlanCalendarFullscreen';
import LearningPlanCalendar from './LearningPlanCalendar';
import CalendarCenter from './CalendarCenter';
import ClassroomEvaluationFullscreen from './ClassroomEvaluationFullscreen';
import ThemeSelectModal from './ThemeSelectModal';
import TrainingPlanViewer from './OperationPanel/TrainingPlanViewer';
import TrainingDashboardViewer from './OperationPanel/TrainingDashboardViewer';
import OnDemandResourceLibrary from './OperationPanel/OnDemandResourceLibrary';
import LearningPlanViewer from './OperationPanel/LearningPlanViewer';
import SimpleTrainingPlanDetailView from './SimpleTrainingPlanDetailView';
import notesService from '../services/notesService';
import ExamForm from './ExamForm.jsx';
import EpblFlowchart from './EpblFlowchart';
import EpblFloatingToolbar from './EpblFloatingToolbar';

// 导入hooks和工具
import { useNoteEditState } from '../hooks/useNoteEditState';
import {
  VIEW_MODES,
  RIGHT_PANEL_VIEWS,
  MORE_MENU_ACTIONS,
  OPERATION_TYPES,
  TOOL_CATEGORIES,
  EXAM_VIEW_MODES,
  MENTAL_HEALTH_VIEW_MODES
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
  // 对话弹窗左右分栏拖拽宽度
  const [leftWidth, setLeftWidth] = useState(416); // 会话列表默认宽度（在基础320上+30%）
  const [isResizing, setIsResizing] = useState(false);
  const modalStartXRef = useRef(0);
  const modalStartWidthRef = useRef(0);
  const onModalResizerMouseDown = (e) => {
    setIsResizing(true);
    modalStartXRef.current = e.clientX;
    modalStartWidthRef.current = leftWidth;
    document.addEventListener('mousemove', onModalResizerMouseMove);
    document.addEventListener('mouseup', onModalResizerMouseUp);
    e.preventDefault();
  };
  const onModalResizerMouseMove = (e) => {
    const delta = e.clientX - modalStartXRef.current;
    let next = modalStartWidthRef.current + delta;
    const min = 280; const max = 640; // 限制范围
    if (next < min) next = min;
    if (next > max) next = max;
    setLeftWidth(next);
  };
  const onModalResizerMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', onModalResizerMouseMove);
    document.removeEventListener('mouseup', onModalResizerMouseUp);
  };
  // 会话列表（对话+话题）初始化：匹配截图红框两条记录
  const [modalContacts, setModalContacts] = useState(() => {
    const now = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    return [
      {
        id: 'new_teacher_training_dialogue',
        name: '新教师教学方法培训',
        type: 'group',
        avatar: '🎓',
        lastMessage: '欢迎加入培训群，先查看公告与日程',
        lastTime: now,
        unreadCount: 8,
        online: true,
      },
      {
        id: 'org_training_new_teacher_discuss',
        name: '【组织培训】新教师教学方法培训讨论',
        type: 'topic',
        avatar: '🎓',
        lastMessage: '进入主题讨论',
        lastTime: now,
        unreadCount: 0,
        online: true,
      }
    ];
  });
  const [activeModalContact, setActiveModalContact] = useState('new_teacher_training_dialogue');
  // 打开对话弹窗时，确保订阅话题条目存在（与点击订阅效果一致）
  useEffect(() => {
    if (!showMessageCenter) return;
    try {
      const now = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      setModalContacts(prev => {
        if (Array.isArray(prev) && prev.some(c => c.id === 'topic_post_2')) return prev;
        const subscribedContact = {
          id: 'topic_post_2',
          name: '学员王小明 微课互动设计是否需要准备评估表？',
          type: 'topic',
          avatar: '📌',
          lastMessage: '请问研讨的“互动设计”是否需要准备课堂观察表或学生反馈问卷？如果有模板能否提供？',
          lastTime: now,
          unreadCount: 0,
          online: true,
          isSubscribed: true
        };
        return [subscribedContact, ...(prev || [])];
      });
    } catch (e) {}
  }, [showMessageCenter]);
  
  // 对话框宽度随分栏动态调整
  const [isChatSplit, setIsChatSplit] = useState(false);
  const modalWidth = isChatSplit ? '85%' : '60%';
  const [isInnerOverlayOpen, setInnerOverlayOpen] = useState(false);

  // 督学分类：默认生成一条“现场分析报告”操作记录
  useEffect(() => {
    const cat = getCategoryKey(state?.note?.category, selectedCategory);
    try {
      if (cat === 'supervision') {
        const hasSite = Array.isArray(state.operationRecords?.['site-analysis']) && state.operationRecords['site-analysis'].length > 0;
        if (!hasSite) {
          const count = (Array.isArray(state.selectedMaterials) ? state.selectedMaterials.length : 0) || 2;
          const record = {
            id: Date.now(),
            title: `现场分析报告（${count}条取证数据）`,
            source: '督学 · 现场分析',
            time: new Date().toLocaleString('zh-CN'),
            type: 'site-analysis',
            isAIGenerated: true,
            content: `<div style=\"padding: 16px; font-family: system-ui;\"> 
              <h3>📋 现场分析报告</h3>
              <p style=\"color:#374151\">依据 ${count} 项取证数据（文件/文本/链接/视频），形成重点问题与整改建议。</p>
              <h4>重点问题</h4>
              <ul>
                <li>消防设施台账记录不完整</li>
                <li>食堂留样标签缺少日期</li>
                <li>门卫登记缺少访客佩证照片</li>
              </ul>
              <h4>整改建议</h4>
              <ol>
                <li>补齐巡检记录并明确责任人</li>
                <li>规范留样标签并留存48小时</li>
                <li>完善访客登记流程与留痕</li>
              </ol>
            </div>`
          };
          state.setOperationRecords(prev => ({
            ...(prev || {}),
            ['site-analysis']: [record, ...((prev && prev['site-analysis']) || [])]
          }));
        }
      }
    } catch (e) {}
  }, [state?.note?.category, selectedCategory]);

  // 标准化现场分析记录标题：去掉“（N条取证数据）”，追加督导对象
  useEffect(() => {
    const cat = getCategoryKey(state?.note?.category, selectedCategory);
    if (cat !== 'supervision') return;
    try {
      const list = Array.isArray(state.operationRecords?.['site-analysis']) ? state.operationRecords['site-analysis'] : [];
      if (list.length === 0) return;
      const normalize = (title) => String(title || '')
        .replace(/（\d+条取证数据）/g, '')
        .replace(/(｜[^｜]*?)$/g, '')
        .trim();
      // 解析所有督导执行来源的督导对象（如：第一小学、第二小学）
      const execTargets = (() => {
        try {
          const texts = (state.addedTexts || []).filter(x => typeof x.title === 'string' && x.title.includes('督导执行'));
          return texts.map(t => {
            const parts = String(t.title || '').split('｜');
            return parts.length > 1 ? parts[parts.length - 1] : '';
          }).filter(Boolean);
        } catch (e) { return []; }
      })();

      const parseTargetFromRecordTitle = (title) => {
        const m = /｜([^｜]+)$/.exec(String(title || ''));
        return m ? m[1] : '';
      };
      const parseTargetFromRef = (refTitle) => {
        const parts = String(refTitle || '').split('｜');
        return parts.length > 1 ? parts[parts.length - 1] : '';
      };

      const updated = list.map((r, idx) => {
        const original = r.title || '现场分析报告';
        const base = normalize(original);
        // 优先保留记录自身已带的对象，其次从来源快照提取，再次按顺序回落
        let target = parseTargetFromRecordTitle(original);
        if (!target && Array.isArray(r.sourceRefs) && r.sourceRefs.length > 0) {
          target = parseTargetFromRef(r.sourceRefs[0]?.title || '');
        }
        if (!target) target = execTargets[idx] || execTargets[0] || '';
        return { ...r, title: `${base}${target ? `｜${target}` : ''}` };
      });
      state.setOperationRecords(prev => ({
        ...(prev || {}),
        ['site-analysis']: updated
      }));
    } catch (e) {}
  }, [state?.operationRecords?.['site-analysis'], selectedCategory]);

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
  // 右下角动图显示/悬停控制
  const [assistantGifVisible, setAssistantGifVisible] = useState(true);
  // 统一用容器悬停态，避免在 GIF 与按钮之间切换造成闪烁
  const [isGifGroupHovered, setIsGifGroupHovered] = useState(false);
  const [isBubbleHovered, setIsBubbleHovered] = useState(false);
  // 分享弹窗可见性
  const [shareModalVisible, setShareModalVisible] = useState(false);
  // 素材库抽屉
  const [assetsDrawerVisible, setAssetsDrawerVisible] = useState(false);
  
  // 操作面板收起状态
  const [operationPanelCollapsed, setOperationPanelCollapsed] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  // E-PBL 流程图选中节点（用于触发左右分区显示）
  const [epblSelectedNode, setEpblSelectedNode] = useState(null);
  // 全局抑制：点击元素不要显示右侧（包含流程图节点）
  const SUPPRESS_RIGHT_PANEL_CLICK = true;

  // 关联来源选择弹窗状态
  const [linkSourceModalVisible, setLinkSourceModalVisible] = useState(false);
  const [recordToLinkSource, setRecordToLinkSource] = useState(null);
  // 选课视图页签（候选 / 自选）
  const [courseTabKey, setCourseTabKey] = useState('candidate');

  // 若右侧视图进入考试表单，则自动切换为全屏试卷视图（覆盖左中右区域）
  useEffect(() => {
    if (state?.rightPanelView === RIGHT_PANEL_VIEWS.EXAM_FORM_VIEWER) {
      setCurrentView(EXAM_VIEW_MODES.EXAM_FORM_FULLSCREEN);
    }
  }, [state?.rightPanelView]);

  // 课程选择事件监听：打开中+右联动视图
  useEffect(() => {
    const openHandler = (e) => {
      const phaseId = e?.detail?.phaseId;
      const selectedIds = e?.detail?.selectedIds || [];
      if (phaseId != null) {
        state.setCourseSelectionPhaseId(phaseId);
        state.setCourseSelectionSelectedIds(selectedIds);
        state.setRightPanelView(RIGHT_PANEL_VIEWS.COURSE_SELECTION_VIEWER);
      }
    };
    window.addEventListener('openCourseSelection', openHandler);
    return () => window.removeEventListener('openCourseSelection', openHandler);
  }, []);
  const [selectedSourceForLink, setSelectedSourceForLink] = useState(null);

  const renderLeftCollapsedBar = () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      paddingTop: 4 
    }}>
      <Tooltip title="展开" placement="right">
        <Button
          type="text"
          size="small"
          icon={<MenuUnfoldOutlined />}
          onClick={() => setLeftPanelCollapsed(false)}
          style={{
            fontSize: '12px',
            height: '28px',
            width: '28px',
            borderRadius: '6px',
            background: '#f5f5f5'
          }}
        />
      </Tooltip>
      <div style={{ 
        width: 34, 
        height: 34, 
        background: 'linear-gradient(135deg, #e8f7ff 0%, #cce7ff 100%)', 
        borderRadius: 8, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: 16, 
        marginTop: 6 
      }}>📁</div>
    </div>
  );

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

  // 监听来自窗口控件覆盖（WCO）的播放导航事件
  useEffect(() => {
    const handler = (e) => {
      try {
        const payload = e && e.detail ? e.detail : {};
        const material = {
          id: payload.id || `wco_${Date.now()}`,
          title: payload.title || '教学基本规范（课堂纪律与仪表）',
          type: 'video',
          url: payload.url || VIDEO_OVERVIEW_URL
        };
        materialHandlers.onPlayVideo(material);
      } catch (err) {
        // no-op
      }
    };
    window.addEventListener('openNoteEditPlayback', handler);
    return () => window.removeEventListener('openNoteEditPlayback', handler);
  }, []);

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
  
  const [discussionMessages, setDiscussionMessages] = useState(() => {
    if (selectedCategory === 'organizational_training') {
      return getNewTeacherTrainingMessages();
    }
    if (selectedCategory === 'supervision' || state?.note?.category === 'supervision') {
      const baseTime = new Date('2025-01-26T09:00:00+08:00');
      const fmt = (d) => d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      return [
        { id: 'sv_001', senderId: '主督学', senderName: '主督学', content: '本次“安全专项督导（2025年开学季）”覆盖消防、卫生、校舍、安保、演练、网络等六大模块，请分工完成排查并在2月1日前上传材料。', time: fmt(baseTime), type: 'text' },
        { id: 'sv_002', senderId: '协同督学', senderName: '协同督学', content: '现场检查将按“楼栋—功能区—重点点位”走查，请各部门开放必要场地与资料。 @督学专家 有什么好的建议？', time: fmt(new Date(baseTime.getTime()+5*60*1000)), type: 'text' },
        { id: 'sv_ai_003', senderId: '督学专家', senderName: '督学专家', content: '【AI建议】统一使用“检查清单+照片+整改单”模板，便于汇总与追踪。', time: fmt(new Date(baseTime.getTime()+10*60*1000)), type: 'text' },
        { id: 'sv_004', senderId: '校安保负责人', senderName: '校安保负责人', content: '门禁与访客登记流程已优化上线（扫码+证件核验），高峰时段增派人员。', time: fmt(new Date(baseTime.getTime()+11*60*1000)), type: 'text' },
        { id: 'sv_005', senderId: '后勤主任', senderName: '后勤主任', content: '食堂卫生与校舍加固安排到位，整改材料将按模块上传。', time: fmt(new Date(baseTime.getTime()+12*60*1000)), type: 'text' }
      ];
    }
    return [
      { id: 1, senderId: 'user1', senderName: '张老师', content: '这个主题的内容很有深度，值得深入讨论', time: '2024-01-15 14:30', type: 'text' },
      { id: 2, senderId: 'user2', senderName: '李主任', content: '同意张老师的观点，建议增加实践案例', time: '2024-01-15 15:15', type: 'text' },
      { id: 3, senderId: 'user3', senderName: '王同事', content: '我这里有一些相关资料，可以分享给大家', time: '2024-01-15 16:20', type: 'text' }
    ];
  });

  // 对话类型（培训群）初始化示例消息
  const [dialogueMessages, setDialogueMessages] = useState(() => {
    const fmt = (d) => d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    const base = new Date();
    return [
      { id: 'dlg_001', senderId: '培训管理员', senderName: '培训管理员', content: '欢迎加入“新教师教学方法培训”。请先查看公告与日程。', time: fmt(base), type: 'text' },
      { id: 'dlg_002', senderId: '学员王小明', senderName: '学员王小明', content: '大家好，我已报名本次培训，期待交流。', time: fmt(new Date(base.getTime()+2*60*1000)), type: 'text' },
      { id: 'dlg_003', senderId: '我', senderName: '我', content: '收到，今晚会先浏览课程主页和资源区。', time: fmt(new Date(base.getTime()+4*60*1000)), type: 'text' },
    ];
  });

  // 根据当前会话获取消息（对话或话题）
  const getModalMessages = () => {
    if (activeModalContact === 'org_training_new_teacher_discuss') return getNewTeacherTrainingMessages();
    return dialogueMessages;
  };

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
      
      
    },
    onViewMaterial: (material, type) => {
      console.log('🎯 NoteEditPage onViewMaterial 被调用', { 
        material, 
        type, 
        preferredView: material?.preferredView,
        currentCategory: state?.note?.category || selectedCategory 
      });
      // 链接/文件的非视频类型：在左侧整块区域进行文档预览
      if (type === 'link') {
        const isPdf = typeof material?.url === 'string' && /\.pdf(\?.*)?$/i.test(material.url);
        const docMaterial = {
          id: material.id || `doc-${Date.now()}`,
          title: material.title || (isPdf ? 'PDF 文档' : '网页链接'),
          type: isPdf ? 'pdf' : 'document',
          url: material.url
        };
        setSelectedMaterial(docMaterial);
        setCurrentView(VIEW_MODES.DOCUMENT);
        message.success(`已在左侧预览：${docMaterial.title}`);
        return;
      }
      
      if (type === 'video') {
        materialHandlers.onPlayVideo(material);
        return;
      }
      // 督导执行：全屏打开督学模块的执行编辑器
      if (type === 'supervision-execution') {
        try {
          // 从 Supervision.jsx 的专项模板生成完整执行项
          const buildItemsFromTemplate = () => {
            try {
              const supMod = require('./Supervision.jsx');
            } catch (e) {}
            // 兜底：本地静态模板片段，确保有内容
            const fallbackChecklist = [
              { category: '消防安全', item: '灭火器与消火栓', standard: '在有效期、压力正常、定点摆放，疏散通道畅通' },
              { category: '食堂卫生', item: '环境与留样', standard: '清洁消毒记录齐全，食品留样规范，台账可追溯' },
              { category: '校园安保', item: '出入登记与值守', standard: '门卫值守到位，登记完整，访客佩证入校' }
            ];
            return fallbackChecklist.map(row => ({
              category: row.category,
              item: row.item,
              standard: row.standard,
              issue: '', action: '', owner: '', progress: '未开始', tracking: '', attachments: []
            }));
          };
          const execRecord = {
            id: `exec_from_material_${Date.now()}`,
            title: material.title || '督导执行',
            description: '按检查项推进并记录问题与整改跟踪',
            type: 'special',
            status: 'started',
            planId: 'plan_002',
            tags: ['执行','督学'],
            targets: (material.title && material.title.includes('第一小学')) ? ['第一小学'] : (material.title && material.title.includes('第二小学')) ? ['第二小学'] : [],
            items: buildItemsFromTemplate()
          };
          setCurrentRecord(execRecord);
          setCurrentView(VIEW_MODES.SUPERVISION_EXECUTION_FULLSCREEN);
          message.success(`已打开督导执行：${execRecord.targets[0] || ''}`);
        } catch (e) {
          console.warn('open supervision execution error:', e);
        }
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
        [OPERATION_TYPES.AUDIO]: '音频播客',
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
        'exam-paper': '试卷',
        [OPERATION_TYPES.SITE_ANALYSIS]: '现场分析'
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
      } else if (operationType === OPERATION_TYPES.SITE_ANALYSIS) {
        const selected = state.selectedMaterials || [];
        const count = selected.length;
        const html = `
          <div style="font-family: system-ui;">
            <h2>现场分析报告</h2>
            <p style=\"color:#374151\">依据 ${count} 项取证数据（文件/文本/链接/视频），对校园安全相关检查项进行聚类与要点提取，形成问题与整改建议。</p>
            <h3>重点问题</h3>
            <ul>
              <li>消防设施台账记录不完整（建议：补齐巡检记录，明确责任人）</li>
              <li>食堂留样标签缺少日期（建议：按规范粘贴并留存48小时）</li>
              <li>门卫登记缺少访客佩证照片（建议：完善入校流程与留痕）</li>
            </ul>
            <h3>整改建议</h3>
            <ol>
              <li>制定每周巡检清单并张贴，检查人签名留档。</li>
              <li>按批次记录留样标签：时间/责任人/批次。</li>
              <li>完善访客登记字段：证件号、进出时间、随行照片。</li>
            </ol>
            <div style=\"margin-top:12px;color:#6b7280;font-size:12px\">自动生成 · 现场分析</div>
          </div>
        `;
        const record = {
          id: Date.now(),
          title: `现场分析报告（${count}条取证数据）`,
          source: `${count}条来源`,
          time: '刚刚',
          type: OPERATION_TYPES.SITE_ANALYSIS,
          content: html
        };
        setOperationRecords(prev => ({
          ...prev,
          [OPERATION_TYPES.SITE_ANALYSIS]: [record, ...(prev[OPERATION_TYPES.SITE_ANALYSIS] || [])]
        }));
        message.success('现场分析报告已生成并添加到操作记录');
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
      // 开关：点击元素不显示右侧菜单（保留 E-PBL 白板全屏流程图）
      const suppressRightPanelOnClick = true;
      // 白板类型：兼容旧记录（type=note, subType=whiteboard）与新记录（type=whiteboard）
      if ((record.type === 'note' && record.subType === 'whiteboard') || record.type === 'whiteboard') {
        const catKey = getCategoryKey(state?.note?.category, selectedCategory);
        if (catKey === 'e_pbl') {
          setCurrentRecord(record);
          setCurrentView(VIEW_MODES.EPBL_FLOWCHART_FULLSCREEN);
          message.success('已在全屏区域显示 E-PBL 流程图');
          return;
        }
        // 非 E-PBL 分类：打开 Excalidraw
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
      
      if (record.type === 'note' || record.type === 'document') {
        // 特例：EPBL教学设计文档，切换到全屏文档视图，加载富文本HTML模板
        const isEpblDesignDoc = ((record.subType === 'document' || record.type === 'document') && String(record.title || '').includes('EPBL教学设计'));
        if (isEpblDesignDoc) {
          state.setSelectedMaterial({
            id: record.id,
            title: record.title || 'EPBL教学设计',
            type: 'document',
            url: '/assets/项目教学设计模板.html'
          });
          setCurrentView(VIEW_MODES.DOCUMENT_FULLSCREEN);
          message.success('已在全屏区域打开：EPBL教学设计');
          return;
        }
        // 文档/笔记类型：始终打开右侧富文本编辑器
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
          if (!suppressRightPanelOnClick) {
            state.setRightPanelView(RIGHT_PANEL_VIEWS.VIDEO_PLAYER);
            message.success(`在右侧播放视频：${isVideoOverview ? '视频概览' : (material?.title || '视频')}`);
          }
        } catch (err) {
          console.error('打开视频失败:', err);
          message.error('打开视频失败，请稍后重试');
        }
        return;
      }

      // 其他记录类型的处理逻辑
      if (record.type === 'memory-cards') {
        const buildExercises = () => {
          const q = [];
          q.push({ id: `qa_${Date.now()}_1`, type: '问答题', question: '概述新教师教学方法培训的核心目标。', answer: '帮助新教师掌握课堂组织、教学设计与评价等关键方法。' });
          q.push({ id: `fb_${Date.now()}_2`, type: '填空题', question: '教学目标需同时关注知识、________、情感态度与价值观。', answer: '能力' });
          q.push({ id: `qa_${Date.now()}_3`, type: '问答题', question: '说明新教师常见课堂管理难点及应对策略。', answer: '难点包括注意力维持、规则建立与差异管理；策略为明确规则、强化正向反馈、分层任务。' });
          q.push({ id: `fb_${Date.now()}_4`, type: '填空题', question: '教学设计三要素通常为目标、内容与________。', answer: '评价' });
          q.push({ id: `qa_${Date.now()}_5`, type: '问答题', question: '描述一次“新教师教学方法培训”的有效研修活动流程。', answer: '导入与目标说明→示范课观摩→分组研讨→微格演练→反馈与改进→行动计划。' });
          q.push({ id: `fb_${Date.now()}_6`, type: '填空题', question: '提问技巧中，等待时间建议不少于________秒。', answer: '3' });
          q.push({ id: `qa_${Date.now()}_7`, type: '问答题', question: '如何在培训后促进新教师的迁移应用？', answer: '提供课堂任务清单、同伴互助、督导跟进与实践反思模板。' });
          q.push({ id: `fb_${Date.now()}_8`, type: '填空题', question: '分层教学中，任务应具有________与支持差异化的资源。', answer: '梯度' });
          q.push({ id: `qa_${Date.now()}_9`, type: '问答题', question: '简述“以学为中心”的课堂组织要点。', answer: '明确学习目标、设置真实任务、促进互动合作、及时反馈与评价。' });
          q.push({ id: `fb_${Date.now()}_10`, type: '填空题', question: '形成性评价强调在教学过程中收集证据并用于________教学。', answer: '改进' });
          return q;
        };
        const exercises = buildExercises();
        state.setRightPanelMemoryCardsRecord({ ...record, exercises });
        state.setRightPanelView(RIGHT_PANEL_VIEWS.MEMORY_CARD_VIEWER);
        return;
      }

      if (record.type === 'report') {
        const topic = '新教师教学方法培训';
        const content = {
          metadata: {
            title: `${topic}报告`,
            generatedAt: new Date().toLocaleString('zh-CN'),
            source: record.source || '基于当前数据源'
          }
        };
        state.setRightPanelReportRecord({ ...record, topic, subType: 'study-guide' });
        state.setRightPanelReportContent(content);
        state.setRightPanelView(RIGHT_PANEL_VIEWS.REPORT_VIEWER);
        return;
      }

      if (record.type === 'quiz') {
        const buildQuiz = () => {
          const list = [];
          list.push({ stem: '根据对某省中学新进教师的调查，他们认为个人在下列哪个方面的能力最为不足？', options: ['教学反思与教研基础', '教学的组织与实施能力', '教学活动设计能力', '班级管理与育德体验'], answer: 1, explain: '调查结果的图里显示，超过一半的教师认为组织与实施能力存在不足，是所有选项中比例最高的。', hint: '请回想调查研究中，哪一项教学相关的实践能力被超过半数的教师选为自己的短板。' });
          list.push({ stem: '在设计培训教学目标时，哪项表述更为合理？', options: ['完成知识点讲解', '提升课堂互动与反馈质量', '布置作业并批改', '统一教学进度'], answer: 1, explain: '目标应关注学习者的行为与结果，如互动与反馈质量的提升。', hint: '关注学习者行为改变与课堂质量提升，而不仅是完成讲解或任务。' });
          list.push({ stem: '新教师培训中，促使学习迁移的有效做法是？', options: ['仅观看示范课', '提供实践清单并同伴互助', '增加讲座数量', '减少作业量'], answer: 1, explain: '提供实践清单、同伴互助与督导跟进更能促进迁移应用。', hint: '思考哪些安排能让教师把培训内容带到真实课堂中去。' });
          list.push({ stem: '课堂管理策略中，最有助于维持注意力的是？', options: ['随机点名', '明确课堂规则与强化正反馈', '延长讲授时间', '减少互动'], answer: 1, explain: '明确规则与正向反馈能更稳定地维持注意力。', hint: '考虑能稳定课堂秩序并鼓励学生参与的做法。' });
          list.push({ stem: '分层教学设计更强调？', options: ['统一难度', '任务梯度与差异化支持', '仅按成绩分组', '减少评价'], answer: 1, explain: '分层教学强调任务梯度与提供差异化资源支持。', hint: '关注任务的难度梯度与资源支持是否能照顾差异。' });
          list.push({ stem: '有效提问的等待时间建议不少于？', options: ['1秒', '3秒', '10秒', '无需等待'], answer: 1, explain: '等待不少于3秒有助于学生思考与全员参与。', hint: '想想通常建议的“等待时间”长度，能否让学生有思考空间。' });
          list.push({ stem: '形成性评价的核心是？', options: ['期末评分', '过程证据用于改进教学', '只看作业分数', '统一考试'], answer: 1, explain: '在教学过程中收集证据并用于改进教学是核心。', hint: '关键词是“过程”“证据”“用于改进”。' });
          list.push({ stem: '“以学为中心”的课堂组织要点不包括？', options: ['明确学习目标', '设置真实任务', '促进互动合作', '减少反馈环节'], answer: 3, explain: '以学为中心强调及时反馈而不是减少反馈。', hint: '想想“以学为中心”是否需要更多反馈而不是更少。' });
          list.push({ stem: '新教师培训研修流程中，哪一步更有助于技能定型？', options: ['示范课观摩', '微格演练与反馈改进', '集中讲座', '资料阅读'], answer: 1, explain: '微格演练结合反馈更有助于技能形成与定型。', hint: '考虑哪一步让教师亲自实践并获得针对性反馈。' });
          list.push({ stem: '教学设计三要素通常为？', options: ['教材、教师、学生', '目标、内容与评价', '方法、过程、结果', '时间、地点、对象'], answer: 1, explain: '教学设计强调目标、内容与评价的一致性。', hint: '从“教学设计”常见表述中挑选与目标、内容、评价相关的组合。' });
          return list;
        };
        const questions = buildQuiz();
        state.setRightPanelQuizRecord({ ...record, questions });
        state.setRightPanelView(RIGHT_PANEL_VIEWS.QUIZ_VIEWER);
        return;
      }

      if (record.type === 'question') {
        console.log('试题记录点击，record.content存在:', !!record.content);
        console.log('record.content类型:', typeof record.content);
        console.log('record.content长度:', record.content ? record.content.length : 0);
        
        if (suppressRightPanelOnClick) return;
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
        
        // 设置学习计划查看状态
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
        
        setCurrentView(VIEW_MODES.LEARNING_PLAN_FULLSCREEN);
        console.log('切换到学习计划全屏模式:', record.title);
        return;
      }
      
      if (record.type === 'training-plan') {
        console.log('培训方案记录点击，切换到全屏模式');
        // 允许培训方案点击，即使开启了右侧抑制开关；培训方案走全屏视图不依赖右侧面板
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

      // 新增：培训报表记录点击，切换到全屏培训报表视图
      if (record.type === 'training-dashboard') {
        try {
          setCurrentRecord(record);
          setCurrentView(VIEW_MODES.TRAINING_DASHBOARD_FULLSCREEN);
          message.success(`已打开培训报表：${record.title}`);
        } catch (e) {
          console.error('打开培训报表失败:', e);
          message.error('打开培训报表失败，请稍后重试');
        }
        return;
      }
      
      // 督学任务：进入督学模块的督导任务编辑器（全屏）
      if (record.type === 'supervision-task') {
        setCurrentRecord(record);
        setCurrentView(VIEW_MODES.SUPERVISION_TASK_FULLSCREEN);
        message.success('已打开督学任务编辑页面');
        return;
      }
      
      // 新增：课堂行为分析记录点击，全屏显示行为分析
      if (record.type === 'classroom-behavior-analysis') {
        setCurrentRecord(record);
        setCurrentView(VIEW_MODES.CLASSROOM_BEHAVIOR_ANALYSIS_FULLSCREEN);
        message.success('已打开课堂行为分析全屏视图');
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
          if (record.type === 'report' || record.type === 'mindmap' || record.type === 'training-plan' || record.type === 'document' || (record.type === 'note' && record.subType === 'document')) {
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
            if ((record?.type === 'note' && record?.subType === 'document') || record?.type === 'document') {
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
            try {
              // 在资料管理默认模块生成“培训项目资料”条目，并打上“执行中”标签
              window.dispatchEvent(new CustomEvent('trainingPlanSubmitted', { detail: { title: record.title } }));
            } catch (e) { /* no-op */ }
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

  // 监听打开培训报表全屏事件
  useEffect(() => {
    const openDashboard = () => setCurrentView(VIEW_MODES.TRAINING_DASHBOARD_FULLSCREEN);
    window.addEventListener('openTrainingDashboardFullscreen', openDashboard);
    return () => window.removeEventListener('openTrainingDashboardFullscreen', openDashboard);
  }, []);

  // 监听督学任务取消编辑事件：返回三栏视图
  useEffect(() => {
    const exitSupervision = () => setCurrentView(VIEW_MODES.MATERIALS);
    window.addEventListener('exitSupervisionFullscreen', exitSupervision);
    return () => window.removeEventListener('exitSupervisionFullscreen', exitSupervision);
  }, []);

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
        background: '#fff',
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
        ) : currentView === MENTAL_HEALTH_VIEW_MODES.MENTAL_HEALTH_COACHING_FULLSCREEN ? (
          /* 心理健康辅导场景训练全屏：占据全部三栏区域 */
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
            <Button 
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                setCurrentView(VIEW_MODES.MATERIALS);
                message.info('已退出心理辅导场景训练全屏');
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
            <div style={{ flex: 1, background: '#fff', borderRadius: '12px', overflow: 'auto' }}>
              <MentalHealthCoaching onBack={() => setCurrentView(VIEW_MODES.MATERIALS)} />
            </div>
          </div>
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
        ) : currentView === VIEW_MODES.CLASSROOM_BEHAVIOR_ANALYSIS_FULLSCREEN ? (
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
            <Button 
              type="default"
              shape="circle"
              size="small"
              icon={<ArrowLeftOutlined />}
              onClick={() => setCurrentView(VIEW_MODES.MATERIALS)}
              style={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }}
            />
            <div style={{ flex: 1, background: '#fff' }}>
              {(() => {
                const totalSources = (Array.isArray(state.uploadedFiles) ? state.uploadedFiles.length : 0)
                  + (Array.isArray(state.addedTexts) ? state.addedTexts.length : 0)
                  + (Array.isArray(state.courseVideos) ? state.courseVideos.length : 0)
                  + (Array.isArray(state.links) ? state.links.length : 0);
                const sourceInfo = { total: totalSources };
                const setRightPanelView = () => setCurrentView(VIEW_MODES.MATERIALS);
                return (
                  <ClassroomBehaviorAnalysisViewer 
                    sourceInfo={sourceInfo}
                    setRightPanelView={setRightPanelView}
                  />
                );
              })()}
            </div>
          </div>
        ) : currentView === VIEW_MODES.TRAINING_DASHBOARD_FULLSCREEN ? (
          /* 培训报表全屏模式：占据全部三栏区域 */
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
            {/* 左上角返回图标 */}
            <Button 
              type="default"
              shape="circle"
              size="small"
              icon={<ArrowLeftOutlined />}
              onClick={() => setCurrentView(VIEW_MODES.MATERIALS)}
              style={{ 
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 1000,
                color: '#666',
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid #d9d9d9',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
              }}
            />

            {/* 培训报表内容区域 */}
            <div style={{ 
              flex: 1, 
              background: '#fff',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <TrainingDashboardViewer 
                record={currentRecord}
                content={currentRecord?.content}
                onBack={() => setCurrentView(VIEW_MODES.MATERIALS)}
              />
            </div>
          </div>
        ) : currentView === VIEW_MODES.SUPERVISION_TASK_FULLSCREEN ? (
          /* 督学任务编辑器全屏模式：占据全部三栏区域 */
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
            {/* 左上角返回图标 */}
            <Button 
              type="default"
              shape="circle"
              size="small"
              icon={<ArrowLeftOutlined />}
              onClick={() => setCurrentView(VIEW_MODES.MATERIALS)}
              style={{ 
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 1000,
                color: '#666',
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid #d9d9d9',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
              }}
            />
            {/* 督学任务编辑器内容区域 */}
            <div style={{ flex: 1, background: '#fff' }}>
              <Supervision initialEditingPlan={currentRecord?.supervisionPlan || { id: `plan_${Date.now()}`, title: currentRecord?.title || '督学任务', type: 'special', typeLabel: '专项督导', date: new Date().toLocaleDateString('zh-CN'), tags: ['督学'] }} />
            </div>
          </div>
        ) : currentView === VIEW_MODES.SUPERVISION_EXECUTION_FULLSCREEN ? (
          /* 督导执行全屏模式 */
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
            {/* 左上角返回 */}
            <Button 
              type="default"
              shape="circle"
              size="small"
              icon={<ArrowLeftOutlined />}
              onClick={() => setCurrentView(VIEW_MODES.MATERIALS)}
              style={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }}
            />
            <div style={{ flex: 1, background: '#fff' }}>
              <Supervision 
                initialEditingExecution={currentRecord}
                onClose={() => setCurrentView(VIEW_MODES.MATERIALS)}
              />
            </div>
          </div>
        ) : currentView === VIEW_MODES.EPBL_FLOWCHART_FULLSCREEN ? (
          /* E-PBL 流程图全屏模式：占据全部三栏区域 */
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
            {/* 左上角返回图标 */}
            <Button 
              type="default"
              shape="circle"
              size="small"
              icon={<ArrowLeftOutlined />}
              onClick={() => setCurrentView(VIEW_MODES.MATERIALS)}
              style={{ 
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 1000,
                color: '#666',
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid #d9d9d9',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
              }}
            />
            {/* 左右分区：左侧流程图 + 右侧占位内容（选中节点后显示） */}
            <div style={{ flex: 1, background: '#fff', display: 'flex', overflow: 'hidden' }}>
              <div style={{ flex: epblSelectedNode ? 2 : 1, borderRight: epblSelectedNode ? '1px solid #f0f0f0' : 'none', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
                {/* 悬浮工具栏（与参考图一致的样式） */}
                <EpblFloatingToolbar />
                {/* 右上角：分享 / 素材库 */}
                <div style={{ position: 'absolute', top: 12, right: 16, zIndex: 1000, display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setShareModalVisible(true)}
                    style={{
                      padding: '12px 22px',
                      borderRadius: 16,
                      border: 'none',
                      background: '#6C6CF4',
                      color: '#fff',
                      fontSize: 16,
                      boxShadow: '0 8px 16px rgba(108,108,244,0.3)',
                      cursor: 'pointer'
                    }}
                  >协作</button>
                  <button
                    onClick={() => setAssetsDrawerVisible(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '12px 18px',
                      borderRadius: 16,
                      border: 'none',
                      background: '#eef0f7',
                      color: '#1f2937',
                      fontSize: 16,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      cursor: 'pointer'
                    }}
                  ><BookOutlined /> 素材库</button>
                </div>
                {/* 画布区域 */}
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <EpblFlowchart onSelectNode={SUPPRESS_RIGHT_PANEL_CLICK ? () => {} : (node) => setEpblSelectedNode(node)} />
                </div>
              </div>
              {!SUPPRESS_RIGHT_PANEL_CLICK && epblSelectedNode && (
                <div style={{ flex: 1, background: '#fff', overflowY: 'auto' }}>
                  <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Title level={5} style={{ margin: 0 }}>节点详情（占位）</Title>
                      <Button size="small" onClick={() => setEpblSelectedNode(null)}>关闭右侧</Button>
                    </div>
                    <div style={{ marginTop: 12, color: '#666' }}>
                      <p>当前选中：<Text strong>{epblSelectedNode?.label}</Text></p>
                      <p style={{ color: '#999', fontSize: 12 }}>这里将展示与该节点相关的内容（暂不实现）。</p>
                      <div style={{ marginTop: 12, padding: 12, border: '1px dashed #d9d9d9', borderRadius: 8 }}>
                        <p style={{ marginBottom: 8 }}>预留区块：</p>
                        <ul style={{ paddingLeft: 18 }}>
                          <li>文本/说明</li>
                          <li>图片/图表</li>
                          <li>表格/数据</li>
                          <li>交互控件</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* 分享弹窗 */}
            <Modal title={null} open={shareModalVisible} onCancel={() => setShareModalVisible(false)} footer={null} width={560}>
              <div style={{ padding: '8px 6px' }}>
                <Typography.Title level={3} style={{ textAlign: 'center', color: '#6C6CF4', marginTop: 8 }}>实时协作</Typography.Title>
                <Typography.Paragraph style={{ textAlign: 'center', marginTop: 8, color: '#333' }}>
                  你可以邀请其他人到当前的画面中与你协作。<br/>
                  别担心，该会话使用端到端加密，无论给你们制作什么都将保持私密，甚至连我们的服务器也无法查看。
                </Typography.Paragraph>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                  <Button type="primary" size="large" icon={<PlayCircleOutlined />} style={{ background: '#6C6CF4' }}
                    onClick={() => { message.success('已启动协作会话（示例）'); }}>
                    开始会话
                  </Button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                  <div style={{ flex: 1, height: 1, background: '#eee' }} />
                  <span style={{ color: '#999' }}>Or</span>
                  <div style={{ flex: 1, height: 1, background: '#eee' }} />
                </div>
                <Typography.Title level={4} style={{ textAlign: 'center', color: '#6C6CF4', marginTop: 0 }}>分享链接</Typography.Title>
                <Typography.Paragraph style={{ textAlign: 'center', color: '#333' }}>导出为只读链接。</Typography.Paragraph>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                  <Button size="large" icon={<LinkOutlined />} style={{ background: '#6C6CF4', color: '#fff' }}
                    onClick={() => {
                      try {
                        const url = (typeof window !== 'undefined') ? `${window.location.origin}/#epbl-canvas` : '/#epbl-canvas';
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                          navigator.clipboard.writeText(url);
                          message.success('分享链接已复制到剪贴板');
                        } else {
                          window.open(url, '_blank', 'noopener,noreferrer');
                          message.success('已在新标签页打开分享链接');
                        }
                      } catch (e) {
                        message.warning('导出链接失败，请稍后重试');
                      }
                    }}>
                    导出链接
                  </Button>
                </div>
              </div>
            </Modal>
            {/* 素材库抽屉（右侧） */}
            <Drawer placement="right" open={assetsDrawerVisible} onClose={() => setAssetsDrawerVisible(false)} width={360} closable={false}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* 顶部工具栏 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#6C6CF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>📖</div>
                  <div style={{ flex: 1 }}>
                    <Input placeholder="search library" allowClear size="small" />
                  </div>
                  <Button size="small" type="text">⋮</Button>
                </div>
                {/* 文案区 */}
                <Typography.Title level={5} style={{ color: '#6C6CF4', marginTop: 12 }}>个人素材库</Typography.Title>
                <Typography.Paragraph style={{ color: '#666', marginTop: 4 }}>选中画布上的项目添加到此处。</Typography.Paragraph>
                <Typography.Title level={5} style={{ color: '#6C6CF4', marginTop: 16 }}>Excalidraw 素材库</Typography.Title>

                {/* 图标栅格 - 复刻风格的线描元素 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 48px)', gap: 12, marginTop: 8 }}>
                  {Array.from({ length: 72 }).map((_, i) => (
                    <div key={i} style={{ width: 48, height: 48, borderRadius: 8, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', border: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {(() => {
                        const idx = i % 12;
                        const common = { width: 28, height: 18, border: '2px solid #9aa0a6', borderRadius: 4 };
                        switch (idx) {
                          case 0: return <div style={common} />; // 矩形
                          case 1: return <div style={{ width: 26, height: 26, borderRadius: 13, border: '2px solid #9aa0a6' }} />; // 圆
                          case 2: return <div style={{ width: 26, height: 20, border: '2px dashed #9aa0a6', borderRadius: 6 }} />; // 虚线矩形
                          case 3: return <div style={{ width: 26, height: 14, background: 'linear-gradient(180deg,#fff,#eaecef)', border: '2px solid #9aa0a6', borderRadius: 4 }} />; // 填充条
                          case 4: return <div style={{ width: 24, height: 24, border: '2px solid #9aa0a6', transform: 'rotate(45deg)' }} />; // 菱形
                          case 5: return <div style={{ width: 0, height: 0, borderTop: '2px solid transparent', borderBottom: '2px solid transparent', borderLeft: '18px solid #9aa0a6' }} />; // 三角
                          case 6: return <div style={{ width: 24, height: 8, borderTop: '2px solid #9aa0a6', position: 'relative' }}><div style={{ position: 'absolute', right: -6, top: -5, width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '8px solid #9aa0a6' }} /></div>; // 箭头
                          case 7: return <div style={{ width: 24, height: 2, background: '#9aa0a6', position: 'relative' }}><div style={{ position: 'absolute', left: 0, top: -6, width: 2, height: 14, background: '#9aa0a6' }} /></div>; // T型
                          case 8: return <div style={{ width: 18, height: 18, borderRadius: 9, border: '2px dotted #9aa0a6' }} />; // 点状圆
                          case 9: return <div style={{ width: 26, height: 12, border: '2px solid #9aa0a6', borderRadius: 12 }} />; // 胶囊
                          case 10: return <div style={{ width: 26, height: 18, borderBottom: '2px solid #9aa0a6', borderLeft: '2px solid #9aa0a6', borderRight: '2px solid #9aa0a6' }} />; // 开口矩形
                          case 11: return <div style={{ width: 24, height: 24, border: '2px solid #9aa0a6', borderRadius: 4, position: 'relative' }}><div style={{ width: 10, height: 10, border: '2px solid #9aa0a6', borderRadius: 2, position: 'absolute', right: -6, bottom: -6 }} /></div>; // 组合
                          default: return null;
                        }
                      })()}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16 }}>
                  <Button block style={{ background: '#6C6CF4', color: '#fff', borderRadius: 8 }}>浏览素材库</Button>
                </div>
              </div>
            </Drawer>
          </div>
        ) : currentView === EXAM_VIEW_MODES.EXAM_REVIEW_FULLSCREEN ? (
          /* 考试评阅占位页：占据全部三栏区域 */
          <ExamReviewFullPage 
            state={state}
            setCurrentView={setCurrentView}
            VIEW_MODES={VIEW_MODES}
          />
        ) : currentView === EXAM_VIEW_MODES.EXAM_FORM_FULLSCREEN ? (
          /* 考试试卷填写全屏模式：占据全部三栏区域 */
          <div style={{ 
            flex: 1, 
            background: '#f0f2f5', 
            margin: '8px', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}>
            <div style={{ flex: 1, background: '#fff' }}>
              <ExamForm state={state} />
            </div>
          </div>
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
        ) : currentView === VIEW_MODES.LEARNING_PLAN_FULLSCREEN ? (
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
            <div style={{ 
              flex: 1, 
              background: '#fff',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <LearningPlanViewer 
                rightPanelLearningPlanRecord={state.rightPanelLearningPlanRecord}
                rightPanelLearningPlanContent={state.rightPanelLearningPlanContent}
                setRightPanelView={state.setRightPanelView}
                setRightPanelLearningPlanRecord={state.setRightPanelLearningPlanRecord}
                setRightPlanelLearningPlanContent={state.setRightPanelLearningPlanContent}
                isFullscreen={true}
                setCurrentView={state.setCurrentView}
              />
            </div>
          </div>
        ) : currentView === VIEW_MODES.ACHIEVEMENT_DETAIL_THREE_COLUMN ? (
          /* 研修成果评阅三栏模式：占据三栏区域 */
          <AchievementDetailThreeColumn state={state} />
        ) : currentView === VIEW_MODES.DOCUMENT_FULLSCREEN ? (
          /* 文档全屏模式：占据全部三栏区域 */
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
            <div style={{ flex: 1, background: '#fff' }}>
              <DocumentView state={state} onBack={() => setCurrentView(VIEW_MODES.MATERIALS)} />
            </div>
          </div>
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
                leftPanelCollapsed={leftPanelCollapsed}
                setLeftPanelCollapsed={setLeftPanelCollapsed}
              />
            ) : currentView === VIEW_MODES.ACHIEVEMENT_DETAIL ? (
              /* 研修成果详情三栏模式：占据左侧区域，内联展示 */
              <AchievementDetailPanel state={state} />
            ) : currentView === VIEW_MODES.LEARNING_PLAN_THREE_COLUMN ? (
              /* 学习计划日历三栏模式：占据左侧区域 */
              <div style={{ 
                flex: leftPanelCollapsed ? 0.23 : 4, 
                width: leftPanelCollapsed ? '52px' : 'auto',
                background: '#fff', 
                margin: '0 1px 0 0', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'flex 0.3s ease'
              }}>
                {leftPanelCollapsed ? (
                  renderLeftCollapsedBar()
                ) : (
                  <>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
                      <div />
                      <Tooltip title={leftPanelCollapsed ? '展开' : '收起'}>
                        <Button
                          type="text"
                          size="small"
                          icon={leftPanelCollapsed ? <MenuUnfoldOutlined /> : <ColumnWidthOutlined />}
                          onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                          style={{ fontSize: '12px', height: '28px', width: '28px', borderRadius: '6px', background: '#f5f5f5' }}
                        />
                      </Tooltip>
                    </div>
                    <LearningPlanCalendar 
                      planData={state.rightPanelLearningPlanRecord}
                      plan={state.rightPanelLearningPlanRecord?.metadata || {}}
                      habits={['morning', 'evening']}
                      selectedDate={dayjs()}
                      onDateChange={(date) => console.log('日期变更:', date)}
                    />
                  </>
                )}
              </div>
            ) : currentView === VIEW_MODES.TRAINING_PLAN_THREE_COLUMN ? (
              /* 培训方案三栏模式：占据左侧区域 */
              <div style={{ 
                flex: leftPanelCollapsed ? 0.23 : 4.6, 
                width: leftPanelCollapsed ? '52px' : 'auto',
                background: '#fff', 
                margin: '0 1px 0 0', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'flex 0.3s ease'
              }}>
                {leftPanelCollapsed ? (
                  renderLeftCollapsedBar()
                ) : (
                  <>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
                      <Button 
                        size="small"
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => setCurrentView(VIEW_MODES.MATERIALS)}
                      >
                        返回
                      </Button>
                      <Tooltip title={leftPanelCollapsed ? '展开' : '收起'}>
                        <Button
                          type="text"
                          size="small"
                          icon={leftPanelCollapsed ? <MenuUnfoldOutlined /> : <ColumnWidthOutlined />}
                          onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                          style={{ fontSize: '12px', height: '28px', width: '28px', borderRadius: '6px', background: '#f5f5f5' }}
                        />
                      </Tooltip>
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
                  </>
                )}
              </div>
            ) : (
              <div style={{ 
                flex: leftPanelCollapsed ? 0.23 : 4, 
                width: leftPanelCollapsed ? '52px' : 'auto',
                background: '#fff', 
                margin: '0 1px 0 0', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'flex 0.3s ease'
              }}>
                {leftPanelCollapsed ? (
                  renderLeftCollapsedBar()
                ) : (
                  <>
                    {currentView !== VIEW_MODES.VIDEO && (
                      <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', background: '#fafafa' }}>
                        <Tooltip title={leftPanelCollapsed ? '展开' : '收起'}>
                          <Button
                            type="text"
                            size="small"
                            icon={leftPanelCollapsed ? <MenuUnfoldOutlined /> : <ColumnWidthOutlined />}
                            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                            style={{ fontSize: '12px', height: '28px', width: '28px', borderRadius: '6px', background: '#f5f5f5' }}
                          />
                        </Tooltip>
                      </div>
                    )}
                    {currentView === VIEW_MODES.DOCUMENT ? (
                      <DocumentView state={state} onBack={() => setCurrentView(VIEW_MODES.MATERIALS)} />
                    ) : (
                      <VideoView 
                        state={state}
                        handlers={videoHandlers}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {/* 中间问答区域 */}
            <div style={{
              // 右侧为视频播放器时，中区缩小；为选课视图时，中区扩大30%
              flex: (state.rightPanelView === RIGHT_PANEL_VIEWS.VIDEO_PLAYER)
                ? 3.6
                : (state.rightPanelView === RIGHT_PANEL_VIEWS.COURSE_SELECTION_VIEWER
                  ? 5.5
                  : ((state.rightPanelView === RIGHT_PANEL_VIEWS.NOTE_EDITOR || state.rightPanelView === RIGHT_PANEL_VIEWS.QUESTION_VIEWER || state.rightPanelView === RIGHT_PANEL_VIEWS.GRADING_VIEWER || state.rightPanelView === RIGHT_PANEL_VIEWS.MEMORY_CARD_VIEWER || state.rightPanelView === RIGHT_PANEL_VIEWS.QUIZ_VIEWER)
                    ? 5.0
                    : 5.0)),
              transition: 'flex 0.3s ease',
              margin: '0 1px 0 1px'
            }}>
              {state.rightPanelView === RIGHT_PANEL_VIEWS.COURSE_SELECTION_VIEWER ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                      <div style={{ justifySelf: 'start', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>📚</span>
                        <Text strong>选择课程内容集合</Text>
                      </div>
                      <div style={{ justifySelf: 'center', display: 'flex', alignItems: 'center' }}>
                        <Tabs
                          centered
                          activeKey={courseTabKey}
                          onChange={(key) => setCourseTabKey(key)}
                          tabBarStyle={{ marginBottom: 0 }}
                          items={[
                            { key: 'candidate', label: '候选' },
                            { key: 'self', label: '自选' }
                          ]}
                        />
                      </div>
                      <div />
                    </div>
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {courseTabKey === 'candidate' ? (
                      <div style={{ height: '100%', overflow: 'auto' }}>
                        <OnDemandResourceLibrary
                          selectMode
                          useExternalFilters
                          externalFilters={{ category: 'all', query: '' }}
                          hideCategorySidebar
                          hideHeader
                          selectedCollectionIds={state.courseSelectionSelectedIds}
                          onSelectionChange={(ids) => {
                            state.setCourseSelectionSelectedIds(ids);
                            const phaseId = state.courseSelectionPhaseId;
                            window.dispatchEvent(new CustomEvent('courseSelectionUpdate', { detail: { phaseId, selectedIds: ids } }));
                          }}
                          defaultViewMode="grid"
                        />
                      </div>
                    ) : (
                      <div style={{ height: '100%', overflow: 'auto' }}>
                        <OnDemandResourceLibrary
                          selectMode
                          selectedCollectionIds={state.courseSelectionSelectedIds}
                          onSelectionChange={(ids) => {
                            state.setCourseSelectionSelectedIds(ids);
                            const phaseId = state.courseSelectionPhaseId;
                            window.dispatchEvent(new CustomEvent('courseSelectionUpdate', { detail: { phaseId, selectedIds: ids } }));
                          }}
                          defaultViewMode="grid"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : state.rightPanelView === RIGHT_PANEL_VIEWS.EXAM_FORM_VIEWER ? (
                <ExamForm state={state} />
              ) : (
                <AIChat 
                  state={state}
                  handlers={aiChatHandlers}
                  selectedCategory={selectedCategory}
                  unreadMessageCount={unreadMessageCount}
                  onOpenMessageCenter={() => setShowMessageCenter(true)}
                  showGifOverlay={false}
                />
              )}
            </div>

            
            {/* 右侧操作区域 */}
            <div style={{ 
              flex: (() => {
                // 收起状态下减小 flex 值
                if (operationPanelCollapsed) {
                  return 0.23; // 收起时占用很小的宽度（容器宽度52px）
                }
                const baseRatio = currentView === VIEW_MODES.VIDEO ? 2.8 : (state.viewMode === VIEW_MODES.MAP ? 2.6 : 2.4);
                // 当右侧为视频播放器时，仅将中间减少的30%（1.5）加给右侧，左侧保持不变
                if (state.rightPanelView === RIGHT_PANEL_VIEWS.VIDEO_PLAYER || state.rightPanelView === RIGHT_PANEL_VIEWS.LIVE_PLAYER) {
                  return baseRatio + 1.2;
                }
                // 笔记编辑、试题查看或阅卷报告查看状态时，保持原有增加宽度的逻辑
                if (state.rightPanelView === RIGHT_PANEL_VIEWS.NOTE_EDITOR || state.rightPanelView === RIGHT_PANEL_VIEWS.QUESTION_VIEWER || state.rightPanelView === RIGHT_PANEL_VIEWS.GRADING_VIEWER) {
                  return baseRatio * 1.35;
                }
                if (state.rightPanelView === RIGHT_PANEL_VIEWS.MEMORY_CARD_VIEWER || state.rightPanelView === RIGHT_PANEL_VIEWS.QUIZ_VIEWER || state.rightPanelView === RIGHT_PANEL_VIEWS.REPORT_VIEWER) {
                  return 5.0;
                }
                // 选课视图：右区加宽（相对基础宽度增加约10%）
                if (state.rightPanelView === RIGHT_PANEL_VIEWS.COURSE_SELECTION_VIEWER) {
                  return baseRatio * 1.05;
                }
                return baseRatio;
              })(), 
              background: '#fff', 
              margin: '0 0 0 1px', 
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
                {/* 输入与发送区固定在底部：改为弹性布局，输入框横向撑满 */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Input
                      style={{ flex: 1 }}
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
                      onClick={(e) => {
                        const input = e.currentTarget.parentElement.querySelector('input');
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
                  </div>
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
              { key: 'audio', icon: '🎵', title: '音频播客' },
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
      
      {/* 悬浮消息图标（考试期间隐藏；退出或完成考试再显示） */}
      {!(currentView === EXAM_VIEW_MODES.EXAM_FORM_FULLSCREEN || state.rightPanelView === RIGHT_PANEL_VIEWS.EXAM_FORM_VIEWER) && (
      <div
        style={{
          position: 'fixed',
          bottom: assistantGifVisible ? `${floatIconPosition.y}px` : 24,
          right: assistantGifVisible ? `${floatIconPosition.x}px` : 24,
          zIndex: 1000,
          cursor: assistantGifVisible ? (isDragging ? 'grabbing' : 'grab') : 'pointer'
        }}
        onMouseDown={assistantGifVisible ? handleMouseDown : undefined}
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
          style={{ position: 'relative', width: assistantGifVisible ? 240 : 44, height: assistantGifVisible ? 240 : 72 }}
          onMouseEnter={() => setIsGifGroupHovered(true)}
          onMouseLeave={() => setIsGifGroupHovered(false)}
        >
          {/* 动图（头像） */}
          {assistantGifVisible && (
            <img
              src={
              selectedCategory === 'organizational_training' ? '/assets/果仁-动态.gif' :
              selectedCategory === 'training_needs_management' ? '/assets/培训助理.gif' :
              selectedCategory === 'teaching_research_office' ? '/assets/教研助理.gif' :
              selectedCategory === 'my_evaluation' ? '/assets/评阅助手.gif' :
              selectedCategory === 'supervision' ? '/assets/督学专家.gif' :
              '/assets/动态.gif'
              }
              alt="动态图"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: 220,
                height: 'auto',
                zIndex: 2
              }}
            />
          )}
          {/* 最小化按钮：悬停动图时出现 */}
          {assistantGifVisible && isGifGroupHovered && (
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                fontSize: 12,
                padding: '4px 8px',
                borderRadius: 12,
                cursor: 'pointer',
                zIndex: 3
              }}
              onClick={(e) => { e.stopPropagation(); setAssistantGifVisible(false); }}
            >最小化</div>
          )}

          {/* 聊天气泡（贴近头像顶部偏右） */}
          {/* 气泡与恢复按钮的包裹区域，扩大悬停命中范围，避免“恢复”消失 */}
          <div
            style={{ position: 'absolute', top: assistantGifVisible ? 10 : 0, left: assistantGifVisible ? 120 : 0, width: 44, height: assistantGifVisible ? 44 : 72 }}
            onMouseEnter={() => setIsBubbleHovered(true)}
            onMouseLeave={() => setIsBubbleHovered(false)}
          >
            {/* 静态头像：当动图隐藏时在督学分类显示 */}
            {!assistantGifVisible && selectedCategory === 'supervision' && (
              <img
                src="/assets/督学专家.png"
                alt="督学专家头像"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: -80,
                  width: 72,
                  height: 'auto',
                  borderRadius: 8
                }}
              />
            )}
            <div
              style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#1890ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(24, 144, 255, 0.4)',
                zIndex: 1
              }}
            >
              <MessageOutlined style={{ fontSize: '22px', color: 'white' }} />
              {unreadMessageCount > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: -6,
                    backgroundColor: '#ff4d4f',
                    color: 'white',
                    borderRadius: '999px',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 0 0 2px #fff',
                    padding: '0 6px'
                  }}
                >
                  {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                </div>
              )}
            </div>
            {/* 恢复按钮：当动图隐藏且鼠标悬停气泡区域时出现 */}
            {!assistantGifVisible && isBubbleHovered && (
              <div
                style={{
                  position: 'absolute',
                  top: 48,
                  right: 0,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  fontSize: 12,
                  padding: '4px 8px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  zIndex: 3
                }}
                onClick={(e) => { e.stopPropagation(); setAssistantGifVisible(true); }}
              >恢复</div>
            )}
          </div>
        </div>
       </div>
      )}
      
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

       {/* 消息讨论弹窗（含会话列表页） */}
       <Modal
         open={showMessageCenter}
         footer={null}
         onCancel={() => { setShowMessageCenter(false); setUnreadMessageCount(0); setIsChatSplit(false); }}
         width={modalWidth}
         centered
         destroyOnClose
         title={null}
         className="discussion-modal"
         bodyStyle={{ height: 'calc(70vh + 15px)', overflowY: 'hidden', padding: 0, display: 'flex' }}
         closable={!isInnerOverlayOpen}
       >
        <div className={`mc-left ${isResizing ? 'resizing' : ''}`} style={{ width: leftWidth, borderRight: 'none', background: '#fff' }}>
           <ContactList
             contacts={modalContacts}
             activeContact={activeModalContact}
             onContactSelect={setActiveModalContact}
             totalUnreadCount={modalContacts.reduce((sum,c)=>sum+(c.unreadCount||0),0)}
             width={leftWidth}
           />
         </div>
         <div className="mc-resizer" onMouseDown={onModalResizerMouseDown} />
         <div className="mc-right" style={{ flex: 1, minWidth: 0 }}>
           {(activeModalContact === 'org_training_new_teacher_discuss' || (typeof activeModalContact === 'string' && activeModalContact.startsWith('topic_post_'))) ? (
             <TopicDiscussion 
               compact 
               embedded 
               onRequestClose={() => { setShowMessageCenter(false); setUnreadMessageCount(0); setIsChatSplit(false); }}
               openTopicId={typeof activeModalContact === 'string' && activeModalContact.startsWith('topic_post_') ? Number(activeModalContact.replace('topic_post_', '')) : null}
             />
           ) : (
            <ChatWindow
              activeContact={activeModalContact}
              contacts={modalContacts}
              messages={getModalMessages()}
              newMessage={newChatMessage}
              onMessageChange={setNewChatMessage}
              onSendMessage={() => {
                if (!newChatMessage.trim()) return;
                const newMsg = {
                  id: Date.now(),
                  senderId: 'me',
                  senderName: '我',
                  content: newChatMessage,
                  time: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
                  type: 'text'
                };
                setDialogueMessages(prev => [...prev, newMsg]);
                setNewChatMessage('');
                message.success('消息发送成功');
              }}
              onOverlayChange={setInnerOverlayOpen}
            />
           )}
         </div>
       </Modal>
     </>
   );
 };

 export default NoteEditPage;
