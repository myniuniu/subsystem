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
  Menu,
  Drawer,
  Switch,
  Slider,
  Radio,
  Checkbox,
  Alert,
  Spin,
  Result
} from 'antd';
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
  TagOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  SyncOutlined,
  SaveOutlined,
  SendOutlined,
  HistoryOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import needsService from '../services/needsService';
import AIAssistant from './AIAssistant';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

const CourseWorkspace = ({ trainingNeed, onBack, onSave, hideHeader = false }) => {
  // 基础状态
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ai-recommend');
  const [workspaceMode, setWorkspaceMode] = useState('collaborative'); // collaborative, ai-only, manual-only
  
  // AI推荐相关状态
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  
  // 人工配课相关状态
  const [manualCourses, setManualCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseLibrary, setCourseLibrary] = useState([]);
  
  // 协同工作状态
  const [comparisonMode, setComparisonMode] = useState(false);
  const [finalPlan, setFinalPlan] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  
  // 表单和模态框状态
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form] = Form.useForm();

  // 初始化数据
  useEffect(() => {
    initializeWorkspace();
  }, [trainingNeed]);

  // 初始化工作台
  const initializeWorkspace = async () => {
    setLoading(true);
    try {
      // 加载课程库
      await loadCourseLibrary();
      
      // 生成AI推荐
      await generateAIRecommendations();
      
      // 初始化历史记录
      loadPlanHistory();
    } catch (error) {
      console.error('初始化工作台失败:', error);
      message.error('初始化工作台失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载课程库
  const loadCourseLibrary = async () => {
    // 模拟课程库数据
    const mockCourses = [
      {
        id: 'course-001',
        title: '现代教学方法与实践',
        category: 'teaching_methods',
        duration: 16,
        level: 'intermediate',
        instructor: '张教授',
        rating: 4.8,
        students: 1250,
        tags: ['教学方法', '课堂管理', '互动教学'],
        description: '深入学习现代教学理念和方法，提升课堂教学效果',
        objectives: ['掌握多种教学方法', '提升课堂互动能力', '改善教学效果'],
        price: 299,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-002',
        title: '数字化课程设计与开发',
        category: 'curriculum_design',
        duration: 24,
        level: 'advanced',
        instructor: '李老师',
        rating: 4.9,
        students: 890,
        tags: ['课程设计', '数字化教学', '在线教育'],
        description: '学习数字化时代的课程设计理念和技术实现',
        objectives: ['掌握数字化课程设计', '学会使用开发工具', '提升技术能力'],
        price: 499,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-003',
        title: '学生心理健康与辅导',
        category: 'mental_health',
        duration: 20,
        level: 'intermediate',
        instructor: '王心理师',
        rating: 4.7,
        students: 1100,
        tags: ['心理健康', '学生辅导', '危机干预'],
        description: '了解学生心理特点，掌握心理辅导技巧',
        objectives: ['识别心理问题', '掌握辅导技巧', '建立支持体系'],
        price: 399,
        thumbnail: '/api/placeholder/300/200'
      }
    ];
    
    setCourseLibrary(mockCourses);
  };

  // 生成AI推荐
  const generateAIRecommendations = async () => {
    setAiLoading(true);
    try {
      // 模拟AI分析过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = {
        needsAnalysis: {
          primarySkills: trainingNeed?.tags || ['教学方法', '课程设计'],
          urgencyLevel: 'high',
          targetAudience: '新入职教师',
          estimatedDuration: '40学时',
          recommendedApproach: '理论与实践结合'
        },
        recommendations: [
          {
            id: 'ai-rec-001',
            courseId: 'course-001',
            title: '现代教学方法与实践',
            matchScore: 95,
            reasons: ['完全匹配培训需求', '适合新教师', '实践性强'],
            priority: 'high',
            estimatedImpact: '显著提升教学能力'
          },
          {
            id: 'ai-rec-002',
            courseId: 'course-002',
            title: '数字化课程设计与开发',
            matchScore: 88,
            reasons: ['符合现代教育趋势', '技能互补性强', '长期发展价值'],
            priority: 'medium',
            estimatedImpact: '提升技术应用能力'
          }
        ],
        learningPath: {
          phase1: {
            title: '基础理论学习',
            duration: '2周',
            courses: ['course-001']
          },
          phase2: {
            title: '技能实践应用',
            duration: '3周',
            courses: ['course-002']
          },
          phase3: {
            title: '综合能力提升',
            duration: '2周',
            courses: ['course-003']
          }
        }
      };
      
      setAiAnalysis(analysis);
      setAiRecommendations(analysis.recommendations);
    } catch (error) {
      console.error('AI推荐生成失败:', error);
      message.error('AI推荐生成失败');
    } finally {
      setAiLoading(false);
    }
  };

  // 加载计划历史
  const loadPlanHistory = () => {
    const history = [
      {
        id: 'plan-001',
        name: '初始AI推荐方案',
        type: 'ai',
        createdAt: new Date(),
        courses: ['course-001', 'course-002'],
        status: 'draft'
      }
    ];
    setPlanHistory(history);
  };

  // 添加课程到人工配课
  const addToManualPlan = (course) => {
    if (!manualCourses.find(c => c.id === course.id)) {
      setManualCourses([...manualCourses, course]);
      message.success(`已添加课程：${course.title}`);
    } else {
      message.warning('课程已存在于配课方案中');
    }
  };

  // 从人工配课中移除课程
  const removeFromManualPlan = (courseId) => {
    setManualCourses(manualCourses.filter(c => c.id !== courseId));
    message.success('已移除课程');
  };

  // 保存配课方案
  const savePlan = async (planData) => {
    try {
      const newPlan = {
        id: `plan-${Date.now()}`,
        trainingNeedId: trainingNeed.id,
        name: planData.name,
        description: planData.description,
        courses: planData.courses,
        type: planData.type,
        createdAt: new Date(),
        status: 'saved'
      };
      
      setPlanHistory([newPlan, ...planHistory]);
      setFinalPlan(newPlan);
      
      if (onSave) {
        onSave(newPlan);
      }
      
      message.success('配课方案已保存');
      setShowPlanModal(false);
    } catch (error) {
      console.error('保存方案失败:', error);
      message.error('保存方案失败');
    }
  };

  // 渲染培训需求详情栏
  const renderNeedDetails = () => (
    <Card 
      title={
        <Space>
          <FileTextOutlined />
          <span>培训需求详情</span>
        </Space>
      }
      size="small"
      style={{ height: '100%' }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>需求标题：</Text>
          <Paragraph>{trainingNeed?.title}</Paragraph>
        </div>
        
        <div>
          <Text strong>需求描述：</Text>
          <Paragraph>{trainingNeed?.description}</Paragraph>
        </div>
        
        <div>
          <Text strong>目标人群：</Text>
          <Tag color="blue">{trainingNeed?.targetAudience || '新入职教师'}</Tag>
        </div>
        
        <div>
          <Text strong>技能标签：</Text>
          <Space wrap>
            {(trainingNeed?.tags || []).map(tag => (
              <Tag key={tag} color="green">{tag}</Tag>
            ))}
          </Space>
        </div>
        
        <div>
          <Text strong>优先级：</Text>
          <Tag color={trainingNeed?.priority === 'high' ? 'red' : 'orange'}>
            {trainingNeed?.priority === 'high' ? '高' : '中'}
          </Tag>
        </div>
        
        <div>
          <Text strong>预期时长：</Text>
          <Text>{trainingNeed?.expectedDuration || '40学时'}</Text>
        </div>
      </Space>
    </Card>
  );

  // 渲染AI推荐栏
  const renderAIRecommendations = () => (
    <Card 
      title={
        <Space>
          <RobotOutlined />
          <span>AI智能推荐</span>
          {aiLoading && <Spin size="small" />}
        </Space>
      }
      size="small"
      style={{ height: '100%' }}
      extra={
        <Button 
          size="small" 
          icon={<ReloadOutlined />}
          onClick={generateAIRecommendations}
          loading={aiLoading}
        >
          重新分析
        </Button>
      }
    >
      {aiLoading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>AI正在分析培训需求...</Text>
          </div>
        </div>
      ) : (
        <Tabs size="small" defaultActiveKey="recommendations">
          <TabPane tab="推荐课程" key="recommendations">
            <List
              size="small"
              dataSource={aiRecommendations}
              grid={{ gutter: 16, column: 1 }}
              renderItem={item => {
                const course = courseLibrary.find(c => c.id === item.courseId);
                return (
                  <List.Item style={{ marginBottom: 0 }}>
                    <Card
                      size="small"
                      style={{ width: '100%' }}
                      actions={[
                        <Button 
                          size="small" 
                          type="primary"
                          onClick={() => addToManualPlan(course)}
                        >
                          采纳
                        </Button>
                      ]}
                    >
                      <Card.Meta
                        title={
                          <Space>
                            <span>{item.title}</span>
                            <Tag color="blue">{item.matchScore}%匹配</Tag>
                          </Space>
                        }
                        description={
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text type="secondary">{item.estimatedImpact}</Text>
                            <Space wrap>
                              {item.reasons.map(reason => (
                                <Tag key={reason} size="small">{reason}</Tag>
                              ))}
                            </Space>
                          </Space>
                        }
                      />
                    </Card>
                  </List.Item>
                );
              }}
            />
          </TabPane>
          
          <TabPane tab="学习路径" key="path">
            {aiAnalysis?.learningPath && (
              <Steps direction="vertical" size="small">
                {Object.entries(aiAnalysis.learningPath).map(([key, phase]) => (
                  <Step
                    key={key}
                    title={phase.title}
                    description={
                      <Space direction="vertical">
                        <Text>预计时长：{phase.duration}</Text>
                        <Text>包含课程：{phase.courses.length}门</Text>
                      </Space>
                    }
                    status="wait"
                  />
                ))}
              </Steps>
            )}
          </TabPane>
          
          <TabPane tab="需求分析" key="analysis">
            {aiAnalysis?.needsAnalysis && (
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>核心技能：</Text>
                  <div>
                    {aiAnalysis.needsAnalysis.primarySkills.map(skill => (
                      <Tag key={skill} color="purple">{skill}</Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <Text strong>紧急程度：</Text>
                  <Tag color="red">{aiAnalysis.needsAnalysis.urgencyLevel}</Tag>
                </div>
                <div>
                  <Text strong>目标群体：</Text>
                  <Text>{aiAnalysis.needsAnalysis.targetAudience}</Text>
                </div>
                <div>
                  <Text strong>建议时长：</Text>
                  <Text>{aiAnalysis.needsAnalysis.estimatedDuration}</Text>
                </div>
              </Space>
            )}
          </TabPane>
        </Tabs>
      )}
    </Card>
  );

  // 渲染人工配课栏
  const renderManualCourseSelection = () => (
    <Card 
      title={
        <Space>
          <UserOutlined />
          <span>人工配课</span>
        </Space>
      }
      size="small"
      style={{ height: '100%' }}
      extra={
        <Button 
          size="small" 
          icon={<SearchOutlined />}
          onClick={() => setShowCourseModal(true)}
        >
          浏览课程库
        </Button>
      }
    >
      <Tabs size="small" defaultActiveKey="selected">
        <TabPane tab={`已选课程 (${manualCourses.length})`} key="selected">
          {manualCourses.length === 0 ? (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无选择的课程"
            />
          ) : (
            <List
              size="small"
              dataSource={manualCourses}
              renderItem={course => (
                <List.Item
                  actions={[
                    <Button 
                      size="small" 
                      danger
                      onClick={() => removeFromManualPlan(course.id)}
                    >
                      移除
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={course.title}
                    description={
                      <Space>
                        <Tag>{course.duration}学时</Tag>
                        <Tag color="blue">{course.level}</Tag>
                        <Rate disabled defaultValue={course.rating} size="small" />
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </TabPane>
        
        <TabPane tab="推荐课程" key="recommended">
          <List
            size="small"
            dataSource={courseLibrary.slice(0, 5)}
            grid={{ gutter: 16, column: 1 }}
            renderItem={course => (
              <List.Item style={{ marginBottom: 0 }}>
                <Card
                  size="small"
                  style={{ width: '100%' }}
                  actions={[
                    <Button 
                      size="small" 
                      type="primary"
                      onClick={() => addToManualPlan(course)}
                    >
                      添加
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={course.title}
                    description={
                      <Space wrap style={{ width: '100%' }}>
                        <Tag>{course.duration}学时</Tag>
                        <Rate disabled defaultValue={course.rating} size="small" />
                      </Space>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Card>
  );

  // 渲染协同对比栏
  const renderCollaborativeComparison = () => (
    <Card 
      title={
        <Space>
          <SyncOutlined />
          <span>方案对比</span>
        </Space>
      }
      size="small"
      style={{ height: '100%' }}
      extra={
        <Switch
          checked={comparisonMode}
          onChange={setComparisonMode}
          checkedChildren="对比模式"
          unCheckedChildren="单独模式"
        />
      }
    >
      {comparisonMode ? (
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" title="AI推荐方案" type="inner">
              <Statistic 
                title="推荐课程数" 
                value={aiRecommendations.length} 
                suffix="门"
              />
              <Statistic 
                title="平均匹配度" 
                value={aiRecommendations.reduce((acc, rec) => acc + rec.matchScore, 0) / aiRecommendations.length || 0} 
                suffix="%" 
                precision={1}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="人工配课方案" type="inner">
              <Statistic 
                title="选择课程数" 
                value={manualCourses.length} 
                suffix="门"
              />
              <Statistic 
                title="总学时" 
                value={manualCourses.reduce((acc, course) => acc + course.duration, 0)} 
                suffix="学时"
              />
            </Card>
          </Col>
        </Row>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="协同配课建议"
            description="结合AI推荐和人工经验，制定最优的培训方案"
            type="info"
            showIcon
          />
          
          <Button 
            type="primary" 
            block
            icon={<SaveOutlined />}
            onClick={() => setShowPlanModal(true)}
            disabled={manualCourses.length === 0 && aiRecommendations.length === 0}
          >
            保存最终方案
          </Button>
        </Space>
      )}
    </Card>
  );

  return (
    <Layout style={{ height: hideHeader ? 'auto' : '100vh', background: '#f0f2f5' }}>
      {/* 头部工具栏 - 根据hideHeader属性决定是否显示 */}
      {!hideHeader && (
        <div style={{ 
          background: '#fff', 
          padding: '16px 24px', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
              返回
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              配课工作台 - {trainingNeed?.title}
            </Title>
          </Space>
          
          <Space>
            <Radio.Group 
              value={workspaceMode} 
              onChange={e => setWorkspaceMode(e.target.value)}
              size="small"
            >
              <Radio.Button value="collaborative">协同模式</Radio.Button>
              <Radio.Button value="ai-only">AI模式</Radio.Button>
              <Radio.Button value="manual-only">人工模式</Radio.Button>
            </Radio.Group>
            
            <Button icon={<HistoryOutlined />}>
              历史方案
            </Button>
            
            <Button type="primary" icon={<SaveOutlined />}>
              保存草稿
            </Button>
          </Space>
        </div>
      )}

      {/* 主要内容区域 */}
      <Content style={{ padding: '16px' }}>
        <Row gutter={16} style={{ height: '100%' }}>
          {/* 左侧：培训需求详情 */}
          <Col span={6}>
            {renderNeedDetails()}
          </Col>
          
          {/* 中间：AI推荐和人工配课 */}
          <Col span={12}>
            <Row gutter={[16, 16]} style={{ height: '100%' }}>
              {(workspaceMode === 'collaborative' || workspaceMode === 'ai-only') && (
                <Col span={24} style={{ height: '50%' }}>
                  {renderAIRecommendations()}
                </Col>
              )}
              
              {(workspaceMode === 'collaborative' || workspaceMode === 'manual-only') && (
                <Col span={24} style={{ height: workspaceMode === 'collaborative' ? '50%' : '100%' }}>
                  {renderManualCourseSelection()}
                </Col>
              )}
            </Row>
          </Col>
          
          {/* 右侧：协同对比和操作 */}
          <Col span={6}>
            {renderCollaborativeComparison()}
          </Col>
        </Row>
      </Content>

      {/* 课程库浏览模态框 */}
      <Modal
        title="课程库"
        open={showCourseModal}
        onCancel={() => setShowCourseModal(false)}
        width={800}
        footer={null}
      >
        <List
          dataSource={courseLibrary}
          renderItem={course => (
            <List.Item
              actions={[
                <Button 
                  type="primary"
                  onClick={() => {
                    addToManualPlan(course);
                    setShowCourseModal(false);
                  }}
                >
                  选择课程
                </Button>
              ]}
            >
              <List.Item.Meta
                title={course.title}
                description={
                  <Space direction="vertical">
                    <Text>{course.description}</Text>
                    <Space>
                      <Tag>{course.duration}学时</Tag>
                      <Tag color="blue">{course.level}</Tag>
                      <Tag color="green">¥{course.price}</Tag>
                      <Rate disabled defaultValue={course.rating} size="small" />
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* 保存方案模态框 */}
      <Modal
        title="保存配课方案"
        open={showPlanModal}
        onCancel={() => setShowPlanModal(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            const planData = {
              ...values,
              courses: [...manualCourses, ...aiRecommendations.map(rec => 
                courseLibrary.find(c => c.id === rec.courseId)
              ).filter(Boolean)],
              type: 'collaborative'
            };
            savePlan(planData);
          }}
        >
          <Form.Item
            name="name"
            label="方案名称"
            rules={[{ required: true, message: '请输入方案名称' }]}
          >
            <Input placeholder="请输入配课方案名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="方案描述"
          >
            <TextArea rows={4} placeholder="请描述配课方案的特点和目标" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CourseWorkspace;