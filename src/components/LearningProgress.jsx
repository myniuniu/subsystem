import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Progress,
  Statistic,
  Typography,
  Space,
  Tag,
  Timeline,
  Button,
  Tooltip,
  Avatar,
  List,
  Badge,
  Divider,
  Select,
  DatePicker,
  message,
  Modal,
  Form,
  Input,
  InputNumber
} from 'antd';
import {
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Clock,
  Calendar,
  BarChart3,
  Users,
  CheckCircle,
  AlertCircle,
  Plus,
  Download,
  Upload
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './LearningProgress.css';
import learningProgressService from '../services/learningProgressService';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const LearningProgress = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [modalVisible, setModalVisible] = useState(false);
  const [goalForm] = Form.useForm();
  
  // 数据状态
  const [studySummary, setStudySummary] = useState({});
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [dailyTrend, setDailyTrend] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({});
  const [studyGoals, setStudyGoals] = useState([]);
  const [achievements, setAchievements] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const summary = learningProgressService.getStudySummary();
      const subjects = learningProgressService.getSubjectProgress();
      const trend = learningProgressService.getDailyTrend();
      const weekly = learningProgressService.getWeeklyStats();
      const goals = learningProgressService.getStudyGoals();
      const achievementData = learningProgressService.getAchievements();
      const activities = learningProgressService.getRecentActivities();

      setStudySummary(summary);
      setSubjectProgress(subjects);
      setDailyTrend(trend);
      setWeeklyStats(weekly);
      setStudyGoals(goals);
      setAchievements(achievementData);
      setRecentActivities(activities);
    } catch (error) {
      message.error('加载数据失败');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 添加学习目标
  const handleAddGoal = async (values) => {
    try {
      await learningProgressService.addStudyGoal(
        values.title,
        values.description,
        values.target,
        values.deadline,
        values.priority
      );
      message.success('学习目标添加成功');
      setModalVisible(false);
      goalForm.resetFields();
      loadData();
    } catch (error) {
      message.error('添加学习目标失败');
    }
  };

  // 导出学习报告
  const handleExportReport = () => {
    try {
      const data = learningProgressService.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learning-progress-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('学习报告导出成功');
    } catch (error) {
      message.error('导出失败');
    }
  };

  // 模拟学习进度数据
  const learningStats = {
    totalHours: 156.5,
    completedCourses: 12,
    inProgressCourses: 5,
    totalCourses: 25,
    averageScore: 87.5,
    streak: 15,
    weeklyGoal: 20,
    weeklyCompleted: 16.5
  };

  // 每日学习时长数据
  const dailyLearningData = [
    { date: '周一', hours: 2.5, target: 3 },
    { date: '周二', hours: 3.2, target: 3 },
    { date: '周三', hours: 1.8, target: 3 },
    { date: '周四', hours: 4.1, target: 3 },
    { date: '周五', hours: 2.9, target: 3 },
    { date: '周六', hours: 3.5, target: 3 },
    { date: '周日', hours: 2.8, target: 3 }
  ];

  // 学习成果分布
  const achievementData = [
    { name: '优秀', value: 45, color: '#52c41a' },
    { name: '良好', value: 35, color: '#1890ff' },
    { name: '一般', value: 15, color: '#faad14' },
    { name: '待提升', value: 5, color: '#ff4d4f' }
  ];

  return (
    <div className="learning-progress">
      <div className="learning-progress-header">
        <div className="header-content">
          <div className="header-left">
            <Title level={2}>
              <BookOpen className="header-icon" />
              学习进度监控
            </Title>
            <Text type="secondary">跟踪您的学习进度，制定学习目标</Text>
          </div>
          <div className="header-actions">
            <Space>
              <Select
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                style={{ width: 120 }}
              >
                <Option value="week">本周</Option>
                <Option value="month">本月</Option>
                <Option value="quarter">本季度</Option>
                <Option value="year">本年</Option>
              </Select>
              <Button
                type="primary"
                icon={<Plus />}
                onClick={() => setModalVisible(true)}
              >
                添加目标
              </Button>
              <Button
                icon={<Download />}
                onClick={handleExportReport}
              >
                导出报告
              </Button>
            </Space>
          </div>
        </div>
      </div>

      <div className="learning-progress-content">
        {/* 学习统计卡片 */}
        <Row gutter={[16, 16]} className="stats-cards">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="总学习时长"
                value={learningStats.totalHours}
                suffix="小时"
                prefix={<Clock className="stat-icon" />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="已完成课程"
                value={learningStats.completedCourses}
                suffix={`/ ${learningStats.totalCourses}`}
                prefix={<BookOpen className="stat-icon" />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="平均成绩"
                value={learningStats.averageScore}
                suffix="分"
                prefix={<Award className="stat-icon" />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="连续学习"
                value={learningStats.streak}
                suffix="天"
                prefix={<Target className="stat-icon" />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* 学科进度 */}
          <Col xs={24} lg={12}>
            <Card title="学科学习进度" className="subject-progress-card">
              <div className="subject-list">
                {subjectProgress.map((subject) => (
                  <div key={subject.id} className="subject-item">
                    <div className="subject-header">
                      <div className="subject-info">
                        <span className="subject-icon">{subject.icon}</span>
                        <span className="subject-name">{subject.name}</span>
                      </div>
                      <span className="subject-progress-text">
                        {Math.round((subject.completedLessons / subject.totalLessons) * 100)}%
                      </span>
                    </div>
                    <Progress
                      percent={Math.round((subject.completedLessons / subject.totalLessons) * 100)}
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                      className="subject-progress-bar"
                    />
                    <div className="subject-stats">
                      <Text type="secondary">
                        已完成 {subject.completedLessons} / {subject.totalLessons} 课时
                      </Text>
                      <Text type="secondary">
                        学习时长: {subject.totalTime}h
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* 学习趋势图 */}
          <Col xs={24} lg={12}>
            <Card title="每日学习时长趋势" className="trend-chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyLearningData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#1890ff"
                    strokeWidth={2}
                    name="实际学习时长"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#52c41a"
                    strokeDasharray="5 5"
                    name="目标时长"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* 本周目标 */}
          <Col xs={24} lg={8}>
            <Card title="本周学习目标" className="weekly-goal-card">
              <div className="goal-progress">
                <div className="goal-header">
                  <Text strong>学习时长目标</Text>
                  <Text type="secondary">
                    {learningStats.weeklyCompleted} / {learningStats.weeklyGoal} 小时
                  </Text>
                </div>
                <Progress
                  percent={Math.round((learningStats.weeklyCompleted / learningStats.weeklyGoal) * 100)}
                  strokeColor="#52c41a"
                  className="goal-progress-bar"
                />
                <div className="goal-stats">
                  <Text type="secondary">
                    还需学习 {Math.max(0, learningStats.weeklyGoal - learningStats.weeklyCompleted)} 小时
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* 学习成果分布 */}
          <Col xs={24} lg={8}>
            <Card title="学习成果分布" className="achievement-chart-card">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={achievementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {achievementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* 学习目标列表 */}
          <Col xs={24} lg={8}>
            <Card title="学习目标" className="goals-card">
              <List
                dataSource={studyGoals}
                renderItem={(goal) => (
                  <List.Item>
                    <div className="goal-item">
                      <div className="goal-header">
                        <Text strong>{goal.title}</Text>
                        <Tag color={goal.priority === 'high' ? 'red' : goal.priority === 'medium' ? 'orange' : 'blue'}>
                          {goal.priority === 'high' ? '高优先级' : goal.priority === 'medium' ? '中优先级' : '低优先级'}
                        </Tag>
                      </div>
                      <Progress
                        percent={goal.progress}
                        size="small"
                        strokeColor="#1890ff"
                      />
                      <Text type="secondary" className="goal-deadline">
                        截止日期: {goal.deadline}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* 最近活动 */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="最近学习活动" className="recent-activities-card">
              <Timeline>
                {recentActivities.map((activity) => (
                  <Timeline.Item
                    key={activity.id}
                    dot={
                      activity.type === 'completed' ? (
                        <CheckCircle className="activity-icon completed" />
                      ) : activity.type === 'started' ? (
                        <BookOpen className="activity-icon started" />
                      ) : (
                        <Award className="activity-icon achievement" />
                      )
                    }
                  >
                    <div className="activity-content">
                      <div className="activity-header">
                        <Text strong>{activity.title}</Text>
                        <Text type="secondary">{activity.time}</Text>
                      </div>
                      <div className="activity-details">
                        <Tag color="blue">{activity.subject}</Tag>
                        {activity.score && (
                          <Text type="secondary">得分: {activity.score}分</Text>
                        )}
                        {activity.progress && (
                          <Text type="secondary">进度: {activity.progress}%</Text>
                        )}
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 添加目标模态框 */}
      <Modal
        title="添加学习目标"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={goalForm}
          layout="vertical"
          onFinish={handleAddGoal}
        >
          <Form.Item
            name="title"
            label="目标标题"
            rules={[{ required: true, message: '请输入目标标题' }]}
          >
            <Input placeholder="请输入学习目标标题" />
          </Form.Item>
          <Form.Item
            name="description"
            label="目标描述"
          >
            <Input.TextArea rows={3} placeholder="请输入目标描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="target"
                label="目标值"
                rules={[{ required: true, message: '请输入目标值' }]}
              >
                <InputNumber
                  min={1}
                  max={100}
                  placeholder="目标完成度"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>
          <Form.Item
            name="deadline"
            label="截止日期"
            rules={[{ required: true, message: '请选择截止日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                添加目标
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LearningProgress;