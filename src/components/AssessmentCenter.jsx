import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Typography,
  Progress,
  Tag,
  Avatar,
  List,
  Badge
} from 'antd';
import {
  BarChartOutlined,
  UserOutlined,
  BookOutlined,
  RocketOutlined,
  TrophyOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StarOutlined,
  BulbOutlined,
  EditOutlined
} from '@ant-design/icons';
import QuestionBankManager from './QuestionBankManager';
import OnlineAssessment from './OnlineAssessment';
import DataAnalysis from './DataAnalysis';
import PersonalizedRecommendation from './PersonalizedRecommendation';
import './AssessmentCenter.css';

const { Title, Text } = Typography;


const AssessmentCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [assessmentStats] = useState({
    totalQuestions: 1250,
    activeAssessments: 8,
    completedAssessments: 342,
    averageScore: 78.5
  });

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <BarChartOutlined />
          概览
        </span>
      ),
      children: (
        <div className="assessment-overview">
          <Row gutter={[24, 24]} className="stats-row">
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <Statistic
                  title="题库总量"
                  value={assessmentStats.totalQuestions}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <Statistic
                  title="进行中测评"
                  value={assessmentStats.activeAssessments}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <Statistic
                  title="已完成测评"
                  value={assessmentStats.completedAssessments}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <Statistic
                  title="平均分数"
                  value={assessmentStats.averageScore}
                  precision={1}
                  prefix={<UserOutlined />}
                  suffix="分"
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="feature-cards">
            <Col xs={24} lg={12}>
              <Card 
                className="feature-card"
                title="快速开始"
                extra={<EditOutlined />}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Button type="primary" size="large" block>
                    创建新测评
                  </Button>
                  <Button size="large" block>
                    管理题库
                  </Button>
                  <Button size="large" block>
                    查看报告
                  </Button>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                className="feature-card"
                title="系统功能"
                extra={<BulbOutlined />}
              >
                <div className="feature-list">
                  <div className="feature-item">
                    <BookOutlined className="feature-icon" />
                    <div>
                      <Text strong>智能题库管理</Text>
                      <br />
                      <Text type="secondary">多维度题目分类，智能难度评估</Text>
                    </div>
                  </div>
                  <div className="feature-item">
                    <EditOutlined className="feature-icon" />
                    <div>
                      <Text strong>在线测评系统</Text>
                      <br />
                      <Text type="secondary">多题型支持，自动判卷评分</Text>
                    </div>
                  </div>
                  <div className="feature-item">
                    <BarChartOutlined className="feature-icon" />
                    <div>
                      <Text strong>数据分析诊断</Text>
                      <br />
                      <Text type="secondary">个人画像，区域分析报告</Text>
                    </div>
                  </div>
                  <div className="feature-item">
                    <BulbOutlined className="feature-icon" />
                    <div>
                      <Text strong>个性化推荐</Text>
                      <br />
                      <Text type="secondary">智能学习路径，资源推荐</Text>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'questionBank',
      label: (
        <span>
          <BookOutlined />
          题库管理
        </span>
      ),
      children: <QuestionBankManager />
    },
    {
      key: 'assessment',
      label: (
        <span>
          <EditOutlined />
          在线测评
        </span>
      ),
      children: <OnlineAssessment />
    },
    {
      key: 'analysis',
      label: (
        <span>
          <BarChartOutlined />
          数据分析
        </span>
      ),
      children: <DataAnalysis />
    },
    {
      key: 'recommendation',
      label: (
        <span>
          <BulbOutlined />
          个性化推荐
        </span>
      ),
      children: <PersonalizedRecommendation />
    }
  ];

  return (
    <div className="assessment-center">
      <div className="assessment-header">
        <Title level={2}>
          <TrophyOutlined className="header-icon" />
          能力测评与诊断中心
        </Title>
        <Text type="secondary">
          提供全面的数智素养能力测评工具，生成个人和区域数字画像，提供诊断报告和个性化学习建议
        </Text>
      </div>

      <Card className="assessment-content">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default AssessmentCenter;