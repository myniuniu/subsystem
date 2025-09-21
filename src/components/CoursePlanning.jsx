import React, { useState } from 'react';
import {
  Layout,
  Card,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Tag,
  Avatar,
  Statistic,
  Progress,
  List,
  Badge,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tooltip,
  Tabs
} from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  PlayCircleOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  RobotOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  PlusOutlined,
  SettingOutlined,
  BarChartOutlined,
  StarOutlined,
  BulbOutlined,
  RocketOutlined,
  HeartOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import OrganizationLearning from './OrganizationLearning';
import SelfLearning from './SelfLearning';
import AIAssistantCourse from './AIAssistantCourse';
import MultiGroupScenarios from './MultiGroupScenarios';
import './CoursePlanning.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const CoursePlanning = ({ onBack, onModeSelect }) => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [activeMode, setActiveMode] = useState('overview');
  const [currentGroup, setCurrentGroup] = useState('enterprise');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userProfile] = useState({
    name: '张老师',
    role: '培训管理员',
    department: '人力资源部',
    experience: '5年',
    interests: ['团队管理', '数据分析', '沟通技巧']
  });
  const [learningHistory] = useState([
    { course: 'Python数据分析', progress: 85, completed: false },
    { course: '团队管理基础', progress: 100, completed: true },
    { course: '演讲与表达', progress: 60, completed: false }
  ]);

  // 模拟数据
  const organizationStats = {
    activeTrainings: 12,
    totalParticipants: 1248,
    completionRate: 87,
    avgScore: 92
  };

  const selfLearningStats = {
    personalCourses: 8,
    studyHours: 156,
    completedCourses: 23,
    achievements: 15
  };

  const recentTrainings = [
    {
      id: 1,
      title: '企业安全生产合规培训',
      type: 'organization',
      participants: 156,
      progress: 75,
      status: '进行中',
      category: '企业培训'
    },
    {
      id: 2,
      title: '新课标落地实施指导',
      type: 'organization',
      participants: 89,
      progress: 60,
      status: '进行中',
      category: '教育培训'
    },
    {
      id: 3,
      title: '分层教学技巧提升',
      type: 'self',
      progress: 90,
      status: '即将完成',
      category: '个人学习'
    },
    {
      id: 4,
      title: '手机拍照修图技巧',
      type: 'self',
      progress: 45,
      status: '学习中',
      category: '生活技能'
    }
  ];

  const handleModeSelect = (mode) => {
    setActiveMode(mode);
    message.success(`已切换到${mode === 'organization' ? '组织学习' : mode === 'self' ? '自主学习' : mode === 'ai' ? 'AI助手' : '多群体场景'}模式`);
  };

  const handleGroupChange = (group) => {
    setCurrentGroup(group);
  };

  const handleRecommendationSelect = (recommendation) => {
    message.success(`已将"${recommendation.title}"加入学习计划`);
  };

  const handleScenarioSelect = (scenario) => {
    message.success(`已选择场景："${scenario.title}"`);
  };

  // 统计数据
  const stats = [
    {
      title: '活跃培训',
      value: organizationStats.activeTrainings,
      suffix: '个',
      icon: <BookOutlined />,
      color: '#1890ff'
    },
    {
      title: '参训人数',
      value: organizationStats.totalParticipants,
      suffix: '人',
      icon: <TeamOutlined />,
      color: '#52c41a'
    },
    {
      title: '学习时长',
      value: selfLearningStats.studyHours,
      suffix: '小时',
      icon: <ClockCircleOutlined />,
      color: '#faad14'
    },
    {
      title: '完成率',
      value: organizationStats.completionRate,
      suffix: '%',
      icon: <TrophyOutlined />,
      color: '#eb2f96'
    }
  ];

  const renderOverview = () => (
    <div>
      {/* 欢迎横幅 */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          marginBottom: 24,
          border: 'none'
        }}
      >
        <Row align="middle">
          <Col span={18}>
            <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
              配课模块 - 智能学习资源配置中心
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginBottom: 16 }}>
              连接培训需求与学习资源的核心枢纽，支持组织学习与自主学习双模式
            </Paragraph>
            <Space size="large">
              <Button
                type="primary"
                size="large"
                icon={<RocketOutlined />}
                onClick={() => handleModeSelect('organization')}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'white' }}
              >
                开始组织学习
              </Button>
              <Button
                size="large"
                icon={<HeartOutlined />}
                onClick={() => handleModeSelect('self')}
                style={{ color: 'white', borderColor: 'white', backgroundColor: 'transparent' }}
              >
                自主学习探索
              </Button>
            </Space>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 48, opacity: 0.3 }}>
              <BookOutlined />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 核心功能模式 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card
            hoverable
            className="mode-card organization-mode"
            onClick={() => handleModeSelect('organization')}
            style={{ height: 280 }}
          >
            <div className="mode-content">
              <Avatar
                size={64}
                style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
                icon={<TeamOutlined />}
              />
              <Title level={3}>组织学习模式</Title>
              <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                围绕培训需求主题，实现需求-资源-人群的精准匹配，保障组织培训目标落地
              </Paragraph>
              <div className="feature-tags">
                <Tag color="blue">培训主题管理</Tag>
                <Tag color="blue">资源库配置</Tag>
                <Tag color="blue">人群精准分配</Tag>
                <Tag color="blue">效果跟踪分析</Tag>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card
            hoverable
            className="mode-card self-mode"
            onClick={() => handleModeSelect('self')}
            style={{ height: 280 }}
          >
            <div className="mode-content">
              <Avatar
                size={64}
                style={{ backgroundColor: '#52c41a', marginBottom: 16 }}
                icon={<UserOutlined />}
              />
              <Title level={3}>自主学习模式</Title>
              <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                支持用户围绕自定义主题，自主组合资源、生成学习路径，满足个性化兴趣需求
              </Paragraph>
              <div className="feature-tags">
                <Tag color="green">个性化推荐</Tag>
                <Tag color="green">自定义路径</Tag>
                <Tag color="green">兴趣主题</Tag>
                <Tag color="green">学习社区</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* AI赋能与多群体场景 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card
            hoverable
            className="mode-card ai-mode"
            onClick={() => handleModeSelect('ai')}
            style={{ height: 240 }}
          >
            <div className="mode-content">
              <Avatar
                size={56}
                style={{ backgroundColor: '#722ed1', marginBottom: 16 }}
                icon={<RobotOutlined />}
              />
              <Title level={4}>AI智能助手</Title>
              <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                通过AI赋能简化配课流程，自动推荐资源、智能生成路径，提升配课效率
              </Paragraph>
              <div className="feature-tags">
                <Tag color="purple">智能推荐</Tag>
                <Tag color="purple">路径生成</Tag>
                <Tag color="purple">效果分析</Tag>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card
            hoverable
            className="mode-card scenarios-mode"
            onClick={() => handleModeSelect('scenarios')}
            style={{ height: 240 }}
          >
            <div className="mode-content">
              <Avatar
                size={56}
                style={{ backgroundColor: '#fa8c16', marginBottom: 16 }}
                icon={<GlobalOutlined />}
              />
              <Title level={4}>多群体场景</Title>
              <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                适配企业培训、教育教学、老年学习、家长教育等差异化学习场景
              </Paragraph>
              <div className="feature-tags">
                <Tag color="orange">企业培训</Tag>
                <Tag color="orange">教育教学</Tag>
                <Tag color="orange">老年学习</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 统计数据 */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col key={index} xs={12} sm={6}>
            <Card className="stat-card">
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <div className="course-planning-container">
      <div className="course-planning-header">
        <Space>
          <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <Title level={2} style={{ margin: 0 }}>配课模块</Title>
        </Space>
        
        <Space>
          <Tabs
            activeKey={activeMode}
            onChange={setActiveMode}
            items={[
              { key: 'overview', label: '总览', icon: <BarChartOutlined /> },
              { key: 'organization', label: '组织学习', icon: <TeamOutlined /> },
              { key: 'self', label: '自主学习', icon: <UserOutlined /> },
              { key: 'ai', label: 'AI助手', icon: <RobotOutlined /> },
              { key: 'scenarios', label: '多群体场景', icon: <GlobalOutlined /> }
            ]}
          />
        </Space>
      </div>

      <div className="course-planning-content">
        {activeMode === 'overview' && renderOverview()}
        {activeMode === 'organization' && (
          <OrganizationLearning 
            currentGroup={currentGroup}
            onGroupChange={handleGroupChange}
          />
        )}
        {activeMode === 'self' && (
          <SelfLearning 
            userProfile={userProfile}
            learningHistory={learningHistory}
          />
        )}
        {activeMode === 'ai' && (
          <AIAssistantCourse
            userProfile={userProfile}
            learningHistory={learningHistory}
            onRecommendationSelect={handleRecommendationSelect}
          />
        )}
        {activeMode === 'scenarios' && (
          <MultiGroupScenarios
            currentGroup={currentGroup}
            onGroupChange={handleGroupChange}
            onScenarioSelect={handleScenarioSelect}
          />
        )}
      </div>
    </div>
  );
};

export default CoursePlanning;