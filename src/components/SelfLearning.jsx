import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Table,
  Tag,
  Avatar,
  Progress,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
  Tabs,
  Statistic,
  List,
  Badge,
  Tooltip,
  Popconfirm,
  Steps,
  Timeline,
  Rate,
  Divider,
  Empty,
  Dropdown,
  Menu
} from 'antd';
import AIAssistant from './AIAssistant';
import needsService from '../services/needsService';
import {
  ArrowLeftOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  UserOutlined,
  BookOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  SettingOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  StarOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  BulbOutlined,
  MoreOutlined,
  CalendarOutlined,
  TagOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const SelfLearning = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('my-topics');
  const [myTopics, setMyTopics] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [trainingNeeds, setTrainingNeeds] = useState([]);
  const [relatedNeeds, setRelatedNeeds] = useState([]);
  const [form] = Form.useForm();
  const [courseForm] = Form.useForm();

  // 初始化示例数据
  useEffect(() => {
    // 加载培训需求数据
    const loadTrainingNeeds = () => {
      try {
        const needs = needsService.getAllNeeds();
        setTrainingNeeds(needs);
      } catch (error) {
        console.error('加载培训需求失败:', error);
      }
    };

    loadTrainingNeeds();

    const sampleTopics = [
      {
        id: 'topic-001',
        title: '提升编程技能',
        description: '学习现代编程语言和开发框架，提升软件开发能力',
        category: 'technology',
        tags: ['编程', '开发', '技能提升'],
        createdAt: new Date('2024-01-15'),
        status: 'active',
        courses: [
          {
            id: 'course-001',
            title: 'React 前端开发实战',
            instructor: '张老师',
            duration: '30学时',
            progress: 65,
            status: 'learning'
          },
          {
            id: 'course-002',
            title: 'Node.js 后端开发',
            instructor: '李老师',
            duration: '25学时',
            progress: 0,
            status: 'planned'
          }
        ]
      },
      {
        id: 'topic-002',
        title: '数据分析能力培养',
        description: '掌握数据分析工具和方法，提升数据处理和分析能力',
        category: 'data_analysis',
        tags: ['数据分析', 'Python', '统计学'],
        createdAt: new Date('2024-01-20'),
        status: 'active',
        courses: [
          {
            id: 'course-003',
            title: 'Python 数据分析基础',
            instructor: '王博士',
            duration: '40学时',
            progress: 30,
            status: 'learning'
          }
        ]
      }
    ];
    setMyTopics(sampleTopics);
  }, []);

  // 创建新主题
  const handleCreateTopic = async (values) => {
    const newTopic = {
      id: `topic-${Date.now()}`,
      title: values.title,
      description: values.description,
      category: values.category,
      tags: values.tags || [],
      createdAt: new Date(),
      status: 'active',
      courses: [],
      relatedNeedId: values.relatedNeedId // 关联的培训需求ID
    };
    
    setMyTopics(prev => [...prev, newTopic]);
    setShowCreateModal(false);
    form.resetFields();
    message.success('学习主题创建成功！');
  };

  // 基于培训需求创建学习主题
  const createTopicFromNeed = (need) => {
    const newTopic = {
      id: `topic-${Date.now()}`,
      title: `学习主题：${need.title}`,
      description: need.content || need.description || '基于培训需求创建的学习主题',
      category: need.category || 'general',
      tags: [...(need.tags || []), '来自培训需求'],
      createdAt: new Date(),
      status: 'active',
      courses: [],
      relatedNeedId: need.id
    };
    
    setMyTopics(prev => [...prev, newTopic]);
    message.success('已基于培训需求创建学习主题！');
  };

  // 获取相关培训需求
  const getRelatedNeeds = (topic) => {
    if (!topic || !trainingNeeds.length) return [];
    
    return trainingNeeds.filter(need => {
      // 基于标签匹配
      const tagMatch = need.tags?.some(tag => 
        topic.tags?.some(topicTag => 
          topicTag.toLowerCase().includes(tag.toLowerCase()) ||
          tag.toLowerCase().includes(topicTag.toLowerCase())
        )
      );
      
      // 基于分类匹配
      const categoryMatch = need.category === topic.category;
      
      // 基于标题关键词匹配
      const titleMatch = topic.title.toLowerCase().includes(need.title.toLowerCase()) ||
                        need.title.toLowerCase().includes(topic.title.toLowerCase());
      
      return tagMatch || categoryMatch || titleMatch;
    }).slice(0, 5); // 限制显示5个相关需求
  };

  // 为主题添加课程
  const handleAddCourse = async (values) => {
    const newCourse = {
      id: `course-${Date.now()}`,
      title: values.title,
      instructor: values.instructor,
      duration: values.duration,
      description: values.description,
      progress: 0,
      status: 'planned'
    };

    setMyTopics(prev => 
      prev.map(topic => 
        topic.id === selectedTopic.id 
          ? { ...topic, courses: [...topic.courses, newCourse] }
          : topic
      )
    );

    setShowCourseModal(false);
    courseForm.resetFields();
    message.success('课程添加成功！');
  };

  // 开始学习课程
  const startCourse = (topicId, courseId) => {
    setMyTopics(prev => 
      prev.map(topic => 
        topic.id === topicId 
          ? {
              ...topic,
              courses: topic.courses.map(course => 
                course.id === courseId 
                  ? { ...course, status: 'learning', startedAt: new Date() }
                  : course
              )
            }
          : topic
      )
    );
    message.success('开始学习课程');
  };

  // 删除主题
  const deleteTopic = (topicId) => {
    setMyTopics(prev => prev.filter(topic => topic.id !== topicId));
    message.success('主题删除成功');
  };

  // 渲染我的学习主题
  const renderMyTopics = () => (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4}>我的学习主题</Title>
          <Text type="secondary">创建和管理您的个人学习主题</Text>
        </div>
        <Space>
          <Button icon={<FilterOutlined />}>筛选</Button>
          <Button icon={<SearchOutlined />}>搜索</Button>
          <Button 
            type="primary" 
            icon={<RocketOutlined />}
            onClick={() => setShowAIAssistant(true)}
          >
            AI学习助手
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateModal(true)}>
            创建新主题
          </Button>
        </Space>
      </div>

      {myTopics.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                还没有学习主题<br />
                <Text type="secondary">创建您的第一个学习主题开始学习之旅</Text>
              </span>
            }
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateModal(true)}>
              创建学习主题
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {myTopics.map(topic => (
            <Col xs={24} sm={12} lg={8} key={topic.id}>
              <Card
                hoverable
                actions={[
                  <Button 
                    type="link" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setSelectedTopic(topic);
                      setShowCourseModal(true);
                    }}
                  >
                    添加课程
                  </Button>,
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key="edit" icon={<EditOutlined />}>
                          编辑主题
                        </Menu.Item>
                        <Menu.Item 
                          key="delete" 
                          icon={<DeleteOutlined />}
                          onClick={() => deleteTopic(topic.id)}
                          danger
                        >
                          删除主题
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <Button type="link" icon={<MoreOutlined />} />
                  </Dropdown>
                ]}
              >
                <div style={{ marginBottom: 12 }}>
                  <Title level={5} style={{ margin: 0, marginBottom: 8 }}>
                    {topic.title}
                  </Title>
                  <Paragraph ellipsis={{ rows: 2 }} type="secondary">
                    {topic.description}
                  </Paragraph>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <Space wrap>
                    {topic.tags.map(tag => (
                      <Tag key={tag} color="blue">{tag}</Tag>
                    ))}
                  </Space>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <Space>
                    <CalendarOutlined />
                    <Text type="secondary">
                      创建于 {topic.createdAt.toLocaleDateString()}
                    </Text>
                  </Space>
                </div>

                <div>
                  <Text type="secondary">课程数量：</Text>
                  <Text strong>{topic.courses.length}</Text>
                  <br />
                  <Text type="secondary">学习进度：</Text>
                  <Text strong>
                    {topic.courses.filter(c => c.status === 'completed').length} / {topic.courses.length}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );

  // 渲染课程管理
  const renderCourseManagement = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>课程管理</Title>
        <Text type="secondary">管理您所有学习主题下的课程</Text>
      </div>

      {myTopics.map(topic => (
        <Card 
          key={topic.id}
          title={
            <Space>
              <BulbOutlined style={{ color: '#1890ff' }} />
              <span>{topic.title}</span>
              <Tag color="blue">{topic.courses.length} 门课程</Tag>
            </Space>
          }
          style={{ marginBottom: 16 }}
          extra={
            <Button 
              type="primary" 
              size="small"
              onClick={() => {
                setSelectedTopic(topic);
                setShowCourseModal(true);
              }}
            >
              添加课程
            </Button>
          }
        >
          {topic.courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <Text type="secondary">还没有添加课程</Text>
            </div>
          ) : (
            <Timeline>
              {topic.courses.map(course => (
                <Timeline.Item
                  key={course.id}
                  dot={
                    course.status === 'completed' ? (
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    ) : course.status === 'learning' ? (
                      <PlayCircleOutlined style={{ color: '#1890ff' }} />
                    ) : (
                      <ClockCircleOutlined style={{ color: '#d9d9d9' }} />
                    )
                  }
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                        {course.title}
                      </Title>
                      <Space wrap style={{ marginBottom: 8 }}>
                        <Tag color="blue">{course.instructor}</Tag>
                        <Tag>{course.duration}</Tag>
                        <Tag color={course.status === 'completed' ? 'green' : course.status === 'learning' ? 'blue' : 'default'}>
                          {course.status === 'completed' ? '已完成' : course.status === 'learning' ? '学习中' : '计划中'}
                        </Tag>
                      </Space>
                      
                      {course.status === 'learning' && (
                        <div>
                          <Text type="secondary">学习进度：</Text>
                          <Progress percent={course.progress} size="small" style={{ marginTop: 4 }} />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      {course.status === 'planned' && (
                        <Button 
                          type="primary" 
                          size="small" 
                          onClick={() => startCourse(topic.id, course.id)}
                        >
                          开始学习
                        </Button>
                      )}
                      {course.status === 'learning' && (
                        <Button size="small">继续学习</Button>
                      )}
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          )}
        </Card>
      ))}
    </div>
  );

  // 渲染培训需求
  const renderTrainingNeeds = () => (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4}>培训需求</Title>
          <Text type="secondary">查看培训需求并创建相关学习主题</Text>
        </div>
        <Space>
          <Button icon={<SearchOutlined />}>搜索需求</Button>
          <Button icon={<FilterOutlined />}>筛选</Button>
        </Space>
      </div>

      {trainingNeeds.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无培训需求数据"
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {trainingNeeds.slice(0, 12).map(need => (
            <Col xs={24} sm={12} lg={8} key={need.id}>
              <Card
                hoverable
                size="small"
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong ellipsis style={{ flex: 1 }}>{need.title}</Text>
                    {need.priority && <Badge status="error" />}
                  </div>
                }
                extra={
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item 
                          key="create-topic" 
                          icon={<PlusOutlined />}
                          onClick={() => createTopicFromNeed(need)}
                        >
                          创建学习主题
                        </Menu.Item>
                        <Menu.Item key="view" icon={<EyeOutlined />}>
                          查看详情
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <Button type="text" icon={<MoreOutlined />} size="small" />
                  </Dropdown>
                }
              >
                <div style={{ marginBottom: 12 }}>
                  <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ fontSize: 12 }}>
                    {need.content || need.description || '暂无描述'}
                  </Paragraph>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <Space size={4} wrap>
                    <Tag color="blue" size="small">{need.category || '未分类'}</Tag>
                    {need.tags?.slice(0, 2).map(tag => (
                      <Tag key={tag} size="small">{tag}</Tag>
                    ))}
                    {need.tags?.length > 2 && (
                      <Tag size="small">+{need.tags.length - 2}</Tag>
                    )}
                  </Space>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                  <Text type="secondary">
                    {new Date(need.createdAt).toLocaleDateString()}
                  </Text>
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={() => createTopicFromNeed(need)}
                  >
                    创建主题
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {trainingNeeds.length > 12 && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button>查看更多培训需求</Button>
        </div>
      )}
    </div>
  );

  // 渲染学习统计
  const renderLearningStats = () => {
    const totalTopics = myTopics.length;
    const totalCourses = myTopics.reduce((sum, topic) => sum + topic.courses.length, 0);
    const completedCourses = myTopics.reduce((sum, topic) => 
      sum + topic.courses.filter(c => c.status === 'completed').length, 0
    );
    const learningCourses = myTopics.reduce((sum, topic) => 
      sum + topic.courses.filter(c => c.status === 'learning').length, 0
    );

    return (
      <div>
        <Title level={4} style={{ marginBottom: 24 }}>学习统计</Title>
        
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="学习主题"
                value={totalTopics}
                prefix={<BulbOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总课程数"
                value={totalCourses}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已完成"
                value={completedCourses}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="学习中"
                value={learningCourses}
                prefix={<PlayCircleOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        <Card title="主题分布">
          <List
            dataSource={myTopics}
            renderItem={topic => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<BulbOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                  title={topic.title}
                  description={
                    <Space>
                      <Text type="secondary">
                        {topic.courses.length} 门课程
                      </Text>
                      <Text type="secondary">•</Text>
                      <Text type="secondary">
                        完成率 {topic.courses.length > 0 ? 
                          Math.round((topic.courses.filter(c => c.status === 'completed').length / topic.courses.length) * 100) 
                          : 0}%
                      </Text>
                    </Space>
                  }
                />
                <div>
                  <Progress 
                    percent={topic.courses.length > 0 ? 
                      Math.round((topic.courses.filter(c => c.status === 'completed').length / topic.courses.length) * 100) 
                      : 0
                    } 
                    size="small" 
                    style={{ width: 100 }}
                  />
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  };

  return (
    <Layout style={{ height: '100%', background: '#f5f7fa' }}>
      <Content style={{ padding: '24px', height: '100%', overflow: 'auto' }}>
        {/* 页面头部 */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              style={{ padding: 0, marginRight: 16 }}
            >
              返回
            </Button>
            <Title level={2} style={{ margin: 0, display: 'inline' }}>
              自主学习配课
            </Title>
          </div>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="我的主题" key="my-topics" icon={<BulbOutlined />}>
            {renderMyTopics()}
          </TabPane>
          <TabPane tab="培训需求" key="training-needs" icon={<FileTextOutlined />}>
            {renderTrainingNeeds()}
          </TabPane>
          <TabPane tab="课程管理" key="course-management" icon={<BookOutlined />}>
            {renderCourseManagement()}
          </TabPane>
          <TabPane tab="学习统计" key="stats" icon={<TrophyOutlined />}>
            {renderLearningStats()}
          </TabPane>
        </Tabs>

        {/* 创建主题模态框 */}
        <Modal
          title="创建学习主题"
          open={showCreateModal}
          onCancel={() => setShowCreateModal(false)}
          onOk={() => form.submit()}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateTopic}
          >
            <Form.Item
              name="title"
              label="主题标题"
              rules={[{ required: true, message: '请输入主题标题' }]}
            >
              <Input placeholder="请输入学习主题标题" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="主题描述"
              rules={[{ required: true, message: '请输入主题描述' }]}
            >
              <TextArea rows={4} placeholder="请描述您的学习目标和计划" />
            </Form.Item>
            
            <Form.Item
              name="category"
              label="主题分类"
              rules={[{ required: true, message: '请选择主题分类' }]}
            >
              <Select placeholder="请选择主题分类">
                <Option value="technology">技术开发</Option>
                <Option value="data_analysis">数据分析</Option>
                <Option value="design">设计创意</Option>
                <Option value="management">管理技能</Option>
                <Option value="language">语言学习</Option>
                <Option value="other">其他</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="tags"
              label="标签"
            >
              <Select
                mode="tags"
                placeholder="添加相关标签"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="relatedNeedId"
              label="关联培训需求"
            >
              <Select
                placeholder="选择相关的培训需求（可选）"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {trainingNeeds.map(need => (
                  <Option key={need.id} value={need.id}>
                    {need.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* 添加课程模态框 */}
        <Modal
          title={`为"${selectedTopic?.title}"添加课程`}
          open={showCourseModal}
          onCancel={() => setShowCourseModal(false)}
          onOk={() => courseForm.submit()}
          width={600}
        >
          <Form
            form={courseForm}
            layout="vertical"
            onFinish={handleAddCourse}
          >
            <Form.Item
              name="title"
              label="课程标题"
              rules={[{ required: true, message: '请输入课程标题' }]}
            >
              <Input placeholder="请输入课程标题" />
            </Form.Item>
            
            <Form.Item
              name="instructor"
              label="讲师"
              rules={[{ required: true, message: '请输入讲师姓名' }]}
            >
              <Input placeholder="请输入讲师姓名" />
            </Form.Item>
            
            <Form.Item
              name="duration"
              label="课程时长"
              rules={[{ required: true, message: '请输入课程时长' }]}
            >
              <Input placeholder="例如：30学时" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="课程描述"
            >
              <TextArea rows={3} placeholder="请描述课程内容和学习目标" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
      
      {/* AI学习助手 */}
      <AIAssistant
        visible={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        mode="learning"
        userProfile={{
          name: '自主学习者',
          interests: myTopics.map(topic => topic.category),
          level: '中级'
        }}
        learningHistory={myTopics.flatMap(topic => topic.courses || [])}
        currentTopics={myTopics}
        onRecommendCourse={(course) => {
          message.success(`已推荐课程：${course.title}`);
        }}
        onCreateLearningPath={(path) => {
          message.success('已创建学习路径');
        }}
      />
    </Layout>
  );
};

export default SelfLearning;