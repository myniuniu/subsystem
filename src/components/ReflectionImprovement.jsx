import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Space,
  List,
  Avatar,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tabs,
  Alert,
  Badge,
  Progress,
  Timeline,
  Descriptions,
  Rate,
  Tooltip,
  Popconfirm,
  message,
  Table,
  Divider,
  Statistic,
  Empty,
  Upload,
  Checkbox
} from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  FileTextOutlined,
  BarChartOutlined,
  TrophyOutlined,
  BulbOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  EyeOutlined,
  StarOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  AimOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  LineChartOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ReflectionImprovement = () => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [analysisData, setAnalysisData] = useState({});
  const [reflectionData, setReflectionData] = useState({});
  const [improvementData, setImprovementData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [form] = Form.useForm();

  // 模拟数据
  useEffect(() => {
    const mockAnalysisData = {
      overallStats: {
        totalClasses: 24,
        totalStudents: 156,
        averageScore: 78.5,
        passRate: 85.2,
        improvementRate: 12.3
      },
      classPerformance: [
        { class: '计算机1班', students: 32, avgScore: 82.1, passRate: 90.6, participation: 95.2 },
        { class: '计算机2班', students: 28, avgScore: 76.8, passRate: 82.1, participation: 88.7 },
        { class: '计算机3班', students: 30, avgScore: 79.3, passRate: 86.7, participation: 91.3 },
        { class: '软件1班', students: 35, avgScore: 75.2, passRate: 80.0, participation: 85.1 },
        { class: '软件2班', students: 31, avgScore: 81.6, passRate: 87.1, participation: 93.5 }
      ],
      knowledgePointAnalysis: [
        { point: '算法设计', coverage: 95, mastery: 78, difficulty: 'high' },
        { point: '数据结构', coverage: 88, mastery: 82, difficulty: 'medium' },
        { point: '数据库原理', coverage: 92, mastery: 75, difficulty: 'high' },
        { point: '软件工程', coverage: 85, mastery: 88, difficulty: 'low' },
        { point: '计算机网络', coverage: 90, mastery: 73, difficulty: 'high' }
      ],
      participationTrend: [
        { week: '第1周', participation: 85, interaction: 72, homework: 90 },
        { week: '第2周', participation: 88, interaction: 75, homework: 85 },
        { week: '第3周', participation: 82, interaction: 78, homework: 88 },
        { week: '第4周', participation: 90, interaction: 82, homework: 92 },
        { week: '第5周', participation: 87, interaction: 85, homework: 89 },
        { week: '第6周', participation: 92, interaction: 88, homework: 94 }
      ],
      goalAchievement: [
        { goal: '提升算法理解能力', target: 80, actual: 78, status: 'warning' },
        { goal: '增强实践操作技能', target: 85, actual: 88, status: 'success' },
        { goal: '培养团队协作能力', target: 75, actual: 82, status: 'success' },
        { goal: '提高问题解决能力', target: 90, actual: 85, status: 'warning' }
      ]
    };

    const mockReflectionData = {
      teachingActivities: [
        {
          id: 1,
          title: '算法可视化教学实践',
          date: '2024-01-15',
          type: '创新教学',
          participants: 32,
          duration: '2小时',
          effectiveness: 4.2,
          feedback: {
            positive: ['直观易懂', '互动性强', '提升理解'],
            negative: ['时间紧张', '部分内容过快'],
            suggestions: ['增加练习时间', '分层教学']
          },
          dataInsights: {
            engagementRate: 92,
            completionRate: 88,
            satisfactionScore: 4.2
          }
        },
        {
          id: 2,
          title: '项目驱动式数据库设计',
          date: '2024-01-10',
          type: '项目教学',
          participants: 28,
          duration: '4小时',
          effectiveness: 4.5,
          feedback: {
            positive: ['实践性强', '贴近实际', '团队合作'],
            negative: ['难度较大', '时间不够'],
            suggestions: ['提供更多指导', '延长项目周期']
          },
          dataInsights: {
            engagementRate: 95,
            completionRate: 85,
            satisfactionScore: 4.5
          }
        }
      ],
      reflectionReports: [
        {
          id: 1,
          title: '第一学期算法课程教学反思',
          date: '2024-01-20',
          author: '张老师',
          type: '学期总结',
          status: 'completed',
          summary: '本学期算法课程整体效果良好，学生参与度高，但在复杂算法理解方面仍需加强',
          keyFindings: [
            '可视化教学方法效果显著',
            '学生对实践项目兴趣浓厚',
            '基础薄弱学生需要更多支持'
          ],
          improvements: [
            '增加基础算法练习',
            '引入更多实际案例',
            '建立学习小组互助机制'
          ]
        },
        {
          id: 2,
          title: '数据库课程中期教学反思',
          date: '2024-01-18',
          author: '李老师',
          type: '中期反思',
          status: 'draft',
          summary: '数据库课程进展顺利，学生对理论知识掌握较好，但实践能力有待提升',
          keyFindings: [
            '理论教学效果良好',
            '实践环节参与度不够',
            '学生缺乏实际项目经验'
          ],
          improvements: [
            '增加实践项目比重',
            '引入企业真实案例',
            '加强上机实验指导'
          ]
        }
      ]
    };

    const mockImprovementData = {
      improvementPlans: [
        {
          id: 1,
          title: '算法教学方法优化计划',
          startDate: '2024-02-01',
          endDate: '2024-06-30',
          status: 'active',
          progress: 35,
          priority: 'high',
          objectives: [
            '提升学生算法理解能力',
            '增强实践操作技能',
            '培养问题解决思维'
          ],
          actions: [
            { action: '引入算法可视化工具', status: 'completed', deadline: '2024-02-15' },
            { action: '设计分层练习题库', status: 'in_progress', deadline: '2024-03-01' },
            { action: '建立学习小组机制', status: 'pending', deadline: '2024-03-15' },
            { action: '开发在线评测系统', status: 'pending', deadline: '2024-04-01' }
          ],
          expectedOutcomes: [
            '学生算法理解能力提升15%',
            '实践项目完成率达到90%',
            '课堂参与度提升20%'
          ]
        },
        {
          id: 2,
          title: '数据库实践教学改进方案',
          startDate: '2024-02-15',
          endDate: '2024-07-15',
          status: 'planning',
          progress: 10,
          priority: 'medium',
          objectives: [
            '加强实践教学环节',
            '提升学生动手能力',
            '增强项目实战经验'
          ],
          actions: [
            { action: '设计企业级项目案例', status: 'in_progress', deadline: '2024-03-01' },
            { action: '建立实验环境', status: 'pending', deadline: '2024-03-15' },
            { action: '制定实践评价标准', status: 'pending', deadline: '2024-04-01' }
          ],
          expectedOutcomes: [
            '实践项目通过率达到85%',
            '学生满意度提升至4.5分',
            '就业竞争力显著增强'
          ]
        }
      ],
      bestPractices: [
        {
          id: 1,
          title: '算法可视化教学法',
          category: '教学方法',
          description: '通过动画演示算法执行过程，帮助学生直观理解算法原理',
          applicableSubjects: ['数据结构', '算法设计', '计算机图形学'],
          effectiveness: 4.6,
          adoptionRate: 78,
          benefits: [
            '提升学习兴趣',
            '降低理解难度',
            '增强记忆效果'
          ],
          implementation: [
            '选择合适的可视化工具',
            '设计教学演示案例',
            '结合实际编程练习'
          ]
        },
        {
          id: 2,
          title: '项目驱动式学习',
          category: '教学模式',
          description: '以实际项目为载体，让学生在项目实践中掌握知识和技能',
          applicableSubjects: ['软件工程', '数据库设计', '系统开发'],
          effectiveness: 4.4,
          adoptionRate: 65,
          benefits: [
            '提升实践能力',
            '增强团队协作',
            '贴近工作实际'
          ],
          implementation: [
            '选择合适的项目题目',
            '制定项目实施计划',
            '建立评价考核机制'
          ]
        }
      ],
      successStories: [
        {
          id: 1,
          title: '计算机1班算法课程改革成功案例',
          teacher: '张老师',
          class: '计算机1班',
          period: '2023年秋季学期',
          challenge: '学生对抽象算法概念理解困难，学习积极性不高',
          solution: '引入可视化教学工具，采用分层教学方法，建立学习小组',
          results: [
            '平均成绩提升12分',
            '及格率从75%提升到90%',
            '学生满意度达到4.5分'
          ],
          keyFactors: [
            '教学方法创新',
            '因材施教',
            '及时反馈调整'
          ]
        }
      ]
    };

    setAnalysisData(mockAnalysisData);
    setReflectionData(mockReflectionData);
    setImprovementData(mockImprovementData);
  }, []);

  // 处理创建反思报告
  const handleCreateReflection = (values) => {
    console.log('创建反思报告:', values);
    message.success('反思报告创建成功');
    setModalVisible(false);
    form.resetFields();
  };

  // 处理创建改进计划
  const handleCreateImprovement = (values) => {
    console.log('创建改进计划:', values);
    message.success('改进计划创建成功');
    setModalVisible(false);
    form.resetFields();
  };

  // 渲染教学效果分析
  const renderEffectAnalysis = () => {
    const { overallStats, classPerformance, knowledgePointAnalysis, participationTrend, goalAchievement } = analysisData;
    
    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 整体统计 */}
        <Card title="整体教学效果概览">
          <Row gutter={[24, 24]}>
            <Col xs={12} sm={8} lg={4}>
              <Statistic
                title="授课班级"
                value={overallStats?.totalClasses}
                suffix="个"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Statistic
                title="学生总数"
                value={overallStats?.totalStudents}
                suffix="人"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Statistic
                title="平均成绩"
                value={overallStats?.averageScore}
                precision={1}
                suffix="分"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Statistic
                title="及格率"
                value={overallStats?.passRate}
                precision={1}
                suffix="%"
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Statistic
                title="提升率"
                value={overallStats?.improvementRate}
                precision={1}
                suffix="%"
                valueStyle={{ color: '#eb2f96' }}
              />
            </Col>
          </Row>
        </Card>

        {/* 班级表现对比 */}
        <Card title="班级表现对比分析">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="avgScore" fill="#1890ff" name="平均成绩" />
              <Bar dataKey="passRate" fill="#52c41a" name="及格率" />
              <Bar dataKey="participation" fill="#fa8c16" name="参与度" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Row gutter={[24, 24]}>
          {/* 知识点掌握分析 */}
          <Col xs={24} lg={12}>
            <Card title="知识点掌握情况">
              <List
                dataSource={knowledgePointAnalysis}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>{item.point}</Text>
                          <Tag color={getDifficultyColor(item.difficulty)}>
                            {getDifficultyText(item.difficulty)}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div>
                            <Text type="secondary">覆盖率：</Text>
                            <Progress percent={item.coverage} size="small" strokeColor="#1890ff" />
                          </div>
                          <div>
                            <Text type="secondary">掌握度：</Text>
                            <Progress percent={item.mastery} size="small" strokeColor="#52c41a" />
                          </div>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* 参与度趋势 */}
          <Col xs={24} lg={12}>
            <Card title="学生参与度趋势">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={participationTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="participation" stroke="#1890ff" name="课堂参与" />
                  <Line type="monotone" dataKey="interaction" stroke="#52c41a" name="互动频率" />
                  <Line type="monotone" dataKey="homework" stroke="#fa8c16" name="作业完成" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* 教学目标达成度 */}
        <Card title="教学目标达成度分析">
          <List
            dataSource={goalAchievement}
            renderItem={(goal) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      icon={<AimOutlined />} 
                      style={{ backgroundColor: getGoalStatusColor(goal.status) }}
                    />
                  }
                  title={goal.goal}
                  description={
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space>
                        <Text>目标值：{goal.target}%</Text>
                        <Text>实际值：{goal.actual}%</Text>
                        <Tag color={getGoalStatusColor(goal.status)}>
                          {getGoalStatusText(goal.status)}
                        </Tag>
                      </Space>
                      <Progress 
                        percent={(goal.actual / goal.target) * 100} 
                        strokeColor={getGoalStatusColor(goal.status)}
                        format={() => `${goal.actual}%`}
                      />
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Space>
    );
  };

  // 渲染教学活动复盘
  const renderActivityReview = () => {
    const { teachingActivities, reflectionReports } = reflectionData;
    
    return (
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card 
            title="教学活动复盘"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setModalType('reflection');
                  setModalVisible(true);
                }}
              >
                新建反思
              </Button>
            }
          >
            <List
              dataSource={teachingActivities}
              renderItem={(activity) => (
                <List.Item
                  actions={[
                    <Button size="small" icon={<EyeOutlined />}>
                      查看详情
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={<BookOutlined />} 
                        style={{ backgroundColor: '#1890ff' }}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{activity.title}</Text>
                        <Tag color="blue">{activity.type}</Tag>
                        <Rate disabled defaultValue={activity.effectiveness} allowHalf style={{ fontSize: '12px' }} />
                      </Space>
                    }
                    description={
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Space>
                          <Text type="secondary">日期：{activity.date}</Text>
                          <Text type="secondary">参与：{activity.participants}人</Text>
                          <Text type="secondary">时长：{activity.duration}</Text>
                        </Space>
                        <div>
                          <Text strong>数据洞察：</Text>
                          <Space>
                            <Text type="secondary">参与率 {activity.dataInsights.engagementRate}%</Text>
                            <Text type="secondary">完成率 {activity.dataInsights.completionRate}%</Text>
                            <Text type="secondary">满意度 {activity.dataInsights.satisfactionScore}分</Text>
                          </Space>
                        </div>
                        <div>
                          <Text strong>关键反馈：</Text>
                          <div style={{ marginTop: 4 }}>
                            {activity.feedback.positive.slice(0, 3).map(item => (
                              <Tag key={item} color="green">{item}</Tag>
                            ))}
                          </div>
                        </div>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={10}>
          <Card title="反思报告">
            <List
              dataSource={reflectionReports}
              renderItem={(report) => (
                <List.Item
                  actions={[
                    <Button 
                      size="small" 
                      icon={<EyeOutlined />}
                      onClick={() => {
                        setSelectedReport(report);
                        setModalType('viewReport');
                        setModalVisible(true);
                      }}
                    >
                      查看
                    </Button>,
                    <Button size="small" icon={<EditOutlined />}>
                      编辑
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={<FileTextOutlined />} 
                        style={{ backgroundColor: getReportStatusColor(report.status) }}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{report.title}</Text>
                        <Tag color={getReportStatusColor(report.status)}>
                          {getReportStatusText(report.status)}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text type="secondary">{report.date} · {report.author}</Text>
                        <Paragraph ellipsis={{ rows: 2 }}>{report.summary}</Paragraph>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  // 渲染改进方案
  const renderImprovementPlans = () => {
    const { improvementPlans, bestPractices, successStories } = improvementData;
    
    return (
      <Tabs defaultActiveKey="plans" type="card">
        <TabPane tab="改进计划" key="plans">
          <Card 
            title="教学改进计划"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setModalType('improvement');
                  setModalVisible(true);
                }}
              >
                新建计划
              </Button>
            }
          >
            <List
              dataSource={improvementPlans}
              renderItem={(plan) => (
                <List.Item>
                  <Card 
                    title={
                      <Space>
                        <Text strong>{plan.title}</Text>
                        <Tag color={getPriorityColor(plan.priority)}>
                          {getPriorityText(plan.priority)}
                        </Tag>
                        <Tag color={getPlanStatusColor(plan.status)}>
                          {getPlanStatusText(plan.status)}
                        </Tag>
                      </Space>
                    }
                    extra={
                      <Space>
                        <Text type="secondary">{plan.startDate} ~ {plan.endDate}</Text>
                      </Space>
                    }
                    style={{ width: '100%' }}
                  >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <div>
                        <Text strong>执行进度：</Text>
                        <Progress percent={plan.progress} strokeColor="#52c41a" />
                      </div>
                      
                      <div>
                        <Text strong>目标：</Text>
                        <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                          {plan.objectives.map((obj, index) => (
                            <li key={index}><Text>{obj}</Text></li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <Text strong>行动计划：</Text>
                        <Timeline size="small" style={{ marginTop: 8 }}>
                          {plan.actions.map((action, index) => (
                            <Timeline.Item
                              key={index}
                              color={getActionStatusColor(action.status)}
                              dot={getActionStatusIcon(action.status)}
                            >
                              <Space>
                                <Text>{action.action}</Text>
                                <Text type="secondary">{action.deadline}</Text>
                                <Tag color={getActionStatusColor(action.status)}>
                                  {getActionStatusText(action.status)}
                                </Tag>
                              </Space>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      </div>
                      
                      <div>
                        <Text strong>预期成果：</Text>
                        <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                          {plan.expectedOutcomes.map((outcome, index) => (
                            <li key={index}><Text type="secondary">{outcome}</Text></li>
                          ))}
                        </ul>
                      </div>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="最佳实践" key="practices">
          <Row gutter={[16, 16]}>
            {bestPractices?.map((practice) => (
              <Col xs={24} lg={12} key={practice.id}>
                <Card 
                  title={practice.title}
                  extra={
                    <Space>
                      <Rate disabled defaultValue={practice.effectiveness} allowHalf style={{ fontSize: '12px' }} />
                      <Text type="secondary">采用率 {practice.adoptionRate}%</Text>
                    </Space>
                  }
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Tag color="blue">{practice.category}</Tag>
                    </div>
                    <Paragraph>{practice.description}</Paragraph>
                    
                    <div>
                      <Text strong>适用科目：</Text>
                      <div style={{ marginTop: 4 }}>
                        {practice.applicableSubjects.map(subject => (
                          <Tag key={subject} color="green">{subject}</Tag>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Text strong>主要优势：</Text>
                      <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                        {practice.benefits.map((benefit, index) => (
                          <li key={index}><Text type="secondary">{benefit}</Text></li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button type="primary" block>
                      应用此实践
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>
        
        <TabPane tab="成功案例" key="stories">
          <List
            dataSource={successStories}
            renderItem={(story) => (
              <List.Item>
                <Card 
                  title={story.title}
                  extra={
                    <Space>
                      <Text type="secondary">{story.teacher}</Text>
                      <Text type="secondary">{story.period}</Text>
                    </Space>
                  }
                  style={{ width: '100%' }}
                >
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="授课班级">{story.class}</Descriptions.Item>
                    <Descriptions.Item label="面临挑战">{story.challenge}</Descriptions.Item>
                    <Descriptions.Item label="解决方案">{story.solution}</Descriptions.Item>
                  </Descriptions>
                  
                  <Divider />
                  
                  <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12}>
                      <div>
                        <Text strong>取得成果：</Text>
                        <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                          {story.results.map((result, index) => (
                            <li key={index}><Text type="secondary">{result}</Text></li>
                          ))}
                        </ul>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div>
                        <Text strong>关键因素：</Text>
                        <div style={{ marginTop: 4 }}>
                          {story.keyFactors.map(factor => (
                            <Tag key={factor} color="gold">{factor}</Tag>
                          ))}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    );
  };

  // 辅助函数
  const getDifficultyColor = (difficulty) => {
    const colors = { 'low': 'green', 'medium': 'orange', 'high': 'red' };
    return colors[difficulty] || 'default';
  };

  const getDifficultyText = (difficulty) => {
    const texts = { 'low': '简单', 'medium': '中等', 'high': '困难' };
    return texts[difficulty] || '中等';
  };

  const getGoalStatusColor = (status) => {
    const colors = { 'success': '#52c41a', 'warning': '#fa8c16', 'error': '#ff4d4f' };
    return colors[status] || '#fa8c16';
  };

  const getGoalStatusText = (status) => {
    const texts = { 'success': '已达成', 'warning': '接近目标', 'error': '未达成' };
    return texts[status] || '进行中';
  };

  const getReportStatusColor = (status) => {
    const colors = { 'completed': '#52c41a', 'draft': '#fa8c16' };
    return colors[status] || '#fa8c16';
  };

  const getReportStatusText = (status) => {
    const texts = { 'completed': '已完成', 'draft': '草稿' };
    return texts[status] || '草稿';
  };

  const getPriorityColor = (priority) => {
    const colors = { 'high': '#ff4d4f', 'medium': '#fa8c16', 'low': '#52c41a' };
    return colors[priority] || '#fa8c16';
  };

  const getPriorityText = (priority) => {
    const texts = { 'high': '高优先级', 'medium': '中优先级', 'low': '低优先级' };
    return texts[priority] || '中优先级';
  };

  const getPlanStatusColor = (status) => {
    const colors = { 'active': '#52c41a', 'planning': '#fa8c16', 'completed': '#1890ff' };
    return colors[status] || '#fa8c16';
  };

  const getPlanStatusText = (status) => {
    const texts = { 'active': '执行中', 'planning': '规划中', 'completed': '已完成' };
    return texts[status] || '规划中';
  };

  const getActionStatusColor = (status) => {
    const colors = { 'pending': 'default', 'in_progress': 'blue', 'completed': 'green' };
    return colors[status] || 'default';
  };

  const getActionStatusText = (status) => {
    const texts = { 'pending': '待执行', 'in_progress': '进行中', 'completed': '已完成' };
    return texts[status] || '待执行';
  };

  const getActionStatusIcon = (status) => {
    const icons = { 
      'pending': <ClockCircleOutlined />, 
      'in_progress': <ExclamationCircleOutlined />, 
      'completed': <CheckCircleOutlined /> 
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  return (
    <div className="reflection-improvement">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="教学效果分析" key="analysis">
          {renderEffectAnalysis()}
        </TabPane>
        
        <TabPane tab="教学活动复盘" key="reflection">
          {renderActivityReview()}
        </TabPane>
        
        <TabPane tab="改进方案" key="improvement">
          {renderImprovementPlans()}
        </TabPane>
      </Tabs>

      {/* 通用模态框 */}
      <Modal
        title={
          modalType === 'reflection' ? '创建教学反思报告' :
          modalType === 'improvement' ? '创建改进计划' :
          modalType === 'viewReport' ? '查看反思报告' : '操作'
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedReport(null);
          form.resetFields();
        }}
        footer={modalType === 'viewReport' ? [
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ] : null}
        width={800}
      >
        {modalType === 'reflection' && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateReflection}
          >
            <Form.Item
              name="title"
              label="报告标题"
              rules={[{ required: true, message: '请输入报告标题' }]}
            >
              <Input placeholder="请输入反思报告标题" />
            </Form.Item>
            <Form.Item
              name="type"
              label="报告类型"
              rules={[{ required: true, message: '请选择报告类型' }]}
            >
              <Select placeholder="选择报告类型">
                <Option value="daily">日常反思</Option>
                <Option value="weekly">周反思</Option>
                <Option value="monthly">月度反思</Option>
                <Option value="semester">学期总结</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="summary"
              label="总结概述"
              rules={[{ required: true, message: '请输入总结概述' }]}
            >
              <TextArea rows={4} placeholder="请简要概述本次教学反思的主要内容" />
            </Form.Item>
            <Form.Item
              name="keyFindings"
              label="关键发现"
            >
              <TextArea rows={3} placeholder="请列出教学过程中的关键发现和洞察" />
            </Form.Item>
            <Form.Item
              name="improvements"
              label="改进建议"
            >
              <TextArea rows={3} placeholder="请提出具体的改进建议和措施" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  创建报告
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
        
        {modalType === 'improvement' && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateImprovement}
          >
            <Form.Item
              name="title"
              label="计划标题"
              rules={[{ required: true, message: '请输入计划标题' }]}
            >
              <Input placeholder="请输入改进计划标题" />
            </Form.Item>
            <Form.Item
              name="priority"
              label="优先级"
              rules={[{ required: true, message: '请选择优先级' }]}
            >
              <Select placeholder="选择优先级">
                <Option value="high">高优先级</Option>
                <Option value="medium">中优先级</Option>
                <Option value="low">低优先级</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="dateRange"
              label="执行周期"
              rules={[{ required: true, message: '请选择执行周期' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="objectives"
              label="改进目标"
              rules={[{ required: true, message: '请输入改进目标' }]}
            >
              <TextArea rows={3} placeholder="请列出具体的改进目标" />
            </Form.Item>
            <Form.Item
              name="actions"
              label="行动计划"
              rules={[{ required: true, message: '请输入行动计划' }]}
            >
              <TextArea rows={4} placeholder="请详细描述具体的行动计划和实施步骤" />
            </Form.Item>
            <Form.Item
              name="expectedOutcomes"
              label="预期成果"
            >
              <TextArea rows={3} placeholder="请描述预期达到的成果和效果" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  创建计划
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
        
        {modalType === 'viewReport' && selectedReport && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="报告类型">{selectedReport.type}</Descriptions.Item>
              <Descriptions.Item label="创建日期">{selectedReport.date}</Descriptions.Item>
              <Descriptions.Item label="作者">{selectedReport.author}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getReportStatusColor(selectedReport.status)}>
                  {getReportStatusText(selectedReport.status)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>总结概述</Title>
              <Paragraph>{selectedReport.summary}</Paragraph>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>关键发现</Title>
              <ul>
                {selectedReport.keyFindings?.map((finding, index) => (
                  <li key={index}>{finding}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <Title level={5}>改进建议</Title>
              <ul>
                {selectedReport.improvements?.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReflectionImprovement;