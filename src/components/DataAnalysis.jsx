import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
  Tag,
  Avatar,
  List,
  Tabs,
  Alert,
  Divider,
  Tooltip
} from 'antd';
import {
  BarChartOutlined,
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  DownloadOutlined,
  EyeOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import './DataAnalysis.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;


const DataAnalysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [activeTab, setActiveTab] = useState('personal');
  const [analysisData, setAnalysisData] = useState(null);

  // 模拟数据
  useEffect(() => {
    const mockData = {
      personal: {
        overview: {
          totalAssessments: 15,
          averageScore: 82.5,
          improvement: 12.3,
          rank: 156,
          totalParticipants: 2340
        },
        abilities: [
          { name: '数字素养', score: 85, level: '良好', trend: 'up', improvement: 8 },
          { name: '信息处理', score: 78, level: '中等', trend: 'up', improvement: 15 },
          { name: '数字创作', score: 90, level: '优秀', trend: 'stable', improvement: 2 },
          { name: '数字沟通', score: 88, level: '良好', trend: 'up', improvement: 10 },
          { name: '数字安全', score: 75, level: '中等', trend: 'down', improvement: -3 },
          { name: '数字伦理', score: 82, level: '良好', trend: 'up', improvement: 6 }
        ],
        recentTests: [
          {
            id: 1,
            name: '数字素养基础测评',
            date: '2024-01-20',
            score: 85,
            duration: 28,
            status: 'completed'
          },
          {
            id: 2,
            name: '信息安全能力测评',
            date: '2024-01-18',
            score: 78,
            duration: 42,
            status: 'completed'
          },
          {
            id: 3,
            name: '数字创作综合测评',
            date: '2024-01-15',
            score: 92,
            duration: 55,
            status: 'completed'
          }
        ],
        weaknesses: [
          {
            area: '网络安全防护',
            score: 65,
            description: '在恶意软件识别和防护方面需要加强',
            suggestions: ['学习常见网络威胁识别', '掌握防病毒软件使用', '了解安全浏览习惯']
          },
          {
            area: '数据分析工具',
            score: 70,
            description: '对Excel高级功能和数据可视化工具掌握不足',
            suggestions: ['学习Excel高级函数', '掌握数据透视表', '了解基础数据可视化']
          }
        ],
        strengths: [
          {
            area: '数字内容创作',
            score: 92,
            description: '在多媒体内容制作方面表现优秀',
            highlights: ['图像编辑熟练', '视频制作能力强', '创意思维活跃']
          },
          {
            area: '在线协作',
            score: 88,
            description: '团队协作和沟通工具使用熟练',
            highlights: ['协作平台使用熟练', '沟通效率高', '团队配合好']
          }
        ]
      },
      regional: {
        overview: {
          totalUsers: 12450,
          averageScore: 76.8,
          completionRate: 89.2,
          activeUsers: 8930
        },
        regions: [
          { name: '北京市', users: 2340, avgScore: 82.5, rank: 1, trend: 'up' },
          { name: '上海市', users: 2180, avgScore: 81.2, rank: 2, trend: 'up' },
          { name: '广东省', users: 1950, avgScore: 79.8, rank: 3, trend: 'stable' },
          { name: '浙江省', users: 1680, avgScore: 78.9, rank: 4, trend: 'up' },
          { name: '江苏省', users: 1590, avgScore: 77.6, rank: 5, trend: 'down' },
          { name: '四川省', users: 1420, avgScore: 75.3, rank: 6, trend: 'up' },
          { name: '湖北省', users: 1290, avgScore: 74.8, rank: 7, trend: 'stable' }
        ],
        abilityDistribution: [
          { ability: '数字素养', excellent: 25, good: 45, average: 25, poor: 5 },
          { ability: '信息处理', excellent: 20, good: 40, average: 30, poor: 10 },
          { ability: '数字创作', excellent: 15, good: 35, average: 35, poor: 15 },
          { ability: '数字沟通', excellent: 30, good: 40, average: 25, poor: 5 },
          { ability: '数字安全', excellent: 18, good: 32, average: 35, poor: 15 },
          { ability: '数字伦理', excellent: 22, good: 38, average: 30, poor: 10 }
        ],
        trends: {
          monthlyGrowth: 15.6,
          scoreImprovement: 8.2,
          participationIncrease: 23.4
        }
      }
    };
    setAnalysisData(mockData);
  }, []);

  // 获取能力等级颜色
  const getLevelColor = (level) => {
    const colors = {
      '优秀': '#52c41a',
      '良好': '#1890ff',
      '中等': '#fa8c16',
      '待提升': '#ff4d4f'
    };
    return colors[level] || '#d9d9d9';
  };

  // 获取趋势图标
  const getTrendIcon = (trend) => {
    if (trend === 'up') return <RiseOutlined style={{ color: '#52c41a' }} />;
    if (trend === 'down') return <FallOutlined style={{ color: '#ff4d4f' }} />;
    return <span style={{ color: '#d9d9d9' }}>—</span>;
  };

  // 渲染个人分析
  const renderPersonalAnalysis = () => {
    if (!analysisData?.personal) return null;

    const { overview, abilities, recentTests, weaknesses, strengths } = analysisData.personal;

    return (
      <div className="personal-analysis">
        {/* 概览统计 */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="测评次数"
                value={overview.totalAssessments}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="平均分数"
                value={overview.averageScore}
                precision={1}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="能力提升"
                value={overview.improvement}
                precision={1}
                suffix="%"
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="排名"
                value={`${overview.rank}/${overview.totalParticipants}`}
                prefix={<StarOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* 能力雷达图 */}
          <Col xs={24} lg={12}>
            <Card title="能力画像分析" className="ability-radar">
              <div className="ability-list">
                {abilities.map((ability, index) => (
                  <div key={index} className="ability-item">
                    <div className="ability-header">
                      <Text strong>{ability.name}</Text>
                      <div className="ability-meta">
                        <Tag color={getLevelColor(ability.level)}>{ability.level}</Tag>
                        {getTrendIcon(ability.trend)}
                        <Text type={ability.improvement > 0 ? 'success' : 'danger'}>
                          {ability.improvement > 0 ? '+' : ''}{ability.improvement}%
                        </Text>
                      </div>
                    </div>
                    <Progress
                      percent={ability.score}
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                      format={percent => `${percent}分`}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* 最近测评记录 */}
          <Col xs={24} lg={12}>
            <Card title="最近测评记录" extra={<Button type="link">查看全部</Button>}>
              <List
                dataSource={recentTests}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          style={{ 
                            backgroundColor: item.score >= 80 ? '#52c41a' : item.score >= 60 ? '#fa8c16' : '#ff4d4f' 
                          }}
                        >
                          {item.score}
                        </Avatar>
                      }
                      title={item.name}
                      description={
                        <Space>
                          <Text type="secondary">{item.date}</Text>
                          <Text type="secondary">用时 {item.duration} 分钟</Text>
                          <Tag color="green">已完成</Tag>
                        </Space>
                      }
                    />
                    <Button type="link" icon={<EyeOutlined />}>查看详情</Button>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          {/* 薄弱环节 */}
          <Col xs={24} lg={12}>
            <Card 
              title="薄弱环节分析" 
              extra={<ExclamationCircleOutlined style={{ color: '#fa8c16' }} />}
            >
              {weaknesses.map((weakness, index) => (
                <div key={index} className="weakness-item">
                  <div className="weakness-header">
                    <Text strong>{weakness.area}</Text>
                    <Tag color="orange">{weakness.score}分</Tag>
                  </div>
                  <Paragraph type="secondary" style={{ fontSize: 12, margin: '8px 0' }}>
                    {weakness.description}
                  </Paragraph>
                  <div className="suggestions">
                    <Text strong style={{ fontSize: 12 }}>改进建议：</Text>
                    <ul style={{ margin: '4px 0', paddingLeft: 16 }}>
                      {weakness.suggestions.map((suggestion, idx) => (
                        <li key={idx} style={{ fontSize: 12, color: '#666' }}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  {index < weaknesses.length - 1 && <Divider />}
                </div>
              ))}
            </Card>
          </Col>

          {/* 优势能力 */}
          <Col xs={24} lg={12}>
            <Card 
              title="优势能力分析" 
              extra={<StarOutlined style={{ color: '#52c41a' }} />}
            >
              {strengths.map((strength, index) => (
                <div key={index} className="strength-item">
                  <div className="strength-header">
                    <Text strong>{strength.area}</Text>
                    <Tag color="green">{strength.score}分</Tag>
                  </div>
                  <Paragraph type="secondary" style={{ fontSize: 12, margin: '8px 0' }}>
                    {strength.description}
                  </Paragraph>
                  <div className="highlights">
                    <Text strong style={{ fontSize: 12 }}>突出表现：</Text>
                    <div style={{ marginTop: 4 }}>
                      {strength.highlights.map((highlight, idx) => (
                        <Tag key={idx} color="green" size="small">{highlight}</Tag>
                      ))}
                    </div>
                  </div>
                  {index < strengths.length - 1 && <Divider />}
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // 渲染区域分析
  const renderRegionalAnalysis = () => {
    if (!analysisData?.regional) return null;

    const { overview, regions, abilityDistribution, trends } = analysisData.regional;

    const regionColumns = [
      {
        title: '排名',
        dataIndex: 'rank',
        key: 'rank',
        width: 80,
        render: (rank) => (
          <Avatar 
            size="small" 
            style={{ 
              backgroundColor: rank <= 3 ? '#gold' : '#1890ff',
              color: 'white'
            }}
          >
            {rank}
          </Avatar>
        )
      },
      {
        title: '地区',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '用户数',
        dataIndex: 'users',
        key: 'users',
        render: (users) => users.toLocaleString()
      },
      {
        title: '平均分',
        dataIndex: 'avgScore',
        key: 'avgScore',
        render: (score) => `${score}分`
      },
      {
        title: '趋势',
        dataIndex: 'trend',
        key: 'trend',
        render: (trend) => getTrendIcon(trend)
      }
    ];

    return (
      <div className="regional-analysis">
        {/* 区域概览 */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="总用户数"
                value={overview.totalUsers}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="平均分数"
                value={overview.averageScore}
                precision={1}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="完成率"
                value={overview.completionRate}
                precision={1}
                suffix="%"
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="活跃用户"
                value={overview.activeUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 发展趋势 */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card title="发展趋势">
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <div className="trend-item">
                    <div className="trend-value">
                      <RiseOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      <Text strong style={{ fontSize: 24, color: '#52c41a' }}>+{trends.monthlyGrowth}%</Text>
                    </div>
                    <Text type="secondary">月度用户增长</Text>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="trend-item">
                    <div className="trend-value">
                      <RiseOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                      <Text strong style={{ fontSize: 24, color: '#1890ff' }}>+{trends.scoreImprovement}%</Text>
                    </div>
                    <Text type="secondary">平均分提升</Text>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="trend-item">
                    <div className="trend-value">
                      <RiseOutlined style={{ color: '#722ed1', marginRight: 8 }} />
                      <Text strong style={{ fontSize: 24, color: '#722ed1' }}>+{trends.participationIncrease}%</Text>
                    </div>
                    <Text type="secondary">参与度增长</Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* 地区排名 */}
          <Col xs={24} lg={12}>
            <Card title="地区排名">
              <Table
                columns={regionColumns}
                dataSource={regions}
                rowKey="name"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>

          {/* 能力分布 */}
          <Col xs={24} lg={12}>
            <Card title="能力水平分布">
              <div className="ability-distribution">
                {abilityDistribution.map((item, index) => (
                  <div key={index} className="distribution-item">
                    <div className="distribution-header">
                      <Text strong>{item.ability}</Text>
                    </div>
                    <div className="distribution-bars">
                      <div className="bar-item">
                        <Text type="secondary" style={{ fontSize: 12 }}>优秀</Text>
                        <Progress 
                          percent={item.excellent} 
                          strokeColor="#52c41a" 
                          size="small"
                          format={percent => `${percent}%`}
                        />
                      </div>
                      <div className="bar-item">
                        <Text type="secondary" style={{ fontSize: 12 }}>良好</Text>
                        <Progress 
                          percent={item.good} 
                          strokeColor="#1890ff" 
                          size="small"
                          format={percent => `${percent}%`}
                        />
                      </div>
                      <div className="bar-item">
                        <Text type="secondary" style={{ fontSize: 12 }}>中等</Text>
                        <Progress 
                          percent={item.average} 
                          strokeColor="#fa8c16" 
                          size="small"
                          format={percent => `${percent}%`}
                        />
                      </div>
                      <div className="bar-item">
                        <Text type="secondary" style={{ fontSize: 12 }}>待提升</Text>
                        <Progress 
                          percent={item.poor} 
                          strokeColor="#ff4d4f" 
                          size="small"
                          format={percent => `${percent}%`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div className="data-analysis">
      {/* 筛选控件 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Space>
              <Text>时间范围：</Text>
              <Select value={selectedPeriod} onChange={setSelectedPeriod} style={{ width: 120 }}>
                <Option value="week">最近一周</Option>
                <Option value="month">最近一月</Option>
                <Option value="quarter">最近一季</Option>
                <Option value="year">最近一年</Option>
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={8}>
            <Space>
              <Text>地区：</Text>
              <Select value={selectedRegion} onChange={setSelectedRegion} style={{ width: 120 }}>
                <Option value="all">全部地区</Option>
                <Option value="beijing">北京市</Option>
                <Option value="shanghai">上海市</Option>
                <Option value="guangdong">广东省</Option>
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={8}>
            <Space>
              <Button type="primary" icon={<DownloadOutlined />}>
                导出报告
              </Button>
              <Button icon={<BarChartOutlined />}>
                生成图表
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 分析内容 */}
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          size="large"
          items={[
            {
              key: 'personal',
              label: (
                <span>
                  <UserOutlined />
                  个人分析
                </span>
              ),
              children: renderPersonalAnalysis()
            },
            {
              key: 'regional',
              label: (
                <span>
                  <TeamOutlined />
                  区域分析
                </span>
              ),
              children: renderRegionalAnalysis()
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default DataAnalysis;