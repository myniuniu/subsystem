import React from 'react';
import { Button, Typography, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title } = Typography;

const TrainingPlanHeader = ({ title, hideButtons, onBack, onEdit, onGenerateImplementation }) => {
  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack} type="text">返回</Button>
          <Title level={4} style={{ margin: 0 }}>{title}</Title>
        </div>
        {!hideButtons && (
          <Space>
            <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>编辑</Button>
            <Button icon={<FileTextOutlined />} onClick={onGenerateImplementation}>生成实施方案</Button>
          </Space>
        )}
      </div>
    </div>
  );
};

export default TrainingPlanHeader;