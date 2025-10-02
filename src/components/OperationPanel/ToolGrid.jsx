import React from 'react';
import { Card, Dropdown, Button, Typography } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableOperationCard from './DraggableOperationCard';
import { OPERATION_CARDS } from '../../constants/noteEditConstants';

const { Text } = Typography;

const ToolGrid = ({
  visibleCards,
  isEditMode,
  hasSourceData,
  sourceInfo,
  onCardClick,
  onMoveCard,
  onRemoveCard,
  onAddCard,
  getAvailableAITools = () => [],
  loadingCards = [], // 新增加载中的卡片列表
  hideEmptySlots = false
}) => {
  console.log('=== ToolGrid 渲染 ===');
  console.log('visibleCards 详细内容:', visibleCards);
      console.log('visibleCards 长度:', visibleCards?.length);
      
      // 检查AI工具卡片的位置
      visibleCards?.forEach((card, index) => {
        if (card.isAITool) {
          console.log(`AI工具卡片位置 ${index}:`, card.key, card.title);
        }
      });
  console.log('visibleCards 详细内容:', JSON.stringify(visibleCards, null, 2));
  console.log('isEditMode:', isEditMode);
  console.log('hasSourceData:', hasSourceData);
  console.log('========================');
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '6px', 
        marginBottom: 8 
      }}>
        {/* 渲染可见的工具 - 最多9个 */}
        {visibleCards.slice(0, 9).map((card, index) => {
          console.log(`渲染卡片 ${index}:`, card.key, card.title, card.isAITool ? '(AI工具)' : '(基础工具)');
          
          // 添加工具卡片不需要数据源限制
          const cardHasSourceData = card.key === 'addTool' ? true : hasSourceData;
          // 检查是否正在加载
          const isLoading = loadingCards.includes(card.key);
          
          return (
            <DraggableOperationCard
              key={card.key}
              card={card}
              index={index}
              onMove={onMoveCard}
              onRemove={onRemoveCard}
              onClick={() => onCardClick(card)}
              isEditMode={isEditMode}
              hasSourceData={cardHasSourceData}
              sourceInfo={sourceInfo}
              isLoading={isLoading}
            />
          );
        })}
        
        {/* 渲染空位的添加工具卡片（可隐藏） */}
        {!hideEmptySlots && visibleCards.length < 9 && [...Array(9 - visibleCards.length)].map((_, index) => {
          if (index === 0 && isEditMode) {
            // 第一个空位在编辑模式下显示"更多"按钮
            return (
              <Dropdown
                key={`empty-${index}`}
                menu={{
                  items: [
                    {
                      key: 'basic-tools',
                      type: 'group',
                      label: (
                        <div style={{
                          padding: '8px 4px 4px 4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#1890ff',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderBottom: '1px solid #f0f0f0',
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          ⚙️ 基础工具
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
                              padding: '8px 4px'
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
                                color: card.color
                              }}>
                                {card.icon}
                              </div>
                              <span style={{ fontWeight: 500 }}>{card.title}</span>
                            </div>
                          ),
                          onClick: () => onAddCard(card.key)
                        }))
                    },
                    {
                      key: 'ai-tools',
                      type: 'group',
                      label: (
                        <div style={{
                          padding: '8px 4px 4px 4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#722ed1',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderBottom: '1px solid #f0f0f0',
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          🤖 AI工具屋
                        </div>
                      ),
                      children: getAvailableAITools()
                    }
                  ]
                }}
                trigger={['click']}
                placement="topLeft"
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
                    height: '68px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  styles={{ body: { padding: '4px' } }}
                >
                  <div style={{ padding: '2px 0' }}>
                    <div style={{ fontSize: '16px', marginBottom: '2px' }}>➕</div>
                    <Text style={{ 
                      fontSize: '10px', 
                      fontWeight: 500, 
                      color: '#1890ff',
                      lineHeight: '1.2'
                    }}>更多</Text>
                  </div>
                </Card>
              </Dropdown>
            );
          } else if (index === 0 && !isEditMode) {
            // 非编辑模式下第一个空位显示空白占位符
            return (
              <Card 
                key={`empty-${index}`}
                size="small" 
                style={{ 
                  background: '#fafafa',
                  border: '1px dashed #d9d9d9',
                  borderRadius: '8px',
                  textAlign: 'center',
                  height: '68px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                styles={{ body: { padding: '4px' } }}
              >
                <div style={{ padding: '2px 0' }}>
                  <div style={{ fontSize: '16px', marginBottom: '2px', color: '#ccc' }}>◯</div>
                  <Text style={{ 
                    fontSize: '10px', 
                    color: '#ccc',
                    lineHeight: '1.2'
                  }}>空位</Text>
                </div>
              </Card>
            );
          } else {
            // 其他空位显示空白占位符
            return (
              <Card 
                key={`empty-${index}`}
                size="small" 
                style={{ 
                  background: '#fafafa',
                  border: '1px dashed #d9d9d9',
                  borderRadius: '8px',
                  textAlign: 'center',
                  height: '68px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                styles={{ body: { padding: '4px' } }}
              >
                <div style={{ padding: '2px 0' }}>
                  <div style={{ fontSize: '16px', marginBottom: '2px', color: '#ccc' }}>◯</div>
                  <Text style={{ 
                    fontSize: '10px', 
                    color: '#ccc',
                    lineHeight: '1.2'
                  }}>空位</Text>
                </div>
              </Card>
            );
          }
        })}

        {/* 在隐藏空位时，编辑模式下仍保留一个“更多”按钮 */}
        {hideEmptySlots && isEditMode && visibleCards.length < 9 && (
          <Dropdown
            key={`empty-more`}
            menu={{
              items: [
                {
                  key: 'basic-tools',
                  type: 'group',
                  label: (
                    <div style={{
                      padding: '8px 4px 4px 4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1890ff',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '1px solid #f0f0f0',
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      ⚙️ 基础工具
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
                          padding: '8px 4px'
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
                            color: card.color
                          }}>
                            {card.icon}
                          </div>
                          <span style={{ fontWeight: 500 }}>{card.title}</span>
                        </div>
                      ),
                      onClick: () => onAddCard(card.key)
                    }))
                },
                {
                  key: 'ai-tools',
                  type: 'group',
                  label: (
                    <div style={{
                      padding: '8px 4px 4px 4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#722ed1',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '1px solid #f0f0f0',
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      🤖 AI工具屋
                    </div>
                  ),
                  children: getAvailableAITools()
                }
              ]
            }}
            trigger={['click']}
            placement="topLeft"
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
                height: '68px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              styles={{ body: { padding: '4px' } }}
            >
              <div style={{ padding: '2px 0' }}>
                <div style={{ fontSize: '16px', marginBottom: '2px' }}>➕</div>
                <Text style={{ 
                  fontSize: '10px', 
                  fontWeight: 500, 
                  color: '#1890ff',
                  lineHeight: '1.2'
                }}>更多</Text>
              </div>
            </Card>
          </Dropdown>
        )}
      </div>
    </DndProvider>
  );
};

export default ToolGrid;