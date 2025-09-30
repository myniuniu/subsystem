import React, { useEffect } from 'react';
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

const OperationPanel = ({ state, handlers }) => {
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
    uploadedFiles,
    addedTexts,
    courseVideos,
    links,
    note
  } = state;

  // 获取当前笔记的分类信息
  const noteCategory = note?.category || note?.courseType || null;
  console.log('=== OperationPanel noteCategory ===');
  console.log('传入的 state:', state);
  console.log('传入的 note:', note);
  console.log('noteCategory:', noteCategory);
  console.log('note?.category:', note?.category);
  console.log('note?.courseType:', note?.courseType);
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
  
  // 监听AI工具变化事件
  useEffect(() => {
    const handleAIToolsChanged = () => {
      // 刷新列表以更新AI工具状态
      // 这里可以触发重新渲染或更新相关状态
      console.log('检测到AI工具变化，重新加载工具列表');
    };
    
    window.addEventListener('aiToolsChanged', handleAIToolsChanged);
    
    return () => {
      window.removeEventListener('aiToolsChanged', handleAIToolsChanged);
    };
  }, []);
  
  const {
    handleToolClick,
    handleGradingToolAction
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
    // 从AI工具屋获取工具数据
    const aiToolsConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}');
    const addedAITools = JSON.parse(localStorage.getItem('added-ai-tools-to-panel') || '[]');
    
    // AI工具数据 - 从AIToolHouse组件同步
    const aiTools = [
      {
        id: 'grading-assistant',
        name: '智能阅卷助手',
        description: '专业的智能阅卷工具，支持试卷自动评阅、成绩分析、评语生成等功能',
        icon: '阅',
        color: '#c41d7f',
        menuConfig: {
          key: 'grading-assistant',
          title: '阅卷助手',
          icon: '阅',
          gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
          color: '#c41d7f'
        }
      },
      {
        id: 'smart-writer',
        name: '智能写作助手',
        description: '基于GPT技术的智能写作工具，支持文章生成、润色、翻译等功能',
        icon: '✍',
        color: '#52c41a',
        menuConfig: {
          key: 'smart-writer',
          title: '智能写作',
          icon: '✍',
          gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
          color: '#52c41a'
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
      }
    ];
    
    // 过滤掉已添加的AI工具
    const availableTools = aiTools.filter(tool => !addedAITools.includes(tool.id));
    
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
    if (visibleCards.length >= 9) {
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
    if (cardToAdd && !visibleCards.some(card => card.key === cardKey) && visibleCards.length < 9) {
      setVisibleCards(prev => [...prev, cardToAdd]);
      message.success(`已添加${cardToAdd.title}工具`);
    } else if (visibleCards.length >= 9) {
      message.warning('工具栏已满，最多只能显示9个工具');
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
          <Button 
            type="primary" 
            size="small" 
            icon={<PlusOutlined />} 
            onClick={() => {
              // 创建新的笔记记录
              const newNote = {
                id: Date.now(),
                title: '新建笔记',
                source: '手动创建',
                time: new Date().toLocaleString('zh-CN'),
                type: 'note',
                content: ''
              };
              
              // 添加到操作记录中
              const newRecords = { ...operationRecords };
              if (!newRecords.note) {
                newRecords.note = [];
              }
              newRecords.note.unshift(newNote);
              setOperationRecords(newRecords);
              
              // 设置右侧面板显示
              setRightPanelEditingNote(newNote);
              setRightPanelNoteContent(newNote.content);
              setRightPanelView('NOTE_EDITOR');
              
              message.success('已创建新笔记');
            }}
            style={{ borderRadius: '4px', fontSize: '12px', height: '24px' }}
          >
            新建笔记
          </Button>
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