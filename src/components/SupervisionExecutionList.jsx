import React from 'react';
import { Card, Row, Col, Typography, Tag } from 'antd';

const { Title, Text, Paragraph } = Typography;

const SupervisionExecutionList = ({ items = [], onEdit, onDelete, onShare, onTogglePin }) => {
  return (
    <Row gutter={[16, 16]}>
      {(items || []).map(item => (
        <Col key={item.id} xs={24} sm={12} md={8} lg={8}>
          <Card
            title={(
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{item.title}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Tag color={item.status === 'started' ? 'blue' : 'default'}>{item.status === 'started' ? '进行中' : '待发布'}</Tag>
                </div>
              </div>
            )}
            hoverable
            onClick={() => onEdit && onEdit(item)}
          >
            {(Array.isArray(item.targets) && item.targets.length > 0) && (
              <div style={{
                marginBottom: 12,
                padding: '8px 12px',
                borderRadius: 10,
                background: '#eef3ff',
                color: '#1f3b8f',
                fontSize: 14,
                fontWeight: 600,
                display: 'inline-block'
              }}>
                督导对象：<span style={{ fontWeight: 700 }}>{item.targets.join('、')}</span>
              </div>
            )}
            <Paragraph type="secondary" style={{ minHeight: 48 }}>{item.description || '执行卡片，用于按检查项推进、记录问题与整改跟踪'}</Paragraph>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(item.tags || []).slice(0, 3).map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
              {item.tags && item.tags.length > 3 && (
                <Tag key="more">+{item.tags.length - 3}</Tag>
              )}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default SupervisionExecutionList;