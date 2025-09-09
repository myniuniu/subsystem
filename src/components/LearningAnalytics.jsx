import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Row,
  Col,
  Statistic,
  Progress,
  Typography,
  Space,
  Button,
  Badge,
  Avatar,
  List,
  Tag,
  Alert,
  Divider
} from 'antd';
import {
  DatabaseOutlined,
  BarChartOutlined,
  TrophyOutlined,
  UserOutlined,
  BulbOutlined,
  BookOutlined,
  LineChartOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import DataCollection from './DataCollection';
import BehaviorAnalysis from './BehaviorAnalysis';
import EffectEvaluation from './EffectEvaluation';
import StudentProfile from './StudentProfile';
import TeachingSupport from './TeachingSupport';
import ReflectionImprovement from './ReflectionImprovement';
import './LearningAnalytics.css';

const { Title, Text, Paragraph } = Typography;

const LearningAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [platformStats, setPlatformStats] = useState({
    totalStudents: 1248,
    activeStudents: 892,
    dataPoints: 156789,
    analysisReports: 324,
    interventions: 89,
    improvements: 156
  });

  // 模拟数据加载
  useEffect(() => {
    // 这里可以添加实际的数据获取逻辑
  }, []);

  // 渲染平台概览
  const renderOverview = () => (
    <div className="analytics-overview">
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="overview-card">
            <Statistic
              title="学生总数"
              value={platformStats.totalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="overview-card">
            <Statistic
              title="活跃学生"
              value={platformStats.activeStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress
              percent={Math.round((platformStats.activeStudents / platformStats.totalStudents) * 100)}
              size="small"
              strokeColor="#52c41a"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="overview-card">
            <Statistic
              title="数据采集点"
              value={platformStats.dataPoints}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="overview-card">
            <Statistic
              title="分析报告"
              value={platformStats.analysisReports}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="overview-card">
            <Statistic
              title="教学干预"
              value={platformStats.interventions}
              prefix={<BulbOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="overview-card">
            <Statistic
              title="教学改进"
              value={platformStats.improvements}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="平台功能模块" className="feature-card">
            <List
              dataSource={[
                {
                  title: '数据采集与整合',
                  description: '多源数据自动采集、清洗和标准化处理',
                  icon: <DatabaseOutlined />,
                  status: 'active'
                },
                {
                  title: '学习行为分析',
                  description: '深度分析学习时长、路径和互动模式',
                  icon: <LineChartOutlined />,
                  status: 'active'
                },
                {
                  title: '学习效果评估',
                  description: '多维度评估知识掌握和能力发展',
                  icon: <TrophyOutlined />,
                  status: 'active'
                }
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={item.icon} style={{ backgroundColor: '#1890ff' }} />}
                    title={<Text strong>{item.title}</Text>}
                    description={item.description}
                  />
                  <Badge status={item.status === 'active' ? 'success' : 'default'} text={item.status === 'active' ? '运行中' : '待启用'} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="核心价值" className="value-card">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div className="value-item">
                <CheckCircleOutlined className="value-icon" style={{ color: '#52c41a' }} />
                <div>
                  <Text strong>数据驱动决策</Text>
                  <br />
                  <Text type="secondary">基于真实学习数据，支持精准教学决策</Text>
                </div>
              </div>
              <div className="value-item">
                <CheckCircleOutlined className="value-icon" style={{ color: '#1890ff' }} />
                <div>
                  <Text strong>个性化支持</Text>
                  <br />
                  <Text type="secondary">为每位学生提供个性化学习建议和支持</Text>
                </div>
              </div>
              <div className="value-item">
                <CheckCircleOutlined className="value-icon" style={{ color: '#722ed1' }} />
                <div>
                  <Text strong>教学质量提升</Text>
                  <br />
                  <Text type="secondary">持续优化教学策略，提升整体教学效果</Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="learning-analytics">
      <div className="analytics-header">
        <Title level={2}>
          <BarChartOutlined className="header-icon" />
          学情分析平台
        </Title>
        <Paragraph>
          通过收集、整合、分析学生的学习数据，为教师提供全面、精准的学生学习情况洞察，
          支持个性化教学、精准干预和教学改进。
        </Paragraph>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="analytics-tabs"
        tabPosition="top"
        items={[
          {
            key: 'overview',
            label: (
              <span>
                <BarChartOutlined />
                平台概览
              </span>
            ),
            children: renderOverview()
          },
          {
            key: 'data-collection',
            label: (
              <span>
                <DatabaseOutlined />
                数据采集与整合
              </span>
            ),
            children: <DataCollection />
          },
          {
            key: 'behavior-analysis',
            label: (
              <span>
                <LineChartOutlined />
                学习行为分析
              </span>
            ),
            children: <BehaviorAnalysis />
          },
          {
            key: 'effect-evaluation',
            label: (
              <span>
                <TrophyOutlined />
                学习效果评估
              </span>
            ),
            children: <EffectEvaluation />
          },
          {
            key: 'student-profile',
            label: (
              <span>
                <UserOutlined />
                个性化学习画像
              </span>
            ),
            children: <StudentProfile />
          },
          {
            key: 'teaching-support',
            label: (
              <span>
                <BulbOutlined />
                教学建议与干预
              </span>
            ),
            children: <TeachingSupport />
          },
          {
            key: 'reflection-improvement',
            label: (
              <span>
                <BookOutlined />
                教学反思与改进
              </span>
            ),
            children: <ReflectionImprovement />
          }
        ]}
      />
    </div>
  );
};

export default LearningAnalytics;