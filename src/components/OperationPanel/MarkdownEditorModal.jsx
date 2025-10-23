import React from 'react';
import { Modal, Input } from 'antd';

const { TextArea } = Input;

const MarkdownEditorModal = ({ open, content, onChange, onSave, onCancel }) => {
  return (
    <Modal
      open={open}
      title="Markdown 编辑器"
      onOk={onSave}
      onCancel={onCancel}
      width={800}
      destroyOnClose
    >
      <TextArea
        rows={16}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="在此编辑 Markdown 内容..."
      />
    </Modal>
  );
};

export default MarkdownEditorModal;