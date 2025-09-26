import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  message,
  Card,
  Dropdown,
  Modal,
  Progress
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  OPERATION_CARDS, 
  REPORT_DROPDOWN_ITEMS,
  RIGHT_PANEL_VIEWS,
  MORE_MENU_ACTIONS,
  OPERATION_TYPES
} from '../constants/noteEditConstants';
import { getOperationIcon } from '../utils/noteEditUtils';

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
          border: isEditMode ? '2px dashed #1890ff' : 'none',
          borderRadius: '12px',
          textAlign: 'center',
          cursor: isEditMode ? 'move' : 'pointer',
          transition: 'all 0.2s ease',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isEditMode ? 0.8 : 1
        }}
      >
        <div style={{ padding: '6px 0' }}>
          <div style={{ fontSize: '20px', marginBottom: '6px' }}>{card.icon}</div>
          <Text style={{ 
            fontSize: '11px', 
            fontWeight: 500, 
            color: card.color 
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
            top: '-5px',
            right: '-5px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#ff4d4f',
            color: 'white',
            fontSize: '10px',
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
  // 状态管理 - 确保试题和试卷不在默认显示列表中
  const [visibleCards, setVisibleCards] = useState(() => {
    return OPERATION_CARDS.filter(card => 
      card.key !== 'addTool' && 
      card.key !== 'question' && 
      card.key !== 'exam-paper'
    );
  });
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // 新增编辑模式状态
  
  // 使用useEffect确保初始化正确
  useEffect(() => {
    const defaultCards = OPERATION_CARDS.filter(card => 
      card.key !== 'addTool' && 
      card.key !== 'question' && 
      card.key !== 'exam-paper'
    );
    setVisibleCards(defaultCards);
  }, []);
  
  const {
    operationRecords,
    setOperationRecords,
    rightPanelView,
    setRightPanelView,
    rightPanelEditingNote,
    setRightPanelEditingNote,
    rightPanelNoteContent,
    setRightPanelNoteContent,
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
    } else {
      onOperationClick(card.key);
    }
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
        key: MORE_MENU_ACTIONS.DELETE,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🗑️</span>
            <span>删除</span>
          </div>
        ),
        onClick: ({ domEvent }) => {
          domEvent?.stopPropagation();
          onMoreAction(MORE_MENU_ACTIONS.DELETE, record);
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
            onMoreAction(
              record.isStudyResult ? MORE_MENU_ACTIONS.UNMARK_STUDY_RESULT : MORE_MENU_ACTIONS.MARK_STUDY_RESULT, 
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
          key: MORE_MENU_ACTIONS.CONVERT_TO_SOURCE,
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📋</span>
              <span>转换为来源</span>
            </div>
          ),
          onClick: ({ domEvent }) => {
            domEvent?.stopPropagation();
            onMoreAction(MORE_MENU_ACTIONS.CONVERT_TO_SOURCE, record);
          }
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
            <span style={{ fontSize: '16px' }}>笔</span>
            <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>编辑主题</Text>
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

  return (
    <DndProvider backend={HTML5Backend}>
      {/* 上半部分 - 功能概览 */}
      <div style={{ padding: '20px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
            🛠️ 操作面板
          </Title>
          <Button
            type={isEditMode ? 'primary' : 'default'}
            size="small"
            icon={<EditOutlined />}
            onClick={() => setIsEditMode(!isEditMode)}
            style={{
              borderRadius: '6px',
              fontSize: '12px'
            }}
          >
            {isEditMode ? '完成编辑' : '编辑'}
          </Button>
        </div>
        
        {/* 编辑模式提示 */}
        {isEditMode && (
          <div style={{
            background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
            border: '1px solid #91d5ff',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '12px',
            fontSize: '12px',
            color: '#1890ff'
          }}>
            📝 编辑模式：可以拖拽排序、添加和移除工具
          </div>
        )}
        
        {/* 功能卡片网格 - 3x3网格，最多9个 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '8px', 
          marginBottom: 16 
        }}>
          {/* 渲染可见的工具 */}
          {visibleCards.slice(0, 8).map((card, index) => (
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

          {/* "更多"按钮 - 在第9个位置显示，只有在编辑模式下才显示 */}
          {isEditMode && (
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
                border: '2px dashed #1890ff',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
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
                top: '-10px',
                right: '-10px',
                width: '30px',
                height: '30px',
                background: 'linear-gradient(135deg, #1890ff20, #40a9ff20)',
                borderRadius: '50%',
                opacity: 0.6
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-5px',
                left: '-5px',
                width: '20px',
                height: '20px',
                background: 'linear-gradient(135deg, #1890ff15, #40a9ff15)',
                borderRadius: '50%',
                opacity: 0.4
              }} />
              
              <div style={{ padding: '8px 0', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  fontSize: '22px', 
                  marginBottom: '4px',
                  background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 1px 2px rgba(24, 144, 255, 0.3))'
                }}>
                  ⚡
                </div>
                <Text style={{ 
                  fontSize: '11px', 
                  fontWeight: 600, 
                  color: '#1890ff',
                  textShadow: '0 1px 2px rgba(24, 144, 255, 0.1)'
                }}>
                  更多工具
                </Text>
              </div>
            </Card>
          </Dropdown>
          )}
          
          {/* 空位显示 - 只在少于9个工具时显示 */}
          {/* 工具栏已满提示 */}
          {visibleCards.length >= 9 && (
            <div style={{
              textAlign: 'center',
              padding: '10px',
              color: '#999',
              fontSize: '12px',
              border: '1px dashed #d9d9d9',
              borderRadius: '12px',
              background: '#fafafa',
              gridColumn: 'span 3'
            }}>
              💼 工具栏已满（最多9个工具）
            </div>
          )}
        </div>
      </div>
      
      {/* 下半部分 - 操作记录 */}
      <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px' }}>
          {Object.values(operationRecords).flat().map(record => (
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
              onClick={() => onRecordClick(record)}
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
                  {record.isAIGenerated ? '🤖' : getOperationIcon(record.type)}
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
                  
                  {/* AI创建场景进度显示 */}
                  {record.status === 'creating' && record.progress !== undefined && (
                    <div style={{ marginBottom: '4px' }}>
                      <Progress 
                        percent={record.progress} 
                        size="small" 
                        status="active"
                        strokeColor={{
                          '0%': '#667eea',
                          '100%': '#764ba2',
                        }}
                        showInfo={false}
                        style={{ marginBottom: '2px' }}
                      />
                      <Text style={{ fontSize: '10px', color: '#667eea', fontWeight: 500 }}>
                        AI正在生成场景... {record.progress}%
                      </Text>
                    </div>
                  )}
                  
                  {/* 完成状态显示 */}
                  {record.status === 'completed' && record.isAIGenerated && (
                    <div style={{ marginBottom: '4px' }}>
                      <Text style={{ fontSize: '10px', color: '#52c41a', fontWeight: 500 }}>
                        🎉 AI场景生成完成
                      </Text>
                    </div>
                  )}
                  
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
                      onRecordClick(record);
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
                    icon={<div style={{ fontSize: '12px' }}>⋯</div>}
                    style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              </div>
            </Card>
          ))}
          
          {Object.values(operationRecords).flat().length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
              暂无操作记录
            </div>
          )}
        </div>
        
        {/* 新建笔记按钮 - 固定在底部 */}
        <div style={{ 
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
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
    </DndProvider>
  );
};

export default OperationPanel;