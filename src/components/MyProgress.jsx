import React, { useState, useEffect } from 'react'
import { Progress, Card, Row, Col, Statistic, Timeline, Badge, Avatar, Tabs } from 'antd'
import { TrendingUp, Target, Award, Clock, BookOpen, Brain, Heart, Database, ClipboardCheck } from 'lucide-react'
import './MyProgress.css'

const { TabPane } = Tabs

const MyProgress = () => {
  const [progressData, setProgressData] = useState({
    overallProgress: 68,
    completedScenarios: 12,
    totalScenarios: 18,
    skillPoints: 850,
    studyHours: 24.5,
    achievements: [
      { id: 1, title: '初级辅导师', description: '完成基础心理健康辅导训练', date: '2024-01-15', type: 'bronze' },
      { id: 2, title: '沟通专家', description: '在互动对话中获得90%以上评分', date: '2024-01-20', type: 'silver' },
      { id: 3, title: '场景大师', description: '完成10个不同类型的训练场景', date: '2024-01-25', type: 'gold' }
    ],
    recentActivities: [
      { id: 1, action: '完成场景训练', scenario: '学业压力辅导', score: 92, time: '2小时前' },
      { id: 2, action: '获得成就', achievement: '沟通专家', time: '1天前' },
      { id: 3, action: '完成评估', assessment: '心理健康知识测试', score: 88, time: '2天前' },
      { id: 4, action: '学习资源', resource: '青少年心理发展理论', time: '3天前' }
    ],
    skillProgress: [
      { skill: '心理健康辅导', progress: 85, level: '高级', color: '#f56565' },
      { skill: '沟通技巧', progress: 92, level: '专家', color: '#eb2f96' },
      { skill: '危机干预', progress: 45, level: '初级', color: '#722ed1' },
      { skill: '评估诊断', progress: 60, level: '中级', color: '#52c41a' },
      { skill: '资源整合', progress: 75, level: '高级', color: '#1890ff' }
    ]
  })

  const getAchievementColor = (type) => {
    switch (type) {
      case 'bronze': return '#cd7f32'
      case 'silver': return '#c0c0c0'
      case 'gold': return '#ffd700'
      default: return '#1890ff'
    }
  }

  const getSkillLevelColor = (level) => {
    switch (level) {
      case '初级': return '#52c41a'
      case '中级': return '#1890ff'
      case '高级': return '#722ed1'
      case '专家': return '#eb2f96'
      default: return '#1890ff'
    }
  }

  return (
    <div className="my-progress">
      <div className="progress-header">
        <div className="header-content">
          <div className="header-icon">
            <TrendingUp size={32} color="#1890ff" />
          </div>
          <div className="header-text">
            <h1>我的进度</h1>
            <p>追踪您在场景模拟仿真系统中的学习进展和成就</p>
          </div>
        </div>
      </div>

      <div className="progress-content">
        {/* 总体进度概览 */}
        <Row gutter={[24, 24]} className="overview-section">
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="总体进度"
                value={progressData.overallProgress}
                suffix="%"
                prefix={<TrendingUp size={20} color="#1890ff" />}
              />
              <Progress 
                percent={progressData.overallProgress} 
                strokeColor="#1890ff"
                showInfo={false}
                className="progress-bar"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="完成场景"
                value={progressData.completedScenarios}
                suffix={`/ ${progressData.totalScenarios}`}
                prefix={<Target size={20} color="#52c41a" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="技能积分"
                value={progressData.skillPoints}
                prefix={<Award size={20} color="#eb2f96" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="学习时长"
                value={progressData.studyHours}
                suffix="小时"
                prefix={<Clock size={20} color="#722ed1" />}
              />
            </Card>
          </Col>
        </Row>

        {/* 详细进度信息 */}
        <Tabs defaultActiveKey="skills" className="progress-tabs">
          <TabPane tab="技能进度" key="skills">
            <Card title="技能发展图谱" className="skills-card">
              <Row gutter={[16, 16]}>
                {progressData.skillProgress.map((skill, index) => (
                  <Col xs={24} sm={12} lg={8} key={index}>
                    <div className="skill-item">
                      <div className="skill-header">
                        <div className="skill-icon" style={{ backgroundColor: `${skill.color}20` }}>
                          {skill.skill === '心理健康辅导' && <Heart size={20} color={skill.color} />}
                          {skill.skill === '沟通技巧' && <Brain size={20} color={skill.color} />}
                          {skill.skill === '危机干预' && <Target size={20} color={skill.color} />}
                          {skill.skill === '评估诊断' && <ClipboardCheck size={20} color={skill.color} />}
                          {skill.skill === '资源整合' && <Database size={20} color={skill.color} />}
                        </div>
                        <div className="skill-info">
                          <h4>{skill.skill}</h4>
                          <Badge 
                            color={getSkillLevelColor(skill.level)} 
                            text={skill.level}
                          />
                        </div>
                      </div>
                      <Progress 
                        percent={skill.progress} 
                        strokeColor={skill.color}
                        className="skill-progress"
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </TabPane>

          <TabPane tab="成就徽章" key="achievements">
            <Card title="获得的成就" className="achievements-card">
              <Row gutter={[16, 16]}>
                {progressData.achievements.map((achievement) => (
                  <Col xs={24} sm={12} lg={8} key={achievement.id}>
                    <div className="achievement-item">
                      <div className="achievement-icon">
                        <Award size={32} color={getAchievementColor(achievement.type)} />
                      </div>
                      <div className="achievement-content">
                        <h4>{achievement.title}</h4>
                        <p>{achievement.description}</p>
                        <span className="achievement-date">{achievement.date}</span>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </TabPane>

          <TabPane tab="学习轨迹" key="timeline">
            <Card title="最近活动" className="timeline-card">
              <Timeline>
                {progressData.recentActivities.map((activity) => (
                  <Timeline.Item key={activity.id}>
                    <div className="timeline-content">
                      <div className="activity-header">
                        <span className="activity-action">{activity.action}</span>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                      <div className="activity-details">
                        {activity.scenario && (
                          <span className="activity-detail">场景：{activity.scenario}</span>
                        )}
                        {activity.achievement && (
                          <span className="activity-detail">成就：{activity.achievement}</span>
                        )}
                        {activity.assessment && (
                          <span className="activity-detail">评估：{activity.assessment}</span>
                        )}
                        {activity.resource && (
                          <span className="activity-detail">资源：{activity.resource}</span>
                        )}
                        {activity.score && (
                          <span className="activity-score">得分：{activity.score}分</span>
                        )}
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default MyProgress