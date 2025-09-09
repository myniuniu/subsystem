import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Tag,
  Progress,
  Descriptions,
  List,
  Space,
  Button,
  Select,
  Input,
  Modal,
  Tabs,
  Timeline,
  Alert,
  Badge,
  Rate,
  Tooltip,
  Divider,
  Statistic
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  HeartOutlined,
  BulbOutlined,
  AimOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  StarOutlined,
  FireOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  EditOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  CalendarOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Radar, Gauge, Column, Pie } from '@ant-design/charts';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const { Search } = Input;

const StudentProfile = () => {
  const [selectedStudent, setSelectedStudent] = useState('student1');
  const [studentList, setStudentList] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // 模拟学生列表和画像数据
  useEffect(() => {
    const mockStudentList = [
      { id: 'student1', name: '张三', class: '计算机1班', avatar: null },
      { id: 'student2', name: '李四', class: '计算机1班', avatar: null },
      { id: 'student3', name: '王五', class: '计算机2班', avatar: null },
      { id: 'student4', name: '赵六', class: '计算机2班', avatar: null }
    ];
    setStudentList(mockStudentList);

    const mockProfileData = {
      student1: {
        basicInfo: {
          name: '张三',
          studentId: '2021001',
          class: '计算机科学与技术1班',
          grade: '2021级',
          email: 'zhangsan@example.com',
          phone: '138****1234',
          enrollDate: '2021-09-01'
        },
        learningPreferences: {
          preferredTime: ['上午', '晚上'],
          preferredResources: ['视频教程', 'PDF文档'],
          learningStyle: '视觉型',
          studyHabits: ['做笔记', '反复练习'],
          interactionLevel: 'high'
        },
        knowledgeMap: [
          { subject: '数据结构', mastery: 85, level: '熟练' },
          { subject: '算法设计', mastery: 72, level: '良好' },
          { subject: '数据库原理', mastery: 91, level: '精通' },
          { subject: '操作系统', mastery: 68, level: '良好' },
          { subject: '计算机网络', mastery: 76, level: '良好' },
          { subject: '软件工程', mastery: 82, level: '熟练' }
        ],
        abilityRadar: [
          { dimension: '数智意识与态度', score: 82 },
          { dimension: '智能技术理解与应用', score: 75 },
          { dimension: '数智化教学设计', score: 68 },
          { dimension: '数智伦理与安全', score: 88 },
          { dimension: '数智专业学习与发展', score: 73 }
        ],
        riskWarnings: [
          {
            id: 1,
            type: 'warning',
            level: 'medium',
            message: '算法设计课程进度落后',
            suggestion: '建议加强算法基础练习',
            date: '2024-01-15'
          },
          {
            id: 2,
            type: 'info',
            level: 'low',
            message: '学习时间分布不均',
            suggestion: '建议制定更规律的学习计划',
            date: '2024-01-14'
          }
        ],
        learningStats: {
          totalHours: 156,
          completedCourses: 8,
          avgScore: 78.5,
          rank: 15,
          totalStudents: 120,
          streak: 7
        },
        recentActivities: [
          {
            date: '2024-01-15',
            activity: '完成数据结构作业',
            score: 85,
            type: 'assignment'
          },
          {
            date: '2024-01-14',
            activity: '参与算法设计讨论',
            score: null,
            type: 'discussion'
          },
          {
            date: '2024-01-13',
            activity: '观看数据库视频教程',
            score: null,
            type: 'study'
          },
          {
            date: '2024-01-12',
            activity: '提交软件工程项目',
            score: 92,
            type: 'project'
          }
        ],
        achievements: [
          { name: '学习达人', description: '连续学习7天', icon: 'fire', date: '2024-01-15' },
          { name: '讨论积极分子', description: '参与讨论50次', icon: 'message', date: '2024-01-10' },
          { name: '作业小能手', description: '按时完成所有作业', icon: 'trophy', date: '2024-01-08' }
        ]
      }
    };
    setProfileData(mockProfileData);
  }, []);

  const currentProfile = profileData[selectedStudent] || {};

  // 能力雷达图配置
  const radarConfig = {
    data: currentProfile.abilityRadar || [],
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
    },
    yAxis: {
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
    point: {
      size: 2,
    },
    area: {},
    color: '#1890ff'
  };

  // 知识掌握度仪表盘配置
  const gaugeConfig = {
    percent: (currentProfile.learningStats?.avgScore || 0) / 100,
    color: {
      range: ['#FF6B3B', '#C23531'],
      rangeColor: ['#FFE58F', '#FFEC3D', '#87BB3F', '#1890FF'],
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    statistic: {
      content: {
        style: {
          fontSize: '36px',
          lineHeight: '36px',
        },
      },
    },
  };

  // 知识点掌握柱状图配置
  const knowledgeConfig = {
    data: currentProfile.knowledgeMap || [],
    xField: 'mastery',
    yField: 'subject',
    seriesField: 'subject',
    color: ({ mastery }) => {
      if (mastery >= 85) return '#52c41a';
      if (mastery >= 70) return '#1890ff';
      if (mastery >= 60) return '#fa8c16';
      return '#ff4d4f';
    },
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.8,
      },
    },
  };

  // 渲染基本信息
  const renderBasicInfo = () => {
    const info = currentProfile.basicInfo || {};
    
    return (
      <Card title="基本信息" className="basic-info-card">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            <Avatar size={120} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
            <div style={{ marginTop: 16 }}>
              <Title level={4}>{info.name}</Title>
              <Text type="secondary">{info.studentId}</Text>
            </div>
          </Col>
          <Col xs={24} sm={16}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="班级">{info.class}</Descriptions.Item>
              <Descriptions.Item label="年级">{info.grade}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{info.email}</Descriptions.Item>
              <Descriptions.Item label="电话">{info.phone}</Descriptions.Item>
              <Descriptions.Item label="入学时间">{info.enrollDate}</Descriptions.Item>
              <Descriptions.Item label="学习天数">
                <Badge count={currentProfile.learningStats?.streak || 0} style={{ backgroundColor: '#52c41a' }}>
                  <Text>连续学习</Text>
                </Badge>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    );
  };

  // 渲染学习偏好
  const renderLearningPreferences = () => {
    const preferences = currentProfile.learningPreferences || {};
    
    return (
      <Card title="学习偏好" className="preferences-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>偏好学习时间：</Text>
              <div style={{ marginTop: 8 }}>
                {(preferences.preferredTime || []).map(time => (
                  <Tag key={time} color="blue">{time}</Tag>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>偏好资源类型：</Text>
              <div style={{ marginTop: 8 }}>
                {(preferences.preferredResources || []).map(resource => (
                  <Tag key={resource} color="green">{resource}</Tag>
                ))}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>学习风格：</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color="purple">{preferences.learningStyle}</Tag>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>学习习惯：</Text>
              <div style={{ marginTop: 8 }}>
                {(preferences.studyHabits || []).map(habit => (
                  <Tag key={habit} color="orange">{habit}</Tag>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  // 渲染风险预警
  const renderRiskWarnings = () => {
    const warnings = currentProfile.riskWarnings || [];
    
    return (
      <Card title="学习风险预警" className="risk-warnings-card">
        <List
          dataSource={warnings}
          renderItem={(warning) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={<WarningOutlined />} 
                    style={{ 
                      backgroundColor: warning.level === 'high' ? '#ff4d4f' : 
                                     warning.level === 'medium' ? '#fa8c16' : '#52c41a'
                    }}
                  />
                }
                title={
                  <Space>
                    <Text strong>{warning.message}</Text>
                    <Tag color={warning.level === 'high' ? 'error' : warning.level === 'medium' ? 'warning' : 'success'}>
                      {warning.level === 'high' ? '高风险' : warning.level === 'medium' ? '中风险' : '低风险'}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <Paragraph>{warning.suggestion}</Paragraph>
                    <Text type="secondary">{warning.date}</Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };

  // 渲染学习统计
  const renderLearningStats = () => {
    const stats = currentProfile.learningStats || {};
    
    return (
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="学习时长"
              value={stats.totalHours}
              suffix="小时"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="完成课程"
              value={stats.completedCourses}
              suffix="门"
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="平均分"
              value={stats.avgScore}
              precision={1}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="班级排名"
              value={`${stats.rank}/${stats.totalStudents}`}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  // 渲染最近活动
  const renderRecentActivities = () => {
    const activities = currentProfile.recentActivities || [];
    
    return (
      <Card title="最近活动" className="activities-card">
        <Timeline>
          {activities.map((activity, index) => (
            <Timeline.Item
              key={index}
              dot={getActivityIcon(activity.type)}
              color={getActivityColor(activity.type)}
            >
              <div>
                <Text strong>{activity.activity}</Text>
                {activity.score && (
                  <Tag color="success" style={{ marginLeft: 8 }}>得分: {activity.score}</Tag>
                )}
                <br />
                <Text type="secondary">{activity.date}</Text>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    );
  };

  // 渲染成就徽章
  const renderAchievements = () => {
    const achievements = currentProfile.achievements || [];
    
    return (
      <Card title="成就徽章" className="achievements-card">
        <Row gutter={[16, 16]}>
          {achievements.map((achievement, index) => (
            <Col xs={24} sm={8} key={index}>
              <Card size="small" className="achievement-item">
                <div style={{ textAlign: 'center' }}>
                  <Avatar 
                    size={48} 
                    icon={getAchievementIcon(achievement.icon)} 
                    style={{ backgroundColor: '#faad14', marginBottom: 8 }}
                  />
                  <div>
                    <Text strong>{achievement.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {achievement.description}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '10px' }}>
                      {achievement.date}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    );
  };

  // 获取活动图标
  const getActivityIcon = (type) => {
    const icons = {
      'assignment': <EditOutlined />,
      'discussion': <TeamOutlined />,
      'study': <BookOutlined />,
      'project': <BulbOutlined />
    };
    return icons[type] || <CheckCircleOutlined />;
  };

  // 获取活动颜色
  const getActivityColor = (type) => {
    const colors = {
      'assignment': 'blue',
      'discussion': 'green',
      'study': 'orange',
      'project': 'purple'
    };
    return colors[type] || 'blue';
  };

  // 获取成就图标
  const getAchievementIcon = (icon) => {
    const icons = {
      'fire': <FireOutlined />,
      'message': <TeamOutlined />,
      'trophy': <TrophyOutlined />
    };
    return icons[icon] || <StarOutlined />;
  };

  // 筛选学生列表
  const filteredStudents = studentList.filter(student => 
    student.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.class.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="student-profile">
      {/* 学生选择 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8}>
            <Search
              placeholder="搜索学生姓名或班级"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Select
              value={selectedStudent}
              onChange={setSelectedStudent}
              style={{ width: '100%' }}
              placeholder="选择学生"
            >
              {filteredStudents.map(student => (
                <Option key={student.id} value={student.id}>
                  {student.name} - {student.class}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Space>
              <Button icon={<EditOutlined />} onClick={() => setEditModalVisible(true)}>
                编辑画像
              </Button>
              <Button icon={<DownloadOutlined />}>
                导出报告
              </Button>
              <Button icon={<ShareAltOutlined />}>
                分享
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 学生画像内容 */}
      {currentProfile.basicInfo && (
        <>
          {/* 基本信息和学习统计 */}
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              {renderBasicInfo()}
            </Col>
            <Col xs={24} lg={12}>
              <Card title="学习统计">
                {renderLearningStats()}
              </Card>
            </Col>
          </Row>

          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              {
                key: 'knowledge',
                label: '知识图谱',
                children: (
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                      <Card title="知识点掌握情况" className="chart-card">
                        <Column {...knowledgeConfig} height={300} />
                      </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                      <Card title="整体掌握度" className="chart-card">
                        <Gauge {...gaugeConfig} height={300} />
                      </Card>
                    </Col>
                  </Row>
                )
              },
              {
                key: 'ability',
                label: '能力雷达',
                children: (
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                      <Card title="数智素养能力雷达图" className="chart-card">
                        <Radar {...radarConfig} height={400} />
                      </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                      {renderLearningPreferences()}
                    </Col>
                  </Row>
                )
              },
              {
                key: 'activities',
                label: '学习轨迹',
                children: (
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                      {renderRecentActivities()}
                    </Col>
                    <Col xs={24} lg={8}>
                      {renderAchievements()}
                    </Col>
                  </Row>
                )
              },
              {
                key: 'warnings',
                label: '风险预警',
                children: (
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                      {renderRiskWarnings()}
                    </Col>
                    <Col xs={24} lg={8}>
                      <Alert
                        message="预警说明"
                        description="系统根据学习行为、成绩变化、参与度等多维度数据，自动识别可能存在学习困难的学生，并提供相应的干预建议。"
                        type="info"
                        showIcon
                      />
                    </Col>
                  </Row>
                )
              }
            ]}
          />
        </>
      )}

      {/* 编辑画像模态框 */}
      <Modal
        title="编辑学生画像"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary">
            保存
          </Button>
        ]}
        width={600}
      >
        <Alert
          message="画像编辑"
          description="可以手动调整学生的学习偏好、标签等信息，系统会结合数据分析结果进行综合评估。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Paragraph>编辑功能开发中...</Paragraph>
      </Modal>
    </div>
  );
};

export default StudentProfile;