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
  Tree,
  Rate,
  Descriptions,
  Badge
} from 'antd';
import {
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  BookOutlined,
  BulbOutlined,
  StarOutlined,
  AimOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  FireOutlined
} from '@ant-design/icons';
import { Line, Bar, Radar, Heatmap } from '@ant-design/charts';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const EffectEvaluation = () => {
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [evaluationData, setEvaluationData] = useState({});
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);

  // 模拟评估数据
  useEffect(() => {
    const mockData = {
      overview: {
        totalStudents: 156,
        avgScore: 78.5,
        passRate: 89.7,
        excellentRate: 34.6
      },
      knowledgePoints: [
        { name: '数据结构', mastery: 85, difficulty: 'medium', students: 142 },
        { name: '算法设计', mastery: 72, difficulty: 'hard', students: 138 },
        { name: '数据库原理', mastery: 91, difficulty: 'easy', students: 145 },
        { name: '网络编程', mastery: 68, difficulty: 'hard', students: 134 },
        { name: '软件工程', mastery: 79, difficulty: 'medium', students: 140 }
      ],
      abilityDimensions: [
        { dimension: '数智意识与态度', score: 82, maxScore: 100 },
        { dimension: '智能技术理解与应用', score: 75, maxScore: 100 },
        { dimension: '数智化教学设计', score: 68, maxScore: 100 },
        { dimension: '数智伦理与安全', score: 88, maxScore: 100 },
        { dimension: '数智专业学习与发展', score: 73, maxScore: 100 }
      ],
      progressTrend: [
        { month: '2023-09', score: 65 },
        { month: '2023-10', score: 68 },
        { month: '2023-11', score: 72 },
        { month: '2023-12', score: 75 },
        { month: '2024-01', score: 78 }
      ],
      weaknessAnalysis: [
        {
          id: 1,
          student: '张三',
          weakness: '算法复杂度分析',
          score: 45,
          frequency: 8,
          suggestion: '加强时间复杂度和空间复杂度的理论学习'
        },
        {
          id: 2,
          student: '李四',
          weakness: '数据库设计',
          score: 52,
          frequency: 6,
          suggestion: '多练习ER图设计和范式化过程'
        },
        {
          id: 3,
          student: '王五',
          weakness: '网络协议',
          score: 38,
          frequency: 12,
          suggestion: '重点复习TCP/IP协议栈和HTTP协议'
        }
      ],
      studentRanking: [
        { rank: 1, name: '赵一', score: 95, improvement: 8, badge: 'gold' },
        { rank: 2, name: '钱二', score: 92, improvement: 5, badge: 'silver' },
        { rank: 3, name: '孙三', score: 89, improvement: 3, badge: 'bronze' },
        { rank: 4, name: '李四', score: 87, improvement: -2, badge: null },
        { rank: 5, name: '周五', score: 85, improvement: 6, badge: null }
      ],
      heatmapData: [
        { student: '张三', knowledge: '数据结构', score: 85 },
        { student: '张三', knowledge: '算法设计', score: 72 },
        { student: '张三', knowledge: '数据库', score: 91 },
        { student: '李四', knowledge: '数据结构', score: 78 },
        { student: '李四', knowledge: '算法设计', score: 65 },
        { student: '李四', knowledge: '数据库', score: 88 },
        { student: '王五', knowledge: '数据结构', score: 92 },
        { student: '王五', knowledge: '算法设计', score: 89 },
        { student: '王五', knowledge: '数据库', score: 76 }
      ]
    };
    setEvaluationData(mockData);
  }, []);

  // 进步趋势图配置
  const progressConfig = {
    data: evaluationData.progressTrend || [],
    xField: 'month',
    yField: 'score',
    point: {
      size: 5,
      shape: 'diamond',
    },
    smooth: true,
    color: '#52c41a',
    annotations: [
      {
        type: 'line',
        start: ['min', 75],
        end: ['max', 75],
        style: {
          stroke: '#ff4d4f',
          lineDash: [4, 4],
        },
      },
    ],
  };

  // 知识点掌握度柱状图配置
  const knowledgeConfig = {
    data: evaluationData.knowledgePoints || [],
    xField: 'mastery',
    yField: 'name',
    seriesField: 'name',
    color: ({ mastery }) => {
      if (mastery >= 80) return '#52c41a';
      if (mastery >= 60) return '#fa8c16';
      return '#ff4d4f';
    },
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  // 能力维度雷达图配置
  const abilityConfig = {
    data: evaluationData.abilityDimensions || [],
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
      },
    },
    point: {
      size: 2,
    },
    area: {},
  };

  // 知识掌握热力图配置
  const heatmapConfig = {
    data: evaluationData.heatmapData || [],
    xField: 'knowledge',
    yField: 'student',
    colorField: 'score',
    color: ['#174c83', '#7eb6d3', '#f7f7f7', '#f4b942', '#d73027'],
    meta: {
      score: {
        sync: true,
      },
    },
    heatmapStyle: {
      stroke: '#f0f0f0',
      opacity: 0.8,
    },
  };

  // 渲染学生排名
  const renderStudentRanking = () => {
    const ranking = evaluationData.studentRanking || [];
    
    return (
      <Card title="学生排名" className="ranking-card">
        <List
          dataSource={ranking}
          renderItem={(student) => (
            <List.Item
              actions={[
                <Button 
                  type="link" 
                  onClick={() => {
                    setSelectedStudentDetail(student);
                    setDetailModalVisible(true);
                  }}
                >
                  查看详情
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge count={student.rank} style={{ backgroundColor: getRankColor(student.rank) }}>
                    <Avatar 
                      icon={<UserOutlined />} 
                      style={{ backgroundColor: '#1890ff' }}
                    />
                  </Badge>
                }
                title={
                  <Space>
                    <Text strong>{student.name}</Text>
                    {student.badge && (
                      <Tag color={getBadgeColor(student.badge)}>
                        {getBadgeText(student.badge)}
                      </Tag>
                    )}
                  </Space>
                }
                description={
                  <Space>
                    <Text>得分: {student.score}</Text>
                    <Text 
                      type={student.improvement >= 0 ? 'success' : 'danger'}
                    >
                      {student.improvement >= 0 ? <RiseOutlined /> : <FallOutlined />}
                      {Math.abs(student.improvement)}分
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };

  // 渲染薄弱环节分析
  const renderWeaknessAnalysis = () => {
    const weaknesses = evaluationData.weaknessAnalysis || [];
    
    return (
      <Card title="薄弱环节分析" className="weakness-card">
        <List
          dataSource={weaknesses}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={<ExclamationCircleOutlined />} 
                    style={{ backgroundColor: '#ff4d4f' }}
                  />
                }
                title={
                  <Space>
                    <Text strong>{item.student}</Text>
                    <Tag color="error">{item.weakness}</Tag>
                  </Space>
                }
                description={
                  <div>
                    <Space>
                      <Text>得分: {item.score}</Text>
                      <Text>错误频次: {item.frequency}</Text>
                    </Space>
                    <br />
                    <Text type="secondary">{item.suggestion}</Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };

  // 获取排名颜色
  const getRankColor = (rank) => {
    if (rank === 1) return '#faad14';
    if (rank === 2) return '#d9d9d9';
    if (rank === 3) return '#d4b106';
    return '#1890ff';
  };

  // 获取徽章颜色
  const getBadgeColor = (badge) => {
    const colors = {
      'gold': 'gold',
      'silver': 'default',
      'bronze': 'orange'
    };
    return colors[badge] || 'blue';
  };

  // 获取徽章文本
  const getBadgeText = (badge) => {
    const texts = {
      'gold': '金牌',
      'silver': '银牌',
      'bronze': '铜牌'
    };
    return texts[badge] || '';
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty) => {
    const colors = {
      'easy': 'success',
      'medium': 'warning',
      'hard': 'error'
    };
    return colors[difficulty] || 'default';
  };

  // 获取难度文本
  const getDifficultyText = (difficulty) => {
    const texts = {
      'easy': '简单',
      'medium': '中等',
      'hard': '困难'
    };
    return texts[difficulty] || '未知';
  };

  return (
    <div className="effect-evaluation">
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
            <Text strong>学科选择：</Text>
          </Col>
          <Col>
            <Select
              value={selectedSubject}
              onChange={setSelectedSubject}
              style={{ width: 200 }}
            >
              <Option value="all">全部学科</Option>
              <Option value="math">数学</Option>
              <Option value="physics">物理</Option>
              <Option value="chemistry">化学</Option>
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
              value={evaluationData.overview?.totalStudents || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="平均分"
              value={evaluationData.overview?.avgScore || 0}
              precision={1}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="及格率"
              value={evaluationData.overview?.passRate || 0}
              suffix="%"
              precision={1}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="优秀率"
              value={evaluationData.overview?.excellentRate || 0}
              suffix="%"
              precision={1}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="知识掌握度" key="knowledge">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card title="知识点掌握情况" className="chart-card">
                <Bar {...knowledgeConfig} height={300} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="知识点详情" className="knowledge-detail">
                <List
                  dataSource={evaluationData.knowledgePoints || []}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            icon={<BookOutlined />} 
                            style={{ backgroundColor: item.mastery >= 80 ? '#52c41a' : '#fa8c16' }}
                          />
                        }
                        title={
                          <Space>
                            <Text strong>{item.name}</Text>
                            <Tag color={getDifficultyColor(item.difficulty)}>
                              {getDifficultyText(item.difficulty)}
                            </Tag>
                          </Space>
                        }
                        description={
                          <div>
                            <Progress 
                              percent={item.mastery} 
                              size="small" 
                              strokeColor={item.mastery >= 80 ? '#52c41a' : '#fa8c16'}
                            />
                            <Text type="secondary">{item.students}人参与</Text>
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
        
        <TabPane tab="能力维度" key="ability">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="数智素养能力雷达图" className="chart-card">
                <Radar {...abilityConfig} height={400} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="能力维度详情" className="ability-detail">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {(evaluationData.abilityDimensions || []).map((item, index) => (
                    <div key={index}>
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Text strong>{item.dimension}</Text>
                        </Col>
                        <Col>
                          <Text>{item.score}/{item.maxScore}</Text>
                        </Col>
                      </Row>
                      <Progress 
                        percent={(item.score / item.maxScore) * 100} 
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                      />
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="进步趋势" key="progress">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card title="学习效果进步趋势" className="chart-card">
                <Line {...progressConfig} height={300} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              {renderStudentRanking()}
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="薄弱环节" key="weakness">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card title="知识掌握热力图" className="chart-card">
                <Heatmap {...heatmapConfig} height={300} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              {renderWeaknessAnalysis()}
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 学生详情模态框 */}
      <Modal
        title="学生详细评估报告"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button key="export" type="primary">
            导出报告
          </Button>
        ]}
        width={800}
      >
        {selectedStudentDetail && (
          <div>
            <Descriptions title={selectedStudentDetail.name} bordered>
              <Descriptions.Item label="当前排名">
                <Badge count={selectedStudentDetail.rank} style={{ backgroundColor: getRankColor(selectedStudentDetail.rank) }}>
                  第{selectedStudentDetail.rank}名
                </Badge>
              </Descriptions.Item>
              <Descriptions.Item label="总分">{selectedStudentDetail.score}</Descriptions.Item>
              <Descriptions.Item label="进步情况">
                <Text type={selectedStudentDetail.improvement >= 0 ? 'success' : 'danger'}>
                  {selectedStudentDetail.improvement >= 0 ? <RiseOutlined /> : <FallOutlined />}
                  {Math.abs(selectedStudentDetail.improvement)}分
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="学习态度">
                <Rate disabled defaultValue={4} />
              </Descriptions.Item>
              <Descriptions.Item label="参与度">
                <Progress percent={85} size="small" />
              </Descriptions.Item>
              <Descriptions.Item label="完成度">
                <Progress percent={92} size="small" strokeColor="#52c41a" />
              </Descriptions.Item>
            </Descriptions>
            
            <Card title="个人能力分析" style={{ marginTop: 16 }}>
              <Paragraph>
                该学生在数智素养各维度表现均衡，特别在数智意识与态度方面表现突出。
                建议继续保持良好的学习习惯，在智能技术理解与应用方面可以加强实践练习。
              </Paragraph>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EffectEvaluation;