import React, { useState } from 'react'
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
  message
} from 'antd'
import {
  SearchOutlined,
  StarFilled,
  DownloadOutlined,
  PlusOutlined,
  CheckOutlined,
  EditOutlined,
  CalculatorOutlined,
  BookOutlined,
  FileTextOutlined,
  TranslationOutlined,
  ReadOutlined,
  TeamOutlined,
  BarChartOutlined,
  VideoCameraOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import './AppCenter.css'

const { Title, Text } = Typography
const { Option } = Select

const AppCenter = ({ onAddToMenu, onRemoveFromMenu }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [menuApps, setMenuApps] = useState(() => {
    const saved = localStorage.getItem('added-apps')
    return saved ? JSON.parse(saved) : []
  })

  // 教学平台相关应用数据
  const apps = [
    {
      id: 'smart-classroom',
      name: '智慧课堂',
      description: '集成多媒体教学、互动白板、学生答题器等功能的智能教学平台',
      icon: 'BookOutlined',
      category: 'teaching',
      tags: ['教学', '互动', '多媒体'],
      grade: ['小学', '初中', '高中'],
      subject: ['语文', '数学', '英语', '科学'],
      rating: 4.8,
      downloads: 1250,
      version: 'v2.1.0',
      developer: '教育科技部',
      featured: true,
      menuId: 'smart-classroom',
      menuLabel: '智慧课堂',
      menuColor: '#52c41a'
    },
    {
      id: 'online-exam',
      name: '在线考试系统',
      description: '支持多种题型、自动阅卷、成绩统计的在线考试平台',
      icon: 'FileTextOutlined',
      category: 'assessment',
      tags: ['考试', '评测', '统计'],
      grade: ['初中', '高中', '大学'],
      subject: ['语文', '数学', '英语', '物理', '化学'],
      rating: 4.6,
      downloads: 890,
      version: 'v1.8.2',
      developer: '考试中心',
      featured: false,
      menuId: 'online-exam',
      menuLabel: '在线考试',
      menuColor: '#fa8c16'
    },
    {
      id: 'homework-system',
      name: '作业管理系统',
      description: '智能作业布置、批改和统计分析系统',
      icon: 'EditOutlined',
      category: 'management',
      tags: ['作业', '批改', '管理'],
      grade: ['小学', '初中', '高中'],
      subject: ['语文', '数学', '英语', '物理', '化学', '生物'],
      rating: 4.7,
      downloads: 8900,
      developer: '智慧教育',
      version: '1.8.2',
      menuId: 'homework-system',
      menuLabel: '作业系统',
      menuColor: '#52c41a'
    },
    {
      id: 'math-calculator',
      name: '数学计算器',
      description: '专业的数学计算工具，支持复杂公式和图形绘制',
      icon: 'CalculatorOutlined',
      category: 'tools',
      tags: ['数学', '计算', '工具'],
      grade: ['初中', '高中', '大学'],
      subject: ['数学'],
      rating: 4.5,
      downloads: 2100,
      version: 'v3.0.1',
      developer: '数学工具组',
      featured: false,
      menuId: 'math-calculator',
      menuLabel: '数学计算器',
      menuColor: '#722ed1'
    },
    {
      id: 'language-translator',
      name: '语言翻译助手',
      description: '多语言实时翻译工具，支持语音和文本翻译',
      icon: 'TranslationOutlined',
      category: 'tools',
      tags: ['翻译', '语言', '工具'],
      grade: ['小学', '初中', '高中', '大学'],
      subject: ['英语', '语文'],
      rating: 4.4,
      downloads: 1800,
      version: 'v2.3.0',
      developer: '语言中心',
      featured: true,
      menuId: 'language-translator',
      menuLabel: '翻译助手',
      menuColor: '#13c2c2'
    },
    {
      id: 'reading-comprehension',
      name: '阅读理解训练',
      description: '提供丰富的阅读材料和理解练习，提升学生阅读能力',
      icon: 'ReadOutlined',
      category: 'teaching',
      tags: ['阅读', '理解', '训练'],
      grade: ['小学', '初中', '高中'],
      subject: ['语文', '英语'],
      rating: 4.6,
      downloads: 3200,
      version: 'v1.5.0',
      developer: '语文教研组',
      featured: false,
      menuId: 'reading-comprehension',
      menuLabel: '阅读训练',
      menuColor: '#eb2f96'
    },
    {
      id: 'team-collaboration',
      name: '团队协作平台',
      description: '支持师生协作、项目管理和文件共享的综合平台',
      icon: 'TeamOutlined',
      category: 'collaboration',
      tags: ['协作', '团队', '项目'],
      grade: ['初中', '高中', '大学'],
      subject: ['综合实践', '信息技术'],
      rating: 4.7,
      downloads: 5600,
      version: 'v2.8.0',
      developer: '协作工具组',
      featured: true,
      menuId: 'team-collaboration',
      menuLabel: '团队协作',
      menuColor: '#f5222d'
    },
    {
      id: 'data-analytics',
      name: '教学数据分析',
      description: '学生学习数据统计分析，生成可视化报告',
      icon: 'BarChartOutlined',
      category: 'analytics',
      tags: ['数据', '分析', '统计'],
      grade: ['高中', '大学'],
      subject: ['数学', '信息技术'],
      rating: 4.8,
      downloads: 4200,
      version: 'v1.9.0',
      developer: '数据分析组',
      featured: false,
      menuId: 'data-analytics',
      menuLabel: '数据分析',
      menuColor: '#faad14'
    },
    {
      id: 'video-conference',
      name: '视频会议系统',
      description: '高清视频会议，支持屏幕共享和在线白板功能',
      icon: 'VideoCameraOutlined',
      category: 'media',
      tags: ['视频', '会议', '直播'],
      grade: ['幼儿', '小学', '初中', '高中', '大学'],
      subject: ['语文', '数学', '英语', '科学', '艺术'],
      rating: 4.5,
      downloads: 7800,
      version: 'v3.2.1',
      developer: '多媒体中心',
      featured: true,
      menuId: 'video-conference',
      menuLabel: '视频会议',
      menuColor: '#1890ff'
    },
    {
      id: 'app-store',
      name: '应用商店',
      description: '发现更多教育应用，一站式应用管理平台',
      icon: 'AppstoreOutlined',
      category: 'tools',
      tags: ['应用', '商店', '管理'],
      grade: ['幼儿', '小学', '初中', '高中', '大学'],
      subject: ['综合'],
      rating: 4.3,
      downloads: 9500,
      version: 'v1.0.0',
      developer: '平台开发组',
      featured: false,
      menuId: 'app-store',
      menuLabel: '应用商店',
      menuColor: '#52c41a'
    }
  ]

  // 分类选项
  const categories = [
    { value: 'all', label: '全部应用' },
    { value: 'teaching', label: '教学工具' },
    { value: 'assessment', label: '考试评测' },
    { value: 'management', label: '管理系统' },
    { value: 'tools', label: '实用工具' },
    { value: 'collaboration', label: '协作平台' },
    { value: 'analytics', label: '数据分析' },
    { value: 'media', label: '多媒体' }
  ]

  // 学段选项
  const grades = [
    { value: 'all', label: '全部学段' },
    { value: '幼儿', label: '幼儿' },
    { value: '小学', label: '小学' },
    { value: '初中', label: '初中' },
    { value: '高中', label: '高中' },
    { value: '大学', label: '大学' }
  ]

  // 学科选项
  const subjects = [
    { value: 'all', label: '全部学科' },
    { value: '语文', label: '语文' },
    { value: '数学', label: '数学' },
    { value: '英语', label: '英语' },
    { value: '物理', label: '物理' },
    { value: '化学', label: '化学' },
    { value: '生物', label: '生物' },
    { value: '科学', label: '科学' },
    { value: '艺术', label: '艺术' },
    { value: '信息技术', label: '信息技术' },
    { value: '综合实践', label: '综合实践' },
    { value: '综合', label: '综合' }
  ]

  // 图标映射
  const iconMap = {
    BookOutlined: <BookOutlined />,
    FileTextOutlined: <FileTextOutlined />,
    EditOutlined: <EditOutlined />,
    CalculatorOutlined: <CalculatorOutlined />,
    TranslationOutlined: <TranslationOutlined />,
    ReadOutlined: <ReadOutlined />,
    TeamOutlined: <TeamOutlined />,
    BarChartOutlined: <BarChartOutlined />,
    VideoCameraOutlined: <VideoCameraOutlined />,
    AppstoreOutlined: <AppstoreOutlined />
  }

  // 筛选应用
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory
    const matchesGrade = selectedGrade === 'all' || app.grade.includes(selectedGrade)
    const matchesSubject = selectedSubject === 'all' || app.subject.includes(selectedSubject)
    return matchesSearch && matchesCategory && matchesGrade && matchesSubject
  })

  // 添加应用到菜单
  const handleAddToMenu = (app) => {
    try {
      const newMenuApps = [...menuApps, app.id]
      setMenuApps(newMenuApps)
      localStorage.setItem('added-apps', JSON.stringify(newMenuApps))
      
      if (onAddToMenu) {
        onAddToMenu({
          id: app.menuId,
          label: app.menuLabel,
          icon: app.icon,
          color: app.menuColor
        })
      }
      
      message.success(`${app.name} 已添加到菜单`)
    } catch (error) {
      message.error('添加失败，请重试')
    }
  }

  // 从菜单移除应用
  const handleRemoveFromMenu = (app) => {
    try {
      const newMenuApps = menuApps.filter(id => id !== app.id)
      setMenuApps(newMenuApps)
      localStorage.setItem('added-apps', JSON.stringify(newMenuApps))
      
      if (onRemoveFromMenu) {
        onRemoveFromMenu(app.menuId)
      }
      
      message.success(`${app.name} 已从菜单移除`)
    } catch (error) {
      message.error('移除失败，请重试')
    }
  }

  // 检查应用是否已添加
  const isAppAdded = (appId) => {
    return menuApps.includes(appId)
  }

  return (
    <div className="app-center">
      <div className="app-center-header">
        <div className="header-title">
          <AppstoreOutlined className="header-icon" />
          <Title level={2} style={{ color: '#262626', margin: 0 }}>应用中心</Title>
        </div>
        <Text type="secondary">发现和管理教学平台应用</Text>
      </div>

      <div className="app-center-filters">
        <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="搜索应用名称、描述或标签"
              allowClear
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              size="large"
              style={{ width: 120 }}
            >
              {categories.map(category => (
                <Option key={category.value} value={category.value}>
                  {category.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              value={selectedGrade}
              onChange={setSelectedGrade}
              size="large"
              style={{ width: 120 }}
            >
              {grades.map(grade => (
                <Option key={grade.value} value={grade.value}>
                  {grade.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              value={selectedSubject}
              onChange={setSelectedSubject}
              size="large"
              style={{ width: 120 }}
            >
              {subjects.map(subject => (
                <Option key={subject.value} value={subject.value}>
                  {subject.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      <div className="app-center-content">
        {/* 推荐应用区域 */}
        <div className="featured-apps">
          <Title level={3}>推荐应用</Title>
          <Row gutter={[16, 16]}>
            {apps.filter(app => app.featured).map(app => (
              <Col key={app.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  className="app-card"
                  hoverable
                  actions={[
                    isAppAdded(app.id) ? (
                      <Button
                        key="remove"
                        type="text"
                        size="small"
                        icon={<CheckOutlined />}
                        onClick={() => handleRemoveFromMenu(app)}
                        style={{ color: '#52c41a' }}
                      >
                        已添加
                      </Button>
                    ) : (
                      <Button
                        key="add"
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddToMenu(app)}
                      >
                        添加
                      </Button>
                    )
                  ]}
                >
                  <div className="app-card-header">
                    <Avatar
                      size={48}
                      icon={iconMap[app.icon]}
                      style={{ backgroundColor: app.menuColor }}
                    />
                    <div className="app-info">
                      <h4>{app.name}</h4>
                      <Text type="secondary">{app.developer}</Text>
                    </div>
                    {app.featured && (
                      <Tag className="featured-tag" color="gold">
                        推荐
                      </Tag>
                    )}
                  </div>
                  <div className="app-description">
                    {app.description}
                  </div>
                  <div className="app-grade-subject">
                    <div>
                      <Text type="secondary">学段:</Text>
                      {app.grade.slice(0, 3).map(grade => (
                        <Tag key={grade} size="small" color="blue">{grade}</Tag>
                      ))}
                      {app.grade.length > 3 && <Text type="secondary" style={{ fontSize: '10px' }}>+{app.grade.length - 3}</Text>}
                    </div>
                    <div>
                      <Text type="secondary">学科:</Text>
                      {app.subject.slice(0, 2).map(subject => (
                        <Tag key={subject} size="small" color="green">{subject}</Tag>
                      ))}
                      {app.subject.length > 2 && <Text type="secondary" style={{ fontSize: '10px' }}>+{app.subject.length - 2}</Text>}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* 应用列表区域 */}
        <div className="apps-list">
          <Title level={3}>所有应用</Title>
          {filteredApps.length === 0 ? (
            <Empty
              description="没有找到匹配的应用"
              style={{ margin: '40px 0' }}
            />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredApps.map(app => (
                <Col key={app.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    className="app-card"
                    hoverable
                    actions={[
                      isAppAdded(app.id) ? (
                        <Button
                          key="remove"
                          type="text"
                          size="small"
                          icon={<CheckOutlined />}
                          onClick={() => handleRemoveFromMenu(app)}
                          style={{ color: '#52c41a' }}
                        >
                          已添加
                        </Button>
                      ) : (
                        <Button
                          key="add"
                          type="primary"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={() => handleAddToMenu(app)}
                        >
                          添加
                        </Button>
                      )
                    ]}
                  >
                    <div className="app-card-header">
                      <Avatar
                        size={48}
                        icon={iconMap[app.icon]}
                        style={{ backgroundColor: app.menuColor }}
                      />
                      <div className="app-info">
                        <h4>{app.name}</h4>
                        <Text type="secondary">{app.developer}</Text>
                      </div>
                      {app.featured && (
                        <Tag className="featured-tag" color="gold">
                          推荐
                        </Tag>
                      )}
                    </div>
                    <div className="app-description">
                      {app.description}
                    </div>
                     <div className="app-grade-subject">
                       <div>
                         <Text type="secondary">学段:</Text>
                         {app.grade.slice(0, 3).map(grade => (
                           <Tag key={grade} size="small" color="blue">{grade}</Tag>
                         ))}
                         {app.grade.length > 3 && <Text type="secondary" style={{ fontSize: '10px' }}>+{app.grade.length - 3}</Text>}
                       </div>
                       <div>
                         <Text type="secondary">学科:</Text>
                         {app.subject.slice(0, 2).map(subject => (
                           <Tag key={subject} size="small" color="green">{subject}</Tag>
                         ))}
                         {app.subject.length > 2 && <Text type="secondary" style={{ fontSize: '10px' }}>+{app.subject.length - 2}</Text>}
                       </div>
                     </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppCenter