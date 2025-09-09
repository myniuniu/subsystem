import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Typography,
  Tag,
  Avatar,
  List,
  Progress,
  Steps,
  Timeline,
  Rate,
  Divider,
  Alert,
  Tooltip,
  Badge,
  Empty,
  Spin
} from 'antd';
import {
  BookOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  StarOutlined,
  RightOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  BulbOutlined,
  RocketOutlined,
  HeartOutlined,
  EyeOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  UserOutlined,
  CalendarOutlined,
  FireOutlined
} from '@ant-design/icons';
import './PersonalizedRecommendation.css';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const PersonalizedRecommendation = () => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // 模拟数据加载
  useEffect(() => {
    setTimeout(() => {
      const mockData = {
        userProfile: {
          name: '张老师',
          level: '中级',
          weakAreas: ['数字安全', '数据分析'],
          strongAreas: ['数字创作', '在线协作'],
          learningStyle: '实践型',
          availableTime: '每周3-5小时'
        },
        recommendedPaths: [
          {
            id: 1,
            title: '数字安全防护专项提升',
            description: '针对网络安全防护能力薄弱，提供系统性学习路径',
            difficulty: '中级',
            duration: '4-6周',
            priority: 'high',
            matchScore: 95,
            tags: ['网络安全', '防护技能', '实用工具'],
            steps: [
              { title: '网络威胁识别', duration: '1周', status: 'wait' },
              { title: '防护工具使用', duration: '2周', status: 'wait' },
              { title: '安全策略制定', duration: '1周', status: 'wait' },
              { title: '综合实践演练', duration: '1-2周', status: 'wait' }
            ],
            resources: [
              {
                type: 'course',
                title: '网络安全基础课程',
                provider: '数字素养学院',
                rating: 4.8,
                duration: '8小时',
                students: 1250,
                free: true
              },
              {
                type: 'video',
                title: '常见网络威胁识别',
                provider: '安全专家讲堂',
                rating: 4.6,
                duration: '45分钟',
                views: 8900,
                free: true
              },
              {
                type: 'practice',
                title: '安全防护实战演练',
                provider: '实验室平台',
                rating: 4.7,
                duration: '2小时',
                participants: 560,
                free: false
              }
            ]
          },
          {
            id: 2,
            title: '数据分析能力进阶',
            description: '从基础数据处理到高级分析技能的完整学习路径',
            difficulty: '中高级',
            duration: '6-8周',
            priority: 'medium',
            matchScore: 88,
            tags: ['数据分析', 'Excel进阶', '可视化'],
            steps: [
              { title: 'Excel高级功能', duration: '2周', status: 'wait' },
              { title: '数据清洗技巧', duration: '1周', status: 'wait' },
              { title: '统计分析方法', duration: '2周', status: 'wait' },
              { title: '数据可视化', duration: '2周', status: 'wait' },
              { title: '项目实战', duration: '1-2周', status: 'wait' }
            ],
            resources: [
              {
                type: 'course',
                title: 'Excel数据分析进阶',
                provider: '办公技能学院',
                rating: 4.9,
                duration: '12小时',
                students: 2340,
                free: false
              },
              {
                type: 'book',
                title: '数据分析实战指南',
                provider: '技术出版社',
                rating: 4.5,
                pages: 320,
                downloads: 1560,
                free: true
              }
            ]
          },
          {
            id: 3,
            title: '数字创作技能拓展',
            description: '在现有优势基础上，拓展更多创作技能和工具',
            difficulty: '中级',
            duration: '3-4周',
            priority: 'low',
            matchScore: 75,
            tags: ['创意设计', '多媒体', '工具进阶'],
            steps: [
              { title: '高级设计技巧', duration: '1周', status: 'wait' },
              { title: '动画制作入门', duration: '1周', status: 'wait' },
              { title: '交互设计基础', duration: '1周', status: 'wait' },
              { title: '作品集制作', duration: '1周', status: 'wait' }
            ],
            resources: [
              {
                type: 'course',
                title: '创意设计进阶课程',
                provider: '设计学院',
                rating: 4.7,
                duration: '10小时',
                students: 890,
                free: false
              }
            ]
          }
        ],
        quickResources: [
          {
            id: 1,
            title: '5分钟学会密码安全设置',
            type: 'video',
            duration: '5分钟',
            difficulty: '入门',
            rating: 4.8,
            hot: true
          },
          {
            id: 2,
            title: 'Excel函数速查手册',
            type: 'document',
            pages: 50,
            difficulty: '中级',
            rating: 4.6,
            downloads: 5600
          },
          {
            id: 3,
            title: '数字素养自测题库',
            type: 'practice',
            questions: 100,
            difficulty: '全级别',
            rating: 4.7,
            participants: 12000
          },
          {
            id: 4,
            title: '在线协作工具对比',
            type: 'article',
            readTime: '8分钟',
            difficulty: '入门',
            rating: 4.5,
            views: 3400
          }
        ],
        learningProgress: {
          completedCourses: 8,
          totalHours: 45,
          certificates: 3,
          currentStreak: 12,
          weeklyGoal: 5,
          weeklyProgress: 3
        }
      };
      setRecommendations(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // 获取优先级颜色
  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ff4d4f',
      medium: '#fa8c16',
      low: '#52c41a'
    };
    return colors[priority] || '#d9d9d9';
  };

  // 获取资源类型图标
  const getResourceIcon = (type) => {
    const icons = {
      course: <BookOutlined />,
      video: <PlayCircleOutlined />,
      book: <FileTextOutlined />,
      practice: <RocketOutlined />,
      document: <FileTextOutlined />,
      article: <FileTextOutlined />
    };
    return icons[type] || <BookOutlined />;
  };

  // 获取难度标签颜色
  const getDifficultyColor = (difficulty) => {
    const colors = {
      '入门': '#52c41a',
      '中级': '#1890ff',
      '中高级': '#722ed1',
      '高级': '#eb2f96',
      '全级别': '#fa8c16'
    };
    return colors[difficulty] || '#d9d9d9';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>正在分析您的学习需求...</Text>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return <Empty description="暂无推荐内容" />;
  }

  const { userProfile, recommendedPaths, quickResources, learningProgress } = recommendations;

  return (
    <div className="personalized-recommendation">
      {/* 用户画像和学习进度 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="个人学习画像" className="user-profile">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className="profile-item">
                  <Text type="secondary">当前水平：</Text>
                  <Tag color="blue" style={{ marginLeft: 8 }}>{userProfile.level}</Tag>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="profile-item">
                  <Text type="secondary">学习风格：</Text>
                  <Tag color="green" style={{ marginLeft: 8 }}>{userProfile.learningStyle}</Tag>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="profile-item">
                  <Text type="secondary">可用时间：</Text>
                  <Text style={{ marginLeft: 8 }}>{userProfile.availableTime}</Text>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="profile-item">
                  <Text type="secondary">学习连续天数：</Text>
                  <Text style={{ marginLeft: 8, color: '#fa8c16' }}>
                    <FireOutlined /> {learningProgress.currentStreak} 天
                  </Text>
                </div>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className="profile-section">
                  <Text strong>薄弱领域：</Text>
                  <div style={{ marginTop: 8 }}>
                    {userProfile.weakAreas.map(area => (
                      <Tag key={area} color="red" style={{ marginBottom: 4 }}>{area}</Tag>
                    ))}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="profile-section">
                  <Text strong>优势领域：</Text>
                  <div style={{ marginTop: 8 }}>
                    {userProfile.strongAreas.map(area => (
                      <Tag key={area} color="green" style={{ marginBottom: 4 }}>{area}</Tag>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="学习进度" className="learning-progress">
            <div className="progress-item">
              <div className="progress-header">
                <Text>本周学习目标</Text>
                <Text strong>{learningProgress.weeklyProgress}/{learningProgress.weeklyGoal} 小时</Text>
              </div>
              <Progress 
                percent={(learningProgress.weeklyProgress / learningProgress.weeklyGoal) * 100}
                strokeColor="#52c41a"
                format={() => `${Math.round((learningProgress.weeklyProgress / learningProgress.weeklyGoal) * 100)}%`}
              />
            </div>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="stat-item">
                  <div className="stat-value">{learningProgress.completedCourses}</div>
                  <div className="stat-label">完成课程</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="stat-item">
                  <div className="stat-value">{learningProgress.totalHours}</div>
                  <div className="stat-label">学习时长</div>
                </div>
              </Col>
            </Row>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Badge count={learningProgress.certificates} showZero>
                <TrophyOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              </Badge>
              <div style={{ marginTop: 4 }}>
                <Text type="secondary">获得证书</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 推荐学习路径 */}
      <Card title="推荐学习路径" style={{ marginBottom: 24 }}>
        <Alert
          message="智能推荐"
          description="基于您的测评结果和学习偏好，为您推荐以下学习路径"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Row gutter={[24, 24]}>
          {recommendedPaths.map(path => (
            <Col xs={24} lg={8} key={path.id}>
              <Card 
                className={`learning-path ${selectedPath === path.id ? 'selected' : ''}`}
                hoverable
                onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
                extra={
                  <div className="path-meta">
                    <Tag color={getPriorityColor(path.priority)}>
                      {path.priority === 'high' ? '高优先级' : path.priority === 'medium' ? '中优先级' : '低优先级'}
                    </Tag>
                    <div className="match-score">
                      <Text strong style={{ color: '#52c41a' }}>{path.matchScore}%</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>匹配度</Text>
                    </div>
                  </div>
                }
              >
                <div className="path-header">
                  <Title level={4}>{path.title}</Title>
                  <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                    {path.description}
                  </Paragraph>
                </div>
                
                <div className="path-info">
                  <Space wrap>
                    <Tag color="blue">{path.difficulty}</Tag>
                    <Tag icon={<ClockCircleOutlined />}>{path.duration}</Tag>
                  </Space>
                </div>

                <div className="path-tags">
                  {path.tags.map(tag => (
                    <Tag key={tag} size="small">{tag}</Tag>
                  ))}
                </div>

                {selectedPath === path.id && (
                  <div className="path-details">
                    <Divider />
                    <div className="learning-steps">
                      <Text strong>学习步骤：</Text>
                      <Steps 
                        direction="vertical" 
                        size="small" 
                        current={currentStep}
                        style={{ marginTop: 12 }}
                      >
                        {path.steps.map((step, index) => (
                          <Step 
                            key={index}
                            title={step.title} 
                            description={`预计用时：${step.duration}`}
                          />
                        ))}
                      </Steps>
                    </div>
                    
                    <div className="path-resources" style={{ marginTop: 16 }}>
                      <Text strong>推荐资源：</Text>
                      <List
                        size="small"
                        dataSource={path.resources}
                        renderItem={resource => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={getResourceIcon(resource.type)}
                              title={
                                <div className="resource-title">
                                  <Text>{resource.title}</Text>
                                  {resource.free && <Tag color="green" size="small">免费</Tag>}
                                  {resource.hot && <Tag color="red" size="small">热门</Tag>}
                                </div>
                              }
                              description={
                                <Space>
                                  <Text type="secondary">{resource.provider}</Text>
                                  <Rate disabled defaultValue={resource.rating} size="small" />
                                  <Text type="secondary">
                                    {resource.duration || resource.pages + '页' || resource.questions + '题'}
                                  </Text>
                                </Space>
                              }
                            />
                            <Button type="link" size="small">查看</Button>
                          </List.Item>
                        )}
                      />
                    </div>
                    
                    <div className="path-actions" style={{ marginTop: 16, textAlign: 'center' }}>
                      <Space>
                        <Button type="primary" icon={<RocketOutlined />}>
                          开始学习
                        </Button>
                        <Button icon={<HeartOutlined />}>
                          收藏路径
                        </Button>
                        <Button icon={<ShareAltOutlined />}>
                          分享
                        </Button>
                      </Space>
                    </div>
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 快速学习资源 */}
      <Card title="快速学习资源" extra={<Button type="link">查看更多</Button>}>
        <Alert
          message="碎片化学习"
          description="利用碎片时间，快速提升特定技能"
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Row gutter={[16, 16]}>
          {quickResources.map(resource => (
            <Col xs={24} sm={12} lg={6} key={resource.id}>
              <Card 
                size="small" 
                hoverable
                className="quick-resource"
                cover={
                  <div className="resource-cover">
                    {getResourceIcon(resource.type)}
                    {resource.hot && (
                      <div className="hot-badge">
                        <FireOutlined style={{ color: '#ff4d4f' }} />
                      </div>
                    )}
                  </div>
                }
              >
                <Card.Meta
                  title={
                    <Tooltip title={resource.title}>
                      <Text ellipsis style={{ fontSize: 14 }}>{resource.title}</Text>
                    </Tooltip>
                  }
                  description={
                    <div className="resource-meta">
                      <div>
                        <Tag color={getDifficultyColor(resource.difficulty)} size="small">
                          {resource.difficulty}
                        </Tag>
                      </div>
                      <div className="resource-stats">
                        <Rate disabled defaultValue={resource.rating} size="small" />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {resource.duration || resource.pages + '页' || resource.questions + '题' || resource.readTime}
                        </Text>
                      </div>
                      <div className="resource-engagement">
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {resource.downloads && `${resource.downloads} 下载`}
                          {resource.views && `${resource.views} 浏览`}
                          {resource.participants && `${resource.participants} 参与`}
                        </Text>
                      </div>
                    </div>
                  }
                />
                <div className="resource-actions">
                  <Space size="small">
                    <Button type="link" size="small" icon={<EyeOutlined />}>
                      查看
                    </Button>
                    <Button type="link" size="small" icon={<DownloadOutlined />}>
                      获取
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default PersonalizedRecommendation;