import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  message,
  Card,
  Dropdown,
  Modal,
  Tooltip,
  Space,
  Tag,
  Progress
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  ColumnWidthOutlined,
  MenuUnfoldOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  ShareAltOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dayjs from 'dayjs';
import { 
  RIGHT_PANEL_VIEWS,
  MORE_MENU_ACTIONS,
  OPERATION_CARDS,
  OPERATION_TYPES
} from '../constants/noteEditConstants';
import { getCategoryKey, getAiIconForCategory } from '../constants/categoryMeta';
import { getOperationIcon } from '../utils/noteEditUtils';
import QuestionConfigModal from './QuestionConfigModal';
import ThemeSelectModal from './ThemeSelectModal';
import LearningPlanModal from './LearningPlanModal';
import ReportSelectionModal from './ReportSelectionModal';
import ClassroomEvaluationModal from './ClassroomEvaluationModal';

// 导入子组件
import DraggableOperationCard from './OperationPanel/DraggableOperationCard';
import NoteEditorViewer from './OperationPanel/NoteEditorViewer';
import QuestionViewer from './OperationPanel/QuestionViewer';
import GradingViewer from './OperationPanel/GradingViewer';
import LearningPlanViewer from './OperationPanel/LearningPlanViewer';
import ClassroomEvaluationViewer from './OperationPanel/ClassroomEvaluationViewer';
import ClassroomBehaviorAnalysisViewer from './OperationPanel/ClassroomBehaviorAnalysisViewer';
import TrainingPlanViewer from './OperationPanel/TrainingPlanViewer';
import TrainingReportViewer from './OperationPanel/TrainingReportViewer';
import MemoryCardViewer from './OperationPanel/MemoryCardViewer';
import QuizViewer from './OperationPanel/QuizViewer';
import ReportViewer from './OperationPanel/ReportViewer';
import VideoPlayer from './VideoPlayer';
import LivePlayer from './LivePlayer';
import TrainingDashboardViewer from './OperationPanel/TrainingDashboardViewer';
import ToolGrid from './OperationPanel/ToolGrid';
import { createGetAvailableAITools } from './OperationPanel/getAvailableAITools.jsx';
import TrainingTypeSettingsViewer from './OperationPanel/TrainingTypeSettingsViewer';
import { initialResources } from '../data/resourceLibraryData.js';
import { getAvailableNoteTemplates } from '../services/templateService.js';

// 导入自定义Hooks
import { 
  useOperationPanelState, 
  useModalState, 
  useSourceDataCheck 
} from '../hooks/useOperationPanelState';
import { useOperationHandlers } from '../hooks/useOperationHandlers';

const { Title, Text } = Typography;

// 添加自定义样式
const customStyles = `
  .custom-more-tools-dropdown .ant-dropdown-menu {
    padding: 4px;
    border-radius: 12px;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .custom-more-tools-dropdown .ant-dropdown-menu::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-more-tools-dropdown .ant-dropdown-menu::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
  }
  
  .custom-more-tools-dropdown .ant-dropdown-menu::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 3px;
  }
  
  .custom-more-tools-dropdown .ant-dropdown-menu::-webkit-scrollbar-thumb:hover {
    background: #bfbfbf;
  }
  
  .custom-more-tools-dropdown .ant-dropdown-menu-item {
    padding: 8px 12px;
    margin: 4px 0;
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  
  .custom-more-tools-dropdown .ant-dropdown-menu-item:hover {
    background: linear-gradient(135deg, #f8faff 0%, #eef4ff 100%);
    transform: translateX(4px);
    box-shadow: 0 4px 8px rgba(24, 144, 255, 0.1);
  }
  
  .custom-more-tools-dropdown .ant-dropdown-menu-item:hover .tool-icon {
    transform: scale(1.1);
  }
`;

