import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Modal, 
  Upload, 
  message,
  Tabs,
  Space,
  Tooltip,
  Badge,
  Avatar,
  Rate,
  Dropdown,
  Menu,
  Pagination,
  Empty,
  Spin,
  Divider,
  Typography,
  Statistic,
  Progress,
  Form,
  DatePicker,
  Switch,
  Radio,
  Checkbox,
  InputNumber,
  TreeSelect,
  Table,
  List,
  Timeline,
  Steps
} from 'antd'
import { 
  Plus, 
  Edit, 
  Delete, 
  Upload as UploadIcon, 
  Search, 
  Filter,
  Download,
  Share2,
  Star,
  Clock,
  User,
  Tag as TagIcon,
  Settings,
  Eye,
  Play,
  Users,
  Award,
  TrendingUp,
  BookOpen,
  Heart,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Image,
  Video,
  Headphones,
  Code,
  Globe
} from 'lucide-react'
import './SimulationPlatform.css'
import scenarioService, { SCENARIO_STATUS, DIFFICULTY_LEVELS, SCENARIO_CATEGORIES, SUBJECTS } from '../services/scenarioService'

const { Search: AntSearch } = Input
const { Option } = Select
const { Title, Text, Paragraph } = Typography
const { Step } = Steps

const SimulationPlatform = ({ onViewChange }) => {
  const [activeTab, setActiveTab] = useState('discover')
  const [loading, setLoading] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [publishModalVisible, setPublishModalVisible] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [form] = Form.useForm()
  const [publishForm] = Form.useForm()
  
  // 场景数据状态
  const [userScenarios, setUserScenarios] = useState([])
  const [allScenarios, setAllScenarios] = useState([])
  

  
  // 平台统计数据
  const [platformStats, setPlatformStats] = useState({
    totalScenarios: 0,
    totalContributors: 0,
    totalDownloads: 0,
    monthlyActive: 0
  })
  
  // 贡献者排行榜
  const [topContributors, setTopContributors] = useState([])
  
  // 场景分类选项
  const categoryOptions = [
    { value: SCENARIO_CATEGORIES.SCIENCE_DEMO, label: '教学科学演示', color: '#f5222d' },
    { value: SCENARIO_CATEGORIES.PSYCHOLOGY, label: '学生心理', color: '#52c41a' },
    { value: SCENARIO_CATEGORIES.FAMILY, label: '家庭教育', color: '#1890ff' },
    { value: SCENARIO_CATEGORIES.TEACHER, label: '教师培训', color: '#722ed1' },
    { value: SCENARIO_CATEGORIES.MANAGEMENT, label: '班级管理', color: '#fa8c16' },
    { value: SCENARIO_CATEGORIES.LEADERSHIP, label: '学校管理', color: '#eb2f96' },
    { value: SCENARIO_CATEGORIES.SPECIAL, label: '特殊教育', color: '#13c2c2' }
  ]
  
  // 学科选项
  const subjectOptions = [
    { value: SUBJECTS.MATH, label: '数学' },
    { value: SUBJECTS.PHYSICS, label: '物理' },
    { value: SUBJECTS.CHEMISTRY, label: '化学' },
    { value: SUBJECTS.BIOLOGY, label: '生物' },
    { value: SUBJECTS.GEOGRAPHY, label: '地理' },
    { value: SUBJECTS.HISTORY, label: '历史' },
    { value: SUBJECTS.LANGUAGE, label: '语言文学' },
    { value: SUBJECTS.ART, label: '艺术' },
    { value: SUBJECTS.OTHER, label: '其他' }
  ]
  
  // 难度等级选项
  const difficultyOptions = [
    { value: DIFFICULTY_LEVELS.EASY, label: '初级', color: '#52c41a' },
    { value: DIFFICULTY_LEVELS.MEDIUM, label: '中级', color: '#fa8c16' },
    { value: DIFFICULTY_LEVELS.HARD, label: '高级', color: '#f5222d' }
  ]
  
  // 许可证选项
  const licenseOptions = [
    { value: 'CC BY 4.0', label: 'CC BY 4.0 - 署名' },
    { value: 'CC BY-SA 4.0', label: 'CC BY-SA 4.0 - 署名-相同方式共享' },
    { value: 'CC BY-NC 4.0', label: 'CC BY-NC 4.0 - 署名-非商业性使用' },
    { value: 'CC BY-NC-SA 4.0', label: 'CC BY-NC-SA 4.0 - 署名-非商业性使用-相同方式共享' },
    { value: 'MIT', label: 'MIT License' },
    { value: 'GPL-3.0', label: 'GPL-3.0 License' },
    { value: 'Custom', label: '自定义许可证' }
  ]
  
  // 初始化数据加载
  useEffect(() => {
    loadInitialData()
  }, [])
  
  // 强制刷新数据
  const refreshData = async () => {
    console.log('开始刷新数据...')
    await loadInitialData()
    message.success('数据已刷新')
  }
  
  // 加载初始数据
  const loadInitialData = async () => {
    setLoading(true)
    try {
      console.log('=== 开始加载数据 ===')
      
      // 并行加载数据
      const [userScenariosRes, allScenariosRes, statsRes, contributorsRes] = await Promise.all([
        scenarioService.getUserScenarios(),
        scenarioService.getAllScenarios({ status: SCENARIO_STATUS.PUBLISHED }),
        scenarioService.getPlatformStats(),
        scenarioService.getTopContributors(5)
      ])
      
      console.log('用户场景数据:', userScenariosRes)
      console.log('所有场景数据:', allScenariosRes)
      
      if (userScenariosRes.success) {
        console.log('设置用户场景:', userScenariosRes.data.length, '个场景')
        console.log('用户场景详情:', userScenariosRes.data.map(s => ({ id: s.id, title: s.title, authorId: s.authorId })))
        setUserScenarios(userScenariosRes.data)
      } else {
        console.error('获取用户场景失败:', userScenariosRes.error)
      }
      
      if (allScenariosRes.success) {
        console.log('设置所有场景:', allScenariosRes.data.length, '个场景')
        setAllScenarios(allScenariosRes.data)
      } else {
        console.error('获取所有场景失败:', allScenariosRes.error)
      }
      
      if (statsRes.success) {
        setPlatformStats(statsRes.data)
      }
      
      if (contributorsRes.success) {
        setTopContributors(contributorsRes.data)
      }
      
      console.log('=== 数据加载完成 ===')
    } catch (error) {
      console.error('加载数据失败:', error)
      message.error('加载数据失败，请刷新页面重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 获取状态标签
  const getStatusTag = (status) => {
    const statusMap = {
      [SCENARIO_STATUS.DRAFT]: { color: '#d9d9d9', text: '草稿', icon: <Edit size={12} /> },
      [SCENARIO_STATUS.REVIEW]: { color: '#fa8c16', text: '审核中', icon: <AlertCircle size={12} /> },
      [SCENARIO_STATUS.PUBLISHED]: { color: '#52c41a', text: '已发布', icon: <CheckCircle size={12} /> },
      [SCENARIO_STATUS.REJECTED]: { color: '#f5222d', text: '已拒绝', icon: <XCircle size={12} /> }
    }
    const config = statusMap[status] || statusMap[SCENARIO_STATUS.DRAFT]
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    )
  }
  
  // 获取贡献者等级标签
  const getLevelTag = (level) => {
    const levelMap = {
      beginner: { color: '#87d068', text: '新手', icon: '🌱' },
      intermediate: { color: '#1890ff', text: '进阶', icon: '⭐' },
      advanced: { color: '#722ed1', text: '高级', icon: '💎' },
      expert: { color: '#fa8c16', text: '专家', icon: '👑' }
    }
    const config = levelMap[level] || levelMap.beginner
    return (
      <Tag color={config.color} style={{ borderRadius: '12px', fontSize: '11px' }}>
        <span style={{ marginRight: 2 }}>{config.icon}</span>
        {config.text}
      </Tag>
    )
  }
  
  // 格式化数字显示
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }
  
  // 获取贡献者专业标签颜色
  const getSpecialtyColor = (specialty) => {
    const colorMap = {
      '数学教育': '#1890ff',
      '化学研究': '#52c41a',
      '物理仿真': '#722ed1',
      '生物医学': '#fa541c',
      '管理咨询': '#faad14',
      '教育专家': '#13c2c2'
    }
    return colorMap[specialty] || '#8c8c8c'
  }
  
  // 处理场景创建
  const handleCreateScenario = async (values) => {
    setLoading(true)
    try {
      const result = await scenarioService.createScenario(values)
      
      if (result.success) {
        setUserScenarios(prev => [result.data, ...prev])
        setCreateModalVisible(false)
        form.resetFields()
        message.success(result.message || '场景创建成功！')
      } else {
        message.error(result.error || '创建失败，请重试')
      }
    } catch (error) {
      console.error('创建场景失败:', error)
      message.error('创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 处理场景发布
  const handlePublishScenario = async (values) => {
    setLoading(true)
    try {
      const result = await scenarioService.publishScenario(selectedScenario.id, values)
      
      if (result.success) {
        setUserScenarios(prev => 
          prev.map(scenario => 
            scenario.id === selectedScenario.id 
              ? result.data
              : scenario
          )
        )
        
        setPublishModalVisible(false)
        publishForm.resetFields()
        setSelectedScenario(null)
        message.success(result.message || '场景已提交审核！')
      } else {
        message.error(result.error || '提交失败，请重试')
      }
    } catch (error) {
      console.error('发布场景失败:', error)
      message.error('提交失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 渲染场景卡片
  const renderScenarioCard = (scenario) => (
    <Card
      key={scenario.id}
      hoverable
      className="scenario-card"
      cover={
        <div className="scenario-cover">
          <img 
            alt={scenario.title}
            src={scenario.thumbnail || '/images/default-scenario.svg'}
            style={{ height: 200, objectFit: 'cover' }}
          />
          <div className="scenario-overlay">
            <Space>
              <Button type="primary" icon={<Eye size={16} />} size="small">
                预览
              </Button>
              <Button icon={<Edit size={16} />} size="small">
                编辑
              </Button>
              {scenario.status === SCENARIO_STATUS.DRAFT && (
                <Button 
                  icon={<Upload size={16} />} 
                  size="small"
                  onClick={() => {
                    setSelectedScenario(scenario)
                    setPublishModalVisible(true)
                  }}
                >
                  发布
                </Button>
              )}
            </Space>
          </div>
        </div>
      }
      actions={[
        <Tooltip title="浏览量">
          <Space>
            <Eye size={14} />
            <span>{scenario.views}</span>
          </Space>
        </Tooltip>,
        <Tooltip title="点赞数">
          <Space>
            <Heart size={14} />
            <span>{scenario.likes}</span>
          </Space>
        </Tooltip>,
        <Tooltip title="下载量">
          <Space>
            <Download size={14} />
            <span>{scenario.downloads}</span>
          </Space>
        </Tooltip>
      ]}
    >
      <Card.Meta
        title={
          <div className="scenario-title">
            <span>{scenario.title}</span>
            {getStatusTag(scenario.status)}
          </div>
        }
        description={
          <div className="scenario-description">
            <Paragraph ellipsis={{ rows: 2 }}>
              {scenario.description}
            </Paragraph>
            <div className="scenario-meta">
              <Space wrap>
                <Tag color="blue">{scenario.difficulty === DIFFICULTY_LEVELS.EASY ? '初级' : scenario.difficulty === DIFFICULTY_LEVELS.MEDIUM ? '中级' : '高级'}</Tag>
                <Tag color="green">{scenario.duration}</Tag>
                {scenario.subject && <Tag color="purple">{subjectOptions.find(s => s.value === scenario.subject)?.label}</Tag>}
              </Space>
              <div className="scenario-author">
                <Space>
                  <Avatar size="small" icon={<User size={12} />} />
                  <Text type="secondary">{scenario.author}</Text>
                  <Text type="secondary">•</Text>
                  <Text type="secondary">{scenario.createTime}</Text>
                </Space>
              </div>
              {scenario.rating > 0 && (
                <div className="scenario-rating">
                  <Rate disabled defaultValue={scenario.rating} size="small" />
                  <Text type="secondary">({scenario.reviewCount})</Text>
                </div>
              )}
            </div>
          </div>
        }
      />
    </Card>
  )
  
  return (
    <div className="simulation-platform">
      <div className="platform-header">
        <div className="header-content">
          <div className="header-info">
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              模拟仿真开放平台
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#666' }}>
              创建、分享和发现优质教学场景，共建教育仿真生态
            </Paragraph>
          </div>
          <div className="header-stats">
            <Row gutter={24}>
              <Col>
                <Statistic title="总场景数" value={platformStats.totalScenarios} prefix={<BookOpen size={16} />} />
              </Col>
              <Col>
                <Statistic title="贡献者" value={platformStats.totalContributors} prefix={<Users size={16} />} />
              </Col>
              <Col>
                <Statistic title="总下载" value={platformStats.totalDownloads} prefix={<Download size={16} />} />
              </Col>
              <Col>
                <Statistic title="月活跃" value={platformStats.monthlyActive} prefix={<TrendingUp size={16} />} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
      
      <div className="platform-content">
        {/* 调试信息 */}
        <div style={{ marginBottom: 16, padding: 12, background: '#f0f2f5', borderRadius: 6, fontSize: 12, color: '#666' }}>
          当前活跃页签: {activeTab}
        </div>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => {
            console.log('页签切换:', activeTab, '->', key)
            setActiveTab(key)
          }}
          size="large"
          destroyInactiveTabPane={true}
          tabBarExtraContent={
            <Button 
              type="primary" 
              icon={<Plus size={16} />}
              onClick={() => setCreateModalVisible(true)}
            >
              贡献场景
            </Button>
          }
          items={[
            {
              key: 'discover',
              label: <span><Globe size={16} style={{ marginRight: 8 }} />发现</span>,
              children: (
                <div className="discover-content">
                  <Row gutter={[24, 24]}>
                    <Col span={18}>
                      <div className="featured-scenarios">
                        <Title level={3}>精选场景 ({allScenarios.length}个)</Title>
                        
                        <Row gutter={[16, 16]}>
                          {allScenarios.map(scenario => (
                            <Col key={scenario.id} xs={24} sm={12} lg={8}>
                              {renderScenarioCard(scenario)}
                            </Col>
                          ))}
                        </Row>
                        
                        {allScenarios.length === 0 && (
                          <Empty 
                            description="暂无已发布的场景"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          >
                            <Button type="primary" icon={<Plus size={16} />} onClick={() => setCreateModalVisible(true)}>
                              创建第一个场景
                            </Button>
                          </Empty>
                        )}
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="sidebar-content">
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                          {/* 平台统计 */}
                          <Card title="平台统计" size="small">
                            <Row gutter={16}>
                              <Col span={12}>
                                <Statistic title="本月新增" value={28} suffix="个场景" />
                              </Col>
                              <Col span={12}>
                                <Statistic title="活跃贡献者" value={52} suffix="人" />
                              </Col>
                            </Row>
                            <Divider />
                            <Row gutter={16}>
                              <Col span={12}>
                                <Statistic title="平均评分" value={4.7} suffix="/ 5.0" />
                              </Col>
                              <Col span={12}>
                                <Statistic title="总评价数" value={1456} suffix="条" />
                              </Col>
                            </Row>
                            <Divider />
                            <Row gutter={16}>
                              <Col span={12}>
                                <Statistic title="今日访问" value={892} suffix="次" />
                              </Col>
                              <Col span={12}>
                                <Statistic title="新增讨论" value={15} suffix="个" />
                              </Col>
                            </Row>
                          </Card>

                          {/* 活跃话题 */}
                          <Card title="活跃话题" size="small">
                            <List
                              size="small"
                              dataSource={[
                                { title: 'VR技术在教学中的应用', count: 45, trend: 'up' },
                                { title: '如何设计互动性更强的场景', count: 32, trend: 'up' },
                                { title: '物理仿真的精度问题', count: 28, trend: 'down' },
                                { title: '跨学科场景设计思路', count: 21, trend: 'up' }
                              ]}
                              renderItem={(item, index) => (
                                <List.Item style={{ padding: '8px 0', borderBottom: index === 3 ? 'none' : undefined }}>
                                  <div style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Text style={{ fontSize: '12px' }} ellipsis={{ tooltip: item.title }}>
                                        {item.title}
                                      </Text>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <span style={{ fontSize: '11px', color: '#666' }}>{item.count}</span>
                                        {item.trend === 'up' ? 
                                          <TrendingUp size={10} style={{ color: '#52c41a' }} /> : 
                                          <TrendingUp size={10} style={{ color: '#ff4d4f', transform: 'rotate(180deg)' }} />
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </List.Item>
                              )}
                            />
                          </Card>
                          
                          {/* 热门标签 */}
                          <Card title="热门标签" size="small">
                            <Space wrap>
                              <Tag color="magenta">VR/AR</Tag>
                              <Tag color="red">物理实验</Tag>
                              <Tag color="volcano">化学反应</Tag>
                              <Tag color="orange">数学几何</Tag>
                              <Tag color="gold">生物结构</Tag>
                              <Tag color="lime">地理地形</Tag>
                              <Tag color="green">历史文物</Tag>
                              <Tag color="cyan">语言学习</Tag>
                              <Tag color="blue">编程教学</Tag>
                              <Tag color="purple">艺术设计</Tag>
                            </Space>
                          </Card>

                          {/* 本周之星 */}
                          <Card title="本周之星" size="small">
                            <div style={{ textAlign: 'center', padding: '16px 0' }}>
                              <Avatar size={48} style={{ backgroundColor: '#faad14', marginBottom: 8 }}>王</Avatar>
                              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: 4 }}>王教授</div>
                              <div style={{ fontSize: '12px', color: '#666', marginBottom: 8 }}>北京师范大学</div>
                              <Tag color="gold" size="small">专家贡献者</Tag>
                              <Divider style={{ margin: '12px 0' }} />
                              <Row gutter={8}>
                                <Col span={8}>
                                  <Statistic title="场景" value={15} size="small" />
                                </Col>
                                <Col span={8}>
                                  <Statistic title="点赞" value={234} size="small" />
                                </Col>
                                <Col span={8}>
                                  <Statistic title="评分" value={4.9} size="small" />
                                </Col>
                              </Row>
                            </div>
                          </Card>
                        </Space>
                      </div>
                    </Col>
                  </Row>
                </div>
              )
            },
            {
              key: 'my-contributions',
              label: <span><User size={16} style={{ marginRight: 8 }} />我的贡献</span>,
              children: (
                <div className="my-contributions">
                  {/* 个人贡献统计概览 */}
                  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={6}>
                      <Card size="small" className="stats-card">
                        <Statistic
                          title="发布场景"
                          value={userScenarios.filter(s => s.status === 'published').length}
                          prefix={<BookOpen size={16} style={{ color: '#1890ff' }} />}
                          suffix="个"
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card size="small" className="stats-card">
                        <Statistic
                          title="总下载量"
                          value={userScenarios.reduce((sum, s) => sum + (s.downloads || 0), 0)}
                          prefix={<Download size={16} style={{ color: '#52c41a' }} />}
                          suffix="次"
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card size="small" className="stats-card">
                        <Statistic
                          title="获得点赞"
                          value={userScenarios.reduce((sum, s) => sum + (s.likes || 0), 0)}
                          prefix={<Heart size={16} style={{ color: '#f5222d' }} />}
                          suffix="个"
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card size="small" className="stats-card">
                        <Statistic
                          title="平均评分"
                          value={userScenarios.length > 0 ? 
                            (userScenarios.reduce((sum, s) => sum + (s.rating || 0), 0) / userScenarios.length).toFixed(1) : 0}
                          prefix={<Star size={16} style={{ color: '#faad14' }} />}
                          suffix="/ 5.0"
                        />
                      </Card>
                    </Col>
                  </Row>

                  {/* 成就徽章展示 */}
                  <Card title="我的成就" size="small" style={{ marginBottom: 24 }}>
                    <Space wrap>
                      <Badge.Ribbon text="新" color="red">
                        <Tag color="gold" style={{ padding: '4px 12px', fontSize: '12px' }}>
                          <Award size={14} style={{ marginRight: 4 }} />
                          活跃贡献者
                        </Tag>
                      </Badge.Ribbon>
                      <Tag color="blue" style={{ padding: '4px 12px', fontSize: '12px' }}>
                        <CheckCircle size={14} style={{ marginRight: 4 }} />
                        首次发布
                      </Tag>
                      <Tag color="green" style={{ padding: '4px 12px', fontSize: '12px' }}>
                        <TrendingUp size={14} style={{ marginRight: 4 }} />
                        人气作者
                      </Tag>
                      <Tag color="purple" style={{ padding: '4px 12px', fontSize: '12px' }}>
                        <Users size={14} style={{ marginRight: 4 }} />
                        社区之星
                      </Tag>
                    </Space>
                  </Card>

                  {/* 贡献趋势图表 */}
                  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} lg={16}>
                      <Card title="贡献趋势" size="small">
                        <div style={{ padding: '20px 0' }}>
                          <Row gutter={16}>
                            <Col span={8}>
                              <div style={{ textAlign: 'center' }}>
                                <Progress type="circle" percent={75} size={80} strokeColor="#1890ff" />
                                <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>本月活跃度</div>
                              </div>
                            </Col>
                            <Col span={8}>
                              <div style={{ textAlign: 'center' }}>
                                <Progress type="circle" percent={60} size={80} strokeColor="#52c41a" />
                                <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>质量评分</div>
                              </div>
                            </Col>
                            <Col span={8}>
                              <div style={{ textAlign: 'center' }}>
                                <Progress type="circle" percent={85} size={80} strokeColor="#faad14" />
                                <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>用户满意度</div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                      <Card title="最近活动" size="small">
                        <Timeline 
                          size="small"
                          items={[
                            {
                              color: 'green',
                              children: (
                                <div style={{ fontSize: '12px' }}>
                                  <div>发布了《数学函数图像》</div>
                                  <Text type="secondary" style={{ fontSize: '11px' }}>2小时前</Text>
                                </div>
                              )
                            },
                            {
                              color: 'blue',
                              children: (
                                <div style={{ fontSize: '12px' }}>
                                  <div>更新了《物理实验》</div>
                                  <Text type="secondary" style={{ fontSize: '11px' }}>1天前</Text>
                                </div>
                              )
                            },
                            {
                              children: (
                                <div style={{ fontSize: '12px' }}>
                                  <div>获得了新徽章</div>
                                  <Text type="secondary" style={{ fontSize: '11px' }}>3天前</Text>
                                </div>
                              )
                            }
                          ]}
                        />
                      </Card>
                    </Col>
                  </Row>

                  <div className="contributions-header">
                    <Title level={3}>我的场景 ({userScenarios.length}个)</Title>
                    <Space>
                      <Button 
                        icon={<Clock size={16} />} 
                        onClick={refreshData}
                        loading={loading}
                      >
                        刷新数据
                      </Button>
                      <AntSearch placeholder="搜索我的场景" style={{ width: 300 }} />
                      <Select defaultValue="all" style={{ width: 120 }}>
                        <Option value="all">全部状态</Option>
                        <Option value="draft">草稿</Option>
                        <Option value="review">审核中</Option>
                        <Option value="published">已发布</Option>
                        <Option value="rejected">已拒绝</Option>
                      </Select>
                    </Space>
                  </div>
                  
                  {/* 调试信息 */}
                  <div style={{ marginBottom: 16, padding: 12, background: '#f0f2f5', borderRadius: 6, fontSize: 12, color: '#666' }}>
                    调试信息: 当前用户场景数量: {userScenarios.length}, 所有场景数量: {allScenarios.length}
                  </div>
                  
                  <Row gutter={[16, 16]}>
                    {userScenarios.map(scenario => (
                      <Col key={scenario.id} xs={24} sm={12} lg={8}>
                        {renderScenarioCard(scenario)}
                      </Col>
                    ))}
                  </Row>
                  
                  {userScenarios.length === 0 && (
                    <Empty 
                      description="还没有创建任何场景"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                      <Button type="primary" icon={<Plus size={16} />} onClick={() => setCreateModalVisible(true)}>
                        创建第一个场景
                      </Button>
                    </Empty>
                  )}
                </div>
              )
            },
            {
              key: 'community',
              label: <span><Award size={16} style={{ marginRight: 8 }} />社区</span>,
              children: (
                <div className="community-content">
                  <Row gutter={[24, 24]}>
                    <Col span={16}>
                      <Space direction="vertical" style={{ width: '100%' }} size="large">
                        {/* 社区动态 */}
                        <Card title="最新动态" className="activity-card">
                          <Timeline
                            items={[
                              {
                                color: 'green',
                                children: (
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                      <Avatar size={24} style={{ backgroundColor: '#87d068' }}>张</Avatar>
                                      <strong>张老师</strong> 发布了新场景 <a href="#">《英语口语交互练习》</a>
                                      <Tag color="green" size="small">新发布</Tag>
                                    </div>
                                    <div style={{ display: 'flex', gap: 16, fontSize: '12px', color: '#666', marginLeft: 32 }}>
                                      <span><Eye size={12} /> 128 浏览</span>
                                      <span><Heart size={12} /> 23 点赞</span>
                                      <span><MessageSquare size={12} /> 5 评论</span>
                                    </div>
                                    <p className="timeline-time">2小时前</p>
                                  </div>
                                )
                              },
                              {
                                color: 'blue',
                                children: (
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                      <Avatar size={24} style={{ backgroundColor: '#1890ff' }}>李</Avatar>
                                      <strong>李教授</strong> 在 <a href="#">《数学函数图像可视化》</a> 中回复了讨论
                                    </div>
                                    <div style={{ marginLeft: 32, fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                                      "这个三角函数的动画效果很棒，建议增加更多交互功能"
                                    </div>
                                    <p className="timeline-time">3小时前</p>
                                  </div>
                                )
                              },
                              {
                                color: 'orange',
                                children: (
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                      <Avatar size={24} style={{ backgroundColor: '#fa8c16' }}>王</Avatar>
                                      <strong>王教授</strong> 获得了 <Tag color="gold">专家贡献者</Tag> 徽章
                                    </div>
                                    <div style={{ marginLeft: 32, fontSize: '12px', color: '#666' }}>
                                      累计发布15个高质量场景，获得用户一致好评
                                    </div>
                                    <p className="timeline-time">1天前</p>
                                  </div>
                                )
                              },
                              {
                                color: 'purple',
                                children: (
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                      <Avatar size={24} style={{ backgroundColor: '#722ed1' }}>刘</Avatar>
                                      <strong>刘老师</strong> 发起了话题讨论 <a href="#">"如何提高仿真场景的交互性？"</a>
                                    </div>
                                    <div style={{ display: 'flex', gap: 16, fontSize: '12px', color: '#666', marginLeft: 32 }}>
                                      <span><Users size={12} /> 12 参与</span>
                                      <span><MessageSquare size={12} /> 28 回复</span>
                                    </div>
                                    <p className="timeline-time">1天前</p>
                                  </div>
                                )
                              },
                              {
                                children: (
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                      <Avatar size={24} style={{ backgroundColor: '#52c41a' }}>系</Avatar>
                                      <strong>系统通知</strong> 平台新增了 <strong>艺术设计</strong> 和 <strong>心理学实验</strong> 分类
                                    </div>
                                    <div style={{ marginLeft: 32, fontSize: '12px', color: '#666' }}>
                                      欢迎各位老师在新分类下创建相关场景
                                    </div>
                                    <p className="timeline-time">2天前</p>
                                  </div>
                                )
                              }
                            ]}
                          />
                        </Card>

                        {/* 热门讨论 */}
                        <Card title="热门讨论" size="small">
                          <List
                            size="small"
                            dataSource={[
                              {
                                id: 1,
                                title: '如何在物理仿真中增加真实感？',
                                author: '陈教授',
                                replies: 15,
                                views: 234,
                                lastReply: '30分钟前',
                                hot: true
                              },
                              {
                                id: 2,
                                title: '数学可视化场景的最佳实践分享',
                                author: '赵老师',
                                replies: 8,
                                views: 156,
                                lastReply: '1小时前'
                              },
                              {
                                id: 3,
                                title: '化学实验安全性考虑和建议',
                                author: '孙教授',
                                replies: 12,
                                views: 189,
                                lastReply: '2小时前'
                              }
                            ]}
                            renderItem={item => (
                              <List.Item
                                actions={[
                                  <span key="replies"><MessageSquare size={12} /> {item.replies}</span>,
                                  <span key="views"><Eye size={12} /> {item.views}</span>
                                ]}
                              >
                                <List.Item.Meta
                                  title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <a href="#">{item.title}</a>
                                      {item.hot && <Tag color="red" size="small">热门</Tag>}
                                    </div>
                                  }
                                  description={
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                      <span>by {item.author}</span>
                                      <Divider type="vertical" />
                                      <span>最后回复: {item.lastReply}</span>
                                    </div>
                                  }
                                />
                              </List.Item>
                            )}
                          />
                        </Card>
                      </Space>
                    </Col>
                    <Col span={8}>
                      <Space direction="vertical" style={{ width: '100%' }} size="large">
                        {/* 在线用户 */}
                        <Card title="在线用户" size="small">
                          <div style={{ marginBottom: 12 }}>
                            <Badge status="processing" text={<span style={{ color: '#52c41a' }}>当前在线: <strong>127</strong> 人</span>} />
                          </div>
                          <Avatar.Group max={{ count: 6 }} size="small">
                            <Avatar style={{ backgroundColor: '#87d068' }}>张</Avatar>
                            <Avatar style={{ backgroundColor: '#1890ff' }}>李</Avatar>
                            <Avatar style={{ backgroundColor: '#fa8c16' }}>王</Avatar>
                            <Avatar style={{ backgroundColor: '#722ed1' }}>刘</Avatar>
                            <Avatar style={{ backgroundColor: '#52c41a' }}>陈</Avatar>
                            <Avatar style={{ backgroundColor: '#eb2f96' }}>赵</Avatar>
                            <Avatar style={{ backgroundColor: '#13c2c2' }}>+121</Avatar>
                          </Avatar.Group>
                        </Card>

                        {/* 平台统计 */}
                        <Card title="平台统计" size="small">
                          <Row gutter={16}>
                            <Col span={12}>
                              <Statistic title="本月新增" value={28} suffix="个场景" />
                            </Col>
                            <Col span={12}>
                              <Statistic title="活跃贡献者" value={52} suffix="人" />
                            </Col>
                          </Row>
                          <Divider />
                          <Row gutter={16}>
                            <Col span={12}>
                              <Statistic title="平均评分" value={4.7} suffix="/ 5.0" />
                            </Col>
                            <Col span={12}>
                              <Statistic title="总评价数" value={1456} suffix="条" />
                            </Col>
                          </Row>
                          <Divider />
                          <Row gutter={16}>
                            <Col span={12}>
                              <Statistic title="今日访问" value={892} suffix="次" />
                            </Col>
                            <Col span={12}>
                              <Statistic title="新增讨论" value={15} suffix="个" />
                            </Col>
                          </Row>
                        </Card>

                        {/* 活跃话题 */}
                        <Card title="活跃话题" size="small">
                          <List
                            size="small"
                            dataSource={[
                              { title: 'VR技术在教学中的应用', count: 45, trend: 'up' },
                              { title: '如何设计互动性更强的场景', count: 32, trend: 'up' },
                              { title: '物理仿真的精度问题', count: 28, trend: 'down' },
                              { title: '跨学科场景设计思路', count: 21, trend: 'up' }
                            ]}
                            renderItem={(item, index) => (
                              <List.Item style={{ padding: '8px 0', borderBottom: index === 3 ? 'none' : undefined }}>
                                <div style={{ width: '100%' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: '12px' }} ellipsis={{ tooltip: item.title }}>
                                      {item.title}
                                    </Text>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <span style={{ fontSize: '11px', color: '#666' }}>{item.count}</span>
                                      {item.trend === 'up' ? 
                                        <TrendingUp size={10} style={{ color: '#52c41a' }} /> : 
                                        <TrendingUp size={10} style={{ color: '#ff4d4f', transform: 'rotate(180deg)' }} />
                                      }
                                    </div>
                                  </div>
                                </div>
                              </List.Item>
                            )}
                          />
                        </Card>
                        
                        {/* 热门标签 */}
                        <Card title="热门标签" size="small">
                          <Space wrap>
                            <Tag color="magenta">VR/AR</Tag>
                            <Tag color="red">物理实验</Tag>
                            <Tag color="volcano">化学反应</Tag>
                            <Tag color="orange">数学几何</Tag>
                            <Tag color="gold">生物结构</Tag>
                            <Tag color="lime">地理地形</Tag>
                            <Tag color="green">历史文物</Tag>
                            <Tag color="cyan">语言学习</Tag>
                            <Tag color="blue">编程教学</Tag>
                            <Tag color="purple">艺术设计</Tag>
                          </Space>
                        </Card>

                        {/* 本周之星 */}
                        <Card title="本周之星" size="small">
                          <div style={{ textAlign: 'center', padding: '16px 0' }}>
                            <Avatar size={48} style={{ backgroundColor: '#faad14', marginBottom: 8 }}>王</Avatar>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: 4 }}>王教授</div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: 8 }}>北京师范大学</div>
                            <Tag color="gold" size="small">专家贡献者</Tag>
                            <Divider style={{ margin: '12px 0' }} />
                            <Row gutter={8}>
                              <Col span={8}>
                                <Statistic title="场景" value={15} size="small" />
                              </Col>
                              <Col span={8}>
                                <Statistic title="点赞" value={234} size="small" />
                              </Col>
                              <Col span={8}>
                                <Statistic title="评分" value={4.9} size="small" />
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      </Space>
                    </Col>
                  </Row>
                </div>
              )
            },
            {
              key: 'contributors-ranking',
              label: <span><Award size={16} style={{ marginRight: 8 }} />贡献者排行榜</span>,
              children: (
                <div className="contributors-ranking">
                  <Row gutter={[24, 24]}>
                    <Col span={18}>
                      <Card 
                        title={
                          <div className="ranking-header">
                            <div className="ranking-title">
                              <Award size={20} style={{ marginRight: 10, color: '#faad14' }} />
                              <span>贡献者排行榜</span>
                              <div className="ranking-subtitle">Top Contributors</div>
                            </div>
                            <div className="ranking-actions">
                              <Tooltip title="刷新贡献者数据">
                                <Button 
                                  type="text" 
                                  size="small" 
                                  icon={<Clock size={14} />}
                                  style={{ color: 'white', marginRight: 8 }}
                                  onClick={refreshData}
                                  loading={loading}
                                >
                                  刷新
                                </Button>
                              </Tooltip>
                              <Tooltip title="查看完整排行榜">
                                <Button 
                                  type="text" 
                                  size="small" 
                                  icon={<TrendingUp size={14} />}
                                  style={{ color: 'white' }}
                                  onClick={() => message.info('完整排行榜功能开发中...')}
                                >
                                  更多
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        } 
                        size="small"
                        className="ranking-card enhanced"
                        extra={
                          <div className="ranking-period">
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                              本月排名
                            </Text>
                          </div>
                        }
                      >
                        <div className="ranking-content">
                          <List
                            size="small"
                            dataSource={topContributors}
                            renderItem={(contributor, index) => {
                              const isTopThree = index < 3
                              const isFirst = index === 0
                              const rankColors = ['#faad14', '#d9d9d9', '#d4b106']
                              const rankIcons = ['🥇', '🥈', '🥉']
                              const rankGradients = [
                                'linear-gradient(135deg, #faad14, #fa8c16)',
                                'linear-gradient(135deg, #d9d9d9, #bfbfbf)',
                                'linear-gradient(135deg, #d4b106, #b37400)'
                              ]
                              
                              return (
                                <List.Item 
                                  className={`ranking-item enhanced ${isTopThree ? 'top-three' : ''} ${isFirst ? 'champion' : ''} rank-${index + 1}`}
                                  onClick={() => {
                                    Modal.info({
                                      title: `${contributor.name} 的详细信息`,
                                      content: (
                                        <div className="contributor-modal">
                                          <div className="modal-header">
                                            <Avatar size={64} icon={<User />} style={{ backgroundColor: rankColors[Math.min(index, 2)] }} />
                                            <div className="modal-info">
                                              <h3>{contributor.name} {contributor.avatar}</h3>
                                              <p>{contributor.institution}</p>
                                              <Tag color={getSpecialtyColor(contributor.specialty)}>{contributor.specialty}</Tag>
                                            </div>
                                          </div>
                                          <Divider />
                                          <div className="modal-stats">
                                            <Row gutter={16}>
                                              <Col span={8}>
                                                <Statistic title="发布场景" value={contributor.scenarios} prefix={<BookOpen size={16} />} />
                                              </Col>
                                              <Col span={8}>
                                                <Statistic title="总下载" value={contributor.downloads} prefix={<Download size={16} />} />
                                              </Col>
                                              <Col span={8}>
                                                <Statistic title="获得点赞" value={contributor.likes} prefix={<Heart size={16} />} />
                                              </Col>
                                            </Row>
                                            <Row gutter={16} style={{ marginTop: 16 }}>
                                              <Col span={12}>
                                                <Statistic title="综合评分" value={Math.round(contributor.score)} suffix="分" />
                                              </Col>
                                              <Col span={12}>
                                                <div>
                                                  <Text strong>用户评价</Text>
                                                  <br />
                                                  <Rate disabled value={contributor.rating} />
                                                </div>
                                              </Col>
                                            </Row>
                                          </div>
                                        </div>
                                      ),
                                      width: 600,
                                      okText: '关闭'
                                    })
                                  }}
                                >
                                  <div className="ranking-item-content">
                                    <div className="rank-section">
                                      <div className="rank-number" style={{
                                        background: isTopThree ? rankGradients[index] : '#8c8c8c',
                                        boxShadow: isTopThree ? `0 4px 15px ${rankColors[index]}40` : 'none'
                                      }}>
                                        {isTopThree ? rankIcons[index] : index + 1}
                                      </div>
                                      {isFirst && <div className="champion-glow"></div>}
                                    </div>
                                    
                                    <div className="avatar-section">
                                      <Avatar 
                                        size={isFirst ? 48 : 40}
                                        icon={<User size={isFirst ? 20 : 16} />} 
                                        style={{
                                          backgroundColor: isTopThree ? rankColors[index] : '#1890ff',
                                          border: isTopThree ? `3px solid ${rankColors[index]}` : '2px solid #d9d9d9',
                                          boxShadow: isFirst ? '0 6px 20px rgba(250, 173, 20, 0.4)' : 'none'
                                        }}
                                      />
                                      <div className="avatar-emoji">{contributor.avatar}</div>
                                    </div>
                                    
                                    <div className="info-section">
                                      <div className="contributor-header">
                                        <div className="contributor-name">
                                          <span className="name-text">{contributor.name}</span>
                                          {isTopThree && <span className="crown-icon">👑</span>}
                                        </div>
                                        <div className="contributor-level">
                                          {getLevelTag(contributor.level)}
                                        </div>
                                      </div>
                                      
                                      <div className="contributor-specialty">
                                        <Tag 
                                          size="small" 
                                          color={getSpecialtyColor(contributor.specialty)}
                                          style={{ fontSize: '11px', fontWeight: 500 }}
                                        >
                                          {contributor.specialty}
                                        </Tag>
                                      </div>
                                      
                                      <div className="contributor-stats">
                                        <div className="stat-row">
                                          <Tooltip title="发布场景数">
                                            <div className="stat-item">
                                              <BookOpen size={12} />
                                              <span>{contributor.scenarios}</span>
                                            </div>
                                          </Tooltip>
                                          <Tooltip title="总下载量">
                                            <div className="stat-item">
                                              <Download size={12} />
                                              <span>{formatNumber(contributor.downloads)}</span>
                                            </div>
                                          </Tooltip>
                                          <Tooltip title="获得点赞">
                                            <div className="stat-item">
                                              <Heart size={12} />
                                              <span>{formatNumber(contributor.likes)}</span>
                                            </div>
                                          </Tooltip>
                                        </div>
                                      </div>
                                      
                                      <div className="contributor-details">
                                        <div className="institution-info">
                                          <Text type="secondary" style={{ fontSize: '11px' }}>
                                            📍 {contributor.institution}
                                          </Text>
                                        </div>
                                        
                                        <div className="score-rating">
                                          <div className="score-section">
                                            <Text style={{ fontSize: '11px', color: '#666' }}>综合分:</Text>
                                            <Text strong style={{ color: '#fa8c16', fontSize: '13px', marginLeft: 4 }}>
                                              {Math.round(contributor.score)}
                                            </Text>
                                          </div>
                                          {contributor.rating > 0 && (
                                            <div className="rating-section">
                                              <Rate disabled value={contributor.rating} style={{ fontSize: '11px' }} />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="action-section">
                                      <Tooltip title="查看详情">
                                        <Button 
                                          type="text" 
                                          size="small" 
                                          icon={<Eye size={14} />}
                                          className="view-detail-btn"
                                        />
                                      </Tooltip>
                                    </div>
                                  </div>
                                  
                                  {isTopThree && (
                                    <div className="ranking-glow enhanced"></div>
                                  )}
                                  {isFirst && (
                                    <div className="champion-effects">
                                      <div className="sparkle sparkle-1">✨</div>
                                      <div className="sparkle sparkle-2">⭐</div>
                                      <div className="sparkle sparkle-3">💫</div>
                                    </div>
                                  )}
                                </List.Item>
                              )
                            }}
                          />
                          
                          <div className="ranking-footer">
                            <Text type="secondary" style={{ fontSize: '11px', textAlign: 'center', display: 'block' }}>
                              💡 点击贡献者查看详细信息 • 数据每小时更新
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <div className="sidebar-content">
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                          {/* 排行榜统计 */}
                          <Card title="排行榜统计" size="small">
                            <Row gutter={16}>
                              <Col span={12}>
                                <Statistic title="总贡献者" value={topContributors.length} suffix="人" />
                              </Col>
                              <Col span={12}>
                                <Statistic title="本月新增" value={8} suffix="人" />
                              </Col>
                            </Row>
                            <Divider />
                            <Row gutter={16}>
                              <Col span={12}>
                                <Statistic title="平均场景" value={12.5} suffix="个" />
                              </Col>
                              <Col span={12}>
                                <Statistic title="平均评分" value={4.6} suffix="/ 5.0" />
                              </Col>
                            </Row>
                          </Card>

                          {/* 排行榜说明 */}
                          <Card title="排名规则" size="small">
                            <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                              <p><strong>综合评分计算：</strong></p>
                              <ul style={{ paddingLeft: 16, margin: 0 }}>
                                <li>发布场景数量 (30%)</li>
                                <li>场景下载量 (25%)</li>
                                <li>用户点赞数 (20%)</li>
                                <li>场景评分 (15%)</li>
                                <li>活跃度 (10%)</li>
                              </ul>
                              <Divider style={{ margin: '12px 0' }} />
                              <p><strong>更新频率：</strong>每小时更新一次</p>
                              <p><strong>统计周期：</strong>按月统计，每月1日重置</p>
                            </div>
                          </Card>

                          {/* 成就徽章说明 */}
                          <Card title="成就徽章" size="small">
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Tag color="gold" size="small">🏆 专家贡献者</Tag>
                                <Text style={{ fontSize: '11px', color: '#666' }}>发布15+场景</Text>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Tag color="blue" size="small">⭐ 人气作者</Tag>
                                <Text style={{ fontSize: '11px', color: '#666' }}>获得500+点赞</Text>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Tag color="green" size="small">🎯 质量达人</Tag>
                                <Text style={{ fontSize: '11px', color: '#666' }}>平均评分4.5+</Text>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Tag color="purple" size="small">🔥 活跃贡献</Tag>
                                <Text style={{ fontSize: '11px', color: '#666' }}>连续活跃30天</Text>
                              </div>
                            </Space>
                          </Card>
                        </Space>
                      </div>
                    </Col>
                  </Row>
                </div>
              )
            }
          ]}
        />
      </div>
      
      {/* 创建场景模态框 */}
      <Modal
        title="创建新场景"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={800}
        className="create-scenario-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateScenario}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="场景标题"
                rules={[{ required: true, message: '请输入场景标题' }]}
              >
                <Input placeholder="请输入场景标题" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="场景分类"
                rules={[{ required: true, message: '请选择场景分类' }]}
              >
                <Select placeholder="请选择场景分类">
                  {categoryOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <Tag color={option.color} style={{ margin: 0 }}>
                        {option.label}
                      </Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="subject"
                label="学科领域"
                rules={[{ required: true, message: '请选择学科领域' }]}
              >
                <Select placeholder="请选择学科领域">
                  {subjectOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="difficulty"
                label="难度等级"
                rules={[{ required: true, message: '请选择难度等级' }]}
              >
                <Select placeholder="请选择难度等级">
                  {difficultyOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <Tag color={option.color} style={{ margin: 0 }}>
                        {option.label}
                      </Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="duration"
                label="预计时长"
                rules={[{ required: true, message: '请输入预计时长' }]}
              >
                <Input placeholder="如：30分钟" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="license"
                label="使用许可"
                rules={[{ required: true, message: '请选择使用许可' }]}
              >
                <Select placeholder="请选择许可证">
                  {licenseOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="场景描述"
            rules={[{ required: true, message: '请输入场景描述' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="请详细描述场景的内容、学习目标和适用对象" 
            />
          </Form.Item>
          
          <Form.Item
            name="tags"
            label="标签"
            rules={[{ required: true, message: '请输入至少一个标签' }]}
          >
            <Select
              mode="tags"
              placeholder="请输入标签，按回车添加"
              tokenSeparators={[',', ' ']}
            />
          </Form.Item>
          
          <Form.Item
            name="learningObjectives"
            label="学习目标"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请描述学习者完成此场景后应达到的学习目标" 
            />
          </Form.Item>
          
          <Form.Item
            name="prerequisites"
            label="前置知识"
          >
            <Input.TextArea 
              rows={2} 
              placeholder="请描述学习者需要具备的前置知识或技能" 
            />
          </Form.Item>
          
          <Divider orientation="left">互动仿真设置</Divider>
          
          <Form.Item
            name="simulationUrl"
            label="互动仿真地址"
            extra="提供用户进行互动仿真的访问地址（如果不提供地址，请上传源码附件）"
            data-field="simulationUrl"
          >
            <Input 
              placeholder="https://example.com/simulation" 
              prefix={<Globe size={16} />}
            />
          </Form.Item>
          
          <Form.Item
            name="sourceAttachment"
            label="源码附件"
            extra="上传源码压缩包，系统将自动进行部署（支持.zip, .rar, .tar.gz, .7z格式，最大100MB）"
            valuePropName="fileList"
            data-field="sourceAttachment"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload.Dragger
              name="file"
              multiple={false}
              accept=".zip,.rar,.tar.gz,.7z"
              beforeUpload={(file) => {
                const isValidType = ['application/zip', 'application/x-rar-compressed', 'application/gzip', 'application/x-7z-compressed'].includes(file.type) ||
                  ['.zip', '.rar', '.tar.gz', '.7z'].some(ext => file.name.toLowerCase().endsWith(ext))
                
                if (!isValidType) {
                  message.error('只支持压缩文件格式！')
                  return false
                }
                
                const isLt100M = file.size / 1024 / 1024 < 100
                if (!isLt100M) {
                  message.error('文件大小不能超过100MB！')
                  return false
                }
                
                // 模拟文件上传处理
                const fileObj = {
                  uid: Date.now().toString(),
                  name: file.name,
                  status: 'done',
                  size: file.size,
                  type: file.type
                }
                
                form.setFieldsValue({ sourceAttachment: [fileObj] })
                message.success('文件上传成功，将在创建场景时自动部署')
                
                return false // 阻止自动上传
              }}
            >
              <p className="ant-upload-drag-icon">
                <UploadIcon size={48} />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持压缩文件格式，上传后将自动部署为可访问的仿真地址
              </p>
            </Upload.Dragger>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                贡献场景
              </Button>
              <Button onClick={() => {
                setCreateModalVisible(false)
                form.resetFields()
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 发布场景模态框 */}
      <Modal
        title="发布场景"
        open={publishModalVisible}
        onCancel={() => {
          setPublishModalVisible(false)
          publishForm.resetFields()
          setSelectedScenario(null)
        }}
        footer={null}
        width={600}
      >
        <div className="publish-steps">
          <Steps current={0} size="small">
            <Step title="完善信息" />
            <Step title="提交审核" />
            <Step title="发布成功" />
          </Steps>
        </div>
        
        <Form
          form={publishForm}
          layout="vertical"
          onFinish={handlePublishScenario}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="publishNote"
            label="发布说明"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请简要说明此次发布的内容和改进" 
            />
          </Form.Item>
          
          <Form.Item
            name="allowComments"
            label="社区设置"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>允许其他用户评论和反馈</Checkbox>
          </Form.Item>
          
          <Form.Item
            name="allowDerivatives"
            label="衍生作品"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>允许其他用户基于此场景创建衍生作品</Checkbox>
          </Form.Item>
          
          <Form.Item
            name="notifyOnUpdate"
            label="通知设置"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>当场景状态更新时通知我</Checkbox>
          </Form.Item>
          
          <Divider />
          
          <div className="publish-agreement">
            <Text type="secondary">
              发布场景即表示您同意遵守平台的
              <a href="#">内容发布规范</a>和
              <a href="#">社区准则</a>，
              平台将对提交的内容进行审核。
            </Text>
          </div>
          
          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交审核
              </Button>
              <Button onClick={() => {
                setPublishModalVisible(false)
                publishForm.resetFields()
                setSelectedScenario(null)
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SimulationPlatform