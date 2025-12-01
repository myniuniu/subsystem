import React from 'react';
import { Button, Typography, Card, Row, Col, Statistic, List, Tag, Space } from 'antd';
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
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS)}>
          返回
        </Button>
        <Typography.Text style={{ fontWeight: 600, fontSize: 14 }}>课堂行为分析</Typography.Text>
        <Typography.Text type="secondary" style={{ marginLeft: 'auto', fontSize: 12 }}>
          {`基于 ${sourceInfo?.total || 1} 个数据源`}
        </Typography.Text>
      </div>

      <div style={{ padding: 12, overflow: 'auto' }}>
        <Row gutter={[8, 8]}>
          <Col xs={24} md={6}>
            <Card size="small" bodyStyle={{ padding: 8 }}>
              <Statistic title="活跃度" value={metrics.activity} suffix="%" valueStyle={{ color: '#1d4ed8', fontSize: 18 }} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card size="small" bodyStyle={{ padding: 8 }}>
              <Statistic title="参与度" value={metrics.participation} suffix="%" valueStyle={{ color: '#0369a1', fontSize: 18 }} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card size="small" bodyStyle={{ padding: 8 }}>
              <Statistic title="专注度" value={metrics.focus} suffix="%" valueStyle={{ color: '#2e7d32', fontSize: 18 }} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card size="small" bodyStyle={{ padding: 8 }}>
              <Statistic title="纪律事件" value={metrics.disciplineEvents} valueStyle={{ color: '#d32f2f', fontSize: 18 }} />
            </Card>
          </Col>
        </Row>

        <Card size="small" style={{ marginTop: 12 }} title="课堂事件时间线" bodyStyle={{ padding: 8 }}>
          <List
            size="small"
            split={false}
            itemLayout="horizontal"
            dataSource={events}
            renderItem={(item) => (
              <List.Item style={{ padding: '6px 8px' }}>
                <List.Item.Meta
                  title={
                    <Space size={8} wrap>
                      <Tag color="blue" style={{ fontSize: 12, padding: '0 6px', height: 20, lineHeight: '20px' }}>{item.time}</Tag>
                      <Typography.Text strong style={{ fontSize: 13 }}>{item.student}</Typography.Text>
                      <Tag color="geekblue" style={{ fontSize: 12, padding: '0 6px', height: 20, lineHeight: '20px' }}>{item.type}</Tag>
                      {item.sentiment === 'positive' && <Tag color="green" style={{ fontSize: 12, padding: '0 6px', height: 20, lineHeight: '20px' }}>积极</Tag>}
                      {item.sentiment === 'neutral' && <Tag color="default" style={{ fontSize: 12, padding: '0 6px', height: 20, lineHeight: '20px' }}>一般</Tag>}
                      {item.sentiment === 'warning' && <Tag color="orange" style={{ fontSize: 12, padding: '0 6px', height: 20, lineHeight: '20px' }}>提醒</Tag>}
                    </Space>
                  }
                  description={<Typography.Text style={{ fontSize: 12, color: '#666' }}>{item.note}</Typography.Text>}
                />
              </List.Item>
            )}
          />
        </Card>

        <Card size="small" style={{ marginTop: 12 }} title="教学建议" bodyStyle={{ padding: 8 }}>
          <List
            size="small"
            split={false}
            dataSource={summaryTips}
            renderItem={(text) => (
              <List.Item style={{ padding: '6px 8px' }}>
                <Typography.Text style={{ fontSize: 12 }}>{text}</Typography.Text>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default ClassroomBehaviorAnalysisViewer;
