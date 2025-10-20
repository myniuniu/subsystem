import React from 'react';
import { Button, Typography, Card, Row, Col, Statistic, List, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS } from '../../constants/noteEditConstants';

const ClassroomBehaviorAnalysisViewer = ({ sourceInfo, setRightPanelView }) => {
  const metrics = {
    activity: 76, // 活跃度
    participation: 68, // 参与度
    focus: 82, // 专注度
    disciplineEvents: 5 // 纪律事件数
  };

  const events = [
    { id: 'evt_001', time: '09:10', student: '张三', type: '回答问题', sentiment: 'positive', note: '主动举手回答，表达清晰' },
    { id: 'evt_002', time: '09:18', student: '李四', type: '走神', sentiment: 'neutral', note: '注意力短暂分散，提醒后回到任务' },
    { id: 'evt_003', time: '09:26', student: '王五', type: '同伴协作', sentiment: 'positive', note: '与同伴合作完成练习' },
    { id: 'evt_004', time: '09:35', student: '赵六', type: '纪律事件', sentiment: 'warning', note: '与同学交谈偏离任务，教师口头提醒' },
    { id: 'evt_005', time: '09:42', student: '钱七', type: '任务完成', sentiment: 'positive', note: '在规定时间内完成任务' }
  ];

  const summaryTips = [
    '课堂前 15 分钟参与最积极，可安排高强度互动环节',
    '协作活动提升了参与度，建议在练习环节加入分组任务',
    '少量纪律事件集中在 30–40 分钟，考虑加入短休或节奏切换'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS)}>
          返回
        </Button>
        <Typography.Text style={{ fontWeight: 600 }}>课堂行为分析</Typography.Text>
        <Typography.Text type="secondary" style={{ marginLeft: 'auto' }}>
          {`基于 ${sourceInfo?.total || 1} 个数据源`}
        </Typography.Text>
      </div>

      <div style={{ padding: 16, overflow: 'auto' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Card size="small">
              <Statistic title="活跃度" value={metrics.activity} suffix="%" valueStyle={{ color: '#1d4ed8' }} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card size="small">
              <Statistic title="参与度" value={metrics.participation} suffix="%" valueStyle={{ color: '#0369a1' }} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card size="small">
              <Statistic title="专注度" value={metrics.focus} suffix="%" valueStyle={{ color: '#2e7d32' }} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card size="small">
              <Statistic title="纪律事件" value={metrics.disciplineEvents} valueStyle={{ color: '#d32f2f' }} />
            </Card>
          </Col>
        </Row>

        <Card size="small" style={{ marginTop: 16 }} title="课堂事件时间线">
          <List
            itemLayout="horizontal"
            dataSource={events}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <Tag color="blue">{item.time}</Tag>
                      <Typography.Text strong>{item.student}</Typography.Text>
                      <Tag color="geekblue">{item.type}</Tag>
                      {item.sentiment === 'positive' && <Tag color="green">积极</Tag>}
                      {item.sentiment === 'neutral' && <Tag color="default">一般</Tag>}
                      {item.sentiment === 'warning' && <Tag color="orange">提醒</Tag>}
                    </div>
                  }
                  description={item.note}
                />
              </List.Item>
            )}
          />
        </Card>

        <Card size="small" style={{ marginTop: 16 }} title="教学建议">
          <List
            dataSource={summaryTips}
            renderItem={(text) => (
              <List.Item>
                <Typography.Text>{text}</Typography.Text>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default ClassroomBehaviorAnalysisViewer;