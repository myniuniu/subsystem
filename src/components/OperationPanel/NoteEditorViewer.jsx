import React from 'react';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS } from '../../constants/noteEditConstants';

const { Text } = Typography;

const NoteEditorViewer = ({
  rightPanelEditingNote,
  rightPanelNoteContent,
  setRightPanelView,
  setRightPanelEditingNote,
  setRightPanelNoteContent,
  setOperationRecords,
  message
}) => {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 编辑器头部 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📝</span>
          <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {rightPanelEditingNote?.title || '未命名主题'}
          </Text>
        </div>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
            setRightPanelEditingNote(null);
            setRightPanelNoteContent('');
          }}
          style={{ color: '#666' }}
        >
          返回
        </Button>
      </div>

      {/* 编辑器内容区域 */}
      <div style={{ 
        flex: 1,
        border: '1px solid #d9d9d9', 
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* 工具栏 */}
        <div style={{ 
          padding: '8px 12px',
          borderBottom: '1px solid #f0f0f0',
          background: '#fafafa',
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <Button 
            size="small" 
            onClick={() => document.execCommand('bold')}
            style={{ minWidth: '28px' }}
          >
            <strong>B</strong>
          </Button>
          <Button 
            size="small" 
            onClick={() => document.execCommand('italic')}
            style={{ minWidth: '28px' }}
          >
            <em>I</em>
          </Button>
          <Button 
            size="small" 
            onClick={() => document.execCommand('underline')}
            style={{ minWidth: '28px' }}
          >
            <u>U</u>
          </Button>
          <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#999' }}>
            支持富文本编辑
          </div>
        </div>

        {/* 编辑器 */}
        <div style={{ flex: 1, padding: '12px' }}>
          <div 
            contentEditable
            style={{
              minHeight: '300px',
              outline: 'none',
              lineHeight: '1.6',
              fontSize: '14px',
              color: '#333'
            }}
            dangerouslySetInnerHTML={{ __html: rightPanelNoteContent }}
            onInput={(e) => {
              setRightPanelNoteContent(e.target.innerHTML);
            }}
          />
        </div>
      </div>

      {/* 保存按钮 */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Button 
          onClick={() => {
            setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
            setRightPanelEditingNote(null);
            setRightPanelNoteContent('');
          }}
        >
          取消
        </Button>
        <Button 
          type="primary" 
          onClick={() => {
            if (!rightPanelNoteContent.trim() || rightPanelNoteContent === '<p></p>') {
              message.warning('请输入笔记内容');
              return;
            }

            // 更新操作记录中的笔记内容
            setOperationRecords(prev => ({
              ...prev,
              note: prev.note.map(note => 
                note.id === rightPanelEditingNote.id 
                  ? { ...note, content: rightPanelNoteContent }
                  : note
              )
            }));

            message.success('笔记已保存');
            setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
            setRightPanelEditingNote(null);
            setRightPanelNoteContent('');
          }}
        >
          保存
        </Button>
      </div>
    </div>
  );
};

export default NoteEditorViewer;