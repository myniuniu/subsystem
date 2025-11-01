import React from 'react';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DocumentView = ({ state, onBack }) => {
  const material = state.selectedMaterial || {};
  const title = material.title || '文档预览';
  const url = material.url || material.videoUrl || '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8, background: '#fafafa' }}>
        <Button size="small" icon={<ArrowLeftOutlined />} onClick={onBack}>返回</Button>
        <Text strong style={{ fontSize: 13 }}>{title}</Text>
        {url && (
          <Button type="link" size="small" style={{ marginLeft: 'auto' }} onClick={() => window.open(url, '_blank')}>在新窗口打开</Button>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {url ? (
          <iframe src={url} title={title} style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }} />
        ) : (
          <div style={{ padding: 16, color: '#999' }}>暂无可预览的链接</div>
        )}
      </div>
    </div>
  );
};

export default DocumentView;