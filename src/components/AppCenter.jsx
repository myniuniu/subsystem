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
  AppstoreOutlined,
  DashboardOutlined
} from '@ant-design/icons'
import './AppCenter.css'

const { Title, Text } = Typography

const AppCenter = ({ onAddToMenu, onRemoveFromMenu }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [menuApps, setMenuApps] = useState(() => {
    const saved = localStorage.getItem('added-apps')
    return saved ? JSON.parse(saved) : []
  })

  // 监听localStorage变化，同步菜单应用状态
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('added-apps')
        const newMenuApps = saved ? JSON.parse(saved) : []
        setMenuApps(newMenuApps)
      } catch {
        setMenuApps([])
      }
    }

    // 监听storage事件（跨标签页）
    window.addEventListener('storage', handleStorageChange)
    
    // 监听自定义事件（同一页面内）
    window.addEventListener('menuAppsChanged', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('menuAppsChanged', handleStorageChange)
    }
  }, [])

  // 教学平台相关应用数据
  const apps = [
    {
      id: 'personal-workbench',
      name: '个人工作台',
      description: '快速进入个人工作台总览与常用操作',
      icon: 'DashboardOutlined',
      category: 'management',
      tags: ['工作台', '总览', '快捷操作'],
      grade: ['小学', '初中', '高中', '大学'],
      subject: ['综合'],
      rating: 4.6,
      downloads: 12000,
      version: 'v1.0.0',
      developer: '平台开发组',
      featured: false,
      menuId: 'home',
      menuLabel: '个人工作台',
      menuColor: '#667eea'
    },
    {
      id: 'lesson-observation-app',
      name: '听课评课',
      description: '课堂观察记录与教学评价的一站式工具',
      icon: 'ReadOutlined',
      category: 'teaching',
      tags: ['听课', '评课', '课堂评价'],
      grade: ['小学', '初中', '高中'],
      subject: ['语文', '数学', '英语', '科学'],
      rating: 4.7,
      downloads: 6500,
      version: 'v1.0.0',
      developer: '教学评价组',
      featured: true,
      menuId: 'lesson-observation',
      menuLabel: '听课评课',
      menuColor: '#e74c3c'
    },
    {
      id: 'teaching-management-app',
      name: '教学管理',
      description: '课程、班级、学生与作业等管理入口',
      icon: 'BookOutlined',
      category: 'management',
      tags: ['课程管理', '班级管理', '学生管理', '作业'],
      grade: ['小学', '初中', '高中'],
      subject: ['综合'],
      rating: 4.5,
      downloads: 9800,
      version: 'v1.0.0',
      developer: '教学管理中心',
      featured: false,
      // 点击后进入课程管理视图，菜单显示为“教学管理”
      menuId: 'course-management',
      menuLabel: '教学管理',
      menuColor: '#1890ff'
    },
    {
      id: 'analytics-assessment-app',
      name: '分析评测',
      description: '学情分析与能力测评的统一入口',
      icon: 'BarChartOutlined',
      category: 'analytics',
      tags: ['学情分析', '能力测评', '数据'],
      grade: ['小学', '初中', '高中'],
      subject: ['综合'],
      rating: 4.8,
      downloads: 7200,
      version: 'v1.0.0',
      developer: '数智教育研发组',
      featured: true,
      // 点击后进入学情分析中心视图，菜单显示为“分析评测”
      menuId: 'learning-analytics-center',
      menuLabel: '分析评测',
      menuColor: '#52c41a'
    },
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
      id: 'learning-analytics',
      name: '学情分析平台',
      description: '通过数据采集与分析，为教师提供全面精准的学生学习情况洞察，支持个性化教学和精准干预',
      icon: 'DashboardOutlined',
      category: 'analytics',
      tags: ['学情分析', '数据驱动', '个性化教学'],
      grade: ['小学', '初中', '高中'],
      subject: ['语文', '数学', '英语', '物理', '化学', '生物'],
      rating: 4.9,
      downloads: 6800,
      version: 'v1.0.0',
      developer: '数智教育研发组',
      featured: true,
      menuId: 'learning-analytics',
      menuLabel: '学情分析',
      menuColor: '#1890ff'
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

  // 已移除分类/学段/学科下拉选项，保留搜索功能

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
    AppstoreOutlined: <AppstoreOutlined />,
    DashboardOutlined: <DashboardOutlined />
  }

  // 筛选应用
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  // 添加应用到菜单（统一使用 menuId 存储，避免重复）
  const handleAddToMenu = (app) => {
    try {
      const newMenuApps = menuApps.includes(app.menuId)
        ? menuApps
        : [...menuApps, app.menuId]
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

  // 从菜单移除应用（兼容旧数据：同时移除 app.id 与 app.menuId）
  const handleRemoveFromMenu = (app) => {
    try {
      const newMenuApps = menuApps.filter(id => id !== app.menuId && id !== app.id)
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

  // 检查应用是否已添加（兼容旧数据）
  const isAppAdded = (app) => {
    return menuApps.includes(app.menuId) || menuApps.includes(app.id)
  }

  return (
    <div className="app-center">
      <div className="app-center-header">
        <div className="header-title">
          <Title level={2} style={{ color: '#262626', margin: 0 }}>应用中心</Title>
        </div>
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
        </Row>
      </div>

      <div className="app-center-content">
        {/* 推荐应用区域 */}
        <div className="featured-apps">
          <Title level={3}>推荐应用</Title>
          <Row gutter={[12, 12]}>
            {apps.filter(app => app.featured).map(app => (
              <Col key={app.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  className="app-card"
                  hoverable
                  actions={[
                    isAppAdded(app) ? (
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
                        className="app-add-btn"
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
                      size={40}
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
            <Row gutter={[12, 12]}>
              {filteredApps.map(app => (
                <Col key={app.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    className="app-card"
                    hoverable
                    actions={[
                      isAppAdded(app) ? (
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
                          className="app-add-btn"
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
                        size={40}
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