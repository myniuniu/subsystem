import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Space,
  Tag,
  Tabs,
  Row,
  Col,
  Statistic,
  Progress,
  List,
  Avatar,
  Tooltip,
  Divider,
  Alert,
  Radio,
  Checkbox,
  Timeline,
  Rate
} from 'antd'
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TrophyOutlined,
  UserOutlined,
  BookOutlined,
  BulbOutlined,
  StarOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  DownloadOutlined,
  FilterOutlined,
  CalendarOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import './LearningAnalyticsCenter.css'

const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

const LearningAnalyticsCenter = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedTimeRange, setSelectedTimeRange] = useState('month')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedClass, setSelectedClass] = useState('all')

  // 学生数据
  const [students] = useState([
    {
      id: 1,
      name: '张三',
      studentId: '2024001',
      class: '高一(1)班',
      avatar: '👨‍🎓',
      totalScore: 425,
      avgScore: 85.0,
      rank: 3,
      improvement: 5.2,
      subjects: {
        '数学': { score: 88, rank: 2, trend: 'up' },
        '语文': { score: 82, rank: 5, trend: 'stable' },
        '英语': { score: 90, rank: 1, trend: 'up' },
        '物理': { score: 85, rank: 3, trend: 'down' },
        '化学': { score: 80, rank: 8, trend: 'up' }
      },
      weakPoints: ['二次函数', '阅读理解', '有机化学'],
      strongPoints: ['英语口语', '物理实验', '数学计算'],
      studyTime: 8.5,
      homeworkCompletion: 95,
      attendance: 98
    },
    {
      id: 2,
      name: '李四',
      studentId: '2024002',
      class: '高一(1)班',
      avatar: '👩‍🎓',
      totalScore: 398,
      avgScore: 79.6,
      rank: 8,
      improvement: -2.1,
      subjects: {
        '数学': { score: 75, rank: 12, trend: 'down' },
        '语文': { score: 85, rank: 3, trend: 'up' },
        '英语': { score: 78, rank: 15, trend: 'stable' },
        '物理': { score: 80, rank: 8, trend: 'up' },
        '化学': { score: 80, rank: 8, trend: 'stable' }
      },
      weakPoints: ['数学应用题', '英语语法', '物理力学'],
      strongPoints: ['语文写作', '化学实验', '历史记忆'],
      studyTime: 7.2,
      homeworkCompletion: 88,
      attendance: 96
    },
    {
      id: 3,
      name: '王五',
      studentId: '2024003',
      class: '高一(2)班',
      avatar: '👨‍🎓',
      totalScore: 445,
      avgScore: 89.0,
      rank: 1,
      improvement: 8.3,
      subjects: {
        '数学': { score: 95, rank: 1, trend: 'up' },
        '语文': { score: 88, rank: 2, trend: 'up' },
        '英语': { score: 92, rank: 1, trend: 'stable' },
        '物理': { score: 90, rank: 1, trend: 'up' },
        '化学': { score: 80, rank: 8, trend: 'down' }
      },
      weakPoints: ['化学计算', '语文古诗词'],
      strongPoints: ['数学思维', '英语写作', '物理推理'],
      studyTime: 9.8,
      homeworkCompletion: 100,
      attendance: 100
    }
  ])

  // 班级统计数据
  const [classStats] = useState({
    totalStudents: 30,
    avgScore: 82.5,
    passRate: 93.3,
    excellentRate: 46.7,
    improvementRate: 73.3,
    subjectPerformance: {
      '数学': { avg: 83.2, pass: 90, excellent: 40 },
      '语文': { avg: 85.1, pass: 95, excellent: 50 },
      '英语': { avg: 81.8, pass: 88, excellent: 43 },
      '物理': { avg: 79.5, pass: 85, excellent: 35 },
      '化学': { avg: 80.3, pass: 87, excellent: 38 }
    }
  })

  // 知识点分析数据
  const [knowledgePoints] = useState([
    {
      id: 1,
      subject: '数学',
      chapter: '第五章',
      name: '二次函数',
      difficulty: 'hard',
      masteryRate: 65.5,
      errorRate: 34.5,
      commonErrors: ['判别式计算错误', '顶点坐标求解错误', '图像性质理解不准确'],
      studentsNeedHelp: 12,
      recommendedActions: ['增加基础练习', '强化概念理解', '提供个性化辅导']
    },
    {
      id: 2,
      subject: '英语',
      chapter: '第三单元',
      name: '阅读理解',
      difficulty: 'medium',
      masteryRate: 78.2,
      errorRate: 21.8,
      commonErrors: ['细节理解偏差', '推理判断错误', '词汇理解不准确'],
      studentsNeedHelp: 8,
      recommendedActions: ['增加阅读量', '训练解题技巧', '扩充词汇量']
    },
    {
      id: 3,
      subject: '物理',
      chapter: '第二章',
      name: '牛顿运动定律',
      difficulty: 'hard',
      masteryRate: 58.9,
      errorRate: 41.1,
      commonErrors: ['受力分析不准确', '公式应用错误', '单位换算错误'],
      studentsNeedHelp: 15,
      recommendedActions: ['强化基础概念', '增加实验演示', '提供解题模板']
    }
  ])

  // 个性化建议数据
  const [recommendations] = useState([
    {
      id: 1,
      type: 'individual',
      target: '张三',
      priority: 'high',
      category: '学习方法',
      title: '数学解题思路优化',
      description: '建议在解决复杂数学问题时，先画图分析，再列方程求解',
      actions: ['提供解题模板', '安排一对一辅导', '推荐相关练习题'],
      expectedImprovement: '预计提升10-15分',
      timeline: '2周内实施'
    },
    {
      id: 2,
      type: 'class',
      target: '高一(1)班',
      priority: 'medium',
      category: '知识点强化',
      title: '物理力学概念强化',
      description: '班级整体在物理力学部分掌握不够扎实，需要集中强化训练',
      actions: ['组织专题复习', '增加实验课时', '提供辅助学习资料'],
      expectedImprovement: '预计班级平均分提升5-8分',
      timeline: '3周内完成'
    },
    {
      id: 3,
      type: 'subject',
      target: '化学学科',
      priority: 'high',
      category: '教学策略',
      title: '有机化学教学方法改进',
      description: '学生在有机化学反应机理理解方面存在困难，建议调整教学方法',
      actions: ['引入分子模型', '增加动画演示', '设计互动实验'],
      expectedImprovement: '预计掌握率提升20%',
      timeline: '1个月内调整'
    }
  ])

  const getDifficultyTag = (difficulty) => {
    const difficultyMap = {
      easy: { color: 'green', text: '简单' },
      medium: { color: 'orange', text: '中等' },
      hard: { color: 'red', text: '困难' }
    }
    const config = difficultyMap[difficulty] || difficultyMap.medium
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getPriorityTag = (priority) => {
    const priorityMap = {
      high: { color: 'red', text: '高优先级' },
      medium: { color: 'orange', text: '中优先级' },
      low: { color: 'green', text: '低优先级' }
    }
    const config = priorityMap[priority] || priorityMap.medium
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getTrendIcon = (trend) => {
    const trendMap = {
      up: { icon: <RiseOutlined />, color: '#52c41a' },
      down: { icon: <FallOutlined />, color: '#ff4d4f' },
      stable: { icon: <span>—</span>, color: '#faad14' }
    }
    const config = trendMap[trend] || trendMap.stable
    return <span style={{ color: config.color }}>{config.icon}</span>
  }

  const studentColumns = [
    {
      title: '学生信息',
      key: 'student',
      width: 150,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size={40}>{record.avatar}</Avatar>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.studentId}</div>
          </div>
        </div>
      )
    },
    {
      title: '班级',
      dataIndex: 'class',
      key: 'class',
      width: 100
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 80,
      sorter: (a, b) => a.totalScore - b.totalScore
    },
    {
      title: '平均分',
      dataIndex: 'avgScore',
      key: 'avgScore',
      width: 80,
      render: (score) => score.toFixed(1)
    },
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (rank) => (
        <Tag color={rank <= 3 ? 'gold' : rank <= 10 ? 'blue' : 'default'}>
          #{rank}
        </Tag>
      )
    },
    {
      title: '进步幅度',
      dataIndex: 'improvement',
      key: 'improvement',
      width: 100,
      render: (improvement) => (
        <span style={{ 
          color: improvement > 0 ? '#52c41a' : improvement < 0 ? '#ff4d4f' : '#faad14',
          fontWeight: 'bold'
        }}>
          {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
        </span>
      )
    },
    {
      title: '作业完成率',
      dataIndex: 'homeworkCompletion',
      key: 'homeworkCompletion',
      width: 120,
      render: (rate) => (
        <Progress 
          percent={rate} 
          size="small" 
          strokeColor={rate >= 90 ? '#52c41a' : rate >= 70 ? '#faad14' : '#ff4d4f'}
        />
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="生成报告">
            <Button type="text" icon={<DownloadOutlined />} size="small" />
          </Tooltip>
        </Space>
      )
    }
  ]

  const knowledgeColumns = [
    {
      title: '知识点',
      key: 'knowledge',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.subject} • {record.chapter}
          </div>
        </div>
      )
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (difficulty) => getDifficultyTag(difficulty)
    },
    {
      title: '掌握率',
      dataIndex: 'masteryRate',
      key: 'masteryRate',
      width: 120,
      render: (rate) => (
        <div>
          <Progress 
            percent={rate} 
            size="small" 
            strokeColor={rate >= 80 ? '#52c41a' : rate >= 60 ? '#faad14' : '#ff4d4f'}
          />
          <div style={{ fontSize: '12px', textAlign: 'center', marginTop: 2 }}>
            {rate.toFixed(1)}%
          </div>
        </div>
      )
    },
    {
      title: '需要帮助学生',
      dataIndex: 'studentsNeedHelp',
      key: 'studentsNeedHelp',
      width: 100,
      render: (count) => (
        <Tag color={count > 10 ? 'red' : count > 5 ? 'orange' : 'green'}>
          {count}人
        </Tag>
      )
    },
    {
      title: '常见错误',
      dataIndex: 'commonErrors',
      key: 'commonErrors',
      width: 250,
      render: (errors) => (
        <div>
          {errors.slice(0, 2).map((error, index) => (
            <Tag key={index} style={{ marginBottom: 2 }}>{error}</Tag>
          ))}
          {errors.length > 2 && <Tag>+{errors.length - 2}个</Tag>}
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="生成建议">
            <Button type="text" icon={<BulbOutlined />} size="small" />
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div className="learning-analytics-center">
      <div className="analytics-header">
        <div className="header-title">
          <h2><BarChartOutlined /> 学情分析中心</h2>
          <p>多维度数据分析，个性化学习建议</p>
        </div>
        <Space>
          <Select 
            value={selectedTimeRange} 
            onChange={setSelectedTimeRange}
            style={{ width: 120 }}
          >
            <Option value="week">本周</Option>
            <Option value="month">本月</Option>
            <Option value="semester">本学期</Option>
            <Option value="year">本学年</Option>
          </Select>
          <Select 
            value={selectedSubject} 
            onChange={setSelectedSubject}
            style={{ width: 120 }}
          >
            <Option value="all">全部学科</Option>
            <Option value="数学">数学</Option>
            <Option value="语文">语文</Option>
            <Option value="英语">英语</Option>
            <Option value="物理">物理</Option>
            <Option value="化学">化学</Option>
          </Select>
          <Button icon={<DownloadOutlined />}>导出报告</Button>
        </Space>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        className="analytics-tabs"
        items={[
          {
            key: 'overview',
            label: '数据概览',
            children: (
              <div>
                {/* 统计卡片 */}
                <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="班级人数"
                  value={classStats.totalStudents}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均分"
                  value={classStats.avgScore}
                  precision={1}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<TrophyOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="及格率"
                  value={classStats.passRate}
                  precision={1}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="优秀率"
                  value={classStats.excellentRate}
                  precision={1}
                  suffix="%"
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<StarOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* 学科表现 */}
          <Row gutter={16}>
            <Col span={12}>
              <Card title={<><PieChartOutlined /> 学科平均分对比</>}>
                <div style={{ height: 300 }}>
                  {Object.entries(classStats.subjectPerformance).map(([subject, data]) => (
                    <div key={subject} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>{subject}</span>
                        <span style={{ fontWeight: 'bold' }}>{data.avg}</span>
                      </div>
                      <Progress 
                        percent={(data.avg / 100) * 100} 
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                        showInfo={false}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title={<><LineChartOutlined /> 成绩趋势分析</>}>
                <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <LineChartOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                    <p>趋势图表组件待实现</p>
                  </div>
                </div>
              </Card>
            </Col>
                </Row>
              </div>
            )
          },
          {
            key: 'students',
            label: '学生分析',
            children: (
              <Card>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Select defaultValue="all" style={{ width: 120 }}>
                  <Option value="all">全部班级</Option>
                  <Option value="class1">高一(1)班</Option>
                  <Option value="class2">高一(2)班</Option>
                </Select>
                <Select defaultValue="all" style={{ width: 120 }}>
                  <Option value="all">全部学科</Option>
                  <Option value="数学">数学</Option>
                  <Option value="语文">语文</Option>
                  <Option value="英语">英语</Option>
                </Select>
                <Button icon={<FilterOutlined />}>高级筛选</Button>
              </Space>
            </div>
            <Table
              columns={studentColumns}
              dataSource={students}
              rowKey="id"
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{ padding: '16px', background: '#fafafa' }}>
                    <Row gutter={16}>
                      <Col span={8}>
                        <h4><BookOutlined /> 学科成绩</h4>
                        {Object.entries(record.subjects).map(([subject, data]) => (
                          <div key={subject} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 60 }}>{subject}:</span>
                            <span style={{ fontWeight: 'bold', width: 40 }}>{data.score}</span>
                            <span style={{ fontSize: '12px', color: '#666' }}>排名{data.rank}</span>
                            {getTrendIcon(data.trend)}
                          </div>
                        ))}
                      </Col>
                      <Col span={8}>
                        <h4><ExclamationCircleOutlined /> 薄弱知识点</h4>
                        {record.weakPoints.map((point, index) => (
                          <Tag key={index} color="red" style={{ marginBottom: 4 }}>{point}</Tag>
                        ))}
                        <h4 style={{ marginTop: 16 }}><StarOutlined /> 优势知识点</h4>
                        {record.strongPoints.map((point, index) => (
                          <Tag key={index} color="green" style={{ marginBottom: 4 }}>{point}</Tag>
                        ))}
                      </Col>
                      <Col span={8}>
                        <h4><ClockCircleOutlined /> 学习数据</h4>
                        <div style={{ marginBottom: 8 }}>
                          <span>日均学习时长: </span>
                          <span style={{ fontWeight: 'bold' }}>{record.studyTime}小时</span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <span>出勤率: </span>
                          <span style={{ fontWeight: 'bold', color: '#52c41a' }}>{record.attendance}%</span>
                        </div>
                        <div>
                          <span>作业完成率: </span>
                          <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{record.homeworkCompletion}%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ),
                rowExpandable: (record) => true
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
            />
                  </Card>
            )
          },
          {
            key: 'knowledge',
            label: '知识点分析',
            children: (
              <Card>
            <div style={{ marginBottom: 16 }}>
              <Alert
                message="知识点掌握情况分析"
                description="基于学生作业和考试数据，分析各知识点的掌握情况，识别学习难点和薄弱环节。"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
            </div>
            <Table
              columns={knowledgeColumns}
              dataSource={knowledgePoints}
              rowKey="id"
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{ padding: '16px', background: '#fafafa' }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <h4><ExclamationCircleOutlined /> 常见错误分析</h4>
                        <List
                          size="small"
                          dataSource={record.commonErrors}
                          renderItem={(error, index) => (
                            <List.Item>
                              <span style={{ marginRight: 8, color: '#ff4d4f' }}>•</span>
                              {error}
                            </List.Item>
                          )}
                        />
                      </Col>
                      <Col span={12}>
                        <h4><BulbOutlined /> 改进建议</h4>
                        <List
                          size="small"
                          dataSource={record.recommendedActions}
                          renderItem={(action, index) => (
                            <List.Item>
                              <span style={{ marginRight: 8, color: '#52c41a' }}>✓</span>
                              {action}
                            </List.Item>
                          )}
                        />
                      </Col>
                    </Row>
                  </div>
                ),
                rowExpandable: (record) => true
              }}
              pagination={{
                pageSize: 10,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
            />
          </Card>
            )
          },
          {
            key: 'recommendations',
            label: '个性化建议',
            children: (
              <Row gutter={16}>
            {recommendations.map((rec) => (
              <Col span={8} key={rec.id} style={{ marginBottom: 16 }}>
                <Card
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{rec.title}</span>
                      {getPriorityTag(rec.priority)}
                    </div>
                  }
                  extra={
                    <Tag color={rec.type === 'individual' ? 'blue' : rec.type === 'class' ? 'green' : 'purple'}>
                      {rec.type === 'individual' ? '个人' : rec.type === 'class' ? '班级' : '学科'}
                    </Tag>
                  }
                >
                  <div style={{ marginBottom: 12 }}>
                    <strong>目标对象：</strong>{rec.target}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>类别：</strong>{rec.category}
                  </div>
                  <div style={{ marginBottom: 12, color: '#666' }}>
                    {rec.description}
                  </div>
                  <Divider />
                  <div style={{ marginBottom: 8 }}>
                    <strong>建议措施：</strong>
                  </div>
                  {rec.actions.map((action, index) => (
                    <Tag key={index} style={{ marginBottom: 4 }}>{action}</Tag>
                  ))}
                  <div style={{ marginTop: 12, fontSize: '12px', color: '#999' }}>
                    <div>{rec.expectedImprovement}</div>
                    <div>{rec.timeline}</div>
                  </div>
                </Card>
              </Col>
            ))}
              </Row>
            )
          }
        ]}
      />
    </div>
  )
}

export default LearningAnalyticsCenter