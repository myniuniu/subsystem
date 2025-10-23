import React from 'react';
import { Typography, Table, Tag } from 'antd';

const { Title } = Typography;

const TrainingSchedule = ({ schedule }) => {
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
        dataSource={schedule}
        pagination={false}
        rowKey={(r, i) => i}
      />
    </div>
  );
};

export default TrainingSchedule;