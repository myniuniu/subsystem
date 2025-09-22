import React, { useState } from 'react';
import { Modal, Input, Radio, Button, Space, Dropdown, Menu } from 'antd';
import { SearchOutlined, CloseOutlined, BulbOutlined } from '@ant-design/icons';
import './ExploreModal.css';

const ExploreModal = ({ visible, onClose, onExplore }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceType, setSourceType] = useState('web');

  // 知识图谱提示词模版
  const knowledgeGraphTemplates = [
    {
      key: 'entity-relation',
      label: '实体关系分析',
      template: '请分析以下概念之间的关系：[概念A] 和 [概念B] 的关联性，包括它们的共同属性、依赖关系和影响因素。'
    },
    {
      key: 'concept-hierarchy',
      label: '概念层次结构',
      template: '请构建关于 [主题] 的概念层次结构，包括上位概念、下位概念和同级概念，并说明它们之间的分类关系。'
    },
    {
      key: 'knowledge-path',
      label: '知识路径探索',
      template: '从 [起始概念] 到 [目标概念] 的知识路径是什么？请列出中间的关键节点和连接关系。'
    },
    {
      key: 'attribute-analysis',
      label: '属性特征分析',
      template: '请详细分析 [实体/概念] 的核心属性、特征和性质，以及这些属性如何影响其与其他概念的关系。'
    },
    {
      key: 'causal-chain',
      label: '因果链分析',
      template: '请分析 [现象/事件] 的因果链条，包括根本原因、中间环节和最终结果，以及各环节之间的逻辑关系。'
    },
    {
      key: 'domain-mapping',
      label: '领域知识映射',
      template: '请构建 [领域] 的知识图谱，包括核心概念、关键实体、重要关系和领域规则。'
    },
    {
      key: 'semantic-network',
      label: '语义网络构建',
      template: '围绕 [中心概念] 构建语义网络，包括相关概念、语义关系和概念间的强弱联系。'
    },
    {
      key: 'knowledge-inference',
      label: '知识推理分析',
      template: '基于已知条件 [条件1, 条件2, ...] ，可以推理出哪些新的知识和结论？请说明推理过程。'
    }
  ];

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

  // 处理模版选择
  const handleTemplateSelect = (template) => {
    setSearchQuery(template);
  };

  // 创建模版菜单
  const templateMenu = (
    <Menu
      onClick={({ key }) => {
        const template = knowledgeGraphTemplates.find(t => t.key === key);
        if (template) {
          handleTemplateSelect(template.template);
        }
      }}
      items={knowledgeGraphTemplates.map(template => ({
        key: template.key,
        label: (
          <div style={{ padding: '4px 0' }}>
            <div style={{ fontWeight: 500, marginBottom: '2px' }}>{template.label}</div>
            <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.3' }}>
              {template.template.substring(0, 50)}...
            </div>
          </div>
        )
      }))}
    />
  );

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
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Input.TextArea
                placeholder="描述您想了解的内容，或点击'我很好奇'探索新主题。"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                rows={4}
                className="explore-textarea"
                style={{ flex: 1 }}
              />
              <Dropdown 
                overlay={templateMenu} 
                trigger={['click']}
                placement="bottomLeft"
              >
                <Button 
                  icon={<BulbOutlined />} 
                  title="知识图谱提示词模版"
                  type="default"
                  style={{ 
                    height: '40px',
                    width: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                />
              </Dropdown>
            </div>
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