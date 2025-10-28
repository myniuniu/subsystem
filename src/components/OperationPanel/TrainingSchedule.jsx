import React from 'react';
import { Typography, Table, Tag, InputNumber } from 'antd';

const { Title } = Typography;

const TrainingSchedule = ({ schedule, showWeight = true, editable = true, onChangeModuleWeight }) => {
  // 兼容不同数据结构：将 week/content/type/hours 映射到表格需要的字段
  const normalized = (Array.isArray(schedule) ? schedule : []).map((item, idx) => {
    const phase = item.phase ?? item.week ?? '';
    const time = item.time ?? (item.duration ? item.duration : (item.hours ? `${item.hours}学时` : ''));
    const topic = item.topic ?? item.content ?? '';
    const format = item.format ?? item.type ?? '';
    const assessment = item.assessment ?? '';
    const notes = item.notes ?? undefined;
    const weight = Number(item.moduleWeight ?? item.weight ?? 0);
    const key = `${phase}|${time}|${topic}|${format}|${assessment}|${idx}`;
    return { key, phase, time, topic, format, assessment, notes, weight, _rowIndex: idx };
  });

  const columns = [
    { title: '阶段', dataIndex: 'phase', key: 'phase', width: 100 },
    { title: '时间安排', dataIndex: 'time', key: 'time', width: 150 },
    { title: '主题', dataIndex: 'topic', key: 'topic', width: 300 },
    { title: '形式', dataIndex: 'format', key: 'format', width: 120 },
    { title: '考核', dataIndex: 'assessment', key: 'assessment', width: 120 },
    ...(showWeight ? [{
      title: '权重(%)',
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
      render: (value, record) => (
        editable ? (
          <InputNumber
            size="small"
            min={0}
            max={100}
            value={Number(value ?? 0)}
            onChange={(val) => {
              if (typeof onChangeModuleWeight === 'function') {
                onChangeModuleWeight(record?._rowIndex ?? 0, Number(val ?? 0));
              }
            }}
          />
        ) : (
          `${Number(value ?? 0)}%`
        )
      )
    }] : []),
    { 
      title: '备注', 
      dataIndex: 'notes', 
      key: 'notes', 
      width: 180,
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
        rowKey="key"
      />
    </div>
  );
};

export default TrainingSchedule;