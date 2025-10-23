import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';

const { Title, Text } = Typography;

const AssessmentSection = ({ assessment }) => {
  const method = assessment?.method || '（未提供考核方式）';
  const components = Array.isArray(assessment?.components) ? assessment.components : [];
  const standards = Array.isArray(assessment?.standards) ? assessment.standards : [];

  return (
    <div style={{ marginBottom: '32px' }}>
      <Title level={3}>五、考核与评价</Title>
      <Card size="small" style={{ marginBottom: '12px' }}>
        <Text strong>考核方式：</Text> <Text>{method}</Text>
      </Card>
      <Card size="small" style={{ marginBottom: '12px' }}>
        <Text strong>评价组成：</Text>
        <Row gutter={16} style={{ marginTop: '12px' }}>
          {components.length === 0 ? (
            <Col span={24}><Text type="secondary">（无评价组成）</Text></Col>
          ) : (
            components.map((comp, idx) => (
              <Col span={6} key={idx}>
                <Card size="small">
                  <Statistic title={comp.name} value={comp.weight} valueStyle={{ fontSize: '18px', color: '#1890ff' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>{comp.description}</Text>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Card>
      <Card size="small">
        <Text strong>达标标准：</Text>
        <ul style={{ paddingLeft: '20px', marginBottom: 0, marginTop:'8px' }}>
          {standards.length > 0 ? (
            standards.map((s, idx) => (<li key={idx}><Text>{s}</Text></li>))
          ) : (
            <li><Text type="secondary">（无达标标准）</Text></li>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default AssessmentSection;