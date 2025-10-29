import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  message,
  Card,
  Dropdown,
  Modal,
  Tooltip,
  Space
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
  MenuUnfoldOutlined
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
import ClassroomBehaviorAnalysisViewer from './OperationPanel/ClassroomBehaviorAnalysisViewer';
import TrainingPlanViewer from './OperationPanel/TrainingPlanViewer';
import TrainingReportViewer from './OperationPanel/TrainingReportViewer';
import VideoPlayer from './VideoPlayer';
import TrainingDashboardViewer from './OperationPanel/TrainingDashboardViewer';
import ToolGrid from './OperationPanel/ToolGrid';
import { createGetAvailableAITools } from './OperationPanel/getAvailableAITools.jsx';
import TrainingTypeSettingsViewer from './OperationPanel/TrainingTypeSettingsViewer';

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
    setNoteEditorContent,
    // 研修成果关联信息（用于在卡片展示“被谁关联”）
    achievementAssociations,
    // 资料勾选（用于来源快照）
    selectedMaterials
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
  
  // 收起/展开状态
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // 通知父组件收起状态变化
  useEffect(() => {
    if (state.setOperationPanelCollapsed) {
      state.setOperationPanelCollapsed(isCollapsed);
    }
  }, [isCollapsed, state]);
  
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
      ...(record.type === 'note' && record.subType === 'document' ? [{
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
    if (record.type === 'note') {
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
      const commonWithSettings = (() => {
        const idx = commonItems.findIndex(i => i.key === 'markAgentCorpus');
        const settingsItem = {
          key: MORE_MENU_ACTIONS.OPEN_TRAINING_SETTINGS,
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>⚙️</span>
              <span>方案配置</span>
            </div>
          ),
          onClick: (e) => {
            e?.stopPropagation?.();
            onMoreAction && onMoreAction(MORE_MENU_ACTIONS.OPEN_TRAINING_SETTINGS, record);
          }
        };
        if (idx !== -1) {
          const arr = [...commonItems];
          arr.splice(idx + 1, 0, settingsItem);
          return arr;
        }
        return [settingsItem, ...commonItems];
      })();

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: isCollapsed ? '52px' : 'auto', transition: 'width 0.3s ease' }}>
      <DndProvider backend={HTML5Backend}>
        <div style={{ 
          padding: isCollapsed ? '2px 0' : '16px', 
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
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                🔧 智能工具
              </Title>
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
                  🔧
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
              {operationRecords && Object.values(operationRecords).flat().slice(0, 8).map(record => {                
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
                    'question': '❓',
                    'learning-plan': '📅',
                    'grading': '✅',
                    'knowledge-graph': '🕸️',
                    'training-plan': '🎯',
                    'classroom-evaluation': '📊'
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
                        opacity: record.isGenerating ? 0.7 : 1
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
                      {getIcon(record.type, record.isGenerating)}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          )}
        </div>
      </DndProvider>
      
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
                  cursor: record.isGenerating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: record.isGenerating ? 0.7 : 1,
                  background: record.isGenerating ? '#e6f7ff' : '#fff'
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
                        <Text ellipsis style={{ fontSize: '12px', fontWeight: 500, flex: 1, color: record.isGenerating ? '#1890ff' : 'inherit' }}>
                          {record.isGenerating ? '正在生成...' : record.title}
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
                      {Array.isArray(record.sourceRefs) && record.sourceRefs.length > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <Text type="secondary" style={{ fontSize: '11px' }}>来源：</Text>
                          {record.sourceRefs.slice(0, 3).map((ref, idx) => (
                            <span key={`${record.id}-src-${idx}`} style={{
                              fontSize: '10px',
                              color: '#555',
                              padding: '2px 6px',
                              border: '1px solid #eee',
                              borderRadius: '8px',
                              background: '#fafafa'
                            }}>
                              {ref.type === 'text' ? '📝 文本' : ref.type === 'file' ? '📄 文件' : ref.type === 'video' ? '🎥 视频' : ref.type === 'link' ? '🔗 链接' : '📁 来源'}｜{ref.title}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <Text style={{ fontSize: '10px', color: '#999', display: 'block' }}>
                          {record.source}
                        </Text>
                      )}
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