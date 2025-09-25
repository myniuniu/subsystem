import React from 'react';
import {
  Button,
  Typography,
  message,
  Card,
  Dropdown,
  Modal
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { 
  OPERATION_CARDS, 
  REPORT_DROPDOWN_ITEMS,
  RIGHT_PANEL_VIEWS,
  MORE_MENU_ACTIONS,
  OPERATION_TYPES
} from '../constants/noteEditConstants';
import { getOperationIcon } from '../utils/noteEditUtils';

const { Title, Text } = Typography;

const OperationPanel = ({ state, handlers }) => {
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
    <>
      {/* 上半部分 - 功能概览 */}
      <div style={{ padding: '20px', flex: 1 }}>
        <Title level={5} style={{ marginBottom: 16, color: '#1f1f1f' }}>
          🛠️ 操作面板
        </Title>
        
        {/* 功能卡片网格 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: 16 }}>
          {OPERATION_CARDS.map(card => {
            if (card.key === 'addTool') {
              return (
                <Card 
                  key={card.key}
                  size="small" 
                  hoverable
                  onClick={onAddTool}
                  style={{ 
                    background: card.gradient,
                    border: 'none',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
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
              );
            }

            if (card.key === OPERATION_TYPES.REPORT) {
              return (
                <Dropdown
                  key={card.key}
                  menu={{
                    items: REPORT_DROPDOWN_ITEMS.map(item => ({
                      key: item.key,
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                      ),
                      onClick: () => message.info(`${item.label}功能开发中`)
                    }))
                  }}
                  trigger={['hover']}
                  placement="bottomLeft"
                  overlayClassName="report-dropdown"
                >
                  <Card 
                    size="small" 
                    hoverable
                    onClick={() => onOperationClick(card.key)}
                    style={{ 
                      background: card.gradient,
                      border: 'none',
                      borderRadius: '12px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
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
                </Dropdown>
              );
            }

            return (
              <Card 
                key={card.key}
                size="small" 
                hoverable
                onClick={() => {
                  if (card.key === OPERATION_TYPES.SCENARIO) {
                    onScenarioClick();
                  } else {
                    onOperationClick(card.key);
                  }
                }}
                style={{ 
                  background: card.gradient,
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
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
            );
          })}
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
                  {getOperationIcon(record.type)}
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
    </>
  );
};

export default OperationPanel;