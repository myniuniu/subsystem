import React, { useState } from 'react';
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

// 可拖拽的工具卡片组件
const DraggableOperationCard = ({ card, index, onMove, onRemove, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'operation',
    item: { index, key: card.key },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'operation',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        onMove(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div 
      ref={(node) => drag(drop(node))}
      style={{ 
        position: 'relative',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move'
      }}
    >
      <Card 
        key={card.key}
        size="small" 
        hoverable
        onClick={onClick}
        style={{ 
          background: card.gradient,
          border: 'none',
          borderRadius: '12px',
          textAlign: 'center',
          cursor: 'move',
          transition: 'all 0.2s ease',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
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
      
      {/* 移除按钮 - 除了"添加工具"按钮外都显示 */}
      {card.key !== 'addTool' && (
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
  // 状态管理
  const [visibleCards, setVisibleCards] = useState(
    OPERATION_CARDS.filter(card => card.key !== 'addTool').slice(0, 8) // 默认显示前8个工具
  );
  const [showCardSelector, setShowCardSelector] = useState(false);
  
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
    if (cardToAdd && !visibleCards.some(card => card.key === cardKey) && visibleCards.length < 8) {
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
        <Title level={5} style={{ marginBottom: 16, color: '#1f1f1f' }}>
          🛠️ 操作面板
        </Title>
        
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
            />
          ))}

          {/* "更多"按钮 - 在第9个位置显示 */}
          {visibleCards.length < 8 && (
            <Dropdown
              open={showCardSelector}
              onOpenChange={setShowCardSelector}
              menu={{
                items: OPERATION_CARDS
                  .filter(card => card.key !== 'addTool' && !visibleCards.some(vc => vc.key === card.key))
                  .map(card => ({
                    key: card.key,
                    label: (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{card.icon}</span>
                        <span>{card.title}</span>
                      </div>
                    ),
                    onClick: () => handleAddCard(card.key)
                  }))
              }}
              trigger={['click']}
              placement="topLeft"
            >
              <Card 
                size="small" 
                hoverable
                style={{ 
                  background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)',
                  border: '2px dashed #1890ff',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>🛠️</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#1890ff' 
                  }}>更多</Text>
                </div>
              </Card>
            </Dropdown>
          )}
          
          {/* 空位显示 */}
          {Array.from({ length: Math.max(0, 9 - visibleCards.length - (visibleCards.length < 8 ? 1 : 0)) }, (_, index) => (
            <div 
              key={`empty-${index}`}
              style={{
                border: '2px dashed #d9d9d9',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: '12px',
                minHeight: '60px'
              }}
            >
              空位
            </div>
          ))}
          
          {/* 工具栏已满提示 */}
          {visibleCards.length >= 8 && (
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
              💼 工具栏已满（最多8个工具）
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