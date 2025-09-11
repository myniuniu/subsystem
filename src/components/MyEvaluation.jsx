import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Progress, Badge, Timeline, Statistic, Tabs, Alert, Button, List, Avatar } from 'antd'
import { BarChart3, Target, AlertTriangle, BookOpen, PlayCircle, TrendingUp, Award, Brain, Eye, MessageCircle, CheckCircle } from 'lucide-react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import RadarChart from './RadarChart'
import './MyEvaluation.css'
import './RadarChart.css'

const MyEvaluation = ({ onBack }) => {
  const [assessmentData, setAssessmentData] = useState({
    overallScore: 85,
    lastAssessmentDate: '2024-01-25',
    totalAssessments: 8,
    // 量化得分数据
    quantifiedScores: {
      problemIdentification: {
        score: 78,
        weight: 30,
        weightedScore: 23.4,
        level: '良好',
        color: '#52c41a'
      },
      empathyCommunication: {
        score: 92,
        weight: 40,
        weightedScore: 36.8,
        level: '优秀',
        color: '#1890ff'
      },
      solutionRationality: {
        score: 83,
        weight: 30,
        weightedScore: 24.9,
        level: '良好',
        color: '#722ed1'
      }
    },
    // 薄弱点分析
    weaknesses: [
      {
        id: 1,
        issue: '未识别出"自残倾向"信号',
        description: '在处理学生心理危机时，对自残倾向的识别准确率较低',
        severity: 'high',
        recommendation: '需学习《学生危机信号手册》',
        resourceType: 'manual',
        progress: 0
      },
      {
        id: 2,
        issue: '共情回应技巧不足',
        description: '在与学生沟通时，共情表达方式较为生硬，缺乏温暖感',
        severity: 'medium',
        recommendation: '建议观看《共情沟通技巧》视频教程',
        resourceType: 'video',
        progress: 60
      },
      {
        id: 3,
        issue: '危机干预流程不熟练',
        description: '对紧急情况的处理步骤掌握不够熟练，反应时间较长',
        severity: 'medium',
        recommendation: '需要进行危机干预模拟场景复练',
        resourceType: 'simulation',
        progress: 30
      }
    ],
    // 改进建议
    improvements: {
      recommendedVideos: [
        {
          id: 1,
          title: '青少年心理危机识别与干预',
          duration: '45分钟',
          difficulty: '中级',
          relevance: 95,
          thumbnail: '🎥',
          completed: false
        },
        {
          id: 2,
          title: '共情沟通的艺术',
          duration: '30分钟',
          difficulty: '初级',
          relevance: 88,
          thumbnail: '🎥',
          completed: true
        },
        {
          id: 3,
          title: '学生心理健康评估方法',
          duration: '60分钟',
          difficulty: '高级',
          relevance: 82,
          thumbnail: '🎥',
          completed: false
        }
      ],
      practiceScenarios: [
        {
          id: 1,
          title: '学业焦虑干预场景',
          difficulty: '中级',
          estimatedTime: '20分钟',
          skillFocus: ['问题识别', '共情沟通'],
          completed: false
        },
        {
          id: 2,
          title: '自伤行为危机处理',
          difficulty: '高级',
          estimatedTime: '35分钟',
          skillFocus: ['危机识别', '紧急干预'],
          completed: false
        },
        {
          id: 3,
          title: '家庭关系冲突调解',
          difficulty: '中级',
          estimatedTime: '25分钟',
          skillFocus: ['沟通技巧', '方案制定'],
          completed: true
        }
      ]
    },
    // 历史评估记录
    assessmentHistory: [
      {
        id: 1,
        date: '2024-01-25',
        scenario: '学业压力辅导',
        overallScore: 85,
        scores: { identification: 78, empathy: 92, solution: 83 },
        improvement: '+5'
      },
      {
        id: 2,
        date: '2024-01-20',
        scenario: '社交焦虑处理',
        overallScore: 80,
        scores: { identification: 75, empathy: 88, solution: 78 },
        improvement: '+8'
      },
      {
        id: 3,
        date: '2024-01-15',
        scenario: '抑郁情绪干预',
        overallScore: 72,
        scores: { identification: 70, empathy: 82, solution: 65 },
        improvement: '-3'
      }
    ]
  })

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ff4d4f'
      case 'medium': return '#faad14'
      case 'low': return '#52c41a'
      default: return '#d9d9d9'
    }
  }

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'high': return '高优先级'
      case 'medium': return '中优先级'
      case 'low': return '低优先级'
      default: return '未知'
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '初级': return '#52c41a'
      case '中级': return '#faad14'
      case '高级': return '#ff4d4f'
      default: return '#d9d9d9'
    }
  }

  return (
    <div className="my-evaluation">
      <div className="assessment-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={onBack}
          className="back-button"
          style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10 }}
        >
          返回
        </Button>
        <div className="header-content">
          <div className="header-icon">
            <BarChart3 size={32} color="#1890ff" />
          </div>
          <div className="header-text">
            <h1>我的评估报告</h1>
            <p>基于训练完成情况生成的个性化评估报告，帮助您了解能力水平和改进方向</p>
          </div>
        </div>
      </div>

      <div className="assessment-content">
        {/* 总体评估概览 */}
        <Row gutter={[24, 24]} className="overview-section">
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="综合得分"
                value={assessmentData.overallScore}
                suffix="分"
                prefix={<Award size={20} color="#1890ff" />}
              />
              <div className="score-level">
                <Badge color="#1890ff" text="良好水平" />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="评估次数"
                value={assessmentData.totalAssessments}
                suffix="次"
                prefix={<Target size={20} color="#52c41a" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="待改进项"
                value={assessmentData.weaknesses.length}
                suffix="项"
                prefix={<AlertTriangle size={20} color="#faad14" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="最近评估"
                value={assessmentData.lastAssessmentDate}
                prefix={<TrendingUp size={20} color="#722ed1" />}
              />
            </Card>
          </Col>
        </Row>

        {/* 详细评估信息 */}
         <Tabs 
           defaultActiveKey="scores" 
           className="assessment-tabs"
           items={[
             {
               key: 'scores',
               label: '量化得分',
               children: (
            <Card title="能力维度评分" className="scores-card">
              <Row gutter={[16, 24]}>
                {Object.entries(assessmentData.quantifiedScores).map(([key, data]) => {
                  const titles = {
                    problemIdentification: '问题识别准确率',
                    empathyCommunication: '沟通共情度',
                    solutionRationality: '方案合理性'
                  }
                  return (
                    <Col xs={24} sm={8} key={key}>
                      <div className="score-item">
                        <div className="score-header">
                          <h4>{titles[key]}</h4>
                          <div className="score-weight">权重: {data.weight}%</div>
                        </div>
                        <div className="score-display">
                          <div className="score-number">{data.score}分</div>
                          <Badge color={data.color} text={data.level} />
                        </div>
                        <Progress 
                          percent={data.score} 
                          strokeColor={data.color}
                          showInfo={false}
                          className="score-progress"
                        />
                        <div className="weighted-score">
                          加权得分: {data.weightedScore}分
                        </div>
                      </div>
                    </Col>
                  )
                })}
              </Row>
              
              <Alert
                message="评分说明"
                description="综合得分 = 问题识别准确率×30% + 沟通共情度×40% + 方案合理性×30%"
                type="info"
                showIcon
                className="score-explanation"
              />
            </Card>
               )
             },
             {
               key: 'radar',
               label: '能力雷达图',
               children: (
                 <RadarChart 
                   data={assessmentData.quantifiedScores} 
                   title="能力维度雷达图"
                 />
               )
             },
             {
               key: 'weaknesses',
               label: '薄弱点分析',
               children: (
            <Card title="需要改进的能力点" className="weaknesses-card">
              <List
                itemLayout="vertical"
                dataSource={assessmentData.weaknesses}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    className="weakness-item"
                    actions={[
                      <Badge 
                        color={getSeverityColor(item.severity)} 
                        text={getSeverityText(item.severity)} 
                      />,
                      item.progress > 0 && (
                        <div className="improvement-progress">
                          <span>改进进度: </span>
                          <Progress 
                            percent={item.progress} 
                            size="small" 
                            style={{ width: 100 }}
                          />
                        </div>
                      )
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          style={{ 
                            backgroundColor: getSeverityColor(item.severity),
                            color: 'white'
                          }}
                          icon={<AlertTriangle size={16} />}
                        />
                      }
                      title={item.issue}
                      description={item.description}
                    />
                    <div className="weakness-recommendation">
                      <strong>改进建议：</strong>{item.recommendation}
                    </div>
                  </List.Item>
                )}
              />
            </Card>
               )
             },
             {
               key: 'improvements',
               label: '改进建议',
               children: (
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="推荐学习视频" className="recommendations-card">
                  <List
                    dataSource={assessmentData.improvements.recommendedVideos}
                    renderItem={(video) => (
                      <List.Item
                        key={video.id}
                        className="recommendation-item"
                        actions={[
                          <Button 
                            type={video.completed ? "default" : "primary"} 
                            size="small"
                            icon={video.completed ? <CheckCircle size={14} /> : <PlayCircle size={14} />}
                          >
                            {video.completed ? '已完成' : '开始学习'}
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar>{video.thumbnail}</Avatar>}
                          title={
                            <div className="video-title">
                              {video.title}
                              <Badge 
                                color={getDifficultyColor(video.difficulty)} 
                                text={video.difficulty}
                                style={{ marginLeft: 8 }}
                              />
                            </div>
                          }
                          description={
                            <div className="video-meta">
                              <span>时长: {video.duration}</span>
                              <span className="relevance">相关度: {video.relevance}%</span>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card title="模拟场景复练" className="recommendations-card">
                  <List
                    dataSource={assessmentData.improvements.practiceScenarios}
                    renderItem={(scenario) => (
                      <List.Item
                        key={scenario.id}
                        className="recommendation-item"
                        actions={[
                          <Button 
                            type={scenario.completed ? "default" : "primary"} 
                            size="small"
                            icon={scenario.completed ? <CheckCircle size={14} /> : <Brain size={14} />}
                          >
                            {scenario.completed ? '已完成' : '开始练习'}
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar 
                              style={{ 
                                backgroundColor: getDifficultyColor(scenario.difficulty),
                                color: 'white'
                              }}
                            >
                              🎯
                            </Avatar>
                          }
                          title={
                            <div className="scenario-title">
                              {scenario.title}
                              <Badge 
                                color={getDifficultyColor(scenario.difficulty)} 
                                text={scenario.difficulty}
                                style={{ marginLeft: 8 }}
                              />
                            </div>
                          }
                          description={
                            <div className="scenario-meta">
                              <div>预计时长: {scenario.estimatedTime}</div>
                              <div className="skill-tags">
                                技能重点: {scenario.skillFocus.map(skill => (
                                  <Badge key={skill} color="blue" text={skill} style={{ marginRight: 4 }} />
                                ))}
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
               )
             },
             {
               key: 'history',
               label: '历史记录',
               children: (
            <Card title="评估历史" className="history-card">
               <Timeline
                 items={assessmentData.assessmentHistory.map((record) => ({
                   key: record.id,
                   children: (
                     <div className="history-content">
                       <div className="history-header">
                         <span className="history-date">{record.date}</span>
                         <span className="history-scenario">{record.scenario}</span>
                         <div className="history-score">
                           <span className="score-value">{record.overallScore}分</span>
                           <span className={`score-change ${record.improvement.startsWith('+') ? 'positive' : 'negative'}`}>
                             {record.improvement}
                           </span>
                         </div>
                       </div>
                       <div className="history-details">
                         <div className="detail-scores">
                           <span>问题识别: {record.scores.identification}分</span>
                           <span>共情沟通: {record.scores.empathy}分</span>
                           <span>方案制定: {record.scores.solution}分</span>
                         </div>
                       </div>
                     </div>
                   )
                 }))}
               />
             </Card>
               )
             }
           ]}
         />
      </div>
    </div>
  )
};

export default MyEvaluation;