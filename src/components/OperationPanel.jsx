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

// 导入子组件
import DraggableOperationCard from './OperationPanel/DraggableOperationCard';
import NoteEditorViewer from './OperationPanel/NoteEditorViewer';
import QuestionViewer from './OperationPanel/QuestionViewer';
import GradingViewer from './OperationPanel/GradingViewer';
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

  // 使用自定义Hooks进行状态管理
  const {
    visibleCards,
    setVisibleCards,
    isEditMode,
    setIsEditMode,
    showCardSelector,
    setShowCardSelector,
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
  } = useOperationPanelState();
  
  const {
    questionConfigVisible,
    setQuestionConfigVisible,
    learningPlanModalVisible,
    setLearningPlanModalVisible,
    reportSelectionVisible,
    setReportSelectionVisible,
    showThemeSelectModal,
    setShowThemeSelectModal,
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
  const handleCardClick = (card) => {
    handleToolClick(card);
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
        <Title level={5} style={{ marginBottom: 16, color: '#1f1f1f' }}>📝 操作记录</Title>
        
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '300px' }}>
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
                onClick={() => onRecordClick && onRecordClick(record)}
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
                      <Text ellipsis style={{ fontSize: '12px', fontWeight: 500, display: 'block' }}>
                        {record.title}
                      </Text>
                      <Text style={{ fontSize: '10px', color: '#999', display: 'block' }}>
                        {record.source}
                      </Text>
                      <Text style={{ fontSize: '10px', color: '#999' }}>
                        {record.time}
                      </Text>
                    </div>
                  </div>
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<div style={{ fontSize: '12px' }}>⋯</div>}
                    style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoreAction && onMoreAction('view', record);
                    }}
                  />
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
            planData: planData
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
          setRightPanelNoteRecord(reportRecord);
          setRightPanelNoteContent(reportRecord.content);
          setRightPanelView('NOTE_EDITOR');
          
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
    </div>
  );
};

export default OperationPanel;