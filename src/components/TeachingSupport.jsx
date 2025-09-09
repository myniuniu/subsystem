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
  Divider
} from 'antd';
import {
  BulbOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  MessageOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  FileTextOutlined,
  AimOutlined,
  RocketOutlined,
  HeartOutlined,
  StarOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const TeachingSupport = () => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [recommendationData, setRecommendationData] = useState({});
  const [interventionData, setInterventionData] = useState({});
  const [communicationData, setCommunicationData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form] = Form.useForm();

  // 模拟数据
  useEffect(() => {
    const mockRecommendations = {
      personalizedPaths: [
        {
          id: 1,
          student: '张三',
          subject: '算法设计',
          currentLevel: '初级',
          targetLevel: '中级',
          recommendedResources: [
            { type: '视频课程', title: '算法基础入门', duration: '2小时', difficulty: '简单' },
            { type: '练习题', title: '基础算法练习100题', duration: '1周', difficulty: '简单' },
            { type: '项目实践', title: '排序算法实现', duration: '3天', difficulty: '中等' }
          ],
          estimatedTime: '2周',
          priority: 'high'
        },
        {
          id: 2,
          student: '李四',
          subject: '数据库设计',
          currentLevel: '中级',
          targetLevel: '高级',
          recommendedResources: [
            { type: '理论学习', title: '高级数据库设计原理', duration: '3小时', difficulty: '困难' },
            { type: '案例分析', title: '大型系统数据库架构', duration: '1周', difficulty: '困难' },
            { type: '实战项目', title: '电商系统数据库设计', duration: '2周', difficulty: '困难' }
          ],
          estimatedTime: '3周',
          priority: 'medium'
        }
      ],
      teachingStrategies: [
        {
          id: 1,
          targetGroup: '算法基础薄弱学生',
          studentCount: 15,
          strategy: '分层教学',
          description: '针对算法基础薄弱的学生，建议采用分层教学方法，从基础概念开始，逐步提升难度',
          methods: ['可视化演示', '步骤分解', '反复练习', '同伴互助'],
          expectedOutcome: '提升基础算法理解能力',
          timeframe: '4周'
        },
        {
          id: 2,
          targetGroup: '数据库设计进阶学生',
          studentCount: 8,
          strategy: '项目驱动',
          description: '对于已掌握基础的学生，通过实际项目驱动学习，提升实践能力',
          methods: ['项目实战', '代码评审', '技术分享', '导师指导'],
          expectedOutcome: '具备独立设计数据库的能力',
          timeframe: '6周'
        }
      ],
      resourceRecommendations: [
        {
          id: 1,
          title: '数据结构与算法可视化工具',
          type: '教学工具',
          description: '帮助学生直观理解算法执行过程',
          applicableSubjects: ['数据结构', '算法设计'],
          rating: 4.8,
          usageCount: 156
        },
        {
          id: 2,
          title: '数据库设计最佳实践案例集',
          type: '教学资料',
          description: '包含多个行业的数据库设计案例',
          applicableSubjects: ['数据库原理', '系统设计'],
          rating: 4.6,
          usageCount: 89
        }
      ]
    };

    const mockInterventions = {
      riskStudents: [
        {
          id: 1,
          name: '王五',
          class: '计算机1班',
          riskLevel: 'high',
          riskFactors: ['连续缺课', '作业未交', '成绩下降'],
          lastContact: '2024-01-10',
          interventionStatus: 'pending',
          suggestedActions: [
            '电话联系了解情况',
            '安排一对一辅导',
            '制定个性化学习计划',
            '联系家长协助'
          ]
        },
        {
          id: 2,
          name: '赵六',
          class: '计算机2班',
          riskLevel: 'medium',
          riskFactors: ['学习进度落后', '参与度低'],
          lastContact: '2024-01-12',
          interventionStatus: 'in_progress',
          suggestedActions: [
            '调整学习节奏',
            '增加互动环节',
            '提供额外练习'
          ]
        }
      ],
      interventionPlans: [
        {
          id: 1,
          student: '王五',
          plan: '个性化辅导计划',
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          status: 'active',
          progress: 30,
          actions: [
            { action: '制定学习计划', status: 'completed', date: '2024-01-15' },
            { action: '第一次辅导', status: 'completed', date: '2024-01-17' },
            { action: '作业检查', status: 'in_progress', date: '2024-01-20' },
            { action: '阶段性评估', status: 'pending', date: '2024-01-25' }
          ]
        }
      ]
    };

    const mockCommunication = {
      messages: [
        {
          id: 1,
          type: 'student',
          recipient: '张三',
          subject: '算法学习进度跟进',
          content: '请按时完成本周的算法练习，有问题及时联系',
          status: 'sent',
          sentDate: '2024-01-15 10:30:00',
          readDate: '2024-01-15 14:20:00'
        },
        {
          id: 2,
          type: 'parent',
          recipient: '王五家长',
          subject: '学习情况反馈',
          content: '您的孩子最近学习状态有所下降，建议家长配合督促',
          status: 'sent',
          sentDate: '2024-01-14 16:00:00',
          readDate: null
        }
      ],
      templates: [
        {
          id: 1,
          name: '学习进度提醒',
          type: 'student',
          content: '亲爱的同学，请注意按时完成{课程名称}的学习任务，当前进度：{进度}%'
        },
        {
          id: 2,
          name: '家长沟通模板',
          type: 'parent',
          content: '尊敬的家长，您的孩子{学生姓名}在{课程名称}方面需要加强，建议{具体建议}'
        }
      ]
    };

    setRecommendationData(mockRecommendations);
    setInterventionData(mockInterventions);
    setCommunicationData(mockCommunication);
  }, []);

  // 处理发送消息
  const handleSendMessage = (values) => {
    console.log('发送消息:', values);
    message.success('消息发送成功');
    setModalVisible(false);
    form.resetFields();
  };

  // 处理创建干预计划
  const handleCreateIntervention = (values) => {
    console.log('创建干预计划:', values);
    message.success('干预计划创建成功');
    setModalVisible(false);
    form.resetFields();
  };

  // 渲染个性化学习路径推荐
  const renderPersonalizedPaths = () => {
    const paths = recommendationData.personalizedPaths || [];
    
    return (
      <List
        dataSource={paths}
        renderItem={(path) => (
          <List.Item
            actions={[
              <Button type="primary" size="small">
                应用推荐
              </Button>,
              <Button size="small">
                查看详情
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Badge count={getPriorityText(path.priority)} style={{ backgroundColor: getPriorityColor(path.priority) }}>
                  <Avatar icon={<UserOutlined />} />
                </Badge>
              }
              title={
                <Space>
                  <Text strong>{path.student}</Text>
                  <Tag color="blue">{path.subject}</Tag>
                  <Text type="secondary">{path.currentLevel} → {path.targetLevel}</Text>
                </Space>
              }
              description={
                <div>
                  <Paragraph ellipsis={{ rows: 2 }}>
                    推荐资源：{path.recommendedResources.map(r => r.title).join('、')}
                  </Paragraph>
                  <Space>
                    <Text type="secondary">预计时间：{path.estimatedTime}</Text>
                    <Text type="secondary">资源数量：{path.recommendedResources.length}个</Text>
                  </Space>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  // 渲染教学策略建议
  const renderTeachingStrategies = () => {
    const strategies = recommendationData.teachingStrategies || [];
    
    return (
      <Row gutter={[16, 16]}>
        {strategies.map((strategy) => (
          <Col xs={24} lg={12} key={strategy.id}>
            <Card 
              title={strategy.strategy}
              extra={<Tag color="blue">{strategy.studentCount}人</Tag>}
              className="strategy-card"
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>目标群体：</Text>
                  <Text>{strategy.targetGroup}</Text>
                </div>
                <div>
                  <Text strong>策略描述：</Text>
                  <Paragraph>{strategy.description}</Paragraph>
                </div>
                <div>
                  <Text strong>教学方法：</Text>
                  <div style={{ marginTop: 8 }}>
                    {strategy.methods.map(method => (
                      <Tag key={method} color="green">{method}</Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <Text strong>预期效果：</Text>
                  <Text>{strategy.expectedOutcome}</Text>
                </div>
                <div>
                  <Text strong>实施周期：</Text>
                  <Text>{strategy.timeframe}</Text>
                </div>
                <Button type="primary" block>
                  采用此策略
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  // 渲染资源推荐
  const renderResourceRecommendations = () => {
    const resources = recommendationData.resourceRecommendations || [];
    
    return (
      <List
        dataSource={resources}
        renderItem={(resource) => (
          <List.Item
            actions={[
              <Button type="primary" size="small">
                使用资源
              </Button>,
              <Button size="small">
                收藏
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<BookOutlined />} style={{ backgroundColor: '#52c41a' }} />}
              title={
                <Space>
                  <Text strong>{resource.title}</Text>
                  <Tag color="orange">{resource.type}</Tag>
                  <Rate disabled defaultValue={resource.rating} allowHalf style={{ fontSize: '12px' }} />
                </Space>
              }
              description={
                <div>
                  <Paragraph>{resource.description}</Paragraph>
                  <Space>
                    <Text type="secondary">适用科目：{resource.applicableSubjects.join('、')}</Text>
                    <Text type="secondary">使用次数：{resource.usageCount}</Text>
                  </Space>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  // 渲染风险学生列表
  const renderRiskStudents = () => {
    const students = interventionData.riskStudents || [];
    
    return (
      <List
        dataSource={students}
        renderItem={(student) => (
          <List.Item
            actions={[
              <Button 
                type="primary" 
                size="small"
                onClick={() => {
                  setSelectedStudent(student);
                  setModalType('intervention');
                  setModalVisible(true);
                }}
              >
                创建干预计划
              </Button>,
              <Button 
                size="small"
                onClick={() => {
                  setSelectedStudent(student);
                  setModalType('communication');
                  setModalVisible(true);
                }}
              >
                联系学生
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Badge count={getRiskLevelText(student.riskLevel)} style={{ backgroundColor: getRiskLevelColor(student.riskLevel) }}>
                  <Avatar icon={<UserOutlined />} />
                </Badge>
              }
              title={
                <Space>
                  <Text strong>{student.name}</Text>
                  <Tag>{student.class}</Tag>
                  <Tag color={getStatusColor(student.interventionStatus)}>
                    {getStatusText(student.interventionStatus)}
                  </Tag>
                </Space>
              }
              description={
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>风险因素：</Text>
                    {student.riskFactors.map(factor => (
                      <Tag key={factor} color="red">{factor}</Tag>
                    ))}
                  </div>
                  <div>
                    <Text strong>建议措施：</Text>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                      {student.suggestedActions.map((action, index) => (
                        <li key={index}><Text type="secondary">{action}</Text></li>
                      ))}
                    </ul>
                  </div>
                  <Text type="secondary">最后联系：{student.lastContact}</Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  // 渲染干预计划
  const renderInterventionPlans = () => {
    const plans = interventionData.interventionPlans || [];
    
    return (
      <List
        dataSource={plans}
        renderItem={(plan) => (
          <List.Item>
            <Card 
              title={`${plan.student} - ${plan.plan}`}
              extra={
                <Space>
                  <Tag color={plan.status === 'active' ? 'success' : 'default'}>
                    {plan.status === 'active' ? '进行中' : '已完成'}
                  </Tag>
                  <Text type="secondary">{plan.startDate} ~ {plan.endDate}</Text>
                </Space>
              }
              style={{ width: '100%' }}
            >
              <div style={{ marginBottom: 16 }}>
                <Text strong>执行进度：</Text>
                <Progress percent={plan.progress} strokeColor="#52c41a" />
              </div>
              <Timeline size="small">
                {plan.actions.map((action, index) => (
                  <Timeline.Item
                    key={index}
                    color={getActionStatusColor(action.status)}
                    dot={getActionStatusIcon(action.status)}
                  >
                    <Space>
                      <Text>{action.action}</Text>
                      <Text type="secondary">{action.date}</Text>
                      <Tag color={getActionStatusColor(action.status)}>
                        {getActionStatusText(action.status)}
                      </Tag>
                    </Space>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </List.Item>
        )}
      />
    );
  };

  // 渲染沟通记录
  const renderCommunicationHistory = () => {
    const messages = communicationData.messages || [];
    
    return (
      <List
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={msg.type === 'student' ? <UserOutlined /> : <TeamOutlined />} 
                  style={{ backgroundColor: msg.type === 'student' ? '#1890ff' : '#52c41a' }}
                />
              }
              title={
                <Space>
                  <Text strong>{msg.recipient}</Text>
                  <Tag color={msg.type === 'student' ? 'blue' : 'green'}>
                    {msg.type === 'student' ? '学生' : '家长'}
                  </Tag>
                  <Tag color={msg.status === 'sent' ? 'success' : 'default'}>
                    {msg.status === 'sent' ? '已发送' : '草稿'}
                  </Tag>
                  {msg.readDate && <Tag color="orange">已读</Tag>}
                </Space>
              }
              description={
                <div>
                  <Text strong>{msg.subject}</Text>
                  <br />
                  <Paragraph ellipsis={{ rows: 2 }}>{msg.content}</Paragraph>
                  <Text type="secondary">发送时间：{msg.sentDate}</Text>
                  {msg.readDate && (
                    <Text type="secondary" style={{ marginLeft: 16 }}>阅读时间：{msg.readDate}</Text>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  // 获取优先级文本和颜色
  const getPriorityText = (priority) => {
    const texts = { 'high': '高', 'medium': '中', 'low': '低' };
    return texts[priority] || '中';
  };

  const getPriorityColor = (priority) => {
    const colors = { 'high': '#ff4d4f', 'medium': '#fa8c16', 'low': '#52c41a' };
    return colors[priority] || '#fa8c16';
  };

  // 获取风险等级文本和颜色
  const getRiskLevelText = (level) => {
    const texts = { 'high': '高风险', 'medium': '中风险', 'low': '低风险' };
    return texts[level] || '中风险';
  };

  const getRiskLevelColor = (level) => {
    const colors = { 'high': '#ff4d4f', 'medium': '#fa8c16', 'low': '#52c41a' };
    return colors[level] || '#fa8c16';
  };

  // 获取状态文本和颜色
  const getStatusText = (status) => {
    const texts = { 'pending': '待处理', 'in_progress': '处理中', 'completed': '已完成' };
    return texts[status] || '待处理';
  };

  const getStatusColor = (status) => {
    const colors = { 'pending': 'default', 'in_progress': 'processing', 'completed': 'success' };
    return colors[status] || 'default';
  };

  // 获取行动状态
  const getActionStatusText = (status) => {
    const texts = { 'pending': '待执行', 'in_progress': '进行中', 'completed': '已完成' };
    return texts[status] || '待执行';
  };

  const getActionStatusColor = (status) => {
    const colors = { 'pending': 'default', 'in_progress': 'blue', 'completed': 'green' };
    return colors[status] || 'default';
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
    <div className="teaching-support">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="教学建议" key="recommendations">
          <Tabs defaultActiveKey="paths" type="card">
            <TabPane tab="个性化学习路径" key="paths">
              <Card 
                title="学习路径推荐"
                extra={
                  <Button type="primary" icon={<PlusOutlined />}>
                    自定义路径
                  </Button>
                }
              >
                {renderPersonalizedPaths()}
              </Card>
            </TabPane>
            
            <TabPane tab="教学策略" key="strategies">
              <Card title="教学策略优化建议">
                {renderTeachingStrategies()}
              </Card>
            </TabPane>
            
            <TabPane tab="资源推荐" key="resources">
              <Card 
                title="教学资源推荐"
                extra={
                  <Button type="primary" icon={<PlusOutlined />}>
                    上传资源
                  </Button>
                }
              >
                {renderResourceRecommendations()}
              </Card>
            </TabPane>
          </Tabs>
        </TabPane>
        
        <TabPane tab="干预支持" key="intervention">
          <Tabs defaultActiveKey="risk" type="card">
            <TabPane tab="风险学生" key="risk">
              <Card 
                title="需要关注的学生"
                extra={
                  <Space>
                    <Badge count={interventionData.riskStudents?.length || 0} style={{ backgroundColor: '#ff4d4f' }}>
                      <Text>风险学生</Text>
                    </Badge>
                  </Space>
                }
              >
                {renderRiskStudents()}
              </Card>
            </TabPane>
            
            <TabPane tab="干预计划" key="plans">
              <Card 
                title="干预计划管理"
                extra={
                  <Button type="primary" icon={<PlusOutlined />}>
                    新建计划
                  </Button>
                }
              >
                {renderInterventionPlans()}
              </Card>
            </TabPane>
          </Tabs>
        </TabPane>
        
        <TabPane tab="沟通渠道" key="communication">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card 
                title="沟通记录"
                extra={
                  <Button 
                    type="primary" 
                    icon={<MessageOutlined />}
                    onClick={() => {
                      setModalType('message');
                      setModalVisible(true);
                    }}
                  >
                    发送消息
                  </Button>
                }
              >
                {renderCommunicationHistory()}
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="消息模板">
                <List
                  dataSource={communicationData.templates || []}
                  renderItem={(template) => (
                    <List.Item
                      actions={[
                        <Button 
                          size="small" 
                          onClick={() => {
                            form.setFieldsValue({ content: template.content });
                            setModalType('message');
                            setModalVisible(true);
                          }}
                        >
                          使用
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        title={template.name}
                        description={
                          <div>
                            <Tag color={template.type === 'student' ? 'blue' : 'green'}>
                              {template.type === 'student' ? '学生' : '家长'}
                            </Tag>
                            <Paragraph ellipsis={{ rows: 2 }}>{template.content}</Paragraph>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 通用模态框 */}
      <Modal
        title={
          modalType === 'message' ? '发送消息' :
          modalType === 'intervention' ? '创建干预计划' : '操作'
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedStudent(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        {modalType === 'message' && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSendMessage}
          >
            <Form.Item
              name="recipient"
              label="接收人"
              rules={[{ required: true, message: '请选择接收人' }]}
            >
              <Select placeholder="选择接收人">
                <Option value="student">学生</Option>
                <Option value="parent">家长</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="subject"
              label="主题"
              rules={[{ required: true, message: '请输入主题' }]}
            >
              <Input placeholder="请输入消息主题" />
            </Form.Item>
            <Form.Item
              name="content"
              label="内容"
              rules={[{ required: true, message: '请输入消息内容' }]}
            >
              <TextArea rows={6} placeholder="请输入消息内容" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                  发送
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
        
        {modalType === 'intervention' && selectedStudent && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateIntervention}
            initialValues={{
              student: selectedStudent.name,
              riskLevel: selectedStudent.riskLevel
            }}
          >
            <Form.Item
              name="student"
              label="学生姓名"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="planName"
              label="计划名称"
              rules={[{ required: true, message: '请输入计划名称' }]}
            >
              <Input placeholder="请输入干预计划名称" />
            </Form.Item>
            <Form.Item
              name="dateRange"
              label="执行周期"
              rules={[{ required: true, message: '请选择执行周期' }]}
            >
              <DatePicker.RangePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="description"
              label="计划描述"
              rules={[{ required: true, message: '请输入计划描述' }]}
            >
              <TextArea rows={4} placeholder="请描述具体的干预措施和目标" />
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
      </Modal>
    </div>
  );
};

export default TeachingSupport;