import React from 'react';
import { Typography, Row, Col, Card } from 'antd';

const { Title, Text } = Typography;

const ImplementationSection = ({ implementation }) => {
  const platform = implementation?.platform;
  const methods = Array.isArray(implementation?.methods) ? implementation.methods : [];
  const support = Array.isArray(implementation?.support) ? implementation.support : [];

  return (
    <div style={{ marginBottom: '32px' }}>
      <Title level={3}>四、实施保障</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card size="small" title="平台与资源">
            {Array.isArray(platform) ? (
              <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
                {platform.map((item, idx) => (
                  <li key={idx}><Text>{item}</Text></li>
                ))}
              </ul>
            ) : (
              <Text>{platform || '（未提供平台信息）'}</Text>
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="培训组织与方法">
            <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
              {methods.length > 0 ? (
                methods.map((item, idx) => (
                  <li key={idx}><Text>{item}</Text></li>
                ))
              ) : (
                <li><Text type="secondary">（无培训方法）</Text></li>
              )}
            </ul>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="支持与服务">
            <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
              {support.length > 0 ? (
                support.map((item, idx) => (
                  <li key={idx}><Text>{item}</Text></li>
                ))
              ) : (
                <li><Text type="secondary">（无支持与服务）</Text></li>
              )}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ImplementationSection;