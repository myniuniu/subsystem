import React from 'react'
import { 
  MessageCircle, 
  Image, 
  Search, 
  PenTool, 
  Globe,
  Mic,
  Podcast,
  Users,
  Monitor,
  ArrowRight,
  Sparkles,
  Zap,
  Star,
  Rocket,
  Brain,
  Download,
  FileText,
  Bot,
  Eye,
  BookMarked,
  Video,
  Activity,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar,
  Plus,
  Settings
} from 'lucide-react'
import { 
  Layout, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Timeline, 
  Badge, 
  Space, 
  Typography, 
  Drawer, 
  Switch, 
  Divider,
  List,
  Avatar,
  Tag,
  Progress
} from 'antd'
import './MainContent.css'

const { Content } = Layout
const { Title, Text, Paragraph } = Typography

const MainContent = ({ currentView, onViewChange, onStartChat }) => {
  const [showSettings, setShowSettings] = React.useState(false)
  const [workspaceSettings, setWorkspaceSettings] = React.useState({
    showStats: true,
    showSchedule: true,
    showQuickActions: true,
    showModuleStatus: true,
    showRecentActivities: true
  })

  const toggleSetting = (key) => {
    setWorkspaceSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // 统计数据
  const statsData = [
    {
      id: 'ai-interactions',
      icon: Bot,
      title: 'AI智能交互',
      value: '1,247',
      unit: '次',
      trend: '+68%',
      color: '#667eea',
      description: '本月AI对话与智能生成'
    },
    {
      id: 'schedule-management',
      icon: Calendar,
      title: '日程管理',
      value: '156',
      unit: '项',
      trend: '+35%',
      color: '#52c41a',
      description: '本月创建和完成的日程'
    },

    {
      id: 'lesson-observation',
      icon: Eye,
      title: '听课评课',
      value: '34',
      unit: '次',
      trend: '+28%',
      color: '#722ed1',
      description: '本月听课与评课活动'
    }
  ]

  // 今日日程数据
  const todaySchedule = [
    {
      id: 1,
      time: '09:00',
      title: '高一数学课',
      type: 'class',
      status: 'upcoming'
    },
    {
      id: 2,
      time: '10:30',
      title: '教研组会议',
      type: 'meeting',
      status: 'upcoming'
    },
    {
      id: 3,
      time: '14:00',
      title: '学生答疑',
      type: 'consultation',
      status: 'upcoming'
    },
    {
      id: 4,
      time: '16:00',
      title: '教研时间',
      type: 'research',
      status: 'upcoming'
    }
  ]

  // 快捷操作数据
  const quickActions = [
    {
      id: 'ai-chat',
      icon: MessageCircle,
      title: '智能对话',
      description: '与AI助手进行自然对话',
      action: () => onStartChat()
    },

    {
      id: 'schedule',
      icon: Calendar,
      title: '日程管理',
      description: '查看和管理日程安排',
      action: () => onViewChange('calendar-center')
    },
    {
      id: 'ai-tools',
      icon: Bot,
      title: 'AI统一中心',
      description: '访问统一AI智能工具',
      action: () => onViewChange('unified-ai-center')
    },
    {
      id: 'docs',
      icon: FileText,
      title: '文档中心',
      description: '管理教学资料文档',
      action: () => onViewChange('docs-center')
    },
    {
      id: 'observation',
      icon: Eye,
      title: '听课评课',
      description: '进行课堂观察记录',
      action: () => onViewChange('lesson-observation')
    },
    {
      id: 'message-center',
      icon: MessageCircle,
      title: '消息中心',
      description: '查看和管理消息通知',
      action: () => onViewChange('message-center')
    },
    {
      id: 'meeting-center',
      icon: Video,
      title: '会议中心',
      description: '管理视频会议和录制',
      action: () => onViewChange('meeting-center')
    },
    {
      id: 'download-center',
      icon: Download,
      title: '下载中心',
      description: '管理文件下载和资源',
      action: () => onViewChange('download-center')
    }
  ]

  // 模块状态数据
  const moduleStatus = [
    {
      id: 'unified-ai-center',
      icon: Bot,
      title: 'AI统一中心',
      status: 'active',
      lastUsed: '刚刚',
      usage: '高频使用'
    },
    {
      id: 'calendar-center',
      icon: Calendar,
      title: '日历中心',
      status: 'active',
      lastUsed: '30分钟前',
      usage: '高频使用'
    },

    {
      id: 'lesson-observation',
      icon: Eye,
      title: '听课评课',
      status: 'active',
      lastUsed: '4小时前',
      usage: '正常使用'
    },
    {
      id: 'docs-center',
      icon: FileText,
      title: '文档中心',
      status: 'active',
      lastUsed: '1小时前',
      usage: '正常使用'
    },
    {
      id: 'message-center',
      icon: MessageCircle,
      title: '消息中心',
      status: 'active',
      lastUsed: '2小时前',
      usage: '正常使用'
    },
    {
      id: 'meeting-center',
      icon: Video,
      title: '会议中心',
      status: 'idle',
      lastUsed: '1天前',
      usage: '低频使用'
    },
    {
      id: 'download-center',
      icon: Download,
      title: '下载中心',
      status: 'idle',
      lastUsed: '2天前',
      usage: '低频使用'
    }
  ]

  // 最近活动数据
  const recentActivities = [
    {
      id: 1,
      icon: Bot,
      title: '使用AI生成了数学教案',
      time: '5分钟前'
    },
    {
      id: 2,
      icon: Calendar,
      title: '创建了下周的课程安排',
      time: '1小时前'
    },
    {
      id: 3,
      icon: Eye,
      title: '完成了张老师的听课记录',
      time: '3小时前'
    },
    {
      id: 4,
      icon: FileText,
      title: '上传了新的教学资料',
      time: '昨天'
    },
    {
      id: 5,
      icon: MessageCircle,
      title: '回复了学生的问题咨询',
      time: '昨天'
    }
  ]

  const handleToolClick = (toolId) => {
    onViewChange(toolId)
  }

  if (currentView !== 'home') {
    return (
      <div className="feature-view">
        <div className="feature-header">
          <div className="feature-info">
            <h1>功能开发中</h1>
            <p>该功能正在开发中，敬请期待！</p>
          </div>
          <button 
            className="back-button"
            onClick={() => onViewChange('home')}
          >
            返回首页
          </button>
        </div>
        <div className="feature-placeholder">
          <Sparkles size={64} className="placeholder-icon" />
          <h3>即将推出</h3>
          <p>我们正在努力开发这个功能，请稍后再试。</p>
          <button 
            className="try-chat-button"
            onClick={onStartChat}
          >
            <MessageCircle size={20} />
            试试智能对话
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="main-content">
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        paddingBottom: '60px',
        background: '#f5f5f5'
      }}>
        {/* 工作台欢迎区域 */}
        <Card 
          style={{ 
            marginBottom: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical" size="small">
                <Title level={2} style={{ 
                  margin: 0, 
                  color: 'var(--theme-textPrimary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Sparkles size={32} style={{ color: '#1890ff' }} />
                  个人工作台
                </Title>
                <Text type="secondary" style={{ fontSize: '16px', color: 'var(--theme-textSecondary)' }}>
                  欢迎回来！让我们开始今天的智能教学之旅
                </Text>
              </Space>
            </Col>
            <Col>
              <Space size="large">
                <Button 
                  type="primary" 
                  icon={<Settings size={16} />}
                  onClick={() => setShowSettings(true)}
                  style={{
                    borderRadius: '8px',
                    height: '40px',
                    paddingLeft: '16px',
                    paddingRight: '16px'
                  }}
                >
                  个性化设置
                </Button>
                <Space style={{
                  background: '#f5f5f5',
                  border: '1px solid #d9d9d9',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}>
                  <Clock size={20} />
                  <Text>{new Date().toLocaleTimeString('zh-CN', { hour12: false })}</Text>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 个性化设置面板 */}
        <Drawer
          title={
            <Space>
              <Settings size={16} />
              工作台个性化设置
            </Space>
          }
          placement="right"
          onClose={() => setShowSettings(false)}
          open={showSettings}
          width={400}
        >
          <div>
            <Title level={4}>显示模块</Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Row justify="space-between" align="middle">
                <Col>统计数据卡片</Col>
                <Col>
                  <Switch 
                    checked={workspaceSettings.showStats}
                    onChange={() => toggleSetting('showStats')}
                  />
                </Col>
              </Row>
              <Row justify="space-between" align="middle">
                <Col>今日日程预览</Col>
                <Col>
                  <Switch 
                    checked={workspaceSettings.showSchedule}
                    onChange={() => toggleSetting('showSchedule')}
                  />
                </Col>
              </Row>
              <Row justify="space-between" align="middle">
                <Col>快捷操作面板</Col>
                <Col>
                  <Switch 
                    checked={workspaceSettings.showQuickActions}
                    onChange={() => toggleSetting('showQuickActions')}
                  />
                </Col>
              </Row>
              <Row justify="space-between" align="middle">
                <Col>模块状态监控</Col>
                <Col>
                  <Switch 
                    checked={workspaceSettings.showModuleStatus}
                    onChange={() => toggleSetting('showModuleStatus')}
                  />
                </Col>
              </Row>
              <Row justify="space-between" align="middle">
                <Col>最近活动记录</Col>
                <Col>
                  <Switch 
                    checked={workspaceSettings.showRecentActivities}
                    onChange={() => toggleSetting('showRecentActivities')}
                  />
                </Col>
              </Row>
            </Space>
          </div>
        </Drawer>

        {/* 统计数据卡片 */}
        {workspaceSettings.showStats && (
          <div style={{ margin: '0 24px 24px' }}>
            <Row gutter={[16, 16]}>
              {statsData.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Col xs={24} sm={12} lg={6} key={stat.id}>
                    <Card 
                      hoverable
                      style={{ 
                        height: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #f0f0f0',
                        transition: 'all 0.3s ease'
                      }}
                      styles={{ body: { padding: '20px' } }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: '#f6ffed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #b7eb8f',
                          flexShrink: 0
                        }}>
                          <Icon size={24} style={{ color: '#52c41a' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: '14px',
                            color: '#8c8c8c',
                            marginBottom: '4px',
                            fontWeight: 500
                          }}>
                            {stat.title}
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '4px',
                            marginBottom: '8px'
                          }}>
                            <span style={{
                              fontSize: '24px',
                              fontWeight: 600,
                              color: 'var(--theme-textPrimary)'
                            }}>
                              {stat.value}
                            </span>
                            <span style={{
                              fontSize: '14px',
                              color: 'var(--theme-textSecondary)'
                            }}>
                              {stat.unit}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: '#52c41a'
                          }}>
                            <TrendingUp size={12} />
                            {stat.trend}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          </div>
        )}

        {/* 今日日程和快捷操作 */}
        <div style={{ margin: '0 24px 24px' }}>
          <Row gutter={[24, 24]}>
            {/* 今日日程预览 */}
            {workspaceSettings.showSchedule && (
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <Space>
                      <Calendar size={16} />
                      今日日程
                    </Space>
                  }
                  extra={
                    <Button 
                      type="link" 
                      size="small"
                      onClick={() => onViewChange('calendar-center')}
                      style={{ padding: 0, height: 'auto', color: '#1890ff' }}
                    >
                      查看全部
                    </Button>
                  }
                  style={{ 
                    height: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {todaySchedule.map((item, index) => (
                      <div key={item.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: index < todaySchedule.length - 1 ? '1px solid #f0f0f0' : 'none'
                      }}>
                        <div style={{
                          width: '60px',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#1890ff',
                          flexShrink: 0
                        }}>
                          {item.time}
                        </div>
                        <div style={{ flex: 1, marginLeft: '16px' }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'var(--theme-textPrimary)',
                            marginBottom: '2px'
                          }}>
                            {item.title}
                          </div>
                          <Tag 
                            color={item.type === 'class' ? 'blue' : 
                                   item.type === 'meeting' ? 'green' : 
                                   item.type === 'consultation' ? 'orange' : 'purple'}
                            style={{ fontSize: '12px' }}
                          >
                            {item.type === 'class' ? '课程' : 
                             item.type === 'meeting' ? '会议' : 
                             item.type === 'consultation' ? '答疑' : '其他'}
                          </Tag>
                        </div>
                        <Badge 
                          status={item.status === 'upcoming' ? 'processing' : 'success'} 
                          text={item.status === 'upcoming' ? '即将开始' : '已完成'}
                          style={{ fontSize: '12px' }}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            )}

            {/* 快捷操作 */}
            {workspaceSettings.showQuickActions && (
              <Col xs={24} lg={workspaceSettings.showSchedule ? 12 : 24}>
                <Card 
                  title={
                    <Space>
                      <Zap size={16} />
                      快捷操作
                    </Space>
                  }
                  style={{ 
                    height: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <Row gutter={[12, 12]}>
                    {quickActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <Col xs={12} sm={8} lg={12} xl={8} key={action.id}>
                          <Card 
                            hoverable
                            size="small"
                            onClick={action.action}
                            style={{ 
                              height: '100%',
                              margin: '4px',
                              borderRadius: '8px',
                              border: '1px solid #f0f0f0',
                              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer'
                            }}
                            styles={{ body: { padding: '12px', textAlign: 'center' } }}
                          >
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: '#f6ffed',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 8px',
                              border: '1px solid #b7eb8f'
                            }}>
                              <Icon size={16} style={{ color: '#52c41a' }} />
                            </div>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: 500,
                              color: 'var(--theme-textPrimary)',
                              marginBottom: '4px',
                              lineHeight: 1.2
                            }}>
                              {action.title}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: 'var(--theme-textSecondary)',
                              lineHeight: 1.3
                            }}>
                              {action.description}
                            </div>
                          </Card>
                        </Col>
                      )
                    })}
                  </Row>
                </Card>
              </Col>
            )}
          </Row>
        </div>

        <div style={{ margin: '0 24px' }}>
          <Row gutter={[24, 24]}>
            {/* 模块状态 */}
            {workspaceSettings.showModuleStatus && (
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <Space>
                      <Settings size={16} />
                      模块状态
                    </Space>
                  }
                  style={{ 
                    height: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <Paragraph type="secondary" style={{ marginBottom: '16px', color: '#8c8c8c' }}>查看各功能模块使用情况</Paragraph>
                  <Row gutter={[12, 12]}>
                    {moduleStatus.map((module, index) => {
                      const Icon = module.icon
                      return (
                        <Col xs={24} sm={12} key={module.id}>
                          <Card 
                            hoverable
                            size="small"
                            onClick={() => handleToolClick(module.id)}
                            style={{ 
                              height: '100%',
                              borderRadius: '8px',
                              border: '1px solid #f0f0f0',
                              transition: 'all 0.3s ease'
                            }}
                            styles={{ body: { padding: '12px' } }}
                          >
                            <Space direction="vertical" style={{ width: '100%' }}>
                              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                <div style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  background: '#f6ffed',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '1px solid #b7eb8f'
                                }}>
                                  <Icon size={14} style={{ color: '#52c41a' }} />
                                </div>
                                <Badge 
                                  status={module.status === 'active' ? 'success' : 'default'} 
                                  text={module.status === 'active' ? '运行中' : '空闲'}
                                  style={{ fontSize: '11px' }}
                                />
                              </Space>
                              <div>
                                <Text strong style={{ fontSize: '13px', color: 'var(--theme-textPrimary)' }}>{module.title}</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: '11px', color: 'var(--theme-textSecondary)' }}>最后使用: {module.lastUsed}</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: '11px', color: 'var(--theme-textSecondary)' }}>{module.usage}</Text>
                              </div>
                            </Space>
                          </Card>
                        </Col>
                      )
                    })}
                  </Row>
                </Card>
              </Col>
            )}

            {/* 最近活动 */}
            {workspaceSettings.showRecentActivities && (
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <Space>
                      <Activity size={16} />
                      最近活动
                    </Space>
                  }
                  style={{ 
                    height: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <Paragraph type="secondary" style={{ marginBottom: '16px', color: '#8c8c8c' }}>查看您的工作记录</Paragraph>
                  <Timeline
                    items={recentActivities.map((activity) => {
                      const Icon = activity.icon
                      return {
                        dot: <Avatar 
                          icon={<Icon size={12} />} 
                          size="small" 
                          style={{ 
                            backgroundColor: '#f6ffed',
                            color: '#52c41a',
                            border: '1px solid #b7eb8f'
                          }} 
                        />,
                        children: (
                          <div>
                            <Text strong style={{ color: 'var(--theme-textPrimary)', fontSize: '13px' }}>{activity.title}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: '12px', color: 'var(--theme-textSecondary)' }}>{activity.time}</Text>
                          </div>
                        )
                      }
                    })}
                  />
                </Card>
              </Col>
            )}
          </Row>
        </div>
      </div>
    </div>
  )
}

export default MainContent