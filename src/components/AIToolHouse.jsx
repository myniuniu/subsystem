import React, { useState, useEffect } from 'react'
import {
  Card,
  Input,
  Button,
  Tag,
  Avatar,
  Typography,
  Row,
  Col,
  Select,
  Empty,
  message,
  Modal,
  Rate,
  Descriptions,
  Badge,
  Tooltip,
  Space,
  Divider
} from 'antd'
import {
  SearchOutlined,
  StarFilled,
  StarOutlined,
  PlusOutlined,
  CheckOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  RobotOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  GiftOutlined
} from '@ant-design/icons'
import { AI_TOOL_CATEGORIES, AI_TOOL_CATEGORY_LABELS, AI_TOOL_STATUS } from '../constants/noteEditConstants'
import './AIToolHouse.css'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

const AIToolHouse = ({ onAddToOperationPanel }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [favoriteTools, setFavoriteTools] = useState(() => {
    const saved = localStorage.getItem('favorite-ai-tools')
    return saved ? JSON.parse(saved) : []
  })
  const [addedTools, setAddedTools] = useState(() => {
    const saved = localStorage.getItem('added-ai-tools-to-panel')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedTool, setSelectedTool] = useState(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)

  // 社区AI工具数据
  const aiTools = [
    {
      id: 'smart-writer',
      name: '智能写作助手',
      description: '基于GPT技术的智能写作工具，支持文章生成、润色、翻译等功能',
      category: AI_TOOL_CATEGORIES.WRITING,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '教育AI团队',
      version: 'v2.1.0',
      rating: 4.8,
      downloads: 12580,
      tags: ['写作', 'GPT', '润色', '翻译'],
      icon: '✍️',
      color: '#52c41a',
      featured: true,
      menuConfig: {
        key: 'smart-writer',
        title: '智能写作',
        icon: '✍',
        gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        color: '#52c41a'
      },
      features: [
        '支持多种文体写作',
        '智能语法检查',
        '多语言翻译',
        '文本润色优化',
        '创意灵感生成'
      ],
      usage: '在操作面板中点击智能写作工具，输入写作需求即可获得AI辅助'
    },
    {
      id: 'data-analyst',
      name: '数据分析大师',
      description: '强大的数据分析和可视化工具，支持多种图表生成和统计分析',
      category: AI_TOOL_CATEGORIES.ANALYSIS,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '数据科学实验室',
      version: 'v1.8.3',
      rating: 4.7,
      downloads: 8960,
      tags: ['数据分析', '可视化', '统计', '图表'],
      icon: '📊',
      color: '#722ed1',
      featured: true,
      menuConfig: {
        key: 'data-analyst',
        title: '数据分析',
        icon: '📊',
        gradient: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
        color: '#722ed1'
      },
      features: [
        '智能数据清洗',
        '多维度统计分析',
        '交互式图表生成',
        '趋势预测分析',
        '报告自动生成'
      ],
      usage: '上传数据文件，选择分析维度，AI将自动生成分析报告和可视化图表'
    },
    {
      id: 'teaching-assistant',
      name: '教学智能助手',
      description: '专为教育工作者设计的AI助手，支持课程设计、题目生成、学情分析',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智慧教育研发组',
      version: 'v1.0.2',
      rating: 4.9,
      downloads: 15620,
      tags: ['教学', '课程设计', '题目生成', '学情分析'],
      icon: '🎓',
      color: '#fa8c16',
      featured: true,
      menuConfig: {
        key: 'teaching-assistant',
        title: '教学助手',
        icon: '🎓',
        gradient: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
        color: '#fa8c16'
      },
      features: [
        '智能课程大纲生成',
        '个性化题目创建',
        '学生学习分析',
        '教学资源推荐',
        '作业批改辅助'
      ],
      usage: '输入教学主题和要求，AI将生成完整的教学方案和配套资源'
    },
    {
      id: 'creative-designer',
      name: '创意设计师',
      description: 'AI驱动的创意设计工具，支持图像生成、LOGO设计、海报制作',
      category: AI_TOOL_CATEGORIES.CREATIVE,
      status: AI_TOOL_STATUS.BETA,
      author: '创意工作室',
      version: 'v0.9.1',
      rating: 4.5,
      downloads: 6780,
      tags: ['设计', '创意', '图像生成', 'LOGO'],
      icon: '🎨',
      color: '#eb2f96',
      featured: false,
      menuConfig: {
        key: 'creative-designer',
        title: '创意设计',
        icon: '🎨',
        gradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
        color: '#eb2f96'
      },
      features: [
        'AI图像生成',
        '智能LOGO设计',
        '海报模板定制',
        '配色方案推荐',
        '设计风格转换'
      ],
      usage: '描述设计需求，选择风格偏好，AI将生成多个设计方案供选择'
    },
    {
      id: 'efficiency-master',
      name: '效率提升大师',
      description: '全能的效率工具集，包含时间管理、任务规划、自动化处理等功能',
      category: AI_TOOL_CATEGORIES.PRODUCTIVITY,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '效率优化团队',
      version: 'v3.2.1',
      rating: 4.6,
      downloads: 9840,
      tags: ['效率', '时间管理', '任务规划', '自动化'],
      icon: '⚡',
      color: '#13c2c2',
      featured: false,
      menuConfig: {
        key: 'efficiency-master',
        title: '效率大师',
        icon: '⚡',
        gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
        color: '#13c2c2'
      },
      features: [
        '智能任务分解',
        '时间分配优化',
        '工作流程自动化',
        '进度实时跟踪',
        '效率报告生成'
      ],
      usage: '设定工作目标，AI将智能分解任务并优化时间安排'
    },
    {
      id: 'research-helper',
      name: '学术研究助手',
      description: '专业的学术研究工具，支持文献检索、论文分析、引用管理',
      category: AI_TOOL_CATEGORIES.RESEARCH,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '学术研究中心',
      version: 'v2.0.5',
      rating: 4.7,
      downloads: 5620,
      tags: ['学术', '研究', '文献', '论文'],
      icon: '🔬',
      color: '#f5222d',
      featured: false,
      menuConfig: {
        key: 'research-helper',
        title: '研究助手',
        icon: '🔬',
        gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
        color: '#f5222d'
      },
      features: [
        '智能文献检索',
        '论文结构分析',
        '引用格式管理',
        '研究趋势分析',
        '学术写作辅助'
      ],
      usage: '输入研究领域和关键词，AI将提供相关文献和研究建议'
    },
    {
      id: 'code-generator',
      name: '代码生成器',
      description: '智能代码生成和优化工具，支持多种编程语言和框架',
      category: AI_TOOL_CATEGORIES.PRODUCTIVITY,
      status: AI_TOOL_STATUS.NEW,
      author: '开发者联盟',
      version: 'v1.1.0',
      rating: 4.4,
      downloads: 7230,
      tags: ['编程', '代码生成', '优化', '多语言'],
      icon: '💻',
      color: '#1890ff',
      featured: true,
      menuConfig: {
        key: 'code-generator',
        title: '代码生成',
        icon: '💻',
        gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
        color: '#1890ff'
      },
      features: [
        '自然语言转代码',
        '代码智能补全',
        '错误检测修复',
        '性能优化建议',
        '多语言支持'
      ],
      usage: '描述功能需求，选择编程语言，AI将生成对应的代码实现'
    },
    {
      id: 'translation-pro',
      name: '专业翻译家',
      description: '高精度的多语言翻译工具，支持文档翻译和实时对话翻译',
      category: AI_TOOL_CATEGORIES.WRITING,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '语言技术团队',
      version: 'v2.3.2',
      rating: 4.8,
      downloads: 18750,
      tags: ['翻译', '多语言', '文档', '实时'],
      icon: '🌐',
      color: '#52c41a',
      featured: false,
      menuConfig: {
        key: 'translation-pro',
        title: '专业翻译',
        icon: '🌐',
        gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
        color: '#52c41a'
      },
      features: [
        '99种语言支持',
        '专业术语识别',
        '文档格式保持',
        '语音实时翻译',
        '翻译质量评估'
      ],
      usage: '上传文档或输入文本，选择目标语言，AI将提供高质量翻译'
    }
  ]

  // 状态选项
  const statusOptions = [
    { value: 'all', label: '全部状态' },
    { value: AI_TOOL_STATUS.ACTIVE, label: '✅ 稳定版' },
    { value: AI_TOOL_STATUS.NEW, label: '🆕 最新版' },
    { value: AI_TOOL_STATUS.BETA, label: '🧪 测试版' },
    { value: AI_TOOL_STATUS.DEPRECATED, label: '⚠️ 已废弃' }
  ]

  // 筛选工具
  const filteredTools = aiTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || tool.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // 切换收藏状态
  const toggleFavorite = (toolId) => {
    const newFavorites = favoriteTools.includes(toolId)
      ? favoriteTools.filter(id => id !== toolId)
      : [...favoriteTools, toolId]
    
    setFavoriteTools(newFavorites)
    localStorage.setItem('favorite-ai-tools', JSON.stringify(newFavorites))
    
    const tool = aiTools.find(t => t.id === toolId)
    message.success(newFavorites.includes(toolId) 
      ? `已收藏 ${tool.name}` 
      : `已取消收藏 ${tool.name}`
    )
  }

  // 添加工具到操作面板
  const addToOperationPanel = (tool) => {
    try {
      const newAddedTools = [...addedTools, tool.id]
      setAddedTools(newAddedTools)
      localStorage.setItem('added-ai-tools-to-panel', JSON.stringify(newAddedTools))
      
      // 保存AI工具配置信息
      const aiToolsConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}')
      aiToolsConfig[tool.id] = tool.menuConfig
      localStorage.setItem('ai-tools-config', JSON.stringify(aiToolsConfig))
      
      // 触发自定义事件通知操作面板更新
      window.dispatchEvent(new Event('aiToolsChanged'))
      
      // 调用传入的回调函数，将工具添加到操作面板
      if (onAddToOperationPanel) {
        onAddToOperationPanel(tool.menuConfig)
      }
      
      message.success(`${tool.name} 已添加到操作面板`)
    } catch (error) {
      message.error('添加失败，请重试')
    }
  }

  // 从操作面板移除工具
  const removeFromOperationPanel = (tool) => {
    try {
      const newAddedTools = addedTools.filter(id => id !== tool.id)
      setAddedTools(newAddedTools)
      localStorage.setItem('added-ai-tools-to-panel', JSON.stringify(newAddedTools))
      
      // 从配置中移除工具
      const aiToolsConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}')
      delete aiToolsConfig[tool.id]
      localStorage.setItem('ai-tools-config', JSON.stringify(aiToolsConfig))
      
      // 触发自定义事件通知操作面板更新
      window.dispatchEvent(new Event('aiToolsChanged'))
      
      message.success(`${tool.name} 已从操作面板移除`)
    } catch (error) {
      message.error('移除失败，请重试')
    }
  }

  // 检查工具是否已添加
  const isToolAdded = (toolId) => {
    return addedTools.includes(toolId)
  }

  // 显示工具详情
  const showToolDetail = (tool) => {
    setSelectedTool(tool)
    setDetailModalVisible(true)
  }

  // 获取状态标签
  const getStatusBadge = (status) => {
    const statusConfig = {
      [AI_TOOL_STATUS.ACTIVE]: { color: 'green', text: '稳定' },
      [AI_TOOL_STATUS.NEW]: { color: 'blue', text: '最新' },
      [AI_TOOL_STATUS.BETA]: { color: 'orange', text: '测试' },
      [AI_TOOL_STATUS.DEPRECATED]: { color: 'red', text: '废弃' }
    }
    const config = statusConfig[status] || { color: 'default', text: '未知' }
    return <Badge status={config.color} text={config.text} />
  }

  return (
    <div className="ai-tool-house">
      <div className="ai-tool-house-header">
        <div className="header-title">
          <RobotOutlined className="header-icon" />
          <Title level={2} style={{ color: '#262626', margin: 0 }}>AI工具屋</Title>
          <Tag color="gold" style={{ marginLeft: 8 }}>社区贡献</Tag>
        </div>
        <Paragraph type="secondary" style={{ margin: '8px 0 0 0' }}>
          发现社区贡献的优质AI工具，一键添加到小黑屋操作面板
        </Paragraph>
      </div>

      <div className="ai-tool-house-filters">
        <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="搜索AI工具名称、描述或标签"
              allowClear
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
            />
          </Col>
          <Col>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              size="large"
              style={{ width: 140 }}
            >
              {Object.entries(AI_TOOL_CATEGORY_LABELS).map(([key, config]) => (
                <Option key={key} value={key}>
                  <Space>
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              size="large"
              style={{ width: 120 }}
            >
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      <div className="ai-tool-house-content">
        {/* 推荐工具区域 */}
        <div className="featured-tools">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <FireOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
            <Title level={3} style={{ margin: 0 }}>热门推荐</Title>
          </div>
          <Row gutter={[16, 16]}>
            {aiTools.filter(tool => tool.featured).map(tool => (
              <Col key={tool.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  className="ai-tool-card featured"
                  hoverable
                  cover={
                    <div className="tool-cover">
                      <div className="tool-icon" style={{ color: tool.color }}>
                        {tool.icon}
                      </div>
                      <div className="tool-badges">
                        {tool.featured && (
                          <Tag color="gold" size="small" icon={<CrownOutlined />}>
                            推荐
                          </Tag>
                        )}
                        {tool.status === AI_TOOL_STATUS.NEW && (
                          <Tag color="blue" size="small">
                            最新
                          </Tag>
                        )}
                      </div>
                    </div>
                  }
                  actions={[
                    <Tooltip title={favoriteTools.includes(tool.id) ? '取消收藏' : '收藏工具'}>
                      <Button
                        key="favorite"
                        type="text"
                        size="small"
                        icon={favoriteTools.includes(tool.id) ? <HeartFilled /> : <HeartOutlined />}
                        onClick={() => toggleFavorite(tool.id)}
                        style={{ color: favoriteTools.includes(tool.id) ? '#eb2f96' : undefined }}
                      />
                    </Tooltip>,
                    <Tooltip title="查看详情">
                      <Button
                        key="detail"
                        type="text"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => showToolDetail(tool)}
                      />
                    </Tooltip>,
                    isToolAdded(tool.id) ? (
                      <Tooltip title="已添加到操作面板">
                        <Button
                          key="added"
                          type="text"
                          size="small"
                          icon={<CheckOutlined />}
                          onClick={() => removeFromOperationPanel(tool)}
                          style={{ color: '#52c41a' }}
                        >
                          已添加
                        </Button>
                      </Tooltip>
                    ) : (
                      <Tooltip title="添加到操作面板">
                        <Button
                          key="add"
                          type="primary"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={() => addToOperationPanel(tool)}
                        >
                          添加
                        </Button>
                      </Tooltip>
                    )
                  ]}
                >
                  <div className="tool-info">
                    <div className="tool-header">
                      <h4 className="tool-name">{tool.name}</h4>
                      {getStatusBadge(tool.status)}
                    </div>
                    <div className="tool-description">
                      {tool.description}
                    </div>
                    <div className="tool-meta">
                      <div className="tool-rating">
                        <Rate disabled defaultValue={tool.rating} style={{ fontSize: 12 }} />
                        <span className="rating-text">{tool.rating}</span>
                      </div>
                      <div className="tool-downloads">
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {tool.downloads.toLocaleString()} 下载
                        </Text>
                      </div>
                    </div>
                    <div className="tool-tags">
                      {tool.tags.slice(0, 3).map(tag => (
                        <Tag key={tag} size="small" color={tool.color}>{tag}</Tag>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Divider />

        {/* 全部工具区域 */}
        <div className="all-tools">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ThunderboltOutlined style={{ color: '#1890ff', marginRight: 8 }} />
              <Title level={3} style={{ margin: 0 }}>全部工具</Title>
              <Text type="secondary" style={{ marginLeft: 8 }}>({filteredTools.length})</Text>
            </div>
          </div>
          
          {filteredTools.length === 0 ? (
            <Empty
              description="没有找到匹配的AI工具"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: '40px 0' }}
            />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredTools.map(tool => (
                <Col key={tool.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    className="ai-tool-card"
                    hoverable
                    cover={
                      <div className="tool-cover">
                        <div className="tool-icon" style={{ color: tool.color }}>
                          {tool.icon}
                        </div>
                        <div className="tool-badges">
                          {tool.featured && (
                            <Tag color="gold" size="small" icon={<CrownOutlined />}>
                              推荐
                            </Tag>
                          )}
                          {tool.status === AI_TOOL_STATUS.NEW && (
                            <Tag color="blue" size="small">
                              最新
                            </Tag>
                          )}
                          {tool.status === AI_TOOL_STATUS.BETA && (
                            <Tag color="orange" size="small">
                              测试
                            </Tag>
                          )}
                        </div>
                      </div>
                    }
                    actions={[
                      <Tooltip title={favoriteTools.includes(tool.id) ? '取消收藏' : '收藏工具'}>
                        <Button
                          key="favorite"
                          type="text"
                          size="small"
                          icon={favoriteTools.includes(tool.id) ? <HeartFilled /> : <HeartOutlined />}
                          onClick={() => toggleFavorite(tool.id)}
                          style={{ color: favoriteTools.includes(tool.id) ? '#eb2f96' : undefined }}
                        />
                      </Tooltip>,
                      <Tooltip title="查看详情">
                        <Button
                          key="detail"
                          type="text"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => showToolDetail(tool)}
                        />
                      </Tooltip>,
                      isToolAdded(tool.id) ? (
                        <Tooltip title="已添加到操作面板">
                          <Button
                            key="added"
                            type="text"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={() => removeFromOperationPanel(tool)}
                            style={{ color: '#52c41a' }}
                          >
                            已添加
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip title="添加到操作面板">
                          <Button
                            key="add"
                            type="primary"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => addToOperationPanel(tool)}
                          >
                            添加
                          </Button>
                        </Tooltip>
                      )
                    ]}
                  >
                    <div className="tool-info">
                      <div className="tool-header">
                        <h4 className="tool-name">{tool.name}</h4>
                        {getStatusBadge(tool.status)}
                      </div>
                      <div className="tool-description">
                        {tool.description}
                      </div>
                      <div className="tool-meta">
                        <div className="tool-rating">
                          <Rate disabled defaultValue={tool.rating} style={{ fontSize: 12 }} />
                          <span className="rating-text">{tool.rating}</span>
                        </div>
                        <div className="tool-downloads">
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {tool.downloads.toLocaleString()} 下载
                          </Text>
                        </div>
                      </div>
                      <div className="tool-tags">
                        {tool.tags.slice(0, 3).map(tag => (
                          <Tag key={tag} size="small" color={tool.color}>{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>

      {/* 工具详情弹窗 */}
      <Modal
        title={(
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24, color: selectedTool?.color }}>
              {selectedTool?.icon}
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>{selectedTool?.name}</Title>
              <Text type="secondary">by {selectedTool?.author}</Text>
            </div>
          </div>
        )}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          isToolAdded(selectedTool?.id) ? (
            <Button 
              key="added" 
              type="default" 
              icon={<CheckOutlined />}
              onClick={() => {
                removeFromOperationPanel(selectedTool)
                setDetailModalVisible(false)
              }}
              style={{ color: '#52c41a' }}
            >
              已添加到操作面板
            </Button>
          ) : (
            <Button 
              key="add" 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                addToOperationPanel(selectedTool)
                setDetailModalVisible(false)
              }}
            >
              添加到操作面板
            </Button>
          )
        ]}
        width={700}
      >
        {selectedTool && (
          <div className="tool-detail">
            <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="版本">{selectedTool.version}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusBadge(selectedTool.status)}</Descriptions.Item>
              <Descriptions.Item label="评分">
                <Rate disabled defaultValue={selectedTool.rating} style={{ fontSize: 14 }} />
                <span style={{ marginLeft: 8 }}>{selectedTool.rating}</span>
              </Descriptions.Item>
              <Descriptions.Item label="下载量">
                {selectedTool.downloads.toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>工具描述</Title>
              <Paragraph>{selectedTool.description}</Paragraph>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>主要功能</Title>
              <ul>
                {selectedTool.features?.map((feature, index) => (
                  <li key={index} style={{ marginBottom: 4 }}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>使用方法</Title>
              <Paragraph>{selectedTool.usage}</Paragraph>
            </div>
            
            <div>
              <Title level={5}>标签</Title>
              <div>
                {selectedTool.tags?.map(tag => (
                  <Tag key={tag} color={selectedTool.color}>{tag}</Tag>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AIToolHouse