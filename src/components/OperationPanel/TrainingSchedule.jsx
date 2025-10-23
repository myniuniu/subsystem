import React from 'react';
import { Typography, Table, Tag } from 'antd';

const { Title } = Typography;

const TrainingSchedule = ({ schedule }) => {
  // 兼容不同数据结构：将 week/content/type/hours 映射到表格需要的字段
  const normalized = (Array.isArray(schedule) ? schedule : []).map((item) => ({
    phase: item.phase ?? item.week ?? '',
    time: item.time ?? (item.duration ? item.duration : (item.hours ? `${item.hours}学时` : '')),
    topic: item.topic ?? item.content ?? '',
    format: item.format ?? item.type ?? '',
    assessment: item.assessment ?? '',
    notes: item.notes ?? undefined,
  }));

  const columns = [
    { title: '阶段', dataIndex: 'phase', key: 'phase', width: 120 },
    { title: '时间安排', dataIndex: 'time', key: 'time', width: 180 },
    { title: '主题', dataIndex: 'topic', key: 'topic' },
    { title: '形式', dataIndex: 'format', key: 'format', width: 160 },
    { title: '考核', dataIndex: 'assessment', key: 'assessment', width: 160 },
    { 
      title: '备注', 
      dataIndex: 'notes', 
      key: 'notes', 
      width: 200,
      render: (notes) => Array.isArray(notes) ? notes.map((n, i) => <Tag key={i}>{n}</Tag>) : notes
    },
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      <Title level={3}>三、详细时间安排</Title>
      <Table 
        size="small"
        columns={columns}
        dataSource={normalized}
        pagination={false}
        rowKey={(r, i) => i}
      />
    </div>
  );
};

export default TrainingSchedule;