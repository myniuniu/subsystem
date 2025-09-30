import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
  Tabs,
  Table,
  Progress,
  Tag,
  Alert,
  Tooltip,
  Empty,
  Spin
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  RadarChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
  UserOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import { Line, Bar, Pie, Radar } from '@ant-design/charts';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TrainingDashboardViewer = ({ 
  record, 
  content, 
  onBack 
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('quarter');
  const [trainingType, setTrainingType] = useState('all');
  const [dashboardData, setDashboardData] = useState(null);

  // 生成培训报表数据
  const generateDashboardData = () => {
    return {
      // 关键指标统计
      keyMetrics: {
        totalTrainings: 45,
        totalParticipants: 1280,
        completionRate: 89.5,
        satisfactionRate: 94.2,
        averageScore: 87.3,
        totalHours: 2160
      },
      
      // 培训数量趋势（按月）
      trainingTrend: [
        { month: '1月', count: 8, participants: 180 },
        { month: '2月', count: 6, participants: 120 },
        { month: '3月', count: 12, participants: 280 },
        { month: '4月', count: 10, participants: 220 },
        { month: '5月', count: 9, participants: 200 },
        { month: '6月', count: 15, participants: 320 }
      ],
      
      // 培训类型分布
      trainingTypeDistribution: [
        { type: '教学方法', count: 15, percentage: 33.3 },
        { type: '技术应用', count: 12, percentage: 26.7 },
        { type: '管理能力', count: 8, percentage: 17.8 },
        { type: '专业技能', count: 6, percentage: 13.3 },
        { type: '其他', count: 4, percentage: 8.9 }
      ],
      
      // 培训效果雷达图数据
      effectivenessRadar: [
        { dimension: '知识提升', score: 85 },
        { dimension: '技能增强', score: 88 },
        { dimension: '态度转变', score: 82 },
        { dimension: '行为改变', score: 79 },
        { dimension: '工作绩效', score: 86 },
        { dimension: '团队协作', score: 84 }
      ],
      
      // 满意度分布
      satisfactionDistribution: [
        { level: '非常满意', count: 720, percentage: 56.3 },
        { level: '满意', count: 485, percentage: 37.9 },
        { level: '一般', count: 58, percentage: 4.5 },
        { level: '不满意', count: 12, percentage: 0.9 },
        { level: '非常不满意', count: 5, percentage: 0.4 }
      ],
      
      // 讲师效果排行
      instructorRanking: [
        { name: '张教授', trainings: 8, avgScore: 92.5, satisfaction: 96.8 },
        { name: '李老师', trainings: 6, avgScore: 89.2, satisfaction: 94.5 },
        { name: '王老师', trainings: 7, avgScore: 88.7, satisfaction: 93.2 },
        { name: '陈老师', trainings: 5, avgScore: 87.9, satisfaction: 92.1 },
        { name: '刘老师', trainings: 4, avgScore: 86.5, satisfaction: 90.8 }
      ],
      
      // 培训详细记录
      trainingRecords: [
        {
          key: '1',
          name: '现代教学方法与技能提升',
          type: '教学方法',
          instructor: '张教授',
          participants: 25,
          duration: '6周',
          startDate: '2024-01-15',
          endDate: '2024-02-26',
          status: '已完成',
          completionRate: 96,
          satisfaction: 94.5,
          avgScore: 88.2
        },
        {
          key: '2',
          name: '数字化教学工具应用',
          type: '技术应用',
          instructor: '李老师',
          participants: 20,
          duration: '4周',
          startDate: '2024-02-01',
          endDate: '2024-02-28',
          status: '已完成',
          completionRate: 90,
          satisfaction: 92.0,
          avgScore: 85.7
        },
        {
          key: '3',
          name: '课堂管理与学生互动',
          type: '管理能力',
          instructor: '王老师',
          participants: 30,
          duration: '3周',
          startDate: '2024-03-01',
          endDate: '2024-03-21',
          status: '进行中',
          completionRate: 75,
          satisfaction: 93.5,
          avgScore: 87.1
        }
      ]
    };
  };

  useEffect(() => {
    setLoading(true);
    // 模拟数据加载
    setTimeout(() => {
      setDashboardData(generateDashboardData());
      setLoading(false);
    }, 1000);
  }, [timeRange, trainingType]);

  // 处理数据导出
  const handleExport = () => {
    // 这里可以实现数据导出功能
    console.log('导出培训报表数据');
  };

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setDashboardData(generateDashboardData());
      setLoading(false);
    }, 500);
  };

  if (loading || !dashboardData) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Spin size="large" />
        <div style={{ marginLeft: 16 }}>
          <Text>正在加载培训报表数据...</Text>
        </div>
      </div>
    );
  }

  // 培训趋势图配置
  const trendConfig = {
    data: dashboardData.trainingTrend,
    xField: 'month',
    yField: 'count',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    color: '#1890ff',
    smooth: true,
  };

  // 培训类型分布饼图配置
  const typeDistributionConfig = {
    appendPadding: 10,
    data: dashboardData.trainingTypeDistribution,
    angleField: 'count',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}%',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  // 培训效果雷达图配置
  const radarConfig = {
    data: dashboardData.effectivenessRadar,
    xField: 'dimension',
    yField: 'score',
    meta: {
      score: {
        alias: '得分',
        min: 0,
        max: 100,
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null,
          },
        },
      },
    },
    yAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          type: 'line',
          style: {
            lineDash: null,
          },
        },
        alternateColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    point: {
      size: 2,
    },
    area: {},
  };

  // 满意度分布柱状图配置
  const satisfactionConfig = {
    data: dashboardData.satisfactionDistribution,
    xField: 'level',
    yField: 'count',
    color: '#52c41a',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      level: {
        alias: '满意度等级',
      },
      count: {
        alias: '人数',
      },
    },
  };

  // 培训记录表格列配置
  const recordColumns = [
    {
      title: '培训名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '讲师',
      dataIndex: 'instructor',
      key: 'instructor',
      width: 100,
    },
    {
      title: '参与人数',
      dataIndex: 'participants',
      key: 'participants',
      width: 100,
      render: (count) => <Text>{count}人</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          '已完成': { color: 'success', icon: <CheckCircleOutlined /> },
          '进行中': { color: 'processing', icon: <ClockCircleOutlined /> },
          '未开始': { color: 'default', icon: <ClockCircleOutlined /> },
        };
        const config = statusConfig[status] || statusConfig['未开始'];
        return <Tag color={config.color} icon={config.icon}>{status}</Tag>;
      },
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 120,
      render: (rate) => <Progress percent={rate} size="small" />,
    },
    {
      title: '满意度',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      width: 100,
      render: (score) => (
        <Tooltip title={`满意度: ${score}%`}>
          <Text>{score}%</Text>
        </Tooltip>
      ),
    },
    {
      title: '平均分',
      dataIndex: 'avgScore',
      key: 'avgScore',
      width: 100,
      render: (score) => <Text strong>{score}</Text>,
    },
  ];

  // 讲师排行表格列配置
  const instructorColumns = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, index) => (
        <div style={{ 
          width: 24, 
          height: 24, 
          borderRadius: '50%', 
          backgroundColor: index < 3 ? '#faad14' : '#d9d9d9',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {index + 1}
        </div>
      ),
    },
    {
      title: '讲师姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '培训次数',
      dataIndex: 'trainings',
      key: 'trainings',
      render: (count) => <Text>{count}次</Text>,
    },
    {
      title: '平均分',
      dataIndex: 'avgScore',
      key: 'avgScore',
      render: (score) => <Text strong>{score}</Text>,
    },
    {
      title: '满意度',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      render: (rate) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Progress percent={rate} size="small" style={{ width: 60 }} />
          <Text>{rate}%</Text>
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 头部工具栏 */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={onBack}
              type="text"
            />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                📊 培训报表智能工具
              </Title>
              <Text type="secondary">多维度培训数据分析与可视化</Text>
            </div>
          </div>
          <Space>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 120 }}
            >
              <Option value="month">本月</Option>
              <Option value="quarter">本季度</Option>
              <Option value="year">本年度</Option>
              <Option value="all">全部</Option>
            </Select>
            <Select
              value={trainingType}
              onChange={setTrainingType}
              style={{ width: 120 }}
            >
              <Option value="all">全部类型</Option>
              <Option value="teaching">教学方法</Option>
              <Option value="tech">技术应用</Option>
              <Option value="management">管理能力</Option>
              <Option value="skill">专业技能</Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              刷新
            </Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
              导出报表
            </Button>
          </Space>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'overview',
              label: (
                <span>
                  <BarChartOutlined />
                  数据概览
                </span>
              ),
              children: (
                <div>
                  {/* 关键指标统计 */}
                  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col span={4}>
                      <Card>
                        <Statistic
                          title="培训总数"
                          value={dashboardData.keyMetrics.totalTrainings}
                          suffix="个"
                          prefix={<BookOutlined />}
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </Card>
                    </Col>
                    <Col span={4}>
                      <Card>
                        <Statistic
                          title="参与人次"
                          value={dashboardData.keyMetrics.totalParticipants}
                          suffix="人次"
                          prefix={<UserOutlined />}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Card>
                    </Col>
                    <Col span={4}>
                      <Card>
                        <Statistic
                          title="完成率"
                          value={dashboardData.keyMetrics.completionRate}
                          suffix="%"
                          prefix={<CheckCircleOutlined />}
                          valueStyle={{ color: '#faad14' }}
                        />
                      </Card>
                    </Col>
                    <Col span={4}>
                      <Card>
                        <Statistic
                          title="满意度"
                          value={dashboardData.keyMetrics.satisfactionRate}
                          suffix="%"
                          prefix={<StarOutlined />}
                          valueStyle={{ color: '#f5222d' }}
                        />
                      </Card>
                    </Col>
                    <Col span={4}>
                      <Card>
                        <Statistic
                          title="平均分"
                          value={dashboardData.keyMetrics.averageScore}
                          suffix="分"
                          prefix={<TrophyOutlined />}
                          valueStyle={{ color: '#722ed1' }}
                        />
                      </Card>
                    </Col>
                    <Col span={4}>
                      <Card>
                        <Statistic
                          title="总学时"
                          value={dashboardData.keyMetrics.totalHours}
                          suffix="小时"
                          prefix={<ClockCircleOutlined />}
                          valueStyle={{ color: '#13c2c2' }}
                        />
                      </Card>
                    </Col>
                  </Row>

                  {/* 培训趋势和类型分布 */}
                  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col span={12}>
                      <Card title="培训数量趋势" extra={<LineChartOutlined />}>
                        <Line {...trendConfig} height={300} />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="培训类型分布" extra={<PieChartOutlined />}>
                        <Pie {...typeDistributionConfig} height={300} />
                      </Card>
                    </Col>
                  </Row>

                  {/* 培训效果和满意度 */}
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Card title="培训效果评估" extra={<RadarChartOutlined />}>
                        <Radar {...radarConfig} height={300} />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="满意度分布" extra={<BarChartOutlined />}>
                        <Bar {...satisfactionConfig} height={300} />
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: 'records',
              label: (
                <span>
                  <BookOutlined />
                  培训记录
                </span>
              ),
              children: (
                <Card title="培训详细记录" extra={
                  <Space>
                    <Text type="secondary">共 {dashboardData.trainingRecords.length} 条记录</Text>
                  </Space>
                }>
                  <Table
                    columns={recordColumns}
                    dataSource={dashboardData.trainingRecords}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => 
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
                    }}
                    scroll={{ x: 1000 }}
                  />
                </Card>
              ),
            },
            {
              key: 'instructors',
              label: (
                <span>
                  <TrophyOutlined />
                  讲师排行
                </span>
              ),
              children: (
                <Card title="讲师效果排行榜" extra={
                  <Text type="secondary">按综合评分排序</Text>
                }>
                  <Table
                    columns={instructorColumns}
                    dataSource={dashboardData.instructorRanking}
                    pagination={false}
                    size="middle"
                  />
                </Card>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default TrainingDashboardViewer;