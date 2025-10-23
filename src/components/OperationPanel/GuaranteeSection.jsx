import React from 'react';
import { Typography, Row, Col, Card } from 'antd';

const { Title, Text } = Typography;

const GuaranteeSection = ({ guarantee }) => {
  const organization = Array.isArray(guarantee?.organization) ? guarantee.organization : [];
  const resources = Array.isArray(guarantee?.resources) ? guarantee.resources : [];
  const quality = Array.isArray(guarantee?.quality) ? guarantee.quality : [];

  return (
    <div style={{ marginBottom: '32px' }}>
      <Title level={3}>六、保障措施</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card size="small" title="组织保障">
            <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
              {organization.length > 0 ? (
                organization.map((item, idx) => (
                  <li key={idx}><Text>{item}</Text></li>
                ))
              ) : (
                <li><Text type="secondary">（无组织保障）</Text></li>
              )}
            </ul>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="资源保障">
            <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
              {resources.length > 0 ? (
                resources.map((item, idx) => (
                  <li key={idx}><Text>{item}</Text></li>
                ))
              ) : (
                <li><Text type="secondary">（无资源保障）</Text></li>
              )}
            </ul>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="质量保障">
            <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
              {quality.length > 0 ? (
                quality.map((item, idx) => (
                  <li key={idx}><Text>{item}</Text></li>
                ))
              ) : (
                <li><Text type="secondary">（无质量保障）</Text></li>
              )}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GuaranteeSection;