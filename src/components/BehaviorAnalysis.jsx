import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Progress,
  Alert,
  Tabs,
  List,
  Avatar,
  Typography,
  Tooltip,
  Modal,
  Timeline,
  Empty
} from 'antd';
import {
  ClockCircleOutlined,
  UserOutlined,
  InteractionOutlined,
  FileTextOutlined,
  TrophyOutlined,
  WarningOutlined,
  EyeOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AlertOutlined,
  BookOutlined,
  MessageOutlined,
  DownloadOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { Line, Bar, Pie } from '@ant-design/charts';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const { RangePicker } = DatePicker;

const BehaviorAnalysis = () => {
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [behaviorData, setBehaviorData] = useState({});
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // 模拟学习行为数据
  useEffect(() => {
    const mockData = {
      overview: {
        totalStudents: 156,
        activeStudents: 142,
        avgLearningTime: 4.2,
        interactionRate: 78.5
      },
      learningTime: [
        { date: '2024-01-08', time: 3.5, subject: '数学' },
        { date: '2024-01-09', time: 4.2, subject: '数学' },
        { date: '2024-01-10', time: 2.8, subject: '数学' },
        { date: '2024-01-11', time: 5.1, subject: '数学' },
        { date: '2024-01-12', time: 3.9, subject: '数学' },
        { date: '2024-01-13', time: 4.6, subject: '数学' },
        { date: '2024-01-14', time: 3.2, subject: '数学' }
      ],
      learningPath: [
        { resource: '基础概念', visits: 245, avgTime: 12.5, completion: 89 },
        { resource: '练习题库', visits: 189, avgTime: 18.3, completion: 76 },
        { resource: '视频教程', visits: 167, avgTime: 25.7, completion: 82 },
        { resource: '案例分析', visits: 134, avgTime: 15.2, completion: 68 },
        { resource: '拓展阅读', visits: 98, avgTime: 8.9, completion: 45 }
      ],
      interactions: [
        { type: '提问', count: 45, trend: 'up' },
        { type: '回答', count: 32, trend: 'up' },
        { type: '评论', count: 78, trend: 'down' },
        { type: '点赞', count: 156, trend: 'up' },
        { type: '收藏', count: 23, trend: 'stable' }
      ],
      resourceUsage: [
        { type: 'PDF文档', usage: 45, color: '#1890ff' },
        { type: '视频课程', usage: 30, color: '#52c41a' },
        { type: '在线练习', usage: 15, color: '#fa8c16' },
        { type: '互动课件', usage: 10, color: '#722ed1' }
      ],
      behaviorAlerts: [
        {
          id: 1,
          student: '张三',
          type: 'warning',
          message: '连续3天未登录学习平台',
          time: '2024-01-15 09:00:00',
          severity: 'high'
        },
        {
          id: 2,
          student: '李四',
          type: 'info',
          message: '学习时长异常增长，建议关注学习效果',
          time: '2024-01-15 08:30:00',
          severity: 'medium'
        },
        {
          id: 3,
          student: '王五',
          type: 'warning',
          message: '跳过关键知识点学习',
          time: '2024-01-15 08:00:00',
          severity: 'high'
        },
        {
          id: 4,
          student: '赵六',
          type: 'success',
          message: '学习行为表现优秀，保持良好习惯',
          time: '2024-01-15 07:45:00',
          severity: 'low'
        }
      ]
    };
    setBehaviorData(mockData);
  }, []);

  // 学习时长趋势图配置
  const learningTimeConfig = {
    data: behaviorData.learningTime || [],
    xField: 'date',
    yField: 'time',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    smooth: true,
    color: '#1890ff'
  };

  // 学习路径柱状图配置
  const learningPathConfig = {
    data: behaviorData.learningPath || [],
    xField: 'visits',
    yField: 'resource',
    seriesField: 'resource',
    color: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96']
  };

  // 资源使用饼图配置
  const resourceUsageConfig = {
    data: behaviorData.resourceUsage || [],
    angleField: 'usage',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };

  // 渲染行为预警
  const renderBehaviorAlerts = () => {
    const alerts = behaviorData.behaviorAlerts || [];
    
    return (
      <Card title="行为预警" className="alerts-card">
        <List
          dataSource={alerts}
          renderItem={(alert) => (
            <List.Item
              actions={[
                <Button 
                  type="link" 
                  icon={<EyeOutlined />}
                  onClick={() => {
                    setSelectedAlert(alert);
                    setAlertModalVisible(true);
                  }}
                >
                  查看详情
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={getAlertIcon(alert.type)} 
                    style={{ backgroundColor: getAlertColor(alert.severity) }}
                  />
                }
                title={
                  <Space>
                    <Text strong>{alert.student}</Text>
                    <Tag color={getAlertColor(alert.severity)}>
                      {getSeverityText(alert.severity)}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <Paragraph ellipsis={{ rows: 1 }}>{alert.message}</Paragraph>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {alert.time}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
          pagination={{
            pageSize: 5,
            size: 'small'
          }}
        />
      </Card>
    );
  };

  // 获取预警图标
  const getAlertIcon = (type) => {
    const icons = {
      'warning': <WarningOutlined />,
      'info': <AlertOutlined />,
      'success': <TrophyOutlined />
    };
    return icons[type] || <AlertOutlined />;
  };

  // 获取预警颜色
  const getAlertColor = (severity) => {
    const colors = {
      'high': '#ff4d4f',
      'medium': '#fa8c16',
      'low': '#52c41a'
    };
    return colors[severity] || '#1890ff';
  };

  // 获取严重程度文本
  const getSeverityText = (severity) => {
    const texts = {
      'high': '高风险',
      'medium': '中风险',
      'low': '低风险'
    };
    return texts[severity] || '未知';
  };

  // 渲染互动行为分析
  const renderInteractionAnalysis = () => {
    const interactions = behaviorData.interactions || [];
    
    return (
      <Row gutter={[16, 16]}>
        {interactions.map((item, index) => (
          <Col xs={24} sm={12} lg={8} xl={4} key={index}>
            <Card className="interaction-card">
              <Statistic
                title={item.type}
                value={item.count}
                prefix={getInteractionIcon(item.type)}
                suffix={
                  <Tag color={getTrendColor(item.trend)}>
                    {getTrendText(item.trend)}
                  </Tag>
                }
                valueStyle={{ 
                  color: getTrendColor(item.trend),
                  fontSize: '20px'
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  // 获取互动图标
  const getInteractionIcon = (type) => {
    const icons = {
      '提问': <MessageOutlined />,
      '回答': <BookOutlined />,
      '评论': <MessageOutlined />,
      '点赞': <HeartOutlined />,
      '收藏': <DownloadOutlined />
    };
    return icons[type] || <InteractionOutlined />;
  };

  // 获取趋势颜色
  const getTrendColor = (trend) => {
    const colors = {
      'up': '#52c41a',
      'down': '#ff4d4f',
      'stable': '#1890ff'
    };
    return colors[trend] || '#1890ff';
  };

  // 获取趋势文本
  const getTrendText = (trend) => {
    const texts = {
      'up': '↗',
      'down': '↘',
      'stable': '→'
    };
    return texts[trend] || '→';
  };

  return (
    <div className="behavior-analysis">
      {/* 筛选控件 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Text strong>学生选择：</Text>
          </Col>
          <Col>
            <Select
              value={selectedStudent}
              onChange={setSelectedStudent}
              style={{ width: 200 }}
            >
              <Option value="all">全部学生</Option>
              <Option value="class1">一班</Option>
              <Option value="class2">二班</Option>
              <Option value="individual">个别学生</Option>
            </Select>
          </Col>
          <Col>
            <Text strong>时间范围：</Text>
          </Col>
          <Col>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              style={{ width: 300 }}
            />
          </Col>
          <Col>
            <Button type="primary">应用筛选</Button>
          </Col>
        </Row>
      </Card>

      {/* 概览统计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="学生总数"
              value={behaviorData.overview?.totalStudents || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="活跃学生"
              value={behaviorData.overview?.activeStudents || 0}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="平均学习时长"
              value={behaviorData.overview?.avgLearningTime || 0}
              suffix="小时/天"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="互动参与率"
              value={behaviorData.overview?.interactionRate || 0}
              suffix="%"
              prefix={<InteractionOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: 'overview',
            label: '行为概览',
            children: (
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Card title="学习时长趋势" className="chart-card">
                    <Line {...learningTimeConfig} height={300} />
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  {renderBehaviorAlerts()}
                </Col>
              </Row>
            )
          },
          {
            key: 'path',
            label: '学习路径',
            children: (
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Card title="学习资源访问情况" className="chart-card">
                    <Bar {...learningPathConfig} height={300} />
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Card title="资源类型分布" className="chart-card">
                    <Pie {...resourceUsageConfig} height={300} />
                  </Card>
                </Col>
              </Row>
            )
          },
          {
            key: 'interaction',
            label: '互动行为',
            children: (
              <>
                <Card title="互动行为统计" className="interaction-overview">
                  {renderInteractionAnalysis()}
                </Card>
                
                <Card title="互动行为详情" style={{ marginTop: 24 }}>
                  <Table
                    columns={[
                      {
                        title: '学生姓名',
                        dataIndex: 'name',
                        key: 'name'
                      },
                      {
                        title: '提问次数',
                        dataIndex: 'questions',
                        key: 'questions',
                        sorter: true
                      },
                      {
                        title: '回答次数',
                        dataIndex: 'answers',
                        key: 'answers',
                        sorter: true
                      },
                      {
                        title: '互动得分',
                        dataIndex: 'score',
                        key: 'score',
                        render: (score) => (
                          <Progress 
                            percent={score} 
                            size="small" 
                            strokeColor={score >= 80 ? '#52c41a' : score >= 60 ? '#fa8c16' : '#ff4d4f'}
                          />
                        )
                      },
                      {
                        title: '活跃度',
                        dataIndex: 'activity',
                        key: 'activity',
                        render: (activity) => (
                          <Tag color={activity === '高' ? 'success' : activity === '中' ? 'warning' : 'error'}>
                            {activity}
                          </Tag>
                        )
                      }
                    ]}
                    dataSource={[
                      { key: 1, name: '张三', questions: 15, answers: 8, score: 85, activity: '高' },
                      { key: 2, name: '李四', questions: 12, answers: 6, score: 72, activity: '中' },
                      { key: 3, name: '王五', questions: 8, answers: 4, score: 58, activity: '中' },
                      { key: 4, name: '赵六', questions: 5, answers: 2, score: 35, activity: '低' }
                    ]}
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
              </>
            )
          },
          {
            key: 'alerts',
            label: '异常预警',
            children: (
              <>
                <Alert
                  message="行为异常检测"
                  description="系统自动识别学习行为异常，包括长时间不活跃、跳过关键内容、学习模式突变等情况。"
                  type="info"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
                
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={16}>
                    {renderBehaviorAlerts()}
                  </Col>
                  <Col xs={24} lg={8}>
                    <Card title="预警统计" className="alert-stats">
                      <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div>
                          <Text>高风险预警</Text>
                          <Progress percent={15} strokeColor="#ff4d4f" />
                          <Text type="secondary">2个</Text>
                        </div>
                        <div>
                          <Text>中风险预警</Text>
                          <Progress percent={25} strokeColor="#fa8c16" />
                          <Text type="secondary">1个</Text>
                        </div>
                        <div>
                          <Text>低风险预警</Text>
                          <Progress percent={60} strokeColor="#52c41a" />
                          <Text type="secondary">1个</Text>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </>
            )
          }
        ]}
      />

      {/* 预警详情模态框 */}
      <Modal
        title="预警详情"
        open={alertModalVisible}
        onCancel={() => setAlertModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setAlertModalVisible(false)}>
            关闭
          </Button>,
          <Button key="handle" type="primary">
            处理预警
          </Button>
        ]}
        width={600}
      >
        {selectedAlert && (
          <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>学生：</Text>
                <Text>{selectedAlert.student}</Text>
              </div>
              <div>
                <Text strong>预警类型：</Text>
                <Tag color={getAlertColor(selectedAlert.severity)}>
                  {getSeverityText(selectedAlert.severity)}
                </Tag>
              </div>
              <div>
                <Text strong>预警内容：</Text>
                <Paragraph>{selectedAlert.message}</Paragraph>
              </div>
              <div>
                <Text strong>发生时间：</Text>
                <Text>{selectedAlert.time}</Text>
              </div>
              <div>
                <Text strong>建议措施：</Text>
                <Paragraph>
                  根据该学生的学习行为异常情况，建议教师主动联系学生了解情况，
                  提供个性化的学习指导和支持，必要时可安排一对一辅导。
                </Paragraph>
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BehaviorAnalysis;