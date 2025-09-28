import React, { useState, useEffect } from 'react';
import {
  Layout,
  Input,
  Button,
  Typography,
  Space,
  message,
  Upload,
  List,
  Card,
  Divider,
  Tag,
  Avatar,
  Tooltip,
  Select,
  Row,
  Col,
  Modal,
  Checkbox,
  Popconfirm,
  Dropdown
} from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MaterialAddPage from './MaterialAddPage';
import ExploreModal from './ExploreModal';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  FileTextOutlined,
  LinkOutlined,
  SendOutlined,
  PlusOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CopyOutlined,
  ShareAltOutlined,
  RobotOutlined,
  UserOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  GlobalOutlined,
  MoreOutlined,
  EditOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 生成试题内容
// 可拖拽的工具卡片组件
const DraggableToolCard = ({ toolType, index, config, onMove, onRemove, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'tool',
    item: { index, toolType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'tool',
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
        size="small" 
        hoverable
        onClick={onClick}
        style={{ 
          background: config.background,
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
        <div style={{ padding: '8px 0' }}>
          <div style={{ fontSize: '20px', marginBottom: '6px' }}>{config.icon}</div>
          <Text style={{ 
            fontSize: '11px', 
            fontWeight: 500, 
            color: config.color 
          }}>{config.label}</Text>
        </div>
      </Card>
      
      {/* 配置按钮 - 只为课程推荐和培训方案显示 */}
      {(toolType === 'schedule' || toolType === 'training-plan') && (
        <Button
          type="text"
          size="small"
          icon={<SettingOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            // 配置逻辑在父组件中处理
          }}
          style={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#1890ff',
            color: 'white',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            minWidth: 'auto'
          }}
        />
      )}
      
      {/* 移除按钮 */}
      <Button
        type="text"
        size="small"
        icon={<DeleteOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(toolType);
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
    </div>
  );
};

const generateQuestionContent = () => {
  return `试题内容...`;
};

// 生成试卷内容 
const generateExamPaperContent = () => {
  return `试卷内容...`;
};

const CourseSelectionEditPage = ({ onBack, onViewChange, selectedNeed, mode = 'create' }) => {
  // 基础状态
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: '教师专业发展指导手册.pdf', type: 'application/pdf', uploadTime: '刚刚' },
    { id: 2, name: '现代教育技术应用培训资料.pdf', type: 'application/pdf', uploadTime: '2分钟前' }
  ]);
  
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 操作面板相关状态
  const [visibleTools, setVisibleTools] = useState(['schedule', 'training-plan']); // 默认显示的工具
  const [showToolSelector, setShowToolSelector] = useState(false); // 工具选择器显示状态
  
  // 弹窗状态
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configType, setConfigType] = useState('');
  
  // 操作记录状态
  const [operationRecords, setOperationRecords] = useState({
    audio: [],
    video: [],
    mindmap: [],
    question: [],
    'exam-paper': [],
    'training-plan': [
      {
        id: 1001,
        title: '培训方案设计与实施指南',
        source: '培训管理系统',
        time: '刚刚',
        type: 'training-plan',
        content: `培训方案内容...`
      }
    ],
    report: [
      {
        id: 1002,
        title: '培训课表安排与时间管理',
        source: '课程管理系统',
        time: '刚刚',
        type: 'report',
        content: `课表安排内容...`
      }
    ],
    ppt: [],
    webcode: [],
    file: [],
    text: [],
    link: []
  });

  // 拖拽排序处理函数
  const moveToolPosition = (fromIndex, toIndex) => {
    const updatedTools = [...visibleTools];
    const [movedTool] = updatedTools.splice(fromIndex, 1);
    updatedTools.splice(toIndex, 0, movedTool);
    setVisibleTools(updatedTools);
    message.success('工具位置已调整');
  };

  // 添加工具到可见列表
  const handleAddTool = (toolType) => {
    const operationTitles = {
      audio: '音频概览',
      video: '视频概览', 
      mindmap: '思维导图',
      report: '分析报告',
      ppt: 'PPT演示',
      webcode: '网页代码',
      'training-plan': '培训方案',
      schedule: '课程推荐',
      participants: '参训人员清单',
      question: '试题',
      'exam-paper': '试卷'
    };
    
    if (!visibleTools.includes(toolType) && visibleTools.length < 9) {
      setVisibleTools(prev => [...prev, toolType]);
      message.success(`已添加${operationTitles[toolType]}工具`);
    }
    setShowToolSelector(false);
  };

  // 从可见列表移除工具
  const handleRemoveTool = (toolType) => {
    const operationTitles = {
      audio: '音频概览',
      video: '视频概览', 
      mindmap: '思维导图',
      report: '分析报告',
      ppt: 'PPT演示',
      webcode: '网页代码',
      'training-plan': '培训方案',
      schedule: '课程推荐',
      participants: '参训人员清单',
      question: '试题',
      'exam-paper': '试卷'
    };
    
    if (visibleTools.length > 1) {
      setVisibleTools(prev => prev.filter(tool => tool !== toolType));
      message.success(`已移除${operationTitles[toolType]}工具`);
    } else {
      message.warning('至少需要保留1个工具');
    }
  };

  // 操作按钮点击处理函数
  const handleOperationClick = (operationType) => {
    const operationTitles = {
      audio: '音频概览',
      video: '视频概览', 
      mindmap: '思维导图',
      report: '分析报告',
      ppt: 'PPT演示',
      webcode: '网页代码',
      'training-plan': '培训方案',
      schedule: '课程推荐',
      participants: '参训人员清单',
      question: '试题',
      'exam-paper': '试卷'
    };

    const totalMaterials = uploadedFiles.length + selectedMaterials.length;
    const recordType = operationType;

    const newRecord = {
      id: Date.now(),
      title: `基于${totalMaterials}个资料生成${operationTitles[operationType]}`,
      source: `${totalMaterials}个来源`,
      time: '刚刚',
      type: operationType,
      content: operationType === 'question' ? generateQuestionContent() : 
               operationType === 'exam-paper' ? generateExamPaperContent() : 
               undefined
    };

    // 添加进度效果
    message.loading(`正在生成${operationTitles[operationType]}...`, 3);
    setTimeout(() => {
      setOperationRecords(prev => ({
        ...prev,
        [recordType]: [newRecord, ...prev[recordType]]
      }));
      message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
    }, 3000);
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `基于您上传的资料，我理解您的问题是："${inputMessage}"。根据现有资料分析，我建议...`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  // 处理选择材料
  const handleSelectMaterial = (materialId, checked) => {
    if (checked) {
      setSelectedMaterials([...selectedMaterials, materialId]);
    } else {
      setSelectedMaterials(selectedMaterials.filter(id => id !== materialId));
    }
  };

  // 处理探索功能
  const handleExplore = (exploreData) => {
    message.success('探索功能已触发');
  };

  // 返回功能
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', height: '100vh', background: '#f5f5f5' }}>
        {/* 左侧资料收集区域 */}
        <div style={{ flex: 2.5, background: '#fff', margin: '16px 0 16px 16px', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '20px' }}>
            {/* 页面头部 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
                  {mode === 'edit' ? '📝 编辑选课' : '📝 新建选课'}
                </Title>
                {onBack && (
                  <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={handleBack}
                    style={{ color: '#666' }}
                    size="small"
                  >
                    返回
                  </Button>
                )}
              </div>
            </div>

            {/* 资料收集区域 */}
            <div style={{ marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>📚 资料收集</Title>
            </div>
            
            {/* 资料列表 */}
            <div style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              {uploadedFiles.map(file => (
                <Card 
                  key={`file-${file.id}`} 
                  size="small" 
                  style={{ 
                    marginBottom: 8,
                    border: selectedMaterials.includes(`file-${file.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                    backgroundColor: selectedMaterials.includes(`file-${file.id}`) ? '#f6ffed' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <FileTextOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8 }} />
                      <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{file.name}</Text>
                    </div>
                    <Checkbox
                      checked={selectedMaterials.includes(`file-${file.id}`)}
                      onChange={(e) => handleSelectMaterial(`file-${file.id}`, e.target.checked)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* 中间问答区域 */}
        <div style={{ flex: 5, margin: '16px', background: '#fff', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
            <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>💬 智能问答</Title>
          </div>
          
          {/* 消息列表 */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: 16 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 8
                }}>
                  {msg.type === 'assistant' && (
                    <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                  )}
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: msg.type === 'user' ? '#1890ff' : '#f6f6f6',
                    color: msg.type === 'user' ? '#fff' : '#333'
                  }}>
                    <Text style={{ color: 'inherit' }}>{msg.content}</Text>
                  </div>
                  {msg.type === 'user' && (
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <div style={{ padding: '12px 16px', backgroundColor: '#f6f6f6', borderRadius: '12px' }}>
                  <Text>正在思考中...</Text>
                </div>
              </div>
            )}
          </div>
          
          {/* 输入区域 */}
          <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0' }}>
            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="请输入您的问题..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                loading={isLoading}
                disabled={!inputMessage.trim()}
              >
                发送
              </Button>
            </Space.Compact>
          </div>
        </div>

        {/* 右侧操作区域 */}
        <div style={{ flex: 2.5, background: '#fff', margin: '16px 16px 16px 0', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* 操作面板 */}
          <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Title level={5} style={{ marginBottom: 16, color: '#1f1f1f' }}>
              🛠️ 操作面板
            </Title>
            
            {/* 3x3网格布局容器 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* 功能卡片网格 - 3x3网格，最多9个 */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '8px', 
                marginBottom: 16, 
                flex: 1,
                minHeight: '240px' 
              }}>
                {/* 渲染可见的工具 */}
                {visibleTools.slice(0, 9).map((toolType, index) => {
                  const toolConfigs = {
                    'schedule': {
                      icon: '📅',
                      label: '课程推荐',
                      background: 'linear-gradient(135deg, #fff8e1 0%, #ffcc02 100%)',
                      color: '#f57c00'
                    },
                    'training-plan': {
                      icon: '📋',
                      label: '培训方案',
                      background: 'linear-gradient(135deg, #e8f5e8 0%, #a5d6a7 100%)',
                      color: '#388e3c'
                    },
                    'audio': {
                      icon: '音',
                      label: '音频概览',
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                      color: '#1565c0'
                    },
                    'video': {
                      icon: '视',
                      label: '视频概览',
                      background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                      color: '#2e7d32'
                    },
                    'mindmap': {
                      icon: '思',
                      label: '思维导图',
                      background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
                      color: '#c2185b'
                    },
                    'report': {
                      icon: '报',
                      label: '报告',
                      background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
                      color: '#ef6c00'
                    },
                    'ppt': {
                      icon: 'PPT',
                      label: 'PPT概览',
                      background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                      color: '#d32f2f'
                    },
                    'webcode': {
                      icon: '💻',
                      label: '网页代码',
                      background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                      color: '#7b1fa2'
                    },
                    'participants': {
                      icon: '👥',
                      label: '参训人员',
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)',
                      color: '#1976d2'
                    },
                    'question': {
                      icon: '试',
                      label: '试题',
                      background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
                      color: '#00695c'
                    },
                    'exam-paper': {
                      icon: '卷',
                      label: '试卷',
                      background: 'linear-gradient(135deg, #fdf8e1 0%, #f9e79f 100%)',
                      color: '#b7950b'
                    }
                  };

                  const config = toolConfigs[toolType];
                  if (!config) return null;

                  return (
                    <DraggableToolCard
                      key={toolType}
                      toolType={toolType}
                      index={index}
                      config={config}
                      onMove={moveToolPosition}
                      onRemove={handleRemoveTool}
                      onClick={() => handleOperationClick(toolType)}
                    />
                  );
                })}

                {/* 空位显示 - 填充剩余位置 */}
                {Array.from({ length: Math.max(0, 9 - visibleTools.length) }, (_, index) => (
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
              </div>
              
              {/* 添加工具按钮 - 细长条布局，放在底部 */}
              {visibleTools.length < 9 && (
                <Dropdown
                  open={showToolSelector}
                  onOpenChange={setShowToolSelector}
                  menu={{
                    items: [
                      'audio', 'video', 'mindmap', 'report', 'ppt', 'webcode', 'participants', 'question', 'exam-paper'
                    ].filter(tool => !visibleTools.includes(tool)).map(tool => ({
                      key: tool,
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>
                            {{
                              'audio': '音',
                              'video': '视',
                              'mindmap': '思',
                              'report': '报',
                              'ppt': 'PPT',
                              'webcode': '💻',
                              'participants': '👥',
                              'question': '试',
                              'exam-paper': '卷'
                            }[tool]}
                          </span>
                          <span>
                            {{
                              'audio': '音频概览',
                              'video': '视频概览',
                              'mindmap': '思维导图',
                              'report': '报告',
                              'ppt': 'PPT概览',
                              'webcode': '网页代码',
                              'participants': '参训人员',
                              'question': '试题',
                              'exam-paper': '试卷'
                            }[tool]}
                          </span>
                        </div>
                      ),
                      onClick: () => handleAddTool(tool)
                    }))
                  }}
                  trigger={['click']}
                  placement="topLeft"
                >
                  <Button 
                    type="dashed"
                    size="large"
                    icon={<PlusOutlined />}
                    block
                    style={{
                      height: '40px',
                      borderRadius: '20px',
                      border: '2px dashed #1890ff',
                      color: '#1890ff',
                      fontSize: '14px',
                      fontWeight: 500,
                      background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    更多
                  </Button>
                </Dropdown>
              )}
              
              {visibleTools.length >= 9 && (
                <div style={{
                  textAlign: 'center',
                  padding: '10px',
                  color: '#999',
                  fontSize: '12px',
                  border: '1px dashed #d9d9d9',
                  borderRadius: '20px',
                  background: '#fafafa'
                }}>
                  💼 工具栏已满（最多9个工具）
                </div>
              )}
            </div>
          </div>
          
          {/* 操作记录 */}
          <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                    case 'file': return '📄';
                    case 'text': return '📝';
                    case 'link': return '🔗';
                    case 'scenario': return '场';
                    case 'note': return '笔';
                    case 'question': return '试';
                    case 'exam-paper': return '卷';
                    case 'training-plan': return '📋';
                    case 'schedule': return '📅';
                    case 'participants': return '👥';
                    default: return '📄';
                  }
                };
                
                return (
                  <Card 
                    key={record.id}
                    size="small" 
                    hoverable
                    style={{ 
                      marginBottom: '8px',
                      borderRadius: '8px',
                      border: '1px solid #f0f0f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => message.info(`点击查看：${record.title}`)}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ fontSize: '16px', marginTop: '2px' }}>
                        {getIcon(record.type)}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontSize: '10px', color: '#999' }}>
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
                          message.info('更多操作');
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
        </div>
      </div>

      {/* 探索弹窗 */}
      <ExploreModal
        visible={showExploreModal}
        onClose={() => setShowExploreModal(false)}
        onExplore={handleExplore}
      />

      {/* 配置弹窗 */}
      <Modal
        title={`${configType === 'schedule' ? '课程推荐' : '培训方案'}配置`}
        open={showConfigModal}
        onCancel={() => setShowConfigModal(false)}
        onOk={() => {
          message.success('配置保存成功');
          setShowConfigModal(false);
        }}
        width={600}
      >
        <div style={{ padding: '20px 0' }}>
          {configType === 'schedule' && (
            <div>
              <Title level={5}>课程推荐配置</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>推荐算法：</Text>
                  <Select defaultValue="collaborative" style={{ width: 200, marginLeft: 10 }}>
                    <Option value="collaborative">协同过滤</Option>
                    <Option value="content">内容推荐</Option>
                    <Option value="hybrid">混合推荐</Option>
                  </Select>
                </div>
                <div>
                  <Checkbox defaultChecked>考虑学习历史</Checkbox>
                </div>
              </Space>
            </div>
          )}
          
          {configType === 'training-plan' && (
            <div>
              <Title level={5}>培训方案配置</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>方案类型：</Text>
                  <Select defaultValue="standard" style={{ width: 200, marginLeft: 10 }}>
                    <Option value="standard">标准方案</Option>
                    <Option value="custom">定制方案</Option>
                    <Option value="intensive">强化方案</Option>
                  </Select>
                </div>
                <div>
                  <Checkbox defaultChecked>包含实践环节</Checkbox>
                </div>
              </Space>
            </div>
          )}
        </div>
      </Modal>
    </DndProvider>
  );
};

export default CourseSelectionEditPage; // 支持拖拽排序的操作面板