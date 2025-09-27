import React, { useState } from 'react';
import {
  Modal,
  Button,
  Card,
  Typography,
  Space,
  List,
  Tag,
  message,
  Tabs,
  Divider,
  Collapse,
  Row,
  Col,
  Slider,
  Select,
  InputNumber,
  Radio,
  Checkbox,
  Form
} from 'antd';
import {
  UnorderedListOutlined,
  NodeIndexOutlined,
  BookOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const QuestionConfigModal = ({ 
  visible, 
  onClose, 
  onConfirm, 
  materialCount = 0 
}) => {
  const [selectedView, setSelectedView] = useState('knowledgeList'); // 默认选择知识点列表
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false); // 控制更多配置显示
  const [form] = Form.useForm();
  
  // 布鲁姆教育目标分类法配置
  const bloomTaxonomy = [
    {
      level: 'remember',
      name: '记忆层',
      description: '考核基础知识的复述',
      example: '写出牛顿第一定律的内容',
      color: '#52c41a',
      defaultRatio: 20
    },
    {
      level: 'understand', 
      name: '理解层',
      description: '考核对知识的解释与辨析',
      example: '辨析\'做功\'与\'热传递\'的区别',
      color: '#1890ff',
      defaultRatio: 25
    },
    {
      level: 'apply',
      name: '应用层', 
      description: '考核知识在具体场景的运用',
      example: '用勾股定理计算直角三角形斜边长度',
      color: '#fa8c16',
      defaultRatio: 25
    },
    {
      level: 'analyze',
      name: '分析层',
      description: '考核逻辑拆解与因果判断', 
      example: '分析某化学实验中\'反应速率变慢\'的3个可能原因',
      color: '#eb2f96',
      defaultRatio: 15
    },
    {
      level: 'evaluate',
      name: '评价层',
      description: '考核观点论证与价值判断',
      example: '评价\'无纸化办公\'的优势与潜在问题', 
      color: '#722ed1',
      defaultRatio: 10
    },
    {
      level: 'create',
      name: '创造层',
      description: '考核创新与设计能力',
      example: '设计一个验证\'植物光合作用需要光\'的实验方案',
      color: '#f5222d',
      defaultRatio: 5
    }
  ];
  
  // 题型配置数据
  const questionTypes = [
    {
      category: 'objective',
      name: '客观题（自动评）',
      types: [
        { key: 'single_choice', name: '单选题', defaultRatio: 40, scorePerItem: 2 },
        { key: 'multiple_choice', name: '多选题', defaultRatio: 20, scorePerItem: 4 },
        { key: 'true_false', name: '判断题', defaultRatio: 15, scorePerItem: 1 },
        { key: 'fill_blank', name: '填空题', defaultRatio: 10, scorePerItem: 3 }
      ]
    },
    {
      category: 'subjective', 
      name: '主观题（人工/半自动评）',
      types: [
        { key: 'short_answer', name: '简答题', defaultRatio: 8, scorePerItem: 8 },
        { key: 'calculation', name: '计算题', defaultRatio: 5, scorePerItem: 10 },
        { key: 'essay', name: '论述题', defaultRatio: 2, scorePerItem: 15 }
      ]
    }
  ];
  
  // 难度等级配置
  const difficultyLevels = [
    {
      level: 'basic',
      name: '基础级',
      description: '考核核心概念记忆，几乎所有掌握基础的考生可答对',
      successRate: '90%+',
      color: '#52c41a',
      defaultRatio: 30
    },
    {
      level: 'medium',
      name: '中等级', 
      description: '考核基础应用，需简单推理',
      successRate: '70%-80%',
      color: '#1890ff',
      defaultRatio: 40
    },
    {
      level: 'hard',
      name: '较难级',
      description: '考核综合应用，需跨知识点关联', 
      successRate: '40%-60%',
      color: '#fa8c16',
      defaultRatio: 20
    },
    {
      level: 'expert',
      name: '难题级',
      description: '考核复杂分析/创新，需深度思考',
      successRate: '10%-30%', 
      color: '#f5222d',
      defaultRatio: 10
    }
  ];
  
  // 模拟知识点数据
  const mockKnowledgePoints = [
    {
      id: 1,
      title: '数据结构基础',
      description: '数组、链表、栈、队列等基本数据结构的实现与应用',
      difficulty: '基础',
      tags: ['数据结构', '算法基础', '编程'],
      category: '计算机科学'
    },
    {
      id: 2,
      title: 'React组件开发',
      description: '函数组件、Hook使用、组件通信与状态管理',
      difficulty: '中级',
      tags: ['React', '前端开发', 'JavaScript'],
      category: '前端技术'
    },
    {
      id: 3,
      title: '数据库设计',
      description: '关系型数据库设计原理、范式理论与实践应用',
      difficulty: '中级',
      tags: ['数据库', '后端开发', 'SQL'],
      category: '后端技术'
    },
    {
      id: 4,
      title: '机器学习入门',
      description: '监督学习、无监督学习基本概念与算法原理',
      difficulty: '高级',
      tags: ['机器学习', 'AI', '算法'],
      category: '人工智能'
    },
    {
      id: 5,
      title: 'HTTP协议',
      description: 'HTTP请求响应机制、状态码、缓存策略等核心概念',
      difficulty: '基础',
      tags: ['网络协议', 'Web开发', '通信'],
      category: '网络技术'
    },
    {
      id: 6,
      title: 'Vue.js框架',
      description: 'Vue组件系统、响应式原理、路由管理与状态管理',
      difficulty: '中级',
      tags: ['Vue', '前端框架', 'MVVM'],
      category: '前端技术'
    },
    {
      id: 7,
      title: '微服务架构',
      description: '微服务设计原则、服务治理、分布式系统架构',
      difficulty: '高级',
      tags: ['架构设计', '分布式', '微服务'],
      category: '系统架构'
    },
    {
      id: 8,
      title: 'Git版本控制',
      description: 'Git工作流、分支管理、代码合并与冲突解决',
      difficulty: '基础',
      tags: ['版本控制', '协作开发', 'Git'],
      category: '开发工具'
    },
    {
      id: 9,
      title: 'CSS布局技术',
      description: 'Flexbox、Grid、定位布局等现代CSS布局方案',
      difficulty: '中级',
      tags: ['CSS', '前端样式', '布局'],
      category: '前端技术'
    },
    {
      id: 10,
      title: 'Docker容器化',
      description: 'Docker镜像、容器管理、编排部署与最佳实践',
      difficulty: '中级',
      tags: ['容器化', 'DevOps', '部署'],
      category: '运维技术'
    },
    {
      id: 11,
      title: '算法复杂度分析',
      description: '时间复杂度、空间复杂度分析方法与优化策略',
      difficulty: '中级',
      tags: ['算法分析', '性能优化', '计算理论'],
      category: '计算机科学'
    },
    {
      id: 12,
      title: 'TypeScript类型系统',
      description: 'TypeScript类型定义、泛型、装饰器等高级特性',
      difficulty: '高级',
      tags: ['TypeScript', '类型系统', '静态检查'],
      category: '编程语言'
    }
  ];

  // 知识图谱连接关系模拟数据
  const mockKnowledgeConnections = [
    { from: 1, to: 11, type: '前置知识' },
    { from: 2, to: 6, type: '相关技术' },
    { from: 2, to: 9, type: '配套技能' },
    { from: 5, to: 2, type: '应用场景' },
    { from: 8, to: 2, type: '开发工具' },
    { from: 3, to: 7, type: '架构组件' },
    { from: 10, to: 7, type: '部署方案' },
    { from: 12, to: 2, type: '技术栈' },
    { from: 4, to: 11, type: '算法基础' }
  ];

  const getDifficultyColor = (difficulty) => {
    const colorMap = {
      '基础': 'green',
      '中级': 'orange',
      '高级': 'red'
    };
    return colorMap[difficulty] || 'default';
  };

  const handleConfirm = () => {
    const viewLabels = {
      'knowledgeList': '知识点列表',
      'knowledgeGraph': '知识图谱'
    };
    
    // 生成操作记录
    const operationRecord = {
      id: Date.now(),
      title: `基于${materialCount}个资料生成试题 - ${viewLabels[selectedView]}视图`,
      source: `${materialCount}个来源`,
      time: '刚刚',
      type: 'question',
      viewType: selectedView,
      knowledgePoints: mockKnowledgePoints.length,
      config: {
        viewMode: selectedView,
        selectedKnowledgePoints: mockKnowledgePoints.map(kp => kp.id),
        totalConnections: mockKnowledgeConnections.length
      }
    };

    onConfirm(operationRecord);
    message.success(`已生成${viewLabels[selectedView]}视图的试题`);
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#00695c'
          }}>
            题
          </div>
          <span style={{ fontSize: '16px', fontWeight: 600 }}>试题生成配置</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={760}
      styles={{
        body: { padding: '16px 12px' }
      }}
      footer={[
        <Button 
          key="advanced" 
          icon={<SettingOutlined />}
          onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
          style={{ float: 'left' }}
        >
          {showAdvancedConfig ? '简化配置' : '更多配置'}
        </Button>,
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm}>
          确认生成
        </Button>
      ]}
      centered
    >
      <div style={{ padding: '0' }}>
        {/* 资料信息提示 */}
        <Card 
          size="small" 
          style={{ 
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #f6ffed 0%, #f0fff0 100%)',
            border: '1px solid #b7eb8f'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
            <Text style={{ color: '#52c41a', fontWeight: 500 }}>
              将基于当前 {materialCount} 个资料生成试题内容
            </Text>
          </div>
        </Card>

        {/* 视图选择与预览 */}
        <Tabs
          activeKey={selectedView}
          onChange={setSelectedView}
          type="card"
          size="large"
          style={{ margin: '0' }}
          tabBarStyle={{ margin: '0', padding: '0' }}
          items={[
            {
              key: 'knowledgeList',
              label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                  <UnorderedListOutlined style={{ fontSize: '16px' }} />
                  <span>知识点列表</span>
                </div>
              ),
              children: (
                <div 
                  style={{ 
                    maxHeight: '400px', 
                    overflow: 'auto',
                    padding: '0',
                    margin: '0'
                  }}
                >
                  <List
                    dataSource={mockKnowledgePoints}
                    split={false}
                    style={{ padding: '0', margin: '0' }}
                    renderItem={(item) => (
                      <List.Item style={{ padding: '0 0 6px 0', border: 'none', margin: '0' }}>
                        <Card 
                          size="small" 
                          style={{ 
                            width: '100%', 
                            margin: '0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                          }}
                          hoverable
                          bodyStyle={{ padding: '8px 12px' }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            width: '100%',
                            gap: '12px'
                          }}>
                            <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Text strong style={{ 
                                fontSize: '13px',
                                color: '#262626',
                                lineHeight: '1.3',
                                whiteSpace: 'nowrap'
                              }}>
                                {item.title}
                              </Text>
                              <Tag 
                                size="small" 
                                color="blue"
                                style={{ 
                                  fontSize: '10px',
                                  lineHeight: '1.2',
                                  padding: '1px 4px',
                                  margin: 0
                                }}
                              >
                                {item.category}
                              </Tag>
                            </div>
                            
                            <div style={{ 
                              flex: 1,
                              minWidth: 0,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <Text 
                                type="secondary"
                                style={{ 
                                  fontSize: '11px', 
                                  lineHeight: '1.3',
                                  color: '#999',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  flex: 1
                                }}
                              >
                                {item.description}
                              </Text>
                              
                              <div style={{ 
                                display: 'flex',
                                gap: '3px',
                                alignItems: 'center',
                                flexShrink: 0
                              }}>
                                {item.tags.slice(0, 2).map(tag => (
                                  <Tag 
                                    key={tag} 
                                    size="small" 
                                    color="geekblue"
                                    style={{ 
                                      fontSize: '10px',
                                      lineHeight: '1.2',
                                      margin: 0,
                                      padding: '1px 4px'
                                    }}
                                  >
                                    {tag}
                                  </Tag>
                                ))}
                                {item.tags.length > 2 && (
                                  <Text style={{ fontSize: '10px', color: '#ccc' }}>+{item.tags.length - 2}</Text>
                                )}
                              </div>
                            </div>
                            
                            <div style={{ 
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              <Tag 
                                color={getDifficultyColor(item.difficulty)} 
                                style={{ 
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  minWidth: '32px',
                                  textAlign: 'center',
                                  margin: 0,
                                  padding: '2px 6px'
                                }}
                              >
                                {item.difficulty}
                              </Tag>
                            </div>
                          </div>
                        </Card>
                      </List.Item>
                    )}
                  />
                </div>
              )
            },
            {
              key: 'knowledgeGraph',
              label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                  <NodeIndexOutlined style={{ fontSize: '16px' }} />
                  <span>知识图谱</span>
                </div>
              ),
              children: (
                <div 
                  style={{ 
                    height: '400px',
                    padding: '0',
                    margin: '0'
                  }}
                >
                  <div style={{ 
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #f8faff 0%, #f0f9ff 100%)',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <svg 
                      width="100%" 
                      height="100%" 
                      viewBox="0 0 800 320"
                      style={{ display: 'block' }}
                    >
                      {/* 定义渐变和阴影 */}
                      <defs>
                        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                        <linearGradient id="nodeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id="nodeGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                          <dropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)"/>
                        </filter>
                      </defs>
                      
                      {/* 连接线 */}
                      <g stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.7">
                        {/* 数据结构 -> 算法复杂度 */}
                        <line x1="120" y1="80" x2="280" y2="160" />
                        <text x="200" y="110" fontSize="10" fill="#64748b" textAnchor="middle">前置知识</text>
                        
                        {/* React -> Vue */}
                        <line x1="350" y1="80" x2="480" y2="160" />
                        <text x="415" y="110" fontSize="10" fill="#64748b" textAnchor="middle">相关技术</text>
                        
                        {/* React -> CSS布局 */}
                        <line x1="350" y1="80" x2="280" y2="240" />
                        <text x="315" y="150" fontSize="10" fill="#64748b" textAnchor="middle">配套技能</text>
                        
                        {/* HTTP -> React */}
                        <line x1="550" y1="80" x2="390" y2="80" />
                        <text x="470" y="70" fontSize="10" fill="#64748b" textAnchor="middle">应用场景</text>
                        
                        {/* Git -> React */}
                        <line x1="680" y1="160" x2="390" y2="100" />
                        <text x="535" y="120" fontSize="10" fill="#64748b" textAnchor="middle">开发工具</text>
                        
                        {/* 数据库 -> 微服务 */}
                        <line x1="120" y1="240" x2="480" y2="240" />
                        <text x="300" y="230" fontSize="10" fill="#64748b" textAnchor="middle">架构组件</text>
                        
                        {/* Docker -> 微服务 */}
                        <line x1="680" y1="240" x2="520" y2="240" />
                        <text x="600" y="230" fontSize="10" fill="#64748b" textAnchor="middle">部署方案</text>
                        
                        {/* TypeScript -> React */}
                        <line x1="120" y1="160" x2="310" y2="80" />
                        <text x="215" y="110" fontSize="10" fill="#64748b" textAnchor="middle">技术栈</text>
                      </g>
                      
                      {/* 知识点节点 */}
                      {/* 第一层：基础知识 */}
                      <g>
                        <circle cx="120" cy="80" r="25" fill="url(#nodeGradient)" filter="url(#shadow)" />
                        <text x="120" y="75" fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">数据</text>
                        <text x="120" y="87" fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">结构</text>
                      </g>
                      
                      <g>
                        <circle cx="350" cy="80" r="25" fill="url(#nodeGradient2)" filter="url(#shadow)" />
                        <text x="350" y="85" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">React</text>
                      </g>
                      
                      <g>
                        <circle cx="550" cy="80" r="25" fill="url(#nodeGradient3)" filter="url(#shadow)" />
                        <text x="550" y="85" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">HTTP</text>
                      </g>
                      
                      {/* 第二层：进阶知识 */}
                      <g>
                        <circle cx="120" cy="160" r="22" fill="url(#nodeGradient)" filter="url(#shadow)" />
                        <text x="120" y="158" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">TypeScript</text>
                        <text x="120" y="170" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">类型系统</text>
                      </g>
                      
                      <g>
                        <circle cx="280" cy="160" r="22" fill="url(#nodeGradient2)" filter="url(#shadow)" />
                        <text x="280" y="158" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">算法</text>
                        <text x="280" y="170" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">复杂度</text>
                      </g>
                      
                      <g>
                        <circle cx="480" cy="160" r="22" fill="url(#nodeGradient2)" filter="url(#shadow)" />
                        <text x="480" y="165" fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">Vue.js</text>
                      </g>
                      
                      <g>
                        <circle cx="680" cy="160" r="22" fill="url(#nodeGradient3)" filter="url(#shadow)" />
                        <text x="680" y="165" fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">Git</text>
                      </g>
                      
                      {/* 第三层：应用知识 */}
                      <g>
                        <circle cx="120" cy="240" r="22" fill="url(#nodeGradient)" filter="url(#shadow)" />
                        <text x="120" y="238" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">数据库</text>
                        <text x="120" y="250" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">设计</text>
                      </g>
                      
                      <g>
                        <circle cx="280" cy="240" r="22" fill="url(#nodeGradient2)" filter="url(#shadow)" />
                        <text x="280" y="238" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">CSS</text>
                        <text x="280" y="250" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">布局</text>
                      </g>
                      
                      <g>
                        <circle cx="480" cy="240" r="22" fill="url(#nodeGradient3)" filter="url(#shadow)" />
                        <text x="480" y="238" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">微服务</text>
                        <text x="480" y="250" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">架构</text>
                      </g>
                      
                      <g>
                        <circle cx="680" cy="240" r="22" fill="url(#nodeGradient)" filter="url(#shadow)" />
                        <text x="680" y="238" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">Docker</text>
                        <text x="680" y="250" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">容器化</text>
                      </g>
                    </svg>
                    
                    {/* 图例 */}
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      background: 'rgba(255,255,255,0.9)',
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      display: 'flex',
                      gap: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}></div>
                        <span>基础技术</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)' }}></div>
                        <span>前端框架</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}></div>
                        <span>系统架构</span>
                      </div>
                    </div>
                    
                    {/* 统计信息 */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(255,255,255,0.9)',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      color: '#64748b',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      知识点: {mockKnowledgePoints.length} • 关联: {mockKnowledgeConnections.length}
                    </div>
                  </div>
                </div>
              )
            }
          ]}
        />
        
        {/* 高级配置区域 */}
        {showAdvancedConfig && (
          <div style={{ marginTop: '20px', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '16px', background: '#fafafa' }}>
            <Title level={4} style={{ margin: '0 0 16px 0', color: '#262626', fontSize: '16px' }}>
              <SettingOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              高级配置
            </Title>
            
            <Form form={form} layout="vertical">
              <Collapse 
                ghost
                expandIconPosition="end"
                items={[
                  {
                    key: 'cognitive',
                    label: (
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#262626' }}>
                        🧠 认知层次配置（布鲁姆教育目标分类法）
                      </div>
                    ),
                    children: (
                      <div>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '16px', fontSize: '13px' }}>
                          基于布鲁姆教育目标分类法，明确试题对学生认知能力的考核深度，避免“只考记忆、不考应用”的片面性。
                        </Text>
                        {bloomTaxonomy.map(level => (
                          <div key={level.level} style={{ marginBottom: '16px' }}>
                            <Row gutter={16} align="middle">
                              <Col span={6}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ 
                                    width: '8px', 
                                    height: '8px', 
                                    borderRadius: '50%', 
                                    backgroundColor: level.color 
                                  }}></div>
                                  <Text strong style={{ fontSize: '13px' }}>{level.name}</Text>
                                </div>
                              </Col>
                              <Col span={10}>
                                <Text style={{ fontSize: '12px', color: '#666' }}>{level.description}</Text>
                              </Col>
                              <Col span={8}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Slider 
                                    style={{ flex: 1 }}
                                    min={0}
                                    max={50}
                                    defaultValue={level.defaultRatio}
                                    tooltip={{ formatter: value => `${value}%` }}
                                  />
                                  <Text style={{ fontSize: '12px', minWidth: '35px' }}>{level.defaultRatio}%</Text>
                                </div>
                              </Col>
                            </Row>
                            <div style={{ marginTop: '4px', paddingLeft: '22px' }}>
                              <Text style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>
                                示例：{level.example}
                              </Text>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  },
                  {
                    key: 'questionTypes',
                    label: (
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#262626' }}>
                        📋 题型配置与试卷结构
                      </div>
                    ),
                    children: (
                      <div>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '16px', fontSize: '13px' }}>
                          配置试题的呈现形态和结构，匹配考试场景和评分方式。
                        </Text>
                        
                        {questionTypes.map(category => (
                          <div key={category.category} style={{ marginBottom: '20px' }}>
                            <Title level={5} style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#595959' }}>
                              {category.name}
                            </Title>
                            
                            {category.types.map(type => (
                              <Row key={type.key} gutter={16} align="middle" style={{ marginBottom: '12px' }}>
                                <Col span={4}>
                                  <Checkbox defaultChecked={type.defaultRatio > 0}>
                                    <Text style={{ fontSize: '12px' }}>{type.name}</Text>
                                  </Checkbox>
                                </Col>
                                <Col span={6}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Text style={{ fontSize: '11px', color: '#999' }}>占比：</Text>
                                    <InputNumber 
                                      size="small"
                                      min={0}
                                      max={100}
                                      defaultValue={type.defaultRatio}
                                      formatter={value => `${value}%`}
                                      parser={value => value.replace('%', '')}
                                      style={{ width: '70px' }}
                                    />
                                  </div>
                                </Col>
                                <Col span={6}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Text style={{ fontSize: '11px', color: '#999' }}>分值：</Text>
                                    <InputNumber 
                                      size="small"
                                      min={1}
                                      max={50}
                                      defaultValue={type.scorePerItem}
                                      formatter={value => `${value}分`}
                                      parser={value => value.replace('分', '')}
                                      style={{ width: '70px' }}
                                    />
                                  </div>
                                </Col>
                                <Col span={8}>
                                  {type.key === 'single_choice' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Text style={{ fontSize: '11px', color: '#999' }}>选项数：</Text>
                                      <Select size="small" defaultValue={4} style={{ width: '60px' }}>
                                        <Option value={3}>3</Option>
                                        <Option value={4}>4</Option>
                                        <Option value={5}>5</Option>
                                      </Select>
                                    </div>
                                  )}
                                  {type.key === 'multiple_choice' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Text style={{ fontSize: '11px', color: '#999' }}>选项数：</Text>
                                      <Select size="small" defaultValue={5} style={{ width: '60px' }}>
                                        <Option value={4}>4</Option>
                                        <Option value={5}>5</Option>
                                        <Option value={6}>6</Option>
                                      </Select>
                                    </div>
                                  )}
                                  {type.key === 'fill_blank' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Text style={{ fontSize: '11px', color: '#999' }}>空数：</Text>
                                      <Select size="small" defaultValue={1} style={{ width: '60px' }}>
                                        <Option value={1}>1</Option>
                                        <Option value={2}>2</Option>
                                        <Option value={3}>3</Option>
                                      </Select>
                                    </div>
                                  )}
                                </Col>
                              </Row>
                            ))}
                          </div>
                        ))}
                        
                        <Divider style={{ margin: '16px 0' }} />
                        
                        <Row gutter={16}>
                          <Col span={8}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Text style={{ fontSize: '12px', fontWeight: 500 }}>总题量：</Text>
                              <InputNumber 
                                size="small"
                                min={10}
                                max={200}
                                defaultValue={50}
                                formatter={value => `${value}道`}
                                parser={value => value.replace('道', '')}
                                style={{ width: '80px' }}
                              />
                            </div>
                          </Col>
                          <Col span={8}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Text style={{ fontSize: '12px', fontWeight: 500 }}>总分：</Text>
                              <InputNumber 
                                size="small"
                                min={50}
                                max={300}
                                defaultValue={100}
                                formatter={value => `${value}分`}
                                parser={value => value.replace('分', '')}
                                style={{ width: '80px' }}
                              />
                            </div>
                          </Col>
                          <Col span={8}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Text style={{ fontSize: '12px', fontWeight: 500 }}>答题顺序：</Text>
                              <Select size="small" defaultValue="by_type" style={{ width: '100px' }}>
                                <Option value="by_type">按题型排序</Option>
                                <Option value="by_knowledge">按知识点排序</Option>
                                <Option value="random">随机打乱</Option>
                              </Select>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    )
                  },
                  {
                    key: 'difficulty',
                    label: (
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#262626' }}>
                        🎯 难度维度配置
                      </div>
                    ),
                    children: (
                      <div>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '16px', fontSize: '13px' }}>
                          配置试题难度分布，匹配考生水平，确保适当区分度。
                        </Text>
                        
                        {difficultyLevels.map(level => (
                          <div key={level.level} style={{ marginBottom: '16px' }}>
                            <Row gutter={16} align="middle">
                              <Col span={5}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ 
                                    width: '8px', 
                                    height: '8px', 
                                    borderRadius: '50%', 
                                    backgroundColor: level.color 
                                  }}></div>
                                  <Text strong style={{ fontSize: '13px' }}>{level.name}</Text>
                                </div>
                              </Col>
                              <Col span={11}>
                                <Text style={{ fontSize: '12px', color: '#666' }}>{level.description}</Text>
                              </Col>
                              <Col span={4}>
                                <Tag color={level.color} style={{ fontSize: '11px' }}>
                                  成功率 {level.successRate}
                                </Tag>
                              </Col>
                              <Col span={4}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Slider 
                                    style={{ flex: 1, minWidth: '60px' }}
                                    min={0}
                                    max={60}
                                    defaultValue={level.defaultRatio}
                                    tooltip={{ formatter: value => `${value}%` }}
                                  />
                                  <Text style={{ fontSize: '12px', minWidth: '35px' }}>{level.defaultRatio}%</Text>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        ))}
                        
                        <Divider style={{ margin: '16px 0' }} />
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Text style={{ fontSize: '12px', fontWeight: 500 }}>区分度目标：</Text>
                              <Radio.Group size="small" defaultValue="medium">
                                <Radio.Button value="low">低区分度 (0.2以下)</Radio.Button>
                                <Radio.Button value="medium">中等区分度 (0.2-0.4)</Radio.Button>
                                <Radio.Button value="high">高区分度 (0.4以上)</Radio.Button>
                              </Radio.Group>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Text style={{ fontSize: '12px', fontWeight: 500 }}>考试类型：</Text>
                              <Select size="small" defaultValue="screening" style={{ width: '120px' }}>
                                <Option value="screening">筛选性考试</Option>
                                <Option value="standard">达标性考试</Option>
                                <Option value="diagnostic">诊断性考试</Option>
                              </Select>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    )
                  }
                ]}
                defaultActiveKey={['cognitive']}
              />
            </Form>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QuestionConfigModal;