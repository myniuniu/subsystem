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
  List,
  Avatar,
  Checkbox,
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
  DoubleRightOutlined,
  DoubleLeftOutlined,
  FilterOutlined,
  TrophyOutlined,
  UserOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import { Line, Bar, Pie, Radar } from '@ant-design/charts';
import dayjs from 'dayjs';
import { getLatestPlanSummary, parseFormats } from '../../utils/trainingPlanSummary';
import trainingAnalyticsService from '../../services/trainingAnalyticsService';

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
  // 模块页签：阶段筛选
  const [modulePhaseFilter, setModulePhaseFilter] = useState('all');
  // 学员学情：选中学员与详情
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentModuleDetails, setStudentModuleDetails] = useState([]);

  // 右侧钻取面板状态（必须在任何条件返回之前定义，保持hooks顺序一致）
  const [showDrillPanel, setShowDrillPanel] = useState(false);
  const [drillTopic, setDrillTopic] = useState('加入率');
  const [drillInfo, setDrillInfo] = useState({ base: 0, value: 0, other: 0, rate: 0 });
  const [drillDenominatorList, setDrillDenominatorList] = useState([]);
  const [drillNumeratorList, setDrillNumeratorList] = useState([]);
  // 右侧列表选择（最多显示两个清单）：'denominator' | 'numerator' | 'other'
  const [drillSelection, setDrillSelection] = useState(['denominator', 'numerator']);
  const handleDrillSelectionChange = (vals) => {
    const arr = Array.isArray(vals) ? vals : [];
    setDrillSelection(arr.slice(0, 2));
  };

  // 模块页签图形化钻取（模态框）
  const [showModuleDrillPanel, setShowModuleDrillPanel] = useState(false);
  const [moduleDrill, setModuleDrill] = useState({ formatName: '', stats: null });
  const [moduleDrillLists, setModuleDrillLists] = useState({ all: [], active: [], certified: [] });
  const [moduleSelectedFormat, setModuleSelectedFormat] = useState('');
  const [moduleDrillMetric, setModuleDrillMetric] = useState('participation'); // participation | completion | certification | avgScore
  const updateModuleDrill = (formatName, stats, totalParticipantsAll = 0) => {
    const makeList = (n, prefix) => Array.from({ length: Math.max(0, Number(n) || 0) }, (_, i) => ({ id: `${prefix}-${i+1}`, name: `${prefix}${i+1}` }));
    const participantsCount = Number(stats?.participants ?? totalParticipantsAll ?? 0);
    const allList = makeList(participantsCount, '学员');
    const activeList = makeList(stats?.active || 0, '学员');
    const certifiedList = makeList(stats?.certified || 0, '学员');
    setModuleDrill({ formatName, stats });
    setModuleDrillLists({ all: allList, active: activeList, certified: certifiedList });
    setShowModuleDrillPanel(true);
    setModuleSelectedFormat(formatName);
  };

  const updateDrill = (topic, denomList, numerList) => {
    const base = Array.isArray(denomList) ? denomList.length : Number(denomList) || 0;
    const value = Array.isArray(numerList) ? numerList.length : Number(numerList) || 0;
    const other = Math.max(0, base - value);
    const rate = base > 0 ? Math.round((value / base) * 100) : 0;
    setDrillTopic(topic);
    setDrillInfo({ base, value, other, rate });
    setDrillDenominatorList(Array.isArray(denomList) ? denomList : []);
    setDrillNumeratorList(Array.isArray(numerList) ? numerList : []);
    setShowDrillPanel(true);
  };

  // 生成培训报表数据
  const generateDashboardData = () => {
    return {
      // 关键指标统计
      keyMetrics: {
        totalTrainings: 12,
        totalParticipants: 50,
        completionRate: 90,
        satisfactionRate: 94.2,
        averageScore: 87.3,
        totalHours: 85
      },
      // 模块学习情况（示例数据，基于50人规模）
      modulesData: [
        {
          key: 'm1',
          name: '模块一：教学基础',
          formats: [
            { key: 'm1-f1', name: '直播课程', participants: 50, active: 45, certified: 25, completionRate: 90, avgHours: 6, avgScore: 85 },
            { key: 'm1-f2', name: '录播视频', participants: 50, active: 42, certified: 20, completionRate: 84, avgHours: 5, avgScore: 82 },
            { key: 'm1-f3', name: '线上研讨', participants: 50, active: 40, certified: 18, completionRate: 80, avgHours: 4, avgScore: 83 }
          ]
        },
        {
          key: 'm2',
          name: '模块二：课堂技能',
          formats: [
            { key: 'm2-f1', name: '示范课观摩', participants: 50, active: 44, certified: 24, completionRate: 88, avgHours: 6, avgScore: 88 },
            { key: 'm2-f2', name: '微格教学', participants: 50, active: 43, certified: 22, completionRate: 86, avgHours: 5, avgScore: 86 },
            { key: 'm2-f3', name: '实践作业', participants: 50, active: 41, certified: 21, completionRate: 82, avgHours: 4, avgScore: 84 }
          ]
        },
        {
          key: 'm3',
          name: '模块三：差异化教学',
          formats: [
            { key: 'm3-f1', name: '案例研讨', participants: 50, active: 40, certified: 20, completionRate: 80, avgHours: 5, avgScore: 83 },
            { key: 'm3-f2', name: '方案设计', participants: 50, active: 39, certified: 19, completionRate: 78, avgHours: 4, avgScore: 82 },
            { key: 'm3-f3', name: '反思写作', participants: 50, active: 38, certified: 18, completionRate: 76, avgHours: 3, avgScore: 81 }
          ]
        }
      ],
      // 学员清单（模拟：50人，加入100%，参与90%，获证50%）
      participantsList: (function(){
        const total = 50;
        const activeCount = Math.round(total * 0.9); // 45
        const certifiedCount = Math.round(total * 0.5); // 25
        const list = [];
        for (let i = 1; i <= total; i++) {
          list.push({
            id: i,
            name: `学员${i}`,
            joined: true,
            active: i <= activeCount,
            certified: i <= certifiedCount
          });
        }
        return list;
      })(),
      
      // 培训数量趋势（按月）
      trainingTrend: [
        { month: '1月', count: 2, participants: 9 },
        { month: '2月', count: 2, participants: 8 },
        { month: '3月', count: 2, participants: 10 },
        { month: '4月', count: 2, participants: 11 },
        { month: '5月', count: 2, participants: 6 },
        { month: '6月', count: 2, participants: 6 }
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

  // 初始化钻取数据：在报表数据加载完成后设置默认钻取到加入率
  // 初始不显示钻取面板（仅在点击时显示）

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
        padding: '16px 16px 16px 56px', 
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#fafafa'
      }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {record?.title || '培训报表'}
              </Title>
              <Text type="secondary">报告生成时间：{record?.time || dayjs().format('YYYY-MM-DD HH:mm')}</Text>
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
                  {/* 叙述式数据概览：更直观、人性化展示 */}
                  {(() => {
                    const participants = dashboardData?.participantsList || [];
                    const totalParticipants = participants.length;
                    const avgScore = Number(dashboardData?.keyMetrics?.averageScore || 0);
                    const totalHours = Number(dashboardData?.keyMetrics?.totalHours || 0);
                    const joined = participants.filter(p => p.joined).length;
                    const active = participants.filter(p => p.active).length;
                    const passed = participants.filter(p => p.certified).length;
                    const joinRate = totalParticipants ? Math.round((joined / totalParticipants) * 100) : 0;
                    const participationRate = joined ? Math.round((active / joined) * 100) : 0;
                    const certificationRate = active ? Math.round((passed / active) * 100) : 0;
                    const teachersJoined = Math.round(Math.max(1, totalParticipants * 0.5));
                    const submitRate = Math.round(50);
                    const avgHours = totalParticipants > 0 ? Math.round((totalHours / totalParticipants) * 10) / 10 : 0;
                    const createdAt = record?.time || dayjs().format('YYYY-MM-DD HH:mm');

                    const metrics = [
                      { label: '学员数量', value: totalParticipants, color: '#3b82f6', icon: '👨‍🎓' },
                      { label: '已加入人数', value: joined, color: '#22c55e', icon: '✅' },
                      { label: '加入率', value: totalParticipants ? Math.round((joined / totalParticipants) * 100) + '%' : '—', color: '#22c55e', icon: '📈' },
                      { label: '参与学习人数', value: active, color: '#f59e0b', icon: '📚' },
                      { label: '参与率', value: totalParticipants ? Math.round((active / totalParticipants) * 100) + '%' : '—', color: '#f59e0b', icon: '🎯' },
                      { label: '考核达标人数', value: passed, color: '#10b981', icon: '🏆' },
                      { label: '达标率', value: totalParticipants ? Math.round((passed / totalParticipants) * 100) + '%' : '—', color: '#10b981', icon: '✅' },
                      { label: '获证率', value: certificationRate + '%', color: '#16a34a', icon: '🎓' },
                      { label: '教师参与人数', value: teachersJoined, color: '#8b5cf6', icon: '👩‍🏫' },
                      { label: '提交率', value: submitRate + '%', color: '#8b5cf6', icon: '📝' },
                      { label: '平均成绩', value: avgScore, color: '#ef4444', icon: '📊' },
                      { label: '平均学时', value: avgHours, color: '#06b6d4', icon: '⏱️' },
                      { label: '创建时间', value: createdAt, color: '#64748b', icon: '🕒' }
                    ];

                    return (
                      <div style={{ display: 'flex', gap: 16 }}>
                        {/* 左侧：逻辑关系图，根据是否钻取决定占比（无钻取：全宽；钻取：40%） */}
                        <div style={{ flex: showDrillPanel ? '0 0 40%' : '1 1 auto', minWidth: 0, transition: 'flex-basis 0.25s ease' }}>
                          {/* 关键关系视图：条形图展示逻辑关系 */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                          {/* 加入关系 */}
                          <Card 
                            bodyStyle={{ padding: 16 }} 
                            style={{ 
                              borderRadius: 12,
                              border: '1px solid #f0f0f0',
                              borderLeft: drillTopic === '加入率' ? '3px solid #3b82f6' : '3px solid transparent',
                              background: drillTopic === '加入率' ? 'rgba(59,130,246,0.03)' : '#fff'
                            }}
                          >
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 2fr', alignItems: 'center', gap: 12 }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 12, color: '#6b7280' }}>学员数量</div>
                                <div style={{ fontSize: 22, fontWeight: 700 }}>{totalParticipants}</div>
                              </div>
                              <div onClick={() => updateDrill('加入率', participants, participants.filter(p => p.joined))} style={{ cursor: 'pointer' }}>
                                <div style={{ fontSize: 12, color: '#64748b', textAlign: 'right', marginBottom: 4 }}>比例：{joinRate}%</div>
                                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>加入率 = 已加入人数 / 学员数量</div>
                                <div style={{ height: 16, borderRadius: 12, background: '#eef2ff', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
                                  <div style={{ width: (totalParticipants ? Math.round((joined/totalParticipants)*100) : 0) + '%', height: '100%', background: 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: '#64748b' }}>
                                  <span>已加入：{joined}</span>
                                  <span>未加入：{Math.max(0, totalParticipants - joined)}</span>
                                </div>
                              </div>
                              {/* 去掉重复的环形图，仅保留进度条表达比例 */}
                              <div />
                            </div>
                          </Card>

                          {/* 参与关系 */}
                          <Card 
                            bodyStyle={{ padding: 16 }} 
                            style={{ 
                              borderRadius: 12,
                              border: '1px solid #f0f0f0',
                              borderLeft: drillTopic === '参与率' ? '3px solid #f59e0b' : '3px solid transparent',
                              background: drillTopic === '参与率' ? 'rgba(245,158,11,0.04)' : '#fff'
                            }}
                          >
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 2fr', alignItems: 'center', gap: 12 }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 12, color: '#6b7280' }}>已加入人数</div>
                                <div style={{ fontSize: 22, fontWeight: 700 }}>{joined}</div>
                              </div>
                              <div onClick={() => updateDrill('参与率', participants.filter(p => p.joined), participants.filter(p => p.active))} style={{ cursor: 'pointer' }}>
                                <div style={{ fontSize: 12, color: '#64748b', textAlign: 'right', marginBottom: 4 }}>比例：{participationRate}%</div>
                                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>参与率 = 参与学习人数 / 已加入人数</div>
                                <div style={{ height: 16, borderRadius: 12, background: '#fff7ed', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
                                  <div style={{ width: (joined ? Math.round((active/joined)*100) : 0) + '%', height: '100%', background: 'linear-gradient(90deg, #fb923c 0%, #f59e0b 100%)' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: '#64748b' }}>
                                  <span>参与：{active}</span>
                                  <span>未参与：{Math.max(0, joined - active)}</span>
                                </div>
                              </div>
                              <div />
                            </div>
                          </Card>

                          {/* 获证关系 */}
                          <Card 
                            bodyStyle={{ padding: 16 }} 
                            style={{ 
                              borderRadius: 12,
                              border: '1px solid #f0f0f0',
                              borderLeft: drillTopic === '获证率' ? '3px solid #22c55e' : '3px solid transparent',
                              background: drillTopic === '获证率' ? 'rgba(34,197,94,0.04)' : '#fff'
                            }}
                          >
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 2fr', alignItems: 'center', gap: 12 }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 12, color: '#6b7280' }}>参与学习人数</div>
                                <div style={{ fontSize: 22, fontWeight: 700 }}>{active}</div>
                              </div>
                              <div onClick={() => updateDrill('获证率', participants.filter(p => p.active), participants.filter(p => p.certified))} style={{ cursor: 'pointer' }}>
                                <div style={{ fontSize: 12, color: '#64748b', textAlign: 'right', marginBottom: 4 }}>比例：{certificationRate}%</div>
                                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>获证率 = 获证人数 / 参与学习人数</div>
                                <div style={{ height: 16, borderRadius: 12, background: '#ecfeff', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
                                  <div style={{ width: (active ? Math.round((passed/active)*100) : 0) + '%', height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #22c55e 100%)' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: '#64748b' }}>
                                  <span>获证：{passed}</span>
                                  <span>未获证：{Math.max(0, active - passed)}</span>
                                </div>
                              </div>
                              <div />
                            </div>
                          </Card>
                          </div>
                        </div>

                        {/* 右侧：钻取面板（可折叠），钻取时占比60%；仅右侧可滚动 */}
                        <div style={{ flex: showDrillPanel ? '0 0 60%' : '0 0 0%', minWidth: showDrillPanel ? 0 : 0, transition: 'flex-basis 0.25s ease, width 0.25s ease', position: 'relative' }}>
                          <Card bodyStyle={{ padding: 0, display: showDrillPanel ? 'block' : 'none' }} style={{ borderRadius: 12, height: '100%', overflow: 'hidden' }}>
                            {/* 面板头部：标题+折叠图标+维度筛选 */}
                            <div style={{ padding: 12, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: 16, fontWeight: 600 }}>{drillTopic}</div>
                              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {(() => {
                                  const headerLabels = {
                                    denom: drillTopic === '加入率' ? '全体学员' : drillTopic === '参与率' ? '已加入学员' : '参与学习学员',
                                    numer: drillTopic === '加入率' ? '已加入学员' : drillTopic === '参与率' ? '参与学习学员' : '获证学员',
                                    other: drillTopic === '加入率' ? '未加入学员' : drillTopic === '参与率' ? '未参与学员' : '未获证学员'
                                  };
                                  return (
                                    <Checkbox.Group
                                      options={[
                                        { value: 'denominator', label: `${headerLabels.denom}` },
                                        { value: 'numerator', label: `${headerLabels.numer}` },
                                        { value: 'other', label: `${headerLabels.other}` }
                                      ]}
                                      value={drillSelection}
                                      onChange={handleDrillSelectionChange}
                                    />
                                  );
                                })()}
                              </div>
                              <Space>
                                <Button size="small" type="text" icon={<DoubleRightOutlined />} onClick={() => setShowDrillPanel(false)} title="折叠" />
                              </Space>
                            </div>
                            {/* 仅右侧区域滚动 */}
                            <div style={{ padding: 16, height: 'calc(100% - 52px)', overflow: 'auto' }}>
                              {/* 移除图示内容，标题已显示统计数字 */}

                              {(() => {
                                const getLabels = (topic) => ({
                                  denom: topic === '加入率' ? '全体学员' : topic === '参与率' ? '已加入学员' : '参与学习学员',
                                  numer: topic === '加入率' ? '已加入学员' : topic === '参与率' ? '参与学习学员' : '获证学员',
                                  other: topic === '加入率' ? '未加入学员' : topic === '参与率' ? '未参与学员' : '未获证学员'
                                });
                                const labels = getLabels(drillTopic);
                                const otherList = drillDenominatorList.filter(d => !drillNumeratorList.some(n => n.id === d.id));
                                const showDen = drillSelection.includes('denominator');
                                const showNum = drillSelection.includes('numerator');
                                const showOther = drillSelection.includes('other');
                                const cols = (Number(showDen) + Number(showNum) + Number(showOther)) <= 1 ? '1fr' : '1fr 1fr';
                                return (
                                  <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12 }}>
                                    {showDen && (
                                      <Card size="small" bodyStyle={{ padding: 12 }} style={{ borderRadius: 10 }}>
                                        <div style={{ fontWeight: 600, marginBottom: 8 }}>{labels.denom}（{drillDenominatorList.length}人）</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                                          {drillDenominatorList.map(item => (
                                            <Card key={`den-${item.id}`} size="small" bodyStyle={{ padding: 8 }} style={{ borderRadius: 8 }}>
                                              <Space>
                                                <Avatar size={20} icon={<UserOutlined />} />
                                                <span style={{ color: '#111827' }}>{item.name}</span>
                                              </Space>
                                            </Card>
                                          ))}
                                        </div>
                                      </Card>
                                    )}
                                    {showNum && (
                                      <Card size="small" bodyStyle={{ padding: 12 }} style={{ borderRadius: 10 }}>
                                        <div style={{ fontWeight: 600, marginBottom: 8 }}>{labels.numer}（{drillNumeratorList.length}人）</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                                          {drillNumeratorList.map(item => (
                                            <Card key={`num-${item.id}`} size="small" bodyStyle={{ padding: 8 }} style={{ borderRadius: 8 }}>
                                              <Space>
                                                <Avatar size={20} icon={<UserOutlined />} />
                                                <span style={{ color: '#111827' }}>{item.name}</span>
                                              </Space>
                                            </Card>
                                          ))}
                                        </div>
                                      </Card>
                                    )}
                                    {showOther && (
                                      <Card size="small" bodyStyle={{ padding: 12 }} style={{ borderRadius: 10 }}>
                                        <div style={{ fontWeight: 600, marginBottom: 8 }}>{labels.other}（{otherList.length}人）</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                                          {otherList.map(item => (
                                            <Card key={`oth-${item.id}`} size="small" bodyStyle={{ padding: 8 }} style={{ borderRadius: 8 }}>
                                              <Space>
                                                <Avatar size={20} icon={<UserOutlined />} />
                                                <span style={{ color: '#111827' }}>{item.name}</span>
                                              </Space>
                                            </Card>
                                          ))}
                                        </div>
                                      </Card>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </Card>
                          {/* 展开按钮（折叠时显示） */}
                          {!showDrillPanel && (
                            <Button type="primary" size="small" icon={<DoubleLeftOutlined />} style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }} onClick={() => setShowDrillPanel(true)} title="展开" />
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ),
            },
            {
              key: 'modules',
              label: (
                <span>
                  <BookOutlined />
                  模块学习情况
                </span>
              ),
              children: (
                <div>
                  {(() => {
                    const planSummary = getLatestPlanSummary();
                    const sourceLabel = planSummary && Array.isArray(planSummary.phases) && planSummary.phases.length ? '方案摘要' : '示例数据';
                    
                    // 顶部来源提示
                    const Header = () => (
                      <div style={{ marginBottom: 8 }}>
                        <Text type="secondary">数据来源：{sourceLabel}</Text>
                      </div>
                    );
                    const participants = dashboardData?.participantsList || [];
                    const totalParticipantsAll = participants.length;
                    const activeAll = participants.filter(p => p.active).length;
                    const certifiedAll = participants.filter(p => p.certified).length;

                    const modulesFromPlan = Array.isArray(planSummary?.phases)
                      ? planSummary.phases.flatMap(ph => (ph.modules || []).map(m => ({ phaseName: ph.name, module: m })))
                      : [];
                    const filtered = modulePhaseFilter === 'all' ? modulesFromPlan : modulesFromPlan.filter(x => String(x.phaseName || '') === String(modulePhaseFilter));
                    const modulesData = filtered.length > 0
                      ? modulesFromPlan.map(({ phaseName, module }) => {
                          const formats = parseFormats(module.format);
                          const fmStats = formats.map((name) => {
                            const stats = trainingAnalyticsService.getFormatStats(name, {
                              totalParticipants: totalParticipantsAll,
                              active: activeAll,
                              certified: certifiedAll
                            });
                            return {
                              key: `${module.title}-${name}`,
                              name,
                              participants: stats.participants,
                              active: stats.active,
                              certified: stats.certified,
                              completionRate: stats.completionRate,
                              avgHours: Number((module.formatConfigs || {})[(module.formatTypeMap || {})[name]]?.arrangedHours ?? 0) || 0,
                              avgScore: stats.avgScore
                            };
                          });
                          return {
                            key: `${phaseName}-${module.title}` || module.title,
                            name: module.title || '模块',
                            formats: fmStats
                          };
                        })
                      : (dashboardData.modulesData || []);

                    const phaseOptions = Array.isArray(planSummary?.phases) ? Array.from(new Set(planSummary.phases.map(ph => ph.name).filter(Boolean))) : [];
                    const HeaderBar = () => (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text type="secondary">数据来源：{sourceLabel}</Text>
                        {phaseOptions.length > 0 && (
                          <Space>
                            <Text type="secondary">阶段筛选：</Text>
                            <Select size="small" value={modulePhaseFilter} onChange={setModulePhaseFilter} style={{ width: 160 }}>
                              <Option value="all">全部阶段</Option>
                              {phaseOptions.map(opt => (<Option key={opt} value={opt}>{opt}</Option>))}
                            </Select>
                          </Space>
                        )}
                      </div>
                    );
                    return (
                      <div style={{ display: 'flex', gap: 16, height: '80vh', overflow: 'hidden', minHeight: 0 }}>
                        {/* 左侧：模块卡片（图形化） */}
                        <div style={{ flex: showModuleDrillPanel ? '0 0 40%' : '1 1 auto', minWidth: 0, transition: 'flex-basis 0.25s ease', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                          <HeaderBar />
                          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}>
                          {modulesData.map((mod) => {
                            const totalParticipants = mod.formats.reduce((acc, f) => acc + (Number(f.participants) || 0), 0);
                            const totalActive = mod.formats.reduce((acc, f) => acc + (Number(f.active) || 0), 0);
                            const totalCertified = mod.formats.reduce((acc, f) => acc + (Number(f.certified) || 0), 0);
                            const participationRate = totalParticipants ? Math.round((totalActive / totalParticipants) * 100) : 0;
                            const certificationRate = totalParticipants ? Math.round((totalCertified / totalParticipants) * 100) : 0;
                            return (
                              <Card key={mod.key} title={mod.name} style={{ marginBottom: 16 }} extra={
                                <Text type="secondary">总参与：{totalActive}/{totalParticipants} ｜ 参与率：{participationRate}% ｜ 获证率：{certificationRate}%</Text>
                              }>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                                  {(mod.formats || []).map((f) => {
                                    const statsPayload = {
                                      participationRate: Math.round((Number(f.active || 0) / Math.max(1, Number(f.participants || 0))) * 100),
                                      completionRate: Number(f.completionRate || 0),
                                      certificationRate: Math.round((Number(f.certified || 0) / Math.max(1, Number(f.participants || 0))) * 100),
                                      avgScore: Number(f.avgScore || 0),
                                      active: Number(f.active || 0),
                                      certified: Number(f.certified || 0),
                                      participants: Number(f.participants || 0)
                                    };
                                    const isSelected = (metric) => moduleSelectedFormat === f.name && moduleDrillMetric === metric;
                                    const wrapStyle = (metric) => isSelected(metric)
                                      ? { padding: 6, borderRadius: 8, background: 'rgba(24,144,255,0.08)', border: '1px solid #1890ff' }
                                      : { padding: 6, borderRadius: 8 };
                                    return (
                                      <div key={f.key} style={{ cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <Text style={{ fontWeight: 600 }}>{f.name}</Text>
                                          <Text type="secondary">学时：{f.avgHours}</Text>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
                                          <div onClick={() => { setModuleDrillMetric('participation'); updateModuleDrill(f.name, statsPayload, totalParticipantsAll); }} style={wrapStyle('participation')}>
                                            <div style={{ fontSize: 12, color: '#6b7280' }}>参与率</div>
                                            <Progress percent={statsPayload.participationRate} size="small" showInfo={false} />
                                          </div>
                                          <div onClick={() => { setModuleDrillMetric('completion'); updateModuleDrill(f.name, statsPayload, totalParticipantsAll); }} style={wrapStyle('completion')}>
                                            <div style={{ fontSize: 12, color: '#6b7280' }}>完成率</div>
                                            <Progress percent={statsPayload.completionRate} size="small" showInfo={false} status="active" />
                                          </div>
                                          <div onClick={() => { setModuleDrillMetric('certification'); updateModuleDrill(f.name, statsPayload, totalParticipantsAll); }} style={wrapStyle('certification')}>
                                            <div style={{ fontSize: 12, color: '#6b7280' }}>获证率</div>
                                            <Progress percent={statsPayload.certificationRate} size="small" showInfo={false} status="success" />
                                          </div>
                                          <div onClick={() => { setModuleDrillMetric('avgScore'); updateModuleDrill(f.name, statsPayload, totalParticipantsAll); }} style={wrapStyle('avgScore')}>
                                            <div style={{ fontSize: 12, color: '#6b7280' }}>平均成绩</div>
                                            <Progress percent={Math.round(statsPayload.avgScore)} size="small" showInfo={false} strokeColor="#8b5cf6" />
                                          </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 12, color: '#64748b' }}>
                                          <span>参与：{f.active || 0}</span>
                                          <span>获证：{f.certified || 0}</span>
                                          <span>总人数：{f.participants || 0}</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </Card>
                            );
                          })}
                          </div>
                        </div>

                        {/* 右侧：模块钻取分栏 */}
                        <div style={{ flex: showModuleDrillPanel ? '0 0 60%' : '0 0 0%', minWidth: showModuleDrillPanel ? 0 : 0, transition: 'flex-basis 0.25s ease, width 0.25s ease', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}>
                          <Card bodyStyle={{ padding: 16, display: showModuleDrillPanel ? 'block' : 'none' }} style={{ borderRadius: 12, flex: 1, minHeight: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <div style={{ fontSize: 16, fontWeight: 600 }}>钻取：{moduleDrill.formatName}（{moduleDrillMetric === 'participation' ? '参与率' : moduleDrillMetric === 'completion' ? '完成率' : moduleDrillMetric === 'certification' ? '获证率' : '平均成绩'}）</div>
                              <Button size="small" type="text" onClick={() => setShowModuleDrillPanel(false)}>折叠</Button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 12 }}>
                              {moduleDrillMetric === 'participation' && (
                                <Card size="small" bodyStyle={{ padding: 12 }}>
                                  <div style={{ fontSize: 12, color: '#6b7280' }}>参与率</div>
                                  <Progress percent={moduleDrill.stats?.participationRate || 0} />
                                </Card>
                              )}
                              {moduleDrillMetric === 'completion' && (
                                <Card size="small" bodyStyle={{ padding: 12 }}>
                                  <div style={{ fontSize: 12, color: '#6b7280' }}>完成率</div>
                                  <Progress percent={moduleDrill.stats?.completionRate || 0} status="active" />
                                </Card>
                              )}
                              {moduleDrillMetric === 'certification' && (
                                <Card size="small" bodyStyle={{ padding: 12 }}>
                                  <div style={{ fontSize: 12, color: '#6b7280' }}>获证率</div>
                                  <Progress percent={moduleDrill.stats?.certificationRate || 0} status="success" />
                                </Card>
                              )}
                              {moduleDrillMetric === 'avgScore' && (
                                <Card size="small" bodyStyle={{ padding: 12 }}>
                                  <div style={{ fontSize: 12, color: '#6b7280' }}>平均成绩</div>
                                  <Progress percent={Math.round(moduleDrill.stats?.avgScore || 0)} strokeColor="#8b5cf6" />
                                </Card>
                              )}
                            </div>
                            {(() => {
                              const denom = (Array.isArray(moduleDrillLists?.all) ? moduleDrillLists.all.length : 0) || Number(moduleDrill.stats?.participants || 0) || 0;
                              let numer = 0;
                              let labels = { denom: '总人数', numer: '分子', other: '差值' };
                              if (moduleDrillMetric === 'participation') {
                                numer = Array.isArray(moduleDrillLists?.active) ? moduleDrillLists.active.length : (Number(moduleDrill.stats?.active || 0) || 0);
                                labels = { denom: '总人数', numer: '参与学习', other: '未参与' };
                              } else if (moduleDrillMetric === 'certification') {
                                numer = Array.isArray(moduleDrillLists?.certified) ? moduleDrillLists.certified.length : (Number(moduleDrill.stats?.certified || 0) || 0);
                                labels = { denom: '总人数', numer: '获证学员', other: '未获证' };
                              } else if (moduleDrillMetric === 'completion') {
                                numer = Math.round(denom * (Number(moduleDrill.stats?.completionRate || 0) / 100));
                                labels = { denom: '总人数', numer: '已完成', other: '未完成' };
                              } else if (moduleDrillMetric === 'avgScore') {
                                numer = Math.round(denom * (Number(moduleDrill.stats?.avgScore || 0) / 100));
                                labels = { denom: '总人数', numer: '成绩达标', other: '未达标' };
                              }
                              const other = Math.max(0, denom - numer);
                              const makeList = (n, prefix) => Array.from({ length: Math.max(0, Number(n) || 0) }, (_, i) => ({ id: `${prefix}-${i+1}`, name: `${prefix}${i+1}` }));
                              const denomList = Array.isArray(moduleDrillLists?.all) && moduleDrillLists.all.length === denom ? moduleDrillLists.all : makeList(denom, '学员');
                              let numerList;
                              if (moduleDrillMetric === 'participation' && Array.isArray(moduleDrillLists?.active)) {
                                numerList = moduleDrillLists.active;
                              } else if (moduleDrillMetric === 'certification' && Array.isArray(moduleDrillLists?.certified)) {
                                numerList = moduleDrillLists.certified;
                              } else {
                                numerList = denomList.slice(0, numer);
                              }
                              const numerIds = new Set((numerList || []).map(i => i.id));
                              const otherList = denomList.filter(i => !numerIds.has(i.id)).slice(0, other);
                              return (
                                <div style={{ height: 'calc(100% - 120px)', overflowY: 'auto', paddingRight: 4 }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <Card size="small" bodyStyle={{ padding: 12 }}>
                                      <div style={{ fontWeight: 600, marginBottom: 8 }}>{labels.denom}（{denom}人）</div>
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                                        {(denomList || []).map(item => (
                                          <Card key={`den-${item.id}`} size="small" bodyStyle={{ padding: 8 }} style={{ borderRadius: 8 }}>
                                            <Space>
                                              <Avatar size={20} icon={<UserOutlined />} />
                                              <span style={{ color: '#111827' }}>{item.name}</span>
                                            </Space>
                                          </Card>
                                        ))}
                                      </div>
                                    </Card>
                                    <Card size="small" bodyStyle={{ padding: 12 }}>
                                      <div style={{ fontWeight: 600, marginBottom: 8 }}>{labels.numer}（{numer}人）</div>
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                                        {(numerList || []).map(item => (
                                          <Card key={`num-${item.id}`} size="small" bodyStyle={{ padding: 8 }} style={{ borderRadius: 8 }}>
                                            <Space>
                                              <Avatar size={20} icon={<UserOutlined />} />
                                              <span style={{ color: '#111827' }}>{item.name}</span>
                                            </Space>
                                          </Card>
                                        ))}
                                      </div>
                                    </Card>
                                    <Card size="small" bodyStyle={{ padding: 12 }}>
                                      <div style={{ fontWeight: 600, marginBottom: 8 }}>{labels.other}（{other}人）</div>
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                                        {(otherList || []).map(item => (
                                          <Card key={`oth-${item.id}`} size="small" bodyStyle={{ padding: 8 }} style={{ borderRadius: 8 }}>
                                            <Space>
                                              <Avatar size={20} icon={<UserOutlined />} />
                                              <span style={{ color: '#111827' }}>{item.name}</span>
                                            </Space>
                                          </Card>
                                        ))}
                                      </div>
                                    </Card>
                                  </div>
                                </div>
                              );
                            })()}
                          </Card>
                          {!showModuleDrillPanel && (
                            <Button type="primary" size="small" style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }} onClick={() => setShowModuleDrillPanel(true)}>展开</Button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )
            },
            {
              key: 'student-status',
              label: (
                <span>
                  <UserOutlined />
                  学员学情
                </span>
              ),
              children: (
                <div>
                  {(() => {
                    const participants = dashboardData?.participantsList || [];
                    const total = participants.length;
                    const joined = participants.filter(p => p.joined);
                    const active = participants.filter(p => p.active);
                    const certified = participants.filter(p => p.certified);
                    const completionRate = Number(dashboardData?.keyMetrics?.completionRate || 0);

                    const getRate = (numer, denom) => (denom ? Math.round((numer / denom) * 100) : 0);
                    const joinRate = getRate(joined.length, total);
                    const participationRate = getRate(active.length, total);
                    const certificationRate = getRate(certified.length, total);
                    const completedCount = Math.round(total * (completionRate / 100));

                    const HeaderBar = () => (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text type="secondary">数据来源：学员清单</Text>
                      </div>
                    );

                    const hashCode = (s) => Array.from(String(s)).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
                    const buildStudentDetails = (student) => {
                      const planSummary = getLatestPlanSummary();
                      // 优先使用方案结构；没有则使用内置模拟结构
                      const modulesFromPlan = Array.isArray(planSummary?.phases)
                        ? planSummary.phases.flatMap(ph => (ph.modules || []).map(m => ({ phaseName: ph.name || '阶段', module: m })))
                        : [];
                      const fallbackModules = [
                        { phaseName: '阶段1', module: { title: '教学基础', format: '直播课程+录播视频+线上研讨' } },
                        { phaseName: '阶段2', module: { title: '课堂技能', format: '示范课观摩+微格教学+实践作业' } },
                        { phaseName: '阶段3', module: { title: '差异化教学', format: '案例研讨+方案设计+反思写作' } }
                      ];
                      const sourceModules = modulesFromPlan.length ? modulesFromPlan : fallbackModules;
                      const details = sourceModules.map(({ phaseName, module }, idx) => {
                        const formats = parseFormats(module.format);
                        const fmDetails = formats.map((name, fIdx) => {
                          // 纯模拟：依据学员id+形式名+索引生成稳定的随机表现
                          const seed = (student.id * 97 + hashCode(name) + idx * 13 + fIdx * 7) % 100;
                          const participated = seed < 85; // 约85%参与
                          const completed = participated ? seed % 100 < 90 : false; // 参与者约90%完成
                          const hasCert = completed ? seed % 100 < 50 : false; // 完成者约50%获证
                          const hours = 3 + ((hashCode(name) + idx + fIdx) % 4); // 3-6学时
                          const scoreBase = 80 + ((hashCode(name) + student.id) % 11) - 5; // 基准80±5
                          const score = Math.max(0, Math.min(100, Math.round(completed ? scoreBase : scoreBase - 15)));
                          return { name, participated, completed, hasCert, hours, score };
                        });
                        return { phaseName, moduleName: module.title || '模块', formats: fmDetails };
                      });
                      setSelectedStudent(student);
                      setStudentModuleDetails(details);
                    };
                    const onSelectStudent = (student) => {
                      setSelectedStudent(student);
                      buildStudentDetails(student);
                      setShowModuleDrillPanel(true);
                    };

                    return (
                      <div style={{ display: 'flex', gap: 16, height: '80vh', overflow: 'hidden', minHeight: 0 }}>
                        {/* 左侧：统计区 */}
                        <div style={{ flex: showModuleDrillPanel ? '0 0 40%' : '1 1 auto', minWidth: 0, transition: 'flex-basis 0.25s ease', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                          <HeaderBar />
                          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}>
                            <Table
                              rowKey={(r) => r.id}
                              columns={[
                                { title: '学员', dataIndex: 'name', key: 'name', width: 120 },
                                { title: '已获成绩', dataIndex: 'score', key: 'score', width: 100 },
                                { title: '已学学时', dataIndex: 'hours', key: 'hours', width: 100 },
                                { title: '学习完成率', dataIndex: 'completionRate', key: 'completionRate', width: 120 },
                                { title: '是否考核达标', dataIndex: 'passed', key: 'passed', width: 120 },
                                { title: '是否获证', dataIndex: 'certifiedLabel', key: 'certifiedLabel', width: 100 },
                                { title: '获证时间', dataIndex: 'certTime', key: 'certTime', width: 160 }
                              ]}
                              dataSource={participants.map(p => {
                                const score = p.active ? (80 + (p.id % 21)) : 0;
                                const hours = p.active ? 10 : 0;
                                const completionRateLabel = p.active ? '100%' : '0%';
                                const passedLabel = p.active ? '是' : '否';
                                const certifiedLabel = p.certified ? '是' : '否';
                                const certTime = p.certified ? dayjs().subtract((p.id % 30), 'day').format('YYYY-MM-DD HH:mm:ss') : '-';
                                return {
                                  ...p,
                                  score,
                                  hours,
                                  completionRate: completionRateLabel,
                                  passed: passedLabel,
                                  certifiedLabel,
                                  certTime
                                };
                              })}
                              pagination={false}
                              onRow={(record) => ({
                                onClick: () => onSelectStudent(record),
                                style: selectedStudent && record.id === selectedStudent.id ? { background: 'rgba(24,144,255,0.08)', border: '1px solid #1890ff' } : {}
                              })}
                            />
                          </div>
                        </div>
                        {/* 右侧：学员钻取详情（每个模块/形式） */}
                        <div style={{ flex: '0 0 60%', minWidth: 0, transition: 'flex-basis 0.25s ease, width 0.25s ease', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}>
                          <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 12, flex: 1, minHeight: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <div style={{ fontSize: 16, fontWeight: 600 }}>学员详情：{selectedStudent?.name || '未选择'}</div>
                            </div>
                            {(studentModuleDetails || []).length === 0 ? (
                              <Empty description="请选择左侧学员查看详情" />
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                                {studentModuleDetails.map((md, i) => (
                                  <Card key={`md-${i}`} title={`${md.moduleName}（${md.phaseName || ''}）`} size="small" bodyStyle={{ padding: 12 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                      {md.formats.map((f) => (
                                        <Card key={`${md.moduleName}-${f.name}`} size="small" bodyStyle={{ padding: 8 }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text style={{ fontWeight: 600 }}>{f.name}</Text>
                                            <Text type="secondary">学时：{f.hours}</Text>
                                          </div>
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 6 }}>
                                            <div><Text type="secondary">参与</Text>：{f.participated ? '是' : '否'}</div>
                                            <div><Text type="secondary">完成</Text>：{f.completed ? '是' : '否'}</div>
                                            <div><Text type="secondary">获证</Text>：{f.hasCert ? '是' : '否'}</div>
                                            <div><Text type="secondary">成绩</Text>：{f.score}</div>
                                          </div>
                                        </Card>
                                      ))}
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </Card>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )
            },
            {
              key: 'analysis',
              label: (
                <span>
                  <LineChartOutlined />
                  数据分析
                </span>
              ),
              children: (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                  {(() => {
                    const participants = dashboardData?.participantsList || [];
                    const total = participants.length;
                    const joined = participants.filter(p => p.joined).length;
                    const active = participants.filter(p => p.active).length;
                    const certified = participants.filter(p => p.certified).length;
                    const avgScore = Number(dashboardData?.keyMetrics?.averageScore || 0);
                    const avgHoursAll = Number(dashboardData?.keyMetrics?.totalHours || 0) / (total || 1);
                    const rate = (n, d) => (d ? Math.round((n / d) * 100) : 0);
                    const joinRate = rate(joined, total);
                    const participationRate = rate(active, total);
                    const certificationRate = rate(certified, active || total);
                    const formats = (dashboardData?.modulesData || []).flatMap(m => 
                      (m.formats || []).map(f => ({
                        module: m.name,
                        format: f.name,
                        participants: Number(f.participants || 0),
                        completionRate: Number(f.completionRate || 0),
                        avgHours: Number(f.avgHours || 0),
                        avgScore: Number(f.avgScore || 0),
                        certified: Number(f.certified || 0)
                      }))
                    );
                    const topFormats = formats.slice().sort((a, b) => b.avgScore - a.avgScore).slice(0, 3);
                    const lowFormats = formats.slice().sort((a, b) => a.avgScore - b.avgScore).slice(0, 3);
                    const narrative = [
                      `本期共 ${total} 名学员参与，加入率 ${joinRate}% ，参与率 ${participationRate}% ，获证率 ${certificationRate}% 。总体平均成绩 ${avgScore} 分，平均学时约 ${Math.round(avgHoursAll * 10) / 10} 小时。`,
                      `从学习形式看，表现较优的形式包括：${topFormats.map(f => `${f.format}（${f.avgScore}分）`).join('、')}；较弱的形式包括：${lowFormats.map(f => `${f.format}（${f.avgScore}分）`).join('、')}。`,
                      `完成率与获证率在不同形式间存在差异，建议结合具体模块目标优化学习形式搭配与学时安排。`
                    ];
                    const suggestions = [
                      { t: '提升参与率', d: `针对参与率 ${participationRate}% 的情况，建议通过班级动员、助教督学和设置必修节点提升参与度。` },
                      { t: '优化弱项形式', d: `对低表现形式${lowFormats.map(f => f.format).join('、')}，增加示范案例与练习反馈，结合同伴互评提高学习效果。` },
                      { t: '证书激励', d: `结合获证率 ${certificationRate}% ，设置阶段性达标激励（如微证书/勋章）提升学员完成与认证意愿。` },
                      { t: '学时结构', d: `将平均学时控制在合理区间，建议高难度模块增加分散学习与短时高频练习，避免疲劳影响成绩。` }
                    ];
                    const hoursScoreData = formats.map(fs => ({ name: fs.format, hours: fs.avgHours, score: fs.avgScore }));
                    const certRateFn = (p, c) => { const denom = Number(p || 0); const numer = Number(c || 0); return denom > 0 ? Math.round((numer / denom) * 100) : 0; };
                    const completionCertData = formats.flatMap(fs => ([{ format: fs.format, metric: '完成率', value: fs.completionRate }, { format: fs.format, metric: '获证率', value: certRateFn(fs.participants, fs.certified) }]));
                    const lineConfig = { data: hoursScoreData, xField: 'hours', yField: 'score', seriesField: 'name', color: ['#1d4ed8', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444'], point: { size: 4 }, smooth: true, xAxis: { title: { text: '平均学时' } }, yAxis: { title: { text: '平均成绩' } } };
                    const barConfig = { data: completionCertData, xField: 'format', yField: 'value', seriesField: 'metric', isGroup: true, color: ['#3b82f6', '#10b981'], label: { position: 'middle' }, xAxis: { label: { autoHide: true, autoRotate: false } }, yAxis: { title: { text: '百分比' } } };
                    const lowPerform = formats.slice().sort((a, b) => a.avgScore - b.avgScore).slice(0, 5);
                    return (
                      <>
                        <Card title="分析总结" bodyStyle={{ padding: 12 }}>
                          <div style={{ display: 'grid', gap: 8 }}>
                            {narrative.map((p, i) => (<Text key={`nl-${i}`}>{p}</Text>))}
                          </div>
                        </Card>
                        <Card title="智能建议" bodyStyle={{ padding: 12 }}>
                          <List
                            dataSource={suggestions}
                            renderItem={(s) => (
                              <List.Item>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                  <Text strong>{s.t}</Text>
                                  <Text type="secondary">{s.d}</Text>
                                </Space>
                              </List.Item>
                            )}
                          />
                        </Card>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                          <Card title="平均学时 vs 平均成绩（按学习形式）" bodyStyle={{ padding: 12 }}>
                            <Line {...lineConfig} />
                          </Card>
                          <Card title="完成率与获证率对比（按学习形式）" bodyStyle={{ padding: 12 }}>
                            <Bar {...barConfig} />
                          </Card>
                          <Card title="低表现形式（按平均成绩）" bodyStyle={{ padding: 12 }} style={{ gridColumn: '1 / span 2' }}>
                            <List
                              dataSource={lowPerform}
                              renderItem={(item, idx) => (
                                <List.Item>
                                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <Space>
                                      <Tag color={idx < 3 ? 'volcano' : 'geekblue'}>{idx + 1}</Tag>
                                      <Text>{item.module}｜{item.format}</Text>
                                    </Space>
                                    <Space>
                                      <Text type="secondary">平均学时</Text>
                                      <Text strong>{item.avgHours}</Text>
                                      <Text type="secondary">平均成绩</Text>
                                      <Text strong>{item.avgScore}</Text>
                                      <Text type="secondary">完成率</Text>
                                      <Text strong>{item.completionRate}%</Text>
                                      <Text type="secondary">获证率</Text>
                                      <Text strong>{certRateFn(item.participants, item.certified)}%</Text>
                                    </Space>
                                  </Space>
                                </List.Item>
                              )}
                            />
                          </Card>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )
            }
          ]}
        />
      </div>
      {/* 模块钻取弹窗已移除，改为右侧分栏展示 */}
    </div>
  );
};

export default TrainingDashboardViewer;
