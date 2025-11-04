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
  Space,
  Popover,
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
  // 批量管理所选标签
  const [batchTag, setBatchTag] = useState('')
  const [batchVisible, setBatchVisible] = useState(false)
  const [selectedBatchTag, setSelectedBatchTag] = useState('')

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
      tags: ['作业', '批改'],
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
      tags: ['基础', '视频', '会议', '直播'],
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
    
    // 以下为从应用中心添加的可选基础/AI/标注/培训类应用
    {
      id: 'ai-assistant-app',
      name: 'AI智能中心',
      description: '统一管理与体验平台内的AI工具',
      icon: 'DashboardOutlined',
      category: 'ai',
      tags: ['AI', '工具'],
      grade: ['小学', '初中', '高中', '大学'],
      subject: ['综合'],
      rating: 4.5,
      downloads: 3200,
      version: 'v1.0.0',
      developer: 'AI中心',
      featured: false,
      menuId: 'ai-assistant',
      menuLabel: 'AI智能中心',
      menuColor: '#667eea'
    },
    {
      id: 'ai-tool-house-app',
      name: 'AI工具屋',
      description: '收纳常用AI工具，支持配置与扩展',
      icon: 'AppstoreOutlined',
      category: 'ai',
      tags: ['AI', '工具'],
      grade: ['小学', '初中', '高中', '大学'],
      subject: ['综合'],
      rating: 4.4,
      downloads: 2800,
      version: 'v1.0.0',
      developer: '工具屋',
      featured: false,
      menuId: 'ai-tool-house',
      menuLabel: 'AI工具屋',
      menuColor: '#722ed1'
    },
    {
      id: 'theme-template-center-app',
      name: '智能体中心',
      description: '管理与使用各类主题智能体模板',
      icon: 'DashboardOutlined',
      category: 'ai',
      tags: ['AI', '管理'],
      grade: ['小学', '初中', '高中', '大学'],
      subject: ['综合'],
      rating: 4.3,
      downloads: 2000,
      version: 'v1.0.0',
      developer: '智能体中心',
      featured: false,
      menuId: 'theme-template-center',
      menuLabel: '智能体',
      menuColor: '#1890ff'
    },
    {
      id: 'resource-annotation-app',
      name: '资源标注',
      description: '对资料进行标注、规则管理与批量处理',
      icon: 'FileTextOutlined',
      category: 'annotation',
      tags: ['标注', '管理'],
      grade: ['小学', '初中', '高中', '大学'],
      subject: ['综合'],
      rating: 4.4,
      downloads: 2400,
      version: 'v1.0.0',
      developer: '标注中心',
      featured: false,
      menuId: 'resource-annotation',
      menuLabel: '资源标注',
      menuColor: '#f759ab'
    },
    {
      id: 'student-annotation-app',
      name: '学员标注',
      description: '面向学员的标注与批注工作台',
      icon: 'FileTextOutlined',
      category: 'annotation',
      tags: ['标注', '管理'],
      grade: ['小学', '初中', '高中', '大学'],
      subject: ['综合'],
      rating: 4.2,
      downloads: 1800,
      version: 'v1.0.0',
      developer: '标注中心',
      featured: false,
      menuId: 'student-annotation',
      menuLabel: '学员标注',
      menuColor: '#722ed1'
    },
    {
      id: 'certificates-app',
      name: '我的证书',
      description: '查看与管理培训证书与完成记录',
      icon: 'FileTextOutlined',
      category: 'training',
      tags: ['培训'],
      grade: ['小学', '初中', '高中', '大学'],
      subject: ['综合'],
      rating: 4.1,
      downloads: 1600,
      version: 'v1.0.0',
      developer: '培训中心',
      featured: false,
      menuId: 'my-certificates',
      menuLabel: '我的证书',
      menuColor: '#1890ff'
    },
    {
      id: 'ai-experience-app',
      name: 'AI体验',
      description: '探索AI交互与体验功能入口',
      icon: 'DashboardOutlined',
      category: 'lab',
      tags: ['AI', '实验室'],
      grade: ['小学', '初中', '高中', '大学'],
      subject: ['综合'],
      rating: 4.3,
      downloads: 1200,
      version: 'v1.0.0',
      developer: 'AI体验组',
      featured: false,
      menuId: 'ai-experience',
      menuLabel: 'AI体验',
      menuColor: '#13c2c2'
    },
    {
      id: 'model-registry-app',
      name: '模型管理',
      description: '管理与实验模型配置及版本',
      icon: 'AppstoreOutlined',
      category: 'lab',
      tags: ['AI', '实验室'],
      grade: ['小学', '初中', '高中', '大学'],
      subject: ['综合'],
      rating: 4.2,
      downloads: 800,
      version: 'v1.0.0',
      developer: '模型实验室',
      featured: false,
      menuId: 'model-registry',
      menuLabel: '模型管理',
      menuColor: '#a0d911'
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

  // 获取包含自定义标签的全部标签
  const getAllTags = (app) => {
    const builtin = Array.isArray(app.tags) ? app.tags : []
    return builtin
  }

  // 获取全局唯一标签列表
  const getAllUniqueTags = () => {
    const set = new Set()
    apps.forEach(a => {
      const tags = getAllTags(a)
      tags.forEach(t => set.add(t))
    })
    return Array.from(set)
  }

  // 筛选应用
  const filteredApps = apps.filter(app => {
    const tags = getAllTags(app)
    const label = (app.menuLabel || app.name || '').toLowerCase()
    const query = searchTerm.toLowerCase()
    const matchesSearch = label.includes(query) ||
                         (app.description || '').toLowerCase().includes(query) ||
                         tags.some(tag => (tag || '').toLowerCase().includes(query))
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
      // 通知同页其他组件更新（如侧栏）
      window.dispatchEvent(new Event('menuAppsChanged'))
      
      if (onAddToMenu) {
        onAddToMenu({
          id: app.menuId,
          label: app.menuLabel,
          icon: app.icon,
          color: app.menuColor
        })
      }
      
      message.success(`${app.menuLabel || app.name} 已添加到菜单`)
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
      // 通知同页其他组件更新（如侧栏）
      window.dispatchEvent(new Event('menuAppsChanged'))
      
      if (onRemoveFromMenu) {
        onRemoveFromMenu(app.menuId)
      }
      
      message.success(`${app.menuLabel || app.name} 已从菜单移除`)
    } catch (error) {
      message.error('移除失败，请重试')
    }
  }

  // 检查应用是否已添加
  const isAppAdded = (app) => {
    try {
      // 1) 已通过应用中心添加的（动态或恢复默认），记录在 added-apps
      if (menuApps.includes(app.menuId) || menuApps.includes(app.id)) return true

      // 2) 默认菜单项未被移除，也视为“已添加”
      const defaultMenuIds = [
        'ai-assistant',
        'ai-tool-house',
        'theme-template-center',
        'resource-annotation',
        'student-annotation',
        'my-certificates'
      ]
      const removedDefaultsRaw = localStorage.getItem('removed-default-apps')
      const removedDefaults = removedDefaultsRaw ? JSON.parse(removedDefaultsRaw) : []
      const isDefaultPresent = defaultMenuIds.includes(app.menuId) && !removedDefaults.includes(app.menuId)
      return isDefaultPresent
    } catch {
      return false
    }
  }

  return (
    <div className="app-center">
      <Card className="app-header-card">
        <Row justify="space-between" align="middle">
          <Col>
            <div className="header-title">
              <AppstoreOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <Title level={2} style={{ margin: 0 }}>应用中心</Title>
            </div>
          </Col>
          <Col>
            <Space>
              <Popover
                placement="bottomRight"
                trigger="click"
                open={batchVisible}
                onOpenChange={(v) => setBatchVisible(v)}
                content={(
                  <div style={{ width: 420 }}>
                    <Space>
                      <Input
                        placeholder="输入标签进行批量管理"
                        allowClear
                        value={batchTag}
                        onChange={(e) => setBatchTag(e.target.value)}
                        onPressEnter={(e) => setBatchTag(e.target.value)}
                        style={{ width: 240 }}
                      />
                      <Button
                        type="primary"
                        onClick={() => {
                          const tagInput = batchTag.trim()
                          const chosenTag = (selectedBatchTag || tagInput)
                          if (!chosenTag) return
                          const targetApps = apps.filter(a => getAllTags(a).some(t => t.toLowerCase() === chosenTag.toLowerCase()))
                          if (targetApps.length === 0) {
                            message.warning(`没有找到标签“${chosenTag}”对应的应用`)
                            return
                          }
                          targetApps.forEach(app => handleAddToMenu(app))
                          message.success(`批量添加：标签“${chosenTag}”匹配 ${targetApps.length} 个应用`)
                          setBatchVisible(false)
                        }}
                      >
                        批量添加
                      </Button>
                      <Button
                        danger
                        onClick={() => {
                          const tagInput = batchTag.trim()
                          const chosenTag = (selectedBatchTag || tagInput)
                          if (!chosenTag) return
                          const targetApps = apps.filter(a => getAllTags(a).some(t => t.toLowerCase() === chosenTag.toLowerCase()))
                          if (targetApps.length === 0) {
                            message.warning(`没有找到标签“${chosenTag}”对应的应用`)
                            return
                          }
                          targetApps.forEach(app => handleRemoveFromMenu(app))
                          message.success(`批量移除：标签“${chosenTag}”匹配 ${targetApps.length} 个应用`)
                          setBatchVisible(false)
                        }}
                      >
                        批量移除
                      </Button>
                    </Space>
                  {/* 匹配到的标签列表 */}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ marginBottom: 6, color: '#666' }}>匹配到的标签（点击选择）</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(() => {
                        const q = batchTag.trim().toLowerCase()
                        const allTags = getAllUniqueTags()
                        const matched = q ? allTags.filter(t => t.toLowerCase().includes(q)) : allTags.slice(0, 20)
                        if (matched.length === 0) {
                          return <Text type="secondary">未匹配到标签</Text>
                        }
                        return matched.map(tag => (
                          <Tag
                            key={tag}
                            color={selectedBatchTag === tag ? 'volcano' : 'blue'}
                            onClick={() => setSelectedBatchTag(tag)}
                            style={{ cursor: 'pointer' }}
                          >
                            {tag}
                          </Tag>
                        ))
                      })()}
                    </div>
                  </div>
                  {/* 实时检索列表 */}
                  {batchTag.trim() && (
                    <div style={{ marginTop: 12 }}>
                      {(() => {
                          const tagInput = batchTag.trim()
                          const chosenTag = (selectedBatchTag || tagInput)
                          const matchedApps = chosenTag
                            ? apps.filter(a => getAllTags(a).some(t => t.toLowerCase() === chosenTag.toLowerCase()))
                            : []
                          return (
                            <div>
                              <div style={{ marginBottom: 8, color: '#666' }}>
                                {chosenTag ? `标签“${chosenTag}”对应 ${matchedApps.length} 个应用` : '请选择一个标签'}
                              </div>
                              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                                {matchedApps.slice(0, 12).map(app => (
                                  <Row key={app.id} align="middle" style={{ padding: '6px 0' }}>
                                    <Col flex="auto">
                                      <span style={{ fontWeight: 500 }}>{app.menuLabel || app.name}</span>
                                      <span style={{ color: '#999', marginLeft: 8 }}>{app.developer}</span>
                                    </Col>
                                    <Col>
                                      {isAppAdded(app) ? (
                                        <Button size="small" type="link" onClick={() => handleRemoveFromMenu(app)}>已添加，移除</Button>
                                      ) : (
                                        <Button size="small" type="link" onClick={() => handleAddToMenu(app)}>添加</Button>
                                      )}
                                    </Col>
                                  </Row>
                                ))}
                              </div>
                            </div>
                          )
                        })()}
                    </div>
                  )}
                </div>
              )}
              >
                <Button type="primary">批量安装/移除</Button>
              </Popover>
              <Input
                placeholder="搜索应用名称、描述或标签"
                allowClear
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={(e) => setSearchTerm(e.target.value)}
                style={{ width: 320 }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <div className="app-center-content">
        {/* 移除推荐区，统一展示所有应用 */}

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
                        <h4>{app.menuLabel || app.name}</h4>
                        <Text type="secondary">{app.developer}</Text>
                      </div>
                      {app.featured && (
                        <Tag className="featured-tag" color="gold">
                          推荐
                        </Tag>
                      )}
                      {app.tags && app.tags.includes('实验室') && (
                        <Tag className="lab-tag" color="purple">
                          实验室
                        </Tag>
                      )}
                    </div>
                    <div className="app-description">
                      {app.description}
                    </div>
                    {/* 标签展示（仅显示，不支持编辑） */}
                    <div className="app-tags">
                      {getAllTags(app).map(tag => (
                        <Tag key={tag} color={'blue'}>
                          {tag}
                        </Tag>
                      ))}
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