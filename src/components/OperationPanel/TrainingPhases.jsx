import React, { useState } from 'react';
import { Typography, Card, Space, Tag, Button, Tooltip } from 'antd';
import { BookOutlined, EditOutlined, CodeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// 规范化培训形式为名称数组
const normalizeFormats = (fmt) => {
  const arr = Array.isArray(fmt)
    ? fmt
    : String(fmt || '')
        // 包含加号作为分隔，保持与编辑态一致（示范课观摩 + 微格教学）
        .split(/[+、，,;；\/\s]+/)
        .map(s => s.trim())
        .filter(Boolean);
  return arr;
};

const TrainingPhases = ({ phases, onEditModule, onJsonEditModule }) => {
  let modCounter = 0; // 跨阶段自然编号计数器
  const [hoveredKey, setHoveredKey] = useState(null);
  return (
    <div style={{ marginBottom: '32px' }}>
      <Title level={3}>二、培训阶段与内容</Title>
      {phases.map((phase, phaseIdx) => (
        <div key={phaseIdx} id={`phase-${phaseIdx}`} style={{ marginBottom: '24px', borderLeft: '3px solid #91d5ff', paddingLeft: '12px' }}>
          <Title level={4}>{phase.name}</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
            培训重点：{phase.focus}
          </Text>
          {phase.modules.map((module, moduleIdx) => (
            <div 
              key={moduleIdx} 
              id={`phase-${phaseIdx}-module-${moduleIdx}`}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredKey(`${phaseIdx}-${moduleIdx}`)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              {/* 悬停编辑按钮 */}
              {hoveredKey === `${phaseIdx}-${moduleIdx}` && (
                <div style={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}>
                  <Space size={4}>
                    <Tooltip title="编辑此模块（打开可视化编辑）">
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={(e) => { e.stopPropagation(); onEditModule && onEditModule(phaseIdx, moduleIdx); }}
                      />
                    </Tooltip>
                    <Tooltip title="JSON编辑（高级）">
                      <Button
                        type="text"
                        size="small"
                        icon={<CodeOutlined />}
                        onClick={(e) => { e.stopPropagation(); onJsonEditModule && onJsonEditModule(phaseIdx, moduleIdx); }}
                      />
                    </Tooltip>
                  </Space>
                </div>
              )}
              <Card 
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
                          <Space size={4}>
                            <Text>{f}</Text>
                            {!(module.formatTypeMap || {})[f] && (
                              <span title="未绑定类型（将按关键词识别）" style={{ width: 6, height: 6, borderRadius: '50%', background: '#d9d9d9', display: 'inline-block' }} />
                            )}
                          </Space>
                        </Card>
                      ))
                    ) : (
                      <Text type="secondary">未指定</Text>
                    )}
                  </div>
                </div>
                <div>
                  <Text strong>考核方式：</Text>
                  <Space size={4}>
                    <Text> {module.assessment}</Text>
                    {(!module.assessmentTypeKey && (module.assessment || '').trim().length > 0) && (
                      <span title="未绑定类型（将按关键词识别）" style={{ width: 6, height: 6, borderRadius: '50%', background: '#d9d9d9', display: 'inline-block' }} />
                    )}
                  </Space>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TrainingPhases;