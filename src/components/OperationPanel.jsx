import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  message,
  Card,
  Dropdown,
  Modal,
  Progress,
  Row,
  Col,
  Statistic,
  List,
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dayjs from 'dayjs';
import { 
  OPERATION_CARDS, 
  REPORT_DROPDOWN_ITEMS,
  RIGHT_PANEL_VIEWS,
  MORE_MENU_ACTIONS,
  OPERATION_TYPES
} from '../constants/noteEditConstants';
import { getOperationIcon } from '../utils/noteEditUtils';
import QuestionConfigModal from './QuestionConfigModal';
import ThemeSelectModal from './ThemeSelectModal';
import LearningPlanModal from './LearningPlanModal';
import LearningPlanCalendar from './LearningPlanCalendar';

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

// 可拖拽的工具卡片组件
const DraggableOperationCard = ({ card, index, onMove, onRemove, onClick, isEditMode }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'operation',
    item: { index, key: card.key },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditMode, // 只有在编辑模式下才能拖拽
  });

  const [, drop] = useDrop({
    accept: 'operation',
    hover: (draggedItem) => {
      if (isEditMode && draggedItem.index !== index) {
        onMove(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div 
      ref={(node) => isEditMode ? drag(drop(node)) : node}
      style={{ 
        position: 'relative',
        opacity: isDragging ? 0.5 : 1,
        cursor: isEditMode ? 'move' : 'pointer'
      }}
    >
      <Card 
        key={card.key}
        size="small" 
        hoverable
        onClick={!isEditMode ? onClick : undefined} // 非编辑模式下才能点击
        style={{ 
          background: card.gradient,
          border: isEditMode ? '1px dashed #1890ff' : 'none',
          borderRadius: '8px',
          textAlign: 'center',
          cursor: isEditMode ? 'move' : 'pointer',
          transition: 'all 0.2s ease',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isEditMode ? 0.8 : 1
        }}
        bodyStyle={{ padding: '4px' }}
      >
        <div style={{ padding: '2px 0' }}>
          <div style={{ fontSize: '16px', marginBottom: '2px' }}>{card.icon}</div>
          <Text style={{ 
            fontSize: '10px', 
            fontWeight: 500, 
            color: card.color,
            lineHeight: '1.2'
          }}>{card.title}</Text>
        </div>
      </Card>
      
      {/* 移除按钮 - 只有在编辑模式下才显示，且除了"添加工具"按钮外都显示 */}
      {isEditMode && card.key !== 'addTool' && (
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(card.key);
          }}
          style={{
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#ff4d4f',
            color: 'white',
            fontSize: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            minWidth: 'auto',
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.8'}
        />
      )}
    </div>
  );
};

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
    uploadedFiles,
    addedTexts,
    courseVideos,
    links
  } = state;

  const {
    onOperationClick,
    onAddTool,
    onScenarioClick,
    onRecordClick,
    onMoreAction
  } = handlers;

  // 状态管理 - 确保试卷不在默认显示列表中，知识图谱和试题默认显示，学习计划优先显示
  const [visibleCards, setVisibleCards] = useState(() => {
    const defaultCards = OPERATION_CARDS.filter(card => 
      card.key !== 'addTool' && 
      card.key !== 'exam-paper'
    );
    // 确保知识图谱在第一位，试题在第二位，学习计划在第三位
    const knowledgeGraphCard = defaultCards.find(card => card.key === 'knowledge-graph');
    const questionCard = defaultCards.find(card => card.key === 'question');
    const learningPlanCard = defaultCards.find(card => card.key === 'learning-plan');
    const otherCards = defaultCards.filter(card => 
      card.key !== 'knowledge-graph' && 
      card.key !== 'question' &&
      card.key !== 'learning-plan'
    );
    const orderedCards = [];
    if (knowledgeGraphCard) orderedCards.push(knowledgeGraphCard);
    if (questionCard) orderedCards.push(questionCard);
    if (learningPlanCard) orderedCards.push(learningPlanCard);
    orderedCards.push(...otherCards);
    return orderedCards;
  });
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // 新增编辑模式状态
  const [questionConfigVisible, setQuestionConfigVisible] = useState(false); // 试题配置弹窗状态
  const [learningPlanModalVisible, setLearningPlanModalVisible] = useState(false); // 学习计划弹窗状态
  
  // 练习模式相关状态 - 移到组件顶层以遵守React Hooks规则
  const [practiceMode, setPracticeMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  // 主题选择模态框状态
  const [showThemeSelectModal, setShowThemeSelectModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [currentActionType, setCurrentActionType] = useState(null); // 'copy' 或 'move'
  
  // 学习计划查看器状态 - 移到组件顶层以遵守React Hooks规则
  const [planViewMode, setPlanViewMode] = useState('summary'); // 'summary', 'calendar'
  const [selectedDate, setSelectedDate] = useState(dayjs());
  
  // 当切换视图时重置练习状态
  useEffect(() => {
    if (rightPanelView !== RIGHT_PANEL_VIEWS.QUESTION_VIEWER) {
      setPracticeMode(false);
      setUserAnswers({});
      setCurrentQuestionIndex(0);
      setShowResults(false);
      setScore(0);
    }
  }, [rightPanelView]);
  
  // 使用useEffect确保初始化正确
  useEffect(() => {
    const defaultCards = OPERATION_CARDS.filter(card => 
      card.key !== 'addTool' && 
      card.key !== 'exam-paper'
    );
    // 确保知识图谱在第一位，试题在第二位，学习计划在第三位
    const knowledgeGraphCard = defaultCards.find(card => card.key === 'knowledge-graph');
    const questionCard = defaultCards.find(card => card.key === 'question');
    const learningPlanCard = defaultCards.find(card => card.key === 'learning-plan');
    const otherCards = defaultCards.filter(card => 
      card.key !== 'knowledge-graph' && 
      card.key !== 'question' &&
      card.key !== 'learning-plan'
    );
    const orderedCards = [];
    if (knowledgeGraphCard) orderedCards.push(knowledgeGraphCard);
    if (questionCard) orderedCards.push(questionCard);
    if (learningPlanCard) orderedCards.push(learningPlanCard);
    orderedCards.push(...otherCards);
    setVisibleCards(orderedCards);
  }, []);

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
    }
    setShowCardSelector(false);
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
  const handleCardClick = (card) => {
    if (card.key === OPERATION_TYPES.SCENARIO) {
      onScenarioClick();
    } else if (card.key === OPERATION_TYPES.QUESTION) {
      // 试题工具弹出配置窗口
      setQuestionConfigVisible(true);
    } else if (card.key === OPERATION_TYPES.LEARNING_PLAN) {
      // 学习计划工具弹出配置窗口
      setLearningPlanModalVisible(true);
    } else {
      onOperationClick(card.key);
    }
  };

  // 处理主题选择确认
  const handleThemeSelectConfirm = async (targetTheme, record, actionType) => {
    try {
      if (actionType === 'copy') {
        // 复制操作：在目标主题中创建记录副本
        const copiedRecord = {
          ...record,
          id: Date.now(), // 生成新的ID
          title: `${record.title} (副本)`,
          time: '刚刚',
          source: `${record.source} • 复制自 ${targetTheme.name}`,
          originalTheme: targetTheme.name,
          copyFrom: record.id
        };
        
        // 添加到操作记录中
        setOperationRecords(prev => ({
          ...prev,
          [record.type]: [copiedRecord, ...(prev[record.type] || [])]
        }));
        
        message.success(`成功复制"${record.title}"到主题"${targetTheme.name}"`);
      } else if (actionType === 'move') {
        // 移动操作：将记录转移到目标主题
        const movedRecord = {
          ...record,
          source: `${record.source} • 移至 ${targetTheme.name}`,
          originalTheme: targetTheme.name,
          moveToTheme: targetTheme.name
        };
        
        // 更新记录
        setOperationRecords(prev => ({
          ...prev,
          [record.type]: (prev[record.type] || []).map(r => 
            r.id === record.id ? movedRecord : r
          )
        }));
        
        message.success(`成功移动"${record.title}"到主题"${targetTheme.name}"`);
      }
      
      // 关闭模态框
      setShowThemeSelectModal(false);
      setCurrentRecord(null);
      setCurrentActionType(null);
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败，请重试');
    }
  };
  
  // 处理取消主题选择
  const handleThemeSelectCancel = () => {
    setShowThemeSelectModal(false);
    setCurrentRecord(null);
    setCurrentActionType(null);
  };
  
  // 修改onMoreAction处理器以支持复制和移动操作
  const handleMoreAction = (action, record) => {
    if (action === MORE_MENU_ACTIONS.COPY_TO) {
      setCurrentRecord(record);
      setCurrentActionType('copy');
      setShowThemeSelectModal(true);
      return;
    }
    
    if (action === MORE_MENU_ACTIONS.MOVE_TO) {
      setCurrentRecord(record);
      setCurrentActionType('move');
      setShowThemeSelectModal(true);
      return;
    }
    
    // 调用原始的onMoreAction处理器
    onMoreAction(action, record);
  };

  // 处理试题配置确认
  const handleQuestionConfigConfirm = (operationRecord) => {
    setOperationRecords(prev => ({
      ...prev,
      question: [operationRecord, ...(prev.question || [])]
    }));
  };



  // 处理学习计划配置确认
  const handleLearningPlanConfirm = (planData) => {
    const { analysis, plan, habits, customContent } = planData;
    
    // 生成学习计划内容
    let planContent = `📊 **课程分析结果**\n`;
    planContent += `- 总课程：${analysis.totalCourses}门\n`;
    planContent += `- 总学时：${analysis.totalHours}小时\n`;
    planContent += `- 完成进度：${Math.round((analysis.progress.completed / analysis.totalCourses) * 100)}%\n\n`;
    
    planContent += `📋 **学习计划**\n`;
    planContent += `- 计划周期：${plan.duration}\n`;
    planContent += `- 每周学时：${plan.weeklyHours}小时\n`;
    if (plan.schedule) {
      planContent += `- 时间安排：${plan.schedule}\n`;
    }
    planContent += `\n`;
    
    if (plan.phases) {
      planContent += `**学习路径：**\n`;
      plan.phases.forEach((phase, index) => {
        planContent += `${index + 1}. ${phase.phase}\n`;
        phase.tasks.forEach(task => {
          planContent += `   - ${task}\n`;
        });
        planContent += `   🎯 ${phase.milestone}\n\n`;
      });
    }
    
    if (habits.length > 0) {
      const habitLabels = habits.map(h => {
        const habitMap = {
          'morning': '早晨学习',
          'evening': '晚间学习', 
          'weekend': '周末集中',
          'fragmented': '碎片化学习',
          'intensive': '密集学习',
          'gradual': '循序渐进'
        };
        return habitMap[h];
      }).filter(Boolean);
      
      planContent += `🏃 **学习习惯：** ${habitLabels.join('、')}\n\n`;
    }
    
    if (plan.recommendations) {
      planContent += `💡 **个性化建议：**\n`;
      plan.recommendations.forEach(rec => {
        planContent += `- ${rec}\n`;
      });
      planContent += `\n`;
    }
    
    if (customContent) {
      planContent += `✏️ **补充说明：**\n${customContent}\n\n`;
    }
    
    planContent += `---\n💫 *学习计划已生成，祝您学习顺利！*`;
    
    // 创建操作记录
    const record = {
      id: Date.now(),
      title: '智能学习计划',
      source: `基于${analysis.totalCourses}门课程分析生成`,
      time: '刚刚',
      type: OPERATION_TYPES.LEARNING_PLAN,
      content: planContent,
      metadata: {
        analysis,
        plan,
        habits,
        customContent
      },
      isAIGenerated: true
    };
    
    // 添加到操作记录
    setOperationRecords(prev => ({
      ...prev,
      'learning-plan': [record, ...(prev['learning-plan'] || [])]
    }));
    
    setLearningPlanModalVisible(false);
    
    // 显示成功提示
    message.success('学习计划已生成！');
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

  // 获取更多操作菜单项
  const getMoreMenuItems = (record) => {
    const commonItems = [
      {
        key: MORE_MENU_ACTIONS.COPY_TO,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📋</span>
            <span>复制到</span>
          </div>
        ),
        onClick: ({ domEvent }) => {
          domEvent?.stopPropagation();
          handleMoreAction(MORE_MENU_ACTIONS.COPY_TO, record);
        }
      },
      {
        key: MORE_MENU_ACTIONS.MOVE_TO,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📦</span>
            <span>移动到</span>
          </div>
        ),
        onClick: ({ domEvent }) => {
          domEvent?.stopPropagation();
          handleMoreAction(MORE_MENU_ACTIONS.MOVE_TO, record);
        }
      },
      {
        type: 'divider'
      },
      {
        key: MORE_MENU_ACTIONS.DELETE,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🗑️</span>
            <span>删除</span>
          </div>
        ),
        onClick: ({ domEvent }) => {
          domEvent?.stopPropagation();
          handleMoreAction(MORE_MENU_ACTIONS.DELETE, record);
        }
      }
    ];

    // 笔记类型添加标记研修成果选项
    if (record.type === 'note') {
      return [
        {
          key: record.isStudyResult ? MORE_MENU_ACTIONS.UNMARK_STUDY_RESULT : MORE_MENU_ACTIONS.MARK_STUDY_RESULT,
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
              record.isStudyResult ? MORE_MENU_ACTIONS.UNMARK_STUDY_RESULT : MORE_MENU_ACTIONS.MARK_STUDY_RESULT, 
              record
            );
          }
        },
        {
          type: 'divider'
        },
        ...commonItems
      ];
    }

    // 报告类型添加额外选项
    if (record.type === 'report') {
      return [
        {
          key: MORE_MENU_ACTIONS.CONVERT_TO_SOURCE,
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📋</span>
              <span>转换为来源</span>
            </div>
          ),
          onClick: ({ domEvent }) => {
            domEvent?.stopPropagation();
            handleMoreAction(MORE_MENU_ACTIONS.CONVERT_TO_SOURCE, record);
          }
        },
        {
          type: 'divider'
        },
        ...commonItems
      ];
    }

    return commonItems;
  };

  console.log('OperationPanel state:', {
    rightPanelView,
    rightPanelEditingNote,
    rightPanelNoteContent
  });

  if (rightPanelView === RIGHT_PANEL_VIEWS.NOTE_EDITOR) {
    // 右侧栏笔记编辑器
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 编辑器头部 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📝</span>
            <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {rightPanelEditingNote?.title || '未命名主题'}
            </Text>
          </div>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
              setRightPanelEditingNote(null);
              setRightPanelNoteContent('');
            }}
            style={{ color: '#666' }}
          >
            返回
          </Button>
        </div>

        {/* 编辑器内容区域 */}
        <div style={{ 
          flex: 1,
          border: '1px solid #d9d9d9', 
          borderRadius: '6px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* 工具栏 */}
          <div style={{ 
            padding: '8px 12px',
            borderBottom: '1px solid #f0f0f0',
            background: '#fafafa',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <Button 
              size="small" 
              onClick={() => document.execCommand('bold')}
              style={{ minWidth: '28px' }}
            >
              <strong>B</strong>
            </Button>
            <Button 
              size="small" 
              onClick={() => document.execCommand('italic')}
              style={{ minWidth: '28px' }}
            >
              <em>I</em>
            </Button>
            <Button 
              size="small" 
              onClick={() => document.execCommand('underline')}
              style={{ minWidth: '28px' }}
            >
              <u>U</u>
            </Button>
            <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#999' }}>
              支持富文本编辑
            </div>
          </div>

          {/* 编辑器 */}
          <div style={{ flex: 1, padding: '12px' }}>
            <div 
              contentEditable
              style={{
                minHeight: '300px',
                outline: 'none',
                lineHeight: '1.6',
                fontSize: '14px',
                color: '#333'
              }}
              dangerouslySetInnerHTML={{ __html: rightPanelNoteContent }}
              onInput={(e) => {
                setRightPanelNoteContent(e.target.innerHTML);
              }}
            />
          </div>
        </div>

        {/* 保存按钮 */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button 
            onClick={() => {
              setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
              setRightPanelEditingNote(null);
              setRightPanelNoteContent('');
            }}
          >
            取消
          </Button>
          <Button 
            type="primary" 
            onClick={() => {
              if (!rightPanelNoteContent.trim() || rightPanelNoteContent === '<p></p>') {
                message.warning('请输入笔记内容');
                return;
              }

              // 更新操作记录中的笔记内容
              setOperationRecords(prev => ({
                ...prev,
                note: prev.note.map(note => 
                  note.id === rightPanelEditingNote.id 
                    ? { ...note, content: rightPanelNoteContent }
                    : note
                )
              }));

              message.success('笔记已保存');
              setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
              setRightPanelEditingNote(null);
              setRightPanelNoteContent('');
            }}
          >
            保存
          </Button>
        </div>
      </div>
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.QUESTION_VIEWER) {
    // 右侧栏试题查看器
    
    // 解析试题结构化数据
    const questions = rightPanelQuestionRecord?.questions || [];
    
    // 处理答题
    const handleAnswer = (questionId, answer) => {
      setUserAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
    };
    
    // 计算得分
    const calculateScore = () => {
      let totalScore = 0;
      let earnedScore = 0;
      
      questions.forEach((q, index) => {
        totalScore += q.score || 1;
        const userAnswer = userAnswers[index];
        
        if (q.type === '单选题' && userAnswer === q.answer) {
          earnedScore += q.score || 1;
        } else if (q.type === '多选题' && Array.isArray(userAnswer) && Array.isArray(q.answer)) {
          const correct = q.answer.every(ans => userAnswer.includes(ans)) && 
                         userAnswer.every(ans => q.answer.includes(ans));
          if (correct) earnedScore += q.score || 1;
        } else if (q.type === '判断题' && userAnswer === q.answer) {
          earnedScore += q.score || 1;
        } else if (q.type === '填空题' && userAnswer && 
                  userAnswer.trim().toLowerCase() === (q.answer || '').trim().toLowerCase()) {
          earnedScore += q.score || 1;
        }
      });
      
      return { earnedScore, totalScore, percentage: totalScore > 0 ? (earnedScore / totalScore * 100).toFixed(1) : 0 };
    };
    
    // 提交答案
    const handleSubmit = () => {
      const result = calculateScore();
      setScore(result);
      setShowResults(true);
      message.success(`答题完成！得分：${result.earnedScore}/${result.totalScore} (${result.percentage}%)`);
    };
    
    // 重新开始
    const handleRestart = () => {
      setUserAnswers({});
      setCurrentQuestionIndex(0);
      setShowResults(false);
      setScore(0);
    };
    
    // 渲染单题
    const renderQuestion = (question, index) => {
      const isAnswered = userAnswers.hasOwnProperty(index);
      const userAnswer = userAnswers[index];
      
      return (
        <div key={index} style={{
          marginBottom: '24px',
          padding: '20px',
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          background: '#fafafa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#262626' }}>第{index + 1}题</span>
            <span style={{ 
              background: question.type === '单选题' ? '#52c41a' : 
                         question.type === '多选题' ? '#1890ff' : 
                         question.type === '判断题' ? '#fa8c16' : '#eb2f96',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              {question.type}
            </span>
            <span style={{ 
              background: '#f0f0f0',
              color: '#666',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              {question.score || 1}分
            </span>
            {isAnswered && (
              <span style={{ color: '#52c41a', fontSize: '12px' }}>✓ 已答</span>
            )}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '15px', color: '#262626', margin: 0, fontWeight: 500 }}>
              {question.question}
            </p>
          </div>
          
          {question.type === '单选题' && question.options && (
            <div style={{ marginLeft: '20px' }}>
              {question.options.map((option, optIndex) => (
                <label key={optIndex} style={{
                  display: 'block',
                  margin: '8px 0',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  background: userAnswer === option ? '#e6f7ff' : 'transparent',
                  border: userAnswer === option ? '1px solid #1890ff' : '1px solid transparent'
                }}>
                  <input
                    type="radio"
                    name={`question_${index}`}
                    value={option}
                    checked={userAnswer === option}
                    onChange={(e) => handleAnswer(index, e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          
          {question.type === '多选题' && question.options && (
            <div style={{ marginLeft: '20px' }}>
              {question.options.map((option, optIndex) => (
                <label key={optIndex} style={{
                  display: 'block',
                  margin: '8px 0',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  background: (userAnswer || []).includes(option) ? '#e6f7ff' : 'transparent',
                  border: (userAnswer || []).includes(option) ? '1px solid #1890ff' : '1px solid transparent'
                }}>
                  <input
                    type="checkbox"
                    value={option}
                    checked={(userAnswer || []).includes(option)}
                    onChange={(e) => {
                      const currentAnswers = userAnswer || [];
                      if (e.target.checked) {
                        handleAnswer(index, [...currentAnswers, option]);
                      } else {
                        handleAnswer(index, currentAnswers.filter(ans => ans !== option));
                      }
                    }}
                    style={{ marginRight: '8px' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          
          {question.type === '判断题' && (
            <div style={{ marginLeft: '20px' }}>
              {['正确', '错误'].map((option, optIndex) => (
                <label key={optIndex} style={{
                  display: 'inline-block',
                  margin: '8px 16px 8px 0',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  background: userAnswer === (optIndex === 0) ? '#e6f7ff' : 'transparent',
                  border: userAnswer === (optIndex === 0) ? '1px solid #1890ff' : '1px solid #d9d9d9'
                }}>
                  <input
                    type="radio"
                    name={`question_${index}`}
                    value={optIndex === 0}
                    checked={userAnswer === (optIndex === 0)}
                    onChange={(e) => handleAnswer(index, optIndex === 0)}
                    style={{ marginRight: '8px' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          
          {question.type === '填空题' && (
            <div style={{ marginLeft: '20px' }}>
              <input
                type="text"
                placeholder="请输入答案"
                value={userAnswer || ''}
                onChange={(e) => handleAnswer(index, e.target.value)}
                style={{
                  width: '300px',
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
          )}
          
          {showResults && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: (() => {
                const isCorrect = (() => {
                  if (question.type === '单选题') return userAnswer === question.answer;
                  if (question.type === '多选题') {
                    if (!Array.isArray(userAnswer) || !Array.isArray(question.answer)) return false;
                    return question.answer.every(ans => userAnswer.includes(ans)) && 
                           userAnswer.every(ans => question.answer.includes(ans));
                  }
                  if (question.type === '判断题') return userAnswer === question.answer;
                  if (question.type === '填空题') {
                    return userAnswer && userAnswer.trim().toLowerCase() === (question.answer || '').trim().toLowerCase();
                  }
                  return false;
                })();
                return isCorrect ? '#f6ffed' : '#fff2f0';
              })(),
              border: (() => {
                const isCorrect = (() => {
                  if (question.type === '单选题') return userAnswer === question.answer;
                  if (question.type === '多选题') {
                    if (!Array.isArray(userAnswer) || !Array.isArray(question.answer)) return false;
                    return question.answer.every(ans => userAnswer.includes(ans)) && 
                           userAnswer.every(ans => question.answer.includes(ans));
                  }
                  if (question.type === '判断题') return userAnswer === question.answer;
                  if (question.type === '填空题') {
                    return userAnswer && userAnswer.trim().toLowerCase() === (question.answer || '').trim().toLowerCase();
                  }
                  return false;
                })();
                return isCorrect ? '1px solid #b7eb8f' : '1px solid #ffccc7';
              })(),
              borderRadius: '4px'
            }}>
              <p style={{ margin: '0 0 8px 0', color: '#52c41a', fontWeight: 500, fontSize: '13px' }}>
                ✓ 正确答案：
              </p>
              <p style={{ margin: 0, color: '#262626', fontSize: '14px', whiteSpace: 'pre-line' }}>
                {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}
              </p>
            </div>
          )}
        </div>
      );
    };
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 查看器头部 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', color: '#00695c' }}>📋</span>
              <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {practiceMode ? '练习模式' : '试题内容'}
              </Text>
            </div>
            
            {/* 模式切换 */}
            {questions.length > 0 && (
              <div style={{
                display: 'flex',
                background: '#f5f5f5',
                borderRadius: '6px',
                padding: '2px'
              }}>
                <button
                  onClick={() => {
                    setPracticeMode(false);
                    setShowResults(false);
                  }}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    background: !practiceMode ? '#1890ff' : 'transparent',
                    color: !practiceMode ? 'white' : '#666',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  📄 查看模式
                </button>
                <button
                  onClick={() => {
                    setPracticeMode(true);
                    handleRestart();
                  }}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    background: practiceMode ? '#52c41a' : 'transparent',
                    color: practiceMode ? 'white' : '#666',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  🎨 练习模式
                </button>
              </div>
            )}
          </div>
          
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
              setRightPanelQuestionRecord(null);
              setRightPanelQuestionContent('');
            }}
            style={{ color: '#666' }}
          >
            返回
          </Button>
        </div>

        {/* 试题信息 */}
        {rightPanelQuestionRecord && (
          <div style={{
            background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #4caf50'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ color: '#00695c', fontWeight: 'bold' }}>{rightPanelQuestionRecord.title}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#666', display: 'flex', gap: '12px' }}>
              <span>{rightPanelQuestionRecord.source}</span>
              <span>{rightPanelQuestionRecord.time}</span>
              {questions.length > 0 && (
                <span>共{questions.length}道题</span>
              )}
            </div>
          </div>
        )}
        
        {/* 练习模式的进度和操作栏 */}
        {practiceMode && questions.length > 0 && (
          <div style={{
            background: '#f8f9fa',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Text style={{ fontSize: '14px', color: '#666' }}>
                答题进度：{Object.keys(userAnswers).length}/{questions.length}
              </Text>
              {showResults && (
                <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#52c41a' }}>
                  得分：{score.earnedScore}/{score.totalScore} ({score.percentage}%)
                </Text>
              )}
            </div>
            
            {/* 进度条 */}
            <div style={{
              width: '100%',
              height: '6px',
              background: '#e9ecef',
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '12px'
            }}>
              <div style={{
                width: `${(Object.keys(userAnswers).length / questions.length) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #52c41a 0%, #73d13d 100%)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            
            {/* 操作按钮 */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {!showResults && (
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  disabled={Object.keys(userAnswers).length === 0}
                  style={{ fontSize: '12px' }}
                >
                  📊 提交答案
                </Button>
              )}
              
              {showResults && (
                <Button
                  onClick={handleRestart}
                  style={{ fontSize: '12px' }}
                >
                  🔄 重新练习
                </Button>
              )}
            </div>
          </div>
        )}

        {/* 试题内容显示区域 */}
        <div style={{ 
          flex: 1,
          border: '1px solid #d9d9d9', 
          borderRadius: '8px',
          padding: '16px',
          background: '#fff',
          overflow: 'auto'
        }}>
          {practiceMode && questions.length > 0 ? (
            // 练习模式：显示交互式试题
            <div>
              {questions.map((question, index) => renderQuestion(question, index))}
            </div>
          ) : (
            // 查看模式：显示原始HTML内容
            <div 
              dangerouslySetInnerHTML={{ __html: rightPanelQuestionContent }}
              style={{ 
                lineHeight: '1.6',
                fontSize: '14px',
                color: '#333'
              }}
            />
          )}
        </div>
      </div>
    );
  }

  if (rightPanelView === RIGHT_PANEL_VIEWS.LEARNING_PLAN_VIEWER) {
    // 右侧栏学习计划查看器
    
    // 从 metadata中获取学习计划数据  
    const planData = rightPanelLearningPlanRecord?.metadata;
    const analysis = planData?.analysis;
    const plan = planData?.plan;
    const habits = planData?.habits || [];
    const customContent = planData?.customContent;
    
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 查看器头部 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🎯</span>
            <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
              学习计划查看器
            </Text>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* 视图切换按钮 */}
            <Button.Group size="small">
              <Button 
                type={planViewMode === 'summary' ? 'primary' : 'default'}
                onClick={() => setPlanViewMode('summary')}
                icon={<FileTextOutlined />}
              >
                概览
              </Button>
              <Button 
                type={planViewMode === 'calendar' ? 'primary' : 'default'}
                onClick={() => setPlanViewMode('calendar')}
                icon={<CalendarOutlined />}
              >
                日历
              </Button>
            </Button.Group>
            
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
                setRightPanelLearningPlanRecord(null);
                setRightPanelLearningPlanContent('');
              }}
              style={{ color: '#666' }}
            >
              返回
            </Button>
          </div>
        </div>

        {/* 学习计划信息 */}
        {rightPanelLearningPlanRecord && (
          <div style={{
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #4caf50'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>{rightPanelLearningPlanRecord.title}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#666', display: 'flex', gap: '12px' }}>
              <span>{rightPanelLearningPlanRecord.source}</span>
              <span>{rightPanelLearningPlanRecord.time}</span>
              {analysis && (
                <span>基于{analysis.totalCourses}门课程分析</span>
              )}
            </div>
          </div>
        )}
        
        {/* 学习计划内容显示区域 */}
        <div style={{ 
          flex: 1,
          border: '1px solid #d9d9d9', 
          borderRadius: '8px',
          background: '#fff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {planViewMode === 'summary' ? (
            // 概览模式
            <div>
              {/* 如果有结构化数据，优先显示结构化内容 */}
              {planData && analysis && plan ? (
                <div style={{ padding: '16px', overflow: 'auto', height: '100%' }}>
                  {/* 课程分析统计 */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ color: '#1890ff', marginBottom: '12px' }}>📊 课程分析结果</h4>
                    <Row gutter={[12, 12]}>
                      <Col span={8}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Statistic title="总课程" value={analysis.totalCourses} suffix="门" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Statistic title="总学时" value={analysis.totalHours} suffix="小时" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Statistic 
                            title="完成进度" 
                            value={Math.round((analysis.progress.completed / analysis.totalCourses) * 100)} 
                            suffix="%" 
                          />
                        </Card>
                      </Col>
                    </Row>
                  </div>
                  
                  {/* 学习计划统计 */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ color: '#52c41a', marginBottom: '12px' }}>📋 学习计划</h4>
                    <Row gutter={[12, 12]}>
                      <Col span={8}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Statistic title="计划周期" value={plan.duration} />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Statistic title="每周学时" value={plan.weeklyHours} suffix="小时" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Statistic title="学习阶段" value={plan.phases?.length || 0} suffix="个" />
                        </Card>
                      </Col>
                    </Row>
                    
                    {plan.schedule && (
                      <Card size="small" style={{ marginTop: '12px' }}>
                        <strong>时间安排：</strong> {plan.schedule}
                      </Card>
                    )}
                  </div>
                  
                  {/* 学习路径规划 */}
                  {plan.phases && plan.phases.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ color: '#722ed1', marginBottom: '12px' }}>🚀 学习路径规划</h4>
                      {plan.phases.map((phase, index) => (
                        <Card 
                          key={index} 
                          size="small" 
                          title={phase.phase}
                          style={{ marginBottom: '12px' }}
                        >
                          <List
                            size="small"
                            dataSource={phase.tasks}
                            renderItem={task => (
                              <List.Item>
                                <PlayCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                {task}
                              </List.Item>
                            )}
                          />
                          <div style={{ 
                            marginTop: '8px', 
                            padding: '8px', 
                            background: '#f6ffed', 
                            borderRadius: '4px',
                            fontStyle: 'italic', 
                            color: '#52c41a' 
                          }}>
                            🎯 {phase.milestone}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {/* 学习习惯 */}
                  {habits.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ color: '#fa8c16', marginBottom: '12px' }}>🏃 学习习惯</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {habits.map(habit => {
                          const habitMap = {
                            'morning': '早晨学习',
                            'evening': '晚间学习', 
                            'weekend': '周末集中',
                            'fragmented': '碎片化学习',
                            'intensive': '密集学习',
                            'gradual': '循序渐进'
                          };
                          return (
                            <Tag key={habit} color="orange">{habitMap[habit]}</Tag>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* 个性化建议 */}
                  {plan.recommendations && plan.recommendations.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ color: '#eb2f96', marginBottom: '12px' }}>💡 个性化建议</h4>
                      <List
                        size="small"
                        dataSource={plan.recommendations}
                        renderItem={rec => (
                          <List.Item>
                            <FileTextOutlined style={{ marginRight: 8, color: '#eb2f96' }} />
                            {rec}
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                  
                  {/* 补充说明 */}
                  {customContent && (
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ color: '#666', marginBottom: '12px' }}>✏️ 补充说明</h4>
                      <Card size="small" style={{ background: '#fafafa' }}>
                        <Text>{customContent}</Text>
                      </Card>
                    </div>
                  )}
                </div>
              ) : (
                // 显示原始内容
                <div 
                  style={{ 
                    padding: '16px',
                    overflow: 'auto',
                    height: '100%',
                    lineHeight: '1.6',
                    fontSize: '14px',
                    color: '#333'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: rightPanelLearningPlanContent || '暂无学习计划内容'
                  }}
                />
              )}
            </div>
          ) : (
            // 日历模式
            <LearningPlanCalendar
              planData={planData}
              analysis={analysis}
              plan={plan}
              habits={habits}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {/* 上半部分 - 功能概览 */}
      <div style={{ padding: '12px 16px 8px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Title level={5} style={{ margin: 0, color: '#1f1f1f', fontSize: '14px' }}>
            🛠️ 操作面板
          </Title>
          <Button
            type={isEditMode ? 'primary' : 'default'}
            size="small"
            icon={<EditOutlined />}
            onClick={() => setIsEditMode(!isEditMode)}
            style={{
              borderRadius: '4px',
              fontSize: '11px',
              height: '24px',
              padding: '0 8px'
            }}
          >
            {isEditMode ? '完成' : '编辑'}
          </Button>
        </div>
        
        {/* 编辑模式提示 */}
        {isEditMode && (
          <div style={{
            background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
            border: '1px solid #91d5ff',
            borderRadius: '6px',
            padding: '6px 10px',
            marginBottom: '8px',
            fontSize: '11px',
            color: '#1890ff'
          }}>
            📝 编辑模式：可以拖拽排序、添加和移除工具
          </div>
        )}
        
        {/* 功能卡片网格 - 3x3网格，最多9个 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '6px', 
          marginBottom: 8 
        }}>
          {/* 渲染可见的工具 - 最多9个 */}
          {visibleCards.slice(0, 9).map((card, index) => (
            <DraggableOperationCard
              key={card.key}
              card={card}
              index={index}
              onMove={moveCardPosition}
              onRemove={handleRemoveCard}
              onClick={() => handleCardClick(card)}
              isEditMode={isEditMode}
            />
          ))}

          {/* "更多"按钮 - 只在编辑模式且工具数量少于9个时显示 */}
          {isEditMode && visibleCards.length < 9 && (
            <Dropdown
              open={showCardSelector}
              onOpenChange={setShowCardSelector}
            menu={{
              items: [
                // 添加分组标题
                {
                  type: 'group',
                  label: (
                    <div style={{
                      padding: '8px 4px 4px 4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#8c8c8c',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '1px solid #f0f0f0',
                      marginBottom: '4px'
                    }}>
                      🛠️ 选择更多工具
                    </div>
                  ),
                  children: OPERATION_CARDS
                    .filter(card => card.key !== 'addTool' && !visibleCards.some(vc => vc.key === card.key))
                    .map(card => ({
                      key: card.key,
                      label: (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px',
                          padding: '8px 4px',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease'
                        }}>
                          <div style={{ 
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: card.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: card.color,
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.2s ease'
                          }}
                          className="tool-icon"
                          >
                            {card.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontSize: '14px', 
                              fontWeight: 500, 
                              color: '#1f1f1f',
                              marginBottom: '2px'
                            }}>
                              {card.title}
                            </div>
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#8c8c8c'
                            }}>
                              点击添加到工具栏
                            </div>
                          </div>
                        </div>
                      ),
                      onClick: () => handleAddCard(card.key)
                    }))
                }
              ].filter(item => {
                // 如果没有可添加的工具，显示提示信息
                const availableTools = OPERATION_CARDS.filter(card => card.key !== 'addTool' && !visibleCards.some(vc => vc.key === card.key));
                if (availableTools.length === 0) {
                  return false;
                }
                return true;
              }).concat(OPERATION_CARDS.filter(card => card.key !== 'addTool' && !visibleCards.some(vc => vc.key === card.key)).length === 0 ? [{
                key: 'no-tools',
                label: (
                  <div style={{
                    textAlign: 'center',
                    padding: '20px 16px',
                    color: '#8c8c8c',
                    fontSize: '14px'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉</div>
                    <div>所有工具已添加完成</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      您可以移除现有工具来添加其他工具
                    </div>
                  </div>
                ),
                disabled: true
              }] : [])
            }}
            trigger={['click']}
            placement="topLeft"
            overlayStyle={{
              minWidth: '300px',
              borderRadius: '16px',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08)',
              padding: '12px 8px',
              border: '1px solid #f0f0f0',
              backgroundColor: '#ffffff'
            }}
            overlayClassName="custom-more-tools-dropdown"
          >
            <Card 
              size="small" 
              hoverable
              style={{ 
                background: 'linear-gradient(135deg, #f8faff 0%, #eef4ff 100%)',
                border: '1px dashed #1890ff',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
              bodyStyle={{ padding: '4px' }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 16px rgba(24, 144, 255, 0.15)';
                e.target.style.borderColor = '#0050b3';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
                e.target.style.borderColor = '#1890ff';
              }}
            >
              {/* 背景装饰 */}
              <div style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '20px',
                height: '20px',
                background: 'linear-gradient(135deg, #1890ff20, #40a9ff20)',
                borderRadius: '50%',
                opacity: 0.6
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-3px',
                left: '-3px',
                width: '12px',
                height: '12px',
                background: 'linear-gradient(135deg, #1890ff15, #40a9ff15)',
                borderRadius: '50%',
                opacity: 0.4
              }} />
              
              <div style={{ padding: '2px 0', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  fontSize: '16px', 
                  marginBottom: '2px',
                  background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 1px 2px rgba(24, 144, 255, 0.3))'
                }}>
                  ⚡
                </div>
                <Text style={{ 
                  fontSize: '10px', 
                  fontWeight: 600, 
                  color: '#1890ff',
                  textShadow: '0 1px 2px rgba(24, 144, 255, 0.1)',
                  lineHeight: '1.2'
                }}>
                  更多工具
                </Text>
              </div>
            </Card>
          </Dropdown>
          )}
          
          {/* 工具栏已满提示 */}
          {visibleCards.length >= 9 && (
            <div style={{
              textAlign: 'center',
              padding: '6px',
              color: '#999',
              fontSize: '10px',
              border: '1px dashed #d9d9d9',
              borderRadius: '8px',
              background: '#fafafa',
              gridColumn: 'span 3',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              💼 工具栏已满（最处9个）
            </div>
          )}
        </div>
      </div>
      
      {/* 下半部分 - 操作记录 */}
      <div style={{ padding: '12px', borderTop: '1px solid #f0f0f0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '8px' }}>
          {Object.values(operationRecords).flat().map(record => (
            <Card 
              key={record.id}
              size="small" 
              hoverable
              style={{ 
                marginBottom: '6px',
                borderRadius: '6px',
                border: record.isStudyResult 
                  ? '1px solid #f59e0b' 
                  : '1px solid #f0f0f0',
                cursor: 'pointer',
                background: record.isStudyResult 
                  ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' 
                  : '#fff',
                boxShadow: 'none',
                position: 'relative'
              }}
              bodyStyle={{ padding: '8px' }}
              onClick={() => onRecordClick(record)}
            >
              {/* 研修成果标记 */}
              {record.isStudyResult && (
                <div style={{
                  position: 'absolute',
                  top: '-1px',
                  right: '-1px',
                  background: '#f59e0b',
                  color: 'white',
                  fontSize: '8px',
                  padding: '1px 4px',
                  borderRadius: '0 5px 0 6px',
                  fontWeight: 'bold',
                  zIndex: 1
                }}>
                  🏆
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ fontSize: '14px', flexShrink: 0 }}>
                  {record.isAIGenerated ? '🤖' : getOperationIcon(record.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <Text 
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: 500, 
                        color: '#1f1f1f',
                        lineHeight: '1.2'
                      }}
                      ellipsis={{ tooltip: record.title }}
                    >
                      {record.title}
                    </Text>
                  </div>
                  
                  {/* AI创建场景进度显示 */}
                  {record.status === 'creating' && record.progress !== undefined && (
                    <div style={{ marginBottom: '2px' }}>
                      <Progress 
                        percent={record.progress} 
                        size="small" 
                        status="active"
                        strokeColor={{
                          '0%': '#667eea',
                          '100%': '#764ba2',
                        }}
                        showInfo={false}
                        style={{ marginBottom: '1px', height: '4px' }}
                      />
                      <Text style={{ fontSize: '9px', color: '#667eea', fontWeight: 500 }}>
                        AI生成中... {record.progress}%
                      </Text>
                    </div>
                  )}
                  
                  {/* 完成状态显示 */}
                  {record.status === 'completed' && record.isAIGenerated && (
                    <div style={{ marginBottom: '2px' }}>
                      <Text style={{ fontSize: '9px', color: '#52c41a', fontWeight: 500 }}>
                        🎉 生成完成
                      </Text>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: '9px', color: '#999', lineHeight: '1' }}>
                      {record.source}
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {(record.type === 'audio' || record.type === 'video') && (
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<div style={{ fontSize: '10px' }}>▶</div>}
                          style={{ padding: '1px 3px', height: '16px', minWidth: 'auto' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRecordClick(record);
                          }}
                        />
                      )}
                      {record.type === 'note' && (
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<EditOutlined style={{ fontSize: '10px' }} />}
                          style={{ padding: '1px 3px', height: '16px', minWidth: 'auto' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRecordClick(record);
                          }}
                        />
                      )}
                      {record.type === 'question' && (
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<div style={{ fontSize: '10px', color: '#00695c' }}>📋</div>}
                          style={{ padding: '1px 3px', height: '16px', minWidth: 'auto' }}
                          title="查看试题"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRecordClick(record);
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
                          icon={<div style={{ fontSize: '10px' }}>⋯</div>}
                          style={{ padding: '1px 3px', height: '16px', minWidth: 'auto' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {Object.values(operationRecords).flat().length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', padding: '12px 0', fontSize: '11px' }}>
              暂无操作记录
            </div>
          )}
        </div>
        
        {/* 新建笔记按钮 - 固定在底部 */}
        <div style={{ 
          marginTop: 'auto',
          paddingTop: '8px',
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreateNewNote}
            style={{
              borderRadius: '6px',
              fontSize: '11px',
              height: '28px',
              paddingLeft: '10px',
              paddingRight: '10px'
            }}
          >
            新建笔记
          </Button>
        </div>
      </div>
      
      {/* 试题配置弹窗 */}
      <QuestionConfigModal
        visible={questionConfigVisible}
        onClose={() => setQuestionConfigVisible(false)}
        onConfirm={handleQuestionConfigConfirm}
        materialCount={uploadedFiles.length + addedTexts.length + courseVideos.length + links.length}
      />
      
      {/* 学习计划配置弹窗 */}
      <LearningPlanModal
        visible={learningPlanModalVisible}
        onCancel={() => setLearningPlanModalVisible(false)}
        onConfirm={handleLearningPlanConfirm}
      />
      
      {/* 主题选择模态框 */}
      <ThemeSelectModal
        open={showThemeSelectModal}
        onCancel={handleThemeSelectCancel}
        onConfirm={handleThemeSelectConfirm}
        title={currentActionType === 'copy' ? '选择复制目标主题' : '选择移动目标主题'}
        confirmText={currentActionType === 'copy' ? '复制到此主题' : '移动到此主题'}
        record={currentRecord}
        actionType={currentActionType}
      />
    </DndProvider>
  );
};

export default OperationPanel;