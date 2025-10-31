import React, { useMemo, useState, useEffect } from 'react';
import { Layout, Tree, Button, Tooltip, Dropdown, message } from 'antd';
import {
  BookOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  UserOutlined,
  BulbOutlined,
  StarOutlined,
  NodeIndexOutlined,
  RadarChartOutlined,
  ExperimentOutlined,
  TeamOutlined,
  PlusOutlined,
  EllipsisOutlined,
  DatabaseOutlined,
  CloudOutlined,
  DesktopOutlined,
  MobileOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import './ResourceCategorySidebar.css';

const { Sider } = Layout;

const ResourceCategorySidebar = ({
  selectedCategory,
  onCategoryChange,
  resources,
  categories,
  configVersion
}) => {
  const iconMap = {
    FileTextOutlined,
    FolderOpenOutlined,
    BookOutlined,
    UserOutlined,
    BulbOutlined,
    StarOutlined,
    NodeIndexOutlined,
    RadarChartOutlined,
    ExperimentOutlined,
    TeamOutlined,
    DatabaseOutlined,
    CloudOutlined,
    DesktopOutlined,
    MobileOutlined,
    GlobalOutlined
  };

  const getCategoryCount = (category) => {
    if (!Array.isArray(resources)) return 0;
    if (category.value === 'all') {
      return resources.length;
    } else if (category.value === 'starred') {
      return resources.filter(resource => resource.starred).length;
    } else if (category.value === 'recent') {
      return resources.filter(resource => resource.isRecent).length;
    } else if (category.value === 'shared') {
      return resources.filter(resource => resource.isShared).length;
    } else {
      return resources.filter(resource => resource.category === category.value).length;
    }
  };

  const hoverMenuItems = [
    { key: 'rename', label: '重命名' },
    { key: 'move', label: '移动到' },
    { key: 'pin-to-top', label: '置顶' },
    { type: 'divider' },
    { key: 'trash', danger: true, label: '移至垃圾箱' }
  ];

  const onHoverMenuClick = ({ key }) => {
    // 暂时提供交互反馈，后续可接入资源分类管理器
    switch (key) {
      case 'rename':
        message.info('重命名将在后续版本提供');
        break;
      case 'move':
        message.info('移动分类将在后续版本提供');
        break;
      case 'pin-to-top':
        message.success('置顶操作将在后续版本接入');
        break;
      case 'trash':
        message.warning('删除/移至垃圾箱将在后续版本提供');
        break;
      default:
        break;
    }
  };

  const renderTreeNodeTitle = (category) => {
    const isEmojiIcon = category.icon && category.icon.length <= 2;
    const IconComponent = isEmojiIcon ? null : (iconMap[category.icon] || FileTextOutlined);
    const showCount = false;
    const count = 0;
    const showActions = category.type === 'system' && !['all', 'starred', 'recent', 'shared'].includes(category.value);

    return (
      <div className={`category-item ${selectedCategory === category.value ? 'active' : ''}`} style={{ paddingLeft: 0 }}>
        {isEmojiIcon ? (
          <span className="category-icon">{category.icon}</span>
        ) : (
          <IconComponent className="category-icon" />
        )}
        <span className="category-label">{category.label}</span>
        {/* 去掉数字统计显示 */}
        {showActions && (
          <span className="category-actions">
            <Tooltip title="新增分类">
              <Button
                type="text"
                size="small"
                onClick={(e) => { e.stopPropagation(); message.info('新增分类将在后续版本提供'); }}
                icon={<PlusOutlined className="transparent-maintain-icon" />}
                aria-label="新增分类"
              />
            </Tooltip>
            <Dropdown
              trigger={["click"]}
              overlayClassName="side-more-menu"
              menu={{ items: hoverMenuItems, onClick: onHoverMenuClick }}
            >
              <Tooltip title="更多">
                <Button
                  type="text"
                  size="small"
                  onClick={(e) => { e.stopPropagation(); }}
                  icon={<EllipsisOutlined className="transparent-maintain-icon" />}
                  aria-label="更多操作"
                />
              </Tooltip>
            </Dropdown>
          </span>
        )}
      </div>
    );
  };

  // 资源分类配置数据
  const { resourceCategories, groupDefinitions, pinnedCategories } = useMemo(() => {
    // 基础资源分类
    const baseResourceCategories = categories || [];
    
    // 置顶分类
    const pinnedCategories = baseResourceCategories.filter(c => c.pinned === true);
    
    // 分组定义
    const groupDefinitions = [
      {
        key: 'group_content_type',
        title: '内容类型',
        icon: 'FolderOpenOutlined',
        childrenValues: ['documents', 'videos', 'images', 'audio', 'presentations'],
        groups: []
      },
      {
        key: 'group_subject',
        title: '学科分类',
        icon: 'BookOutlined',
        childrenValues: ['chinese', 'math', 'english', 'science', 'history', 'geography'],
        groups: []
      },
      {
        key: 'group_grade',
        title: '年级分类',
        icon: 'TeamOutlined',
        childrenValues: ['elementary', 'middle_school', 'high_school', 'university'],
        groups: []
      },
      {
        key: 'group_difficulty',
        title: '难度等级',
        icon: 'StarOutlined',
        childrenValues: ['beginner', 'intermediate', 'advanced', 'expert'],
        groups: []
      }
    ];
    
    return { resourceCategories: baseResourceCategories, groupDefinitions, pinnedCategories };
  }, [categories, configVersion]);

  const assignedValues = new Set();
  const buildGroupNode = (group, depth = 1) => {
    const catChildren = (group.childrenValues || [])
      .map(val => resourceCategories.find(c => c.value === val))
      .filter(Boolean)
      .map(cat => {
        assignedValues.add(cat.value);
        return { key: cat.value, title: renderTreeNodeTitle(cat), isLeaf: true };
      });
    
    const subGroupChildren = (group.groups || []).map(sub => buildGroupNode(sub, depth + 1));
    const isEmojiIcon = group.icon && group.icon.length <= 2;
    const GroupIconComponent = isEmojiIcon ? null : (iconMap[group.icon] || FolderOpenOutlined);
    
    return {
      key: group.key,
      title: (
        <span className="tree-group-title" style={{ fontWeight: 600, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
          {isEmojiIcon ? (
            <span className="category-icon">{group.icon}</span>
          ) : (
            <GroupIconComponent className="category-icon" />
          )}
          <span>{group.title}</span>
          <span className="category-actions">
            <Tooltip title="新增分类">
              <Button
                type="text"
                size="small"
                onClick={(e) => { e.stopPropagation(); message.info('新增一级分类将在后续版本提供'); }}
                icon={<PlusOutlined className="transparent-maintain-icon" />}
                aria-label="新增一级分类"
              />
            </Tooltip>
          </span>
        </span>
      ),
      selectable: false,
      children: [...catChildren, ...subGroupChildren]
    };
  };

  const treeData = groupDefinitions.map(g => buildGroupNode(g, 1));
  const pinnedValues = new Set(pinnedCategories.map(c => c.value));
  const restCategories = resourceCategories.filter(c => !assignedValues.has(c.value) && !pinnedValues.has(c.value));
  
  if (restCategories.length) {
    treeData.push({
      key: 'group_other',
      title: <span style={{ fontWeight: 600, color: '#6b7280' }}>其他</span>,
      selectable: false,
      children: restCategories.map(cat => ({ key: cat.value, title: renderTreeNodeTitle(cat), isLeaf: true }))
    });
  }

  // 让"资源分类"默认全部展开：受控 expandedKeys
  const [expandedKeys, setExpandedKeys] = useState([]);
  useEffect(() => {
    if (expandedKeys.length === 0 && Array.isArray(treeData) && treeData.length) {
      const collectKeys = (nodes) => nodes.flatMap(n => [n.key, ...(n.children ? collectKeys(n.children) : [])]);
      setExpandedKeys(collectKeys(treeData));
    }
  }, [treeData]);
  
  const onExpand = (keys) => setExpandedKeys(keys);

  const onSelect = (keys) => {
    const key = keys?.[0];
    if (key) {
      onCategoryChange?.(key);
    }
  };

  return (
    <Sider className="notes-sidebar resource-category-sidebar">
      <div className="sidebar-content">
        <div className="category-group" key="resource_categories_header">
          <div className="category-group-title">
            <span>资源分类</span>
            <span className="category-actions">
              <Tooltip title="新增分类">
                <Button
                  type="text"
                  size="small"
                  onClick={(e) => { e.stopPropagation(); message.info('新增分类将在后续版本提供'); }}
                  icon={<PlusOutlined />}
                  aria-label="新增分类"
                />
              </Tooltip>
            </span>
          </div>
        </div>
        <div className="sidebar-bottom">
          <Tree
            className="category-tree"
            showLine={false}
            showIcon={false}
            treeData={treeData}
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            onSelect={onSelect}
            expandedKeys={expandedKeys}
            onExpand={onExpand}
            blockNode
          />
        </div>
      </div>
    </Sider>
  );
};

export default ResourceCategorySidebar;