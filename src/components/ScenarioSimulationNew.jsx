import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Typography,
  Space,
  Tag,
  Avatar,
  Divider,
  Empty,
  Spin
} from 'antd'
import { 
  Play, 
  Eye, 
  Clock, 
  User, 
  Heart,
  BookOpen,
  Users,
  School,
  Brain,
  Target,
  Lightbulb
} from 'lucide-react'
import MentalHealthCoach from './MentalHealthCoach'
import './ScenarioSimulationNew.css'

const { Title, Text, Paragraph } = Typography

const ScenarioSimulationNew = () => {
  const [loading, setLoading] = useState(true)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [scenarios, setScenarios] = useState([])

  // 模拟场景数据
  const mockScenarios = [
    {
      id: 'mental-health-coach',
      title: '心理健康辅导',
      description: '专业的心理健康辅导场景，帮助学生解决心理问题，提供情感支持和心理疏导。',
      category: '心理健康',
      tags: ['心理辅导', '情感支持', '心理疏导', '学生关怀'],
      author: '心理健康专家',
      createTime: '2024-01-15',
      views: 2580,
      likes: 189,
      difficulty: 'medium',
      duration: '45分钟',
      icon: Heart,
      color: '#f56565'
    },
    {
      id: 'classroom-management',
      title: '课堂管理训练',
      description: '提升教师课堂管理能力，学习有效的纪律维护策略，创建积极的学习环境。',
      category: '教学管理',
      tags: ['课堂管理', '纪律维护', '师生关系', '教学效果'],
      author: '教学管理专家',
      createTime: '2024-01-12',
      views: 1890,
      likes: 145,
      difficulty: 'medium',
      duration: '40分钟',
      icon: BookOpen,
      color: '#1890ff'
    },
    {
      id: 'parent-communication',
      title: '家长沟通技巧',
      description: '掌握与家长有效沟通的技巧，建立良好的家校关系，促进学生全面发展。',
      category: '家校合作',
      tags: ['家长沟通', '家校合作', '沟通技巧', '关系建立'],
      author: '家校合作专家',
      createTime: '2024-01-10',
      views: 1650,
      likes: 128,
      difficulty: 'easy',
      duration: '35分钟',
      icon: Users,
      color: '#52c41a'
    },
    {
      id: 'crisis-intervention',
      title: '危机干预处理',
      description: '学习如何识别和处理学生危机情况，掌握有效的干预策略和应急处理方法。',
      category: '危机管理',
      tags: ['危机干预', '应急处理', '风险识别', '安全管理'],
      author: '危机管理专家',
      createTime: '2024-01-08',
      views: 1420,
      likes: 112,
      difficulty: 'hard',
      duration: '50分钟',
      icon: Target,
      color: '#fa8c16'
    },
    {
      id: 'innovative-teaching',
      title: '创新教学方法',
      description: '探索和实践创新的教学方法，提升教学效果，激发学生学习兴趣和创造力。',
      category: '教学创新',
      tags: ['创新教学', '教学方法', '学习兴趣', '创造力培养'],
      author: '教学创新专家',
      createTime: '2024-01-05',
      views: 1280,
      likes: 98,
      difficulty: 'medium',
      duration: '45分钟',
      icon: Lightbulb,
      color: '#722ed1'
    },
    {
      id: 'leadership-skills',
      title: '教育领导力',
      description: '培养教育管理者的领导力，学习团队管理、决策制定和组织发展的核心技能。',
      category: '领导力发展',
      tags: ['领导力', '团队管理', '决策制定', '组织发展'],
      author: '领导力专家',
      createTime: '2024-01-03',
      views: 980,
      likes: 87,
      difficulty: 'hard',
      duration: '60分钟',
      icon: School,
      color: '#eb2f96'
    }
  ]

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setScenarios(mockScenarios)
      setLoading(false)
    }, 1000)
  }, [])

  // 获取难度标签颜色
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#52c41a'
      case 'medium': return '#fa8c16'
      case 'hard': return '#f5222d'
      default: return '#1890ff'
    }
  }

  // 获取难度标签文本
  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '简单'
      case 'medium': return '中等'
      case 'hard': return '困难'
      default: return '未知'
    }
  }

  // 开始场景模拟
  const handleStartScenario = (scenario) => {
    setSelectedScenario(scenario)
  }

  // 返回场景列表
  const handleBackToList = () => {
    setSelectedScenario(null)
  }

  if (loading) {
    return (
      <div className="scenario-simulation-new-loading">
        <Spin size="large" />
        <p>正在加载场景数据...</p>
      </div>
    )
  }

  // 如果选择了心理健康辅导场景，显示对应组件
  if (selectedScenario && selectedScenario.id === 'mental-health-coach') {
    return (
      <div className="scenario-simulation-new-player">
        <div className="player-header">
          <Button 
            onClick={handleBackToList}
            type="text"
            className="back-button"
          >
            ← 返回场景列表
          </Button>
          <Title level={3}>{selectedScenario.title}</Title>
        </div>
        <div className="player-content">
          <MentalHealthCoach />
        </div>
      </div>
    )
  }

  // 如果选择了其他场景，显示占位内容
  if (selectedScenario) {
    return (
      <div className="scenario-simulation-new-player">
        <div className="player-header">
          <Button 
            onClick={handleBackToList}
            type="text"
            className="back-button"
          >
            ← 返回场景列表
          </Button>
          <Title level={3}>{selectedScenario.title}</Title>
        </div>
        <div className="player-content">
          <div className="scenario-placeholder">
            <div className="placeholder-icon">
              <selectedScenario.icon size={80} color={selectedScenario.color} />
            </div>
            <Title level={2}>{selectedScenario.title}</Title>
            <Paragraph className="placeholder-description">
              {selectedScenario.description}
            </Paragraph>
            <div className="placeholder-info">
              <Space size="large">
                <div>
                  <Text type="secondary">作者：</Text>
                  <Text>{selectedScenario.author}</Text>
                </div>
                <div>
                  <Text type="secondary">时长：</Text>
                  <Text>{selectedScenario.duration}</Text>
                </div>
                <div>
                  <Text type="secondary">难度：</Text>
                  <Tag color={getDifficultyColor(selectedScenario.difficulty)}>
                    {getDifficultyText(selectedScenario.difficulty)}
                  </Tag>
                </div>
              </Space>
            </div>
            <div className="placeholder-notice">
              <Text type="secondary">该场景正在开发中，敬请期待...</Text>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="scenario-simulation-new">
      <div className="simulation-header">
        <div className="header-content">
          <div className="welcome-section">
            <Title level={2}>🎭 场景模拟训练中心</Title>
            <Paragraph className="welcome-text">
              欢迎来到场景模拟训练中心！这里提供丰富的教育场景模拟，帮助您在安全的虚拟环境中
              练习和提升各种教育技能。选择一个场景开始您的学习之旅吧！
            </Paragraph>
          </div>
          
          <div className="stats-section">
            <Row gutter={16}>
              <Col span={8}>
                <Card className="stat-card">
                  <div className="stat-content">
                    <div className="stat-number">{scenarios.length}</div>
                    <div className="stat-label">可用场景</div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card className="stat-card">
                  <div className="stat-content">
                    <div className="stat-number">6</div>
                    <div className="stat-label">场景分类</div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card className="stat-card">
                  <div className="stat-content">
                    <div className="stat-number">{scenarios.reduce((sum, s) => sum + s.views, 0)}</div>
                    <div className="stat-label">总学习次数</div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <div className="simulation-content">
        <div className="content-header">
          <Title level={3}>📚 场景清单</Title>
          <Text type="secondary">选择您感兴趣的场景开始模拟训练</Text>
        </div>

        <Divider />

        <div className="scenarios-grid">
          {scenarios.length === 0 ? (
            <Empty 
              description="暂无可用场景"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Row gutter={[24, 24]}>
              {scenarios.map(scenario => {
                const IconComponent = scenario.icon
                return (
                  <Col xs={24} sm={12} lg={8} xl={6} key={scenario.id}>
                    <Card
                      className="scenario-card"
                      cover={
                        <div className="scenario-cover" style={{ background: `linear-gradient(135deg, ${scenario.color}20, ${scenario.color}40)` }}>
                          <div className="scenario-icon">
                            <IconComponent size={48} color={scenario.color} />
                          </div>
                          <div className="scenario-category">
                            <Tag color={scenario.color}>{scenario.category}</Tag>
                          </div>
                        </div>
                      }
                      actions={[
                        <Button 
                          key="start"
                          type="primary" 
                          icon={<Play size={16} />}
                          onClick={() => handleStartScenario(scenario)}
                          style={{ backgroundColor: scenario.color, borderColor: scenario.color }}
                        >
                          开始模拟
                        </Button>,
                        <Button 
                          key="preview"
                          icon={<Eye size={16} />}
                          onClick={() => console.log('预览场景:', scenario.title)}
                        >
                          预览
                        </Button>
                      ]}
                    >
                      <Card.Meta
                        title={
                          <div className="scenario-title">
                            <Text strong ellipsis={{ tooltip: scenario.title }}>
                              {scenario.title}
                            </Text>
                            <Tag color={getDifficultyColor(scenario.difficulty)} size="small">
                              {getDifficultyText(scenario.difficulty)}
                            </Tag>
                          </div>
                        }
                        description={
                          <div className="scenario-description">
                            <Paragraph 
                              ellipsis={{ rows: 2, tooltip: scenario.description }}
                              className="description-text"
                            >
                              {scenario.description}
                            </Paragraph>
                            
                            <div className="scenario-tags">
                              {scenario.tags.slice(0, 2).map(tag => (
                                <Tag key={tag} size="small">{tag}</Tag>
                              ))}
                              {scenario.tags.length > 2 && (
                                <Tag size="small">+{scenario.tags.length - 2}</Tag>
                              )}
                            </div>
                            
                            <div className="scenario-meta">
                              <Space size="small">
                                <div className="meta-item">
                                  <User size={12} />
                                  <Text type="secondary" className="meta-text">{scenario.author}</Text>
                                </div>
                                <div className="meta-item">
                                  <Clock size={12} />
                                  <Text type="secondary" className="meta-text">{scenario.duration}</Text>
                                </div>
                              </Space>
                              
                              <div className="scenario-stats">
                                <Space size="small">
                                  <Text type="secondary" className="stat-text">
                                    <Eye size={12} /> {scenario.views}
                                  </Text>
                                  <Text type="secondary" className="stat-text">
                                    <Heart size={12} /> {scenario.likes}
                                  </Text>
                                </Space>
                              </div>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                )
              })}
            </Row>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScenarioSimulationNew