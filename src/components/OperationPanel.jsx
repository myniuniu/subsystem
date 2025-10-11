import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  message,
  Card,
  Dropdown,
  Modal,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dayjs from 'dayjs';
import { 
  RIGHT_PANEL_VIEWS,
  MORE_MENU_ACTIONS,
  OPERATION_CARDS
} from '../constants/noteEditConstants';
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
import TrainingPlanViewer from './OperationPanel/TrainingPlanViewer';
import TrainingReportViewer from './OperationPanel/TrainingReportViewer';
import VideoPlayer from './VideoPlayer';
import TrainingDashboardViewer from './OperationPanel/TrainingDashboardViewer';
import ToolGrid from './OperationPanel/ToolGrid';

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
    rightPanelLearningPlanRecord,
    setRightPanelLearningPlanRecord,
    rightPanelLearningPlanContent,
    setRightPanelLearningPlanContent,
    rightPanelGradingRecord,
    setRightPanelGradingRecord,
    rightPanelGradingContent,
    setRightPanelGradingContent,
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
    setNoteEditorContent
  } = state;

  // 获取当前笔记的分类信息（优先使用选中的分类）
  const noteCategory = selectedCategory || note?.category || note?.courseType || null;
  console.log('=== OperationPanel noteCategory ===');
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

  // 新建笔记类型选择下拉菜单状态（靠近按钮显示）
  const [noteTypeDropdownVisible, setNoteTypeDropdownVisible] = useState(false);

  // 根据选择的类型创建笔记并进入编辑器
  const createNoteByType = (noteSubType) => {
    const isWhiteboard = noteSubType === 'whiteboard';
    const title = isWhiteboard ? '新建白板' : '新建文档';

    const newNote = {
      id: Date.now(),
      title,
      source: '手动创建',
      time: new Date().toLocaleString('zh-CN'),
      type: 'note',
      subType: noteSubType, // 记录笔记子类型：document 或 whiteboard
      content: isWhiteboard ? '' : ''
    };

    const newRecords = { ...operationRecords };
    if (!newRecords.note) {
      newRecords.note = [];
    }
    newRecords.note.unshift(newNote);
    setOperationRecords(newRecords);

    // 不打开右侧编辑器，仅生成记录
    setNoteTypeDropdownVisible(false);
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

  // 获取可用的AI工具列表
  const getAvailableAITools = () => {
    // 为了在 aiToolsVersion 变化时重新计算（不直接使用该值）
    void aiToolsVersion;
    // 安全解析 localStorage
    const safeParse = (key, fallback) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
      } catch (e) {
        console.warn(`[OperationPanel] 解析 ${key} 失败，使用回退`, e);
        return fallback;
      }
    };
    const aiToolsConfig = safeParse('ai-tools-config', {});
    const addedAITools = safeParse('added-ai-tools-to-panel', []);
    const aiToolsFromStorage = safeParse('ai_tools', []);

    // 将 ai_tools 结构映射为 OperationPanel 需要的结构
    // SmartNotes.initializeDefaultAITools 中的字段：id, name, description, icon, category, enabled
    // 未给出适用分类时，视为通用（所有 noteCategory 均可见）
    let aiTools = [
      ...(Array.isArray(aiToolsFromStorage) ? aiToolsFromStorage : []).map(t => ({
        id: t.id,
        name: t.name,
        description: t.description || '',
        icon: t.icon || '🧠',
        applicableNoteCategories: Array.isArray(t.applicableNoteCategories)
          ? t.applicableNoteCategories
          : undefined,
        menuConfig: {
          key: t.id,
          title: t.name,
          icon: t.icon || '🧠',
          gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
          color: '#2f54eb'
        }
      }))
    ];
    // 硬编码工具回退清单（当 localStorage 不完整时使用）
    const hardcodedAITools = [
      {
        id: 'topic-paper-guidance',
        name: '课题论文指导',
        description: '论文选题、结构、方法与写作建议',
        icon: '文',
        color: '#1677ff',
        applicableNoteCategories: ['educational_topics'],
        menuConfig: {
          key: 'topic-paper-guidance',
          title: '课题论文指导',
          icon: '文',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1677ff'
        }
      },
      {
        id: 'teaching-achievement-application',
        name: '教学成果申报书',
        description: '教学成果奖申报书模板与智能生成',
        icon: '申',
        color: '#f5222d',
        applicableNoteCategories: ['educational_topics'],
        menuConfig: {
          key: 'teaching-achievement-application',
          title: '教学成果申报书',
          icon: '申',
          gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
          color: '#f5222d'
        }
      },
      {
        id: 'teaching-achievement-report',
        name: '教学成果报告',
        description: '生成教学成果总结与展示报告',
        icon: '报',
        color: '#2f54eb',
        applicableNoteCategories: ['educational_topics'],
        menuConfig: {
          key: 'teaching-achievement-report',
          title: '教学成果报告',
          icon: '报',
          gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
          color: '#2f54eb'
        }
      },
      {
        id: 'teaching-achievement-materials',
        name: '教学成果支撑材料',
        description: '梳理并生成教学成果支撑材料清单与内容',
        icon: '材',
        color: '#389e0d',
        applicableNoteCategories: ['educational_topics'],
        menuConfig: {
          key: 'teaching-achievement-materials',
          title: '教学成果支撑材料',
          icon: '材',
          gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          color: '#389e0d'
        }
      },
      // 教学设计分类适用工具
      {
        id: 'teaching-assistant',
        name: '教学智能助手',
        description: '支持课程设计、题目生成、学情分析的教学助手',
        icon: '🎓',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'teaching-assistant',
          title: '教学助手',
          icon: '🎓',
          gradient: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'large-unit-design',
        name: '大单元设计',
        description: '支持基于核心素养的大单元教学设计与目标任务分解',
        icon: '单',
        color: '#0958d9',
        applicableNoteCategories: ['teaching_research_office', 'teaching_design'],
        menuConfig: {
          key: 'large-unit-design',
          title: '大单元设计',
          icon: '单',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#0958d9'
        }
      },
      {
        id: 'interdisciplinary-design',
        name: '跨学科设计',
        description: '围绕真实情境与综合任务进行跨学科项目化学习设计',
        icon: '跨',
        color: '#13c2c2',
        applicableNoteCategories: ['teaching_research_office', 'teaching_design'],
        menuConfig: {
          key: 'interdisciplinary-design',
          title: '跨学科设计',
          icon: '跨',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'unit-assignment-design',
        name: '单元作业设计',
        description: '依据学习目标与内容设计分层作业与任务单',
        icon: '作',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_research_office', 'homework_system', 'teaching_design'],
        menuConfig: {
          key: 'unit-assignment-design',
          title: '单元作业设计',
          icon: '作',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'large-unit-academic-case',
        name: '大单元学历案',
        description: '生成结构化的学历案，包括环节目标、活动任务与评价要点',
        icon: '案',
        color: '#722ed1',
        applicableNoteCategories: ['teaching_research_office'],
        menuConfig: {
          key: 'large-unit-academic-case',
          title: '大单元学历案',
          icon: '案',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'teacher-research-project',
        name: '教师课题研究',
        description: '提供课题选题、研究设计、数据分析与报告撰写辅助',
        icon: '研',
        color: '#f5222d',
        applicableNoteCategories: ['teaching_research_office'],
        menuConfig: {
          key: 'teacher-research-project',
          title: '教师课题研究',
          icon: '研',
          gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
          color: '#f5222d'
        }
      },
      // 教学设计分类新增（如图）
      {
        id: 'open-class-design',
        name: '公开课设计',
        description: '生成公开课流程、教案与课件要点，支持评课要素',
        icon: '公',
        color: '#1890ff',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'open-class-design',
          title: '公开课设计',
          icon: '公',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      {
        id: 'guided-learning-plan',
        name: '导学案',
        description: '按照学习目标与任务链生成导学案，支持分层与自评',
        icon: '导',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'guided-learning-plan',
          title: '导学案',
          icon: '导',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'lesson-presentation',
        name: '说课稿',
        description: '生成说课稿结构与关键阐述，支持教学目标与方法说明',
        icon: '说',
        color: '#13c2c2',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'lesson-presentation',
          title: '说课稿',
          icon: '说',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'evaluation-rubric',
        name: '评价量规',
        description: '根据目标维度生成可量化评价量规，支持等级描述与示例',
        icon: '评',
        color: '#531dab',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'evaluation-rubric',
          title: '评价量规',
          icon: '评',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#531dab'
        }
      },
      {
        id: 'unit-academic-case',
        name: '单元学历案',
        description: '面向单元的学历案结构生成，包含环节目标与任务设计',
        icon: '单',
        color: '#0958d9',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'unit-academic-case',
          title: '单元学历案',
          icon: '单',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#0958d9'
        }
      },
      {
        id: 'ai-picture-book',
        name: 'AI绘本',
        description: '基于文本与图片提示生成教学绘本，支持分镜与旁白',
        icon: '📖',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'ai-picture-book',
          title: 'AI绘本',
          icon: '📖',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'cloud-word-cards',
        name: '云朵字卡',
        description: '快速生成云朵风格字卡，支持词语例句与练习任务',
        icon: '☁️',
        color: '#40a9ff',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'cloud-word-cards',
          title: '云朵字卡',
          icon: '☁️',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
          color: '#40a9ff'
        }
      },
      {
        id: 'sticker-materials',
        name: '贴纸素材',
        description: '生成课堂贴纸与图标素材，用于教具或白板',
        icon: '🎯',
        color: '#722ed1',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'sticker-materials',
          title: '贴纸素材',
          icon: '🎯',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'digital-human-speech',
        name: '数字人说话',
        description: '将文本转为数字人朗读视频，支持角色与语速选择',
        icon: '🧑‍🎤',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'digital-human-speech',
          title: '数字人说话',
          icon: '🧑‍🎤',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'comic-strip',
        name: '连环画',
        description: '生成教学连环画分镜与画面，支持台词与镜头',
        icon: '🎞️',
        color: '#13c2c2',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'comic-strip',
          title: '连环画',
          icon: '🎞️',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'quick-designer',
        name: '快速设计师',
        description: '快速生成教学活动与素材方案，适合备课速成',
        icon: '速',
        color: '#1890ff',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'quick-designer',
          title: '快速设计师',
          icon: '速',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      {
        id: 'children-simple-drawings',
        name: '儿童简笔画',
        description: '生成儿童风格简笔画教程图片与步骤说明',
        icon: '🖍️',
        color: '#40a9ff',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'children-simple-drawings',
          title: '儿童简笔画',
          icon: '🖍️',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
          color: '#40a9ff'
        }
      },
      {
        id: 'ai-video',
        name: 'AI视频',
        description: '根据脚本与素材生成课堂视频，支持字幕与配音',
        icon: '🎬',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'ai-video',
          title: 'AI视频',
          icon: '🎬',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'ppt-courseware',
        name: 'PPT课件',
        description: '根据课程结构自动生成PPT课件大纲与页面',
        icon: '📊',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'ppt-courseware',
          title: 'PPT课件',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'audio-video-text-converter',
        name: '音视频文本互转',
        description: '支持音视频转文本与文本生成语音，适配课堂素材',
        icon: '🔄',
        color: '#13c2c2',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'audio-video-text-converter',
          title: '音视频文本互转',
          icon: '🔄',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'training-report',
        name: '培训报告',
        description: '生成培训效果评估报告，包含数据分析和改进建议',
        icon: '报',
        color: '#722ed1',
        applicableNoteCategories: ['training_needs_management'],
        menuConfig: {
          key: 'training-report',
          title: '培训报告',
          icon: '报',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'training-dashboard',
        name: '培训报表',
        description: '多维度培训数据可视化分析，提供全面的培训管理报表',
        icon: '报',
        color: '#0369a1',
        applicableNoteCategories: ['training_needs_management'],
        menuConfig: {
          key: 'training-dashboard',
          title: '培训报表',
          icon: '报',
          gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          color: '#0369a1'
        }
      },
      // 通用AI工具
      {
        id: 'homework-center',
        name: '作业中心',
        description: '统一管理作业设计、布置、批改与分析的中心工具',
        icon: '📘',
        color: '#1890ff',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'homework-center',
          title: '作业中心',
          icon: '📘',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      // 学情分析 · 班主任
      {
        id: 'classmaster-performance-dashboard',
        name: '成绩数据看板',
        description: '接入成绩数据，大屏看板，聚焦班级成绩概览与趋势',
        icon: '📈',
        color: '#52c41a',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'classmaster-performance-dashboard',
          title: '成绩数据看板',
          icon: '📈',
          gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          color: '#52c41a'
        }
      },
      {
        id: 'classmaster-passline-analysis',
        name: '高中新上线分析',
        description: '分析高一至高三上线情况，输出分层比例与提升建议',
        icon: '🎯',
        color: '#13c2c2',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'classmaster-passline-analysis',
          title: '高中新上线分析',
          icon: '🎯',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'classmaster-student-honesty-analysis',
        name: '学生诚卷分析',
        description: '针对学生作弊风险与诚卷情况进行综合分析与识别',
        icon: '🧭',
        color: '#9254de',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'classmaster-student-honesty-analysis',
          title: '学生诚卷分析',
          icon: '🧭',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#9254de'
        }
      },
      {
        id: 'classmaster-class-exam-analysis',
        name: '班级考试分析',
        description: '分析单次或一段时期内班级考试的成绩结构与波动',
        icon: '📊',
        color: '#1890ff',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'classmaster-class-exam-analysis',
          title: '班级考试分析',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      // 学情分析 · 学科老师
      {
        id: 'subject-unit-small-tests',
        name: '单元小测分析',
        description: '基于小测数据分析掌握度、失分点与教学改进建议',
        icon: '🧪',
        color: '#fa8c16',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'subject-unit-small-tests',
          title: '单元小测分析',
          icon: '🧪',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'subject-exam-paper-analysis',
        name: '试卷学科分析',
        description: '对试卷进行学科维度拆解，输出题型、知识点与难度分布',
        icon: '📄',
        color: '#722ed1',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'subject-exam-paper-analysis',
          title: '试卷学科分析',
          icon: '📄',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'subject-student-performance-analysis',
        name: '学科薄弱生分析',
        description: '识别学科薄弱学生，定位薄弱点并生成个性化提升建议',
        icon: '📉',
        color: '#f5222d',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'subject-student-performance-analysis',
          title: '学科薄弱生分析',
          icon: '📉',
          gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
          color: '#f5222d'
        }
      },
      {
        id: 'subject-historical-exam-analysis',
        name: '学科历次考试分析',
        description: '分析同一学科历次考试的成绩变化与影响因素',
        icon: '📊',
        color: '#1890ff',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'subject-historical-exam-analysis',
          title: '学科历次考试分析',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      // 学情分析 · 年级组
      {
        id: 'grade-multi-class-exam-analysis',
        name: '年级多班考试分析',
        description: '对多个班级进行成绩对比，识别教学差异与改进方向',
        icon: '🏫',
        color: '#2f54eb',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'grade-multi-class-exam-analysis',
          title: '年级多班考试分析',
          icon: '🏫',
          gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
          color: '#2f54eb'
        }
      },
      {
        id: 'grade-passline-analysis',
        name: '年级及科目过线分析',
        description: '统计年级整体及各学科过线率，定位提升空间',
        icon: '📈',
        color: '#52c41a',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'grade-passline-analysis',
          title: '年级及科目过线分析',
          icon: '📈',
          gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          color: '#52c41a'
        }
      },
      {
        id: 'grade-historical-exam-analysis',
        name: '年级历次考试分析',
        description: '面向年级维度分析历次考试的综合表现与变化',
        icon: '📊',
        color: '#1890ff',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'grade-historical-exam-analysis',
          title: '年级历次考试分析',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      // 学情分析 · 联考分析（不同版本）
      {
        id: 'league-exam-performance-analysis',
        name: '联考成绩分析',
        description: '支持多校联考数据分析，生成关键指标与对比洞察',
        icon: '🏆',
        color: '#1890ff',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'league-exam-performance-analysis',
          title: '联考成绩分析',
          icon: '🏆',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      {
        id: 'league-exam-performance-plus',
        name: '联考成绩分析Plus',
        description: '支持样本数≥万人级别的深度联考分析版本',
        icon: '🏆',
        color: '#13c2c2',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'league-exam-performance-plus',
          title: '联考成绩分析Plus',
          icon: '🏆',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'league-exam-performance-pro',
        name: '联考成绩分析Pro',
        description: '针对样本数≥五万人的大型联考数据的专业版',
        icon: '🏆',
        color: '#722ed1',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'league-exam-performance-pro',
          title: '联考成绩分析Pro',
          icon: '🏆',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'league-exam-performance-ultra',
        name: '联考成绩分析Ultra',
        description: '面向样本数≥十万人级别联考数据的旗舰版',
        icon: '🏆',
        color: '#fa8c16',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'league-exam-performance-ultra',
          title: '联考成绩分析Ultra',
          icon: '🏆',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'grading-assistant',
        name: '智能阅卷助手',
        description: '专业的智能阅卷工具，支持试卷自动评阅、成绩分析、评语生成等功能',
        icon: '阅',
        color: '#c41d7f',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'grading-assistant',
          title: '阅卷助手',
          icon: '阅',
          gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
          color: '#c41d7f'
        }
      },
      // 作业系统 · 出题与批改扩展
      {
        id: 'knowledge-point-question-generator',
        name: '知识点出题',
        description: '基于指定知识点自动生成题目并按难度分层',
        icon: '知',
        color: '#722ed1',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'knowledge-point-question-generator',
          title: '知识点出题',
          icon: '知',
          gradient: 'linear-gradient(135deg, #f0e6ff 0%, #e6d7ff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'chapter-question-generator',
        name: '章节出题',
        description: '围绕指定章节内容生成配套练习与测评题',
        icon: '章',
        color: '#1890ff',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'chapter-question-generator',
          title: '章节出题',
          icon: '章',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      {
        id: 'unit-question-generator',
        name: '单元出题',
        description: '依据单元目标生成覆盖全面的练习题与试卷',
        icon: '单',
        color: '#fa8c16',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'unit-question-generator',
          title: '单元出题',
          icon: '单',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'question-set-generator',
        name: '题组出题',
        description: '按题组结构与能力层次生成梯度训练题',
        icon: '组',
        color: '#eb2f96',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'question-set-generator',
          title: '题组出题',
          icon: '组',
          gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
          color: '#eb2f96'
        }
      },
      {
        id: 'logic-question-generator',
        name: '逻辑出题',
        description: '生成强调推理与逻辑思维的题目集合',
        icon: '逻',
        color: '#52c41a',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'logic-question-generator',
          title: '逻辑出题',
          icon: '逻',
          gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
          color: '#52c41a'
        }
      },
      {
        id: 'multiple-choice-generator',
        name: '选择题出题',
        description: '批量生成高质量选择题并附解析',
        icon: '选',
        color: '#13c2c2',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'multiple-choice-generator',
          title: '选择题出题',
          icon: '选',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'image-question-generator',
        name: '图像题出题',
        description: '基于图片与图形信息自动生成题目',
        icon: '图',
        color: '#531dab',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'image-question-generator',
          title: '图像题出题',
          icon: '图',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#531dab'
        }
      },
      {
        id: 'smart-question-bank-manager',
        name: '智能题库管理',
        description: '管理与检索题库，支持难度评估与标签',
        icon: '库',
        color: '#0958d9',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'smart-question-bank-manager',
          title: '智能题库管理',
          icon: '库',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#0958d9'
        }
      },
      // 作文批改与默写改错
      {
        id: 'primary-chinese-essay-grader',
        name: '小学语文作文批改',
        description: '针对小学语文作文的智能批改与评语生成',
        icon: '语',
        color: '#fa541c',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'primary-chinese-essay-grader',
          title: '小学语文作文批改',
          icon: '语',
          gradient: 'linear-gradient(135deg, #fff2e8 0%, #ffd8bf 100%)',
          color: '#fa541c'
        }
      },
      {
        id: 'primary-english-essay-grader',
        name: '小学英文作文批改',
        description: '针对小学英文作文的智能批改与评语生成',
        icon: '英',
        color: '#13c2c2',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'primary-english-essay-grader',
          title: '小学英文作文批改',
          icon: '英',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'junior-chinese-essay-grader',
        name: '初中语文作文批改',
        description: '针对初中语文作文的智能批改与评语生成',
        icon: '语',
        color: '#faad14',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'junior-chinese-essay-grader',
          title: '初中语文作文批改',
          icon: '语',
          gradient: 'linear-gradient(135deg, #fffbe6 0%, #ffe58f 100%)',
          color: '#faad14'
        }
      },
      {
        id: 'junior-english-essay-grader',
        name: '初中英文作文批改',
        description: '针对初中英文作文的智能批改与评语生成',
        icon: '英',
        color: '#1890ff',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'junior-english-essay-grader',
          title: '初中英文作文批改',
          icon: '英',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      {
        id: 'senior-chinese-essay-grader',
        name: '高中语文作文批改',
        description: '针对高中语文作文的智能批改与评语生成',
        icon: '语',
        color: '#722ed1',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'senior-chinese-essay-grader',
          title: '高中语文作文批改',
          icon: '语',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'senior-english-essay-grader',
        name: '高中英文作文批改',
        description: '针对高中英文作文的智能批改与评语生成',
        icon: '英',
        color: '#52c41a',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'senior-english-essay-grader',
          title: '高中英文作文批改',
          icon: '英',
          gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
          color: '#52c41a'
        }
      },
      {
        id: 'chinese-dictation-correction',
        name: '语文默写改错',
        description: '识别默写错误并给出针对性纠错与巩固练习',
        icon: '默',
        color: '#fa541c',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'chinese-dictation-correction',
          title: '语文默写改错',
          icon: '默',
          gradient: 'linear-gradient(135deg, #fff2e8 0%, #ffd8bf 100%)',
          color: '#fa541c'
        }
      },
      {
        id: 'english-dictation-correction',
        name: '英语默写改错',
        description: '识别英文拼写与语法错误并生成纠错练习',
        icon: '默',
        color: '#13c2c2',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'english-dictation-correction',
          title: '英语默写改错',
          icon: '默',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      // 作业设计扩展
      {
        id: 'custom-unit-homework-design',
        name: '自定义单元作业',
        description: '按教学目标自由组合生成个性化单元作业包',
        icon: '自',
        color: '#1d4ed8',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'custom-unit-homework-design',
          title: '自定义单元作业',
          icon: '自',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #d6e4ff 100%)',
          color: '#1d4ed8'
        }
      },
      {
        id: 'recompose-unit-assignment-design',
        name: '重组单元作业设计',
        description: '基于既有作业与题库快速重组形成新作业包',
        icon: '重',
        color: '#fa8c16',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'recompose-unit-assignment-design',
          title: '重组单元作业设计',
          icon: '重',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'graphic-homework-design',
        name: '图形设计',
        description: '用于作业版式与图形元素的设计与生成',
        icon: '图',
        color: '#531dab',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'graphic-homework-design',
          title: '图形设计',
          icon: '图',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#531dab'
        }
      },
      {
        id: 'data-analyst',
        name: '数据分析大师',
        description: '强大的数据分析和可视化工具，支持多种图表生成和统计分析',
        icon: '📊',
        color: '#722ed1',
        menuConfig: {
          key: 'data-analyst',
          title: '数据分析',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #f0e6ff 0%, #e6d7ff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'efficiency-master',
        name: '效率提升大师',
        description: '全能的效率工具集，包含时间管理、任务规划、自动化处理等功能',
        icon: '⚡',
        color: '#13c2c2',
        menuConfig: {
          key: 'efficiency-master',
          title: '效率大师',
          icon: '⚡',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'classroom-evaluation',
        name: '课堂评价',
        description: '基于用户提交的评价要求，生成评价量表，基于该量表以评价老师在课堂上的表现',
        icon: '📊',
        color: '#1890ff',
        menuConfig: {
          key: 'classroom-evaluation',
          title: '课堂评价',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      {
        id: 'research-helper',
        name: '学术研究助手',
        description: '专业的学术研究工具，支持文献检索、论文分析、引用管理',
        icon: '🔬',
        color: '#f5222d',
        menuConfig: {
          key: 'research-helper',
          title: '研究助手',
          icon: '🔬',
          gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
          color: '#f5222d'
        }
      },
      {
        id: 'video-slice',
        name: '视频切片',
        description: '智能视频切片工具，支持视频片段提取、剪辑、标注等功能',
        icon: '切',
        color: '#fa8c16',
        menuConfig: {
          key: 'video-slice',
          title: '视频切片',
          icon: '切',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      }
    ];

    // 合并回退清单（localStorage 工具不足时）
    if (!Array.isArray(aiToolsFromStorage) || aiToolsFromStorage.length < 10) {
      aiTools = [...aiTools, ...hardcodedAITools];
    }
    // 去重
    const seenIds = new Set();
    aiTools = aiTools.filter(t => {
      if (!t || !t.id) return false;
      if (seenIds.has(t.id)) return false;
      seenIds.add(t.id);
      return true;
    });

    // 应用 AI工具屋 的配置覆盖（如有）
    const configuredTools = aiTools.map(tool => {
      const cfg = aiToolsConfig?.[tool.id];
      if (cfg && typeof cfg === 'object') {
        return {
          ...tool,
          menuConfig: {
            ...tool.menuConfig,
            ...cfg
          }
        };
      }
      return tool;
    });

    // 过滤：已添加去重 + 分类过滤（未声明适用分类视为通用）
    let availableTools = configuredTools.filter(tool => !addedAITools.includes(tool.id));

    const knownCategories = new Set([
      'training_needs_management',
      'training_product_research',
      'teaching_research_office',
      'teaching_design',
      'classroom_integration',
      'homework_system',
      'learning_analytics',
      'educational_topics'
    ]);
    if (noteCategory && knownCategories.has(noteCategory)) {
      availableTools = availableTools.filter(tool => {
        // 未声明适用分类的工具保留
        if (!tool.applicableNoteCategories || tool.applicableNoteCategories.length === 0) return true;
        return tool.applicableNoteCategories.includes(noteCategory);
      });
    }

    // 过滤掉已在面板可见的工具，避免重复添加
    availableTools = availableTools.filter(tool => {
      const key = tool.menuConfig?.key;
      return key ? !visibleCards.some(card => card.key === key) : true;
    });
    
    console.log('=== getAvailableAITools 调试信息 ===');
    console.log('当前 noteCategory:', noteCategory);
    console.log('所有 AI 工具数量:', aiTools.length);
    console.log('过滤后可用工具数量:', availableTools.length);
    console.log('可用工具列表:', availableTools.map(t => ({ id: t.id, name: t.name, categories: t.applicableNoteCategories })));
    console.log('================================');

    // 无可用工具时的兜底项
    if (availableTools.length === 0) {
      return [
        {
          key: 'no-ai-tools',
          disabled: true,
          label: (
            <div style={{ padding: '6px 8px', color: '#999' }}>
              暂无可用AI工具（请到AI工具屋添加或切换分类）
            </div>
          )
        },
        {
          key: 'refresh-ai-tools',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: 14 }}>🔄</span>
              <span>刷新</span>
            </div>
          ),
          onClick: () => setAiToolsVersion(v => v + 1)
        }
      ];
    }
    
    return availableTools.map(tool => ({
      key: tool.menuConfig.key,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            background: tool.menuConfig.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: tool.menuConfig.color
          }}>
            {tool.menuConfig.icon}
          </div>
          <div>
            <span style={{ fontWeight: 500 }}>{tool.menuConfig.title}</span>
            <div style={{ fontSize: '11px', color: '#999', lineHeight: '1.2' }}>
              {tool.description.substring(0, 20)}...
            </div>
          </div>
        </div>
      ),
      onClick: () => handleAddAITool(tool)
    }));
  };

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
        key: 'copyTo',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📋</span>
            <span>复制到</span>
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
            <span>移动到</span>
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
    if (record.type === 'note') {
      const isMarkedAsStudyResult = record.tags && record.tags.includes('研修成果');
      
      return [
        {
          key: isMarkedAsStudyResult ? 'unmarkStudyResult' : 'markStudyResult',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>{isMarkedAsStudyResult ? '📝' : '⭐'}</span>
              <span>{isMarkedAsStudyResult ? '取消标记研修成果' : '标记为研修成果'}</span>
            </div>
          ),
          onClick: (e) => {
            e?.stopPropagation?.();
            console.log('Mark/Unmark study result clicked:', record, isMarkedAsStudyResult);
            
            // 直接在这里处理标记逻辑
            const updatedRecord = { ...record };
            if (isMarkedAsStudyResult) {
              // 取消标记：移除"研修成果"标签
              updatedRecord.tags = (record.tags || []).filter(tag => tag !== '研修成果');
              message.success('已取消标记为研修成果');
            } else {
              // 添加标记：添加"研修成果"标签
              updatedRecord.tags = [...(record.tags || []), '研修成果'];
              message.success('已标记为研修成果');
            }
            
            // 更新操作记录
            setOperationRecords(prev => {
              const newRecords = { ...prev };
              Object.keys(newRecords).forEach(type => {
                if (Array.isArray(newRecords[type])) {
                  newRecords[type] = newRecords[type].map(r => 
                    r.id === record.id ? updatedRecord : r
                  );
                }
              });
              return newRecords;
            });
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
        // 文档型笔记支持转换为来源
        ...(record?.subType === 'document' ? [
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

    // 培训方案类型添加提交按钮
    if (record.type === 'training-plan') {
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
        ...commonItems
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
                const updatedCategories = existingCategories.filter(cat => 
                  cat.key !== `learning-plan-${record.id}`
                );
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
              const categoryExists = existingCategories.some(cat => cat.key === newCategory.key);
              
              if (!categoryExists) {
                // 添加新分类到现有分类中
                const updatedCategories = [...existingCategories, newCategory];
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

  if (rightPanelView === RIGHT_PANEL_VIEWS.TRAINING_PLAN_VIEWER) {
    return (
      <TrainingPlanViewer 
        rightPanelTrainingPlanRecord={rightPanelTrainingPlanRecord}
        rightPanelTrainingPlanContent={rightPanelTrainingPlanContent}
        setRightPanelView={setRightPanelView}
        setRightPanelTrainingPlanRecord={setRightPanelTrainingPlanRecord}
        setRightPanelTrainingPlanContent={setRightPanelTrainingPlanContent}
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

  // 视频播放器视图（嵌入式）
  if (rightPanelView === RIGHT_PANEL_VIEWS.VIDEO_PLAYER) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS)}>
            返回
          </Button>
          <Typography.Text style={{ fontWeight: 600 }}>
            {selectedMaterial?.title || '视频播放器'}
          </Typography.Text>
        </div>
        <div style={{ flex: 1, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
          <VideoPlayer
            embedded
            style={{ height: '100%' }}
            videoData={selectedMaterial}
            isWidescreenMode={isWidescreenMode}
            onToggleWidescreen={() => setIsWidescreenMode && setIsWidescreenMode(!isWidescreenMode)}
            onTimeUpdate={handlers?.onVideoTimeUpdate}
            currentEditorState={{
              isEditing: rightPanelView === RIGHT_PANEL_VIEWS.NOTE_EDITOR || (showNoteEditor && editingNote),
              noteTitle: rightPanelView === RIGHT_PANEL_VIEWS.NOTE_EDITOR
                ? rightPanelEditingNote?.title || '当前笔记'
                : editingNote?.title || '当前笔记',
              onContentUpdate: (content) => {
                if (rightPanelView === RIGHT_PANEL_VIEWS.NOTE_EDITOR && rightPanelEditingNote) {
                  setRightPanelNoteContent(prev => (prev || '') + content);
                } else if (showNoteEditor && editingNote) {
                  setNoteEditorContent(prev => (prev || '') + content);
                }
              }
            }}
            onNoteCreated={(operationRecord) => {
              setOperationRecords(prev => ({
                ...prev,
                note: [operationRecord, ...(prev.note || [])]
              }));
            }}
          />
        </div>
      </div>
    );
  }

  // 主要内容区域 - 使用工具网格组件
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DndProvider backend={HTML5Backend}>
        <div style={{ 
          padding: '16px', 
          paddingBottom: '12px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* 操作面板标题和编辑按钮 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              🔧 智能工具
            </Title>
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
          </div>

          {/* 工具网格 */}
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
          />
        </div>
      </DndProvider>
      
      {/* 操作记录区域 */}
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
                  onClick: () => createNoteByType('document')
                },
                {
                  key: 'whiteboard',
                  label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>🧭</span>
                      <span>白板</span>
                    </div>
                  ),
                  onClick: () => createNoteByType('whiteboard')
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
          {Object.values(operationRecords).flat().map(record => {
            const getIcon = (type) => {
              switch(type) {
                case 'audio': return '音';
                case 'video': return '视';
                case 'mindmap': return '思';
                case 'report': return '报';
                case 'ppt': return 'PPT';
                case 'webcode': return '💻';
                case 'scenario': return '场';
                case 'note': return '笔';
                case 'question': return '题';
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
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                styles={{ body: { padding: '8px 12px' } }}
                onClick={(e) => {
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      marginRight: '8px',
                      flexShrink: 0
                    }}>
                      {getIcon(record.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <Text ellipsis style={{ fontSize: '12px', fontWeight: 500, flex: 1 }}>
                          {record.title}
                        </Text>
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
                        {/* 显示培训方案提交状态 */}
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
                      <Text style={{ fontSize: '10px', color: '#999', display: 'block' }}>
                        {record.source}
                      </Text>
                      <Text style={{ fontSize: '10px', color: '#999' }}>
                        {record.time}
                      </Text>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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

      {/* 模态框组件 */}
      <QuestionConfigModal
        visible={questionConfigVisible}
        onClose={() => setQuestionConfigVisible(false)}
        materialCount={sourceInfo?.total || 0}
        onConfirm={(operationRecord) => {
          // 添加到操作记录中
          const newRecords = { ...operationRecords };
          if (!newRecords.question) {
            newRecords.question = [];
          }
          newRecords.question.unshift(operationRecord);
          setOperationRecords(newRecords);
          
          // 设置右侧面板显示
          setRightPanelQuestionRecord(operationRecord);
          setRightPanelQuestionContent(operationRecord.content);
          setRightPanelView('QUESTION_VIEWER');
          
          // 关闭弹窗
          setQuestionConfigVisible(false);
          
          message.success('试题生成成功！');
        }}
      />

      <LearningPlanModal
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

          // 添加到记录中
          const newRecords = { ...operationRecords };
          if (!newRecords['learning-plan']) {
            newRecords['learning-plan'] = [];
          }
          newRecords['learning-plan'].unshift(learningPlanRecord);
          setOperationRecords(newRecords);
          
          // 设置右侧面板显示
          setRightPanelLearningPlanRecord(learningPlanRecord);
          setRightPanelLearningPlanContent(learningPlanRecord.content);
          setRightPanelView('LEARNING_PLAN_VIEWER');
          
          // 关闭弹窗
          setLearningPlanModalVisible(false);
          
          message.success('学习计划生成成功！');
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

          // 添加到记录中
          const newRecords = { ...operationRecords };
          if (!newRecords.report) {
            newRecords.report = [];
          }
          newRecords.report.unshift(reportRecord);
          setOperationRecords(newRecords);
          
          // 设置右侧面板显示 - 报告可以使用笔记编辑器查看
          setRightPanelEditingNote(reportRecord);
          setRightPanelNoteContent(reportRecord.content);
          setRightPanelView(RIGHT_PANEL_VIEWS.NOTE_EDITOR);
          
          // 关闭弹窗
          setReportSelectionVisible(false);
          
          message.success(`${reportTitle}生成成功！`);
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

          // 添加到记录中
          const newRecords = { ...operationRecords };
          if (!newRecords['classroom-evaluation']) {
            newRecords['classroom-evaluation'] = [];
          }
          newRecords['classroom-evaluation'].unshift(evaluationRecord);
          setOperationRecords(newRecords);
          
          // 关闭弹窗
          setClassroomEvaluationVisible(false);
          
          message.success('课堂评价记录生成成功！');
        }}
      />
    </div>
  );
};

export default OperationPanel;