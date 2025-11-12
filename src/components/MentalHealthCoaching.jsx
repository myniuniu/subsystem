import React, { useState, useEffect } from 'react'
import { Card, Button, Progress, Avatar, Tag, Space, Divider, Typography, Row, Col, Modal, message } from 'antd'
import { Play, Pause, RotateCcw, User, Clock, Target, Award, ArrowLeft } from 'lucide-react'
import DialogueEngine from './DialogueEngine'
import './MentalHealthCoaching.css'

const { Title, Text, Paragraph } = Typography

const MentalHealthCoaching = ({ onBack }) => {
  const [currentScenario, setCurrentScenario] = useState(null)
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [completedScenarios, setCompletedScenarios] = useState([])
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [showScenarioModal, setShowScenarioModal] = useState(false)
  const [showEvaluationModal, setShowEvaluationModal] = useState(false)
  const [evaluationData, setEvaluationData] = useState(null)

  // 心理健康辅导场景数据
  const scenarios = [
    {
      id: 'academic-stress',
      title: '学业压力过大',
      description: '学生因期末考试压力导致焦虑和失眠，需要进行心理疏导和压力管理指导。',
      category: 'stress',
      difficulty: '初级',
      duration: '15-20分钟',
      skills: ['倾听技巧', '共情能力', '压力管理'],
      studentProfile: {
        name: '小李',
        grade: '大二',
        major: '计算机科学',
        background: '成绩优秀但对自己要求过高，容易焦虑'
      },
      objectives: [
        '识别学生的压力源',
        '运用共情技巧建立信任',
        '提供有效的压力管理策略',
        '制定可行的学习计划'
      ],
      initialMessage: '老师，我最近感觉压力特别大，马上要期末考试了，我担心考不好，晚上总是睡不着觉。'
    },
    {
      id: 'social-anxiety',
      title: '社交焦虑障碍',
      description: '学生在社交场合感到极度不安和恐惧，影响正常的学习和生活。',
      category: 'anxiety',
      difficulty: '中级',
      duration: '20-25分钟',
      skills: ['心理评估', '认知重构', '行为干预'],
      studentProfile: {
        name: '小王',
        grade: '大一',
        major: '心理学',
        background: '性格内向，害怕在公共场合发言，避免参加集体活动'
      },
      objectives: [
        '评估社交焦虑的严重程度',
        '帮助学生识别负面思维模式',
        '教授放松技巧和应对策略',
        '制定渐进式社交暴露计划'
      ],
      initialMessage: '老师，我特别害怕和别人说话，每次要在课堂上发言我就紧张得不行，心跳加速，手心出汗。'
    },
    {
      id: 'depression-mood',
      title: '抑郁情绪调节',
      description: '学生出现持续的低落情绪，对学习和生活失去兴趣，需要专业的心理支持。',
      category: 'depression',
      difficulty: '高级',
      duration: '25-30分钟',
      skills: ['情绪识别', '认知治疗', '行为激活'],
      studentProfile: {
        name: '小张',
        grade: '大三',
        major: '文学',
        background: '最近几个月情绪低落，对以前喜欢的事情失去兴趣'
      },
      objectives: [
        '评估抑郁情绪的程度',
        '帮助学生表达内心感受',
        '识别负面认知模式',
        '制定行为激活计划'
      ],
      initialMessage: '老师，我最近总是感觉很累，什么都不想做，以前喜欢的读书、听音乐现在都觉得没意思。'
    },
    {
      id: 'relationship-conflict',
      title: '人际关系冲突',
      description: '学生在宿舍或班级中遇到人际关系问题，影响心理健康。',
      category: 'relationship',
      difficulty: '初级',
      duration: '15-20分钟',
      skills: ['沟通技巧', '冲突解决', '情绪管理'],
      studentProfile: {
        name: '小赵',
        grade: '大一',
        major: '管理学',
        background: '与室友关系紧张，经常发生争执'
      },
      objectives: [
        '分析冲突的根本原因',
        '教授有效沟通技巧',
        '制定冲突解决策略',
        '提升情绪管理能力'
      ],
      initialMessage: '老师，我和室友总是吵架，她们好像都不喜欢我，我觉得很孤独。'
    }
  ]

  const categories = [
    { id: 'all', name: '全部场景', icon: '🎯', color: '#1890ff' },
    { id: 'stress', name: '压力管理', icon: '😰', color: '#fa8c16' },
    { id: 'anxiety', name: '焦虑障碍', icon: '😨', color: '#f5222d' },
    { id: 'depression', name: '抑郁情绪', icon: '😔', color: '#722ed1' },
    { id: 'relationship', name: '人际关系', icon: '👥', color: '#52c41a' }
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '初级': return '#52c41a'
      case '中级': return '#fa8c16'
      case '高级': return '#f5222d'
      default: return '#1890ff'
    }
  }

  const handleStartScenario = (scenario) => {
    setCurrentScenario(scenario)
    setIsTraining(true)
    setProgress(0)
  }

  const handleScenarioComplete = (finalResults) => {
    try {
      const { scenarioId, score } = finalResults || {};
      if (scenarioId) {
        setCompletedScenarios(prev => Array.from(new Set([...prev, scenarioId])));
      }
      setEvaluationData(finalResults);
      setShowEvaluationModal(true);
      message.success(`场景训练完成！得分：${score}分`);
    } finally {
      setIsTraining(false);
      setCurrentScenario(null);
    }
  }

  const handleBackToLibrary = () => {
    if (onBack) {
      onBack('scenario-library')
    }
  }

  const showScenarioDetails = (scenario) => {
    setSelectedScenario(scenario)
    setShowScenarioModal(true)
  }

  const isCompleted = (scenarioId) => completedScenarios.includes(scenarioId)

  if (isTraining && currentScenario) {
    return (
      <div className="mental-health-coaching training-mode">
        <div className="training-header">
          <Button 
            icon={<ArrowLeft size={16} />} 
            onClick={() => setIsTraining(false)}
            className="back-btn"
          >
            返回场景选择
          </Button>
          <div className="scenario-info">
            <Title level={4}>{currentScenario.title}</Title>
            <Text type="secondary">{currentScenario.description}</Text>
          </div>
        </div>
        
        <DialogueEngine 
          scenario={currentScenario}
          onComplete={handleScenarioComplete}
          onProgress={setProgress}
        />
        {/* 评估报告弹窗 */}
        <Modal
          title={evaluationData?.scenarioTitle ? `${evaluationData.scenarioTitle} - 评估报告` : '评估报告'}
          open={showEvaluationModal}
          onCancel={() => setShowEvaluationModal(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setShowEvaluationModal(false)}>关闭</Button>
          ]}
          width={720}
          style={{ top: 40 }}
        >
          {evaluationData ? (
            <div style={{ display: 'grid', gap: 16 }}>
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Title level={5} style={{ marginBottom: 8 }}>综合得分</Title>
                    <Text style={{ fontSize: 24, fontWeight: 600 }}>{evaluationData.score} 分</Text>
                  </div>
                  <div>
                    <Title level={5} style={{ marginBottom: 8 }}>用时</Title>
                    <Text>{evaluationData.duration}s</Text>
                  </div>
                </div>
              </Card>

              <Card title="能力维度评分">
                <Row gutter={16}>
                  {Object.entries(evaluationData.skillScores || {}).map(([key, val], idx) => (
                    <Col span={12} key={idx} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text strong>{key}</Text>
                        <Text>{val}</Text>
                      </div>
                      <Progress percent={Math.min(100, Math.round((val / (evaluationData.score || 1)) * 100))} showInfo={false} />
                    </Col>
                  ))}
                </Row>
              </Card>

              <Card title="对话记录摘要">
                {(evaluationData.responses || []).map((r, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <Text>{`第${i + 1}轮（类型：${r.type}，得分：${r.score}）`}</Text>
                    <div style={{ color: '#666' }}>{r.choice}</div>
                  </div>
                ))}
              </Card>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Text>正在生成评估数据...</Text>
            </div>
          )}
        </Modal>
      </div>
    )
  }

  return (
    <div className="mental-health-coaching">
      <div className="coaching-header">
        <div className="header-content">
          <Button 
            icon={<ArrowLeft size={16} />} 
            onClick={handleBackToLibrary}
            className="back-btn"
          >
            返回场景库
          </Button>
          <div className="header-info">
            <Title level={2}>心理健康辅导训练</Title>
            <Paragraph>
              通过模拟真实的心理咨询场景，提升您的心理健康辅导技能。
              每个场景都有不同的挑战和学习目标，帮助您成为更专业的心理健康工作者。
            </Paragraph>
          </div>
        </div>
        
        <div className="progress-stats">
          <Row gutter={16}>
            <Col span={6}>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{scenarios.length}</div>
                  <div className="stat-label">总场景数</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{completedScenarios.length}</div>
                  <div className="stat-label">已完成</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">
                    {Math.round((completedScenarios.length / scenarios.length) * 100)}%
                  </div>
                  <div className="stat-label">完成率</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="stat-card assessment-card" hoverable onClick={() => onBack && onBack('my-evaluation')}>
                <div className="stat-content">
                  <div className="assessment-icon">📊</div>
                  <div className="stat-label">我的评估</div>
                  <div className="assessment-desc">查看详细评估报告</div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <div className="scenarios-grid">
        <Row gutter={[24, 24]}>
          {scenarios.map(scenario => {
            const completed = isCompleted(scenario.id)
            const category = categories.find(cat => cat.id === scenario.category)
            
            return (
              <Col xs={24} sm={12} lg={8} xl={6} key={scenario.id}>
                <Card 
                  className={`scenario-card ${completed ? 'completed' : ''}`}
                  hoverable
                  actions={[
                    <Button 
                      type="text" 
                      icon={<Target size={16} />}
                      onClick={() => showScenarioDetails(scenario)}
                    >
                      详情
                    </Button>,
                    <Button 
                      type="primary" 
                      icon={<Play size={16} />}
                      onClick={() => handleStartScenario(scenario)}
                    >
                      {completed ? '重新训练' : '开始训练'}
                    </Button>
                  ]}
                >
                  <div className="scenario-header">
                    <div className="scenario-category">
                      <span className="category-icon">{category?.icon}</span>
                      <Tag color={category?.color}>{category?.name}</Tag>
                    </div>
                    {completed && (
                      <div className="completion-badge">
                        <Award size={16} color="#52c41a" />
                      </div>
                    )}
                  </div>
                  
                  <div className="scenario-content">
                    <Title level={4}>{scenario.title}</Title>
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {scenario.description}
                    </Paragraph>
                    
                    <div className="scenario-meta">
                      <div className="meta-item">
                        <Clock size={14} />
                        <span>{scenario.duration}</span>
                      </div>
                      <div className="meta-item">
                        <Tag color={getDifficultyColor(scenario.difficulty)}>
                          {scenario.difficulty}
                        </Tag>
                      </div>
                    </div>
                    
                    <div className="scenario-skills">
                      {scenario.skills.slice(0, 2).map(skill => (
                        <Tag key={skill} size="small">{skill}</Tag>
                      ))}
                      {scenario.skills.length > 2 && (
                        <Tag size="small">+{scenario.skills.length - 2}</Tag>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>

      {/* 场景详情弹窗 */}
      <Modal
        title="场景详情"
        open={showScenarioModal}
        onCancel={() => setShowScenarioModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowScenarioModal(false)}>
            关闭
          </Button>,
          <Button 
            key="start" 
            type="primary" 
            icon={<Play size={16} />}
            onClick={() => {
              setShowScenarioModal(false)
              handleStartScenario(selectedScenario)
            }}
          >
            开始训练
          </Button>
        ]}
        width={600}
      >
        {selectedScenario && (
          <div className="scenario-details">
            <div className="student-profile">
              <Title level={5}>学生档案</Title>
              <Card size="small">
                <div className="profile-header">
                  <Avatar size={48} icon={<User />} />
                  <div className="profile-info">
                    <div className="student-name">{selectedScenario.studentProfile.name}</div>
                    <div className="student-grade">
                      {selectedScenario.studentProfile.grade} · {selectedScenario.studentProfile.major}
                    </div>
                  </div>
                </div>
                <Paragraph className="student-background">
                  {selectedScenario.studentProfile.background}
                </Paragraph>
              </Card>
            </div>
            
            <Divider />
            
            <div className="training-objectives">
              <Title level={5}>训练目标</Title>
              <ul>
                {selectedScenario.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
            
            <Divider />
            
            <div className="required-skills">
              <Title level={5}>所需技能</Title>
              <Space wrap>
                {selectedScenario.skills.map(skill => (
                  <Tag key={skill} color="blue">{skill}</Tag>
                ))}
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MentalHealthCoaching