import React, { useState, useMemo } from 'react';
import { Card, Button, Tooltip, Typography, Modal, Form, Switch, Select, InputNumber, Input, Tag } from 'antd';
import { DeleteOutlined, SettingOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useDrag, useDrop } from 'react-dnd';
import { generateKnowledgeNodes } from '../../data/knowledgeGraphData';
import { generateCapabilityNodes } from '../../data/capabilityMapData';
import './TrainingPlanConfig.css';

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
  isLoading = false, // 新增加载状态
  disabled = false,
  disabledReason = ''
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
    participantSelection: [], // 培训人员圈选
    systemTrainingType: null, // 体系化培训类型
    systemTrainingRef: null, // 选中的数据项 ID
    systemTrainingRefLabel: null // 选中的数据项名称
  });
  
  // 卡片悬浮状态
  const [isHovered, setIsHovered] = useState(false);

  // 体系化培训选项
  const systemTypeOptions = [
    { value: 'knowledge_graph', label: '知识图谱' },
    { value: 'capability_model', label: '能力模型' },
    { value: 'micro_major', label: '微专业' }
  ];
  const knowledgeNodeOptions = useMemo(() => generateKnowledgeNodes().map(n => ({ value: n.id, label: n.name })), []);
  const capabilityNodeOptions = useMemo(() => generateCapabilityNodes().map(n => ({ value: n.id, label: n.name })), []);
  const microMajorOptions = useMemo(() => ([
    { value: 'data-science', label: '数据科学微专业' },
    { value: 'uiux-design', label: 'UI/UX设计微专业' },
    { value: 'cloud-computing', label: '云计算微专业' }
  ]), []);
  const configFormFields = useMemo(() => {
    if (card.key === 'e-pbl-planning') {
      return (
        <>
          <Form.Item label="知识空间">
            <Select
              value={config.designSpace || 'current'}
              onChange={(value) => setConfig({ ...config, designSpace: value })}
              style={{ width: '100%' }}
            >
              <Select.Option value="current">当前知识空间</Select.Option>
              <Select.Option value="my">我的知识空间</Select.Option>
              <Select.Option value="org">组织知识空间</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="教学设计模版">
            <Select
              value={config.designTemplateId || null}
              onChange={(val, opt) => setConfig({ ...config, designTemplateId: val, designTemplateLabel: opt?.label || opt?.children || null })}
              placeholder="请选择教学设计模版"
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="children"
            >
              <Select.Option value="epbl-basic">EPBL 基础教学设计模版</Select.Option>
              <Select.Option value="epbl-science">理科项目式教学设计模版</Select.Option>
              <Select.Option value="epbl-arts">文科项目式教学设计模版</Select.Option>
              <Select.Option value="epbl-custom">自定义教学设计模版</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="学科">
            <Select
              value={config.subject || null}
              onChange={(value) => setConfig({ ...config, subject: value })}
              style={{ width: '100%' }}
            >
              <Select.Option value="语文">语文</Select.Option>
              <Select.Option value="数学">数学</Select.Option>
              <Select.Option value="英语">英语</Select.Option>
              <Select.Option value="物理">物理</Select.Option>
              <Select.Option value="化学">化学</Select.Option>
              <Select.Option value="生物">生物</Select.Option>
              <Select.Option value="历史">历史</Select.Option>
              <Select.Option value="地理">地理</Select.Option>
              <Select.Option value="政治">政治</Select.Option>
              <Select.Option value="信息技术">信息技术</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="学段">
            <Select
              value={config.phase || null}
              onChange={(value) => setConfig({ ...config, phase: value })}
              style={{ width: '100%' }}
            >
              <Select.Option value="小学">小学</Select.Option>
              <Select.Option value="初中">初中</Select.Option>
              <Select.Option value="高中">高中</Select.Option>
              <Select.Option value="大学">大学</Select.Option>
            </Select>
          </Form.Item>
        </>
      );
    } else if (card.key === 'learning-plan') {
      return (
        <>
          <Form.Item label="每日学习时长">
            <InputNumber
              value={config.dailyStudyMinutes || 60}
              onChange={(value) => setConfig({ ...config, dailyStudyMinutes: value })}
              min={10}
              max={240}
              style={{ width: '100%' }}
              addonAfter="分钟"
            />
          </Form.Item>
          <Form.Item label="偏好学习时段">
            <Select
              mode="multiple"
              value={config.preferredTimeSlots || []}
              onChange={(value) => setConfig({ ...config, preferredTimeSlots: value })}
              placeholder="请选择偏好时段"
              style={{ width: '100%' }}
              maxTagCount="responsive"
            >
              <Select.Option value="早晨">早晨</Select.Option>
              <Select.Option value="下午">下午</Select.Option>
              <Select.Option value="晚上">晚上</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="学习风格">
            <Select
              value={config.learningStyle || null}
              onChange={(value) => setConfig({ ...config, learningStyle: value })}
              style={{ width: '100%' }}
            >
              <Select.Option value="视频">视频</Select.Option>
              <Select.Option value="阅读">阅读</Select.Option>
              <Select.Option value="实践">实践</Select.Option>
              <Select.Option value="讨论">讨论</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="休息间隔">
            <InputNumber
              value={config.breakInterval || 25}
              onChange={(value) => setConfig({ ...config, breakInterval: value })}
              min={5}
              max={60}
              style={{ width: '100%' }}
              addonAfter="分钟"
            />
          </Form.Item>
          <Form.Item label="周末学习">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text type="secondary">开启周末学习安排</Text>
              <Switch
                checked={config.weekendStudy || false}
                onChange={(checked) => setConfig({ ...config, weekendStudy: checked })}
              />
            </div>
          </Form.Item>
        </>
      );
    }
    return (
      <>
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
        <Form.Item label="考核评价">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text type="secondary">启用阶段性考核与评价</Text>
            <Switch 
              checked={config.assessmentEnabled}
              onChange={(checked) => setConfig({...config, assessmentEnabled: checked})}
            />
          </div>
        </Form.Item>
        <Form.Item label="证书" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text type="secondary">完成培训后颁发电子证书</Text>
            <Switch 
              checked={config.certificateEnabled}
              onChange={(checked) => setConfig({...config, certificateEnabled: checked})}
            />
          </div>
        </Form.Item>
        <Form.Item 
          label={
            <Tooltip title="绑定知识图谱/能力模型/微专业，用于方案的体系化配置" placement="top">
              <span>体系化培训 <QuestionCircleOutlined style={{ color: '#8c8c8c', fontSize: '12px' }} /></span>
            </Tooltip>
          }
          style={{ gridColumn: '1 / -1' }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <Select
              value={config.systemTrainingType}
              onChange={(val) => setConfig({ ...config, systemTrainingType: val, systemTrainingRef: null, systemTrainingRefLabel: null })}
              placeholder="选择体系类型"
              style={{ width: 220 }}
              options={systemTypeOptions}
            />
            <Select
              value={config.systemTrainingRef}
              onChange={(val, opt) => setConfig({ ...config, systemTrainingRef: val, systemTrainingRefLabel: opt?.label || opt?.children || null })}
              placeholder="选择数据项"
              style={{ flex: 1 }}
              disabled={!config.systemTrainingType}
              options={(function(){
                if (config.systemTrainingType === 'knowledge_graph') return knowledgeNodeOptions;
                if (config.systemTrainingType === 'capability_model') return capabilityNodeOptions;
                if (config.systemTrainingType === 'micro_major') return microMajorOptions;
                return [];
              })()}
              showSearch
              optionFilterProp="children"
              dropdownClassName="two-col-select-dropdown"
              dropdownMatchSelectWidth
            />
          </div>
        </Form.Item>
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
            <Tooltip title="在人员标注模块维护" placement="top">
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
      </>
    );
  }, [card.key, config, knowledgeNodeOptions, capabilityNodeOptions, microMajorOptions, systemTypeOptions]);
  
  // 处理需要确认/配置的卡片点击（培训方案、培训报表、E-PBL教学设计）
  const handleCardClickWithConfirm = () => {
    if (card.key === 'training-plan' || card.key === 'training-dashboard' || card.key === 'e-pbl-planning') {
      Modal.confirm({
        title: card.key === 'training-dashboard' ? '培训报表生成确认' : (card.key === 'e-pbl-planning' ? 'E-PBL教学设计配置确认' : '培训方案配置确认'),
        content: card.key === 'training-dashboard' ? '是否已完成报表生成参数配置？' : (card.key === 'e-pbl-planning' ? '是否已完成教学设计配置？' : '是否已完成培训方案配置？'),
        okText: '已配置，继续',
        cancelText: '去配置',
        icon: <SettingOutlined style={{ color: '#1890ff' }} />,
        onOk: () => {
          if (onClick) onClick();
        },
        onCancel: () => {
          setIsConfigModalVisible(true);
        }
      });
      return;
    }
    // 其他工具直接执行 onClick
    if (onClick) onClick();
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
    // 受限状态覆盖层
    if (disabled && !isEditMode) {
      return (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '10px',
          textAlign: 'center',
          padding: '4px'
        }}>
          <div style={{ fontSize: '16px', marginBottom: '2px' }}>🔒</div>
          <div>{disabledReason || '当前不可用'}</div>
        </div>
      );
    }
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
        title={disabled ? (disabledReason || '当前不可用') : (!hasSourceData && !isEditMode ? 
          `此工具需要数据源支持。当前状态：${sourceInfo?.details || '暂无数据源'}` : 
          hasSourceData ? `基于${sourceInfo?.total || 0}个数据源` : card.title)
        }
        placement="top"
      >
        <div 
          ref={(node) => isEditMode ? drag(drop(node)) : node}
          style={{ 
            position: 'relative',
            opacity: isDragging ? 0.5 : (disabled ? 0.55 : ((hasSourceData || isEditMode) ? 1 : 0.6)),
            cursor: (isLoading || disabled) ? 'not-allowed' : (isEditMode ? 'move' : (hasSourceData ? 'pointer' : 'not-allowed'))
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
            hoverable={!isLoading && !disabled && (hasSourceData || isEditMode)}
            onClick={!isEditMode && hasSourceData && !isLoading && !disabled ? handleCardClickWithConfirm : undefined}
            style={{ 
              background: disabled ? '#f5f5f5' : (hasSourceData || isEditMode ? card.gradient : '#f5f5f5'),
              border: isEditMode ? '1px dashed #1890ff' : 'none',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: (isLoading || disabled) ? 'not-allowed' : (isEditMode ? 'move' : (hasSourceData ? 'pointer' : 'not-allowed')),
              transition: 'all 0.2s ease',
              height: '68px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isEditMode ? 0.8 : 1,
              filter: (disabled || (!hasSourceData && !isEditMode)) ? 'grayscale(100%)' : 'none',
              pointerEvents: (isLoading || disabled) ? 'none' : 'auto' // 加载或受限时禁止点击
            }}
            styles={{ body: { padding: '4px' } }}
          >
            <div style={{ padding: '2px 0' }}>
              <div style={{ fontSize: '16px', marginBottom: '2px' }}>{card.icon}</div>
              <Text style={{ 
                fontSize: '10px', 
                fontWeight: 500, 
                color: (disabled ? '#999' : (hasSourceData || isEditMode ? card.color : '#999')),
                lineHeight: '1.2'
              }}>{card.title}</Text>
            </div>
          </Card>
          
          {/* 状态覆盖层 */}
          {renderStatusOverlay()}
          
          {/* 培训方案/培训报表/E-PBL教学设计/学习计划 配置按钮 - 一直显示，透明背景 */}
          {(card.key === 'training-plan' || card.key === 'training-dashboard' || card.key === 'e-pbl-planning' || card.key === 'learning-plan') && !isEditMode && hasSourceData && (
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
      
      {/* 培训方案/培训报表/E-PBL教学设计/学习计划 配置窗口 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SettingOutlined style={{ color: '#1890ff' }} />
            <span>{card.key === 'training-dashboard' ? '培训报表配置' : (card.key === 'e-pbl-planning' ? 'E-PBL教学设计配置' : (card.key === 'learning-plan' ? '学习计划配置' : '培训方案配置'))}</span>
          </div>
        }
        open={isConfigModalVisible}
        onOk={() => {
          // 验证字数限制
          if (config.description && config.description.length > 2000) {
            Modal.warning({
              title: '字数超出限制',
              content: `${card.key === 'training-dashboard' ? '报表补充说明' : (card.key === 'learning-plan' ? '学习计划补充说明' : '方案补充说明')}不能超过2000字，当前${config.description.length}字`,
            });
            return;
          }
          // 保存配置逻辑
          const key = card.key === 'training-dashboard' ? 'training_dashboard_config' : (card.key === 'e-pbl-planning' ? 'epbl_planning_config' : (card.key === 'learning-plan' ? 'learning_plan_config' : 'training_plan_config'));
          localStorage.setItem(key, JSON.stringify(config));
          if (card.key === 'learning-plan') {
            if (onClick) onClick();
          }
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
            {configFormFields}
          </div>
          
          <Form.Item 
            label={card.key === 'e-pbl-planning' ? '方案补充说明' : (card.key === 'learning-plan' ? '学习计划补充说明' : '方案补充说明')}
            help={
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {card.key === 'e-pbl-planning' ? '补充教学设计的要点、注意事项等信息' : (card.key === 'learning-plan' ? '补充学习要求与偏好，用于生成更贴合的计划' : '详细描述培训方案的背景、目标、适用对象等信息')}
              </Text>
            }
          >
            <Input.TextArea
              value={config.description}
              onChange={(e) => setConfig({...config, description: e.target.value})}
              placeholder={card.key === 'e-pbl-planning' ? '请输入教学设计补充说明（选填，2000字以内）' : (card.key === 'learning-plan' ? '请输入学习计划补充说明（选填，2000字以内）' : '请输入培训方案的补充说明，如培训背景、目标、适用对象、预期效果等（选填，2000字以内）')}
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
