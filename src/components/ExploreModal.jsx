import React, { useState } from 'react';
import { Modal, Input, Radio, Button, Space } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import './ExploreModal.css';

const ExploreModal = ({ visible, onClose, onExplore }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceType, setSourceType] = useState('web');

  const handleExplore = () => {
    if (searchQuery.trim()) {
      onExplore && onExplore({
        query: searchQuery,
        source: sourceType
      });
      onClose();
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSourceType('web');
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={520}
      className="explore-modal"
      closable={false}
      centered
      destroyOnClose={true}
      maskClosable={true}
    >
      <div className="explore-modal-content">
        {/* 头部 */}
        <div className="explore-modal-header">
          <h3 className="explore-modal-title">探索来源</h3>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={onClose}
            className="explore-modal-close"
          />
        </div>

        {/* 图标和描述 */}
        <div className="explore-modal-body">
          <div className="explore-icon">
            <SearchOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </div>
          
          <div className="explore-description">
            <h4>您对哪些感兴趣？</h4>
          </div>

          {/* 搜索输入框 */}
          <div className="explore-search">
            <Input.TextArea
              placeholder="描述您想了解的内容，或点击'我很好奇'探索新主题。"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              rows={4}
              className="explore-textarea"
            />
          </div>

          {/* 来源选择 */}
          <div className="explore-sources">
            <div className="sources-label">来源查找平台：</div>
            <Radio.Group 
              value={sourceType} 
              onChange={(e) => setSourceType(e.target.value)}
              className="sources-radio-group"
            >
              <Radio value="web" className="source-radio">
                <span className="source-text">Web</span>
              </Radio>
              <Radio value="google-drive" className="source-radio">
                <span className="source-text">Google 云端硬盘</span>
              </Radio>
            </Radio.Group>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="explore-modal-footer">
          <Space>
            <Button 
              type="text" 
              onClick={handleReset}
              className="reset-button"
            >
              <SearchOutlined /> 我很好奇
            </Button>
            <Button 
              type="primary" 
              onClick={handleExplore}
              disabled={!searchQuery.trim()}
              className="submit-button"
            >
              提交
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default ExploreModal;