// 将样式注入到页面
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customStyles;
  if (!document.head.querySelector('[data-component="operation-panel-styles"]')) {
    styleElement.setAttribute('data-component', 'operation-panel-styles');
    document.head.appendChild(styleElement);
  }
}

  const OperationPanel = ({ state, handlers, hideEmptySlots = false, selectedCategory = null }) => {
  // 先解构state中的变量
  const {
    operationRecords,
    setOperationRecords,
    rightPanelView,
    setRightPanelView,
    rightPanelEditingNote,
    setRightPanelEditingNote,
    rightPanelNoteContent,
    setRightPanelNoteContent,
    rightPanelQuestionRecord,
    setRightPanelQuestionRecord,
    rightPanelQuestionContent,
    setRightPanelQuestionContent,
    rightPanelMemoryCardsRecord,
    setRightPanelMemoryCardsRecord,
    rightPanelQuizRecord,
    setRightPanelQuizRecord,
    rightPanelLearningPlanRecord,
    setRightPanelLearningPlanRecord,
    rightPanelLearningPlanContent,
    setRightPanelLearningPlanContent,
    rightPanelGradingRecord,
    setRightPanelGradingRecord,
    rightPanelGradingContent,
    setRightPanelGradingContent,
    rightPanelReportRecord,
    setRightPanelReportRecord,
    rightPanelReportContent,
    setRightPanelReportContent,
    rightPanelTrainingPlanRecord,
    setRightPanelTrainingPlanRecord,
    rightPanelTrainingPlanContent,
    setRightPanelTrainingPlanContent,
    rightPanelTrainingReportRecord,
    setRightPanelTrainingReportRecord,
    rightPanelTrainingReportContent,
    setRightPanelTrainingReportContent,
    uploadedFiles,
    addedTexts,
    courseVideos,
    links,
    note,
    // 视频相关状态
    selectedMaterial,
    videoStartTime,
    isWidescreenMode,
    setIsWidescreenMode,
    // 编辑器相关状态（用于 VideoPlayer 的 currentEditorState 回调）
    showNoteEditor,
    editingNote,
    noteEditorContent,
    setNoteEditorContent,
    // 研修成果关联信息（用于在卡片展示“被谁关联”）
    achievementAssociations,
    // 资料勾选（用于来源快照）
    selectedMaterials
  } = state;

  // 获取当前笔记的分类信息（优先使用选中的分类）
  const noteCategory = selectedCategory || note?.category || note?.courseType || null;
  console.log('=== OperationPanel noteCategory ===');
  // 与中区问答区域保持一致：根据分类选择图标
  const categoryKey = getCategoryKey(note?.category, selectedCategory);
  const categoryIcon = getAiIconForCategory(categoryKey);
  console.log('传入的 state:', state);
  console.log('传入的 note:', note);
  console.log('noteCategory:', noteCategory);
  console.log('note?.category:', note?.category);
  console.log('note?.courseType:', note?.courseType);
  console.log('selectedCategory:', selectedCategory);
  console.log('================================');

  const {
    onOperationClick,
    onAddTool,
    onScenarioClick,
    onRecordClick,
    onMoreAction
  } = handlers;

  // 使用自定义Hooks进行状态管理
  const {
    visibleCards,
    setVisibleCards,
    isEditMode,
    setIsEditMode,
    showCardSelector,
    setShowCardSelector,
    loadingCards,
    addLoadingCard,
    removeLoadingCard,
    practiceMode,
    setPracticeMode,
    userAnswers,
    setUserAnswers,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    showResults,
    setShowResults,
    score,
    setScore,
    planViewMode,
    setPlanViewMode,
    selectedDate,
    setSelectedDate,
    gradingViewMode,
    setGradingViewMode,
    selectedStudent,
    setSelectedStudent
  } = useOperationPanelState(noteCategory);
  // AI工具版本：用于在收到事件时触发重渲染
  const [aiToolsVersion, setAiToolsVersion] = useState(0);
  
  // 收起/展开状态
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openAudioRecordId, setOpenAudioRecordId] = useState(null);
  const audioRefs = React.useRef({});
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrent, setVideoCurrent] = useState(0);
  const [videoSpeed, setVideoSpeed] = useState(1);
  const videoRef = React.useRef(null);
  
  // 通知父组件收起状态变化
  useEffect(() => {
    if (state.setOperationPanelCollapsed) {
      state.setOperationPanelCollapsed(isCollapsed);
    }
  }, [isCollapsed, state]);

  useEffect(() => {
    if (categoryKey !== 'organizational_training') return;
    const DEFAULT_ID = 'default-learning-plan-record';
    const list = Array.isArray(operationRecords?.[OPERATION_TYPES.LEARNING_PLAN]) ? operationRecords[OPERATION_TYPES.LEARNING_PLAN] : [];
    const exists = list.some(r => r.id === DEFAULT_ID);
    if (!exists) {
      const defaultPlanData = {
        analysis: { duration: 4, weeklyHours: 6 },
        overview: {
          title: '新教师入职线上培训具体方案',
          audience: '新入职教师',
          goal: '熟悉学校规章、掌握教学基本功、提升课堂与信息化应用能力，完成入职适应。',
          cycle: '4周（每周2次直播+平时点播）',
          formats: ['直播', '点播', '作业/测验', '经验交流'],
          assessment: ['学习时长达标', '作业提交审核', '阶段测验通过', '交流参与度'],
          timeSlots: ['晚间 19:30-21:00', '上午 09:30-10:30', '上午 11:00-12:00']
        },
        plan: {
          phases: [
            { 
              name: '入职导学', phase: '阶段1', duration: '1周', content: '校情校规与平台使用', 
              tasks: ['学校制度与流程', '平台账号与资源导览'], milestone: '完成导学与平台熟悉',
              formats: ['直播导学', '平台点播教程'],
              assessment: ['导学测验', '平台功能操作演示'],
              deliverables: ['导学测验通过', '平台账号设置完成']
            },
            { 
              name: '教学规范', phase: '阶段2', duration: '1周', content: '备课与课堂规范', 
              tasks: ['备课流程与教案撰写', '课堂组织与规范'], milestone: '规范教学流程',
              formats: ['备课工作坊', '课堂规范直播'],
              assessment: ['提交教案样稿', '课堂规范在线测验'],
              deliverables: ['标准教案样稿', '课堂规范清单']
            },
            { 
              name: '课堂管理', phase: '阶段3', duration: '1周', content: '课堂互动与管理', 
              tasks: ['互动策略', '常见问题处理'], milestone: '提升课堂管理能力',
              formats: ['互动策略分享', '班级管理案例研讨'],
              assessment: ['互动设计作业', '案例分析打分'],
              deliverables: ['互动活动设计稿', '管理案例分析报告']
            },
            { 
              name: '信息化应用与教研发展', phase: '阶段4', duration: '1周', content: '信息化工具与教研', 
              tasks: ['工具应用实践', '加入教研与成长路径'], milestone: '形成持续成长路径',
              formats: ['工具实操直播', '教研经验交流'],
              assessment: ['工具应用作品提交', '教研参与情况'],
              deliverables: ['信息化应用作品链接', '教研参与记录']
            }
          ]
        },
        habits: ['晚上', '周末学习']
      };
      const record = {
        id: DEFAULT_ID,
        title: '智能学习计划',
        source: '系统初始化',
        time: new Date().toLocaleString('zh-CN'),
        type: OPERATION_TYPES.LEARNING_PLAN,
        planData: defaultPlanData
      };
      setOperationRecords(prev => {
        const updated = { ...prev };
        const prevList = Array.isArray(updated[OPERATION_TYPES.LEARNING_PLAN]) ? updated[OPERATION_TYPES.LEARNING_PLAN] : [];
        updated[OPERATION_TYPES.LEARNING_PLAN] = [record, ...prevList.filter(r => r.id !== DEFAULT_ID)];
        return updated;
      });
    }
  }, [categoryKey]);
  
  const {
    questionConfigVisible,
    setQuestionConfigVisible,
    learningPlanModalVisible,
    setLearningPlanModalVisible,
    reportSelectionVisible,
    setReportSelectionVisible,
    showThemeSelectModal,
    setShowThemeSelectModal,
    classroomEvaluationVisible,
    setClassroomEvaluationVisible,
    currentRecord,
    setCurrentRecord,
    currentActionType,
    setCurrentActionType
  } = useModalState();
  
  const {
    hasSourceData,
    sourceInfo
  } = useSourceDataCheck({ uploadedFiles, addedTexts, courseVideos, links });

  // 通用函数：添加记录并模拟生成过程
  const addRecordWithGenerating = (recordType, record, callbacks = {}) => {
    // 添加生成中状态
    const recordWithGenerating = {
      ...record,
      isGenerating: true
    };
    
    // 添加到记录中
    const newRecords = { ...operationRecords };
    if (!newRecords[recordType]) {
      newRecords[recordType] = [];
    }
    newRecords[recordType].unshift(recordWithGenerating);
    setOperationRecords(newRecords);
    
    // 3秒后取消生成中状态
    setTimeout(() => {
      setOperationRecords(prev => {
        const updated = { ...prev };
        if (updated[recordType]) {
          updated[recordType] = updated[recordType].map(r => 
            r.id === record.id ? { ...r, isGenerating: false } : r
          );
        }
        return updated;
      });
      
      // 执行回调
      if (callbacks.onComplete) {
        callbacks.onComplete();
      }
    }, 3000);
    
    return recordWithGenerating;
  };

  // 新建笔记类型选择下拉菜单状态（靠近按钮显示）
  const [noteTypeDropdownVisible, setNoteTypeDropdownVisible] = useState(false);
  // 模板库弹窗与数据
  const [showNoteTemplateModal, setShowNoteTemplateModal] = useState(false);
  const [noteTemplateLoading, setNoteTemplateLoading] = useState(false);
  const [noteTemplates, setNoteTemplates] = useState([]);
  const [noteCreationTargetSubType, setNoteCreationTargetSubType] = useState(null);
  const [templateCategory, setTemplateCategory] = useState('recommend');

  // 根据选择的类型创建笔记并进入编辑器
  const openNoteTemplateModal = async (noteSubType) => {
    // 文档：直接生成记录，不弹模板库
    if (noteSubType === 'document') {
      setNoteCreationTargetSubType('document');
      setNoteTypeDropdownVisible(false);
      createNoteFromTemplate(null);
      return;
    }
    // 白板：打开模板库弹窗
    setNoteCreationTargetSubType(noteSubType);
    setTemplateCategory('recommend');
    setNoteTypeDropdownVisible(false);
    setShowNoteTemplateModal(true);
    setNoteTemplateLoading(true);
    try {
      const res = await getAvailableNoteTemplates();
      setNoteTemplates(res?.data || []);
    } finally {
      setNoteTemplateLoading(false);
    }
  };

  const createNoteFromTemplate = (template) => {
    const isWhiteboard = noteCreationTargetSubType === 'whiteboard';
    const title = template?.name ? template.name : (isWhiteboard ? '新建白板' : '新建文档');
    const newNote = {
      id: Date.now(),
      title,
      source: template?.name ? `模板：${template.name}` : '手动创建',
      time: new Date().toLocaleString('zh-CN'),
      type: isWhiteboard ? 'whiteboard' : 'document',
      subType: noteCreationTargetSubType || 'document',
      content: isWhiteboard ? '' : (template?.description ? `<p>使用模板：${template.description}</p>` : '')
    };
    const newRecords = { ...operationRecords };
    const bucketKey = isWhiteboard ? 'whiteboard' : 'document';
    if (!Array.isArray(newRecords[bucketKey])) newRecords[bucketKey] = [];
    newRecords[bucketKey].unshift(newNote);
    setOperationRecords(newRecords);
    setShowNoteTemplateModal(false);
    setNoteCreationTargetSubType(null);
    message.success(`${title}已创建`);
  };
  
  // 监听AI工具变化事件
  useEffect(() => {
    const handleAIToolsChanged = () => {
      // 触发重新渲染以刷新可用AI工具
      setAiToolsVersion(v => v + 1);
      console.log('检测到AI工具变化，刷新可用AI工具');
    };
    
    window.addEventListener('aiToolsChanged', handleAIToolsChanged);
    
    return () => {
      window.removeEventListener('aiToolsChanged', handleAIToolsChanged);
    };
  }, []);
  
  const {
    handleToolClick,
    handleGradingToolAction,
    handleTrainingReportToolAction,
    handleTrainingDashboardToolAction
  } = useOperationHandlers({
    hasSourceData,
    sourceInfo,
    uploadedFiles,
    addedTexts,
    courseVideos,
    links,
    selectedMaterials,
    operationRecords,
    setOperationRecords,
    setRightPanelView,
    setRightPanelQuestionRecord,
    setRightPanelQuestionContent,
    setRightPanelLearningPlanRecord,
    setRightPanelLearningPlanContent,
    setRightPanelGradingRecord,
    setRightPanelGradingContent,
    setRightPanelTrainingReportRecord,
    setRightPanelTrainingReportContent,
    setQuestionConfigVisible,
    setClassroomEvaluationVisible,
    setLearningPlanModalVisible,
    setReportSelectionVisible,
    onOperationClick,
    onAddTool,
    onScenarioClick,
    onRecordClick,
    onMoreAction
  });

  
  // 处理添加AI工具
  const handleAddAITool = (tool) => {
    if (visibleCards.length >= 18) {
      message.warning('工具栏已满，请先移除其他工具');
      return;
    }

    try {
      // 添加到可见卡片列表
      const newCard = {
        key: tool.menuConfig.key,
        title: tool.menuConfig.title,
        icon: tool.menuConfig.icon,
        gradient: tool.menuConfig.gradient,
        color: tool.menuConfig.color,
        isAITool: true
      };
      
      setVisibleCards(prev => [...prev, newCard]);
      
      // 保存到localStorage
      const addedAITools = JSON.parse(localStorage.getItem('added-ai-tools-to-panel') || '[]');
      const newAddedTools = [...addedAITools, tool.id];
      localStorage.setItem('added-ai-tools-to-panel', JSON.stringify(newAddedTools));
      
      // 保存AI工具配置信息
      const aiToolsConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}');
      aiToolsConfig[tool.id] = tool.menuConfig;
      localStorage.setItem('ai-tools-config', JSON.stringify(aiToolsConfig));
      
      // 触发自定义事件通知其他组件更新
      window.dispatchEvent(new Event('aiToolsChanged'));
      
      message.success(`已添加 ${tool.name} 到工具栏`);
    } catch (error) {
      message.error('添加失败，请重试');
    }
  };

  // 使用抽离的工厂函数生成可用AI工具列表（保持行为不变）
  const getAvailableAITools = createGetAvailableAITools({
    noteCategory,
    visibleCards,
    setAiToolsVersion,
    handleAddAITool,
    aiToolsVersion
  });

  // 拖拽排序处理函数
  const moveCardPosition = (fromIndex, toIndex) => {
    const updatedCards = [...visibleCards];
    const [movedCard] = updatedCards.splice(fromIndex, 1);
    updatedCards.splice(toIndex, 0, movedCard);
    setVisibleCards(updatedCards);
    message.success('工具位置已调整');
  };

  // 添加工具到可见列表
  const handleAddCard = (cardKey) => {
    const cardToAdd = OPERATION_CARDS.find(card => card.key === cardKey);
    if (cardToAdd && !visibleCards.some(card => card.key === cardKey) && visibleCards.length < 18) {
      setVisibleCards(prev => [...prev, cardToAdd]);
      message.success(`已添加${cardToAdd.title}工具`);
    } else if (visibleCards.length >= 18) {
      message.warning('工具栏已满，最多只能显示18个工具');
    } else if (visibleCards.some(card => card.key === cardKey)) {
      message.info('该工具已经存在');
    }
  };

  // 从可见列表移除工具
  const handleRemoveCard = (cardKey) => {
    if (visibleCards.length > 1) {
      const removedCard = visibleCards.find(card => card.key === cardKey);
      setVisibleCards(prev => prev.filter(card => card.key !== cardKey));
      message.success(`已移除${removedCard?.title}工具`);
    } else {
      message.warning('至少需要保留1个工具');
    }
  };

  // 处理工具点击
  const handleCardClick = async (card) => {
    // 开始加载状态
    addLoadingCard(card.key);
    
    try {
      // 调用原有的工具点击处理逻辑
      await handleToolClick(card);
    } finally {
      // 3秒后移除加载状态
      setTimeout(() => {
        removeLoadingCard(card.key);
      }, 3000);
    }
  };

  // 获取更多操作菜单项
  const getMoreMenuItems = (record) => {
    const commonItems = [
      {
        key: 'rename',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>✏️</span>
            <span>重命名</span>
          </div>
        ),
        onClick: (e) => {
          e?.stopPropagation?.();
          onMoreAction && onMoreAction('rename', record);
        }
      },
      {
        key: 'copyTo',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📋</span>
            <span>复制到主题</span>
          </div>
        ),
        onClick: (e) => {
          console.log('Copy to clicked!', record);
          e?.stopPropagation?.();
          setCurrentRecord(record);
          setCurrentActionType('copy');
          setShowThemeSelectModal(true);
          console.log('Modal state set to true');
        }
      },
      {
        key: 'moveTo',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📦</span>
            <span>移动到主题</span>
          </div>
        ),
        onClick: (e) => {
          console.log('Move to clicked!', record);
          e?.stopPropagation?.();
          setCurrentRecord(record);
          setCurrentActionType('move');
          setShowThemeSelectModal(true);
          console.log('Modal state set to true for move');
        }
      },
      {
        key: (Array.isArray(record.tags) && record.tags.includes('语料')) ? 'unmarkAgentCorpus' : 'markAgentCorpus',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🧠</span>
            <span>{(Array.isArray(record.tags) && record.tags.includes('语料')) ? '取消智能体语料' : '智能体语料'}</span>
          </div>
        ),
        onClick: (e) => {
          e?.stopPropagation?.();
          const isMarked = Array.isArray(record.tags) && record.tags.includes('语料');
          const updatedRecord = { ...record };
          if (isMarked) {
            updatedRecord.tags = (record.tags || []).filter(tag => tag !== '语料');
            message.success('已取消标记智能体语料');
          } else {
            updatedRecord.tags = [...(record.tags || []), '语料'];
            message.success('已标记为语料');
          }
          setOperationRecords(prev => {
            const newRecords = { ...prev };
            Object.keys(newRecords).forEach(type => {
              if (Array.isArray(newRecords[type])) {
                newRecords[type] = newRecords[type].map(r => r.id === record.id ? updatedRecord : r);
              }
            });
            return newRecords;
          });
        }
      },
      ...((record.type === 'document' || (record.type === 'note' && record.subType === 'document')) ? [{
        key: (Array.isArray(record.tags) && record.tags.includes('标注')) ? 'unmarkAgentAnnotation' : 'markAgentAnnotation',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🏷️</span>
            <span>{(Array.isArray(record.tags) && record.tags.includes('标注')) ? '取消智能体标注' : '智能体标注'}</span>
          </div>
        ),
        onClick: (e) => {
          e?.stopPropagation?.();
          const isMarked = Array.isArray(record.tags) && record.tags.includes('标注');
          const updatedRecord = { ...record };
          if (isMarked) {
            updatedRecord.tags = (record.tags || []).filter(tag => tag !== '标注');
            message.success('已取消“标注”标识');
          } else {
            updatedRecord.tags = [...(record.tags || []), '标注'];
            message.success('已添加“标注”标识');
          }
          setOperationRecords(prev => {
            const newRecords = { ...prev };
            Object.keys(newRecords).forEach(type => {
              if (Array.isArray(newRecords[type])) {
                newRecords[type] = newRecords[type].map(r => r.id === record.id ? updatedRecord : r);
              }
            });
            return newRecords;
          });
        }
      }] : []),
      { type: 'divider' },
      {
        key: 'delete',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🗑️</span>
            <span>删除</span>
          </div>
        ),
        onClick: (e) => {
          e?.stopPropagation?.();
          onMoreAction && onMoreAction('delete', record);
        }
      }
    ];

    // 笔记类型添加标记为研修成果功能
    if (record.type === 'note' || record.type === 'document') {
      return [
        {
          key: 'view',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>👁️</span>
              <span>查看</span>
            </div>
          ),
          onClick: (e) => {
            e?.stopPropagation?.();
            onMoreAction && onMoreAction('view', record);
          }
        },
        {
          key: 'openInNewWindow',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🔗</span>
              <span>新窗口打开</span>
            </div>
          ),
          onClick: (e) => {
            e?.stopPropagation?.();
            onMoreAction && onMoreAction(MORE_MENU_ACTIONS.OPEN_IN_NEW_WINDOW, record);
          }
        },
        ...(record?.subType === 'document' || record.type === 'document' ? [
          {
            key: 'convertToSource',
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>📋</span>
                <span>转换为来源</span>
              </div>
            ),
            onClick: (e) => {
              e?.stopPropagation?.();
              onMoreAction && onMoreAction('convertToSource', record);
            }
          }
        ] : []),
        ...commonItems
      ];
    }

    // 智能评阅类型：增加“合并到源”选项
    if (record.type === 'smart-evaluation') {
      return [
        {
          key: 'view',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>👁️</span>
              <span>查看</span>
            </div>
          ),
          onClick: (e) => {
            e?.stopPropagation?.();
            onMoreAction && onMoreAction('view', record);
          }
        },
        {
          key: 'mergeToSource',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🔗</span>
              <span>合并到源</span>
            </div>
          ),
          onClick: (e) => {
            e?.stopPropagation?.();
            onMoreAction && onMoreAction('mergeToSource', record);
          }
        },
        ...commonItems
      ];
    }

    // 培训方案类型添加提交按钮
    if (record.type === 'training-plan') {
      const commonWithSettings = commonItems; // 移除“方案配置”选项

      return [
        {
          key: 'submit',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📤</span>
              <span>提交</span>
            </div>
          ),
          onClick: (e) => {
            e?.stopPropagation?.();
            onMoreAction && onMoreAction('submit', record);
          }
        },
        {
          key: 'convertToSource',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📋</span>
              <span>转换为来源</span>
            </div>
          ),
          onClick: (e) => {
            e?.stopPropagation?.();
            onMoreAction && onMoreAction('convertToSource', record);
          }
        },
        ...commonWithSettings
      ];
    }

    // 知识图谱类型添加高级编辑功能
    if (record.type === 'knowledge-graph' || record.source === '知识图谱标注系统' || record.title?.includes('知识图谱')) {
      return [
        {
          key: 'advancedEdit',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>⚙️</span>
              <span>高级编辑</span>
            </div>
          ),
          onClick: () => onMoreAction && onMoreAction('advancedEdit', record)
        },
        ...commonItems
      ];
    }

    // 学习计划类型添加同步到日历功能
    if (record.type === 'learning-plan') {
      const syncedPlans = JSON.parse(localStorage.getItem('synced-learning-plans') || '[]');
      const isSynced = syncedPlans.includes(record.id);

      return [
        {
          key: 'syncToCalendar',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>{isSynced ? '📅' : '📅'}</span>
              <span>{isSynced ? '取消日历同步' : '同步到我的日历'}</span>
            </div>
          ),
          onClick: (e) => {
            e?.stopPropagation?.();
            
            if (isSynced) {
              // 取消同步逻辑
              try {
                // 从已同步的学习计划列表中移除（先更新这个）
                const updatedSyncedPlans = syncedPlans.filter(id => id !== record.id);
                localStorage.setItem('synced-learning-plans', JSON.stringify(updatedSyncedPlans));
                
                console.log('OperationPanel: 取消同步，更新后的计划列表', updatedSyncedPlans);
                
                // 获取现有的日历分类
                const existingCategories = JSON.parse(localStorage.getItem('calendar-categories') || '[]');
                
                // 移除对应的学习计划分类
                const updatedCategories = existingCategories.filter(cat => {
                  if (cat.type !== 'learning-plan') return true;
                  const sameByKey = cat.key === `learning-plan-${record.id}`;
                  const sameByPlan = cat.planId === record.id;
                  return !(sameByKey || sameByPlan);
                });
                localStorage.setItem('calendar-categories', JSON.stringify(updatedCategories));
                
                // 触发日历分类更新事件
                window.dispatchEvent(new CustomEvent('calendarCategoriesChanged', {
                  detail: { categories: updatedCategories }
                }));

                // 触发自定义同步状态变化事件
                window.dispatchEvent(new CustomEvent('syncedPlansChanged', {
                  detail: { syncedPlans: updatedSyncedPlans }
                }));
                
                console.log('OperationPanel: 已触发syncedPlansChanged事件');
                
                message.success(`学习计划"${record.title}"已取消日历同步！`);
                
                // 强制重新渲染以更新菜单状态
                setOperationRecords(prev => ({ ...prev }));
                
              } catch (error) {
                console.error('取消日历同步失败:', error);
                message.error('取消同步失败，请重试');
              }
              return;
            }

            // 执行同步逻辑
            try {
              // 获取现有的日历分类
              const existingCategories = JSON.parse(localStorage.getItem('calendar-categories') || '[]');
              
              // 创建新的学习计划分类
              const newCategory = {
                key: `learning-plan-${record.id}`,
                label: `学习计划: ${record.title}`,
                color: '#1890ff',
                checked: true,
                type: 'learning-plan',
                planId: record.id,
                planTitle: record.title
              };

              // 检查是否已存在相同的分类
              const categoryExists = existingCategories.some(cat => 
                cat.type === 'learning-plan' && (cat.planId === record.id || cat.key === newCategory.key)
              );
              
              if (!categoryExists) {
                // 添加新分类到现有分类中
                const updatedCategories = [...existingCategories, newCategory].filter((cat, index, arr) => {
                  if (cat.type !== 'learning-plan') return true;
                  const id = cat.planId ?? cat.key;
                  return arr.findIndex(c => (c.planId ?? c.key) === id && c.type === 'learning-plan') === index;
                });
                localStorage.setItem('calendar-categories', JSON.stringify(updatedCategories));
                
                // 触发日历分类更新事件
                window.dispatchEvent(new CustomEvent('calendarCategoriesChanged', {
                  detail: { categories: updatedCategories }
                }));
              }

              // 更新已同步的学习计划列表
              const updatedSyncedPlans = [...syncedPlans, record.id];
              localStorage.setItem('synced-learning-plans', JSON.stringify(updatedSyncedPlans));
              
              // 触发自定义同步状态变化事件
              window.dispatchEvent(new CustomEvent('syncedPlansChanged', {
                detail: { syncedPlans: updatedSyncedPlans }
              }));
              
              message.success(`学习计划"${record.title}"已同步到日历！`);
              
              // 强制重新渲染以更新菜单状态
              setOperationRecords(prev => ({ ...prev }));
              
            } catch (error) {
              console.error('同步到日历失败:', error);
              message.error('同步失败，请重试');
            }
          }
        },
        {
          key: 'view',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>👁️</span>
              <span>查看</span>
            </div>
          ),
          onClick: (e) => {
            e?.stopPropagation?.();
            onMoreAction && onMoreAction('view', record);
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
          onClick: () => onMoreAction && onMoreAction('convertToSource', record)
        },
        ...commonItems
      ];
    }

    // 默认返回通用选项
    return [
      {
        key: 'view',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>👁️</span>
            <span>查看</span>
          </div>
        ),
        onClick: () => onMoreAction && onMoreAction('view', record)
      },
      ...commonItems
    ];
  };

  // 处理主题选择确认（简化版本）
  const handleThemeSelectConfirm = async (targetTheme, record, actionType) => {
    message.success(`${actionType === 'copy' ? '复制' : '移动'}操作完成`);
    setShowThemeSelectModal(false);
  };

  // 视图组件渲染
  if (rightPanelView === RIGHT_PANEL_VIEWS.NOTE_EDITOR) {
    return (
      <NoteEditorViewer 
        rightPanelEditingNote={rightPanelEditingNote}
        rightPanelNoteContent={rightPanelNoteContent}
        setRightPanelView={setRightPanelView}
        setRightPanelEditingNote={setRightPanelEditingNote}
        setRightPanelNoteContent={setRightPanelNoteContent}
        setOperationRecords={setOperationRecords}
      />
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.QUESTION_VIEWER) {
    return (
      <QuestionViewer 
        rightPanelQuestionRecord={rightPanelQuestionRecord}
        rightPanelQuestionContent={rightPanelQuestionContent}
        setRightPanelView={setRightPanelView}
        setRightPanelQuestionRecord={setRightPanelQuestionRecord}
        setRightPanelQuestionContent={setRightPanelQuestionContent}
        practiceMode={practiceMode}
        setPracticeMode={setPracticeMode}
        userAnswers={userAnswers}
        setUserAnswers={setUserAnswers}
        currentQuestionIndex={currentQuestionIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        showResults={showResults}
        setShowResults={setShowResults}
        score={score}
        setScore={setScore}
      />
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.MEMORY_CARD_VIEWER) {
    return (
      <MemoryCardViewer
        rightPanelMemoryCardsRecord={rightPanelMemoryCardsRecord}
        setRightPanelMemoryCardsRecord={setRightPanelMemoryCardsRecord}
        setRightPanelView={setRightPanelView}
      />
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.QUIZ_VIEWER) {
    return (
      <QuizViewer
        rightPanelQuizRecord={rightPanelQuizRecord}
        setRightPanelQuizRecord={setRightPanelQuizRecord}
        setRightPanelView={setRightPanelView}
      />
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.REPORT_VIEWER) {
    return (
      <ReportViewer
        rightPanelReportRecord={rightPanelReportRecord}
        rightPanelReportContent={rightPanelReportContent}
        setRightPanelView={setRightPanelView}
        setRightPanelReportRecord={setRightPanelReportRecord}
        setRightPanelReportContent={setRightPanelReportContent}
      />
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.GRADING_VIEWER) {
    return (
      <GradingViewer 
        rightPanelGradingRecord={rightPanelGradingRecord}
        rightPanelGradingContent={rightPanelGradingContent}
        setRightPanelView={setRightPanelView}
        setRightPanelGradingRecord={setRightPanelGradingRecord}
        setRightPanelGradingContent={setRightPanelGradingContent}
        gradingViewMode={gradingViewMode}
        setGradingViewMode={setGradingViewMode}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        handleGradingToolAction={handleGradingToolAction}
      />
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.LEARNING_PLAN_VIEWER) {
    return (
      <LearningPlanViewer 
        rightPanelLearningPlanRecord={rightPanelLearningPlanRecord}
        rightPanelLearningPlanContent={rightPanelLearningPlanContent}
        setRightPanelView={setRightPanelView}
        setRightPanelLearningPlanRecord={setRightPanelLearningPlanRecord}
        setRightPlanelLearningPlanContent={setRightPanelLearningPlanContent}
      />
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.CLASSROOM_EVALUATION_VIEWER) {
    return (
      <ClassroomEvaluationViewer 
        rightPanelNoteRecord={rightPanelEditingNote}
        rightPanelNoteContent={rightPanelNoteContent}
        setRightPanelView={setRightPanelView}
        setRightPanelNoteRecord={setRightPanelEditingNote}
        setRightPanelNoteContent={setRightPanelNoteContent}
      />
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.CLASSROOM_BEHAVIOR_ANALYSIS_VIEWER) {
    return (
      <ClassroomBehaviorAnalysisViewer 
        sourceInfo={sourceInfo}
        setRightPanelView={setRightPanelView}
      />
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.TRAINING_PLAN_VIEWER) {
    return (
      <TrainingPlanViewer 
        rightPanelTrainingPlanRecord={rightPanelTrainingPlanRecord}
        rightPanelTrainingPlanContent={rightPanelTrainingPlanContent}
        setRightPanelView={setRightPanelView}
        setRightPanelTrainingPlanRecord={setRightPanelTrainingPlanRecord}
        setRightPanelTrainingPlanContent={setRightPanelTrainingPlanContent}
        selectedCategory={noteCategory}
      />
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.TRAINING_SETTINGS_VIEWER) {
    return (
      <TrainingTypeSettingsViewer 
        record={rightPanelTrainingPlanRecord}
        setRightPanelView={setRightPanelView}
      />
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.TRAINING_REPORT_VIEWER) {
    return (
      <TrainingReportViewer 
        rightPanelTrainingReportRecord={rightPanelTrainingReportRecord}
        rightPanelTrainingReportContent={rightPanelTrainingReportContent}
        setRightPanelView={setRightPanelView}
        setRightPanelTrainingReportRecord={setRightPanelTrainingReportRecord}
        setRightPanelTrainingReportContent={setRightPanelTrainingReportContent}
      />
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.TRAINING_DASHBOARD_VIEWER) {
    return (
      <TrainingDashboardViewer 
        setRightPanelView={setRightPanelView}
      />
    );
  }

  // 课程选择右侧视图：显示已选及操作
  if (rightPanelView === RIGHT_PANEL_VIEWS.COURSE_SELECTION_VIEWER) {
    const categories = [
      { id: 'teaching_resources', name: '教学资源库' },
      { id: 'technology_training', name: '技术培训资源库' },
      { id: 'family_education', name: '家庭教育资源库' },
      { id: 'school_management', name: '学校管理资源库' },
      { id: 'mental_health', name: '心理健康资源库' },
      { id: 'new_teacher_resources', name: '新教师资源库' }
    ];
    const getCollectionThumbnail = (cat) => {
      const map = {
        teaching_resources: '/thumbnails/documents.png',
        technology_training: '/thumbnails/videos.png',
        family_education: '/thumbnails/presentations.png',
        school_management: '/thumbnails/images.png',
        mental_health: '/thumbnails/images.png',
        new_teacher_resources: '/thumbnails/presentations.png'
      };
      return map[cat] || '/thumbnails/default.png';
    };
    const createDefaultCollections = () => {
      const pickByCategory = (cat, limit = 8) => initialResources.filter(r => r.category === cat).slice(0, limit);
      const cats = [
        { id: 'teaching_resources', title: '教学资源精选' },
        { id: 'technology_training', title: '技术培训精选' },
        { id: 'family_education', title: '家庭教育精选' },
        { id: 'school_management', title: '学校管理精选' },
        { id: 'mental_health', title: '心理健康研修' }
      ];
      const result = [];
      cats.forEach(cat => {
        const items = pickByCategory(cat.id, 8);
        for (let i = 0; i < Math.max(1, Math.ceil(items.length / 4)); i++) {
          result.push({ id: `rc-${cat.id}-${i+1}`, title: cat.title, category: cat.id, createdAt: new Date().toLocaleDateString('zh-CN'), items });
        }
      });
      return result;
    };
    const collections = createDefaultCollections();
    const titleByCategory = {
      teaching_resources: '教学资源精选',
      technology_training: '技术培训精选',
      family_education: '家庭教育精选',
      school_management: '学校管理精选',
      mental_health: '心理健康研修',
      new_teacher_resources: '新教师资源'
    };
    const selectedCards = (state.courseSelectionSelectedIds || []).map(id => {
      const found = collections.find(c => c.id === id);
      if (found) return found;
      const m = /^rc-([a-z_]+)-\d+$/.exec(String(id || ''));
      const cat = m ? m[1] : 'teaching_resources';
      return { id, title: titleByCategory[cat] || '资料集合', category: cat, items: [] };
    });
    const videoMinutesForItem = (resId) => {
      // 确定性模拟：根据资源ID字符码映射到 30~90 分钟
      const s = String(resId || '');
      let sum = 0; for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i);
      return 30 + (sum % 61);
    };
    const totalMinutesForCollection = (rc) => {
      if (!Array.isArray(rc.items)) return 0;
      return rc.items.reduce((acc, it) => acc + (it.type === 'video' ? videoMinutesForItem(it.id) : 0), 0);
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
          <Space>
            <Text style={{ fontWeight: 600 }}>已选课程集合</Text>
            <Tag color="geekblue">{(state.courseSelectionSelectedIds || []).length} 个</Tag>
          </Space>
          <Space>
            <Button size="small" type="primary" onClick={() => setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS)}>确定</Button>
            <Button size="small" onClick={() => setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS)}>取消</Button>
          </Space>
        </div>
        {(() => {
          // 计算配课完成进度：按视频总时长换算（60分钟 = 1学时）
          const requiredHours = state.rightPanelTrainingPlanRecord?.requiredHours || 8;
          const selectedTotalMinutes = selectedCards.reduce((acc, rc) => acc + totalMinutesForCollection(rc), 0);
          const selectedHours = Math.round((selectedTotalMinutes / 60) * 10) / 10; // 保留1位小数
          const percent = Math.min(100, Math.round((selectedHours / Math.max(1, requiredHours)) * 100));
          return (
            <div style={{ padding: '10px 16px', borderBottom: '1px dashed #efefef' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text type="secondary">配课进度：已选时长 {selectedTotalMinutes} 分钟（≈ {selectedHours} 学时）/ 要求学时 {requiredHours}（{percent}%）</Text>
                <Progress percent={percent} size="small" showInfo={false} />
              </Space>
            </div>
          );
        })()}
        <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
          {(state.courseSelectionSelectedIds || []).length === 0 ? (
            <Text type="secondary">尚未选择集合，请在中间区域选择。</Text>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
              {selectedCards.map(rc => (
                <Card key={rc.id} hoverable bodyStyle={{ padding: 8 }} style={{ borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 40, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0' }}>
                        <img src={getCollectionThumbnail(rc.category)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rc.title}</div>
                        <div style={{ color: '#888', fontSize: 12 }}>{(categories.find(c => c.id === rc.category)?.name) || '资料集合'}</div>
                        {(() => {
                          const minutes = totalMinutesForCollection(rc);
                          const hours = Math.round((minutes / 60) * 10) / 10;
                          return <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 4 }}>视频总时长：{minutes} 分钟（≈ {hours} 学时）</div>;
                        })()}
                      </div>
                    </div>
                    <Tooltip title="取消选择">
                      <Button size="small" type="text" onClick={() => {
                        const next = (state.courseSelectionSelectedIds || []).filter(id => id !== rc.id);
                        state.setCourseSelectionSelectedIds(next);
                        try {
                          window.dispatchEvent(new CustomEvent('courseSelectionUpdate', { detail: { phaseId: state.courseSelectionPhaseId, selectedIds: next } }));
                        } catch {}
                      }}>
                        <CloseCircleOutlined style={{ color: '#f5222d' }} />
                      </Button>
                    </Tooltip>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.VIDEO_PLAYER) {
    const src = selectedMaterial?.url || '/assets/支持下一代教育者.mp4';
    const togglePlay = () => {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) {
        v.play().catch(() => {});
        setVideoPlaying(true);
      } else {
        v.pause();
        setVideoPlaying(false);
      }
    };
    const format = (s) => {
      const ms = Math.max(0, Math.floor(s || 0));
      const mm = String(Math.floor(ms / 60)).padStart(2, '0');
      const ss = String(ms % 60).padStart(2, '0');
      return `${mm}:${ss}`;
    };
    const seekBy = (delta) => {
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
    };
    const cycleSpeed = () => {
      const arr = [0.75, 1, 1.25, 1.5];
      const idx = (arr.indexOf(videoSpeed) + 1) % arr.length;
      const v = videoRef.current;
      if (v) v.playbackRate = arr[idx];
      setVideoSpeed(arr[idx]);
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS)}>
              返回
            </Button>
            <Typography.Text style={{ fontWeight: 600 }}>
              {selectedMaterial?.title || '视频概览'}
            </Typography.Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button type="text" icon={<ShareAltOutlined />} />
            <Button type="text" icon={<DownloadOutlined />} onClick={() => {
              try {
                const a = document.createElement('a');
                a.href = src;
                a.download = selectedMaterial?.title || 'video.mp4';
                a.click();
              } catch {}
            }} />
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 400, display: 'flex', flexDirection: 'column', padding: 16 }}>
          <div style={{ flex: 1, background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video
              ref={videoRef}
              src={src}
              style={{ width: '100%', maxHeight: 420, display: 'block', background: '#000' }}
              onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration || 0)}
              onTimeUpdate={(e) => setVideoCurrent(e.currentTarget.currentTime || 0)}
              playsInline
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#666' }}>
              <span>{format(videoCurrent)}</span>
              <span>{format(videoDuration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(1, videoDuration)}
              step={0.1}
              value={videoCurrent}
              onChange={(e) => { const v = videoRef.current; if (v) v.currentTime = Number(e.target.value); }}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8 }}>
              <Button type="text" onClick={cycleSpeed}>{`${videoSpeed}x`}</Button>
              <Button type="text" icon={<StepBackwardOutlined />} onClick={() => seekBy(-10)} />
              <Button type="primary" shape="circle" icon={videoPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />} onClick={togglePlay} />
              <Button type="text" icon={<StepForwardOutlined />} onClick={() => seekBy(10)} />
              <Button type="text" icon={<ColumnWidthOutlined />} onClick={() => {
                const el = videoRef.current;
                if (el && el.requestFullscreen) el.requestFullscreen().catch(() => {});
              }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <Button type="text">不错的视频</Button>
            <Button type="text">视频质量差</Button>
          </div>
        </div>
      </div>
    );
  }

  // 直播播放器视图（嵌入式，复制点播结构但使用独立组件）
  if (rightPanelView === RIGHT_PANEL_VIEWS.LIVE_PLAYER) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS)}>
            返回
          </Button>
          <Typography.Text style={{ fontWeight: 600 }}>
            {selectedMaterial?.title || '直播播放器'}
          </Typography.Text>
        </div>
        <div style={{ flex: 1, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
          <LivePlayer
            embedded
            style={{ height: '100%' }}
            liveData={selectedMaterial}
            isWidescreenMode={isWidescreenMode}
            onToggleWidescreen={() => setIsWidescreenMode && setIsWidescreenMode(!isWidescreenMode)}
          />
        </div>
      </div>
    );
  }

  // 主要内容区域 - 使用工具网格组件
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: isCollapsed ? '52px' : 'auto', transition: 'width 0.3s ease' }}>
      <DndProvider backend={HTML5Backend}>
        <div style={{ 
          padding: isCollapsed ? '2px 0' : '24px 16px 12px 16px', 
          paddingBottom: isCollapsed ? '2px' : '12px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* 操作面板标题和编辑按钮 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: isCollapsed ? 'center' : 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {categoryIcon ? (
                  <img src={categoryIcon} alt="AI助手" style={{ width: 22, height: 22, borderRadius: '50%' }} />
                ) : (
                  <span style={{ fontSize: '16px' }}>💬</span>
                )}
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>智能工具</Title>
              </div>
            )}
            <Space size={8}>
              {!isCollapsed && (
                <Button
                  type={isEditMode ? 'primary' : 'default'}
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditMode(!isEditMode)}
                  style={{
                    fontSize: '12px',
                    height: '28px',
                    borderRadius: '6px'
                  }}
                >
                  {isEditMode ? '完成编辑' : '编辑'}
                </Button>
              )}
              <Tooltip title={isCollapsed ? '展开' : '收起'}>
                <Button
                  type="text"
                  size="small"
                  icon={isCollapsed ? <MenuUnfoldOutlined /> : <ColumnWidthOutlined />}
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  style={{
                    fontSize: '12px',
                    height: '28px',
                    width: '28px',
                    borderRadius: '6px',
                    background: '#f5f5f5'
                  }}
                />
              </Tooltip>
            </Space>
          </div>

          {/* 工具网格 */}
          {!isCollapsed && (
            <ToolGrid 
              visibleCards={visibleCards}
              setVisibleCards={setVisibleCards}
              isEditMode={isEditMode}
              hasSourceData={hasSourceData}
              sourceInfo={sourceInfo}
              showCardSelector={showCardSelector}
              setShowCardSelector={setShowCardSelector}
              onCardClick={handleCardClick}
              onAddCard={handleAddCard}
              onRemoveCard={handleRemoveCard}
              onMoveCard={moveCardPosition}
              onAddAITool={handleAddAITool}
              getAvailableAITools={getAvailableAITools}
              loadingCards={loadingCards}
              hideEmptySlots={hideEmptySlots}
              restrictedActive={window.__restrict_tools_stage1__ === true}
              restrictedAllowedKeys={['training-report','training-dashboard']}
              restrictedReason={'仅在选中“学段1”时允许培训报告/报表'}
            />
          )}
          
          {/* 收起后显示为垂直侧边栏 */}
          {isCollapsed && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '3px',
              alignItems: 'center',
              paddingTop: '2px'
            }}>
              {/* 智能工具区域标题图标 */}
              <Tooltip title="智能工具" placement="right">
                <div style={{
                  width: '34px',
                  height: '34px',
                  background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  cursor: 'default',
                  marginBottom: '3px',
                  border: '1.5px solid #7986cb'
                }}>
                  {categoryIcon ? (
                    <img src={categoryIcon} alt="AI助手" style={{ width: 18, height: 18, borderRadius: '50%' }} />
                  ) : (
                    <span>💬</span>
                  )}
                </div>
              </Tooltip>
              
              {/* 工具卡片列表 */}
              {visibleCards && visibleCards.length > 0 && visibleCards.filter(card => card.key !== 'addTool').map((card, index) => {
                const isLoading = loadingCards && typeof loadingCards.has === 'function' && loadingCards.has(card.key);
                return (
                <Tooltip key={card.key} title={card.title} placement="right">
                  <div
                    onClick={() => !isLoading && handleCardClick(card)}
                    style={{
                      width: '34px',
                      height: '34px',
                      background: card.gradient || '#f5f5f5',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      opacity: hasSourceData || card.key === 'addTool' ? 1 : 0.5,
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                    }}
                  >
                    {card.icon}
                    {isLoading && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          border: '2px solid #1890ff',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }} />
                      </div>
                    )}
                  </div>
                </Tooltip>
                );
              })}
              
              {/* 分隔线 */}
              <div style={{
                width: '22px',
                height: '1px',
                background: '#e0e0e0',
                margin: '2px 0'
              }} />
              
              {/* 操作记录区域标题图标 */}
              <Tooltip title="操作记录" placement="right">
                <div style={{
                  width: '34px',
                  height: '34px',
                  background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  cursor: 'default',
                  marginBottom: '3px',
                  border: '1.5px solid #ffb74d'
                }}>
                  📝
                </div>
              </Tooltip>
              
              {/* 操作记录列表（最多显示8个） */}
              {operationRecords && Object.values(operationRecords)
                .flat()
                .filter(r => categoryKey === 'organizational_training' || r.type !== 'learning-plan')
                .slice(0, 8)
                .map(record => {                
                const getIcon = (type, isGenerating) => {
                  // 如果正在生成，显示旋转图标
                  if (isGenerating) {
                    return (
                      <div style={{
                        animation: 'spin 1s linear infinite',
                        fontSize: '15px'
                      }}>
                        🔄
                      </div>
                    );
                  }
                  
                const iconMap = {
                  'audio': '🎧',
                  'video': '🎥',
                  'mindmap': '🧠',
                  'report': '📊',
                  'ppt': '📊',
                  'webcode': '💻',
                  'scenario': '🎭',
                  'note': '📝',
                  'document': '📝',
                  'question': '❓',
                  'memory-cards': '🧠',
                  'quiz': '❓',
                  'learning-plan': '📅',
                  'grading': '✅',
                  'knowledge-graph': '🕸️',
                  'training-plan': '🎯',
                  'training-dashboard': '📈',
                  'classroom-evaluation': '📊',
                  'site-analysis': '🔍',
                  'supervision-execution': '🛡️',
                  'supervision-task': '🗂️',
                  'supervision-report': '📄'
                };
                  return iconMap[type] || '📄';
                };
                
                return (
                  <Tooltip key={record.id} title={record.isGenerating ? '正在生成...' : record.title} placement="right">
                    <div
                      onClick={() => !record.isGenerating && onRecordClick && onRecordClick(record)}
                      style={{
                        width: '34px',
                        height: '34px',
                        background: record.isGenerating ? '#e6f7ff' : '#f5f5f5',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '15px',
                        cursor: record.isGenerating ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        opacity: record.isGenerating ? 0.7 : 1,
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!record.isGenerating) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                          e.currentTarget.style.background = '#e3f2fd';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!record.isGenerating) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                          e.currentTarget.style.background = '#f5f5f5';
                        }
                      }}
                    >
                      {(() => {
                        // 左上角显示工具名称（简短标签）
                          const typeLabelMap = {
                            'audio': '音',
                            'video': '视',
                            'mindmap': '脑',
                            'report': '报',
                            'ppt': 'P',
                            'webcode': '码',
                            'scenario': '戏',
                            'note': '记',
                            'document': '文',
                            'question': '题',
                            'memory-cards': '卡',
                            'quiz': '测',
                            'learning-plan': '学',
                            'grading': '评',
                            'knowledge-graph': '图',
                            'training-plan': '培',
                            'training-dashboard': '训',
                            'classroom-evaluation': '课'
                          };
                        const label = typeLabelMap[record.type] || '工';
                        return (
                          <>
                            <div style={{
                              position: 'absolute',
                              top: -4,
                              left: -4,
                              width: 18,
                              height: 18,
                              borderRadius: 6,
                              background: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
                              border: '1px solid #91a7ff',
                              color: '#1d39c4',
                              fontSize: 11,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                            }}>{label}</div>
                            {getIcon(record.type, record.isGenerating)}
                          </>
                        );
                      })()}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          )}
        </div>
      </DndProvider>

      {/* 新建笔记 · 模板库弹窗 */}
      <Modal
        open={showNoteTemplateModal}
        title={noteCreationTargetSubType === 'whiteboard' ? '选择画板模板' : '选择文档模板'}
        onCancel={() => setShowNoteTemplateModal(false)}
        footer={null}
        width={960}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 520 }}>
          {/* 左侧分类菜单（静态） */}
          <div style={{ borderRight: '1px solid #f0f0f0', padding: 16 }}>
            {[
              { key: 'recommend', label: '推荐' },
              { key: 'latest', label: '最新' },
              { key: 'teach_design', label: '教学设计' },
              { key: 'classroom_management', label: '课堂管理' },
              { key: 'homework_review', label: '作业与评阅' },
              { key: 'teaching_research', label: '教研活动' },
              { key: 'meeting_teaching', label: '会议纪要' },
              { key: 'teacher_development_okr', label: '教师发展 OKR' },
              { key: 'training_plan', label: '培训方案与管理' },
              { key: 'training_needs', label: '培训需求管理' },
              { key: 'class_management', label: '班级管理' },
              { key: 'home_school', label: '家校沟通' },
              { key: 'e_pbl', label: '课程融合（E-PBL）' },
              { key: 'learning_analytics', label: '学情分析' },
              { key: 'research_topic', label: '研究课题' },
              { key: 'general_docs', label: '通用模板' }
            ].map(item => (
              <div
                key={item.key}
                onClick={() => setTemplateCategory(item.key)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: templateCategory === item.key ? '#f5f7ff' : 'transparent',
                  marginBottom: 6
                }}
              >{item.label}</div>
            ))}
          </div>
          {/* 右侧内容区 */}
          <div style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {/* 新建空白 */}
              <Card
                hoverable
                style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => createNoteFromTemplate(null)}
              >
                <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>+</div>
                  <div>新建空白{noteCreationTargetSubType === 'whiteboard' ? '画板' : '文档'}</div>
                </div>
              </Card>
              {/* 模板列表 */}
              {noteTemplateLoading ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>
                  <Text type="secondary">正在加载模板...</Text>
                </div>
              ) : (
                (noteTemplates || []).filter(tpl => !templateCategory || templateCategory === 'recommend' ? true : tpl.category === templateCategory).map(tpl => (
                  <Card key={tpl.id} hoverable onClick={() => createNoteFromTemplate(tpl)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 14 }}>📄</span>
                      <span style={{ fontWeight: 500 }}>{tpl.name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>{tpl.description}</div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>
      
      {/* 操作记录区域 */}
      {!isCollapsed && (
        <div style={{ 
          padding: '20px', 
          borderTop: '1px solid #f0f0f0', 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>📝 操作记录</Title>
          <Dropdown
            open={noteTypeDropdownVisible}
            onOpenChange={(open) => setNoteTypeDropdownVisible(open)}
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              items: [
                {
                  key: 'document',
                  label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>📄</span>
                      <span>文档</span>
                    </div>
                  ),
                  onClick: () => openNoteTemplateModal('document')
                },
                {
                  key: 'whiteboard',
                  label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>🧭</span>
                      <span>白板</span>
                    </div>
                  ),
                  onClick: () => openNoteTemplateModal('whiteboard')
                }
              ]
            }}
          >
            <Button 
              type="primary" 
              size="small" 
              icon={<PlusOutlined />} 
              style={{ borderRadius: '4px', fontSize: '12px', height: '24px' }}
            >
              新建笔记
            </Button>
          </Dropdown>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {Object.values(operationRecords)
            .flat()
            .filter(r => categoryKey === 'organizational_training' || r.type !== 'learning-plan')
            .map(record => {
            const getIcon = (type, isGenerating) => {
              // 如果正在生成，显示旋转图标
              if (isGenerating) {
                return (
                  <div style={{
                    animation: 'spin 1s linear infinite',
                    fontSize: '10px',
                    color: '#1890ff'
                  }}>
                    🔄
                  </div>
                );
              }
              
              switch(type) {
                case 'audio': return '音';
                case 'video': return '视';
                case 'mindmap': return '思';
                case 'report': return '报';
                case 'ppt': return 'PPT';
                case 'webcode': return '💻';
                case 'scenario': return '场';
                case 'note': return '笔';
                case 'document': return '笔';
                case 'question': return '题';
                case 'memory-cards': return '卡';
                case 'quiz': return '测';
                case 'learning-plan': return '计';
                case 'grading': return '阅';
                case 'knowledge-graph': return '知';
                case 'training-plan': return '培';
                default: return '📄';
              }
            };
            
            return (
              <Card 
                key={record.id}
                size="small" 
                style={{ 
                  marginBottom: '8px',
                  cursor: record.isGenerating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: record.isGenerating ? 0.7 : 1,
                  background: record.isGenerating ? '#e6f7ff' : '#fff',
                  position: 'relative',
                  overflow: 'visible'
                }}
                styles={{ body: { padding: '8px 12px' } }}
                onClick={(e) => {
                  // 生成中不可点击
                  if (record.isGenerating) {
                    return;
                  }
                  
                  // 检查点击的目标是否是下拉菜单相关的元素
                  const target = e.target;
                  const isDropdownClick = target.closest('.ant-dropdown') || 
                                        target.closest('[data-menu-id]') ||
                                        target.closest('.ant-dropdown-menu') ||
                                        target.closest('button[aria-haspopup="true"]');
                  
                  if (!isDropdownClick) {
                    onRecordClick && onRecordClick(record);
                  }
                }}
              >
                {/* 移除右上角“智能工具”角标，类型标签改为标题右侧的【类型】 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: record.isGenerating ? '#91d5ff' : '#f0f0f0',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      marginRight: '8px',
                      flexShrink: 0
                    }}>
                      {getIcon(record.type, record.isGenerating)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <Text ellipsis style={{ fontSize: '12px', fontWeight: 500, flex: '0 1 auto', maxWidth: '70%', color: record.isGenerating ? '#1890ff' : 'inherit' }}>
                          {record.isGenerating ? '正在生成...' : record.title}
                        </Text>
                        {(() => {
                          // 计算类型标签，并以 Tag 样式显示在标题右侧
                          let typeLabel = null;
                          let typeKey = null;
                          if (record.type === 'whiteboard' || (record.type === 'note' && record.subType === 'whiteboard')) {
                            typeLabel = '白板';
                            typeKey = 'whiteboard';
                          } else if (record.type === 'document' || (record.type === 'note' && record.subType === 'document')) {
                            typeLabel = '文档';
                            typeKey = 'document';
                          } else {
                          const map = {
                            audio: '音频',
                            video: '视频',
                            mindmap: '思维导图',
                            report: '报告',
                            ppt: 'PPT',
                            webcode: '网页',
                            scenario: '场景',
                            'training-plan': '培训方案',
                            'training-report': '培训报告',
                            'training-dashboard': '培训报表',
                            'learning-plan': '学习计划',
                            grading: '阅卷',
                            'classroom-evaluation': '课堂评价',
                            'classroom-behavior-analysis': '课堂行为分析',
                            question: '试题',
                            'site-analysis': '现场分析',
                            'supervision-execution': '督学执行',
                            'supervision-task': '督学任务',
                            'supervision-report': '督学报告',
                            'exam-paper': '试卷',
                            'smart-evaluation': '智能评阅'
                          };
                            typeLabel = map[record.type] || null;
                            typeKey = record.type || null;
                          }
                          if (!typeLabel) return null;
                          const colorMap = {
                            whiteboard: 'geekblue',
                            document: 'blue',
                            audio: 'cyan',
                            video: 'green',
                            mindmap: 'magenta',
                            report: 'orange',
                            ppt: 'red',
                            webcode: 'blue',
                            scenario: 'purple',
                            'training-plan': 'geekblue',
                            'training-report': 'orange',
                            'training-dashboard': 'geekblue',
                            'learning-plan': 'blue',
                            grading: 'pink',
                            'classroom-evaluation': 'green',
                            'classroom-behavior-analysis': 'geekblue',
                            'site-analysis': 'purple',
                            'supervision-execution': 'geekblue',
                            'supervision-task': 'geekblue',
                            'supervision-report': 'geekblue',
                            question: 'gold',
                            'exam-paper': 'gold',
                            'smart-evaluation': 'purple'
                          };
                          const tagColor = colorMap[typeKey] || 'default';
                          return (
                            <Tag color={tagColor} style={{
                              flexShrink: 0,
                              margin: 0,
                              fontSize: 12,
                              lineHeight: '18px',
                              height: 20
                            }}>
                              {typeLabel}
                            </Tag>
                          );
                        })()}
                        {(() => {
                          // 生成方式标签：对白板、文档、培训方案、培训报表显示（AI / 手工）
                          const isDoc = (record.type === 'note' && record.subType === 'document');
                          const isWhiteboard = (record.type === 'whiteboard' || (record.type === 'note' && record.subType === 'whiteboard'));
                          const isDocument = (record.type === 'document');
                          const isTrainingPlan = (record.type === 'training-plan');
                          const isTrainingDashboard = (record.type === 'training-dashboard');
                          const isSiteAnalysis = (record.type === 'site-analysis');
                          const isSupervision = (record.type === 'supervision-execution' || record.type === 'supervision-task' || record.type === 'supervision-report');
                          if (!(isDoc || isDocument || isWhiteboard || isTrainingPlan || isTrainingDashboard || isSiteAnalysis || isSupervision)) return null;
                          const genLabel = (record.isAIGenerated || isSiteAnalysis) ? 'AI' : '手工';
                          const genColor = record.isAIGenerated ? 'processing' : 'default';
                          return (
                            <Tag color={genColor} style={{
                              flexShrink: 0,
                              margin: 0,
                              fontSize: 12,
                              lineHeight: '18px',
                              height: 20
                            }}>
                              {genLabel}
                            </Tag>
                          );
                        })()}
                        {/* 显示研修成果标记状态 */}
                        {record.tags && record.tags.includes('研修成果') && (
                          <div style={{
                            background: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
                            color: '#fa8c16',
                            fontSize: '8px',
                            padding: '1px 4px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            border: '1px solid #ffec3d',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            flexShrink: 0
                          }}>
                            <span>⭐</span>
                            <span>研修成果</span>
                          </div>
                        )}
                        {/* 显示语料标记状态 */}
                        {record.tags && record.tags.includes('语料') && (
                          <div style={{
                            background: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
                            color: '#1890ff',
                            fontSize: '8px',
                            padding: '1px 4px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            border: '1px solid #40a9ff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            flexShrink: 0
                          }}>
                            <span>🧠</span>
                            <span>语料</span>
                          </div>
                        )}
                        {/* 显示标注标记状态（文档型笔记） */}
                        {record.tags && record.tags.includes('标注') && (
                          <div style={{
                            background: 'linear-gradient(135deg, #fff0f6 0%, #ffadd2 100%)',
                            color: '#c41d7f',
                            fontSize: '8px',
                            padding: '1px 4px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            border: '1px solid #eb2f96',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            flexShrink: 0
                          }}>
                            <span>🏷️</span>
                            <span>标注</span>
                          </div>
                        )}
                        {/* 显示被研修成果关联信息 */}
                        {(() => {
                          const assocMap = achievementAssociations || {};
                          const recordKey = `${record.type}:${record.id}`;
                          const titles = [];
                          Object.keys(assocMap).forEach(aid => {
                            const info = assocMap[aid] || {};
                            const list = Array.isArray(info.linkedOperationIds) ? info.linkedOperationIds : [];
                            const matched = list.some(val => String(val) === recordKey || String(val) === String(record.id));
                            if (matched) {
                              titles.push(info.title || '研修成果');
                            }
                          });
                          if (titles.length === 0) return null;
                          const text = titles.length === 1 ? `被关联：${titles[0]}` : `被关联：${titles[0]} 等${titles.length}项`;
                          return (
                            <div style={{
                              background: 'linear-gradient(135deg, #f9f0ff 0%, #d3adf7 100%)',
                              color: '#722ed1',
                              fontSize: '8px',
                              padding: '1px 4px',
                              borderRadius: '8px',
                              fontWeight: 'bold',
                              border: '1px solid #9254de',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px',
                              flexShrink: 0
                            }}>
                              <span>🔗</span>
                              <span>{text}</span>
                            </div>
                          );
                        })()}
                        {record.type === 'training-plan' && record.isSubmitted && (
                          <div style={{
                            background: 'linear-gradient(135deg, #f6ffed 0%, #b7eb8f 100%)',
                            color: '#52c41a',
                            fontSize: '8px',
                            padding: '1px 4px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            border: '1px solid #73d13d',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            flexShrink: 0
                          }}>
                            <span>✓</span>
                            <span>已提交</span>
                          </div>
                        )}
                        {/* 显示学习计划同步状态 */}
                        {record.type === 'learning-plan' && (() => {
                          const syncedPlans = JSON.parse(localStorage.getItem('synced-learning-plans') || '[]');
                          const isSynced = syncedPlans.includes(record.id);
                          return isSynced ? (
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px',
                              flexShrink: 0
                            }}>
                              <div style={{
                                background: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
                                color: '#1890ff',
                                fontSize: '8px',
                                padding: '1px 4px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                border: '1px solid #40a9ff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px'
                              }}>
                                <span>📅</span>
                                <span>已同步到日历</span>
                              </div>

                            </div>
                          ) : null;
                        })()}
                      </div>
                      {/* 不显示来源与来源标签（统一精简卡片信息） */}
                      <Text style={{ fontSize: '10px', color: '#999' }}>
                        {record.time}
                      </Text>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {record.type === 'video' && (
                      <Button
                        type="text"
                        size="small"
                        icon={<PlayCircleOutlined style={{ color: '#1890ff' }} />}
                        style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          try {
                            const videoData = {
                              id: record.id,
                              title: record.title,
                              url: record.url || '/assets/支持下一代教育者.mp4'
                            };
                            setRightPanelView && setRightPanelView(RIGHT_PANEL_VIEWS.VIDEO_PLAYER);
                            state?.setSelectedMaterial && state.setSelectedMaterial(videoData);
                          } catch {}
                        }}
                        title="播放视频"
                      />
                    )}
                    {record.type === 'audio' && (
                      <Button
                        type="text"
                        size="small"
                        icon={<PlayCircleOutlined style={{ color: '#1890ff' }} />}
                        style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                        onClick={(e) => { e.stopPropagation(); setOpenAudioRecordId(prev => prev === record.id ? null : record.id); }}
                        title="播放"
                      />
                    )}
                    {record.type === 'audio' && openAudioRecordId === record.id && (
                      <Button
                        type="text"
                        size="small"
                        icon={<UpOutlined />}
                        style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                        onClick={(e) => { e.stopPropagation(); try { audioRefs.current[record.id]?.pause(); } catch (err) {} setOpenAudioRecordId(null); }}
                        title="隐藏播放器"
                      />
                    )}
                    <Dropdown
                      menu={{ items: getMoreMenuItems(record) }}
                      trigger={['click']}
                      placement="bottomRight"
                      onOpenChange={(open) => {
                        console.log('Dropdown open change:', open);
                        // 当下拉菜单打开时，我们不需要阻止菜单项的点击事件
                        // 只需要阻止Card本身的点击事件即可
                      }}
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
                </div>
                {record.type === 'audio' && openAudioRecordId === record.id && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
                    <audio
                      src={record.url || '/assets/新教师如何突围新手村_AI成第三导师.m4a'}
                      controls
                      style={{ width: '100%' }}
                      ref={(el) => { if (el) { audioRefs.current[record.id] = el; } }}
                    />
                  </div>
                )}
              </Card>
            );
          })}
          
          {Object.values(operationRecords).flat().length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
              暂无操作记录
            </div>
          )}
        </div>
      </div>
      )}

      {/* 模态框组件 */}
      <QuestionConfigModal
        inline
        visible={questionConfigVisible}
        onCancel={() => setQuestionConfigVisible(false)}
        onConfirm={(config) => {
          // 生成试题记录
          const operationRecord = {
            id: Date.now(),
            type: 'question',
            title: '智能试题',
            source: sourceInfo?.details || '基于当前数据源',
            time: new Date().toLocaleString('zh-CN'),
            content: `<div style="padding: 20px; text-align: center;">
              <h3>📝 智能试题</h3>
              <p style="color: #666;">基于${sourceInfo?.total || 1}个数据源生成的智能试题</p>
              <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
            </div>`,
            config
          };

          // 使用通用函数添加记录
          addRecordWithGenerating('question', operationRecord, {
            onComplete: () => {
              // 不自动打开右侧详细视图，保持在“智能工具/操作记录”
              message.success('试题生成成功！请点击操作记录查看详情');
            }
          });
          
          // 关闭弹窗
          setQuestionConfigVisible(false);
        }}
      />

      <LearningPlanModal
        inline
        visible={learningPlanModalVisible}
        onCancel={() => setLearningPlanModalVisible(false)}
        onConfirm={(planData) => {
          // 生成学习计划记录
          const learningPlanRecord = {
            id: `learning_plan_${Date.now()}`,
            type: 'learning-plan',
            title: '智能学习计划',
            source: sourceInfo?.details || '基于当前数据源',
            time: new Date().toLocaleString('zh-CN'),
            content: `<div style="padding: 20px; text-align: center;">
              <h3>🎯 智能学习计划</h3>
              <p style="color: #666;">基于${sourceInfo?.total || 1}个数据源生成的个性化学习计划</p>
              <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
            </div>`,
            planData: {
              ...planData,
              startDate: new Date().toLocaleDateString('zh-CN'),
              endDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN') // 12周后
            }
          };

          // 使用通用函数添加记录
          addRecordWithGenerating('learning-plan', learningPlanRecord, {
            onComplete: () => {
              // 不自动打开右侧详细视图，保持在“智能工具/操作记录”
              message.success('学习计划生成成功！请点击操作记录查看详情');
            }
          });
          
          // 关闭弹窗
          setLearningPlanModalVisible(false);
        }}
      />

      <ReportSelectionModal
        visible={reportSelectionVisible}
        onCancel={() => setReportSelectionVisible(false)}
        materialCount={sourceInfo?.total || 0}
        onConfirm={(selectedType, selectedTypeConfig, selectedSuggestion) => {
          // 生成报告记录
          const reportType = selectedType || selectedSuggestion;
          const reportTitle = selectedTypeConfig?.title || selectedSuggestion || '智能报告';
          
          const reportRecord = {
            id: `report_${Date.now()}`,
            type: 'report',
            title: `${reportTitle} - ${new Date().toLocaleDateString()}`,
            source: sourceInfo?.details || '基于当前数据源',
            time: new Date().toLocaleString('zh-CN'),
            content: `<div style="padding: 20px; text-align: center;">
              <h3>📊 ${reportTitle}</h3>
              <p style="color: #666;">基于${sourceInfo?.total || 1}个数据源生成的报告</p>
              <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
            </div>`,
            reportConfig: {
              selectedType: selectedType,
              selectedSuggestion: selectedSuggestion,
              typeConfig: selectedTypeConfig
            }
          };

          // 使用通用函数添加记录
          addRecordWithGenerating('report', reportRecord, {
            onComplete: () => {
              // 生成完成后设置右侧面板显示 - 报告可以使用笔记编辑器查看
              setRightPanelEditingNote(reportRecord);
              setRightPanelNoteContent(reportRecord.content);
              setRightPanelView(RIGHT_PANEL_VIEWS.NOTE_EDITOR);
              message.success(`${reportTitle}生成成功！`);
            }
          });
          
          // 关闭弹窗
          setReportSelectionVisible(false);
        }}
      />

      <ThemeSelectModal
        open={showThemeSelectModal}
        onCancel={() => setShowThemeSelectModal(false)}
        record={currentRecord}
        actionType={currentActionType}
        onConfirm={handleThemeSelectConfirm}
      />

      {/* 取消居中模态，改用贴靠按钮的下拉菜单（已在按钮处实现） */}

      <ClassroomEvaluationModal
        inline
        visible={classroomEvaluationVisible}
        onCancel={() => setClassroomEvaluationVisible(false)}
        onConfirm={(evaluationConfig) => {
          // 生成课堂评价操作记录
          const evaluationRecord = {
            id: Date.now(),
            type: 'classroom-evaluation',
            title: '课堂评价',
            time: new Date().toLocaleString('zh-CN'),
            content: `<div style="padding: 20px; text-align: center;">
              <h3>📊 课堂评价报告</h3>
              <p style="color: #666;">基于评价量表生成的课堂表现评价</p>
              <p style="color: #999; font-size: 14px;">科目：${evaluationConfig.subject} • 年级：${evaluationConfig.grade} • ${new Date().toLocaleString('zh-CN')}</p>
            </div>`,
            evaluationConfig: evaluationConfig
          };

          // 使用通用函数添加记录
          addRecordWithGenerating('classroom-evaluation', evaluationRecord, {
            onComplete: () => {
              message.success('课堂评价记录生成成功！');
            }
          });
          
          // 关闭弹窗
          setClassroomEvaluationVisible(false);
        }}
      />
    </div>
  );
};

export default OperationPanel;
