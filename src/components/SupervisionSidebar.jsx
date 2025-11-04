import React from 'react';
import { Layout, Tree } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import './Supervision.css';

const { Sider } = Layout;

// 督学专用侧边栏（复制版），仅显示“功能菜单”与“计划模版”两级结构
const SupervisionSidebar = ({ selectedKey, onSelect }) => {
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
    }
  ];

  return (
    <Sider width={280} className="notes-sidebar">
      <div className="sidebar-content">
        {/* 顶部区域（与 NotesSidebar 的结构一致） */}
        <div className="sidebar-top">
          <div className="category-section">
            <div className="category-group" key="system_categories_header">
              <div className="category-group-title">功能菜单</div>
            </div>
          </div>
        </div>

        {/* 底部区域（与 NotesSidebar 的系统分类树一致） */}
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
      </div>
    </Sider>
  );
};

export default SupervisionSidebar;