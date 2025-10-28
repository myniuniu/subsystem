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

const inferTypeKeyFromText = (text) => {
  const s = String(text || '').toLowerCase();
  // 线上研讨会优先识别
  if (/线上研讨会|线上会议|视频会议|网络研讨会|webinar/i.test(text || '')) return 'webinar';
  // 优先识别考试相关（包含“测试/在线测试/线上测试/测评/考试”）
  if (/考试|测评|测试/.test(text || '')) return 'exam';
  if (/录播|视频/.test(text || '')) return 'videos';
  // 将“经验交流/经验分享/交流会”等默认识别为线上交流研讨
  if (/(经验交流|经验分享|交流会)/.test(text || '')) return 'seminar';
  // 线上交流研讨：必须同时包含“线上/在线”与“交流/研讨/讨论”
  if (/线上|在线/.test(text || '') && /(交流|研讨|讨论)/.test(text || '')) return 'seminar';
  // 线下活动识别（线下/线下活动/实地/参观/走访/调研/观摩）
  if (/线下活动|线下|实地|参观|走访|调研|观摩/.test(text || '')) return 'offline';
  // 作业类识别
  if (/试卷作业|作业|论文|报告|方案|反思/.test(text || '')) return 'assignment';
  if (/文档|资料/.test(text || '')) return 'document';
  if (/直播|讲座|工作坊|案例/.test(text || '')) return 'live';
  return 'document';
};

// 类型标签映射
const typeLabelByKey = (k) => ({
  live: '直播课',
  webinar: '线上研讨会',
  videos: '点播课',
  seminar: '线上交流研讨',
  offline: '线下活动',
  exam: '考试',
  assignment: '试卷作业',
  document: '研修成果'
}[k] || '研修成果');

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
                    {module?.weight != null && String(module.weight).trim() !== '' && (
                      <Tag color="geekblue">权重 {module.weight}%</Tag>
                    )}
                    {typeof module.arrangedHours === 'number' && Number.isFinite(module.arrangedHours) && (
                      <Tag color="gold">安排学时 {module.arrangedHours}</Tag>
                    )}
                    {typeof module.hoursTarget === 'number' && Number.isFinite(module.hoursTarget) && (
                      <Tag color="green">考核学时 {module.hoursTarget}</Tag>
                    )}
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
                        <Card 
                          key={i} 
                          size="small" 
                          bordered 
                          bodyStyle={{ padding: '4px 8px' }}
                          style={{ borderTop: undefined }}
                        >
                          {(() => {
                            const normalizedMap = { ...(module.formatTypeMap || {}) };
                            ['经验交流', '经验分享', '交流会'].forEach(k => {
                              if (normalizedMap[k] === 'document') normalizedMap[k] = 'seminar';
                            });
                            const typeKey = normalizedMap[f] || inferTypeKeyFromText(f);
                            const fc = (module.formatConfigs || {})[typeKey] || {};
                            return (
                              <Space size={6}>
                                <Text>{f}</Text>
                                <Tag color="purple">{typeLabelByKey(typeKey)}</Tag>
                                {typeof (fc.assessmentHours ?? fc.hours) === 'number' && Number.isFinite(fc.assessmentHours ?? fc.hours) && (
                                  <Tag color="magenta">考核学时 {(fc.assessmentHours ?? fc.hours)}</Tag>
                                )}
                                {typeof (fc.arrangedHours ?? fc.hours) === 'number' && Number.isFinite(fc.arrangedHours ?? fc.hours) && (
                                  <Tag color="green">安排学时 {(fc.arrangedHours ?? fc.hours)}</Tag>
                                )}
                              </Space>
                            );
                          })()}
                        </Card>
                      ))
                    ) : (
                      <Text type="secondary">未指定</Text>
                    )}
                  </div>
                </div>
                <div>
                  <Text strong>考核方式：</Text>
                  {(() => {
                    const assessText = String(module.assessment || '').trim();
                    const cleanAssessText = assessText
                      .replace(/（\s*\d+(?:\.\d+)?\s*(?:分)?\s*）/g, '')
                      .replace(/\(\s*\d+(?:\.\d+)?\s*(?:分)?\s*\)/g, '');
                    if (!assessText) {
                      return (<Space size={4}><Text type="secondary">未指定</Text></Space>);
                    }
                    const aKey = module.assessmentTypeKey || inferTypeKeyFromText(assessText);
                    return (
                      <Space size={6}>
                        <Text> {cleanAssessText}</Text>
                        <Tag color="purple">{typeLabelByKey(aKey)}</Tag>
                      </Space>
                    );
                  })()}
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