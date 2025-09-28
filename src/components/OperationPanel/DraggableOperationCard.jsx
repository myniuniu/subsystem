import React from 'react';
import { Card, Button, Tooltip, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDrag, useDrop } from 'react-dnd';

const { Text } = Typography;

const DraggableOperationCard = ({ 
  card, 
  index, 
  onMove, 
  onRemove, 
  onClick, 
  isEditMode, 
  hasSourceData, 
  sourceInfo,
  isLoading = false // 新增加载状态
}) => {
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

  // 渲染工具状态提示
  const renderStatusOverlay = () => {
    // 加载状态覆盖层
    if (isLoading) {
      return (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(24, 144, 255, 0.05)',
          borderRadius: '8px',
          zIndex: 10
        }}>
        </div>
      );
    }
    
    if (!hasSourceData && !isEditMode) {
      return (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '10px',
          textAlign: 'center',
          padding: '4px'
        }}>
          <div style={{ fontSize: '16px', marginBottom: '2px' }}>🚫</div>
          <div>需要数据源</div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* CSS 动画定义 */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes ripple {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }
          
          .loading-ripple {
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border: 2px solid #1890ff;
            border-radius: 12px;
            animation: ripple 1.5s infinite;
            pointer-events: none;
          }
        `}
      </style>
      
      <Tooltip 
        title={!hasSourceData && !isEditMode ? 
          `此工具需要数据源支持。当前状态：${sourceInfo?.details || '暂无数据源'}` : 
          hasSourceData ? `基于${sourceInfo?.total || 0}个数据源` : card.title
        }
        placement="top"
      >
        <div 
          ref={(node) => isEditMode ? drag(drop(node)) : node}
          style={{ 
            position: 'relative',
            opacity: isDragging ? 0.5 : (hasSourceData || isEditMode) ? 1 : 0.6,
            cursor: isLoading ? 'not-allowed' : (isEditMode ? 'move' : (hasSourceData ? 'pointer' : 'not-allowed'))
          }}
        >
          {/* 加载状态的光圈效果 */}
          {isLoading && (
            <div className="loading-ripple" />
          )}
          
          <Card 
            key={card.key}
            size="small" 
            hoverable={!isLoading && (hasSourceData || isEditMode)}
            onClick={!isEditMode && hasSourceData && !isLoading ? onClick : undefined}
            style={{ 
              background: hasSourceData || isEditMode ? card.gradient : '#f5f5f5',
              border: isEditMode ? '1px dashed #1890ff' : 'none',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: isLoading ? 'not-allowed' : (isEditMode ? 'move' : (hasSourceData ? 'pointer' : 'not-allowed')),
              transition: 'all 0.2s ease',
              height: '68px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isEditMode ? 0.8 : 1,
              filter: (!hasSourceData && !isEditMode) ? 'grayscale(100%)' : 'none',
              pointerEvents: isLoading ? 'none' : 'auto' // 加载时禁止点击
            }}
            styles={{ body: { padding: '4px' } }}
          >
            <div style={{ padding: '2px 0' }}>
              <div style={{ fontSize: '16px', marginBottom: '2px' }}>{card.icon}</div>
              <Text style={{ 
                fontSize: '10px', 
                fontWeight: 500, 
                color: hasSourceData || isEditMode ? card.color : '#999',
                lineHeight: '1.2'
              }}>{card.title}</Text>
            </div>
          </Card>
          
          {/* 状态覆盖层 */}
          {renderStatusOverlay()}
          
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
      </Tooltip>
    </>
  );
};

export default DraggableOperationCard;