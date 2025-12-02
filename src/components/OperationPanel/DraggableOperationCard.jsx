import React, { useState, useMemo, useRef } from 'react';
import { Card, Button, Tooltip, Typography, Modal, Form, Switch, Select, InputNumber, Input, Segmented } from 'antd';
import { DeleteOutlined, SettingOutlined, PlusOutlined, QuestionCircleOutlined, FileTextOutlined, EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
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
  const [reportSuggestions, setReportSuggestions] = useState(null);
  const reportTimerRef = useRef(null);
  const [reportEditItem, setReportEditItem] = useState(null);
  const [reportDescription, setReportDescription] = useState('');
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
    } else if (card.key === 'memory-cards') {
      return (
        <>
          <Form.Item label="卡片数量">
            <Segmented
              value={config.cardsAmount || 'standard'}
              onChange={(val) => setConfig({ ...config, cardsAmount: val })}
              options={[
                { label: '较少', value: 'few' },
                { label: '标准（默认）', value: 'standard' },
                { label: '更多的', value: 'more' }
              ]}
            />
          </Form.Item>
          <Form.Item label="难度等级">
            <Segmented
              value={config.cardsDifficulty || 'medium'}
              onChange={(val) => setConfig({ ...config, cardsDifficulty: val })}
              options={[
                { label: '简单的', value: 'easy' },
                { label: '中等（默认）', value: 'medium' },
                { label: '难的', value: 'hard' }
              ]}
            />
          </Form.Item>
        </>
      );
    } else if (card.key === 'quiz') {
      return (
        <>
          <Form.Item label="问题数量">
            <Segmented
              value={config.quizAmount || 'standard'}
              onChange={(val) => setConfig({ ...config, quizAmount: val })}
              options={[
                { label: '较少', value: 'few' },
                { label: '标准（默认）', value: 'standard' },
                { label: '更多的', value: 'more' }
              ]}
            />
          </Form.Item>
          <Form.Item label="难度等级">
            <Segmented
              value={config.quizDifficulty || 'medium'}
              onChange={(val) => setConfig({ ...config, quizDifficulty: val })}
              options={[
                { label: '简单的', value: 'easy' },
                { label: '中等（默认）', value: 'medium' },
                { label: '难的', value: 'hard' }
              ]}
            />
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
    if (card.key === 'report') {
      setIsConfigModalVisible(true);
      setReportSuggestions(null);
      if (reportTimerRef.current) clearTimeout(reportTimerRef.current);
      reportTimerRef.current = setTimeout(() => {
        setReportSuggestions([
          { t: '培训概览报告', d: '汇总“新教师教学方法培训”的核心目标、实施进度与关键结论。' },
          { t: '执行简报', d: '以要点形式呈现培训成效、问题清单、下一步行动建议。' },
          { t: '学习指南摘要', d: '面向新教师的学习要点、推荐练习与课堂应用清单。' },
          { t: '博客文章草稿', d: '将培训洞见整理为通俗易懂的文章，便于传播。' }
        ]);
        setReportEditItem(null);
      }, 2000);
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

          @keyframes skeletonShimmer {
            0% { transform: translateX(0%); }
            100% { transform: translateX(160%); }
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
          
          {/* 培训方案/培训报表/E-PBL教学设计/学习计划/记忆卡片/测验 配置按钮 - 一直显示，透明背景（报告不显示配置按钮） */}
          {(card.key === 'training-plan' || card.key === 'training-dashboard' || card.key === 'e-pbl-planning' || card.key === 'learning-plan' || card.key === 'memory-cards' || card.key === 'quiz') && !isEditMode && hasSourceData && (
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setIsConfigModalVisible(true);
                if (card.key === 'report') {
                  setReportSuggestions(null);
                  if (reportTimerRef.current) clearTimeout(reportTimerRef.current);
                  reportTimerRef.current = setTimeout(() => {
                    setReportSuggestions([
                      { t: '培训概览报告', d: '汇总“新教师教学方法培训”的核心目标、实施进度与关键结论。' },
                      { t: '执行简报', d: '以要点形式呈现培训成效、问题清单、下一步行动建议。' },
                      { t: '学习指南摘要', d: '面向新教师的学习要点、推荐练习与课堂应用清单。' },
                      { t: '博客文章草稿', d: '将培训洞见整理为通俗易懂的文章，便于传播。' }
                    ]);
                  }, 2000);
                }
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
      
      {/* 培训方案/培训报表/E-PBL教学设计/学习计划/记忆卡片/测验/报告 配置窗口 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {card.key === 'report' ? (
              <>
                {reportEditItem && (
                  <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setReportEditItem(null)} />
                )}
                <FileTextOutlined style={{ color: '#b08800' }} />
                <span>创建报告</span>
              </>
            ) : (
              <>
                <SettingOutlined style={{ color: '#1890ff' }} />
                <span>{card.key === 'training-dashboard' ? '培训报表配置' : (card.key === 'e-pbl-planning' ? 'E-PBL教学设计配置' : (card.key === 'learning-plan' ? '学习计划配置' : (card.key === 'memory-cards' ? '自定义记忆卡' : (card.key === 'quiz' ? '自定义测验' : '培训方案配置'))))}</span>
              </>
            )}
          </div>
        }
        open={isConfigModalVisible}
        onOk={() => {
          if (card.key === 'report') {
            setIsConfigModalVisible(false);
            return;
          }
          if (card.key === 'memory-cards') {
            localStorage.setItem('memory_cards_config', JSON.stringify(config));
            if (onClick) onClick();
            setIsConfigModalVisible(false);
            return;
          }
          if (card.key === 'quiz') {
            localStorage.setItem('quiz_config', JSON.stringify(config));
            if (onClick) onClick();
            setIsConfigModalVisible(false);
            return;
          }
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
        onCancel={() => {
          setIsConfigModalVisible(false);
          if (reportTimerRef.current) clearTimeout(reportTimerRef.current);
          setReportEditItem(null);
        }}
        width={760}
        okText={'保存配置'}
        cancelText="取消"
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        footer={(card.key === 'memory-cards' || card.key === 'quiz' || card.key === 'report') ? null : undefined}
      >
        {card.key !== 'report' && (
          <>
            <Form layout="vertical" style={{ marginTop: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                {configFormFields}
              </div>
              
              <Form.Item 
                label={card.key === 'e-pbl-planning' ? '方案补充说明' : (card.key === 'learning-plan' ? '学习计划补充说明' : ((card.key === 'memory-cards' || card.key === 'quiz') ? '主题应该是什么？' : '方案补充说明'))}
                help={
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {card.key === 'e-pbl-planning' ? '补充教学设计的要点、注意事项等信息' : (card.key === 'learning-plan' ? '补充学习要求与偏好，用于生成更贴合的计划' : ((card.key === 'memory-cards' || card.key === 'quiz') ? '建议将主题聚焦且来源明确，内容精炼，便于生成' : '详细描述培训方案的背景、目标、适用对象等信息'))}
                  </Text>
                }
              >
                <Input.TextArea
                  value={config.description}
                  onChange={(e) => setConfig({...config, description: e.target.value})}
                  placeholder={card.key === 'e-pbl-planning' ? '请输入教学设计补充说明（选填，2000字以内）' : (card.key === 'learning-plan' ? '请输入学习计划补充说明（选填，2000字以内）' : ((card.key === 'memory-cards' || card.key === 'quiz') ? '输入主题或参考提示，如“牛顿第二定律”' : '请输入培训方案的补充说明，如培训背景、目标、适用对象、预期效果等（选填，2000字以内）'))}
                  autoSize={{ minRows: 4, maxRows: 8 }}
                  maxLength={2000}
                  showCount
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                />
              </Form.Item>
              {(card.key === 'memory-cards' || card.key === 'quiz') && (
                <div style={{ border: '1px solid #bae7ff', borderRadius: 8, padding: 12, background: '#e6f7ff', color: '#1d39c4' }}>
                  可以尝试以下方法：• 测验内容必须限定于特定来源（例如“关于意大利的文章”）。• 测验应关注关键概念以便评估掌握。• 可提供主题提示，如“牛顿第二定律”，便于精准生成。
                </div>
              )}
            </Form>
            {(card.key === 'memory-cards' || card.key === 'quiz') && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <Button onClick={() => setIsConfigModalVisible(false)} style={{ marginRight: 8 }}>取消</Button>
                <Button type="primary" onClick={() => {
                  if (card.key === 'memory-cards') {
                    localStorage.setItem('memory_cards_config', JSON.stringify(config));
                  } else if (card.key === 'quiz') {
                    localStorage.setItem('quiz_config', JSON.stringify(config));
                  }
                  if (onClick) onClick();
                  setIsConfigModalVisible(false);
                }}>确定</Button>
              </div>
            )}
          </>
        )}
        {card.key === 'report' && !reportEditItem && (
          <div style={{ padding: '4px 0 16px 0' }}>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>格式</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { t: '创建你自己的', d: '通过指定结构、风格、语气等，打造您专属的报道风格。' },
                { t: '简报文件', d: '信息来源概览，重点介绍关键见解和引语。' },
                { t: '学习指南', d: '简答题测验、建议的作文题和关键词术语表' },
                { t: '博客文章', d: '这篇文章将富有洞见的观点提炼成一篇通俗易懂的文章。' }
              ].map((item, idx) => (
                <div
                  key={`fmt-${idx}`}
                  style={{ background: '#f2efdf', borderRadius: 16, padding: '14px 14px', minHeight: 104, position: 'relative', cursor: 'pointer' }}
                  onClick={() => { if (onClick) onClick(); setIsConfigModalVisible(false); }}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setReportEditItem(item);
                      const desc = (function(){
                        if (item.t.includes('创建')) return '自定义结构与风格，打造专属报道，明确章节与语气，并生成“新教师教学方法培训”的定制报告草稿。';
                        if (item.t.includes('简报')) return '生成执行简报，以要点列出培训成效、存在问题与下一步行动建议，便于校内会议汇报。';
                        if (item.t.includes('学习指南')) return '整理学习指南摘要，包含新教师需掌握的课堂组织、教学设计与评价要点，附建议练习与课堂应用清单。';
                        return '草拟博客文章，将“新教师教学方法培训”的洞见提炼为通俗易懂的段落，适合对外传播。';
                      })();
                      setReportDescription(desc);
                    }}
                    style={{ position: 'absolute', top: 10, right: 10 }}
                  />
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{item.t}</div>
                  <div style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.6 }}>{item.d}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>✦</span>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{reportSuggestions ? '建议格式' : '正在加载建议......'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {(reportSuggestions ? reportSuggestions : [0,1,2,3]).map((item, i) => (
                reportSuggestions ? (
                  <div
                    key={`sug-${i}`}
                    style={{ background: '#f2efdf', borderRadius: 16, minHeight: 100, padding: '12px 14px', position: 'relative', cursor: 'pointer' }}
                    onClick={() => { if (onClick) onClick(); setIsConfigModalVisible(false); }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 6 }}>{item.t}</div>
                    <div style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.6 }}>{item.d}</div>
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setReportEditItem(item);
                        const desc = (function(){
                          if (item.t.includes('概览')) return '撰写一份“新教师教学方法培训”的概览报告，概述培训目标、进度、实施策略与关键结论，面向校内分享。';
                          if (item.t.includes('简报')) return '生成执行简报，以要点列出培训成效、存在问题与下一步行动建议，便于校内会议汇报。';
                          if (item.t.includes('学习指南')) return '整理学习指南摘要，包含新教师需掌握的课堂组织、教学设计与评价要点，附建议练习与课堂应用清单。';
                          return '草拟博客文章，将“新教师教学方法培训”的洞见提炼为通俗易懂的段落，适合对外传播。';
                        })();
                        setReportDescription(desc);
                      }}
                      style={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  </div>
                ) : (
                  <div key={`sug-${i}`} style={{
                    background: 'linear-gradient(90deg, rgba(242,239,223,1) 0%, rgba(235,232,214,1) 50%, rgba(242,239,223,1) 100%)',
                    borderRadius: 16,
                    height: 100,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '-60%',
                      width: '60%',
                      height: '100%',
                      background: 'linear-gradient(90deg, rgba(242,239,223,0) 0%, rgba(255,255,255,0.5) 50%, rgba(242,239,223,0) 100%)',
                      animation: 'skeletonShimmer 1.6s infinite'
                    }} />
                  </div>
                )
              ))}
            </div>
          </div>
        )}
        {card.key === 'report' && reportEditItem && (
          <div style={{ padding: '4px 0 16px 0' }}>
            <div style={{ background: '#f2efdf', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{reportEditItem.t}</div>
              <div style={{ fontSize: 12, color: '#4b5563', marginTop: 4 }}>{reportEditItem.d}</div>
            </div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>描述你要生成的报告</div>
            <Input.TextArea value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} autoSize={{ minRows: 4, maxRows: 8 }} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <Button type="primary" onClick={() => { if (onClick) onClick(); setReportEditItem(null); setIsConfigModalVisible(false); }}>生成</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DraggableOperationCard;
