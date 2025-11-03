import React from 'react';
import { Button, Typography, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS } from '../constants/noteEditConstants';

const { Text } = Typography;

const DocumentView = ({ state, onBack }) => {
  const material = state.selectedMaterial || {};
  const title = material.title || '文档预览';
  const url = material.url || material.videoUrl || '';

  const handleEdit = async () => {
    try {
      let html = '<p>暂无内容</p>';
      if (url) {
        try {
          const res = await fetch(url);
          html = await res.text();
        } catch (e) {
          html = '<p>加载模板失败，请稍后重试</p>';
        }
      }
      if (state?.setRightPanelEditingNote && state?.setRightPanelNoteContent && state?.setRightPanelView) {
        const docNote = {
          id: material.id || Date.now(),
          title: title,
          type: 'note',
          subType: 'document',
          source: '',
          time: new Date().toLocaleString('zh-CN')
        };
        state.setRightPanelEditingNote(docNote);
        state.setRightPanelNoteContent(html);
        state.setRightPanelView(RIGHT_PANEL_VIEWS.NOTE_EDITOR);
        message.success('已打开编辑器：EPBL教学设计');
      }
    } catch (err) {
      console.error('打开编辑器失败:', err);
      message.error('打开编辑器失败，请稍后重试');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8, background: '#fafafa' }}>
        <Button size="small" icon={<ArrowLeftOutlined />} onClick={onBack}>返回</Button>
        <Text strong style={{ fontSize: 13 }}>{title}</Text>
        {(
          <Button type="link" size="small" style={{ marginLeft: 'auto' }} onClick={handleEdit}>编辑</Button>
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