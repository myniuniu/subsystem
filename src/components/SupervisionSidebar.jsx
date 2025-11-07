import React from 'react';
import { Layout, Tree, Button, Tooltip, Space } from 'antd';
import { FolderOpenOutlined, ColumnWidthOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import './Supervision.css';

const { Sider } = Layout;

// 督学专用侧边栏（复制版），仅显示“功能菜单”与“计划模版”两级结构
const SupervisionSidebar = ({ selectedKey, onSelect }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const treeData = [
    {
      key: 'group_plan_templates',
      title: (
        <span className="tree-group-title" style={{ fontWeight: 600, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FolderOpenOutlined className="category-icon" />
          <span>计划模版</span>
        </span>
      ),
      selectable: false,
      children: [
        { key: 'plan_templates_common', title: '通用模版', isLeaf: true },
        { key: 'plan_templates_special', title: '专项模版', isLeaf: true }
      ]
    },
    {
      key: 'group_supervision_execution',
      title: (
        <span className="tree-group-title" style={{ fontWeight: 600, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FolderOpenOutlined className="category-icon" />
          <span>督导执行</span>
        </span>
      ),
      selectable: false,
      children: [
        { key: 'supervision_plan', title: '督导任务', isLeaf: true }
        ,{ key: 'supervision_execution', title: '督导执行', isLeaf: true }
      ]
    }
  ];

  return (
    <Sider width={isCollapsed ? 56 : 280} className="notes-sidebar supervision-sidebar">
      <div className="sidebar-content">
        {/* 顶部区域（与 NotesSidebar 的结构一致） */}
        <div className="sidebar-top">
          <div className="category-section">
            <div className="category-group" key="system_categories_header" style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between' }}>
              {!isCollapsed && (
                <div className="category-group-title">功能菜单</div>
              )}
              <Space size={4}>
                <Tooltip title={isCollapsed ? '展开' : '收起'}>
                  <Button
                    type="text"
                    size="small"
                    icon={isCollapsed ? <MenuUnfoldOutlined /> : <ColumnWidthOutlined />}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  />
                </Tooltip>
              </Space>
            </div>
          </div>
        </div>

        {/* 底部区域（与 NotesSidebar 的系统分类树一致） */}
        {!isCollapsed && (
          <div className="sidebar-bottom">
            <div className="category-section">
              <div className="category-group system-group" key="system_categories">
                <Tree
                  blockNode
                  showLine={false}
                  defaultExpandAll
                  selectedKeys={selectedKey ? [selectedKey] : []}
                  treeData={treeData}
                  onSelect={(keys, info) => {
                    const key = info?.node?.key;
                    const isLeaf = info?.node?.isLeaf;
                    if (isLeaf && typeof key === 'string') {
                      onSelect && onSelect(key);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Sider>
  );
};

export default SupervisionSidebar;