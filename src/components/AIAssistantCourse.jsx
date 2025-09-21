import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Space,
  List,
  Tag,
  Avatar,
  Progress,
  Modal,
  Form,
  Input,
  Select,
  message,
  Spin,
  Alert,
  Divider,
  Rate,
  Timeline,
  Statistic,
  Badge,
  Tooltip
} from 'antd';
import {
  RobotOutlined,
  BulbOutlined,
  BarChartOutlined,
  SettingOutlined,
  StarOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  UserOutlined,
  BookOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const AIAssistantCourse = ({ userProfile, learningHistory, onRecommendationSelect }) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [learningPath, setLearningPath] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showPathModal, setShowPathModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // 模拟AI推荐数据
  const mockRecommendations = [
    {
      id: 1,
      title: '高效沟通技巧',
      type: 'video',
      category: '软技能',
      difficulty: '中级',
      duration: 45,
      rating: 4.8,
      matchScore: 95,
      reason: '基于您的管理岗位和沟通需求分析',
      tags: ['沟通技巧', '团队管理', '领导力'],
      description: '提升职场沟通效率，增强团队协作能力',
      aiInsights: [
        '与您当前学习的"团队管理"课程高度相关',
        '符合您的中级技能水平定位',
        '可以补充您在人际交往方面的技能短板'
      ]
    },
    {
      id: 2,
      title: '数据可视化实战',
      type: 'simulation',
      category: '技术技能',
      difficulty: '中级',
      duration: 60,
      rating: 4.7,
      matchScore: 88,
      reason: '结合您的数据分析学习历史',
      tags: ['数据可视化', 'Python', '图表设计'],
      description: '掌握专业的数据可视化技术和工具',
      aiInsights: [
        '是您"Python数据分析"课程的进阶内容',
        '实战项目可以巩固理论知识',
        '市场需求度高，有助于职业发展'
      ]
    },
    {
      id: 3,
      title: '创新思维训练营',
      type: 'document',
      category: '思维能力',
      difficulty: '初级',
      duration: 30,
      rating: 4.6,
      matchScore: 82,
      reason: '基于您的学习偏好和能力提升需求',
      tags: ['创新思维', '问题解决', '头脑风暴'],
      description: '培养创新思维，提升问题解决能力',
      aiInsights: [
        '可以提升您的综合思维能力',
        '与多个学科领域都有交叉应用',
        '学习时间灵活，适合碎片化学习'
      ]
    }
  ];

  const mockLearningPath = [
    {
      phase: '基础阶段',
      duration: '2-3周',
      status: 'completed',
      courses: [
        { title: 'Python基础语法', type: 'video', completed: true },
        { title: '数据结构入门', type: 'document', completed: true }
      ]
    },
    {
      phase: '进阶阶段',
      duration: '3-4周',
      status: 'current',
      courses: [
        { title: '数据处理实战', type: 'simulation', completed: false },
        { title: '统计分析方法', type: 'video', completed: false }
      ]
    },
    {
      phase: '高级阶段',
      duration: '4-5周',
      status: 'pending',
      courses: [
        { title: '机器学习算法', type: 'simulation', completed: false },
        { title: '项目综合实战', type: 'document', completed: false }
      ]
    }
  ];

  const mockAnalytics = {
    learningEfficiency: 85,
    knowledgeRetention: 78,
    skillImprovement: 92,
    engagementLevel: 88,
    recommendations: [
      '建议增加实践练习时间，提高知识保持率',
      '您在视频学习方面表现优秀，可以多选择此类资源',
      '建议设置更多学习提醒，保持学习连续性'
    ],
    strengths: ['逻辑思维强', '学习专注度高', '实践能力好'],
    improvements: ['理论知识巩固', '跨领域学习', '学习时间规划']
  };

  useEffect(() => {
    // 模拟AI分析和推荐生成
    generateRecommendations();
    generateLearningPath();
    generateAnalytics();
  }, [userProfile, learningHistory]);

  const generateRecommendations = async () => {
    setLoading(true);
    // 模拟AI推荐算法
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 2000);
  };

  const generateLearningPath = async () => {
    // 模拟AI路径生成
    setTimeout(() => {
      setLearningPath(mockLearningPath);
    }, 1500);
  };

  const generateAnalytics = async () => {
    // 模拟AI分析生成
    setTimeout(() => {
      setAnalytics(mockAnalytics);
    }, 1000);
  };

  const handleRefreshRecommendations = () => {
    message.info('正在重新分析您的学习需求...');
    generateRecommendations();
  };

  const handleOptimizePath = () => {
    message.info('AI正在优化您的学习路径...');
    generateLearningPath();
  };

  const handleViewAnalytics = () => {
    setShowAnalyticsModal(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <PlayCircleOutlined />;
      case 'simulation': return <ExperimentOutlined />;
      case 'document': return <FileTextOutlined />;
      default: return <BookOutlined />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'video': return '#1890ff';
      case 'simulation': return '#52c41a';
      case 'document': return '#faad14';
      default: return '#722ed1';
    }
  };

  return (
    <div>
      {/* AI智能推荐 */}
      <Card
        title={
          <Space>
            <RobotOutlined style={{ color: '#1890ff' }} />
            <span>AI智能推荐</span>
            <Badge count="NEW" style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
        extra={
          <Space>
            <Button
              type="link"
              icon={<SyncOutlined />}
              onClick={handleRefreshRecommendations}
              loading={loading}
            >
              刷新推荐
            </Button>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">AI正在分析您的学习偏好和需求...</Text>
            </div>
          </div>
        ) : (
          <List
            dataSource={recommendations}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => onRecommendationSelect && onRecommendationSelect(item)}
                  >
                    加入学习
                  </Button>,
                  <Button
                    type="link"
                    size="small"
                    icon={<HeartOutlined />}
                  >
                    收藏
                  </Button>,
                  <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => setSelectedResource(item)}
                  >
                    详情
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={48}
                      style={{ backgroundColor: getTypeColor(item.type) }}
                      icon={getTypeIcon(item.type)}
                    />
                  }
                  title={
                    <div>
                      <Space>
                        <Text strong>{item.title}</Text>
                        <Tag color="blue">{item.category}</Tag>
                        <Tag color="green">匹配度 {item.matchScore}%</Tag>
                      </Space>
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph ellipsis={{ rows: 1 }} style={{ marginBottom: 8 }}>
                        {item.description}
                      </Paragraph>
                      <Space size="small" wrap style={{ marginBottom: 8 }}>
                        {item.tags.map(tag => (
                          <Tag key={tag} size="small">{tag}</Tag>
                        ))}
                      </Space>
                      <div>
                        <Space size="large">
                          <Text type="secondary">
                            <ClockCircleOutlined /> {item.duration}分钟
                          </Text>
                          <Text type="secondary">
                            <StarOutlined /> {item.rating}
                          </Text>
                          <Text type="secondary">
                            难度: {item.difficulty}
                          </Text>
                        </Space>
                      </div>
                      <Alert
                        message={`AI推荐理由: ${item.reason}`}
                        type="info"
                        showIcon
                        style={{ marginTop: 8 }}
                        icon={<BulbOutlined />}
                      />
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* 智能学习路径 */}
      <Card
        title={
          <Space>
            <SettingOutlined style={{ color: '#52c41a' }} />
            <span>智能学习路径</span>
          </Space>
        }
        extra={
          <Space>
            <Button
              type="link"
              icon={<ThunderboltOutlined />}
              onClick={handleOptimizePath}
            >
              AI优化
            </Button>
            <Button
              type="primary"
              onClick={() => setShowPathModal(true)}
            >
              查看详情
            </Button>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Timeline>
          {learningPath.map((phase, index) => (
            <Timeline.Item
              key={index}
              color={
                phase.status === 'completed' ? 'green' :
                phase.status === 'current' ? 'blue' : 'gray'
              }
              dot={
                phase.status === 'completed' ? <CheckCircleOutlined /> :
                phase.status === 'current' ? <SyncOutlined spin /> : undefined
              }
            >
              <div>
                <Text strong>{phase.phase}</Text>
                <Tag
                  color={
                    phase.status === 'completed' ? 'green' :
                    phase.status === 'current' ? 'blue' : 'default'
                  }
                  style={{ marginLeft: 8 }}
                >
                  {phase.status === 'completed' ? '已完成' :
                   phase.status === 'current' ? '进行中' : '待开始'}
                </Tag>
                <br />
                <Text type="secondary">预计时间: {phase.duration}</Text>
                <div style={{ marginTop: 8 }}>
                  {phase.courses.map((course, courseIndex) => (
                    <Tag
                      key={courseIndex}
                      color={course.completed ? 'green' : 'default'}
                      style={{ marginBottom: 4 }}
                    >
                      {getTypeIcon(course.type)} {course.title}
                    </Tag>
                  ))}
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* 学习效果分析 */}
      <Card
        title={
          <Space>
            <BarChartOutlined style={{ color: '#faad14' }} />
            <span>学习效果分析</span>
          </Space>
        }
        extra={
          <Button type="primary" onClick={handleViewAnalytics}>
            查看详细报告
          </Button>
        }
      >
        {analytics && (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card size="small">
                <Statistic
                  title="学习效率"
                  value={analytics.learningEfficiency}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                />
                <Progress
                  percent={analytics.learningEfficiency}
                  size="small"
                  showInfo={false}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small">
                <Statistic
                  title="知识保持率"
                  value={analytics.knowledgeRetention}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
                <Progress
                  percent={analytics.knowledgeRetention}
                  size="small"
                  showInfo={false}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small">
                <Statistic
                  title="技能提升度"
                  value={analytics.skillImprovement}
                  suffix="%"
                  valueStyle={{ color: '#faad14' }}
                />
                <Progress
                  percent={analytics.skillImprovement}
                  size="small"
                  showInfo={false}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small">
                <Statistic
                  title="参与度"
                  value={analytics.engagementLevel}
                  suffix="%"
                  valueStyle={{ color: '#eb2f96' }}
                />
                <Progress
                  percent={analytics.engagementLevel}
                  size="small"
                  showInfo={false}
                />
              </Card>
            </Col>
          </Row>
        )}
      </Card>

      {/* 学习路径详情模态框 */}
      <Modal
        title="智能学习路径详情"
        open={showPathModal}
        onCancel={() => setShowPathModal(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setShowPathModal(false)}>
            关闭
          </Button>,
          <Button key="optimize" type="primary" icon={<ThunderboltOutlined />}>
            AI重新优化
          </Button>
        ]}
      >
        <Alert
          message="个性化学习路径"
          description="基于您的学习历史、能力水平和目标，AI为您定制的最优学习路径"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <Timeline mode="left">
          {learningPath.map((phase, index) => (
            <Timeline.Item
              key={index}
              label={phase.duration}
              color={
                phase.status === 'completed' ? 'green' :
                phase.status === 'current' ? 'blue' : 'gray'
              }
            >
              <Card size="small">
                <Title level={5}>{phase.phase}</Title>
                <List
                  size="small"
                  dataSource={phase.courses}
                  renderItem={(course) => (
                    <List.Item>
                      <Space>
                        {getTypeIcon(course.type)}
                        <Text>{course.title}</Text>
                        {course.completed && (
                          <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        )}
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </Modal>

      {/* 学习分析详情模态框 */}
      <Modal
        title="学习效果分析报告"
        open={showAnalyticsModal}
        onCancel={() => setShowAnalyticsModal(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setShowAnalyticsModal(false)}>
            关闭
          </Button>,
          <Button key="export" type="primary">
            导出报告
          </Button>
        ]}
      >
        {analytics && (
          <div>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Card title="学习优势" size="small">
                  <List
                    size="small"
                    dataSource={analytics.strengths}
                    renderItem={(item) => (
                      <List.Item>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        {item}
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="改进建议" size="small">
                  <List
                    size="small"
                    dataSource={analytics.improvements}
                    renderItem={(item) => (
                      <List.Item>
                        <BulbOutlined style={{ color: '#faad14', marginRight: 8 }} />
                        {item}
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
            
            <Divider />
            
            <Card title="AI个性化建议" size="small">
              <List
                dataSource={analytics.recommendations}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar size="small">{index + 1}</Avatar>}
                      description={item}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}
      </Modal>

      {/* 资源详情模态框 */}
      <Modal
        title="资源详情"
        open={!!selectedResource}
        onCancel={() => setSelectedResource(null)}
        width={700}
        footer={[
          <Button key="close" onClick={() => setSelectedResource(null)}>
            关闭
          </Button>,
          <Button key="add" type="primary">
            加入学习计划
          </Button>
        ]}
      >
        {selectedResource && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={4}>
                <Avatar
                  size={64}
                  style={{ backgroundColor: getTypeColor(selectedResource.type) }}
                  icon={getTypeIcon(selectedResource.type)}
                />
              </Col>
              <Col span={20}>
                <Title level={4}>{selectedResource.title}</Title>
                <Space size="large">
                  <Text type="secondary">类别: {selectedResource.category}</Text>
                  <Text type="secondary">难度: {selectedResource.difficulty}</Text>
                  <Text type="secondary">时长: {selectedResource.duration}分钟</Text>
                  <Rate disabled defaultValue={selectedResource.rating} />
                </Space>
              </Col>
            </Row>
            
            <Paragraph>{selectedResource.description}</Paragraph>
            
            <Divider />
            
            <Title level={5}>AI分析洞察</Title>
            <List
              size="small"
              dataSource={selectedResource.aiInsights}
              renderItem={(insight) => (
                <List.Item>
                  <BulbOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                  {insight}
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AIAssistantCourse;