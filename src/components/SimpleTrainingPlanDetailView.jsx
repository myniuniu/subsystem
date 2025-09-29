import React from 'react';
import { Card, Typography, Row, Col, List, Tag, Timeline, Statistic } from 'antd';
import { 
  BookOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  ClockCircleOutlined 
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

        {/* 培训目标 */}
        <Col span={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined style={{ color: '#52c41a' }} />
                <span>培训目标</span>
              </div>
            }
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
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TeamOutlined style={{ color: '#722ed1' }} />
                <span>培训内容</span>
              </div>
            }
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
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                <span>培训进度安排</span>
              </div>
            }
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