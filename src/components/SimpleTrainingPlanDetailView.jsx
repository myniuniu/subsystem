import React from 'react';
import { Card, Typography, Row, Col, List, Tag, Timeline, Statistic, Table, Avatar, Progress } from 'antd';
import { 
  BookOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  ClockCircleOutlined,
  UserOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const SimpleTrainingPlanDetailView = ({ plan }) => {
  if (!plan) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Text type="secondary">暂无培训方案数据</Text>
      </div>
    );
  }

  // 从培训方案数据中获取课程和参训人员信息
  const courseData = plan?.courseArrangement?.courses || [
    {
      key: '1',
      courseName: '现代教学理论与实践',
      instructor: '张教授',
      duration: '8学时',
      type: '理论课程',
      status: '进行中',
      progress: 75,
      description: '深入学习现代教学理论，掌握有效的教学方法和策略'
    },
    {
      key: '2',
      courseName: '数字化教学工具应用',
      instructor: '李老师',
      duration: '12学时',
      type: '实践课程',
      status: '未开始',
      progress: 0,
      description: '学习使用各种数字化教学工具，提升教学效率'
    },
    {
      key: '3',
      courseName: '课堂管理与学生互动',
      instructor: '王老师',
      duration: '6学时',
      type: '工作坊',
      status: '已完成',
      progress: 100,
      description: '掌握有效的课堂管理技巧，提升师生互动质量'
    },
    {
      key: '4',
      courseName: '教学评价与反思',
      instructor: '陈老师',
      duration: '4学时',
      type: '研讨课',
      status: '未开始',
      progress: 0,
      description: '学习科学的教学评价方法，培养反思性教学习惯'
    }
  ];

  // 从培训方案数据中获取参训人员信息
  const participantData = plan?.participantManagement?.participants || [
    {
      key: '1',
      name: '张三',
      department: '数学系',
      position: '副教授',
      experience: '8年',
      status: '积极参与',
      avatar: null,
      completionRate: 85,
      lastActive: '2024-01-15'
    },
    {
      key: '2',
      name: '李四',
      department: '物理系',
      position: '讲师',
      experience: '5年',
      status: '正常参与',
      avatar: null,
      completionRate: 72,
      lastActive: '2024-01-14'
    },
    {
      key: '3',
      name: '王五',
      department: '化学系',
      position: '教授',
      experience: '15年',
      status: '积极参与',
      avatar: null,
      completionRate: 90,
      lastActive: '2024-01-15'
    },
    {
      key: '4',
      name: '赵六',
      department: '生物系',
      position: '副教授',
      experience: '10年',
      status: '需要关注',
      avatar: null,
      completionRate: 45,
      lastActive: '2024-01-12'
    }
  ];

  // 课程表格列定义
  const courseColumns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
      width: '25%',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.description}</Text>
        </div>
      )
    },
    {
      title: '授课教师',
      dataIndex: 'instructor',
      key: 'instructor',
      width: '15%'
    },
    {
      title: '课程类型',
      dataIndex: 'type',
      key: 'type',
      width: '15%',
      render: (type) => {
        const colors = {
          '理论课程': 'blue',
          '实践课程': 'green',
          '工作坊': 'orange',
          '研讨课': 'purple'
        };
        return <Tag color={colors[type]}>{type}</Tag>;
      }
    },
    {
      title: '学时',
      dataIndex: 'duration',
      key: 'duration',
      width: '10%'
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: '20%',
      render: (progress, record) => (
        <div>
          <Progress percent={progress} size="small" />
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.status}</Text>
        </div>
      )
    }
  ];

  // 参训人员表格列定义
  const participantColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar icon={<UserOutlined />} size="small" />
          <Text strong>{name}</Text>
        </div>
      )
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: '15%'
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: '15%'
    },
    {
      title: '教学经验',
      dataIndex: 'experience',
      key: 'experience',
      width: '15%'
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: '20%',
      render: (rate) => (
        <Progress 
          percent={rate} 
          size="small" 
          strokeColor={rate >= 80 ? '#52c41a' : rate >= 60 ? '#faad14' : '#ff4d4f'}
        />
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      render: (status) => {
        const colors = {
          '积极参与': 'success',
          '正常参与': 'processing',
          '需要关注': 'warning'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      }
    }
  ];

  return (
    <div style={{ 
      padding: '0',
      height: '100%',
      overflow: 'auto'
    }}>
      <Row gutter={[16, 16]} style={{ padding: '16px' }}>
        {/* 基本信息 */}
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOutlined style={{ color: '#1890ff' }} />
                <span>培训方案基本信息</span>
              </div>
            }
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic title="培训主题" value="综合技能提升" />
              </Col>
              <Col span={6}>
                <Statistic title="培训周期" value="8周" />
              </Col>
              <Col span={6}>
                <Statistic title="总学时" value={120} suffix="小时" />
              </Col>
              <Col span={6}>
                <Statistic title="参训人数" value={25} suffix="人" />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 培训课程信息 */}
        <Col span={24}>
          <Card 
            title={<span>培训课程安排</span>}
            size="small"
          >
            <Table 
              columns={courseColumns}
              dataSource={courseData}
              pagination={false}
              size="small"
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>

        {/* 参训人员信息 */}
        <Col span={24}>
          <Card 
            title={<span>参训人员管理</span>}
            size="small"
          >
            <Table 
              columns={participantColumns}
              dataSource={participantData}
              pagination={false}
              size="small"
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>

        {/* 培训目标 */}
        <Col span={12}>
          <Card 
            title={<span>培训目标</span>}
            size="small"
          >
            <List
              size="small"
              dataSource={[
                '提升专业技能水平',
                '增强团队协作能力',
                '培养创新思维',
                '提高工作效率'
              ]}
              renderItem={item => (
                <List.Item>
                  <Text>• {item}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 培训内容 */}
        <Col span={12}>
          <Card 
            title={<span>培训内容</span>}
            size="small"
          >
            <List
              size="small"
              dataSource={[
                '理论知识学习',
                '实践操作训练',
                '案例分析讨论',
                '项目实战演练'
              ]}
              renderItem={item => (
                <List.Item>
                  <Text>• {item}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 培训进度安排 */}
        <Col span={24}>
          <Card 
            title={<span>培训进度安排</span>}
            size="small"
          >
            <Timeline>
              <Timeline.Item color="blue">
                <Text strong>第1-2周：</Text> 基础理论学习
              </Timeline.Item>
              <Timeline.Item color="green">
                <Text strong>第3-4周：</Text> 实践操作训练
              </Timeline.Item>
              <Timeline.Item color="orange">
                <Text strong>第5-6周：</Text> 案例分析与讨论
              </Timeline.Item>
              <Timeline.Item color="red">
                <Text strong>第7-8周：</Text> 项目实战与考核
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>

        {/* 预期成果 */}
        <Col span={24}>
          <Card 
            title="预期培训成果"
            size="small"
          >
            <Row gutter={[16, 8]}>
              <Col span={8}>
                <Tag color="success">技能提升率 ≥ 85%</Tag>
              </Col>
              <Col span={8}>
                <Tag color="processing">考核通过率 ≥ 90%</Tag>
              </Col>
              <Col span={8}>
                <Tag color="warning">满意度 ≥ 95%</Tag>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SimpleTrainingPlanDetailView;