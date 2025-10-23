import React from 'react';
import { Typography, Card, Space, Tag } from 'antd';
import { BookOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// 规范化培训形式为名称数组
const normalizeFormats = (fmt) => {
  const arr = Array.isArray(fmt)
    ? fmt
    : String(fmt || '')
        .split(/[、，,;；\/\s]+/)
        .map(s => s.trim())
        .filter(Boolean);
  return arr;
};

const TrainingPhases = ({ phases }) => {
  let modCounter = 0; // 跨阶段自然编号计数器
  return (
    <div style={{ marginBottom: '32px' }}>
      <Title level={3}>二、培训阶段与内容</Title>
      {phases.map((phase, phaseIdx) => (
        <div key={phaseIdx} style={{ marginBottom: '24px', borderLeft: '3px solid #91d5ff', paddingLeft: '12px' }}>
          <Title level={4}>{phase.name}</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
            培训重点：{phase.focus}
          </Text>
          {phase.modules.map((module, moduleIdx) => (
            <Card 
              key={moduleIdx}
              size="small" 
              title={
                <Space>
                  <Tag color="geekblue">{`模块 ${++modCounter}`}</Tag>
                  <BookOutlined style={{ color: '#1890ff' }} />
                  <Text strong>{module.title}</Text>
                  <Tag color="blue">{module.duration}</Tag>
                </Space>
              }
              style={{ marginBottom: '12px', borderLeft: '2px solid #b7eb8f' }}
            >
              <div style={{ marginBottom: '12px' }}>
                <Text strong>培训内容：</Text>
                <ul style={{ marginTop: '8px', paddingLeft: '24px' }}>
                  {module.content.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>
                      <Text>{item}</Text>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <Text strong>培训形式：</Text>
                <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {normalizeFormats(module.format).length > 0 ? (
                    normalizeFormats(module.format).map((f, i) => (
                      <Card key={i} size="small" bordered bodyStyle={{ padding: '4px 8px' }}>
                        <Text>{f}</Text>
                      </Card>
                    ))
                  ) : (
                    <Text type="secondary">未指定</Text>
                  )}
                </div>
              </div>
              <div>
                <Text strong>考核方式：</Text>
                <Text> {module.assessment}</Text>
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TrainingPhases;