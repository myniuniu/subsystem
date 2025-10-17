import React, { useState } from 'react';
import { Card, Button, Tooltip, Typography, Modal, Form, Switch, Select, InputNumber, Input, Tag } from 'antd';
import { DeleteOutlined, SettingOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
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
  // 培训方案配置窗口状态
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [config, setConfig] = useState({
    difficulty: 'medium',
    duration: 12,
    moduleCount: 12,
    assessmentEnabled: true,
    certificateEnabled: false,
    description: '', // 方案补充说明
    trainingFormats: [], // 培训形式（多选）
    courseSelection: [], // 课程圈选
    participantSelection: [] // 培训人员圈选
  });
  
  // 卡片悬浮状态
  const [isHovered, setIsHovered] = useState(false);
  
  // 处理培训方案卡片点击
  const handleTrainingPlanClick = () => {
    if (card.key === 'training-plan') {
      Modal.confirm({
        title: '培训方案配置确认',
        content: '是否已完成培训方案配置？',
        okText: '已配置，继续',
        cancelText: '去配置',
        icon: <SettingOutlined style={{ color: '#1890ff' }} />,
        onOk: () => {
          // 用户确认已配置，执行原有的 onClick 逻辑
          if (onClick) {
            onClick();
          }
        },
        onCancel: () => {
          // 用户选择去配置，打开配置窗口
          setIsConfigModalVisible(true);
        }
      });
    } else {
      // 其他工具直接执行 onClick
      if (onClick) {
        onClick();
      }
    }
  };
  
  // 所有工具在加载时都显示光圈效果
  const showLoadingRipple = isLoading;
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
            50% {
              transform: scale(1.2);
              opacity: 0.7;
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
            animation: ripple 3s ease-out;
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 加载状态的光圈效果 */}
          {showLoadingRipple && (
            <div className="loading-ripple" />
          )}
          
          <Card 
            key={card.key}
            size="small" 
            hoverable={!isLoading && (hasSourceData || isEditMode)}
            onClick={!isEditMode && hasSourceData && !isLoading ? handleTrainingPlanClick : undefined}
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
          
          {/* 培训方案配置按钮 - 一直显示，透明背景 */}
          {card.key === 'training-plan' && !isEditMode && hasSourceData && (
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setIsConfigModalVisible(true);
              }}
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: '#1890ff',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                minWidth: 'auto',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(24, 144, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          )}
          
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
      
      {/* 培训方案配置窗口 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SettingOutlined style={{ color: '#1890ff' }} />
            <span>培训方案配置</span>
          </div>
        }
        open={isConfigModalVisible}
        onOk={() => {
          // 验证字数限制
          if (config.description && config.description.length > 2000) {
            Modal.warning({
              title: '字数超出限制',
              content: `方案补充说明不能超过2000字，当前${config.description.length}字`,
            });
            return;
          }
          // 保存配置逻辑
          localStorage.setItem('training_plan_config', JSON.stringify(config));
          setIsConfigModalVisible(false);
        }}
        onCancel={() => setIsConfigModalVisible(false)}
        width={700}
        okText="保存配置"
        cancelText="取消"
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <Form layout="vertical" style={{ marginTop: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          {/* 第一行：培训难度 + 培训周期 */}
          <Form.Item label="培训难度">
            <Select 
              value={config.difficulty}
              onChange={(value) => setConfig({...config, difficulty: value})}
              style={{ width: '100%' }}
            >
              <Select.Option value="easy">初级 - 适合新手入门</Select.Option>
              <Select.Option value="medium">中级 - 有一定基础</Select.Option>
              <Select.Option value="hard">高级 - 深度专业培训</Select.Option>
            </Select>
          </Form.Item>
          
          {/* 第一行右侧：培训周期 */}
          <Form.Item label="培训周期（周）">
            <InputNumber 
              value={config.duration}
              onChange={(value) => setConfig({...config, duration: value})}
              min={1}
              max={52}
              style={{ width: '100%' }}
              addonAfter="周"
            />
          </Form.Item>
          
          {/* 第二行：模块数量 + 考核评价 */}
          <Form.Item label="模块数量">
            <InputNumber 
              value={config.moduleCount}
              onChange={(value) => setConfig({...config, moduleCount: value})}
              min={1}
              max={50}
              style={{ width: '100%' }}
              addonAfter="个模块"
            />
          </Form.Item>
          
          {/* 第二行右侧：考核评价 */}
          <Form.Item label="考核评价">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text type="secondary">启用阶段性考核与评价</Text>
              <Switch 
                checked={config.assessmentEnabled}
                onChange={(checked) => setConfig({...config, assessmentEnabled: checked})}
              />
            </div>
          </Form.Item>
          
          {/* 第三行：结业证书 + 培训形式（跨两列放到下方） */}
          <Form.Item label="结业证书" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text type="secondary">完成培训后颁发电子证书</Text>
              <Switch 
                checked={config.certificateEnabled}
                onChange={(checked) => setConfig({...config, certificateEnabled: checked})}
              />
            </div>
          </Form.Item>
          
          {/* 第四行：课程圈选 + 培训人员圈选 */}
          <Form.Item 
            label={
              <Tooltip title="在资源标注模块维护" placement="top">
                <span>课程圈选 <QuestionCircleOutlined style={{ color: '#8c8c8c', fontSize: '12px' }} /></span>
              </Tooltip>
            }
          >
            <Select
              mode="tags"
              value={config.courseSelection}
              onChange={(value) => setConfig({...config, courseSelection: value})}
              placeholder="输入课程标签名称，按回车添加"
              style={{ width: '100%' }}
              maxTagCount="responsive"
              tokenSeparators={[',', '，']}
              suffixIcon={<PlusOutlined style={{ color: '#1890ff' }} />}
            />
          </Form.Item>
          
          <Form.Item 
            label={
              <Tooltip title="在学员标注模块维护" placement="top">
                <span>培训人员圈选 <QuestionCircleOutlined style={{ color: '#8c8c8c', fontSize: '12px' }} /></span>
              </Tooltip>
            }
          >
            <Select
              mode="tags"
              value={config.participantSelection}
              onChange={(value) => setConfig({...config, participantSelection: value})}
              placeholder="输入人员标签名称，按回车添加"
              style={{ width: '100%' }}
              maxTagCount="responsive"
              tokenSeparators={[',', '，']}
              suffixIcon={<PlusOutlined style={{ color: '#1890ff' }} />}
            />
          </Form.Item>
          
          {/* 培训形式：单独占一行（跨两列） */}
          <Form.Item label="培训形式" style={{ gridColumn: '1 / -1' }}>
            <Select
              mode="multiple"
              value={config.trainingFormats}
              onChange={(value) => setConfig({...config, trainingFormats: value})}
              placeholder="请选择培训形式（可多选）"
              style={{ width: '100%' }}
              maxTagCount="responsive"
            >
              <Select.Option value="live">📹 线上直播课程</Select.Option>
              <Select.Option value="video">🎥 录播视频</Select.Option>
              <Select.Option value="seminar">💬 在线研讨</Select.Option>
              <Select.Option value="practice">✍️ 实践作业</Select.Option>
              <Select.Option value="workshop">👥 工作坊</Select.Option>
              <Select.Option value="case">📊 案例分析</Select.Option>
              <Select.Option value="reading">📚 文献阅读</Select.Option>
              <Select.Option value="offline">🏫 线下培训</Select.Option>
            </Select>
          </Form.Item>
          
          </div>
          
          {/* 方案补充说明:独立在外,不受两列布局影响 */}
          <Form.Item 
            label="方案补充说明"
            help={
              <Text type="secondary" style={{ fontSize: '12px' }}>
                详细描述培训方案的背景、目标、适用对象等信息
              </Text>
            }
          >
            <Input.TextArea
              value={config.description}
              onChange={(e) => setConfig({...config, description: e.target.value})}
              placeholder="请输入培训方案的补充说明，如培训背景、目标、适用对象、预期效果等（选填，2000字以内）"
              autoSize={{ minRows: 4, maxRows: 8 }}
              maxLength={2000}
              showCount
              style={{
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DraggableOperationCard;