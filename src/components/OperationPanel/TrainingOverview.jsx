import React from 'react';
import { Typography, Row, Col, Card, Statistic } from 'antd';

const { Title, Text } = Typography;

const TrainingOverview = ({ overview }) => {
  return (
    <div style={{ marginBottom: '32px' }}>
      <Title level={3}>一、培训概述</Title>
      <div style={{ marginBottom: '16px' }}>
        <Text strong>培训背景：</Text>
        <Text>{overview.background}</Text>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Text strong>培训目标：</Text>
        <ul style={{ marginTop: '8px', paddingLeft: '24px' }}>
          {overview.objectives.map((obj, idx) => (
            <li key={idx} style={{ marginBottom: '8px' }}>
              <Text>{obj}</Text>
            </li>
          ))}
        </ul>
      </div>
      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="培训周期" value={overview.duration} valueStyle={{ fontSize: '16px' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="培训对象" value={overview.participants} valueStyle={{ fontSize: '16px' }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small">
            <Text strong>培训形式：</Text>
            <br />
            <Text style={{ fontSize: '14px' }}>{overview.format}</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TrainingOverview;