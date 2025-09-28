import React, { useState, useEffect } from 'react';
import { Modal, Card, Button, Input, Space, Typography, Tag, Empty, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, FolderOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

const ThemeSelectModal = ({ 
  open, 
  onCancel, 
  onConfirm, 
  title = "选择目标主题",
  confirmText = "确认",
  record,
  actionType // 'copy' 或 'move'
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [loading, setLoading] = useState(false);

  // 模拟主题数据 - 实际项目中应该从状态管理或API获取
  const [themes] = useState([
    {
      id: 'theme_1',
      name: '数据结构与算法',
      category: '计算机科学',
      description: '数据结构和算法设计',
      recordCount: 12,
      color: '#1890ff',
      lastUpdate: '01-20'
    },
    {
      id: 'theme_2', 
      name: 'React前端开发',
      category: 'Web开发',
      description: '现代React开发技术栈',
      recordCount: 8,
      color: '#52c41a',
      lastUpdate: '01-18'
    },
    {
      id: 'theme_3',
      name: '机器学习基础',
      category: '人工智能',
      description: 'ML算法与应用',
      recordCount: 15,
      color: '#722ed1',
      lastUpdate: '01-15'
    },
    {
      id: 'theme_4',
      name: '数据库设计',
      category: '后端开发',
      description: 'DB设计原理与实践',
      recordCount: 6,
      color: '#fa8c16',
      lastUpdate: '01-10'
    },
    {
      id: 'theme_5',
      name: '项目管理',
      category: '管理学',
      description: '敏捷项目管理方法',
      recordCount: 9,
      color: '#eb2f96',
      lastUpdate: '01-05'
    },
    {
      id: 'theme_6',
      name: 'Python开发',
      category: '编程语言',
      description: 'Python基础与应用',
      recordCount: 11,
      color: '#13c2c2',
      lastUpdate: '01-12'
    },
    {
      id: 'theme_7',
      name: 'UI/UX设计',
      category: '设计',
      description: '用户体验设计',
      recordCount: 7,
      color: '#f759ab',
      lastUpdate: '01-08'
    }
  ]);

  // 过滤主题
  const filteredThemes = themes.filter(theme => 
    theme.name.toLowerCase().includes(searchText.toLowerCase()) ||
    theme.category.toLowerCase().includes(searchText.toLowerCase()) ||
    theme.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleConfirm = async () => {
    if (!selectedTheme) {
      return;
    }

    setLoading(true);
    try {
      await onConfirm(selectedTheme, record, actionType);
      setSelectedTheme(null);
      setSearchText('');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedTheme(null);
    setSearchText('');
    onCancel();
  };

  const getActionIcon = () => {
    return actionType === 'copy' ? '📋' : '📦';
  };

  const getActionColor = () => {
    return actionType === 'copy' ? '#1890ff' : '#52c41a';
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{getActionIcon()}</span>
          <span style={{ fontSize: '14px' }}>{title}</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      width={520}
      footer={[
        <Button key="cancel" onClick={handleCancel} size="small">
          取消
        </Button>,
        <Button 
          key="confirm" 
          type="primary" 
          onClick={handleConfirm}
          disabled={!selectedTheme}
          loading={loading}
          style={{ backgroundColor: getActionColor() }}
          size="small"
        >
          {confirmText}
        </Button>
      ]}
      destroyOnHidden
      style={{ top: 40 }}
    >
      {/* 当前记录信息 */}
      {record && (
        <Card size="small" style={{ marginBottom: '12px', backgroundColor: '#f8f9fa' }} bodyStyle={{ padding: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: 'white',
              flexShrink: 0
            }}>
              {record.type === 'note' ? '笔' : record.type === 'report' ? '报' : '📄'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text strong style={{ fontSize: '13px' }} ellipsis>{record.title}</Text>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '1px' }}>
                {actionType === 'copy' ? '将复制到选中的主题' : '将移动到选中的主题'}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 搜索框 */}
      <Search
        placeholder="搜索主题名称、分类或描述"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: '12px' }}
        prefix={<SearchOutlined />}
        size="small"
      />

      {/* 主题列表 */}
      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {filteredThemes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filteredThemes.map((theme) => (
              <Card
                key={theme.id}
                size="small"
                hoverable
                onClick={() => setSelectedTheme(theme)}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  border: selectedTheme?.id === theme.id ? `2px solid ${getActionColor()}` : '1px solid #d9d9d9',
                  backgroundColor: selectedTheme?.id === theme.id ? '#f6ffed' : '#fff',
                  transition: 'all 0.2s ease',
                  margin: 0
                }}
                bodyStyle={{ padding: '8px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: theme.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    <FolderOutlined />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0 }}>
                        <Text strong style={{ fontSize: '13px' }} ellipsis>{theme.name}</Text>
                        <Tag color="blue" size="small" style={{ fontSize: '10px', padding: '0 4px' }}>{theme.category}</Tag>
                      </div>
                      {selectedTheme?.id === theme.id && (
                        <Tag color="green" size="small" style={{ fontSize: '10px', padding: '0 4px', flexShrink: 0 }}>已选择</Tag>
                      )}
                    </div>
                    <Text type="secondary" style={{ fontSize: '11px', lineHeight: '1.2' }} ellipsis={{ rows: 1 }}>
                      {theme.description}
                    </Text>
                    <div style={{ marginTop: '2px', fontSize: '10px', color: '#999', lineHeight: '1' }}>
                      {theme.recordCount} 条记录 • {theme.lastUpdate}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty 
            description="未找到匹配的主题"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: '20px 0' }}
          >
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              style={{ backgroundColor: getActionColor() }}
              size="small"
            >
              创建新主题
            </Button>
          </Empty>
        )}
      </div>

      {/* 底部提示 */}
      <div style={{ 
        marginTop: '12px', 
        padding: '6px 8px', 
        backgroundColor: '#f0f2f5', 
        borderRadius: '4px',
        fontSize: '11px',
        color: '#666',
        lineHeight: '1.3'
      }}>
        💡 {actionType === 'copy' ? '复制：在目标主题中创建副本，原记录保持不变' : '移动：将记录转移到目标主题，原位置不再显示'}
      </div>
    </Modal>
  );
};

export default ThemeSelectModal;